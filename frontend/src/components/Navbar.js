import React from "react";
import { useNavigate } from "react-router-dom";

export default function Navbar({ profile, onToggleTheme }) {
  const nav = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    nav("/login");
  };

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-sm p-3 flex justify-between items-center">
      <div className="text-lg font-semibold text-blue-700">Intern Task App</div>
      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-700 dark:text-gray-300">
          {profile ? `Hi, ${profile.name}` : "Loading..."}
        </span>

        <button className="border px-3 py-1 rounded text-xs dark:text-white" onClick={onToggleTheme}>
          Toggle Theme
        </button>

        <button className="bg-red-500 text-white px-3 py-1 rounded text-sm" onClick={logout}>
          Logout
        </button>
      </div>
    </nav>
  );
}

