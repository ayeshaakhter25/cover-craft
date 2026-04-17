const Groq = require("groq-sdk");
require('dotenv').config();

class GroqService {
  constructor() {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      console.log('GROQ_API_KEY missing - Cover letter will use fallback');
      this.client = null;
      return;
    }
    this.client = new Groq({ apiKey: apiKey });
  }

  async generateCoverLetter(cvSkills, jdText, jobTitle = 'Software Engineer') {
    if (!this.client) {
      return {
        fallback: true,
        content: `Dear Hiring Manager,

I am excited to apply for the ${jobTitle} position at your company. With my experience in ${cvSkills.join(', ')} and strong passion for technology, I am confident in my ability to contribute to your team.

In my previous roles, I have successfully [achievements matching job]. I am particularly drawn to this role because [why this company].

I would welcome the opportunity to discuss how my background aligns with your needs.

Sincerely,
[Your Name]`,
        note: 'Add GROQ_API_KEY to .env for AI generation'
      };
    }

    const prompt = `Generate professional cover letter for ${jobTitle}. Resume skills: ${cvSkills.slice(0,10).join(', ')}. Job description excerpt: ${jdText.slice(0,1000)}. 3 paragraphs, ATS friendly, highlight matching skills. Format: Dear Hiring Manager, [body] Sincerely, [Name]`;

    try {
      const response = await this.client.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: "llama-3.3-70b-versatile",
        temperature: 0.7,
        max_tokens: 600
      });
      return { content: response.choices[0].message.content };
    } catch (error) {
      console.error('Groq API error:', error.message);
      return {
        fallback: true,
        content: `Dear Hiring Manager,\\n\\nI am excited to apply for the ${jobTitle} position. With skills in ${cvSkills.slice(0,5).join(', ')}, I can contribute effectively. Looking forward to discussing further.\\n\\nSincerely,\\nYour Name`,
        note: 'AI service unavailable'
      };
    }
  }
}

module.exports = GroqService;
