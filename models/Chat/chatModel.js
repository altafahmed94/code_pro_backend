const mongoose = require("mongoose");
const slugify = require("slugify");

const chatSchema = mongoose.Schema(
  {
    chatName: { type: String, trim: true },
    isGroupChat: { type: Boolean, default: false },
    slug: String,
    users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    latestMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
    discription: {
      type: String,
      trim: true,
    },
    code: {
      type: String,
      trim: true,
    },
    groupCreater: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    upvotes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    downvotes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timeStamps: true,
  }
);

// DOCUMENT MIDDLEWARE: runs before .save() and .create()
chatSchema.pre("save", function (next) {
  this.slug = slugify(this.chatName, { lower: true });
  next();
});

const Chat = mongoose.model("Chat", chatSchema);

module.exports = Chat;
