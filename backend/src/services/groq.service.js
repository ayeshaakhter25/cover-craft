const Groq = require("groq");
require('dotenv').config();

class GroqService {
  constructor() {
    this.client = new Groq({ apiKey: process.env.GROQ_API_KEY });
  }

  async generateCoverLetter(cvSkills, jdText, jobTitle = 'the position') {
    const prompt = `
You are a professional career coach. Generate a tailored cover letter for ${jobTitle}.

Resume skills: ${cvSkills.join(', ')}
Job description: ${jdText.substring(0, 2000)}...

Requirements:
- 3-4 paragraphs
- Professional tone
- Highlight matching skills
- Show enthusiasm
- 250-350 words
- ATS friendly (keywords from JD)

Format:
Dear Hiring Manager,
[Body]
Sincerely,
[Candidate Name]
    `;

    try {
      const chatCompletion = await this.client.chat.completions.create({
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        model: "llama3.1-70b-versatile",
        temperature: 0.7,
        max_tokens: 800,
      });

      return chatCompletion.choices[0]?.message?.content || "Generation failed";
    } catch (error) {
      throw new Error(`Groq API error: ${error.message}`);
    }
  }

  async generateEmailDraft(jobTitle, company, cvSkills) {
    const prompt = `
Generate professional job application email for ${jobTitle} at ${company}.

Resume skills: ${cvSkills.join(', ')}

Include:
- Subject line
- Polite introduction
- Attach CV mention
- Call to action
- Professional signature

Subject: Application for ${jobTitle} - [Your Name]
`;

    const chatCompletion = await this.client.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama3.1-8b-instant",
      temperature: 0.5,
      max_tokens: 400,
    });

    return chatCompletion.choices[0]?.message?.content || "Generation failed";
  }
}

module.exports = GroqService;

