import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

function Login({ onClose }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const { login, loading } = useContext(AuthContext);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!email || !password) {
      setMessage("Please fill in all fields.");
      return;
    }

    if (!validateEmail(email)) {
      setMessage("Please enter a valid email address.");
      return;
    }

    try {
      console.log('Attempting login with:', email);
      const result = await login({ email, password });
      console.log('Login result:', result);
      
      if (result.success) {
        setMessage("Login successful!");
        // Clear form
        setEmail("");
        setPassword("");
        setTimeout(() => {
          onClose();
        }, 1500);
      } else {
        // Show specific error message from the backend
        setMessage(result.error || "Login failed. Please check your credentials.");
      }
    } catch (error) {
      console.error("Login error:", error);
      if (error.response?.status === 0) {
        setMessage("Network error. Please check if the backend server is running.");
      } else if (error.response?.status === 401) {
        setMessage("Invalid email or password. Please try again.");
      } else {
        setMessage(error.response?.data?.error || "An unexpected error occurred. Please try again.");
      }
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div className="input-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            placeholder="Your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="input-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            placeholder="Your Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {message && (
          <div className={`message ${message.includes('successful') ? 'success' : 'error'}`}>
            {message}
          </div>
        )}
        <div className="button-group">
          <button type="submit" disabled={loading}>
            Login
          </button>
        </div>
      </form>
    </div>
  );
}

export default Login;