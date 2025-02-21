const express = require("express");
const trimRequest = require("trim-request");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware.js");
const {
  create_open_conversation,
  getConversations,
  createGroup,
  generateToken,
  deleteConversation,
} = require("../controllers/conversation.controller.js");
router
  .route("/")
  .post(trimRequest.all, authMiddleware, create_open_conversation)
  .get(trimRequest.all, authMiddleware, getConversations);
router.route("/group").post(trimRequest.all, authMiddleware, createGroup);
router
  .route("/get_zego_token")
  .get(trimRequest.all, authMiddleware, generateToken);
router
  .route("/delete")
  .post(trimRequest.all, authMiddleware, deleteConversation);
module.exports = router;
