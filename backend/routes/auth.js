const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

// Register User
router.post("/signup", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Email already registered" });

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({ email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Login User
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    // Generate JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.status(200).json({ token });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;

// const express = require("express");
// const jwt = require("jsonwebtoken");
// const User = require("../models/User");

// const router = express.Router();

// // Token Validation
// router.get("/validate", async (req, res) => {
//   const token = req.headers.authorization?.split(" ")[1]; // Extract token
//   if (!token) return res.status(401).json({ message: "No token provided" });

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify token
//     const user = await User.findById(decoded.id).select("-password"); // Find user
//     res.status(200).json({ user });
//   } catch (err) {
//     res.status(401).json({ message: "Invalid token" });
//   }
// });

// module.exports = router;

// router.post("/signup", async (req, res) => {
//     const { email, password } = req.body;
  
//     try {
//       console.log("Signup Request:", { email, password }); // Debug input
//       const existingUser = await User.findOne({ email }); // Check if user exists
//       if (existingUser) {
//         console.log("User already exists:", existingUser); // Debug existing user
//         return res.status(400).json({ message: "Email already registered" });
//       }
  
//       const hashedPassword = await bcrypt.hash(password, 10); // Hash password
//       const newUser = new User({ email, password: hashedPassword });
//       await newUser.save();
//       console.log("New user created:", newUser); // Debug new user
//       res.status(201).json({ message: "User registered successfully" });
//     } catch (err) {
//       console.error("Error in Sign-Up:", err); // Debug server error
//       res.status(500).json({ message: "Server error" });
//     }
//   });
  