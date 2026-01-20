const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            throw new Error();
        }

        // Validate JWT_SECRET is configured
        if (!process.env.JWT_SECRET) {
            console.error('FATAL: JWT_SECRET environment variable is not set');
            return res.status(500).json({ error: 'Server configuration error' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findOne({ _id: decoded.userId, isActive: true });

        if (!user) {
            throw new Error();
        }

        req.user = user;
        req.token = token;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Please authenticate' });
    }
};

// Admin only middleware
const adminOnly = async (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Admin access required' });
    }
    next();
};

// Super admin check - only admin@htachurch.com or admins with canDeleteAdmins permission
const canDeleteAdmins = async (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Admin access required' });
    }

    // Check if user is super admin or has permission
    const isSuperAdmin = req.user.email === 'admin@htachurch.com';
    const hasPermission = req.user.permissions?.canDeleteAdmins === true;

    if (!isSuperAdmin && !hasPermission) {
        return res.status(403).json({
            error: 'Only the super admin (admin@htachurch.com) or admins with delete permissions can perform this action'
        });
    }

    // Store if user is super admin for later use
    req.isSuperAdmin = isSuperAdmin;
    next();
};

// Only super admin can grant permissions
const superAdminOnly = async (req, res, next) => {
    if (req.user.email !== 'admin@htachurch.com') {
        return res.status(403).json({
            error: 'Only the super admin (admin@htachurch.com) can grant admin deletion permissions'
        });
    }
    next();
};

module.exports = { auth, adminOnly, canDeleteAdmins, superAdminOnly };
