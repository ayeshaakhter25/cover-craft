/**
 * Job Description Controller
 * Handles job description POST requests
 */

const JobService = require('../services/job.service');
const Job = require('../models/Job');
const SkillService = require('../services/skill.service');
const Match = require('../models/Match');
const JobHistory = require('../models/JobHistory');
const JobSyncService = require('../services/job-sync.service');

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
                    title: jobTitle,
                    description: jobDescription.trim(),
                    skills,
                    jobTitle,
                    company,
                    source: 'manual'
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

const getRelevantJobs = async (req, res) => {
    try {
        const minimumScore = Math.max(0, Number(req.query.minimumScore || 0));
        const matches = await Match.find({ userId: req.user.id, matchScore: { $gte: minimumScore } })
            .sort({ matchScore: -1, createdAt: -1 }).populate('jobId').lean();
        const history = await JobHistory.find({ userId: req.user.id }).lean();
        const states = new Map(history.map(item => [String(item.jobId), item.state]));
        const jobs = matches.filter(match => match.jobId).map(match => ({
            ...match.jobId, matchScore: match.matchScore, matchingSkills: match.matchingSkills,
            missingSkills: match.missingSkills, state: states.get(String(match.jobId._id)) || 'NEW'
        }));
        res.json({ jobs });
    } catch (error) { res.status(500).json({ error: 'Failed to fetch relevant jobs' }); }
};

const updateJobState = async (req, res) => {
    const allowed = ['NEW', 'VIEWED', 'SAVED', 'APPLIED', 'REJECTED'];
    if (!allowed.includes(req.body.state)) return res.status(400).json({ error: 'Invalid job state' });
    try {
        const history = await JobHistory.findOneAndUpdate(
            { userId: req.user.id, jobId: req.params.jobId }, { $set: { state: req.body.state } },
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );
        res.json({ history });
    } catch (error) { res.status(500).json({ error: 'Failed to update job history' }); }
};

const syncJobs = async (req, res) => {
    try { res.json(await JobSyncService.sync()); }
    catch (error) { res.status(500).json({ error: 'Job sync failed', message: error.message }); }
};

module.exports = {
    saveJobDescription, getRelevantJobs, updateJobState, syncJobs
};

