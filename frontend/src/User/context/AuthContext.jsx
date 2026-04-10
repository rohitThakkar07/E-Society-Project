// src/context/AuthContext.jsx
import { Navigate, Outlet } from "react-router-dom";

const AuthContext = () => {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/login" replace />;
  return <Outlet />;
};

export default AuthContext;