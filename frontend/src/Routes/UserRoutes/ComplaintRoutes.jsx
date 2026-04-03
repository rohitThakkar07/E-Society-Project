import { lazy } from "react";

const RaiseComplaint = lazy(() => import("../../User/pages/RaiseComplaint"));

// Header nav: "Help Desk" → "/raise-complaint"
const ComplaintRoutes = [
  {
    path: "raise-complaint",
    element: <RaiseComplaint />,
  },
];

export default ComplaintRoutes;