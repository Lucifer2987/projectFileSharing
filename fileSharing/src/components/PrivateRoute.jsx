import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

// A wrapper to protect private routes
const PrivateRoute = ({ component: Component, ...rest }) => {
  const { user } = useContext(AuthContext); // Access user state from AuthContext

  // If the user is authenticated, render the specified component
  // Otherwise, redirect to login
  return user ? (
    <Outlet />
  ) : (
    <Navigate to="/login" replace />
  );
};

export default PrivateRoute;
