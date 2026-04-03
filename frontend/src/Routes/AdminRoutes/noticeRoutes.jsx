import React from "react";
import { lazy, Suspense } from 'react';
const NoticeList = lazy(() => import("../../Admin/pages/Notice/NoticeList"));
const AddEditNotice = lazy(() => import("../../Admin/pages/Notice/AddEditNotice"));
const NoticeDetail = lazy(() => import("../../Admin/pages/Notice/NoticeDetail"));
 
 const noticeRoutes = [
  { path: "notice/list",       element: <Suspense fallback={<div>Loading...</div>}><NoticeList /></Suspense> },
  { path: "notice/add",        element: <Suspense fallback={<div>Loading...</div>}><AddEditNotice /></Suspense> },
  { path: "notice/edit/:id",   element: <Suspense fallback={<div>Loading...</div>}><AddEditNotice /></Suspense> },
  { path: "notice/:id",        element: <Suspense fallback={<div>Loading...</div>}><NoticeDetail /></Suspense> },
];
export default noticeRoutes;