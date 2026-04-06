/**
 * Skill Controller
 * Handles skill extraction API endpoints
 */

const SkillService = require('../services/skill.service');

/**
 * Extract skills from provided text
 * POST /api/extract-skills
 */
const extractSkills = async (req, res) => {
    try {
        const { text } = req.body;

        if (!text || typeof text !== 'string') {
            return res.status(400).json({
                message: 'Text is required'
            });
        }

        const skills = SkillService.extractSkills(text);

        res.json({
            message: 'Skills extracted successfully',
            skills,
            count: skills.length
        });
    } catch (error) {
        console.error('Error extracting skills:', error);
        res.status(500).json({
            message: 'Error extracting skills',
            error: error.message
        });
    }
};

module.exports = {
    extractSkills
};

