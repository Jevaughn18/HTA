#!/bin/bash

# HTA CMS Quick Start Script
# This script starts both the backend API and admin dashboard

echo "🚀 Starting HTA CMS..."
echo ""

# Check if we're in the right directory
if [ ! -d "backend" ] || [ ! -d "admin-dashboard" ]; then
    echo "❌ Error: Please run this script from the hta-cms directory"
    echo "   cd /Users/jevaughnstewart/HTA/hta-cms"
    exit 1
fi

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Stopping servers..."
    kill $BACKEND_PID $DASHBOARD_PID 2>/dev/null
    exit
}

trap cleanup INT TERM

# Start backend server
echo "📡 Starting Backend API on port 5001..."
cd backend
node server.js &
BACKEND_PID=$!
cd ..

# Wait a bit for backend to start
sleep 3

# Check if backend started successfully
if ! curl -s http://localhost:5001/api/content/home > /dev/null; then
    echo "❌ Backend failed to start!"
    kill $BACKEND_PID 2>/dev/null
    exit 1
fi

echo "✅ Backend API running on http://localhost:5001"
echo ""

# Start admin dashboard
echo "🎨 Starting Admin Dashboard on port 3000..."
cd admin-dashboard
npm start &
DASHBOARD_PID=$!
cd ..

echo ""
echo "✅ CMS Started Successfully!"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🌐 Backend API:       http://localhost:5001"
echo "🎨 Admin Dashboard:   http://localhost:3000"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📝 Login Credentials:"
echo "   Email:    admin@htachurch.com"
echo "   Password: Admin2025!"
echo ""
echo "Press Ctrl+C to stop all servers"
echo ""

# Wait for background processes
wait
