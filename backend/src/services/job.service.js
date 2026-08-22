/**
 * Job Description Service
 * Business logic for job description storage and retrieval
 */

const fs = require('fs').promises;
const path = require('path');
const JobSourceService = require('./job-source.service');

class JobService {
    // Get file extension (always .txt for job desc)
    static getFileExtension() {
        return '.txt';
    }

    // Generate unique filename for job description
    static generateFilename() {
        const timestamp = Date.now();
        const random = Math.round(Math.random() * 10000);
        const ext = this.getFileExtension();
        return `jd_${timestamp}_${random}${ext}`;
    }

    // Save job description to temporary file
    static async saveJobDescription(jobDescription) {
        const dir = 'job-descriptions';
        const filename = this.generateFilename();
        const filePath = path.join(dir, filename);

        try {
            // Ensure directory exists
            await fs.mkdir(dir, { recursive: true });

            // Write content
            await fs.writeFile(filePath, jobDescription, 'utf8');

            return {
                filename,
                path: filePath,
                message: 'Job description stored successfully'
            };
        } catch (error) {
            throw new Error(`Failed to save job description: ${error.message}`);
        }
    }

    /**
     * Read job description text from file
     * @param {string} filename - JD filename like 'jd_123456_7890.txt'
     * @returns {Promise<string>} - Job description text
     */
    static async getJobDescription(filename) {
        try {
            const dir = path.join('job-descriptions');
            const filePath = path.join(dir, filename);
            const text = await fs.readFile(filePath, 'utf8');
            return text;
        } catch (error) {
            throw new Error(`Failed to read job description ${filename}: ${error.message}`);
        }
    }

    /**
     * Fetch 4 matching jobs from Google Jobs via SerpAPI
     * 2 global + 2 Pakistan-based
     * @param {string[]} skills - Top skills from CV
     * @returns {Promise<Array>} Array of job objects
     */
    static async fetchMatchingJobs(skills) {
        try {
            const jobs = await JobSourceService.fetchAll({ skills });
            return jobs.slice(0, 4).map(job => ({
                ...job,
                link: job.jobUrl,
                snippet: job.description.slice(0, 200) || 'No description available'
            }));

        } catch (error) {
            console.error('Error fetching jobs from SerpAPI:', error.message);
            return [];
        }
    }
}

module.exports = JobService;

