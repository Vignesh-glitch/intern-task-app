import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import TaskForm from "../components/TaskForm";
import TaskTable from "../components/TaskTable";

export default function Dashboard() {
  const [profile, setProfile] = useState(null);
  const [tasks, setTasks] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const load = async () => {
      try {
        const p = await axios.get("http://localhost:5000/api/auth/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(p.data);

        const t = await axios.get("http://localhost:5000/api/tasks", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTasks(t.data);
      } catch (err) {
        console.error("Load error", err.message);
      }
    };
    load();
  }, []);

  const handleTaskAdded = (task) => setTasks([task, ...tasks]);
  const handleTaskUpdated = (task) =>
    setTasks(tasks.map((t) => (t.id === task.id ? task : t)));
  const handleTaskDeleted = (id) => setTasks(tasks.filter((t) => t.id !== id));

  const pending = tasks.filter(t=>t.status==="Pending").length;
  const completed = tasks.filter(t=>t.status==="Completed").length;
  const progress = tasks.length?Math.round((completed/tasks.length)*100):0;

  return (
    <div  className="min-h-screen bg-gradient-to-r from-cyan-500 to-blue-600">

      <Navbar profile={profile} onToggleTheme={()=>document.documentElement.classList.toggle("dark")} />
      <div className="p-4 max-w-5xl mx-auto">
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="bg-white dark:bg-gray-50 p-3 rounded-2xl shadow text-center"><h3>Pending</h3><p>{pending}</p></div>
          <div className="bg-white dark:bg-gray-50 p-3 rounded-2xl shadow text-center"><h3>Completed</h3><p>{completed}</p></div>
          <div className="bg-white dark:bg-gray-50 p-3 rounded-2xl shadow text-center"><h3>Progress</h3><p>{progress}%</p></div>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
          <div className="h-2 rounded-full" style={{width:`${progress}%`}}></div>
        </div>

        <TaskForm onTaskAdded={handleTaskAdded} />
        <TaskTable tasks={tasks} onTaskUpdated={handleTaskUpdated} onTaskDeleted={handleTaskDeleted} />
      </div>
    </div>
  );
}
