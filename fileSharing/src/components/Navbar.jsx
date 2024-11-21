import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

function Navbar({ openAuthModal }) {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="navbar">
      <h1>SecureShare</h1>
      <div>
        {user ? (
          <button onClick={logout}>Logout</button>
        ) : (
          <>
            <button onClick={() => openAuthModal("login")}>Login</button>
            <button onClick={() => openAuthModal("signup")}>Sign Up</button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
