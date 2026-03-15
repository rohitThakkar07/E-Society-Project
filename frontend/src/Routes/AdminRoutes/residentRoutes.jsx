import React from 'react';
import Residents from "../../Admin/pages/Residents/Residents";
import ResidentForm from "../../Admin/pages/Residents/ResidentForm";

const residentRoutes = [
  {
    path: "residents",
    element: <Residents />,
  },
  {
    path: "residents/add",
    element: <ResidentForm />,
  },
  {
    path: "residents/edit/:id",
    element: <ResidentForm />,
  },
];

export default residentRoutes;