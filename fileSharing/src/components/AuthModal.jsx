// import React from "react";
// import "./AuthModal.css";

// function AuthModal({ children, onClose }) {
//   return (
//     <div className="modal-overlay">
//       <div className="modal-content">
//         <button className="close-btn" onClick={onClose}>
//           &times;
//         </button>
//         {children}
//       </div>
//     </div>
//   );
// }

// export default AuthModal;

import React from "react";
import "./AuthModal.css";

function AuthModal({ children, onClose }) {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-btn" onClick={onClose}>&times;</button>
        {children}
      </div>
    </div>
  );
}

export default AuthModal;
