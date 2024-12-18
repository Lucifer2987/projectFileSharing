import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

function Login({ onClose }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const { login, loading } = useContext(AuthContext); // Use the login function from AuthContext

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Basic email format validation
    return emailRegex.test(email);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage(""); // Clear previous messages

    // Client-side validation
    if (!email || !password) {
      setMessage("Please fill in all fields.");
      return;
    }

    if (!validateEmail(email)) {
      setMessage("Please enter a valid email address.");
      return;
    }

    try {
      const credentials = { email, password };
      await login(credentials); // Call login from AuthContext

      setMessage("Login successful! Welcome back.");
      setTimeout(() => {
        setMessage("");
        onClose(); // Close the modal
      }, 1500);
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Invalid email or password.";
      setMessage(errorMessage);
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
        <div className="button-group">
          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </div>
        {message && (
          <p className={`message ${loading ? "info" : "error"}`}>{message}</p>
        )}
      </form>
    </div>
  );
}

export default Login;