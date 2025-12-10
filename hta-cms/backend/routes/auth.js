const express = require('express');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const { auth, adminOnly } = require('../middleware/auth');

const router = express.Router();

// DISABLED: Self-registration removed for security
// Only admins can create new user accounts via /register endpoint

// Register new user (admin only)
router.post('/register', auth, adminOnly, async (req, res) => {
    try {
        const { name, email, role } = req.body;

        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already registered' });
        }

        // Create new user with default password
        const user = new User({
            name,
            email,
            password: 'Admin2025!', // Default password
            role: role || 'editor',
            requirePasswordChange: true // Force password change on first login
        });
        await user.save();

        res.status(201).json({
            message: 'User created successfully',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            },
            temporaryPassword: 'Admin2025!' // Return for admin to share
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create user' });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

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

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET || 'hta-cms-secret-key',
            { expiresIn: '7d' }
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
});

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
router.delete('/users/:id', auth, adminOnly, async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete user' });
    }
});

// Request password reset
router.post('/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email, isActive: true });
        if (!user) {
            // Don't reveal if email exists for security
            return res.json({ message: 'If that email exists, a reset code has been sent' });
        }

        // Generate reset token (6-digit code)
        const resetToken = Math.floor(100000 + Math.random() * 900000).toString();

        // Save hashed token and expiry (valid for 15 minutes)
        user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        user.resetPasswordExpires = Date.now() + 15 * 60 * 1000; // 15 minutes
        await user.save();

        // In a real app, you'd send this via email
        // For now, return it in the response (DEV ONLY!)
        res.json({
            message: 'Reset code generated',
            resetCode: resetToken, // REMOVE THIS IN PRODUCTION!
            email: user.email
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to process request' });
    }
});

// Reset password with token
router.post('/reset-password', async (req, res) => {
    try {
        const { email, resetCode, newPassword } = req.body;

        if (!email || !resetCode || !newPassword) {
            return res.status(400).json({ error: 'Email, reset code, and new password are required' });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ error: 'Password must be at least 6 characters' });
        }

        // Hash the provided reset code to compare with stored hash
        const hashedToken = crypto.createHash('sha256').update(resetCode).digest('hex');

        // Find user with matching email, token, and unexpired token
        const user = await User.findOne({
            email,
            resetPasswordToken: hashedToken,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ error: 'Invalid or expired reset code' });
        }

        // Update password
        user.password = newPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        res.json({ message: 'Password reset successful' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to reset password' });
    }
});

module.exports = router;
