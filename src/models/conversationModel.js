const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;
const conversationSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Conversations name is required."],
      trim: true,
    },
    picture: {
      type: String,
      required: true,
    },
    isGroup: {
      type: Boolean,
      required: true,
      default: false,
    },
    users: [
      {
        type: ObjectId,
        ref: "User",
      },
    ],
    latestMessage: {
      type: ObjectId,
      ref: "Message",
    },
    admin: [
      {
        type: ObjectId,
        ref: "User",
      },
    ],
    description: {
      type: String,
      default: "",
    },
  },
  {
    collection: "conversations",
    timestamps: true,
  }
);

const ConversationModel =
  mongoose.models.ConversationModel ||
  mongoose.model("Conversation", conversationSchema);

module.exports = ConversationModel;
