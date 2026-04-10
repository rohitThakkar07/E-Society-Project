import React from 'react';
import FacilityDashboard from "../../Admin/pages/Facility/FacilityDashboard";
import BookingForm from "../../Admin/pages/Facility/BookingForm";
import BookingList from "../../Admin/pages/Facility/BookingList";
import BookingCalendar from "../../Admin/pages/Facility/BookingCalendar";
import BookingDetails from "../../Admin/pages/Facility/BookingDetails";
import FacilityForm from '../../Admin/pages/Facility/FacilityForm';
import FacilityList from '../../Admin/pages/Facility/FacilityList';

// FIX: All paths are relative to the /admin/ parent route.
// If your router wraps these under "/admin", these paths become:
//   /admin/facility/dashboard, /admin/facility/booking/:id, etc.

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
    path: "facility/edit/:id",
    element: <FacilityForm />,
  },
  {
    path: "facility/list",
    element: <FacilityList />,
  },
  {
    path: "facility/book",
    element: <BookingForm />,
  },
  {
    // FIX: Was "facility-booking/list" — now matches navigate("/admin/facility-booking/list")
    path: "facility-booking/list",
    element: <BookingList />,
  },
  {
    path: "facility/calendar",
    element: <BookingCalendar />,
  },
  {
    // FIX: Was "facility/booking/:id" — now matches navigate("/admin/facility/booking/:id")
    path: "facility/booking/:id",
    element: <BookingDetails />,
  },
];

export default facilityRoutes;