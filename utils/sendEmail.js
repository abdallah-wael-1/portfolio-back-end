const nodemailer = require('nodemailer');

// Create transporter instance (reused for better performance)
let transporter;

const getTransporter = () => {
  if (transporter) return transporter;

  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    throw new Error('EMAIL_USER and EMAIL_PASS environment variables are required');
  }

  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  return transporter;
};

/**
 * Sends a contact form email via Gmail
 * @param {string} name - Sender's name
 * @param {string} email - Sender's email
 * @param {string} subject - Email subject
 * @param {string} message - Email message body
 * @returns {Promise<Object>} Email sent info or error
 */
const sendContactEmail = async (name, email, subject, message) => {
  try {
    const transporter = getTransporter();

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      replyTo: email,
      subject: `📧 New Contact Message${subject ? ` – ${subject}` : ''}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1976d2;">New Contact Form Submission</h2>
          <hr style="border: none; border-top: 2px solid #e0e0e0;">
          
          <p><strong>Name:</strong> ${escapeHtml(name)}</p>
          <p><strong>Email:</strong> <a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></p>
          ${subject ? `<p><strong>Subject:</strong> ${escapeHtml(subject)}</p>` : ''}
          
          <hr style="border: none; border-top: 2px solid #e0e0e0; margin: 20px 0;">
          
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 8px;">
            <h3 style="margin-top: 0;">Message:</h3>
            <p style="white-space: pre-wrap; line-height: 1.6;">
              ${escapeHtml(message)}
            </p>
          </div>
          
          <hr style="border: none; border-top: 2px solid #e0e0e0; margin: 20px 0;">
          <p style="color: #999; font-size: 12px;">
            Sent from Portfolio Contact Form
          </p>
        </div>
      `,
      text: `
Name: ${name}
Email: ${email}
${subject ? `Subject: ${subject}` : ''}

Message:
${message}
      `,
    };

    console.log(`📧 Sending email from ${name} (${email})...`);
    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent successfully! Message ID: ${info.messageId}`);

    return {
      success: true,
      messageId: info.messageId,
    };
  } catch (error) {
    console.error(`❌ Error sending email: ${error.message}`);
    throw error;
  }
};

/**
 * Escapes HTML special characters to prevent injection
 */
const escapeHtml = (text) => {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
};

module.exports = sendContactEmail;
