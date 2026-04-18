import { createBrowserRouter } from "react-router-dom";
import UserRouter from "./UserRoutes/index";
import AdminRouter from "./AdminRoutes/index";
import guardPortalRoutes from "./UserRoutes/GuardRoutes";
import { lazy, Suspense } from "react";
import { PageLoader } from "../components/PageLoader";
import NotFound from "../components/NotFound";

const GuardLayout = lazy(() => import("../User/layout/GuardLayout"));
const GuardAuthContext = lazy(() => import("../User/context/GuardAuthContext"));

const router = createBrowserRouter([
  ...UserRouter,
  ...AdminRouter,
   {
    path: "/guard",
    element: (
      <Suspense fallback={<PageLoader message="Loading guard portal…" />}>
        <GuardAuthContext>
          <GuardLayout />
        </GuardAuthContext>
      </Suspense>
    ),
    children: guardPortalRoutes,
  },
  {
    path: "*",
    element: <NotFound />
  }
]);

export default router;