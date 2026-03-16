import React, { lazy, Suspense } from "react";
// Removed createBrowserRouter from here since this is now just a route array

const AdminLayout = lazy(() => import("../../Admin/common/AdminLayout"));
const AdminDashboard = lazy(() => import("../../Admin/AdminDashboard"));

import residentRoutes from "./residentRoutes";
import guardRoutes from "./guardRoutes";
import visitorRoutes from "./visitorRoutes";
import facilityRoutes from "./facilityRoutes";
import maintenanceRoutes from "./maintenanceRoutes";
import expenseRoutes from "./expenseRoute";
import roleRoutes from "./roleRoutes";
import complaintRoutes from "./complaintRoutes";
import paymentRoutes from "./paymentRoutes";
import flatRoutes from "./flatRoutes";
import AuthContext from "../../Admin/context/AuthContext";

// A reusable loader component for the suspense fallback
const AdminLoader = () => (

  
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
  </div>
);

const AdminRouter = [
  {
    path: "/admin",
    element: (
      <Suspense fallback={<AdminLoader />}>
        <AuthContext>
          <AdminLayout />
        </AuthContext>
      </Suspense>
    ),
    children: [
      { 
        index: true, 
        element: (

          <Suspense fallback={<AdminLoader />}>
            <AuthContext>
              <AdminDashboard />
            </AuthContext>
          </Suspense>
        ) 
      },
      ...residentRoutes,
      ...guardRoutes,
      ...visitorRoutes,
      ...facilityRoutes,
      ...maintenanceRoutes,
      ...expenseRoutes,
      ...roleRoutes,
      ...complaintRoutes,
      ...paymentRoutes,
      ...flatRoutes,
    ],
  },
];

export default AdminRouter;