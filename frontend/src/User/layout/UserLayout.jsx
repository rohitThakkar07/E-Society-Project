import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import { ThemeProvider } from "../context/ThemeContext";

const UserLayout = () => (
  <ThemeProvider>
    <div className="user-portal min-h-screen flex flex-col bg-[var(--bg)] text-[var(--text)] transition-[background-color,color] duration-500 ease-out">
      <Header />
      <main className="flex-1 w-full min-w-0 page-in">
        <Outlet />
      </main>
      <Footer />
    </div>
  </ThemeProvider>
);

export default UserLayout;