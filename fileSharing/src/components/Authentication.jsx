import React, { useState, useEffect } from 'react';
import { loginUser, registerUser, checkAuthStatus as checkAuth } from '../api';
import './Authentication.css';

const Authentication = () => {
    const [showLogin, setShowLogin] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userEmail, setUserEmail] = useState('');
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        email: ''
    });

    const checkAuthStatus = async () => {
        try {
            const response = await checkAuth();
            console.log('Auth status response:', response);
            if (response.logged_in) {
                setIsLoggedIn(true);
                setUserEmail(response.email);
            } else {
                setIsLoggedIn(false);
                setUserEmail('');
                localStorage.removeItem('token');
            }
        } catch (error) {
            console.error('Error checking auth status:', error);
            setIsLoggedIn(false);
            setUserEmail('');
            localStorage.removeItem('token');
        }
    };

    useEffect(() => {
        checkAuthStatus();
    }, []);

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            console.log('Attempting login with:', formData.email);
            const response = await loginUser(formData.email, formData.password);
            console.log('Login response:', response);
            
            if (response.token) {
                localStorage.setItem('token', response.token);
                setIsLoggedIn(true);
                setUserEmail(formData.email);
                setFormData({ username: '', password: '', email: '' });
                await checkAuthStatus();
            }
        } catch (error) {
            console.error('Login error:', error);
            alert('Login failed: ' + (error.response?.data?.message || 'Unknown error'));
        }
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        try {
            const response = await registerUser(formData);
            console.log('Signup response:', response);
            if (response.message.includes('success')) {
                alert('Signup successful! Please login.');
                setShowLogin(true);
                setFormData({ username: '', password: '', email: '' });
            }
        } catch (error) {
            console.error('Signup error:', error);
            alert(error.response?.data?.message || 'Signup failed');
        }
    };

    const handleLogout = async () => {
        try {
            localStorage.removeItem('token');
            setIsLoggedIn(false);
            setUserEmail('');
            setFormData({ username: '', password: '', email: '' });
            await checkAuthStatus();
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    // Render logout button if logged in
    if (isLoggedIn) {
        console.log('User is logged in, showing logout button');
        return (
            <div className="auth-container">
                <h3>Welcome, {userEmail}!</h3>
                <button onClick={handleLogout} className="auth-button">Logout</button>
            </div>
        );
    }

    // Render login/signup forms if not logged in
    console.log('User is not logged in, showing login/signup forms');
    return (
        <div className="auth-container">
            {showLogin ? (
                <>
                    <h3>Login</h3>
                    <form onSubmit={handleLogin} className="auth-form">
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="auth-input"
                            required
                        />
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleInputChange}
                            className="auth-input"
                            required
                        />
                        <button type="submit" className="auth-button">Login</button>
                    </form>
                    <p>
                        Don't have an account?{' '}
                        <button 
                            onClick={() => setShowLogin(false)}
                            className="auth-switch-button"
                        >
                            Sign Up
                        </button>
                    </p>
                </>
            ) : (
                <>
                    <h3>Sign Up</h3>
                    <form onSubmit={handleSignup} className="auth-form">
                        <input
                            type="text"
                            name="username"
                            placeholder="Username"
                            value={formData.username}
                            onChange={handleInputChange}
                            className="auth-input"
                            required
                        />
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="auth-input"
                            required
                        />
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleInputChange}
                            className="auth-input"
                            required
                        />
                        <button type="submit" className="auth-button">Sign Up</button>
                    </form>
                    <p>
                        Already have an account?{' '}
                        <button 
                            onClick={() => setShowLogin(true)}
                            className="auth-switch-button"
                        >
                            Login
                        </button>
                    </p>
                </>
            )}
        </div>
    );
};

export default Authentication;