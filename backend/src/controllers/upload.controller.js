/**
 * Upload Controller
 * Handles CV file upload operations
 */

const uploadService = require('../services/upload.service');
const resumeService = require('../services/resume.service');

// Multer configuration for CV uploads
const multer = require('multer');
const path = require('path');

// Configure storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const filename = uploadService.generateFilename(file.originalname);
        cb(null, filename);
    }
});

// File filter - only accept PDF and DOCX
const fileFilter = (req, file, cb) => {
    if (uploadService.isAllowedFileType(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only PDF and DOCX files are allowed.'), false);
    }
};

// Create multer upload instance
const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit
    }
});

// Handle CV upload
const uploadCV = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                message: 'No file uploaded'
            });
        }

        // Get the full file path - use absolute path
        const uploadsDir = path.join(__dirname, '../../uploads');
        const filePath = path.join(uploadsDir, req.file.filename);
        
        console.log('File path:', filePath);
        console.log('File exists:', require('fs').existsSync(filePath));

        // Extract text AND skills from the resume
        const { text: extractedText, skills } = await resumeService.extractResumeWithSkills(filePath);
        
        // Ensure we have text
        if (!extractedText || extractedText.trim() === '') {
            extractedText = 'No text could be extracted from the document';
        }
        
        console.log('Extracted text length:', extractedText.length);
        console.log('Skills found:', skills);

        res.json({
            message: 'CV uploaded successfully',
            filename: req.file.filename,
            extractedText: extractedText,
            skills: skills
        });
    } catch (error) {
        console.error('Error extracting text:', error);
        res.status(500).json({
            message: 'Error uploading file',
            error: error.message,
            extractedText: 'Error extracting text: ' + error.message
        });
    }
};

// Handle multer errors
const handleUploadError = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                message: 'File size too large. Maximum size is 10MB.'
            });
        }
        return res.status(400).json({
            message: err.message
        });
    } else if (err) {
        return res.status(400).json({
            message: err.message
        });
    }
    next();
};

module.exports = {
    upload,
    uploadCV,
    handleUploadError
};

