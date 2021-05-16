const AppError = require("../utils/appError");

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);

  const message = `Invalid input data. ${errors.join(". ")}`;
  return new AppError(message, 400);
};

module.exports = (err, req, res, next) => {
  console.log(err);
  err.statusCode = err.statusCode || 500;
  let error = { ...err };
  error.message = err.message;

  if (error.name === "CastError") error = handleCastErrorDB(error);
  if (error.name === "ValidationError") error = handleValidationErrorDB(error);

  return res.status(err.statusCode).json({
    status: error.statusCode,
    message: error.message,
  });
};
