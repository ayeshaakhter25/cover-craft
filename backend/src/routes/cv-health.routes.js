const express = require('express');
const { protect } = require('../middleware/auth');
const { healthCheck } = require('../controllers/cv-health.controller');

const router = express.Router();

// POST /api/cv-health/health-check - protected
router.post('/health-check', protect, healthCheck);

module.exports = router;
