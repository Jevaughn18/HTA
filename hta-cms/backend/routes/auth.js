const express = require('express');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const { auth, adminOnly } = require('../middleware/auth');
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

            // Add small delay to mitigate timing attacks
            await new Promise(resolve => setTimeout(resolve, Math.random() * 200 + 100));

            // Find user
            const user = await User.findOne({ email, isActive: true });
            if (!user) {
                return res.status(401).json({ error: 'Invalid email or password' });
            }

            // Check password
            const isMatch = await user.comparePassword(password);
            if (!isMatch) {
                return res.status(401).json({ error: 'Invalid email or password' });
            }

            // Validate JWT_SECRET is configured
            if (!process.env.JWT_SECRET) {
                console.error('FATAL: JWT_SECRET not configured');
                return res.status(500).json({ error: 'Server configuration error' });
            }

            // Generate JWT token with 1 hour expiry
            const token = jwt.sign(
                { userId: user._id },
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            );

            res.json({
                token,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    requirePasswordChange: user.requirePasswordChange || false
                }
            });
        } catch (error) {
            res.status(500).json({ error: 'Login failed' });
        }
    }
);

// Get current user
router.get('/me', auth, async (req, res) => {
    res.json({
        user: {
            id: req.user._id,
            name: req.user.name,
            email: req.user.email,
            role: req.user.role,
            requirePasswordChange: req.user.requirePasswordChange || false
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
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});

// Delete user (admin only)
router.delete('/users/:id',
    auth,
    adminOnly,
    [
        param('id').isMongoId().withMessage('Invalid user ID')
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            // Prevent admin from deleting their own account
            if (req.params.id === req.user._id.toString()) {
                return res.status(400).json({ error: 'Cannot delete your own account' });
            }

            const user = await User.findByIdAndDelete(req.params.id);
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            res.json({ message: 'User deleted successfully' });
        } catch (error) {
            res.status(500).json({ error: 'Failed to delete user' });
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
