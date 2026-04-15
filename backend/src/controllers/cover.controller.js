const GroqService = require('../services/groq.service');
const SkillService = require('../services/skill.service');
const ResumeService = require('../services/resume.service');
const JobService = require('../services/job.service');

/**
 * Generate AI cover letter
 * POST /api/cover/generate
 */
const generateCoverLetter = async (req, res) => {
  try {
    const { resumeFile, jobFile, jobTitle = 'Software Engineer' } = req.body;

    // Extract skills
    const resumeResult = await ResumeService.extractResumeWithSkills(`uploads/${resumeFile}`);
    const { skills: resumeSkills } = resumeResult;

    const jdText = await JobService.readJobDescription(jobFile);

    const groq = new GroqService();
    const coverLetter = await groq.generateCoverLetter(resumeSkills, jdText, jobTitle);

    res.json({
      success: true,
      coverLetter,
      wordCount: coverLetter.split(' ').length,
      usedSkills: resumeSkills
    });
  } catch (error) {
    console.error('Cover letter error:', error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Generate application email
 * POST /api/cover/email
 */
const generateEmail = async (req, res) => {
  try {
    const { resumeFile, jobTitle, company } = req.body;
    
    const resumeResult = await ResumeService.extractResumeWithSkills(`uploads/${resumeFile}`);
    const { skills } = resumeResult;

    const groq = new GroqService();
    const email = await groq.generateEmailDraft(jobTitle, company || 'the company', skills);

    res.json({ success: true, email });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { generateCoverLetter, generateEmail };

