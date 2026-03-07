import React from 'react';
import { createBrowserRouter } from "react-router-dom";
import AdminLayout from "../components/common/AdminLayout";
import AdminDashboard from "../components/AdminDashboard";
import residentRoutes from "./residentRoutes";
import guardRoutes from "./guardRoutes";
import visitorRoutes from "./visitorRoutes";
import facilityRoutes from "./facilityRoutes";
import maintenanceRoutes from "./maintenanceRoutes";
import expenseRoutes from "./expenseRoute";
import roleRoutes from "./roleRoutes";
import complaintRoutes from "./complaintRoutes";
import paymentRoutes from "./paymentRoutes";

const Router = createBrowserRouter([
  {
    path: "/",
    element: <AdminLayout />,
    children: [
      { index: true, element: <AdminDashboard /> },

      ...residentRoutes,
      ...guardRoutes,
      ...visitorRoutes,
      ...facilityRoutes,
      ...maintenanceRoutes,
      ...expenseRoutes,
      ...roleRoutes,
      ...complaintRoutes,
      ...paymentRoutes,
    ],
  },
]);

export default Router;