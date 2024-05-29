const logger = require("../configs/logger.js");
const { updateLatestMessage } = require("../services/conversation.service.js");
const { createMsg, populateMsg, getConvoMessages } = require("../services/message.service.js");

module.exports.sendMessage=async (req,res,next)=>{
    try {
        const user_id=req.user.userId;
        const {message,convo_id,files}=req.body;
        if((!convo_id)||(!message && !files)){
            logger.error("Please Provide Convo_id and Message Data");
            return res.sendStatus(400);
            const msgData={
                sender:user_id,
                message:message,
                conversation:convo_id,
                files:files || [],
            }
            const newMsg=await createMsg(msgData);
            const populatedMsg=await populateMsg(newMsg._id);
            await updateLatestMessage(convo_id,newMsg);
            res.json(populatedMsg);
        }
    } catch (error) {
        next(error);
    }
}
module.exports.getMessages=async (req,res,next)=>{
    try {
        const {convo_id}=req.params;
        if(!convo_id){
            logger.error("Please Provide Convo_id in params");
            return res.sendStatus(400);
        }
        const messages=await getConvoMessages(convo_id);
        res.json(messages);
    } catch (error) {
        next(error);
    }
}