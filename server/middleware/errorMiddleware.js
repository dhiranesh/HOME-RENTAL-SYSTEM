// Error middleware

// Middleware to handle errors, especially for async route handlers

// Not Found Error Handler (404)
const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

// General Error Handler (catches all errors)
const errorHandler = (err, req, res, next) => {
  // Determine the status code: if res.statusCode is already set (and not 200), use it, otherwise use 500.
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message;

  // Mongoose Bad ObjectId (CastError)
  if (err.name === "CastError" && err.kind === "ObjectId") {
    statusCode = 400; // Bad Request
    message = "Invalid ID format";
  }

  // Mongoose Validation Error
  if (err.name === "ValidationError") {
    statusCode = 400; // Bad Request
    // Consolidate Mongoose validation error messages
    const messages = Object.values(err.errors).map((val) => val.message);
    message = `Validation Error: ${messages.join(". ")}`;
  }

  // Mongoose Duplicate Key Error (code 11000)
  if (err.code === 11000) {
    statusCode = 400; // Bad Request
    const field = Object.keys(err.keyValue)[0];
    message = `Duplicate field value entered for: ${field}. Please use another value.`;
  }

  // JWT Errors (can be more specific if needed, e.g., TokenExpiredError, JsonWebTokenError)
  if (err.name === "JsonWebTokenError") {
    statusCode = 401; // Unauthorized
    message = "Invalid token. Please log in again.";
  }
  if (err.name === "TokenExpiredError") {
    statusCode = 401; // Unauthorized
    message = "Token expired. Please log in again.";
  }

  res.status(statusCode).json({
    message,
    // Optionally include stack trace in development for easier debugging
    stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
  });
};

module.exports = { notFound, errorHandler };
