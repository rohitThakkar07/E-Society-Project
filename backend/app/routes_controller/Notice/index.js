const express = require("express");
const router = express.Router();
const ctrl = require("./lib/controller");

router.post("/create", ctrl.createNotice);
router.get("/list", ctrl.getAllNotices);
router.get("/:id", ctrl.getNoticeById);
router.put("/update/:id", ctrl.updateNotice);
router.delete("/delete/:id", ctrl.deleteNotice);

module.exports = router;
// Register in server.js: app.use("/notice", require("./notices/noticeRoutes"));

// const express = require("express");
// const router = express.Router();
// const { validationResult } = require("express-validator");
// const controller = require("./lib/controller");
// const { noticeValidation } = require("./lib/validation");

// const validate = (req, res, next) => {
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     return res.status(400).json({ success: false, errors: errors.array() });
//   }
//   next();
// };

// // GET    /api/notices/list              All notices (filterable by type, isActive)
// router.get("/list", controller.getAllNotices);

// // GET    /api/notices/:id               Single notice
// router.get("/:id", controller.getNoticeById);

// // POST   /api/notices/create            Create notice/event/poll
// router.post("/create", noticeValidation, validate, controller.createNotice);

// // PUT    /api/notices/update/:id        Update notice
// router.put("/update/:id", controller.updateNotice);

// // PATCH  /api/notices/:id/toggle        Toggle active/inactive
// router.patch("/:id/toggle", controller.toggleActive);

// // POST   /api/notices/:id/vote          Vote on a poll
// router.post("/:id/vote", controller.votePoll);

// // DELETE /api/notices/delete/:id        Delete notice
// router.delete("/delete/:id", controller.deleteNotice);

// module.exports = router;