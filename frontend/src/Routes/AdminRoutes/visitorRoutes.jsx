import React from 'react';
import VisitorDashboard from "../../Admin/pages/Visitors/VisitorDashboard";
import VisitorDetails from "../../Admin/pages/Visitors/VisitorsDetails";
import VisitorReports from "../../Admin/pages/Visitors/VisitorReports";
import AddVisitor from '../../Admin/pages/Visitors/AddVisitor';
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
    path: "visitor/add",
    element: <AddVisitor />,
  },
  {
    path: "visitor/edit/:id",
    element: <AddVisitor />,
  },
  {
    path: "visitor/:id",
    element: <VisitorDetails />,
  },
  {
    path: "visitor/reports",
    element: <VisitorReports />,
  },
];

export default visitorRoutes;