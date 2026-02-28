const express = require('express');
const router = express.Router();
const asyncHandler = require('../middleware/asyncHandler');
const validateContact = require('../middleware/validateContact');
const rateLimit = require('../middleware/rateLimit');
const { submitContact } = require('../controllers/contact.controller');

// POST /api/contact - with rate limiting & validation
router.post('/', rateLimit, validateContact, asyncHandler(submitContact));

module.exports = router;
