import React from 'react';
import FacilityDashboard from "../components/pages/Facility/FacilityDashboard";
import BookingForm from "../components/pages/Facility/BookingForm";
import BookingList from "../components/pages/Facility/BookingList";
import BookingCalendar from "../components/pages/Facility/BookingCalendar";
import BookingDetails from "../components/pages/Facility/BookingDetails";

const facilityRoutes = [
  {
    path: "facility/dashboard",
    element: <FacilityDashboard />,
  },
  {
    path: "facility/book",
    element: <BookingForm />,
  },
  {
    path: "facility/list",
    element: <BookingList />,
  },
  {
    path: "facility/calendar",
    element: <BookingCalendar />,
  },
  {
    path: "facility/booking/:id",
    element: <BookingDetails />,
  },
];

export default facilityRoutes;