import React, { useContext } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

// PrivateRoute: Protects routes from unauthenticated users
const PrivateRoute = () => {
  const { user } = useContext(AuthContext); // Access user authentication status
  const location = useLocation(); // Get the current route location

  return user ? (
    // If the user is authenticated, render the children components or nested routes
    <Outlet />
  ) : (
    // Redirect to login and preserve the current route
    <Navigate to="/login" state={{ from: location }} replace />
  );
};

export default PrivateRoute;
