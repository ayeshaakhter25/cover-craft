/**
 * Skill Routes
 * API routes for skill extraction
 */

const express = require('express');
const router = express.Router();
const skillController = require('../controllers/skill.controller');

// POST /api/extract-skills - Extract skills from text
router.post('/extract-skills', skillController.extractSkills);

module.exports = router;

