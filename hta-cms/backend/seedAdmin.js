/**
 * Seed script to create the first admin user
 * Run this once to create your initial admin account
 *
 * Usage: node seedAdmin.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const ADMIN_DATA = {
    name: 'HTA Admin',
    email: 'admin@htachurch.com',
    password: 'Admin2025!',
    role: 'admin',
    requirePasswordChange: true
};

async function seedAdmin() {
    try {
        console.log('🔌 Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Check if admin already exists
        const existingAdmin = await User.findOne({ email: ADMIN_DATA.email });
        if (existingAdmin) {
            console.log('⚠️  Admin user already exists!');
            console.log('Email:', existingAdmin.email);
            console.log('Name:', existingAdmin.name);
            console.log('\nIf you forgot your password, you can:');
            console.log('1. Delete this user from MongoDB Compass');
            console.log('2. Run this script again to create a new admin');
            process.exit(0);
        }

        // Create new admin user
        console.log('\n📝 Creating admin user...');
        const admin = new User(ADMIN_DATA);
        await admin.save();

        console.log('\n✅ Admin user created successfully!');
        console.log('\n📋 Login Credentials:');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('Email:    ', ADMIN_DATA.email);
        console.log('Password: ', ADMIN_DATA.password);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('\n⚠️  IMPORTANT: Change this password after first login!');
        console.log('\nYou can now log in to the admin dashboard at:');
        console.log('http://localhost:3000');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error creating admin user:', error.message);
        process.exit(1);
    }
}

// Run the seed function
seedAdmin();
