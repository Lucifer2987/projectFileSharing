import React, { useState } from "react";
import PropTypes from "prop-types";

function Header({ onLoginClick, onSignUpClick, isLoggedIn, onLogout }) {
  const [error, setError] = useState("");

  const handleLogout = async () => {
    try {
      if (onLogout) {
        await onLogout(); // Call the logout function passed as a prop
        setError(""); // Clear any previous errors
      } else {
        console.error("Logout function not provided");
        setError("Logout functionality is currently unavailable.");
      }
    } catch (err) {
      console.error("Logout failed:", err);
      setError("Failed to log out. Please try again.");
    }
  };

  return (
    <header className="navbar">
      <div className="logo">
        <h1>SecureShare</h1>
      </div>
      <nav>
        <ul className="nav-links">
          <li><a href="#home">Home</a></li>
          <li><a href="#features">Features</a></li>
          <li><a href="#upload">Upload</a></li>
          {isLoggedIn ? (
            <li>
              <button className="logout-btn" onClick={handleLogout}>
                Logout
              </button>
            </li>
          ) : (
            <>
              <li>
                <button className="login-btn" onClick={onLoginClick}>Login</button>
              </li>
              <li>
                <button className="signup-btn" onClick={onSignUpClick}>Sign Up</button>
              </li>
            </>
          )}
        </ul>
      </nav>
      {error && <p className="error-message">{error}</p>} {/* Display error message */}
    </header>
  );
}

// Prop validation to ensure props are correctly passed
Header.propTypes = {
  onLoginClick: PropTypes.func.isRequired,
  onSignUpClick: PropTypes.func.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
  onLogout: PropTypes.func, // Optional, as it may not always be provided
};

export default Header;
