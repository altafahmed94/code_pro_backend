const catchAsync = require('../utils/catchAsync');
const mongoose = require('mongoose');
const User = require('../models/userModel');
const Ctf = require('../models/ctfModel');
const AppError = require('../utils/appError');

exports.createCtf = catchAsync(async (req, res, next) => {
  const { heading, description, flag, link, hint } = req.body;
  const newCtf = await Ctf.create({
    host: req.user._id,
    heading: heading,
    description: description,
    flag: flag,
    link: link,
    hint: hint,
  });
  if (!newCtf) {
    return next(new AppError('Please Try again', 401));
  }
  res.status(201).json({
    status: 'sucess',
    data: newCtf,
  });
});

exports.flagSubmission = catchAsync(async (req, res, next) => {
  console.log(req.body);
  const { flag, ctfId } = req.body;
  const solve = await Ctf.findById(ctfId);
  //   console.log(solve.host);
  //   console.log(req.user._id);
  //   if (solve.host !== req.user._id) {
  //     console.log('-----------------------');
  //     return res.status(201).json({
  //       status: 'fail',
  //       message: "You can't submit your own ctf",
  //     });
  //   }

  if (solve.flag === flag) {
    if (solve.host == req.user._id) {
      console.log('-----------------------');
      return res.status(201).json({
        status: 'fail',
        message: "You can't submit your own ctf",
      });
    }
    if (solve.users.includes(req.user._id)) {
      return res.status(201).json({
        status: 'success',
        message: 'Duplicate submission',
      });
    }
    // console.log(solve.host);
    // console.log(req.user._id);

    const done = await Ctf.findByIdAndUpdate(ctfId, {
      $push: {
        users: req.user._id,
      },
    });
    const userCtf = await User.findByIdAndUpdate(req.user._id, {
      $push: {
        ctfs: ctfId,
      },
      $inc: { totalCtfs: 1 },
    });

    if (!done || !userCtf) {
      return next(new AppError('Please Try again', 401));
    }
    return res.status(201).json({
      status: 'success',
      message: 'Greetings, You sucessfully found the flag',
    });
  }
  res.status(401).json({
    status: 'fail',
    message: 'Entered Flag is not correct, Please try again',
  });
});

exports.allCtfs = catchAsync(async (req, res, next) => {
  var data = await Ctf.find().select('-flag').populate('host', 'photo name');
  res.status(200).json({
    status: 'success',
    data: data,
  });
});

exports.ranking = catchAsync(async (req, res, next) => {
  const users = await User.find()
    .sort('-totalCtfs')
    .limit(10)
    .select('totalCtfs name photo ctfs');
  res.status(200).json({
    status: 'success',
    users,
  });
});
