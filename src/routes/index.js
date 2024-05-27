const express=require("express");
const authRoutes=require("./auth.route.js");
const conversationRoutes=require("./conversation.route.js");
const router=express.Router();


router.use("/auth",authRoutes);
router.use("conversation",conversationRoutes);
module.exports=router;