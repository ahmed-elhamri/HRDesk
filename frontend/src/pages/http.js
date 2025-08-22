// src/api/http.js
import axios from "axios";

export const http = axios.create({
  baseURL: "http://localhost:8000/api",
  timeout: 5000, // fail fast if backend is slow
});

// optional: attach token once (update when token changes)
export const setAuthToken = (token) => {
  if (token) http.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  else delete http.defaults.headers.common["Authorization"];
};
