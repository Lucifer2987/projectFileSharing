import React, { useState } from "react";
// import Header from "./components/Header";
// // import LoginModal from "./components/LoginModal";
// import LoginSignUpModal from "./components/LoginSignUpModal";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import AuthModal from "./components/AuthModal";

import Hero from "./components/Hero";
import Features from "./components/Features";
import UploadSection from "./components/UploadSection";
import Contacts from "./components/Contacts";
import Footer from "./components/Footer";
import Authentication from "./components/Authentication";

 function App() {
  const [authType, setAuthType] = useState(null); // "login" or "signup"
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openAuthModal = (type) => {
    setAuthType(type);
    setIsModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsModalOpen(false);
    setAuthType(null);
  };
  const [authModal, setAuthModal] = useState(null); // 'login' or 'register'

  const showLogin = () => setAuthModal("login");
  const showRegister = () => setAuthModal("register");
//   // const closeModal = () => setAuthModal(null);

//   // const [isLoginOpen, setIsLoginOpen] = useState(false);

//   // const openLoginModal = () => setIsLoginOpen(true);
//   // const closeLoginModal = () => setIsLoginOpen(false);
//   const openLoginModal = () => setModalType("login");
//   const openSignUpModal = () => setModalType("signup");
//   const closeModal = () => setModalType(null);
//   // const [modalType, setModalType] = useState(null); // "login" or "signup"
//   // const [isLoggedIn, setIsLoggedIn] = useState(false); // Track user login status
//   // const [users, setUsers] = useState([]); // Mock user database

//   // const openLoginModal = () => setModalType("login");
//   // const openSignUpModal = () => setModalType("signup");
//   // const closeModal = () => setModalType(null);

//   const handleAuthentication = (action, { email, password }) => {
//     if (action === "login") {
//       // Check if the user exists and credentials match
//       const user = users.find((user) => user.email === email && user.password === password);
//       if (user) {
//         setIsLoggedIn(true);
//         return true;
//       }
//       return false;
//     } else if (action === "signup") {
//       // Check if the user already exists
//       const userExists = users.some((user) => user.email === email);
//       if (userExists) {
//         return false;
//       }
//       // Add new user
//       setUsers([...users, { email, password }]);
//       return true;
//     }
//   };

//   return (
//     <div className="App">
//       {/* <Header onLoginClick={openLoginModal} /> */}
//       {/* <LoginModal isOpen={isLoginOpen} onClose={closeLoginModal} /> */}
//       <Header onLoginClick={openLoginModal} onSignUpClick={openSignUpModal} />
//       {/* <LoginSignUpModal
//         isOpen={modalType !== null}
//         type={modalType}
//         onClose={closeModal}
//       /> */}
      
//       <Hero showLogin={showLogin} />
//       <Features />
//       <UploadSection />
//       {authModal && (
//         <Authentication
//           type={authModal}
//           closeModal={closeModal}
//           toggleAuth={() => setAuthModal(authModal === "login" ? "register" : "login")}
//         />
//       )}
//       <Contacts />
//       <Footer />
//     </div>
//   );
// }

// export default App;



  return (
    <div>
      <header className="navbar">
        <h1>SecureShare</h1>
        <div>
          <button onClick={() => openAuthModal("login")}>Login</button>
          <button onClick={() => openAuthModal("signup")}>Sign Up</button>
        </div>
      </header>

      {isModalOpen && (
        <AuthModal onClose={closeAuthModal}>
          {authType === "login" ? <Login onClose={closeAuthModal} /> : <SignUp onClose={closeAuthModal} />}
        </AuthModal>
      )}

       <Hero showLogin={showLogin} />
       <Features />
       <UploadSection />
       {authModal && (
         <Authentication
           type={authModal}
           closeModal={closeModal}
           toggleAuth={() => setAuthModal(authModal === "login" ? "register" : "login")}
         />
       )}
    <Contacts />
    <Footer />
    </div>
  );
}

export default App;
