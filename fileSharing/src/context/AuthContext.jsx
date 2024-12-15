import { createContext, useState, useEffect, useMemo } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(""); // To store error messages

  useEffect(() => {
    // On component mount, check if there's a token and fetch user data
    fetchUser();
  }, []);

  const login = async (credentials) => {
    try {
      // Basic validation to ensure credentials are complete
      if (!credentials.email || !credentials.password) {
        throw new Error("Email and password are required.");
      }

      const response = await axios.post("http://localhost:5000/login", credentials);
      const { token, userData } = response.data;

      localStorage.setItem("token", token); // Store the token securely
      setUser(userData); // Update the user state
      setAuthError(""); // Clear previous errors
    } catch (error) {
      console.error("Login failed:", error);
      setAuthError(error.response?.data?.message || "Login failed. Please try again.");
      throw error; // Re-throw for UI-level handling if needed
    }
  };

  const logout = async () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        await axios.post(
          "http://localhost:5000/logout",
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      }
    } catch (error) {
      console.error("Logout failed:", error);
      setAuthError("Logout failed. Please try again.");
    } finally {
      localStorage.removeItem("token");
      setUser(null); // Clear user data
    }
  };

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return; // No token means no user data to fetch
      }

      // Check if the token is expired (you can modify this depending on your token structure)
      const decodedToken = decodeToken(token);
      if (decodedToken.exp < Date.now() / 1000) {
        logout();
        return;
      }

      const response = await axios.get("http://localhost:5000/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUser(response.data); // Set user state
      setAuthError(""); // Clear any previous errors
    } catch (error) {
      console.error("Fetching user failed:", error);
      logout(); // Logout if the token is invalid or expired
      setAuthError("Session expired. Please log in again.");
    } finally {
      setLoading(false); // Stop loading once the user data is fetched
    }
  };

  const isAuthenticated = useMemo(() => {
    return !!localStorage.getItem("token");
  }, []); // Memoize this value for optimization

  // Helper function to decode JWT token (this is optional)
  const decodeToken = (token) => {
    try {
      const payload = token.split(".")[1];
      return JSON.parse(atob(payload));
    } catch (error) {
      console.error("Token decoding failed:", error);
      return {};
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        fetchUser,
        isAuthenticated,
        loading,
        authError, // Provide error messages to UI
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
