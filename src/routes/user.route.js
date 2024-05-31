const express=require("express");
const trimRequest=require("trim-request");
const authMiddleware=require("../middlewares/authMiddleware.js");
const { searchUsers } = require("../controllers/user.controller.js");

const router=express.Router();

router.route("/").get(trimRequest.all,authMiddleware,searchUsers);

module.exports=router;