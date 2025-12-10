import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import ChangePassword from './pages/ChangePassword';
import Dashboard from './pages/Dashboard';
import './App.css';

// Protected Route Component - redirects to change-password if needed
function ProtectedRoute({ children }) {
  const { isAuthenticated, loading, requirePasswordChange } = useAuth();

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '1.2rem',
        color: '#666'
      }}>
        Loading...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // If user needs to change password, redirect to change-password page
  if (requirePasswordChange) {
    return <Navigate to="/change-password" replace />;
  }

  return children;
}

// Password Change Route - only accessible if logged in and password change required
function PasswordChangeRoute({ children }) {
  const { isAuthenticated, requirePasswordChange, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '1.2rem',
        color: '#666'
      }}>
        Loading...
      </div>
    );
  }

  // Must be logged in to change password
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // If password already changed, redirect to dashboard
  if (!requirePasswordChange) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route
            path="/change-password"
            element={
              <PasswordChangeRoute>
                <ChangePassword />
              </PasswordChangeRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          {/* Removed: /signup and /forgot-password routes for security */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
