import { lazy, Suspense } from "react";

const NoticeBoard = lazy(() => import("../../User/pages/NoticeBoard"));

// Header nav: Community → "Notice Board" → "/notices"
const NoticeRoutes = [
  {
    path: "notices",
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <NoticeBoard />
      </Suspense>
    ),
  },
];

export default NoticeRoutes;