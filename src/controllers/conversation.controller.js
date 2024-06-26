const createHttpError = require("http-errors");
const {
  doesConversationExist,
} = require("../services/conversation.service.js");
const { findUser } = require("../services/user.service.js");
const {
  createConversation,
  getUserConversations,
  populateConversation,
} = require("../services/conversation.service.js");
const logger = require("../configs/logger.js");

module.exports.create_open_conversation = async (req, res, next) => {
  try {
    const sender_id = req.user.userId;
    const { reciever_id } = req.body;
    // check if reciever_id is present or not
    if (!reciever_id) {
      logger.error("Please Provide the user id you wanna chat with !");
      throw createHttpError.BadRequest("Something went wrong!");
    }
    // check if chat exist or not
    const existed_conversation = await doesConversationExist(
      sender_id,
      reciever_id
    );
    if (existed_conversation) {
      res.json(existed_conversation);
    } else {
      // let reciever_user = await findUser(reciever_id);
      let convoData = {
        name: "name",
        picture: "picture",
        isGroup: false,
        users: [sender_id, reciever_id],
      };
      const newConvo = await createConversation(convoData);
      const populatedConvo = await populateConversation(
        newConvo._id,
        "users",
        "-password"
      );
      res.json(populatedConvo);
    }
  } catch (error) {
    next(error);
  }
};

module.exports.getConversations = async (req, res, next) => {
  try {
    const user_id = req.user.userId;
    const conversations = await getUserConversations(user_id);
    res.status(200).json(conversations);
  } catch (error) {
    next(error);
  }
};
