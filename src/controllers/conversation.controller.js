const createHttpError = require("http-errors");
const {
  doesConversationExist,
  doesGroupExist,
  deleteConvo,
} = require("../services/conversation.service.js");
const { findUser } = require("../services/user.service.js");
const {
  createConversation,
  getUserConversations,
  populateConversation,
} = require("../services/conversation.service.js");
const logger = require("../configs/logger.js");
const { generateToken04 } = require("../services/zegoServerAssisstant.js");

module.exports.create_open_conversation = async (req, res, next) => {
  try {
    const sender_id = req.user.userId;
    const { reciever_id, isGroup } = req.body;
    if (!isGroup) {
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
        res.status(200).json(existed_conversation);
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
    } else {
      // Group Chat
      console.log(isGroup);
      if (!isGroup) {
        logger.error("Group convo id not recieved!");
        throw createHttpError.BadRequest("Something went wrong!");
      }
      // check does group exist
      const existed_group_conversation = await doesGroupExist(isGroup);
      res.status(200).json(existed_group_conversation);
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

module.exports.createGroup = async (req, res, next) => {
  const { name, users } = req.body;
  if (!name || !users) {
    throw createHttpError.BadRequest("Please Ensure group has name and users!");
  }
  users.push(req.user.userId);
  try {
    let convoData = {
      name,
      users,
      isGroup: true,
      admin: req.user.userId,
      picture: process.env.DEFAULT_GROUP_PICTURE,
    };
    let newConvo = await createConversation(convoData);
    let populatedConvo = await populateConversation(
      newConvo._id,
      "users admin",
      "-password"
    );
    res.status(200).json(populatedConvo);
  } catch (error) {
    next(error);
  }
};

module.exports.generateToken = async (req, res, next) => {
  try {
    const appId = parseInt(process.env.ZEGO_APP_ID);
    const serverSecret = process.env.ZEGO_SERVER_ID;
    const userId = req.user.userId;
    const effectiveTime = 3600 * 4;
    const payload = "";
    if (appId && serverSecret && userId) {
      const token = generateToken04(
        appId,
        userId,
        serverSecret,
        effectiveTime,
        payload
      );
      return res.status(200).json({ token });
    }
    return res.status(400).send("Something Went Wrong!");
  } catch (error) {
    next(error);
  }
};

module.exports.deleteConversation = async (req, res, next) => {
  try {
    const { id } = req.body;
    if (id) {
      const deletedConvo = await deleteConvo(id);
      return res.status(200).json(deletedConvo);
    } else {
      return res.sendStatus(400);
    }
  } catch (error) {
    next(error);
  }
};
