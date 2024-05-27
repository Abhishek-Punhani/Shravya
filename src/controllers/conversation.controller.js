const createHttpError = require("http-errors");
const { doesConversationExist } = require("../services/conversation.js");
const { findUser } = require("../services/user.service.js");
const { createConversation, getUserConversations, populateConversation } = require("../services/conversation.service.js");

module.exports.create_open_conversation=async (req,res,next)=>{
    try {
        const sender_id=req.user.userId;
        const {reciever_id}=req.body;
        // check if reciever_id is present or not
        if(!reciever_id){
            throw createHttpError.BadRequest("Please Provide the user id you wanna chat with !")
        }
        // check if chat exist or not
        let existed_conversation=doesConversationExist(sender_id,reciever_id);
        if(existed_conversation){
            res.json(existed_conversation);
        }else{
            let reciever_user=await findUser(reciever_id);
            let convoData={
                name:reciever_user.name,
                isGroup:false,
                users:[sender_id,reciever_id],
            }
            const newConvo=await createConversation(newConvo);
            const populatedConvo=await populateConversation(newConvo)
            res.json(populatedConvo);
        }
    } catch (error) {
      next(error);
    }
}


module.exports.getConversations=async (req,res,next)=>{
    try {
        const user_id=req.user.userId;
        const conversations=await getUserConversations(user_id);
        res.status(200).json(conversations);
    } catch (error) {
        next(error);
    }
}