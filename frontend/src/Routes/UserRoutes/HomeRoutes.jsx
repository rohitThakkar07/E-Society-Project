import { lazy } from "react";

const Home = lazy(() => import("../../User/pages/Home"));

const HomeRoutes = [
  {
    index: true,
    path: "/",
    element: <Home />,
  },
];

export default HomeRoutes;