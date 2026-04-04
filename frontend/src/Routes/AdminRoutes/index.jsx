import React, { lazy, Suspense } from "react";
import { PageLoader } from "../../components/PageLoader";

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
import pollRoutes       from "./pollRoutes";
import eventRoutes      from "./eventRoutes";

import AuthContext from "../../Admin/context/AuthContext";

const AdminRouter = [
  {
    path: "/admin",
    element: (
      <Suspense fallback={<PageLoader message="Loading admin…" />}>
        <AuthContext>
          <AdminLayout />
        </AuthContext>
      </Suspense>
    ),
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<PageLoader message="Loading dashboard…" />}>
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
      ...pollRoutes,
      ...eventRoutes,
    ],
  },
];

export default AdminRouter;