import { lazy, Suspense } from "react";

const BookFacility = lazy(() => import("../../User/pages/BookFacility"));

// Header nav: Operations → "Book Facilities" → "/facilities"
const FacilityRoutes = [
  {
    path: "facilities",
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <BookFacility />
      </Suspense>
    ),
  },
];

export default FacilityRoutes;