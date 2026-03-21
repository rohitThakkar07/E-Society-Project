import PollList   from "../../Admin/pages/Poll/PollList";
import CreatePoll from "../../Admin/pages/Poll/CreatePoll";
 
 const pollRoutes = [
  { path: "poll/list",    element: <PollList /> },
  { path: "poll/create",  element: <CreatePoll /> },
];
export default pollRoutes;