import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { authAPI } from '../services/api';
import './ForgotPassword.css';

function ForgotPassword() {
    const [step, setStep] = useState(1); // 1 = enter email, 2 = enter code & new password
    const [email, setEmail] = useState('');
    const [resetCode, setResetCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const handleRequestReset = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        try {
            await authAPI.forgotPassword(email);
            setSuccess('Reset code sent! Check your email.');
            setStep(2);
        } catch (error) {
            setError(error.response?.data?.error || 'Failed to send reset code');
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (newPassword !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (newPassword.length < 8) {
            setError('Password must be at least 8 characters');
            return;
        }

        setLoading(true);

        try {
            await authAPI.resetPassword(email, resetCode, newPassword);
            setSuccess('Password reset successful! You can now log in with your new password.');
            setTimeout(() => {
                window.location.href = '/';
            }, 2000);
        } catch (error) {
            setError(error.response?.data?.error || 'Failed to reset password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="forgot-password-container">
            <div className="forgot-password-card">
                <div className="forgot-password-header">
                    <h1>Reset Password</h1>
                    <p>{step === 1 ? 'Enter your email to receive a reset code' : 'Enter reset code and new password'}</p>
                </div>

                {step === 1 ? (
                    <form onSubmit={handleRequestReset} className="forgot-password-form">
                        {error && <div className="error-message">{error}</div>}
                        {success && <div className="success-message">{success}</div>}

                        <div className="form-group">
                            <label htmlFor="email">Email Address</label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email"
                                required
                                autoFocus
                            />
                        </div>

                        <button type="submit" className="reset-button" disabled={loading}>
                            {loading ? 'Sending...' : 'Send Reset Code'}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleResetPassword} className="forgot-password-form">
                        {error && <div className="error-message">{error}</div>}
                        {success && <div className="success-message">{success}</div>}

                        <div className="form-group">
                            <label htmlFor="resetCode">Reset Code</label>
                            <input
                                type="text"
                                id="resetCode"
                                value={resetCode}
                                onChange={(e) => setResetCode(e.target.value)}
                                placeholder="Enter 6-digit code"
                                required
                                autoFocus
                            />
                            <small className="hint">Check your email for the code (valid for 15 minutes)</small>
                        </div>

                        <div className="form-group">
                            <label htmlFor="newPassword">New Password</label>
                            <input
                                type="password"
                                id="newPassword"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="Enter new password (min 8 characters)"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="confirmPassword">Confirm New Password</label>
                            <input
                                type="password"
                                id="confirmPassword"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Confirm new password"
                                required
                            />
                        </div>

                        <button type="submit" className="reset-button" disabled={loading}>
                            {loading ? 'Resetting...' : 'Reset Password'}
                        </button>

                        <button
                            type="button"
                            className="back-button"
                            onClick={() => setStep(1)}
                        >
                            Request New Code
                        </button>
                    </form>
                )}

                <div className="forgot-password-footer">
                    <p>Remember your password? <Link to="/">Sign in</Link></p>
                </div>
            </div>
        </div>
    );
}

export default ForgotPassword;
