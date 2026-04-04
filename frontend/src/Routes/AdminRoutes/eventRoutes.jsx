import { lazy, Suspense } from 'react';
import { PageLoader } from "../../components/PageLoader";
const EventList = lazy(() => import("../../Admin/pages/Events/EventList"));
const EventForm = lazy(() => import("../../Admin/pages/Events/EventForm"));

const eventRoutes = [
  { path: "event/list", element: <Suspense fallback={<PageLoader message="Loading…" />}><EventList /></Suspense> },
  { path: "event/add", element: <Suspense fallback={<PageLoader message="Loading…" />}><EventForm /></Suspense> },
  { path: "event/edit/:id", element: <Suspense fallback={<PageLoader message="Loading…" />}><EventForm /></Suspense> },
];

export default eventRoutes;
