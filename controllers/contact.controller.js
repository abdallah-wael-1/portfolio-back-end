const Contact = require('../models/contact.model');
const sendContactEmail = require('../utils/sendEmail');

// POST /api/contact
exports.submitContact = async (req, res) => {
  const { name, email, subject = '', message } = req.body;

  // Save to MongoDB
  const contact = new Contact({ name, email, subject, message });
  const saved = await contact.save();

  console.log(` Contact saved - ID: ${saved._id}`);

  // Send email asynchronously (don't block response, handle errors silently)
  sendContactEmail(name, email, subject, message).catch(err => {
    console.error(` Email failed for ${email}:`, err.message);
  });

  res.status(201).json({
    success: true,
    message: 'Contact message received and saved',
    data: {
      id: saved._id,
      name: saved.name,
      email: saved.email,
      createdAt: saved.createdAt,
    },
  });
};
