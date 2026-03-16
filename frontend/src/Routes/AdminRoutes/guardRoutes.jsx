import React from "react";
import Guards from "../../Admin/pages/Guards/Guards";
import AddGuard from "../../Admin/pages/Guards/AddGuard";

const guardRoutes = [
  {
    path: "guards", // Correct: relative to /admin
    element: <Guards />,
  },
  {
    path: "guards/add", // Correct: relative to /admin
    element: <AddGuard />,
  },
  {
    path: "guards/edit/:id",
    element: <AddGuard />,
  },
];

export default guardRoutes;