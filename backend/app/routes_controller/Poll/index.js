const express = require("express");
const router = express.Router();
const ctrl = require("./lib/controller");
const authMiddleware = require("../../middlewares/authMiddleware");

router.get("/list",          authMiddleware, ctrl.getAllPolls);
router.get("/:id",           authMiddleware, ctrl.getPollById);
router.post("/:id/vote",     authMiddleware, ctrl.castVote);

// Admin-only or higher privilege needed for these
router.post("/create",       authMiddleware, ctrl.createPoll);
router.put("/:id/close",     authMiddleware, ctrl.closePoll);
router.delete("/delete/:id", authMiddleware, ctrl.deletePoll);

module.exports = router;



