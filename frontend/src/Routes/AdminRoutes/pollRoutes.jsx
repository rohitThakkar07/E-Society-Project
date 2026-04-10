import { lazy, Suspense } from 'react';
import { PageLoader } from "../../components/PageLoader";
const PollList = lazy(() => import("../../Admin/pages/Poll/PollList"));
const CreatePoll = lazy(() => import("../../Admin/pages/Poll/CreatePoll"));
 
 const pollRoutes = [
  { path: "poll/list",    element: <Suspense fallback={<PageLoader message="Loading…" />}><PollList /></Suspense> },
  { path: "poll/create",  element: <Suspense fallback={<PageLoader message="Loading…" />}><CreatePoll /></Suspense> },
];
export default pollRoutes;