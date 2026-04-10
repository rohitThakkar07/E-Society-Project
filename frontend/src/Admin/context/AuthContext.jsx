import { Navigate } from "react-router-dom";

const AuthContext = ({ children }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  try {
    const user = JSON.parse(localStorage.getItem("userData") || "{}");
    if (user?.status === "Inactive") {
      localStorage.clear();
      return <Navigate to="/login?inactive=1" replace />;
    }
  } catch {
    localStorage.clear();
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default AuthContext;