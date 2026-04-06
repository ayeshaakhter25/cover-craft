const SkillService = require('./src/services/skill.service');
const ResumeService = require('./src/services/resume.service');
const path = require('path');
const fs = require('fs');

async function testSkills() {
  console.log('🧪 Testing Skill Extraction...');
  
  // Test 1: Direct text
  const testText = `
  5 years experience with React, JavaScript and Node.js. 
  Proficient in Python, SQL databases. Use Docker and Git daily. 
  Strong communication and leadership skills.
  `;
  
  const skills1 = SkillService.extractSkills(testText);
  console.log('Test 1 (direct text):', skills1);

  // Test 2: From uploaded CV file
  const cvFiles = fs.readdirSync('uploads').filter(f => f.endsWith('.pdf'));
  if (cvFiles.length > 0) {
    const testFile = path.join('uploads', cvFiles[0]);
    console.log('Testing file:', testFile);
    
    try {
      const result = await ResumeService.extractResumeWithSkills(testFile);
      console.log('CV Skills:', result.skills);
      console.log('Skills count:', result.skills.length);
    } catch (error) {
      console.error('CV test error:', error.message);
    }
  } else {
    console.log('No CV files in uploads/');
  }
}

testSkills();

