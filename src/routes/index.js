const express=require("express");
const authRoutes=require("./auth.route.js");
const conversationRoutes=require("./conversation.route.js");
const messageRoutes=require("./message.route.js");
const router=express.Router();


router.use("/auth",authRoutes);
router.use("conversation",conversationRoutes);
router.use("/message",messageRoutes);
module.exports=router;