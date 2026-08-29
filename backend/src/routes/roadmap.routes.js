const express = require('express');
const { protect } = require('../middleware/auth');
const controller = require('../controllers/roadmap.controller');
const router = express.Router();
router.get('/', protect, controller.getRoadmaps);
router.post('/generate', protect, controller.generateRoadmap);
router.patch('/:roadmapId/skills/:skillName', protect, controller.updateSkillStatus);
module.exports = router;
