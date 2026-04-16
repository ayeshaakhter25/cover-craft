/**
 * Match Routes
 * API routes for skill matching
 */

const express = require('express');
const router = express.Router();
const matchController = require('../controllers/match.controller');
const { protect } = require('../middleware/auth');

// POST /api/match-score - Calculate resume-job skill match (protected)
router.post('/match-score', protect, matchController.calculateMatchScore);

module.exports = router;

