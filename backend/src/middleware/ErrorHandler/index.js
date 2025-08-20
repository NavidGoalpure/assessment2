/**
 * Error handling middleware
 */
function errorHandler(err, req, res, next) {
  console.error('Error:', err);
  
  // Default error
  let status = 500;
  let message = 'Internal server error';
  
  // Handle specific error types
  if (err.status) {
    status = err.status;
    message = err.message;
  } else if (err.name === 'ValidationError') {
    status = 400;
    message = err.message;
  } else if (err.name === 'CastError') {
    status = 400;
    message = 'Invalid ID format';
  }
  
  res.status(status).json({
    error: message,
    timestamp: new Date().toISOString()
  });
}

module.exports = errorHandler;