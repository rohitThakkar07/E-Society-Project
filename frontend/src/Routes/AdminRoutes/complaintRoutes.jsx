import React from 'react';
import ComplaintDashboard from "../../Admin/pages/Complaint/ComplaintDashboard";
import ComplaintDetails from "../../Admin/pages/Complaint/ComplaintDetails";
import CreateComplaint from "../../Admin/pages/Complaint/CreateComplaint";

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