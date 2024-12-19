import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";

function Navbar({ openAuthModal }) {
  const { user, isLoggedIn, logout } = useContext(AuthContext);
  const [error, setError] = useState(null);

  const handleLogout = async () => {
    try {
      const result = await logout();
      if (result.success) {
        toast.success(result.message);
        setError(null);
      } else {
        setError(result.error);
        toast.error(result.error);
      }
    } catch (err) {
      console.error("Logout failed:", err);
      setError("Failed to log out. Please try again.");
      toast.error("Failed to log out. Please try again.");
    }
  };

  return (
    <nav className="navbar">
      <h1 className="navbar-brand">SecureShare</h1>
      <div className="navbar-buttons">
        {isLoggedIn && user ? (
          <div className="user-section">
            <span className="welcome-message">
              Logged in as: <strong>{user.email}</strong>
            </span>
            <button
              className="logout-button"
              onClick={handleLogout}
              aria-label="Logout"
            >
              Logout
            </button>
            {error && <p className="error-message">{error}</p>}
          </div>
        ) : (
          <div className="auth-buttons">
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
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
