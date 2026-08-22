/**
 * Career Craft Backend Server
 * AI-Powered Career Application Co-Pilot
 * 
 * Entry point for the Express.js server
 */

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
const bodyParser = require('body-parser');
require('dotenv').config();

// Import routes
const testRoutes = require('./routes/test.routes');
const uploadRoutes = require('./routes/upload.routes');
const jobRoutes = require('./routes/job.routes');
const skillRoutes = require('./routes/skill.routes');
const matchRoutes = require('./routes/match.routes');
const userRoutes = require('./routes/user.routes');
const coverRoutes = require('./routes/cover.routes');
const JobSyncService = require('./services/job-sync.service');

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
app.use('/job-descriptions', express.static('job-descriptions'));

// Routes
app.use('/api', testRoutes);
app.use('/api', uploadRoutes);
app.use('/api', jobRoutes);
app.use('/api', skillRoutes);
app.use('/api', matchRoutes);
app.use('/api/users', userRoutes);
app.use('/api/cover', coverRoutes);
const cvHealthRoutes = require('./routes/cv-health.routes');
app.use('/api/cv-health', cvHealthRoutes);

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
    test: '/api/test',
    users: {
      register: '/api/users/register',
      login: '/api/users/login'
    },
    uploadCV: '/api/upload-cv',
    extractSkills: '/api/extract-skills',
    jobDescription: '/api/job-description',
    matchScore: '/api/match-score'

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

// Connect DB then start server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Career Craft backend running on port ${PORT}`);
    console.log(`📋 Test endpoint: http://localhost:${PORT}/api/test`);
    console.log(`🔐 Auth endpoints ready: /api/users/register & /api/users/login`);
  });
  JobSyncService.start();
}).catch((err) => {
  console.error('Failed to connect DB:', err);
});

module.exports = app;
