import React from 'react';
import Guards from "../../Admin/pages/Guards/Guards";
import AddGuard from '../../Admin/pages/Guards/AddGuard';

const guardRoutes = [
  {
    path: "admin/guards",
    element: <Guards />,
  },
  {
    path: "admin/guards/add",
    element: <AddGuard />,
  },
];

export default guardRoutes;