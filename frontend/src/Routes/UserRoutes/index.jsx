import React, { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";

// Layouts
const UserLayout = lazy(() => import("../../User/layout/UserLayout"));

// Route 
import HomeRoutes from "./HomeRoutes";
import EventRoutes from "./eventRoutes";
import InvoiceRoutes from "./InvoiceRoutes";
import complaintRoutes from "./ComplaintRoutes";
import eventRoutes from "./eventRoutes";
import Login from "../../User/pages/Login";

const UserRouter = [
  // USER SECTION
  {
    path: "/",
    element: (
      <Suspense fallback={<div>Loading App...</div>}>
        <UserLayout />
      </Suspense>
    ),
    children: [
     ...HomeRoutes,
     ...complaintRoutes,
     ...eventRoutes,
     ...InvoiceRoutes,
     ...EventRoutes,
    ],
  },
  {
    path:"login",
    element:<Login/>
  }
];
export default UserRouter;