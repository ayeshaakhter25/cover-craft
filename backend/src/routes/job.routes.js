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
router.get('/jobs/relevant', protect, jobController.getRelevantJobs);
router.patch('/jobs/:jobId/history', protect, jobController.updateJobState);
// Protected development/admin-style trigger; useful to verify the pipeline without waiting.
router.post('/jobs/sync', protect, jobController.syncJobs);

module.exports = router;

