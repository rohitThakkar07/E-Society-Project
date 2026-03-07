import React from "react";
import Router from './Routes/index';
import { RouterProvider } from "react-router-dom";

function App() {
  return (
     <RouterProvider router={Router} />
  );
}

export default App;