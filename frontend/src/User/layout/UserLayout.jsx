import React from "react";
import { Outlet } from "react-router-dom";
// Note: Ensure these components exist in your src/components/layout folder
import Header from "../../User/layout/Header"; 
import Footer from "../../User/layout/Footer";

const UserLayout = () => {
  return (
    <div className="user-layout-container">
      <Header />
      <main className="content-area">
        {/* Outlet renders the child components from HomeRoutes.jsx */}
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default UserLayout;