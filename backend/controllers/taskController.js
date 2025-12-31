const db = require("../config/db");

exports.createTask = (req, res) => {
  const { title, description, priority, due_date, status } = req.body;
  const userId = req.user.id;

  db.query(
    "INSERT INTO tasks (user_id, title, description, priority, due_date, status) VALUES (?,?,?,?,?,?)",
    [userId, title, description, priority || "Medium", due_date || null, status || "Pending"],
    (err, result) => {
      if (err) return res.status(500).json({ error: "Task failed to add!" });
      res.json({ id: result.insertId, title, description, priority, due_date, status });
    }
  );
};

exports.getTasks = (req, res) => {
  db.query("SELECT * FROM tasks WHERE user_id=?", [req.user.id], (err, result) => {
    if (err) return res.status(500).json({ error: "Fetch failed!" });
    res.json(result);
  });
};

exports.updateTask = (req, res) => {
  const { id } = req.params;
  const { title, description, priority, due_date, status } = req.body;

  db.query(
    "UPDATE tasks SET title=?, description=?, priority=?, due_date=?, status=? WHERE id=? AND user_id=?",
    [title, description, priority, due_date, status, id, req.user.id],
    (err) => {
      if (err) return res.status(500).json({ error: "Update failed!" });
      res.json({ message: "Task Updated" });
    }
  );
};

exports.deleteTask = (req, res) => {
  db.query("DELETE FROM tasks WHERE id=? AND user_id=?", [req.params.id, req.user.id], (err) => {
    if (err) return res.status(500).json({ error: "Delete failed!" });
    res.json({ message: "Deleted!" });
  });
};
