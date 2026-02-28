// simple wrapper to catch errors in async route handlers
module.exports = fn => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
