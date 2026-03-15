import React from 'react';
import VisitorDashboard from "../../Admin/pages/Visitors/VisitorDashboard";
import VisitorDetails from "../../Admin/pages/Visitors/VisitorsDetails";
import VisitorReports from "../../Admin/pages/Visitors/VisitorReports";

const visitorRoutes = [
  {
    path: "visitors",
    element: <VisitorDashboard />,
  },
  {
    path: "visitors/list",
    element: <VisitorDashboard />,
  },
  {
    path: "visitors/:id",
    element: <VisitorDetails />,
  },
  {
    path: "visitors/reports",
    element: <VisitorReports />,
  },
];

export default visitorRoutes;