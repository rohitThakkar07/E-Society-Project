import { lazy, Suspense } from "react";
import { PageLoader } from "../../components/PageLoader";

const NoticeBoard = lazy(() => import("../../User/pages/NoticeBoard"));

// Header nav: Community → "Notice Board" → "/notices"
const NoticeRoutes = [
  {
    path: "notices",
    element: (
      <Suspense fallback={<PageLoader message="Loading…" />}>
        <NoticeBoard />
      </Suspense>
    ),
  },
];

export default NoticeRoutes;