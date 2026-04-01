import { createBrowserRouter } from "react-router-dom";
import UserRouter from "./UserRoutes/index";
import AdminRouter from "./AdminRoutes/index";
import guardPortalRoutes from "./UserRoutes/GuardRoutes";
import { lazy, Suspense } from "react";

const GuardLayout = lazy(() => import("../User/layout/GuardLayout"));
const GuardAuthContext = lazy(() => import("../User/context/GuardAuthContext"));

const router = createBrowserRouter([
  ...UserRouter,
  ...AdminRouter,
   {
    path: "/guard",
    element: (
      <Suspense fallback={<div>Loading guard portal...</div>}>
        <GuardAuthContext>
          <GuardLayout />
        </GuardAuthContext>
      </Suspense>
    ),
    children: guardPortalRoutes,
  },
]);

export default router;