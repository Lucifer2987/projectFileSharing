// import React, { useState } from "react";

// function SignUp({ onClose }) {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [message, setMessage] = useState("");

//   const handleSignUp = (e) => {
//     e.preventDefault();
//     // Mock Sign-Up Logic
//     if (password !== confirmPassword) {
//       setMessage("Passwords do not match.");
//       return;
//     }
//     setMessage("Sign up successful! You can now log in.");
//     setTimeout(() => {
//       setMessage("");
//       onClose();
//     }, 1500);
//   };

//   return (
//     <div>
//       <h2>Sign Up</h2>
//       <form onSubmit={handleSignUp}>
//         <input
//           type="email"
//           placeholder="Your Email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           required
//         />
//         <input
//           type="password"
//           placeholder="Your Password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           required
//         />
//         <input
//           type="password"
//           placeholder="Confirm Password"
//           value={confirmPassword}
//           onChange={(e) => setConfirmPassword(e.target.value)}
//           required
//         />
//         <button type="submit">Sign Up</button>
//         {message && <p>{message}</p>}
//       </form>
//     </div>
//   );
// }

// export default SignUp;

import React, { useState } from "react";
import axios from "axios";

function SignUp({ onClose }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }
    try {
      await axios.post("http://localhost:5000/api/auth/signup", { email, password });
      setMessage("Sign up successful! You can now log in.");
      setTimeout(onClose, 1500);
    } catch (error) {
      setMessage("Error signing up. Try a different email.");
    }
  };

  return (
    <div>
      <h2>Sign Up</h2>
      <form onSubmit={handleSignUp}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <button type="submit">Sign Up</button>
        {message && <p>{message}</p>}
      </form>
    </div>
  );
}

export default SignUp;
