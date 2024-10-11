// middleware/errorHandler.js
const errorHandler = (err, req, res, next) => {
  // Log the error to the console
  console.error(err.stack);

  // Send a response to the client
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Server Error',
  });
};

module.exports = errorHandler;
