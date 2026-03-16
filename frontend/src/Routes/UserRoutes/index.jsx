import React, { lazy, Suspense } from "react";

// Layouts
const UserLayout = lazy(() => import("../../User/layout/UserLayout"));

// Route 
import HomeRoutes from "./HomeRoutes";
import EventRoutes from "./eventRoutes";
import InvoiceRoutes from "./InvoiceRoutes";
import complaintRoutes from "./ComplaintRoutes";
import eventRoutes from "./eventRoutes";
import Login from "../../User/pages/Login";
import AuthContext from "../../User/context/AuthContext";

const UserRouter = [
  // USER SECTION
  {
    path: "/",
    element: (
      <Suspense fallback={<div>Loading App...</div>}>
        <AuthContext>
          <UserLayout />
        </AuthContext>
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