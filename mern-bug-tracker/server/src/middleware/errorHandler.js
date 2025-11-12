const AppError = require('./AppError');

const notFoundHandler = (req, res, next) => {
  next(new AppError(`Route ${req.originalUrl} not found`, 404));
};

const errorHandler = (err, req, res, _next) => {
  const statusCode = err.statusCode || 500;
  const payload = {
    message: err.message || 'Internal Server Error',
    statusCode,
    requestId: req.headers['x-request-id'] || null,
  };

  if (err.details) {
    payload.details = err.details;
  }

  if (process.env.NODE_ENV !== 'test') {
    // Debugging aid: log stack traces during development
    // eslint-disable-next-line no-console
    console.error('Error encountered:', {
      message: err.message,
      stack: err.stack,
      details: err.details,
    });
  }

  res.status(statusCode).json(payload);
};

module.exports = {
  notFoundHandler,
  errorHandler,
};

