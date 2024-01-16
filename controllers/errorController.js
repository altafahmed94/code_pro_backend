const AppError = require('./../utils/appError');
let terror;
const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
  const message = `Duplicate field value. Please use another value!`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);

  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const handleJWTError = () => {
  return new AppError('Invalid token! Please login again', 401);
};

const handleJWTExpiredError = (err) => {
  return new AppError('Your token is Expired! Please login again', 401);
};

const sendError = (err, req, res) => {
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }

  // console.error('ERROR 💥', err);
  return res.status(500).json({
    status: 'error',
    message: 'Something went very wrong!',
  });
};

module.exports = (err, req, res, next) => {
  terror = err;
  console.log(err);
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  let error = { ...err };

  error.message = err.message;
  if (err.name === 'CastError') err = handleCastErrorDB(error);
  if (err.code === 11000) err = handleDuplicateFieldsDB(error);
  if (err.name === 'ValidationError') {
    err = handleValidationErrorDB(error);
  }

  if (err.name === 'JsonWebTokenError') {
    err = handleJWTError(error);
  }
  if (err.name === 'TokenExpiredError') {
    err = handleJWTExpiredError(error);
  }

  sendError(err, req, res);
};
