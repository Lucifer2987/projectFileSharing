import React, { useState } from "react";

function LoginSignUpModal({ isOpen, onClose, type, handleAuthentication }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (type === "login") {
      const success = handleAuthentication("login", { email, password });
      if (success) {
        setMessage("Login successful! Welcome back.");
        setTimeout(() => {
          setMessage("");
          onClose();
        }, 1500);
      } else {
        setMessage("Invalid email or password. Please try again.");
      }
    } else if (type === "signup") {
      if (password !== confirmPassword) {
        setMessage("Passwords do not match. Please try again.");
        return;
      }
      const success = handleAuthentication("signup", { email, password });
      if (success) {
        setMessage("Sign up successful! You can now log in.");
        setTimeout(() => {
          setMessage("");
          onClose();
        }, 1500);
      } else {
        setMessage("Email already registered. Please log in.");
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <button className="close" onClick={onClose}>
          &times;
        </button>
        <h2>{type === "login" ? "Login" : "Sign Up"}</h2>
        <form onSubmit={handleSubmit}>
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
          {type === "signup" && (
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          )}
          <button type="submit">{type === "login" ? "Login" : "Sign Up"}</button>
        </form>
        {message && <p className="feedback">{message}</p>}
      </div>
    </div>
  );
}

export default LoginSignUpModal;
