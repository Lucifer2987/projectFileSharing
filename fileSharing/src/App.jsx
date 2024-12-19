import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import axios from "axios";
import Login from "@/components/Login";
import SignUp from "@/components/SignUp";
import AuthModal from "@/components/AuthModal";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import UploadSection from "@/components/UploadSection";
import Contacts from "@/components/Contacts";
import Footer from "@/components/Footer";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";

function AppContent() {
  const [authType, setAuthType] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [backendStatus, setBackendStatus] = useState({ message: "Checking backend...", isError: false });
  const { isLoggedIn, user, checkAuthStatus } = useAuth();

  const openAuthModal = (type) => {
    if (!isLoggedIn) {
      setAuthType(type);
      setIsModalOpen(true);
    }
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

  // Check auth status when component mounts
  useEffect(() => {
    checkAuthStatus();
  }, []);

  useEffect(() => {
    // Check backend health status
    axios
      .get("http://127.0.0.1:5000/health")
      .then((response) => {
        setBackendStatus({ message: "Backend connected successfully!", isError: false });
        toast.success("Backend connected successfully!");
      })
      .catch((error) => {
        console.error("Failed to connect to backend:", error);
        setBackendStatus({ message: "Backend connection failed!", isError: true });
        toast.error("Failed to connect to backend.");
      });
  }, []);

  useEffect(() => {
    if (isLoggedIn && isModalOpen) {
      closeAuthModal();
      toast.success(`Welcome back, ${user?.email}!`);
    }
  }, [isLoggedIn, user]);

  return (
    <div className="app-container">
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar />

      <Navbar openAuthModal={openAuthModal} />

      <p className="backend-status" style={{ 
        textAlign: "center", 
        color: backendStatus.isError ? "red" : "green",
        padding: "10px",
        margin: "10px 0"
      }}>
        {backendStatus.message}
      </p>

      {isModalOpen && !isLoggedIn && (
        <AuthModal onClose={closeAuthModal}>
          {authType === "login" ? <Login onClose={closeAuthModal} /> : <SignUp onClose={closeAuthModal} />}
        </AuthModal>
      )}

      <main style={{ minHeight: '100vh' }}>
        <Hero scrollToUpload={scrollToUpload} />
        <Features />
        
        <div id="upload" style={{ padding: '2rem 0', backgroundColor: '#f8f9fa' }}>
          {isLoggedIn ? (
            <UploadSection />
          ) : (
            <div className="auth-prompt" style={{
              maxWidth: '800px',
              margin: '0 auto',
              padding: '2rem',
              textAlign: 'center',
              backgroundColor: 'white',
              borderRadius: '8px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
              <p style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>
                Please log in to upload and analyze files.
              </p>
              <button 
                onClick={() => openAuthModal("login")} 
                className="auth-button"
                style={{
                  padding: '1rem 2rem',
                  fontSize: '1.1rem',
                  backgroundColor: '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Log In
              </button>
            </div>
          )}
        </div>

        <Routes>
          <Route path="/contacts" element={<Contacts />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
