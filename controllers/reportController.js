const catchAsync = require("../utils/catchAsync");
const mongoose = require("mongoose");
const User = require("../models/userModel");
const Report = require("../models/reportModel");
const Chat = require("./../models/Chat/chatModel");
const Message = require("./../models/Chat/messageModel");

exports.reportDiscussion = catchAsync(async (req, res, next) => {
  const { content, chatId } = req.body;
  const newReport = await Report.create({
    sender: req.user._id,
    content: content,
    chatId: chatId,
  });

  //   console.log(newReport);
  res.status(201).json({
    status: "success",
    report: newReport,
  });
});

exports.allReports = catchAsync(async (req, res, next) => {
  const newReport = await Report.find()
    .populate("chatId", "chatName discription")
    .populate("sender", "name photo");
  res.status(201).json({
    status: "success",
    report: newReport,
  });
});

exports.resolveReport = catchAsync(async (req, res, next) => {
  const { reportId } = req.body;
  await Report.findByIdAndUpdate(reportId, {
    isResolved: true,
  });
  res.status(203).json({
    status: "success",
  });
});
