/**
 * Job Description Service
 * Business logic for job description storage and retrieval
 */

const fs = require('fs').promises;
const path = require('path');

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
            const axios = require('axios');
            const apiKey = process.env.SERPAPI_KEY;
            if (!apiKey) {
                console.warn('SERPAPI_KEY not set, returning empty jobs');
                return [];
            }

            const querySkills = skills.slice(0, 5).join(' ');
            const baseQuery = querySkills || 'software developer';

            // Helper to call SerpAPI
            const fetchJobs = async (query, locationParam = '') => {
                const url = `https://serpapi.com/search.json?engine=google_jobs&q=${encodeURIComponent(query)}${locationParam}&api_key=${apiKey}&google_domain=google.com&hl=en`;
                try {
                    const res = await axios.get(url);
                    return res.data.jobs_results || [];
                } catch (e) {
                    console.error('SerpAPI fetch error:', e.message);
                    return [];
                }
            };

            // Fetch 2 global + 2 Pakistan-based in parallel
            const [globalJobs, pkJobs] = await Promise.all([
                fetchJobs(`${baseQuery} jobs`),
                fetchJobs(`${baseQuery} jobs`, '&location=Pakistan')
            ]);

            // Helper to build apply link from job data
            const buildLink = (job) => {
                // Try direct links first
                if (job.apply_link) return job.apply_link;
                if (job.share_link) return job.share_link;
                // Fallback to Google search with job_id
                if (job.job_id) {
                    return `https://www.google.com/search?q=${encodeURIComponent(job.title + ' ' + job.company_name)}&ibp=htl;jobs&htidocid=${job.job_id}&hl=en`;
                }
                // Final fallback
                return `https://www.google.com/search?q=${encodeURIComponent(job.title + ' ' + job.company_name + ' jobs')}`;
            };

            const formatJob = (job) => ({
                title: job.title || 'Untitled Job',
                company: job.company_name || 'Unknown Company',
                location: job.location || 'Remote',
                link: buildLink(job),
                snippet: job.description?.slice(0, 200) || job.job_description?.slice(0, 200) || 'No description available'
            });

            // Take 2 from each
            const results = [];
            if (globalJobs.length > 0) results.push(formatJob(globalJobs[0]));
            if (globalJobs.length > 1) results.push(formatJob(globalJobs[1]));
            if (pkJobs.length > 0) results.push(formatJob(pkJobs[0]));
            if (pkJobs.length > 1) results.push(formatJob(pkJobs[1]));

            return results;

        } catch (error) {
            console.error('Error fetching jobs from SerpAPI:', error.message);
            return [];
        }
    }
}

module.exports = JobService;

