import FlatList    from "../../Admin/pages/Flats/FlatList";
import AddEditFlat from "../../Admin/pages/Flats/AddEditFlat";
 
const flatRoutes = [
  { path: "flat/list",      element: <FlatList /> },
  { path: "flat/add",       element: <AddEditFlat /> },
  { path: "flat/edit/:id",  element: <AddEditFlat /> },
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