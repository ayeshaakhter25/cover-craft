/**
 * Upload Routes
 * CV file upload endpoints
 */

const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/upload.controller');

// POST /api/upload-cv - Upload CV file
router.post('/upload-cv', 
    uploadController.upload.single('cv'), 
    uploadController.uploadCV,
    uploadController.handleUploadError
);

// POST /api/upload-cv/multiple - Upload multiple CV files (optional)
router.post('/upload-cv/multiple', 
    uploadController.upload.array('cv', 5), 
    (req, res) => {
        try {
            if (!req.files || req.files.length === 0) {
                return res.status(400).json({
                    message: 'No files uploaded'
                });
            }

            const files = req.files.map(file => ({
                filename: file.filename,
                originalName: file.originalname,
                size: file.size
            }));

            res.json({
                message: `${files.length} files uploaded successfully`,
                files: files
            });
        } catch (error) {
            res.status(500).json({
                message: 'Error uploading files',
                error: error.message
            });
        }
    },
    uploadController.handleUploadError
);

module.exports = router;

