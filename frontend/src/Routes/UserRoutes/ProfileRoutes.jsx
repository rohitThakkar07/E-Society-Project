import { lazy, Suspense } from "react";
import { PageLoader } from "../../components/PageLoader";

const ProfilePage = lazy(() => import("../../User/pages/Profile"));

// Header nav: Profile avatar → "/profile"
const ProfileRoutes = [
  {
    path: "profile",
    element: (
      <Suspense fallback={<PageLoader message="Loading…" />}>
        <ProfilePage />
      </Suspense>
    ),
  },
];

export default ProfileRoutes;