import { createBrowserRouter } from "react-router-dom";
import UserRouter from "./UserRoutes/index";
import AdminRouter from "./AdminRoutes/index";

const router = createBrowserRouter([
  ...UserRouter,
  ...AdminRouter,
]);

export default router;