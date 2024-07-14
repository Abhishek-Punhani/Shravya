const express = require("express");
const trimRequest = require("trim-request");
const authMiddleware = require("../middlewares/authMiddleware.js");
const {
  searchUsers,
  updateUserInfo,
} = require("../controllers/user.controller.js");

const router = express.Router();

router.route("/").get(trimRequest.all, authMiddleware, searchUsers);
router.route("/update").post(trimRequest.all, authMiddleware, updateUserInfo);

module.exports = router;
