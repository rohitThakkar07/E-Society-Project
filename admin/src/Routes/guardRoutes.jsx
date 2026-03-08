import React from 'react';
import Guards from "../components/pages/Guards/Guards";
import AddGuard from '../components/pages/Guards/AddGuard';

const guardRoutes = [
  {
    path: "guards",
    element: <Guards />,
  },
  {
    path: "/guards/add",
    element: <AddGuard />,
  },
];

export default guardRoutes;