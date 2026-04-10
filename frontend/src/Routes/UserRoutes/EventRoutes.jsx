import { lazy } from "react";

const EventsCalendar = lazy(() => import("../../User/pages/EventsCalander"));

// Header nav: Community → "Events Calendar" → "/events"
const EventRoutes = [
  {
    path: "events",
    element: <EventsCalendar />,
  },
];

export default EventRoutes;