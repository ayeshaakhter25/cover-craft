/**
 * Job Description Controller
 * Handles job description POST requests
 */

const JobService = require('../services/job.service');

const saveJobDescription = async (req, res) => {
    try {
        const { jobDescription } = req.body;

        // Validate input
        if (!jobDescription || typeof jobDescription !== 'string' || jobDescription.trim().length === 0) {
            return res.status(400).json({
                error: 'jobDescription is required and must be a non-empty string'
            });
        }

        // Save using service
        const result = await JobService.saveJobDescription(jobDescription.trim());

        res.status(201).json({
            message: 'Job description stored successfully',
            filename: result.filename,
            path: `/job-descriptions/${result.filename}` // Relative path for access
        });
    } catch (error) {
        console.error('Job controller error:', error);
        res.status(500).json({
            error: 'Failed to store job description',
            message: error.message
        });
    }
};

module.exports = {
    saveJobDescription
};

