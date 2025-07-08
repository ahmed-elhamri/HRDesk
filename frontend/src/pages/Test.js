import { useAuth } from "context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

function Test() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/sign-in");
    }
  }, [user, navigate]);
  const handleLogout = async () => {
    await logout();
    navigate("/sign-in");
  };

  return (
    <>
      <h1>Welcome to Dashboard</h1>
      {user?.role === "ADMIN" && <p>You have admin access.</p>}
      <button onClick={handleLogout}>Logout</button>
    </>
  );
}

export default Test;
