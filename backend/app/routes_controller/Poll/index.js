const express = require("express");
const router = express.Router();
const ctrl = require("./pollController");

router.post("/create",       ctrl.createPoll);
router.get("/list",          ctrl.getAllPolls);
router.get("/:id",           ctrl.getPollById);
router.post("/:id/vote",     ctrl.castVote);
router.put("/:id/close",     ctrl.closePoll);
router.delete("/delete/:id", ctrl.deletePoll);

module.exports = router;
// Register in server.js: app.use("/poll", require("./polls/pollRoutes"));