const express = require("express");
const router = express.Router();
const ctrl = require("./lib/controller");

router.post("/create", ctrl.createNotice);
router.get("/list", ctrl.getAllNotices);
router.get("/:id", ctrl.getNoticeById);
router.put("/update/:id", ctrl.updateNotice);
router.delete("/delete/:id", ctrl.deleteNotice);

module.exports = router;