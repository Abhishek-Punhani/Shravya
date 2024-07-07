const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const messageSchema = mongoose.Schema(
  {
    sender: {
      type: ObjectId,
      ref: "User",
    },
    message: {
      type: String,
      trim: true,
    },
    conversation: {
      type: ObjectId,
      ref: "Conversation",
    },
    file: {},
    isEdited: {
      type: Boolean,
      default: false,
    },
    isReply: {
      name: {
        type: String,
        default: undefined,
      },
      message: {
        type: String,
        default: undefined,
      },
      file: {
        name: {
          type: String,
          default: undefined,
        },
        url: {
          type: String,
          default: undefined,
        },
        type: {
          type: String,
          default: undefined,
        },
      },
      id: {
        type: ObjectId,
        ref: "User",
      },
    },
    isForwarded: {
      type: ObjectId,
      ref: "Message",
    },
  },
  {
    collection: "messages",
    timestamps: true,
  }
);

const MessageModel =
  mongoose.models.Message || mongoose.model("Message", messageSchema);
module.exports = MessageModel;
