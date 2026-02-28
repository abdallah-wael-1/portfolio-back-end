const requestLogger = (req, res, next) => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    const statusCode = res.statusCode;
    const statusColor = statusCode >= 400 ? '❌' : statusCode >= 300 ? '⚠️' : '✅';
    
    console.log(
      `${statusColor} [${new Date().toISOString()}] ${req.method} ${req.path} - ${statusCode} (${duration}ms)`
    );
  });

  next();
};

module.exports = requestLogger;
