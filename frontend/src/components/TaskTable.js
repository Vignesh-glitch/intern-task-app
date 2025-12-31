import React, { useState, useEffect } from "react";
import axios from "axios";

export default function TaskTable({ tasks, onTaskUpdated, onTaskDeleted }) {
  const [search, setSearch] = useState("");
  const [localTasks, setLocalTasks] = useState(tasks);
  const token = localStorage.getItem("token");

  useEffect(() => setLocalTasks(tasks), [tasks]);

  const filtered = localTasks.filter(t =>
    (t.title || "").toLowerCase().includes(search.toLowerCase())
  );

  const handleEdit = async (id, field, value) => {
    try {
      await axios.put(
        `http://localhost:5000/api/tasks/${id}`,
        { [field]: value },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      onTaskUpdated({ id, ...localTasks.find(t=>t.id===id) });
    } catch {
      alert("Edit failed");
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/tasks/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      onTaskDeleted(id);
    } catch {
      alert("Delete failed");
    }
  };

  return (
    <div>
      <input className="w-full border p-2 mb-2 rounded" placeholder="Search" value={search} onChange={e=>setSearch(e.target.value)} />
      <table className="w-full border bg-white dark:bg-blue-100">
        <thead><tr><th>Title</th><th>Description</th><th>Status</th><th>Action</th></tr></thead>
        <tbody>
          {filtered.map(t=>(
            <tr key={t.id}>
              <td><input defaultValue={t.title} onBlur={e=>handleEdit(t.id,"title",e.target.value)} /></td>
              <td><textarea defaultValue={t.description} onBlur={e=>handleEdit(t.id,"description",e.target.value)} /></td>
              <td>
                <select defaultValue={t.status} onChange={e=>handleEdit(t.id,"status",e.target.value)}>
                  <option>Pending</option><option>In Progress</option><option>Completed</option>
                </select>
              </td>
              <td><button onClick={()=>deleteTask(t.id)}>Delete</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
