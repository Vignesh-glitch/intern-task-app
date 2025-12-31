const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const db = require("../config/db");

// JWT Middleware
const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(401).json({ error: "No token provided" });

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ error: "Unauthorized - invalid token" });
  }
};

// PROFILE API
router.get("/profile", verifyToken, (req, res) => {
  db.query("SELECT id, name, email FROM users WHERE id=?", [req.user.id], (err, result) => {
    if (err) return res.status(500).json({ error: "Profile fetch failed" });
    res.json(result[0]);
  });
});

// LOGIN API
router.post("/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password required" });
  }

  db.query("SELECT * FROM users WHERE email=?", [email], async (err, result) => {
    if (err || result.length === 0) {
      return res.status(401).json({ error: "User not found" });
    }

    const user = result[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ message: "Login successful", token });
  });
});

// SIGNUP API
router.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: "All fields required" });
  }

  const hashed = await bcrypt.hash(password, 10);
  db.query(
    "INSERT INTO users (name, email, password) VALUES (?,?,?)",
    [name, email, hashed],
    (err) => {
      if (err) return res.status(400).json({ error: "Email already exists" });
      res.json({ message: "Signup successful" });
    }
  );
});

module.exports = router;
