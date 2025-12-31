import axios from "axios";
const API = "http://localhost:5000/api/tasks";

export const getTasks = (token) =>
  axios.get(API, { headers: { Authorization: `Bearer ${token}` } });

export const addTask = (token, data) =>
  axios.post(API, data, { headers: { Authorization: `Bearer ${token}` } });

export const deleteTask = (token, id) =>
  axios.delete(`${API}/${id}`, { headers: { Authorization: `Bearer ${token}` } });

export const updateTask = (token, id, data) =>
  axios.put(`${API}/${id}`, data, { headers: { Authorization: `Bearer ${token}` } });
