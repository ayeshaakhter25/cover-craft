/**
 * Job Description Controller
 * Handles job description POST requests
 */

const JobService = require('../services/job.service');
const Job = require('../models/Job');
const SkillService = require('../services/skill.service');

const saveJobDescription = async (req, res) => {
    try {
        const { jobDescription } = req.body;

        // Validate input
        if (!jobDescription || typeof jobDescription !== 'string' || jobDescription.trim().length === 0) {
            return res.status(400).json({
                error: 'jobDescription is required and must be a non-empty string'
            });
        }

        // Save using service (file)
        const result = await JobService.saveJobDescription(jobDescription.trim());

        // Persist Job record if user present
        if (req.user && req.user.id) {
            try {
                const skills = SkillService.extractSkills(jobDescription.trim());
                // Extract job title and company from first few lines
                const lines = jobDescription.trim().split('\n').map(l => l.trim()).filter(Boolean);
                const jobTitle = lines[0]?.slice(0, 80) || 'Untitled Job';
                const company  = lines[1]?.slice(0, 80) || '';
                await Job.create({
                    userId: req.user.id,
                    filename: result.filename,
                    originalText: jobDescription.trim(),
                    skills,
                    jobTitle,
                    company
                });
            } catch (err) {
                console.error('Failed to save Job record:', err.message);
            }
        }

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

