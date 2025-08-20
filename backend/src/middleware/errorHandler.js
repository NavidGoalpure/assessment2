/**
 * 404 Not Found middleware
 */
const notFound = (req, res, next) => {
  const err = new Error('Route Not Found');
  err.status = 404;
  next(err);
};

/**
 * Global error handler middleware
 */
const errorHandler = (err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';

  // Log error for debugging
  console.error(`Error ${status}: ${message}`);
  if (err.stack) {
    console.error(err.stack);
  }

  // Send error response
  res.status(status).json({
    success: false,
    error: {
      message: message,
      status: status,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    }
  });
};

/**
 * Async error wrapper for route handlers
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = { 
  notFound, 
  errorHandler, 
  asyncHandler 
};