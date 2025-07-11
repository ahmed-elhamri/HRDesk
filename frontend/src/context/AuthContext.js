import { createContext, useContext, useState } from "react";
import axios from "axios";

axios.defaults.baseURL = "http://localhost:8000";
axios.defaults.withCredentials = true;

const AuthContext = createContext();

// eslint-disable-next-line react/prop-types
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  const getCsrfCookie = async () => {
    try {
      await axios.get("/sanctum/csrf-cookie");
    } catch (error) {
      console.error("CSRF cookie error:", error);
    }
  };

  const login = async (email, password) => {
    try {
      await getCsrfCookie();

      const response = await axios.post("/api/login", { email, password });
      console.log(response);
      const { user, access_token } = response.data;

      setUser(user);
      console.log(user);
      setToken(access_token);

      // Store token in localStorage if needed
      localStorage.setItem("token", access_token);
      localStorage.setItem("user_id", user.id);
      localStorage.setItem("user_role", user.role);
      // Set default Authorization header for axios
      axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;

      return true;
    } catch (error) {
      console.error("Login error:", error.response?.data || error.message);
      return false;
    }
  };

  const logout = async () => {
    const token = localStorage.getItem("token");
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    try {
      await axios.post("/api/logout", null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUser(null);
      setToken(null);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("role");

      // Remove default auth header
      delete axios.defaults.headers.common["Authorization"];
    } catch (error) {
      console.error("Logout error:", error.response?.data || error.message);
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
