const catchAsync = require('../utils/catchAsync');
const mongoose = require('mongoose');
const User = require('../models/userModel');
const Ctf = require('../models/ctfModel');
const Contest = require('../models/contestModel');
const AppError = require('../utils/appError');

exports.createContest = catchAsync(async (req, res, next) => {
  const { start, end, questions } = req.body;
  const createContest = await Contest.create({
    host: req.user._id,
    start,
    end,
    questions,
  });
  res.status(201).json({
    status: 'sucess',
    contest: createContest,
  });
});
