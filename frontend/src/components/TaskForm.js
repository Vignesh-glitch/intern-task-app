import React, { useState } from "react";
import axios from "axios";

export default function TaskForm({ onTaskAdded }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [dueDate, setDueDate] = useState("");
  const token = localStorage.getItem("token");

  const handleSubmit = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/tasks",
        { title, description, priority, due_date: dueDate, status: "Pending" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      onTaskAdded(res.data);
      alert("Task Created!");
    } catch (err) {
      alert(err.response?.data?.error || "Task failed!");
    }
  };

  return (
    <div className="w-full max-w-md bg-white dark:bg-gray-800 p-4 rounded-2xl shadow my-4 mx-auto">
      <input className="w-full border p-2 mb-2 rounded" placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)} />
      <textarea className="w-full border p-2 mb-2 rounded" placeholder="Description" value={description} onChange={e=>setDescription(e.target.value)} />
      <select className="w-full border p-2 mb-2 rounded" value={priority} onChange={e=>setPriority(e.target.value)}>
        <option>High</option><option>Medium</option><option>Low</option>
      </select>
      <input type="date" className="w-full border p-2 mb-2 rounded" value={dueDate} onChange={e=>setDueDate(e.target.value)} />
      <button className="w-full bg-blue-600 text-white p-2 rounded" onClick={handleSubmit}>Add Task</button>
    </div>
  );
}
