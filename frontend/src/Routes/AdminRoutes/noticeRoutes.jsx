import React from "react";
import { lazy, Suspense } from 'react';
import { PageLoader } from "../../components/PageLoader";
const NoticeList = lazy(() => import("../../Admin/pages/Notice/NoticeList"));
const AddEditNotice = lazy(() => import("../../Admin/pages/Notice/AddEditNotice"));
const NoticeDetail = lazy(() => import("../../Admin/pages/Notice/NoticeDetail"));
 
 const noticeRoutes = [
  { path: "notice/list",       element: <Suspense fallback={<PageLoader message="Loading…" />}><NoticeList /></Suspense> },
  { path: "notice/add",        element: <Suspense fallback={<PageLoader message="Loading…" />}><AddEditNotice /></Suspense> },
  { path: "notice/edit/:id",   element: <Suspense fallback={<PageLoader message="Loading…" />}><AddEditNotice /></Suspense> },
  { path: "notice/:id",        element: <Suspense fallback={<PageLoader message="Loading…" />}><NoticeDetail /></Suspense> },
];
export default noticeRoutes;