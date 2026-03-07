/**
 * Upload Service
 * Business logic for file upload operations
 */

const path = require('path');

class UploadService {
    // Validate file type
    static isAllowedFileType(mimetype) {
        const allowedTypes = [
            'application/pdf',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document' // .docx
        ];
        return allowedTypes.includes(mimetype);
    }

    // Get file extension
    static getFileExtension(filename) {
        return path.extname(filename).toLowerCase();
    }

    // Generate unique filename
    static generateFilename(originalname) {
        const timestamp = Date.now();
        const random = Math.round(Math.random() * 10000);
        const ext = this.getFileExtension(originalname);
        return `cv_${timestamp}_${random}${ext}`;
    }
}

module.exports = UploadService;

