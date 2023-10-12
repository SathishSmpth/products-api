const AppError = require("./../utils/appError");

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
  const message = "Email is already exists!";
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const message = Object.values(err.errors).map((el) => el.message);
  return new AppError(message, 400);
};

const sendErrorResponse = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    err: err,
  });
};

module.exports = (error, req, res, next) => {
  error.statusCode = error.statusCode || 500;
  error.status = error.status || "error";

  if (error.name === "CastError") {
    error = handleCastErrorDB(error);
  }
  if (error.code === 11000) {
    error = handleDuplicateFieldsDB(error);
  }
  if (error.name === "ValidationError") {
    error = handleValidationErrorDB(error);
  }

  sendErrorResponse(error, res);
};
