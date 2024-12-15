import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify"; // Import ToastContainer
import "react-toastify/dist/ReactToastify.css"; // Import Toastify styles

import Login from "./components/Login";
import SignUp from "./components/SignUp";
import AuthModal from "./components/AuthModal";
import Hero from "./components/Hero";
import Features from "./components/Features";
import UploadSection from "./components/UploadSection";
import Contacts from "./components/Contacts";
import Footer from "./components/Footer";
import PrivateRoute from "./components/PrivateRoute";
import { AuthProvider } from "./context/AuthContext";

function App() {
  const [authType, setAuthType] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  return (
    <AuthProvider>
      <Router>
        <div>
          {/* Toast Container for Notifications */}
          <ToastContainer position="top-right" autoClose={5000} hideProgressBar />

          {/* Header */}
          <header className="navbar">
            <h1>SecureShare</h1>
            <div>
              <button onClick={() => openAuthModal("login")}>Login</button>
              <button onClick={() => openAuthModal("signup")}>Sign Up</button>
            </div>
          </header>

          {/* Authentication Modal */}
          {isModalOpen && (
            <AuthModal onClose={closeAuthModal}>
              {authType === "login" ? <Login onClose={closeAuthModal} /> : <SignUp onClose={closeAuthModal} />}
            </AuthModal>
          )}

          {/* Routes */}
          <Routes>
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
            <Route path="/upload" element={<PrivateRoute />}>
              <Route path="/upload" element={<UploadSection />} />
            </Route>
            <Route path="/dashboard" element={<PrivateRoute />}>
              <Route path="/dashboard" element={<UploadSection />} />
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
