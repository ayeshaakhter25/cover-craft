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

        // Get the full file path
        const filePath = path.join(__dirname, '../../uploads/', req.file.filename);
        
        console.log('Extracting text from:', filePath);

        // Extract text from the resume
        const extractedText = await resumeService.extractResumeText(filePath);
        
        console.log('Extraction successful, text length:', extractedText ? extractedText.length : 0);

        res.json({
            message: 'CV uploaded successfully',
            filename: req.file.filename,
            extractedText: extractedText
        });
    } catch (error) {
        console.error('Error extracting text:', error);
        res.status(500).json({
            message: 'Error uploading file',
            error: error.message
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

