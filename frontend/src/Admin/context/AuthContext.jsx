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
    
    // Check if the user is an admin
    if (user?.role?.toLowerCase() !== "admin") {
      // Redirect based on actual role or to login
      if (user?.role?.toLowerCase() === "guard") {
        return <Navigate to="/guard" replace />;
      } else if (user?.role?.toLowerCase() === "resident") {
        return <Navigate to="/" replace />;
      }
      localStorage.clear();
      return <Navigate to="/login" replace />;
    }
  } catch {
    localStorage.clear();
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default AuthContext;