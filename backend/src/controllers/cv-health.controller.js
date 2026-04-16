const ResumeService = require('../services/resume.service');
const GroqService = require('../services/groq.service');
const fs = require('fs').promises;
const path = require('path');

/**
 * CV Health Check - AI Analysis
 * POST /api/cv/health-check
 */
const healthCheck = async (req, res) => {
  try {
    const { resumeFile } = req.body;

    if (!resumeFile) {
      return res.status(400).json({ error: 'resumeFile required' });
    }

    const resumePath = path.join('uploads', resumeFile);
    
    // Extract text
    const resumeData = await ResumeService.extractResumeWithSkills(resumePath);
    const text = resumeData.extractedText;

    if (!text || text.length < 100) {
      return res.status(400).json({ error: 'Valid resume text not found' });
    }

    const groq = new GroqService();
    
    const prompt = `
Analyze this CV for job application quality:

CV TEXT: ${text.substring(0, 4000)}

Score each category 1-10:
1. Grammar & Spelling (10/10 = perfect)
2. Content Length (optimal ~1-2 pages)
3. Active Voice Usage (action verbs vs passive)
4. Quantifiable Achievements (numbers, metrics)
5. ATS Compatibility (keywords, formatting)
6. Clarity & Readability
7. Structure & Organization
8. Relevance & Customization

Provide:
- OVERALL_SCORE (0-100%)
- SCORES object with 1-10 ratings
- STRENGTHS array (3+ bullet points)
- IMPROVEMENTS array (3+ prioritized suggestions)
- ATS_KEYWORDS array (10+ suggested keywords)
- ESTIMATED_READ_TIME (minutes)

Format as JSON only.
`;

    const analysis = await groq.client.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama3.1-70b-versatile",
      temperature: 0.3,
      max_tokens: 1000,
    });

    let result;
    try {
      result = JSON.parse(analysis.choices[0].message.content);
    } catch {
      result = { overallScore: 50, issues: 'Analysis parsing error' };
    }

    res.json({
      success: true,
      filename: resumeFile,
      wordCount: text.split(' ').length,
      analysis: result
    });

  } catch (error) {
    console.error('CV Health Check error:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = { healthCheck };

