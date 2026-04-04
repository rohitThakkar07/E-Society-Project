import React from 'react';
import { lazy, Suspense } from 'react';
import { PageLoader } from "../../components/PageLoader";
const FacilityDashboard = lazy(() => import("../../Admin/pages/Facility/FacilityDashboard"));
const BookingForm = lazy(() => import("../../Admin/pages/Facility/BookingForm"));
const BookingList = lazy(() => import("../../Admin/pages/Facility/BookingList"));
const BookingCalendar = lazy(() => import("../../Admin/pages/Facility/BookingCalendar"));
const BookingDetails = lazy(() => import("../../Admin/pages/Facility/BookingDetails"));
const FacilityForm = lazy(() => import('../../Admin/pages/Facility/FacilityForm'));
const FacilityList = lazy(() => import('../../Admin/pages/Facility/FacilityList'));

// FIX: All paths are relative to the /admin/ parent route.
// If your router wraps these under "/admin", these paths become:
//   /admin/facility/dashboard, /admin/facility/booking/:id, etc.

const facilityRoutes = [
  {
    path: "facility/dashboard",
    element: <Suspense fallback={<PageLoader message="Loading…" />}><FacilityDashboard /></Suspense>,
  },
  {
    path: "facility/add",
    element: <Suspense fallback={<PageLoader message="Loading…" />}><FacilityForm /></Suspense>,
  },
  {
    path: "facility/edit/:id",
    element: <Suspense fallback={<PageLoader message="Loading…" />}><FacilityForm /></Suspense>,
  },
  {
    path: "facility/list",
    element: <Suspense fallback={<PageLoader message="Loading…" />}><FacilityList /></Suspense>,
  },
  {
    path: "facility/book",
    element: <Suspense fallback={<PageLoader message="Loading…" />}><BookingForm /></Suspense>,
  },
  {
    // FIX: Was "facility-booking/list" — now matches navigate("/admin/facility-booking/list")
    path: "facility-booking/list",
    element: <Suspense fallback={<PageLoader message="Loading…" />}><BookingList /></Suspense>,
  },
  {
    path: "facility/calendar",
    element: <Suspense fallback={<PageLoader message="Loading…" />}><BookingCalendar /></Suspense>,
  },
  {
    // FIX: Was "facility/booking/:id" — now matches navigate("/admin/facility/booking/:id")
    path: "facility/booking/:id",
    element: <Suspense fallback={<PageLoader message="Loading…" />}><BookingDetails /></Suspense>,
  },
];

export default facilityRoutes;