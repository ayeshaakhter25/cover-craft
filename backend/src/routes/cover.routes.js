const express = require('express');
const { generateCoverLetter, generateEmail } = require('../controllers/cover.controller');

const router = express.Router();

// POST /api/cover/generate
router.post('/generate', generateCoverLetter);

// POST /api/cover/email
router.post('/email', generateEmail);

module.exports = router;

