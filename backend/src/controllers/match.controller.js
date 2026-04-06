/**
 * Match Controller
 * Calculates skill match score between resume and job description
 */

const ResumeService = require('../services/resume.service');
const JobService = require('../services/job.service');
const SkillService = require('../services/skill.service');
const path = require('path');
const fs = require('fs').promises;

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
