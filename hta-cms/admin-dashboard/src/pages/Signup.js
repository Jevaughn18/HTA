import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Signup.css';

function Signup() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [signupCode, setSignupCode] = useState('');
    const [error, setError] = useState('');
    const { signup } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Validation
        if (!name || !email || !password || !confirmPassword || !signupCode) {
            setError('All fields are required');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        // Call signup
        const result = await signup(name, email, password, signupCode);
        if (result.success) {
            navigate('/dashboard');
        } else {
            setError(result.error);
        }
    };

    return (
        <div className="signup-container">
            <div className="signup-card">
                <div className="signup-header">
                    <h1>Join HTA Tech Team</h1>
                    <p>Create your account to manage church content</p>
                </div>

                <form onSubmit={handleSubmit} className="signup-form">
                    {error && <div className="error-message">{error}</div>}

                    <div className="form-group">
                        <label htmlFor="name">Full Name</label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter your full name"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Email Address</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Create a password (min 6 characters)"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="confirmPassword">Confirm Password</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Confirm your password"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="signupCode">Signup Code</label>
                        <input
                            type="text"
                            id="signupCode"
                            value={signupCode}
                            onChange={(e) => setSignupCode(e.target.value)}
                            placeholder="Enter the tech team signup code"
                            required
                        />
                        <small className="hint">Ask your admin for the signup code</small>
                    </div>

                    <button type="submit" className="signup-button">
                        Create Account
                    </button>
                </form>

                <div className="signup-footer">
                    <p>Already have an account? <Link to="/">Sign in</Link></p>
                </div>
            </div>
        </div>
    );
}

export default Signup;
