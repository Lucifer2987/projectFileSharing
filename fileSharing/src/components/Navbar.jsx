import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";

function Navbar({ openAuthModal }) {
  const { user, logout } = useContext(AuthContext); // Access user and logout function from context
  const [error, setError] = useState(null);

  const handleLogout = async () => {
    try {
      await logout(); // Perform logout operation
      setError(null); // Clear any errors upon successful logout
    } catch (err) {
      console.error("Logout failed:", err);
      setError("Failed to log out. Please try again."); // Display a friendly error message
    }
  };

  return (
    <nav className="navbar">
      <h1 className="navbar-brand">SecureShare</h1>
      <div className="navbar-buttons">
        {user ? (
          <>
            <span className="welcome-message">
              Welcome, {user.name || user.email || "User"}!
            </span>
            <button
              className="logout-button"
              onClick={handleLogout}
              aria-label="Logout"
            >
              Logout
            </button>
            {error && <p className="error-message">{error}</p>} {/* Display error */}
          </>
        ) : (
          <>
            <button
              className="login-button"
              onClick={() => openAuthModal("login")}
              aria-label="Open login modal"
            >
              Login
            </button>
            <button
              className="signup-button"
              onClick={() => openAuthModal("signup")}
              aria-label="Open signup modal"
            >
              Sign Up
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
