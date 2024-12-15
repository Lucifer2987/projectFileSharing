import React, { useState, useEffect, useRef } from "react";

function LoginSignUpModal({ isOpen, onClose, type, handleAuthentication }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Clear previous messages
    setMessage("");

    if (!validateEmail(email)) {
      setMessage("Please enter a valid email address.");
      return;
    }

    if (type === "signup" && password !== confirmPassword) {
      setMessage("Passwords do not match. Please try again.");
      return;
    }

    // Call the handleAuthentication function (assumed to handle async operations)
    const response = await handleAuthentication(type, { email, password });

    if (response.success) {
      setMessage(
        type === "login"
          ? "Login successful! Welcome back."
          : "Sign up successful! You can now log in."
      );
      setTimeout(() => {
        onClose();
        setMessage("");
      }, 1500);
    } else {
      setMessage(response.error || "An error occurred. Please try again.");
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="modal"
      role="dialog"
      aria-hidden={!isOpen}
      aria-labelledby="modal-title"
      aria-describedby="modal-desc"
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
          aria-label="Close modal"
        >
          &times;
        </button>
        <h2 id="modal-title">{type === "login" ? "Login" : "Sign Up"}</h2>
        <form onSubmit={handleSubmit}>
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
          {type === "signup" && (
            <>
              <label htmlFor="confirm-password">Confirm Password</label>
              <input
                id="confirm-password"
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </>
          )}
          <button type="submit">{type === "login" ? "Login" : "Sign Up"}</button>
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

export default LoginSignUpModal;
