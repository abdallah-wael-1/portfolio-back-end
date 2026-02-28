module.exports = (err, req, res, next) => {  
  console.error(`\n Error occurred:`);
  console.error(`   Message: ${err.message}`);
  console.error(`   Stack: ${err.stack}\n`);

  const status = err.statusCode || err.status || 500;
  const message = err.message || 'Internal Server Error';

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: messages,
    });
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    return res.status(400).json({
      success: false,
      message: 'Duplicate field value entered',
    });
  }

  res.status(status).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};