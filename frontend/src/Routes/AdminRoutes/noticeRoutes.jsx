import React from "react";
import NoticeList     from "../../Admin/pages/Notice/NoticeList";
import AddEditNotice  from "../../Admin/pages/Notice/AddEditNotice";
import NoticeDetail   from "../../Admin/pages/Notice/NoticeDetail";
 
 const noticeRoutes = [
  { path: "notice/list",       element: <NoticeList /> },
  { path: "notice/add",        element: <AddEditNotice /> },
  { path: "notice/edit/:id",   element: <AddEditNotice /> },
  { path: "notice/:id",        element: <NoticeDetail /> },
];
export default noticeRoutes;