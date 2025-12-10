import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Login.css';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [keepLoggedIn, setKeepLoggedIn] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const result = await login(email, password);

        if (result.success) {
            navigate('/dashboard');
        } else {
            // Handle rate limiting errors with special message
            if (result.rateLimited) {
                const minutes = result.retryAfter || 15;
                setError(`Too many login attempts. Please wait ${minutes} minute${minutes !== 1 ? 's' : ''} before trying again.`);
            } else {
                setError(result.error);
            }
        }

        setLoading(false);
    };

    return (
        <div className="login-page">
            {/* Left Side - Login Form */}
            <div className="login-left">
                <button className="close-btn" onClick={() => window.location.href = '/'}>
                    &times;
                </button>

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

                    <h1>Welcome Back</h1>

                    <form className="login-form" onSubmit={handleSubmit}>
                        {error && (
                            <div className="error-alert">
                                <i className="fas fa-exclamation-circle"></i>
                                <span>{error}</span>
                            </div>
                        )}

                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="example@gmail.com"
                                required
                                autoFocus
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <div className="password-input-wrapper">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Password"
                                    required
                                />
                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() => setShowPassword(!showPassword)}
                                    aria-label="Toggle password visibility"
                                >
                                    <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                                </button>
                            </div>
                        </div>

                        <div className="form-options">
                            <label className="checkbox-label">
                                <input
                                    type="checkbox"
                                    checked={keepLoggedIn}
                                    onChange={(e) => setKeepLoggedIn(e.target.checked)}
                                />
                                <span>Keep me logged in</span>
                            </label>
                        </div>

                        <button type="submit" className="login-btn" disabled={loading}>
                            {loading ? (
                                <>
                                    <span className="spinner"></span>
                                    Logging in...
                                </>
                            ) : (
                                'Login'
                            )}
                        </button>
                    </form>
                </div>
            </div>

            {/* Right Side - Illustration */}
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

export default Login;