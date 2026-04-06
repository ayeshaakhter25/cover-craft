/**
 * Resume Service
 * Extracts text from PDF and DOCX resume files
 */

const fs = require('fs');
const path = require('path');
const mammoth = require('mammoth');
const pdfParse = require('pdf-parse');
const SkillService = require('./skill.service');

class ResumeService {
    /**
     * Extract text from a resume file (PDF or DOCX)
     * @param {string} filePath - Absolute path to the resume file
     * @returns {Promise<string>} - Extracted text from the resume
     */
    static async extractResumeText(filePath) {
        try {
            // Check if file exists
            if (!fs.existsSync(filePath)) {
                throw new Error(`File not found: ${filePath}`);
            }

            // Get file extension
            const ext = path.extname(filePath).toLowerCase();

            // Extract text based on file type
            switch (ext) {
                case '.pdf':
                    return await this.extractFromPDF(filePath);
                case '.docx':
                    return await this.extractFromDOCX(filePath);
                default:
                    throw new Error(`Unsupported file type: ${ext}`);
            }
        } catch (error) {
            console.error('Error extracting resume text:', error.message);
            throw error;
        }
    }

    /**
     * Extract text from PDF file
     * @param {string} filePath - Path to PDF file
     * @returns {Promise<string>} - Extracted text
     */
    static async extractFromPDF(filePath) {
        try {
            const dataBuffer = fs.readFileSync(filePath);
            const data = await pdfParse(dataBuffer);
            return data.text;
        } catch (error) {
            console.error('Error extracting PDF:', error.message);
            throw new Error(`Failed to extract text from PDF: ${error.message}`);
        }
    }

    /**
     * Extract text from DOCX file
     * @param {string} filePath - Path to DOCX file
     * @returns {Promise<string>} - Extracted text
     */
    static async extractFromDOCX(filePath) {
        try {
            const result = await mammoth.extractRawText({ path: filePath });
            return result.value;
        } catch (error) {
            console.error('Error extracting DOCX:', error.message);
            throw new Error(`Failed to extract text from DOCX: ${error.message}`);
        }
    }

    /**
     * Extract both text and skills from resume file
     * @param {string} filePath - Path to resume file
     * @returns {Promise<{text: string, skills: string[]}>} Extracted text and skills
     */
    static async extractResumeWithSkills(filePath) {
        try {
            const text = await this.extractResumeText(filePath);
            const skills = SkillService.extractSkills(text);
            return { text, skills };
        } catch (error) {
            console.error('Error extracting resume with skills:', error.message);
            throw error;
        }
    }
}

module.exports = ResumeService;

