const rateLimitStore = new Map();

const RATE_LIMIT = {
  windowMs: 15 * 60 * 1000,    
  maxRequests: 5,               
};

const rateLimit = (req, res, next) => {
  const ip = req.ip || req.connection.remoteAddress;
  const now = Date.now();

  if (!rateLimitStore.has(ip)) {
    rateLimitStore.set(ip, { count: 1, resetTime: now + RATE_LIMIT.windowMs });
    return next();
  }

  const record = rateLimitStore.get(ip);

  if (now > record.resetTime) {
    record.count = 1;
    record.resetTime = now + RATE_LIMIT.windowMs;
    return next();
  }

  if (record.count >= RATE_LIMIT.maxRequests) {
    return res.status(429).json({
      success: false,
      message: 'Too many requests. Please try again later.',
    });
  }

  record.count++;
  next();
};

setInterval(() => {
  const now = Date.now();
  for (const [ip, record] of rateLimitStore.entries()) {
    if (now > record.resetTime) {
      rateLimitStore.delete(ip);
    }
  }
}, 60 * 60 * 1000);

module.exports = rateLimit;
