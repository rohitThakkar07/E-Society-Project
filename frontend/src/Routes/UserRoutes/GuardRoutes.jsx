import Dashboard from "../../Guard/GuardDashboard";
import AddVisitorEntry from "../../Guard/pages/AddVisitorEntry";
import VisitorManagement from "../../Guard/pages/VisitorManagement";
import SearchResident from "../../Guard/pages/SearchResident";

const guardPortalRoutes = [
  {
    index: true,
    element: <Dashboard />,
  },
  {
    path: "visitor/add",
    element: <AddVisitorEntry />,
  },
  {
    path: "visitors",
    element: <VisitorManagement />,
  },
  {
    path: "search-resident",
    element: <SearchResident />,
  },
];

export default guardPortalRoutes;