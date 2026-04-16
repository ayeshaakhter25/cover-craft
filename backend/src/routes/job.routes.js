/**
 * Job Description Routes
 * API endpoints for job description handling
 */

const express = require('express');
const router = express.Router();
const jobController = require('../controllers/job.controller');
const { protect } = require('../middleware/auth');

// POST /api/job-description - Store job description temporarily (protected)
router.post('/job-description', protect, jobController.saveJobDescription);

module.exports = router;

