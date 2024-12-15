import React, { useState } from "react";
import axios from "axios";

function SignUp({ onClose }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false); // Add loading state

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Basic email format validation
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    // Ensure password is at least 8 characters long and includes a mix of letters and numbers
    return password.length >= 8 && /\d/.test(password) && /[A-Za-z]/.test(password);
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setMessage(""); // Clear any previous messages

    // Client-side validation
    if (!validateEmail(email)) {
      setMessage("Please enter a valid email address.");
      return;
    }

    if (!validatePassword(password)) {
      setMessage("Password must be at least 8 characters long and include letters and numbers.");
      return;
    }

    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    setLoading(true); // Show loading indicator
    try {
      // API call to backend for signing up
      const response = await axios.post("http://localhost:5000/api/auth/signup", { email, password });
      setMessage("Sign up successful! You can now log in.");
      
      // Close the modal after success
      setTimeout(() => {
        setLoading(false);
        onClose();
      }, 1500);
    } catch (error) {
      // Handle API errors
      setMessage(error.response?.data?.message || "Error signing up. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <h2>Sign Up</h2>
      <form onSubmit={handleSignUp}>
        <div className="input-group">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="input-group">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="input-group">
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <div className="button-group">
          <button type="submit" disabled={loading}>
            {loading ? "Signing up..." : "Sign Up"}
          </button>
        </div>
        {message && <p className={`message ${loading ? "info" : "error"}`}>{message}</p>}
      </form>
    </div>
  );
}

export default SignUp;
