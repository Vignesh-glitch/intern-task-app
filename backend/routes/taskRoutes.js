const express = require("express");  // <-- missing import
const router = express.Router();
const db = require("../config/db");
const jwt = require("jsonwebtoken");


const verifyToken = require("../middleware/verifyToken");
const task = require("../controllers/taskController");

router.post("/", verifyToken, (req, res) => {
  const { title, description, status, priority, due_date } = req.body;

  if (!title || !description) {
    return res.status(400).json({ error: "Title and Description required" });
  }

  db.query(
    "INSERT INTO tasks (user_id, title, description, status, priority, due_date) VALUES (?,?,?,?,?,?)",
    [req.user.id, title, description, status || "Pending", priority || "Medium", due_date || null],
    (err, result) => {  // ✔ result is now defined
      if (err) {
        console.error("Insert Error:", err);
        return res.status(500).json({ error: "Task failed to add!" });
      }

      res.json({
        id: result.insertId,
        user_id: req.user.id,
        title,
        description,
        status: status || "Pending",
        priority: priority || "Medium",
        due_date: due_date || null,
        created_at: new Date().toISOString()
      });
    }
  );
});

router.get("/", verifyToken, task.getTasks);
router.put("/:id", verifyToken, task.updateTask);
router.delete("/:id", verifyToken, task.deleteTask);

module.exports = router;
