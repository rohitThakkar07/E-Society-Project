import React, { lazy, Suspense } from "react";

const AdminLayout    = lazy(() => import("../../Admin/common/AdminLayout"));
const AdminDashboard = lazy(() => import("../../Admin/AdminDashboard"));

// ── Existing routes ──────────────────────────────────────────────────────────
import residentRoutes   from "./residentRoutes";
import guardRoutes      from "./guardRoutes";
import visitorRoutes    from "./visitorRoutes";
import facilityRoutes   from "./facilityRoutes";
import maintenanceRoutes from "./maintenanceRoutes";
import expenseRoutes    from "./expenseRoute";
import roleRoutes       from "./roleRoutes";
import complaintRoutes  from "./complaintRoutes";
import paymentRoutes    from "./paymentRoutes";
import flatRoutes       from "./flatRoutes";

// ── NEW routes (copy files from the zip into this same routes folder) ────────
import noticeRoutes     from "./noticeRoutes";
import alertRoutes      from "./alertRoutes";
import pollRoutes       from "./pollRoutes";
import eventRoutes      from "./eventRoutes";

import AuthContext from "../../Admin/context/AuthContext";

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
        ),
      },

      // ── Existing ────────────────────────────────────────────────────────
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

      ...noticeRoutes,
      ...alertRoutes,
      ...pollRoutes,
      ...eventRoutes,
    ],
  },
];

export default AdminRouter;