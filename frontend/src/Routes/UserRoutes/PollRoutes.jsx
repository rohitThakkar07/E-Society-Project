import { lazy, Suspense } from "react";

const PollsPage = lazy(() => import("../../User/pages/PollPage"));

// Header nav: Operations → "Book Facilities" → "/facilities"
const PollRoutes = [
  {
    path: "/polls",
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <PollsPage />
      </Suspense>
    ),
  },
];

export default PollRoutes;