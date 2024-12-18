import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify"; // Toast for notifications
import "react-toastify/dist/ReactToastify.css";

import axios from "axios";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import AuthModal from "./components/AuthModal";
import Hero from "./components/Hero";
import Features from "./components/Features";
import UploadSection from "./components/UploadSection";
import FileUploadPrediction from "./components/FileUploadPrediction";
import Contacts from "./components/Contacts";
import Footer from "./components/Footer";
import PrivateRoute from "./components/PrivateRoute";
import { AuthProvider } from "./context/AuthContext";

function App() {
  const [authType, setAuthType] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [backendStatus, setBackendStatus] = useState("Checking backend...");

  const openAuthModal = (type) => {
    setAuthType(type);
    setIsModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsModalOpen(false);
    setAuthType(null);
  };

  const scrollToUpload = () => {
    const uploadSection = document.getElementById("upload");
    if (uploadSection) {
      uploadSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    // Check backend health status
    axios
      .get("http://127.0.0.1:5000/health") // Replace with your Flask backend URL
      .then((response) => {
        setBackendStatus(response.data.message);
        toast.success("Backend connected successfully!");
      })
      .catch((error) => {
        console.error("Failed to connect to backend:", error);
        setBackendStatus("Backend connection failed!");
        toast.error("Failed to connect to backend.");
      });
  }, []);

  return (
    <AuthProvider>
      <Router>
        <div>
          {/* Toast Container */}
          <ToastContainer position="top-right" autoClose={5000} hideProgressBar />

          {/* Header */}
          <header className="navbar">
            <h1>SecureShare</h1>
            <div>
              <button onClick={() => openAuthModal("login")}>Login</button>
              <button onClick={() => openAuthModal("signup")}>Sign Up</button>
            </div>
          </header>

          {/* Backend Status */}
          <p style={{ textAlign: "center", color: "green" }}>{backendStatus}</p>

          {/* Authentication Modal */}
          {isModalOpen && (
            <AuthModal onClose={closeAuthModal}>
              {authType === "login" ? <Login onClose={closeAuthModal} /> : <SignUp onClose={closeAuthModal} />}
            </AuthModal>
          )}

          {/* Routes */}
          <Routes>
            {/* Public Routes */}
            <Route
              path="/"
              element={
                <>
                  <Hero scrollToUpload={scrollToUpload} />
                  <Features />
                  <UploadSection />
                </>
              }
            />
            <Route path="/contacts" element={<Contacts />} />

            {/* Protected Routes */}
            <Route element={<PrivateRoute />}>
              <Route path="/upload" element={<FileUploadPrediction />} />
              <Route path="/dashboard" element={<FileUploadPrediction />} />
            </Route>

            {/* 404 Page */}
            <Route path="*" element={<h2>404: Page Not Found</h2>} />
          </Routes>

          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
