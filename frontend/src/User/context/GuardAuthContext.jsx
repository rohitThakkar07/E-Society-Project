// src/Guard/context/GuardAuthContext.jsx
import React from "react";
import { Navigate } from "react-router-dom";

// Wraps guard routes — only allows users with role "guard" to proceed
const GuardAuthContext = ({ children }) => {
  const token = localStorage.getItem("token");
  const user  = JSON.parse(localStorage.getItem("userData") || "{}");
  const role  = user?.role?.toLowerCase();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Admin can also access guard pages (for oversight)
  if (role !== "guard" && role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default GuardAuthContext;