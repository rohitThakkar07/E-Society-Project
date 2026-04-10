import { lazy, Suspense } from "react";
import { PageLoader } from "../../components/PageLoader";

const PollsPage = lazy(() => import("../../User/pages/PollPage"));

// Header nav: Operations → "Book Facilities" → "/facilities"
const PollRoutes = [
  {
    path: "/polls",
    element: (
      <Suspense fallback={<PageLoader message="Loading…" />}>
        <PollsPage />
      </Suspense>
    ),
  },
];

export default PollRoutes;