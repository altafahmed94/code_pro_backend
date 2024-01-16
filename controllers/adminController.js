const catchAsync = require('../utils/catchAsync');
const mongoose = require('mongoose');
const User = require('../models/userModel');
const Chat = require('./../models/Chat/chatModel');
const Message = require('./../models/Chat/messageModel');

exports.allChats = catchAsync(async (req, res, next) => {
  const chats = await Chat.find({ isGroupChat: false }).populate(
    'users',
    'name pic'
  );
  // .populate("-upvotes -downvotes");
  res.status(201).json({
    status: 'success',
    chats,
  });
});

exports.deleteDiscussion = catchAsync(async (req, res, next) => {
  const chatId = req.body.chatId;
  await Chat.findByIdAndDelete(chatId);

  const chatMessage = Message.deleteMany({ chat: chatId });
  // console.log(chatMessage);
  res.status(201).json({
    status: 'success',
  });
});

exports.deleteMessage = catchAsync(async (req, res, next) => {
  const messageId = req.body.messageId;
  // await Chat.findByIdAndDelete(chatId);

  const chatMessage = await Message.findByIdAndDelete(messageId);
  // console.log(chatMessage);
  res.status(201).json({
    status: 'success',
  });
});

// exports.getAllMessage = catchAsync(async (req, res, next) => {
//   try {
//     const message = await Message.find({ chat: req.params.chatId })
//       .populate("sender", "name pic")
//       .populate("chat");
//     res.json(message);
//   } catch (error) {
//     console.log(error);
//     // res.status(400);
//     // throw new Error(err.message);
//     return next(new AppError(error.message, 400));
//   }
// });
