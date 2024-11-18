import React, { useState } from "react";

function LoginModal({ isOpen, onClose }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  // Handle Login Form Submission
  const handleLogin = (e) => {
    e.preventDefault();

    // Simple validation (for demonstration purposes)
    if (email === "test@example.com" && password === "password") {
      setMessage("Login successful! Welcome back.");
      setTimeout(() => {
        onClose();
      }, 1500);
    } else {
      setMessage("Invalid email or password. Please try again.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <button className="close" onClick={onClose}>
          &times;
        </button>
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Your Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Login</button>
        </form>
        {message && <p className="feedback">{message}</p>}
      </div>
    </div>
  );
}

export default LoginModal;
