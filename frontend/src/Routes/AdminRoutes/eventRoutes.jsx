import { lazy, Suspense } from 'react';
const EventList = lazy(() => import("../../Admin/pages/Events/EventList"));
const EventForm = lazy(() => import("../../Admin/pages/Events/EventForm"));

const eventRoutes = [
  { path: "event/list", element: <Suspense fallback={<div>Loading...</div>}><EventList /></Suspense> },
  { path: "event/add", element: <Suspense fallback={<div>Loading...</div>}><EventForm /></Suspense> },
  { path: "event/edit/:id", element: <Suspense fallback={<div>Loading...</div>}><EventForm /></Suspense> },
];

export default eventRoutes;
