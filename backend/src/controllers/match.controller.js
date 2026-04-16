/**
 * Match Controller
 * Calculates skill match score between resume and job description
 */

const ResumeService = require('../services/resume.service');
const JobService = require('../services/job.service');
const SkillService = require('../services/skill.service');
const path = require('path');
const fs = require('fs');
const Match = require('../models/Match');
const CV = require('../models/CV');
const Job = require('../models/Job');

const calculateMatchScore = async (req, res) => {
    try {
        const { resumeFile, jobDesc, jobFile } = req.body;

        if (!resumeFile || (!jobDesc && !jobFile)) {
            return res.status(400).json({
                error: 'resumeFile and either jobDesc OR jobFile are required'
            });
        }

        // Extract resume skills
        let resumeSkills = [];
        const resumePath = path.join('uploads', resumeFile);

        if (fs.existsSync(resumePath)) {
            const resumeData = await ResumeService.extractResumeWithSkills(resumePath);
            resumeSkills = resumeData.skills || [];
        } else {
            return res.status(404).json({
                error: `Resume file not found: ${resumeFile}`
            });
        }

        // Extract job skills
        let jobSkills = [];
        if (jobDesc) {
            // Direct job description text
            jobSkills = SkillService.extractSkills(jobDesc);
        } else if (jobFile) {
            // Job description file
            const jobText = await JobService.getJobDescription(jobFile);
            jobSkills = SkillService.extractSkills(jobText);
        }

        if (jobSkills.length === 0) {
            return res.status(400).json({
                error: 'No skills found in job description'
            });
        }

        // Calculate match
        const result = SkillService.calculateMatchScore(resumeSkills, jobSkills);

        // Persist match record for authenticated user
        if (req.user && req.user.id) {
            try {
                const cvDoc = await CV.findOne({ filename: resumeFile });
                let jobDoc = null;
                if (jobFile) {
                    jobDoc = await Job.findOne({ filename: jobFile });
                }

                await Match.create({
                    userId: req.user.id,
                    cvId: cvDoc?._id || null,
                    jobId: jobDoc?._id || null,
                    matchScore: result.matchScore,
                    matchingSkills: result.matchingSkills,
                    missingSkills: result.missingSkills
                });
            } catch (err) {
                console.error('Failed to save Match record:', err.message);
            }
        }

        res.json({
            message: 'Match score calculated successfully',
            ...result
        });

    } catch (error) {
        console.error('Match calculation error:', error);
        res.status(500).json({
            error: 'Failed to calculate match score',
            message: error.message
        });
    }
};

module.exports = {
    calculateMatchScore
};
