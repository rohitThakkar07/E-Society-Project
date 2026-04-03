import { lazy, Suspense } from "react";

const ProfilePage = lazy(() => import("../../User/pages/Profile"));

// Header nav: Profile avatar → "/profile"
const ProfileRoutes = [
  {
    path: "profile",
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <ProfilePage />
      </Suspense>
    ),
  },
];

export default ProfileRoutes;