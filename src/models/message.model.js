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
    files: [],
    isEdited: {
      type: Boolean,
      default: false,
    },
    isReply: {
      name: {
        type: String,
        default: "",
      },
      message: {
        type: String,
        default: "",
      },
      file: {
        name: {
          type: String,
          default: "",
        },
        url: {
          type: String,
          default: "",
        },
        type: {
          type: String,
          default: "",
        },
      },
      id: {
        type: ObjectId,
        ref: "User",
      },
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
