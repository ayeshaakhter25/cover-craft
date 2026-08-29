/**
 * Skill Service
 * Extracts predefined skills from resume text
 */

class SkillService {
    /**
     * Predefined list of skills (expanded for better CV matching)
     */
    static SKILLS = [
        'React', 'React Native', 'JavaScript', 'TypeScript', 'Next.js', 'Redux', 'Node.js', 'Express', 'MongoDB', 
        'Python', 'Django', 'Odoo', 'MERN', 'MERN Stack', 'SQL', 'MySQL', 'Git', 'GitHub', 
        'AWS', 'Kubernetes', 'Terraform', 'Jenkins', 'Docker', 'Linux', 'Bootstrap', 'HTML', 'CSS', 'GraphQL', 
        'Java', 'C++', 'PHP', 'Firebase', 'CI/CD', 'Machine Learning', 'Deep Learning',
        'Communication', 'Leadership', 'Project Management', 'Jira', 'Asana', 'Trello', 'VS Code'
    ];

    /**
     * Extract skills from text using case-insensitive word boundary matching
     * @param {string} text - Extracted resume text
     * @returns {string[]} - Array of matched skills
     */
    static extractSkills(text) {
        if (!text || typeof text !== 'string') {
            return [];
        }

        const lowerText = text.toLowerCase();
        const foundSkills = [];

        this.SKILLS.forEach(skill => {
            // Properly escape regex special chars for word boundary matching (fixes C++ bug)
            const escaped = skill.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const regex = new RegExp(`\\b${escaped}\\b`, 'gi');
            if (regex.test(lowerText)) {
                if (!foundSkills.includes(skill)) {
                    foundSkills.push(skill);
                }
            }
        });

        return foundSkills;
    }

    /**
     * Calculate match score between resume and job skills
     * Formula: (matching / required) * 100
     * @param {string[]} resumeSkills - Skills from resume
     * @param {string[]} jobSkills - Required skills from job description
     * @returns {{matchScore: number, matchingSkills: string[], missingSkills: string[]}}
     */
    static calculateMatchScore(resumeSkills, jobSkills) {
        if (!Array.isArray(jobSkills) || jobSkills.length === 0) {
            return {
                matchScore: 0,
                matchingSkills: [],
                missingSkills: []
            };
        }

        // Case-insensitive matching
        const resumeLower = resumeSkills.map(s => s.toLowerCase().trim());
        const matchingSkills = jobSkills.filter(jobSkill => 
            resumeLower.includes(jobSkill.toLowerCase().trim())
        );
        const missingSkills = jobSkills.filter(jobSkill => 
            !resumeLower.includes(jobSkill.toLowerCase().trim())
        );

        const matchScore = Math.round((matchingSkills.length / jobSkills.length) * 100);

        return {
            matchScore,
            matchingSkills,
            missingSkills
        };
    }
}

module.exports = SkillService;

