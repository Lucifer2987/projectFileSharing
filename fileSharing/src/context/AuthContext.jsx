import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const checkAuthStatus = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setIsLoggedIn(false);
                setUser(null);
                setLoading(false);
                return;
            }

            const response = await axios.get('http://127.0.0.1:5000/check_auth', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.data.isAuthenticated) {
                setIsLoggedIn(true);
                setUser(response.data.user);
            } else {
                setIsLoggedIn(false);
                setUser(null);
                localStorage.removeItem('token');
            }
        } catch (error) {
            console.error('Auth check error:', error);
            setIsLoggedIn(false);
            setUser(null);
            localStorage.removeItem('token');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        checkAuthStatus();
    }, []);

    const login = async (credentials) => {
        try {
            console.log('Attempting login with:', credentials.email);
            const response = await axios.post(
                'http://127.0.0.1:5000/auth/login',
                credentials,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    withCredentials: true
                }
            );

            console.log('Login response:', response.data);

            if (response.data && response.data.token) {
                localStorage.setItem('token', response.data.token);
                setIsLoggedIn(true);
                setUser({ email: credentials.email });
                return { success: true };
            } else {
                console.error('No token in response:', response.data);
                return { 
                    success: false, 
                    error: response.data?.error || 'Authentication failed. Please try again.' 
                };
            }
        } catch (error) {
            console.error('Login error:', error.response?.data || error.message);
            if (error.response?.status === 401) {
                return {
                    success: false,
                    error: error.response.data?.error || 'Invalid email or password'
                };
            }
            if (error.response?.status === 0) {
                return {
                    success: false,
                    error: 'Network error. Please check if the backend server is running.'
                };
            }
            return {
                success: false,
                error: error.response?.data?.error || 'Login failed. Please try again.'
            };
        }
    };

    const logout = async () => {
        try {
            const token = localStorage.getItem('token');
            if (token) {
                await axios.post('http://127.0.0.1:5000/auth/logout', {}, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
            }
            localStorage.removeItem('token');
            setIsLoggedIn(false);
            setUser(null);
            return { success: true, message: 'Logged out successfully' };
        } catch (error) {
            console.error('Logout error:', error);
            localStorage.removeItem('token');
            setIsLoggedIn(false);
            setUser(null);
            return { success: false, error: 'Failed to log out' };
        }
    };

    const value = {
        isLoggedIn,
        user,
        login,
        logout,
        loading,
        checkAuthStatus
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};