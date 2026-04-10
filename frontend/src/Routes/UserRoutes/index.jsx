import React, { lazy, Suspense } from "react";
import { PageLoader } from "../../components/PageLoader";

// Layout
const UserLayout = lazy(() => import("../../User/layout/UserLayout"));

// Auth
const Login = lazy(() => import("../../User/pages/Login"));
const AuthContext = lazy(() => import("../../User/context/AuthContext"));

// Route files
import HomeRoutes        from "./HomeRoutes";
import ComplaintRoutes   from "./ComplaintRoutes";
import EventRoutes       from "./EventRoutes";
import MaintenanceRoutes from "./MaintainenceRoutes";
import InvoiceRoutes     from "./InvoiceRoutes";
import VisitorRoutes     from "./VisitorRoutes";
import FacilityRoutes    from "./FacilityRoutes";
import NoticeRoutes      from "./NoticeRoutes";
import ProfileRoutes     from "./ProfileRoutes";
import PollRoutes from './PollRoutes';
const UserRouter = [

  // PUBLIC — visitors can see home + login
  {
    path: "/",
    element: (
      <Suspense fallback={<PageLoader message="Loading portal…" />}>
        <UserLayout />
      </Suspense>
    ),
    children: [
      ...HomeRoutes,  // index "/" is public
    ],
  },

  //  PROTECTED — login required
  {
    element: (
      <Suspense fallback={<PageLoader message="Loading portal…" />}>
        <AuthContext />
      </Suspense>
    ),
    children: [
      {
        element: <UserLayout />,
        children: [
          ...ComplaintRoutes,
          ...EventRoutes,
          ...MaintenanceRoutes,
          ...InvoiceRoutes,
          ...VisitorRoutes,
          ...FacilityRoutes,
          ...NoticeRoutes,
          ...ProfileRoutes,
          ...PollRoutes,
        ],
      },
    ],
  },

  // LOGIN PAGE
  {
    path: "/login",
    element: <Login />,
  },
];

export default UserRouter;