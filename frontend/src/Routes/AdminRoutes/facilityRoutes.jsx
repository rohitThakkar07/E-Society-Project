import React from 'react';
import FacilityDashboard from "../../Admin/pages/Facility/FacilityDashboard";
import BookingForm from "../../Admin/pages/Facility/BookingForm";
import BookingList from "../../Admin/pages/Facility/BookingList";
import BookingCalendar from "../../Admin/pages/Facility/BookingCalendar";
import BookingDetails from "../../Admin/pages/Facility/BookingDetails";
import FacilityForm from '../../Admin/pages/Facility/FacilityForm';
import FacilityList from '../../Admin/pages/Facility/FacilityList';
const facilityRoutes = [
  {
    path: "facility/dashboard",
    element: <FacilityDashboard />,
  },
  {
    path: "facility/add",
    element: <FacilityForm />,
  },
  {
    path: "facility/book",
    element: <BookingForm />,
  },
  {
    path: "facility/list",
    element: <FacilityList />,
  },
  {
    path: "facility/edit/:id",
    element: <FacilityForm />,
  },
  {
    path: "facility-booking/list",
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