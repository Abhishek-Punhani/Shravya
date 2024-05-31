const express=require("express");
const router=express.Router();
const authRoutes=require("./auth.route.js");
const conversationRoutes=require("./conversation.route.js");
const messageRoutes=require("./message.route.js");

const userRoutes=require("./user.route.js")

router.use("/auth",authRoutes);
router.use("/user",userRoutes);
router.use("/conversation",conversationRoutes);
router.use("/message",messageRoutes);
module.exports=router;