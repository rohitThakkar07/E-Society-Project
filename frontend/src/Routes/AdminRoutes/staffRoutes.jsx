import StaffList     from "../../Admin/pages/Staff/StaffList";
import AddEditStaff  from "../../Admin/pages/Staff/AddEditStaff";
import StaffDetail   from "../../Admin/pages/Staff/StaffDetail";
 
const staffRoutes = [
  { path: "staff/list",      element: <StaffList /> },
  { path: "staff/add",       element: <AddEditStaff /> },
  { path: "staff/edit/:id",  element: <AddEditStaff /> },
  { path: "staff/:id",       element: <StaffDetail /> },
];
export default staffRoutes;