import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Header from "./Header";
import Footer from "./Footer";
import { ThemeProvider } from "../context/ThemeContext";
import ScrollToTop from "../../components/ScrollToTop";

const UserLayout = () => {
  const location = useLocation();

  return (
    <ThemeProvider>
      <ScrollToTop />
      <div className="user-portal min-h-screen flex flex-col bg-[var(--bg)] text-[var(--text)] transition-[background-color,color] duration-500 ease-out">
        <Header />
        <main className="flex-1 w-full min-w-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  );
};

export default UserLayout;