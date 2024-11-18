import React from "react";

// function Header({ onLoginClick }) {
//   return (
//     <header className="navbar">
//       <div className="logo">
//         <h1>SecureShare</h1>
//       </div>
//       <nav>
//         <ul className="nav-links">
//           <li><a href="#home">Home</a></li>
//           <li><a href="#features">Features</a></li>
//           <li><a href="#upload">Upload</a></li>
//           <li><a href="#contact">Contact</a></li>
//           <li>
//             <button className="login-btn" onClick={onLoginClick}>
//               Login
//             </button>
//           </li>
//         </ul>
//         <div className="hamburger" id="hamburger">
//             <span></span>
//             <span></span>
//             <span></span>
//         </div>
//       </nav>
//     </header>
//   );
// }
// function Header({ onLoginClick, onSignUpClick }) {
//     return (
//       <header className="navbar">
//         <div className="logo">
//           <h1>SecureShare</h1>
//         </div>
//         <nav>
//           <ul className="nav-links">
//             <li><a href="#home">Home</a></li>
//             <li><a href="#features">Features</a></li>
//             <li><a href="#upload">Upload</a></li>
//             <li><a href="#contact">Contact</a></li>
//             <li>
//               <button className="login-btn" onClick={onLoginClick}>Login</button>
//             </li>
//             <li>
//               <button className="signup-btn" onClick={onSignUpClick}>Sign Up</button>
//             </li>
//           </ul>
//           <div className="hamburger" id="hamburger">
//             <span></span>
//             <span></span>
//             <span></span>
//         </div>
//         </nav>
//       </header>
//     );
//   }
function Header({ onLoginClick, onSignUpClick, isLoggedIn }) {
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
                <button className="logout-btn" onClick={() => window.location.reload()}>
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
      </header>
    );
  }

export default Header;
