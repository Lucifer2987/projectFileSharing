import React, { useState } from "react";
import axios from "axios";

function SignUp({ onClose, apiVersion = "v1" }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Email Validation Function
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Basic email format validation
    return emailRegex.test(email);
  };

  // Password Validation Function
  const validatePassword = (password) => {
    return (
      password.length >= 8 &&
      /\d/.test(password) && // At least one number
      /[A-Z]/.test(password) && // At least one uppercase letter
      /[a-z]/.test(password) && // At least one lowercase letter
      /[@$!%*?&]/.test(password) // At least one special character
    );
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setMessage(""); // Clear any previous messages

    // Client-side validations
    if (!validateEmail(email)) {
      setMessage("Please enter a valid email address.");
      return;
    }

    if (!validatePassword(password)) {
      setMessage(
        "Password must be at least 8 characters long, include uppercase, lowercase, a number, and a special character."
      );
      return;
    }

    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    setLoading(true); // Set loading state
    try {
      // Use dynamic versioning for the endpoint
      const endpoint = `http://localhost:5000/auth/register`;


      const response = await axios.post(endpoint, { email, password });

      setMessage("🎉 Sign up successful! You can now log in.");
      setTimeout(() => {
        setLoading(false);
        onClose(); // Close the modal
      }, 1500);

      // Reset form fields
      setEmail("");
      setPassword("");
      setConfirmPassword("");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Error signing up. Please try again.";
      setMessage(errorMessage);
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <h2>Sign Up</h2>
      <form onSubmit={handleSignUp}>
        {/* Email Field */}
        <div className="input-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        {/* Password Field */}
        <div className="input-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {/* Confirm Password Field */}
        <div className="input-group">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            id="confirmPassword"
            type="password"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        {/* Submit Button */}
        <div className="button-group">
          <button type="submit" disabled={loading}>
            {loading ? "Signing up..." : "Sign Up"}
          </button>
        </div>

        {/* Feedback Message */}
        {message && (
          <p
            className={`message ${
              message.includes("successful") ? "success" : "error"
            }`}
          >
            {message}
          </p>
        )}
      </form>
    </div>
  );
}

export default SignUp;
