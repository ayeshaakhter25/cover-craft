const express = require('express');
const { registerUser, loginUser } = require('../controllers/user.controller');
const { protect } = require('../middleware/auth');
const { getDashboardStats, getRecentMatches } = require('../controllers/user-stats.controller');

const router = express.Router();

// POST /api/users/register
router.post('/register', registerUser);

// POST /api/users/login  
router.post('/login', loginUser);

// GET /api/users/stats - protected
router.get('/stats', protect, getDashboardStats);

// GET /api/users/recent-matches - protected
router.get('/recent-matches', protect, getRecentMatches);

module.exports = router;

