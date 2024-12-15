import React, { useState, useEffect, useRef } from "react";

function LoginModal({ isOpen, onClose }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const modalRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      modalRef.current?.focus(); // Focus on modal when it opens
    }
  }, [isOpen]);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Handle Login Form Submission
  const handleLogin = (e) => {
    e.preventDefault();

    // Simple email validation
    if (!validateEmail(email)) {
      setMessage("Please enter a valid email address.");
      return;
    }

    // Simulated login (Replace with API call in the future)
    if (email === "test@example.com" && password === "password") {
      setMessage("Login successful! Welcome back.");
      setTimeout(() => {
        onClose();
        setMessage("");
      }, 1500);
    } else {
      setMessage("Invalid email or password. Please try again.");
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="modal"
      role="dialog"
      aria-hidden={!isOpen}
      aria-labelledby="login-modal-title"
      aria-describedby="login-modal-desc"
      ref={modalRef}
      tabIndex={-1}
    >
      <div className="modal-content">
        <button
          className="close"
          onClick={() => {
            setMessage("");
            onClose();
          }}
          aria-label="Close login modal"
        >
          &times;
        </button>
        <h2 id="login-modal-title">Login</h2>
        <form onSubmit={handleLogin}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            placeholder="Your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            placeholder="Your Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Login</button>
        </form>
        {message && (
          <p className="feedback" aria-live="polite">
            {message}
          </p>
        )}
      </div>
    </div>
  );
}

export default LoginModal;
