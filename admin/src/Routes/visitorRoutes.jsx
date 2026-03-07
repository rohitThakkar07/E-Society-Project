import React from 'react';
import VisitorDashboard from "../components/pages/Visitors/VisitorDashboard";
import VisitorDetails from "../components/pages/Visitors/VisitorsDetails";
import VisitorReports from "../components/pages/Visitors/VisitorReports";

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