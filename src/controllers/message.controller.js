const logger = require("../configs/logger.js");
const { updateLatestMessage } = require("../services/conversation.service.js");
const {
  createMsg,
  populateMsg,
  getConvoMessages,
  editMessage,
  deleteMsg,
} = require("../services/message.service.js");

module.exports.sendMessage = async (req, res, next) => {
  try {
    const user_id = req.user.userId;
    console.log(req.body);
    const { message, convo_id, files, isReply } = req.body;
    if (!convo_id || (!message && !files)) {
      logger.error("Please Provide Convo_id and Message Data");
      return res.sendStatus(400);
    }
    const msgData = {
      sender: user_id,
      message: message,
      conversation: convo_id,
      files: files || [],
      isReply: isReply,
    };
    const newMsg = await createMsg(msgData);
    const populatedMsg = await populateMsg(newMsg._id);
    await updateLatestMessage(convo_id, newMsg);
    res.json(populatedMsg);
  } catch (error) {
    next(error);
  }
};
module.exports.getMessages = async (req, res, next) => {
  try {
    const { convo_id } = req.params;
    if (!convo_id) {
      logger.error("Please Provide Convo_id in params");
      return res.sendStatus(400);
    }
    const messages = await getConvoMessages(convo_id);
    res.json(messages);
  } catch (error) {
    next(error);
  }
};
module.exports.editMessage = async (req, res, next) => {
  try {
    const { message } = req.body;
    const id = message._id;
    if (id && message.message.length > 0) {
      const editedMsg = await editMessage(id, message);
      const populatedMsg = await populateMsg(editedMsg._id);
      return res.status(200).json(populatedMsg);
    } else {
      return res.sendStatus(400);
    }
  } catch (error) {
    next(error);
  }
};
module.exports.deleteMessage = async (req, res, next) => {
  try {
    const { id, LastMessage } = req.body;
    if (LastMessage) {
      await updateLatestMessage(LastMessage.conversation._id, LastMessage);
    }
    if (id) {
      const deletedMsg = await deleteMsg(id);
      return res.status(200).json(deletedMsg);
    } else {
      return res.sendStatus(400);
    }
  } catch (error) {
    next(error);
  }
};
