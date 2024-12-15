import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

function Login({ onClose }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false); // Add loading state
  const { login } = useContext(AuthContext);

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

    setLoading(true); // Show loading indicator
    try {
      const credentials = { email, password };
      await login(credentials); // Attempt login via AuthContext
      setMessage("Login successful! Welcome back.");

      // Close the modal after a delay
      setTimeout(() => {
        setMessage("");
        setLoading(false); // Reset loading state
        onClose();
      }, 1500);
    } catch (error) {
      setLoading(false); // Reset loading state
      setMessage("Invalid email or password. Please try again.");
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div className="input-group">
          <input
            type="email"
            placeholder="Your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="input-group">
          <input
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
