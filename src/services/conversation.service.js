const createHttpError = require("http-errors");
const ConversationModel = require("../models/conversationModel.js");
const UserModel = require("../models/userModel.js");
const logger = require("../configs/logger.js");
const { getConvoMessages, deleteMsg } = require("./message.service.js");

module.exports.doesConversationExist = async (sender_id, reciever_id) => {
  let convo = await ConversationModel.find({
    isGroup: false,
    $and: [
      { users: { $elemMatch: { $eq: sender_id } } },
      { users: { $elemMatch: { $eq: reciever_id } } },
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage");
  if (!convo) {
    return null;
  }
  // populating messages
  convo = await UserModel.populate(convo, {
    path: "latestMessage.sender",
    select: "name email status picture",
  });

  return convo[0]; // since find willl return an array
};

module.exports.createConversation = async (data) => {
  const newConvo = await ConversationModel.create(data);
  if (!newConvo)
    throw createHttpError.BadRequest("OOPS SOMETHING WENT WRONG !");
  return newConvo;
};

module.exports.populateConversation = async (
  id,
  fieldsToPopulate,
  fieldsToRemove
) => {
  const populatedConvo = await ConversationModel.findOne({ _id: id }).populate(
    fieldsToPopulate,
    fieldsToRemove
  );
  if (!populatedConvo)
    throw createHttpError.BadRequest("OOPS SOMETHING WENT WRONG !");
  return populatedConvo;
};

module.exports.getUserConversations = async (user_id) => {
  let conversations;
  await ConversationModel.find({
    users: { $elemMatch: { $eq: user_id } },
  })
    .populate("users", "-password")
    .populate("admin", "-password")
    .populate("latestMessage")
    .then(async (results) => {
      results = await UserModel.populate(results, {
        path: "latestMessage.sender",
        select: "name email picture status",
      });
      conversations = results;
    })
    .catch((err) => {
      logger.error(err);
      throw createHttpError.BadRequest("OOPS SOMETHING WENT WRONG !");
    });
  return conversations;
};

module.exports.updateLatestMessage = async (convo_id, message) => {
  let updatedLatestMessage = await ConversationModel.findByIdAndUpdate(
    convo_id,
    {
      latestMessage: message,
    }
  );
  if (!updatedLatestMessage)
    throw createHttpError.BadRequest("OOPS SOMETHING WENT WRONG !");
  return updatedLatestMessage;
};

module.exports.doesGroupExist = async (isGroup) => {
  let convo = await ConversationModel.findById(isGroup)
    .populate("users", "-password")
    .populate("latestMessage");
  if (!convo) {
    return null;
  }
  // populating messages
  convo = await UserModel.populate(convo, {
    path: "latestMessage.sender",
    select: "name email status picture",
  });

  return convo; // since find willl return an array
};

module.exports.deleteConvo = async (id) => {
  let messages = await getConvoMessages(id);
  for (const message of messages) {
    await deleteMsg(message._id);
  }
  let deletedConvo = await ConversationModel.findByIdAndDelete(id);
  return deletedConvo;
};
