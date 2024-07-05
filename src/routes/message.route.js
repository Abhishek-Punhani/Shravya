const express = require("express");
const trimRequest = require("trim-request");
const authMiddleware = require("../middlewares/authMiddleware.js");
const {
  sendMessage,
  getMessages,
  editMessage,
  deleteMessage,
} = require("../controllers/message.controller.js");
const router = express.Router();

router.route("/").post(trimRequest.all, authMiddleware, sendMessage);
router.route("/:convo_id").get(trimRequest.all, authMiddleware, getMessages);
router.route("/edit").post(trimRequest.all, authMiddleware, editMessage);
router.route("/delete").post(trimRequest.all, authMiddleware, deleteMessage);
module.exports = router;
