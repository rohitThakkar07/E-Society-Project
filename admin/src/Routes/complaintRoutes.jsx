import React from 'react';
import ComplaintDashboard from "../components/pages/Complaint/ComplaintDashboard";
import ComplaintDetails from "../components/pages/Complaint/ComplaintDetails";
import CreateComplaint from "../components/pages/Complaint/CreateComplaint";

const complaintRoutes = [
  {
    path: "complaints",
    element: <ComplaintDashboard />,
  },
  {
    path: "complaints/create",
    element: <CreateComplaint />,
  },
  {
    path: "complaints/:id",
    element: <ComplaintDetails />,
  },
];

export default complaintRoutes;