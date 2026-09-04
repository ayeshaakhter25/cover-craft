const express = require('express');
const { registerUser, loginUser, getNotificationPreferences, updateNotificationPreferences } = require('../controllers/user.controller');
const { protect } = require('../middleware/auth');
const { getDashboardStats, getRecentMatches, getMatchDetail, deleteMatch } = require('../controllers/user-stats.controller');

const router = express.Router();

// POST /api/users/register
router.post('/register', registerUser);

// POST /api/users/login  
router.post('/login', loginUser);
router.get('/notification-preferences', protect, getNotificationPreferences);
router.put('/notification-preferences', protect, updateNotificationPreferences);

// GET /api/users/stats - protected
router.get('/stats', protect, getDashboardStats);

// GET /api/users/recent-matches - protected
router.get('/recent-matches', protect, getRecentMatches);
router.get('/matches/:id', protect, getMatchDetail);

// DELETE /api/users/matches/:id - protected
router.delete('/matches/:id', protect, deleteMatch);

module.exports = router;

