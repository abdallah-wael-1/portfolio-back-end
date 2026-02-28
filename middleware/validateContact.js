const validateContact = (req, res, next) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({
      success: false,
      message: 'name, email and message are required',
    });
  }

  // Validate types are strings
  if (typeof name !== 'string' || typeof email !== 'string' || typeof message !== 'string') {
    return res.status(400).json({
      success: false,
      message: 'name, email and message must be strings',
    });
  }

  // Validate lengths
  if (name.trim().length < 2) {
    return res.status(400).json({
      success: false,
      message: 'name must be at least 2 characters',
    });
  }

  if (message.trim().length < 10) {
    return res.status(400).json({
      success: false,
      message: 'message must be at least 10 characters',
    });
  }

  // Validate email format using simple regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      message: 'invalid email format',
    });
  }

  // Trim whitespace
  req.body.name = name.trim();
  req.body.email = email.trim().toLowerCase();
  req.body.message = message.trim();
  req.body.subject = req.body.subject ? req.body.subject.trim() : '';

  next();
};

module.exports = validateContact;
