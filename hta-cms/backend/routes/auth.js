const express = require('express');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const { auth, adminOnly, canDeleteAdmins, superAdminOnly } = require('../middleware/auth');
const { body, param, validationResult } = require('express-validator');

const router = express.Router();

// DISABLED: Self-registration removed for security
// Only admins can create new user accounts via /register endpoint

// Register new user (admin only)
router.post('/register',
    auth,
    adminOnly,
    [
        body('name').trim().notEmpty().withMessage('Name is required').isLength({ max: 100 }),
        body('email').trim().isEmail().withMessage('Valid email is required').normalizeEmail(),
        body('role').optional().isIn(['admin', 'editor']).withMessage('Role must be admin or editor')
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const { name, email, role } = req.body;

            // Check if user exists
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ error: 'Email already registered' });
            }

            // Generate secure random temporary password
            const tempPassword = crypto.randomBytes(8).toString('hex') + 'A1!';

            // Create new user with temporary password
            const user = new User({
                name,
                email,
                password: tempPassword,
                role: role || 'editor',
                requirePasswordChange: true // Force password change on first login
            });
            await user.save();

            res.status(201).json({
                message: 'User created successfully. Temporary password provided - user must change on first login.',
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                },
                temporaryPassword: tempPassword // Return for admin to share with new user
            });
        } catch (error) {
            res.status(500).json({ error: 'Failed to create user' });
        }
    }
);

// Login attempt tracking (in-memory store)
const loginAttempts = new Map();
const MAX_LOGIN_ATTEMPTS = 5;
const ATTEMPT_WINDOW_MS = 1 * 60 * 1000; // 1 minute

// Clean up old entries periodically
setInterval(() => {
    const now = Date.now();
    for (const [ip, data] of loginAttempts.entries()) {
        if (now - data.firstAttempt > ATTEMPT_WINDOW_MS) {
            loginAttempts.delete(ip);
        }
    }
}, 60000); // Clean every minute

// Login
router.post('/login',
    [
        body('email').trim().isEmail().withMessage('Valid email is required').normalizeEmail(),
        body('password').notEmpty().withMessage('Password is required')
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const { email, password } = req.body;
            const clientIp = req.ip || req.connection.remoteAddress;

            // Check login attempts
            const attemptData = loginAttempts.get(clientIp);
            const now = Date.now();

            if (attemptData) {
                // Reset if window has passed
                if (now - attemptData.firstAttempt > ATTEMPT_WINDOW_MS) {
                    loginAttempts.delete(clientIp);
                } else if (attemptData.count >= MAX_LOGIN_ATTEMPTS) {
                    // Too many attempts
                    return res.status(429).json({
                        error: 'Too many login attempts. Please wait 1 minute before trying again.',
                        retryAfter: 1,
                        rateLimited: true
                    });
                }
            }

            // Add small delay to mitigate timing attacks
            await new Promise(resolve => setTimeout(resolve, Math.random() * 200 + 100));

            // Find user
            const user = await User.findOne({ email, isActive: true });
            if (!user) {
                // Track failed attempt
                const current = loginAttempts.get(clientIp) || { count: 0, firstAttempt: now };
                current.count++;
                if (current.count === 1) current.firstAttempt = now;
                loginAttempts.set(clientIp, current);

                const remainingAttempts = MAX_LOGIN_ATTEMPTS - current.count;
                return res.status(401).json({
                    error: 'Invalid email or password',
                    remainingAttempts: Math.max(0, remainingAttempts)
                });
            }

            // Check password
            const isMatch = await user.comparePassword(password);
            if (!isMatch) {
                // Track failed attempt
                const current = loginAttempts.get(clientIp) || { count: 0, firstAttempt: now };
                current.count++;
                if (current.count === 1) current.firstAttempt = now;
                loginAttempts.set(clientIp, current);

                const remainingAttempts = MAX_LOGIN_ATTEMPTS - current.count;
                return res.status(401).json({
                    error: 'Invalid email or password',
                    remainingAttempts: Math.max(0, remainingAttempts)
                });
            }

            // Validate JWT_SECRET is configured
            if (!process.env.JWT_SECRET) {
                console.error('FATAL: JWT_SECRET not configured');
                return res.status(500).json({ error: 'Server configuration error' });
            }

            // Successful login - clear attempts
            loginAttempts.delete(clientIp);

            // Generate JWT token with 1 hour expiry
            const token = jwt.sign(
                { userId: user._id },
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            );

            const isSuperAdmin = user.email.trim().toLowerCase() === 'admin@htachurch.com';
            res.json({
                token,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    requirePasswordChange: user.requirePasswordChange || false,
                    permissions: {
                        canDeleteAdmins: isSuperAdmin || (user.permissions?.canDeleteAdmins === true),
                        canGrantAdminDelete: isSuperAdmin,
                        isSuperAdmin: isSuperAdmin
                    }
                }
            });
        } catch (error) {
            res.status(500).json({ error: 'Login failed' });
        }
    }
);

// Get current user
router.get('/me', auth, async (req, res) => {
    const isSuperAdmin = req.user.email.trim().toLowerCase() === 'admin@htachurch.com';
    res.json({
        user: {
            id: req.user._id,
            name: req.user.name,
            email: req.user.email,
            role: req.user.role,
            requirePasswordChange: req.user.requirePasswordChange || false,
            permissions: {
                canDeleteAdmins: isSuperAdmin || (req.user.permissions?.canDeleteAdmins === true),
                canGrantAdminDelete: isSuperAdmin,
                isSuperAdmin: isSuperAdmin
            }
        }
    });
});

