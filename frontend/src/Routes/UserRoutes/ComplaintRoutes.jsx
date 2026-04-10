import { lazy } from "react";

const RaiseComplaint = lazy(() => import("../../User/pages/RaiseComplaint"));
const RaiseComplaintForm = lazy(() => import("../../User/pages/RaiseComplaintForm"));

// Header nav: "Help Desk" → "/raise-complaint"
const ComplaintRoutes = [
  {
    path: "raise-complaint",
    element: <RaiseComplaint />,
  },
  {
    path: "raise-complaint/new",
    element: <RaiseComplaintForm />,
  },
];

export default ComplaintRoutes;
