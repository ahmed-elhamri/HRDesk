import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

axios.defaults.baseURL = "http://localhost:8000";
axios.defaults.withCredentials = true;

const AuthContext = createContext();

// eslint-disable-next-line react/prop-types
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [employe, setEmploye] = useState(null);
  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null);
  const [passwordChanged, setPasswordChanged] = useState(null);
  const [permissions, setPermissions] = useState(null);
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUserId = localStorage.getItem("user_id");
    const storedUserRole = localStorage.getItem("user_role");
    const storedPasswordChanged = localStorage.getItem("password_changed");

    if (storedToken && storedUserId) {
      setToken(storedToken);
      setUser({
        id: parseInt(storedUserId),
        role: storedUserRole,
        password_changed: storedPasswordChanged === "true",
      });

      axios.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;

      axios
        .get(`/api/user`)
        .then((res) => {
          const { user, employe, access_token, permissions } = res.data;
          setUser(user);
          setRole(user.role);
          setPasswordChanged(user.password_changed);
          setToken(access_token);
          setEmploye(employe);
          setPermissions(permissions);
        })
        .catch((err) => {
          console.error("Failed to fetch user:", err);
          logout(); // Invalidate session if token is invalid
        });
    }
  }, []);

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
      // console.log(response);
      const { user, employe, access_token, permissions } = response.data;
      console.log(response.data);

      setUser(user);
      setRole(user.role);
      setEmploye(employe);
      setToken(access_token);
      setPermissions(permissions);
      setPasswordChanged(user.password_changed);
      console.log(permissions);

      // Store token in localStorage if needed
      localStorage.setItem("token", access_token);
      localStorage.setItem("user_id", user.id);
      localStorage.setItem("user_role", user.role);
      localStorage.setItem("password_changed", user.password_changed);
      localStorage.setItem("periode", new Date().toISOString().slice(0, 7));
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
      localStorage.removeItem("user_id");
      localStorage.removeItem("user_role");
      localStorage.removeItem("password_changed");

      // Remove default auth header
      delete axios.defaults.headers.common["Authorization"];
    } catch (error) {
      console.error("Logout error:", error.response?.data || error.message);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, role, passwordChanged, employe, permissions, token, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
