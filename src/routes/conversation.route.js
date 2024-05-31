const express=require("express");
const trimRequest = require("trim-request");
const router=express.Router();
const authMiddleware=require("../middlewares/authMiddleware.js");
const { create_open_conversation,getConversations } = require("../controllers/conversation.controller.js");
console.log(typeof create_open_conversation); // Should log 'function'
console.log(typeof getConversations);  
router.route("/").post(trimRequest.all,authMiddleware,create_open_conversation)
                 .get(trimRequest.all,authMiddleware,getConversations)

module.exports=router;