// Change password (authenticated users only)
router.post('/change-password', auth, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ error: 'Current password and new password are required' });
        }

        // Password validation
        if (newPassword.length < 8) {
            return res.status(400).json({ error: 'Password must be at least 8 characters' });
        }

        if (!/[A-Z]/.test(newPassword)) {
            return res.status(400).json({ error: 'Password must contain at least one uppercase letter' });
        }

        if (!/[a-z]/.test(newPassword)) {
            return res.status(400).json({ error: 'Password must contain at least one lowercase letter' });
        }

        if (!/[0-9]/.test(newPassword)) {
            return res.status(400).json({ error: 'Password must contain at least one number' });
        }

        // Verify current password
        const isMatch = await req.user.comparePassword(currentPassword);
        if (!isMatch) {
            return res.status(400).json({ error: 'Current password is incorrect' });
        }

        // Update password and clear requirePasswordChange flag
        req.user.password = newPassword;
        req.user.requirePasswordChange = false;
        await req.user.save();

        res.json({ message: 'Password changed successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to change password' });
    }
});

// Get all users (admin only)
router.get('/users', auth, adminOnly, async (req, res) => {
    try {
        const users = await User.find({}).select('-password');

        // Add computed permissions to each user
        const usersWithPermissions = users.map(user => {
            const isSuperAdmin = user.email === 'admin@htachurch.com';
            return {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                isActive: user.isActive,
                requirePasswordChange: user.requirePasswordChange,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
                permissions: {
                    canDeleteAdmins: isSuperAdmin || (user.permissions?.canDeleteAdmins === true),
                    canGrantAdminDelete: isSuperAdmin,
                    isSuperAdmin: isSuperAdmin
                }
            };
        });

        res.json(usersWithPermissions);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});

// Delete user
// Note: Deleting admin accounts requires special permission
router.delete('/users/:id',
    auth,
    [
        param('id').isMongoId().withMessage('Invalid user ID')
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            // Prevent user from deleting their own account
            if (req.params.id === req.user._id.toString()) {
                return res.status(400).json({ error: 'Cannot delete your own account' });
            }

            // Find the user to be deleted
            const userToDelete = await User.findById(req.params.id);
            if (!userToDelete) {
                return res.status(404).json({ error: 'User not found' });
            }

            // Check if trying to delete an admin
            if (userToDelete.role === 'admin') {
                // Only super admin or admins with canDeleteAdmins permission can delete admins
                const isSuperAdmin = req.user.email.trim().toLowerCase() === 'admin@htachurch.com';
                const hasPermission = req.user.permissions?.canDeleteAdmins === true;

                if (!isSuperAdmin && !hasPermission) {
                    return res.status(403).json({
                        error: 'Only the super admin (admin@htachurch.com) or admins with delete permissions can delete admin accounts'
                    });
                }

                // Prevent deleting the super admin account
                if (userToDelete.email.trim().toLowerCase() === 'admin@htachurch.com') {
                    return res.status(403).json({
                        error: 'Cannot delete the super admin account (admin@htachurch.com)'
                    });
                }
            } else {
                // Regular admins can delete editors
                if (req.user.role !== 'admin') {
                    return res.status(403).json({ error: 'Admin access required' });
                }
            }

            await User.findByIdAndDelete(req.params.id);
            res.json({
                message: 'User deleted successfully',
                deletedUser: {
                    name: userToDelete.name,
                    email: userToDelete.email,
                    role: userToDelete.role
                }
            });
        } catch (error) {
            res.status(500).json({ error: 'Failed to delete user' });
        }
    }
);

// Grant admin deletion permission (super admin only)
router.patch('/users/:id/permissions',
    auth,
    superAdminOnly,
    [
        param('id').isMongoId().withMessage('Invalid user ID'),
        body('canDeleteAdmins').isBoolean().withMessage('canDeleteAdmins must be a boolean')
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const user = await User.findById(req.params.id);
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            // Can only grant permissions to admins
            if (user.role !== 'admin') {
                return res.status(400).json({
                    error: 'Can only grant admin deletion permissions to admin users'
                });
            }

            // Cannot modify super admin permissions
            if (user.email.trim().toLowerCase() === 'admin@htachurch.com') {
                return res.status(400).json({
                    error: 'Cannot modify super admin permissions'
                });
            }

            // Update permissions
            user.permissions = user.permissions || {};
            user.permissions.canDeleteAdmins = req.body.canDeleteAdmins;
            await user.save();

            res.json({
                message: `Admin deletion permission ${req.body.canDeleteAdmins ? 'granted to' : 'revoked from'} ${user.name}`,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    permissions: user.permissions
                }
            });
        } catch (error) {
            res.status(500).json({ error: 'Failed to update permissions' });
        }
    }
);

// DISABLED: Password reset via email not used
// Users only reset passwords on first login via /change-password
// If forgot password functionality is needed in the future, uncomment and implement email sending

/*
router.post('/forgot-password',
    [
        body('email').trim().isEmail().withMessage('Valid email is required').normalizeEmail()
    ],
    async (req, res) => {
        // Disabled - password resets only happen on first login
        res.status(404).json({ error: 'Password reset via email is not available. Please contact an administrator.' });
    }
);
*/

// DISABLED: Password reset via email not used
// Users only reset passwords on first login via /change-password

/*
router.post('/reset-password',
    async (req, res) => {
        // Disabled - password resets only happen on first login
        res.status(404).json({ error: 'Password reset via email is not available. Please contact an administrator.' });
    }
);
*/

module.exports = router;
