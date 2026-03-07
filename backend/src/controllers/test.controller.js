/**
 * Test Controller
 * Handles test-related API logic
 */

// Test controller - returns backend status
const getTestStatus = (req, res) => {
    res.json({
        message: "Career Craft backend running"
    });
};

module.exports = {
    getTestStatus
};

