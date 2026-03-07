import React from 'react';
import Residents from "../components/pages/Residents/Residents";
import AddResident from "../components/pages/Residents/ResidentForm";

const residentRoutes = [
  {
    path: "residents",
    element: <Residents />,
  },
  {
    path: "residents/add",
    element: <AddResident />,
  },
];

export default residentRoutes;