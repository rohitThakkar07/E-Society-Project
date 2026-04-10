import { lazy, Suspense } from "react";
import { PageLoader } from "../../components/PageLoader";

const BookFacility = lazy(() => import("../../User/pages/BookFacility"));

// Header nav: Operations → "Book Facilities" → "/facilities"
const FacilityRoutes = [
  {
    path: "facilities",
    element: (
      <Suspense fallback={<PageLoader message="Loading…" />}>
        <BookFacility />
      </Suspense>
    ),
  },
];

export default FacilityRoutes;