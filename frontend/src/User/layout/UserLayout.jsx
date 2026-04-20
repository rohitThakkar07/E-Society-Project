import React from "react";
import { Outlet, useLocation, Navigate } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import { ThemeProvider } from "../context/ThemeContext";
import ScrollToTop from "../../components/ScrollToTop";

const UserLayout = () => {
  const location = useLocation();
  const isHome = location.pathname === "/";

  // Redirect admin or guard away from the user portal
  try {
    const token = localStorage.getItem("token");
    if (token) {
      const user = JSON.parse(localStorage.getItem("userData") || "{}");
      if (user?.role?.toLowerCase() === "admin") {
        return <Navigate to="/admin" replace />;
      }
      if (user?.role?.toLowerCase() === "guard") {
        return <Navigate to="/guard" replace />;
      }
    }
  } catch (e) {}

  return (
    <ThemeProvider>
      <ScrollToTop />
      <div className="user-portal min-h-screen flex flex-col bg-[var(--bg)] text-[var(--text)] transition-[background-color,color] duration-500 ease-out">
        <Header />
        <main className={`flex-1 w-full min-w-0 ${isHome ? "" : "pt-24"}`}>
          
            <div
              key={location.pathname}
            >
              <Outlet />
            </div>
          
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  );
};

export default UserLayout;