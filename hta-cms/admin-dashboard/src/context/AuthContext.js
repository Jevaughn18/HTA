import React, { createContext, useState, useContext, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState(localStorage.getItem('token'));

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await authAPI.getCurrentUser();
                setUser(response.data.user);
            } catch (error) {
                localStorage.removeItem('token');
                setToken(null);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        if (token) {
            checkAuth();
        } else {
            setLoading(false);
        }
    }, [token]);

    const login = async (email, password) => {
        try {
            const response = await authAPI.login(email, password);
            const { token, user } = response.data;

            localStorage.setItem('token', token);
            setToken(token);
            setUser(user);

            return { success: true };
        } catch (error) {
            const errorData = error.response?.data;

            // Handle rate limiting errors specially
            if (error.response?.status === 429) {
                const retryAfter = errorData?.retryAfter || 15; // Default to 15 minutes
                return {
                    success: false,
                    error: errorData?.error || 'Too many login attempts',
                    rateLimited: true,
                    retryAfter: retryAfter
                };
            }

            return {
                success: false,
                error: errorData?.error || 'Login failed'
            };
        }
    };

    const signup = async (name, email, password, signupCode) => {
        try {
            const response = await authAPI.signup(name, email, password, signupCode);
            const { token, user } = response.data;

            localStorage.setItem('token', token);
            setToken(token);
            setUser(user);

            return { success: true };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.error || 'Signup failed'
            };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
    };

    const value = {
        user,
        token,
        loading,
        login,
        signup,
        logout,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        requirePasswordChange: user?.requirePasswordChange || false
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
