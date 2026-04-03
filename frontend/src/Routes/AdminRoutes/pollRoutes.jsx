import { lazy, Suspense } from 'react';
const PollList = lazy(() => import("../../Admin/pages/Poll/PollList"));
const CreatePoll = lazy(() => import("../../Admin/pages/Poll/CreatePoll"));
 
 const pollRoutes = [
  { path: "poll/list",    element: <Suspense fallback={<div>Loading...</div>}><PollList /></Suspense> },
  { path: "poll/create",  element: <Suspense fallback={<div>Loading...</div>}><CreatePoll /></Suspense> },
];
export default pollRoutes;