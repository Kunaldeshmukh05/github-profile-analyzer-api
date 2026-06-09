/**
 * Centralized error handling middleware.
 * Catches all errors passed via next(error) and returns a consistent JSON response.
 */
const errorHandler = (err, req, res, next) => {
  console.error(`[Error] ${req.method} ${req.originalUrl} — ${err.message}`);

  const statusCode = err.statusCode || 500;

  const message =
    statusCode === 500
      ? 'An internal server error occurred. Please try again later.'
      : err.message;

  return res.status(statusCode).json({
    success: false,
    message,
  });
};

module.exports = errorHandler;
