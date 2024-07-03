const MessageModel = require("../models");

module.exports.createMsg = async (data) => {
  const newmsg = await MessageModel.create(data);
  if (!newmsg) throw createHttpError.BadRequest("OOPS SOMETHING WENT WRONG !");
  return newmsg;
};
module.exports.populateMsg = async (id) => {
  const msg = await MessageModel.findById(id)
    .populate({
      path: "sender",
      select: "name picture",
      model: "User",
    })
    .populate({
      path: "conversation",
      select: "name picture users isGroup",
      model: "Conversation",
      populate: {
        path: "users",
        select: "name email status picture",
        model: "User",
      },
    });
  if (!msg) throw createHttpError.BadRequest("OOPS SOMETHING WENT WRONG !");
  return msg;
};
module.exports.getConvoMessages = async (convo_id) => {
  let messages = await MessageModel.find({ conversation: convo_id })
    .populate("sender", "name email status picture")
    .populate("conversation");
  if (!messages)
    throw createHttpError.BadRequest("OOPS SOMETHING WENT WRONG !");
  return messages;
};

module.exports.editMessage = async (id, message) => {
  let edtMessage = await MessageModel.findByIdAndUpdate(
    id,
    {
      ...message,
      isEdited: true,
    },
    { new: true }
  );
  return edtMessage;
};

module.exports.deleteMsg = async (id) => {
  let msg = await MessageModel.findByIdAndDelete(id);
  return msg;
};
