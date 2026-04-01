import VisitorManagement from "../../Guard/pages/VisitorManagement";

// Header nav: Operations → "Visitor Management" → "/visitors"
const VisitorRoutes = [
  {
    path: "visitors",
    element: <VisitorManagement />,
  },
  {
    path: "gate-logs",
    element: <VisitorManagement />,
  },
];

export default VisitorRoutes;