/**
 * Test Routes
 * Basic API test endpoints
 */

const express = require('express');
const router = express.Router();
const testController = require('../controllers/test.controller');

// Test route - returns success message
router.get('/test', testController.getTestStatus);

// Test route with timestamp
router.get('/test/time', (req, res) => {
    res.json({
        message: "Career Craft backend running",
        timestamp: new Date().toISOString()
    });
});

module.exports = router;

