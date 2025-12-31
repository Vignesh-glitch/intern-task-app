const db = require("../config/db");
const bcrypt = require("bcrypt");

exports.getProfile = (req, res) => {
  db.query("SELECT id, name, email FROM users WHERE id=?", [req.user.id], (err, result) => {
    if (err || result.length === 0) return res.status(404).json({ error: "Profile not found" });
    res.json(result[0]);
  });
};

exports.updateProfile = async (req, res) => {
  const { name, password } = req.body;
  if (!name && !password) return res.status(400).json({ error: "Nothing to update" });

  let hashedPassword = null;
  if (password) {
    hashedPassword = await bcrypt.hash(password, 10);
  }

  const query = password
    ? "UPDATE users SET name=?, password=? WHERE id=?"
    : "UPDATE users SET name=? WHERE id=?";

  const params = password ? [name, hashedPassword, req.user.id] : [name, req.user.id];

  db.query(query, params, (err) => {
    if (err) return res.status(500).json({ error: "Profile update failed" });
    res.json({ message: "Profile updated" });
  });
};
