import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import './Login.css'; // Reuse Login styles

function ChangePassword() {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const navigate = useNavigate();
    const { user, login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Validation
        if (newPassword.length < 8) {
            setError('Password must be at least 8 characters');
            return;
        }

        if (!/[A-Z]/.test(newPassword)) {
            setError('Password must contain at least one uppercase letter');
            return;
        }

        if (!/[a-z]/.test(newPassword)) {
            setError('Password must contain at least one lowercase letter');
            return;
        }

        if (!/[0-9]/.test(newPassword)) {
            setError('Password must contain at least one number');
            return;
        }

        if (newPassword !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);

        try {
            // Change password using the API
            await authAPI.changePassword(currentPassword, newPassword);

            // Re-login with new password to refresh user data and clear requirePasswordChange flag
            const loginResult = await login(user.email, newPassword);

            if (loginResult.success) {
                // Password changed successfully and user data refreshed - redirect to dashboard
                navigate('/dashboard');
            } else {
                setError('Password changed but failed to log back in. Please log in again.');
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to change password. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            {/* Left Side - Password Change Form */}
            <div className="login-left">
                <div className="login-content">
                    <div className="logo">
                        <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect width="60" height="60" rx="12" fill="white"/>
                            <path d="M30 15L42 27L30 39L18 27L30 15Z" fill="#4361EE"/>
                        </svg>
                        <div className="logo-text">
                            <span className="logo-title">HTA Admin</span>
                            <span className="logo-subtitle">Harvest Temple Apostolic</span>
                        </div>
                    </div>

                    <h1>Change Your Password</h1>
                    <p className="subtitle" style={{ color: '#666', marginBottom: '2rem', fontSize: '0.95rem' }}>
                        For security, please change your password before continuing.
                        {user && user.name && ` Welcome, ${user.name}!`}
                    </p>

                    <form className="login-form" onSubmit={handleSubmit}>
                        {error && (
                            <div className="error-alert">
                                <i className="fas fa-exclamation-circle"></i>
                                <span>{error}</span>
                            </div>
                        )}

                        <div className="form-group">
                            <label htmlFor="currentPassword">Current Password</label>
                            <div className="password-input-wrapper">
                                <input
                                    type={showCurrentPassword ? "text" : "password"}
                                    id="currentPassword"
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    placeholder="Admin2025!"
                                    required
                                    autoFocus
                                />
                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                    aria-label="Toggle current password visibility"
                                >
                                    <i className={`fas ${showCurrentPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                                </button>
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="newPassword">New Password</label>
                            <div className="password-input-wrapper">
                                <input
                                    type={showNewPassword ? "text" : "password"}
                                    id="newPassword"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="Min 8 characters, 1 uppercase, 1 lowercase, 1 number"
                                    required
                                />
                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                    aria-label="Toggle new password visibility"
                                >
                                    <i className={`fas ${showNewPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                                </button>
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="confirmPassword">Confirm New Password</label>
                            <div className="password-input-wrapper">
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    id="confirmPassword"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Re-enter new password"
                                    required
                                />
                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    aria-label="Toggle confirm password visibility"
                                >
                                    <i className={`fas ${showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                                </button>
                            </div>
                        </div>

                        <button type="submit" className="login-btn" disabled={loading}>
                            {loading ? (
                                <>
                                    <span className="spinner"></span>
                                    Changing Password...
                                </>
                            ) : (
                                'Change Password'
                            )}
                        </button>

                        <p style={{ marginTop: '1rem', fontSize: '0.85rem', color: '#666', textAlign: 'center' }}>
                            <i className="fas fa-info-circle" style={{ marginRight: '0.5rem' }}></i>
                            Your password must be at least 8 characters and contain uppercase, lowercase, and numbers.
                        </p>
                    </form>
                </div>
            </div>

            {/* Right Side - Illustration (same as Login page) */}
            <div className="illustration-panel">
                <div className="illustration">
                    {/* Profile Cards Floating */}
                    <div className="profile-card card-1">
                        <div className="profile-lines">
                            <div className="line"></div>
                            <div className="line"></div>
                            <div className="line short"></div>
                        </div>
                        <div className="profile-avatar"></div>
                    </div>

                    <div className="profile-card card-2">
                        <div className="profile-avatar small"></div>
                        <div className="checkmark">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <circle cx="12" cy="12" r="12" fill="#4361EE"/>
                                <path d="M7 12L10.5 15.5L17 9" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                            </svg>
                        </div>
                    </div>

                    <div className="profile-card card-3">
                        <div className="profile-avatar tiny"></div>
                        <div className="profile-bar"></div>
                    </div>

                    {/* Main Character */}
                    <div className="character">
                        <div className="character-head"></div>
                        <div className="character-body"></div>
                        <div className="character-arm-left"></div>
                        <div className="character-arm-right"></div>
                        <div className="character-leg-left"></div>
                        <div className="character-leg-right"></div>
                    </div>

                    {/* Laptop */}
                    <div className="laptop">
                        <div className="laptop-screen"></div>
                        <div className="laptop-base"></div>
                    </div>

                    {/* Chair */}
                    <div className="chair">
                        <div className="chair-back"></div>
                        <div className="chair-seat"></div>
                        <div className="chair-leg"></div>
                    </div>

                    {/* Plant */}
                    <div className="plant">
                        <div className="pot"></div>
                        <div className="leaf leaf-1"></div>
                        <div className="leaf leaf-2"></div>
                        <div className="leaf leaf-3"></div>
                    </div>

                    {/* Decorative Circles */}
                    <div className="circle circle-1"></div>
                    <div className="circle circle-2"></div>
                    <div className="circle circle-3"></div>
                </div>
            </div>
        </div>
    );
}

export default ChangePassword;
