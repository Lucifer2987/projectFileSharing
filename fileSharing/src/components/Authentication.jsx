import React from "react";

function Authentication({ type, closeModal, toggleAuth }) {
  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={closeModal}>
          &times;
        </span>
        <h2>{type === "login" ? "Login" : "Register"}</h2>
        <input type="email" placeholder="Email" />
        <input type="password" placeholder="Password" />
        <button>{type === "login" ? "Login" : "Register"}</button>
        <p>
          {type === "login" ? "Don't have an account?" : "Already have an account?"}{" "}
          <span onClick={toggleAuth}>{type === "login" ? "Register here" : "Login here"}</span>
        </p>
      </div>
    </div>
  );
}

export default Authentication;
