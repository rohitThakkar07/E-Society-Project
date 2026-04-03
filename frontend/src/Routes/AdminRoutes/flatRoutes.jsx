import { lazy, Suspense } from 'react';
const FlatList = lazy(() => import("../../Admin/pages/Flats/FlatList"));
const AddEditFlat = lazy(() => import("../../Admin/pages/Flats/AddEditFlat"));
 
const flatRoutes = [
  { path: "flat/list",      element: <Suspense fallback={<div>Loading...</div>}><FlatList /></Suspense> },
  { path: "flat/add",       element: <Suspense fallback={<div>Loading...</div>}><AddEditFlat /></Suspense> },
  { path: "flat/edit/:id",  element: <Suspense fallback={<div>Loading...</div>}><AddEditFlat /></Suspense> },
];

export default flatRoutes;
// import React from "react";
// import Flats from "../../Admin/pages/Flats/Flats";
// import AddFlat from "../../Admin/pages/Flats/AddFlat";
// import FlatDetails from "../../Admin/pages/Flats/FlatDetails";

// const flatRoutes = [
//   {
//     path: "flats",
//     element: <Flats />,
//   },
//   {
//     path: "flats/add",
//     element: <AddFlat />,
//   },
//   {
//     path: "flats/edit/:id",
//     element: <AddFlat />,
//   },
//   {
//     path: "flats/:id",
//     element: <FlatDetails />,
//   },
// ];

// export default flatRoutes;