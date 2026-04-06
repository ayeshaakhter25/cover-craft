/**
 * Match Routes
 * API routes for skill matching
 */

const express = require('express');
const router = express.Router();
const matchController = require('../controllers/match.controller');

// POST /api/match-score - Calculate resume-job skill match
router.post('/match-score', matchController.calculateMatchScore);

module.exports = router;

