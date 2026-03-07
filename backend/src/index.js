/**
 * Career Craft Backend Server
 * AI-Powered Career Application Co-Pilot
 * 
 * Entry point for the Express.js server
 */

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

// Import routes
const testRoutes = require('./routes/test.routes');
const uploadRoutes = require('./routes/upload.routes');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_ORIGIN || 'http://localhost:5173',
    credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve uploaded files
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api', testRoutes);
app.use('/api', uploadRoutes);

// Health check route
app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

// Root route
app.get('/', (req, res) => {
    res.json({ 
        message: 'Career Craft API Server',
        version: '1.0.0',
        endpoints: {
            health: '/health',
            test: '/api/test'
        }
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Career Craft backend running on port ${PORT}`);
    console.log(`📋 Test endpoint: http://localhost:${PORT}/api/test`);
});

module.exports = app;

