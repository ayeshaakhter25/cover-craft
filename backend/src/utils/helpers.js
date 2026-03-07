/**
 * Utility Helpers
 * Common utility functions used across the application
 */

/**
 * Format success response
 * @param {any} data - Response data
 * @param {string} message - Success message
 */
const successResponse = (data, message = 'Success') => {
    return {
        success: true,
        message,
        data
    };
};

/**
 * Format error response
 * @param {string} message - Error message
 * @param {number} statusCode - HTTP status code
 */
const errorResponse = (message, statusCode = 500) => {
    return {
        success: false,
        error: message,
        statusCode
    };
};

/**
 * Validate email format
 * @param {string} email - Email to validate
 */
const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

/**
 * Generate unique ID
 */
const generateUniqueId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

module.exports = {
    successResponse,
    errorResponse,
    isValidEmail,
    generateUniqueId
};

