/**
 * Test Service
 * Business logic for test endpoints
 */

class TestService {
    // Get test status message
    static getStatus() {
        return {
            message: "Career Craft backend running"
        };
    }

    // Get status with timestamp
    static getStatusWithTime() {
        return {
            message: "Career Craft backend running",
            timestamp: new Date().toISOString()
        };
    }
}

module.exports = TestService;

