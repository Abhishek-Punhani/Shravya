const mongoose=require("mongoose");
const { trim } = require("validator");
const {ObjectId} =require("mongoose.Schema.Types")


const conversationSchema=mongoose.Schema({
    name:{
        type:String,
        required:[true,"Name is required!"],
        trim:true,
    },
    picture:{
        type:String,
        required:true,
    },
    isGroup:{
        type:Boolean,
        required:true,
        default:false
    },
    users:[
        
        {
            type:ObjectId,
            ref:"User"
        }

    ],
    latestMessage:{
        type:ObjectId,
        ref:"Message"
    },
    admin:{
        type:ObjectId,
        ref:"User"
    }
},{
    collection:'conversations',
    timestamps:true,
});

const ConversationModel=mongoose.models.Conversation || mongoose.model("Conversation",conversationSchema);

module.exports=ConversationModel;