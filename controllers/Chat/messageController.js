const catchAsync = require("./../../utils/catchAsync");
const Message = require("./../../models/Chat/messageModel");
const User = require("./../../models/userModel");
const Chat = require("./../../models/Chat/chatModel");
const AppError = require("../../utils/appError");

exports.sendMessage = catchAsync(async (req, res, next) => {
  const { content, chatId, code } = req.body;

  if (!content || !chatId) {
    // console.log("Invalid data passed into request");
    return res.sendStatus(400);
  }

  // var isChat = await Chat.find({
  //   isGroupChat: false,
  //   $and: [
  //     { users: { $elemMatch: { $eq: req.user._id } } },
  //     { users: { $elemMatch: { $eq: userId } } },
  //   ],
  // });

  const isUserExist = await Chat.find({
    chat: chatId,
    isGroupChat: true,
    // _id: chatId,
    $and: [{ users: { $elemMatch: { $eq: req.user._id } } }],
  });
  // console.log("-------------user Exist--------------");
  // console.log(isUserExist);

  if (isUserExist.length < 1) {
    const added = await Chat.findByIdAndUpdate(
      chatId,
      {
        $push: { users: req.user._id },
      },
      {
        new: true,
      }
    );
    // console.log("----------added------------");
    // console.log(added);
    if (!added) {
      // res.status(404);
      return next(new AppError("Chat Not Found", 404));
    }
  }
  if (code) {
    var newMessage = {
      sender: req.user._id,
      content: content,
      chat: chatId,
      code: code,
    };
    try {
      var message = await Message.create(newMessage);
      message = await message.populate("sender", "name pic");
      message = await message.populate("chat");
      message = await User.populate(message, {
        path: "sender",
        select: "name photo email",
      });
      await Chat.findByIdAndUpdate(req.body.chatId, {
        latestMessage: message,
      });
      res.status(201).json(message);
    } catch (err) {
      // console.log(err);

      return next(new AppError(err.message, 400));
    }
  } else {
    var newMessage = {
      sender: req.user._id,
      content: content,
      chat: chatId,
    };
    try {
      var message = await Message.create(newMessage);
      message = await message.populate("sender", "name pic");
      message = await message.populate("chat");
      message = await User.populate(message, {
        path: "sender",
        select: "name photo email",
      });
      await Chat.findByIdAndUpdate(req.body.chatId, {
        latestMessage: message,
      });
      res.status(201).json(message);
    } catch (err) {
      // console.log(err);

      return next(new AppError(err.message, 400));
    }
  }
});

exports.getAllMessage = catchAsync(async (req, res, next) => {
  try {
    const message = await Message.find({ chat: req.params.chatId })
      .populate("sender", "name photo email")
      .populate("chat");
    res.json(message);
  } catch (error) {
    // console.log(error);
    // res.status(400);
    // throw new Error(err.message);
    return next(new AppError(error.message, 400));
  }
});

exports.doVotes = catchAsync(async (req, res, next) => {
  const messageId = req.params.id;
  const userId = req.user._id;
  const vote = req.body.vote;
  if (vote === "up") {
    // console.log(messageId, userId, vote);
    const isPresent = await Message.find({
      _id: messageId,

      $and: [{ upvotes: { $elemMatch: { $eq: req.user._id } } }],
    });
    // console.log(isPresent);

    await Message.findByIdAndUpdate(
      messageId,
      {
        $pull: { downvotes: userId },
      },
      {
        new: true,
      }
    );
    // }

    if (isPresent.length > 0) {
      try {
        // console.log("Nooooooooooooooo");
        await Message.findByIdAndUpdate(
          messageId,
          {
            $pull: { upvotes: userId },
          },
          {
            new: true,
          }
        );
      } catch (err) {
        res.status(401).json({ error: err });
      }
    } else {
      try {
        // console.log("I am here");
        await Message.findByIdAndUpdate(
          messageId,
          {
            $push: { upvotes: userId },
          },
          {
            new: true,
          }
        );
      } catch (err) {
        // console.log(err);
        res.status(401).json({ error: err });
      }
    }
    const votes = await Message.findById(messageId).populate(
      "downvotes upvotes",
      "name photo"
    );
    // console.log(votes);
    res.status(201).json({
      status: "success",
      downvotes: votes.downvotes.length,
      usersdown: votes.downvotes,
      upvotes: votes.upvotes.length,
      usersup: votes.upvotes,
    });
  } else {
    const isPresent = await Message.find({
      _id: messageId,
      // isGroupChat: true,
      $and: [{ downvotes: { $elemMatch: { $eq: req.user._id } } }],
    });

    await Message.findByIdAndUpdate(
      messageId,
      {
        $pull: { upvotes: userId },
      },
      {
        new: true,
      }
    );
    if (isPresent.length > 0) {
      try {
        await Message.findByIdAndUpdate(
          messageId,
          {
            $pull: { downvotes: userId },
          },
          {
            new: true,
          }
        );
      } catch (err) {
        res.status(401).json({ error: err });
      }
    } else {
      await Message.findByIdAndUpdate(
        messageId,
        {
          $push: { downvotes: userId },
        },
        {
          new: true,
        }
      );
    }

    const votes = await Message.findById(messageId).populate(
      "downvotes upvotes",
      "name photo"
    );
    res.status(201).json({
      status: "success",
      downvotes: votes.downvotes.length,
      usersdown: votes.downvotes,
      upvotes: votes.upvotes.length,
      usersup: votes.upvotes,
    });
  }
});
