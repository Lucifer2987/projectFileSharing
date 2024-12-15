import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

function Authentication({ type, closeModal, toggleAuth }) {
  const { login } = useContext(AuthContext); // Use login from AuthContext
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(""); // For registration
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(""); // Clear previous messages

    if (type === "register" && password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      if (type === "login") {
        // Login API call
        await login({ email, password });
        setMessage("Login successful!");
        setTimeout(closeModal, 1500); // Close modal after successful login
      } else {
        // Registration API call
        const response = await fetch("http://localhost:5000/api/auth/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Registration failed.");
        }

        setMessage("Registration successful! You can now log in.");
        setTimeout(() => {
          setMessage("");
          toggleAuth(); // Switch to login view
        }, 1500);
      }
    } catch (error) {
      setMessage(error.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={closeModal}>
          &times;
        </span>
        <h2>{type === "login" ? "Login" : "Register"}</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {type === "register" && (
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          )}
          <button type="submit" disabled={loading}>
            {loading ? (type === "login" ? "Logging in..." : "Registering...") : type === "login" ? "Login" : "Register"}
          </button>
          {message && <p className="message">{message}</p>}
        </form>
        <p>
          {type === "login" ? "Don't have an account?" : "Already have an account?"}{" "}
          <span onClick={toggleAuth} className="toggle-auth-link">
            {type === "login" ? "Register here" : "Login here"}
          </span>
        </p>
      </div>
    </div>
  );
}

export default Authentication;
