/**
 * Job Description Routes
 * API endpoints for job description handling
 */

const express = require('express');
const router = express.Router();
const jobController = require('../controllers/job.controller');

// POST /api/job-description - Store job description temporarily
router.post('/job-description', jobController.saveJobDescription);

module.exports = router;

