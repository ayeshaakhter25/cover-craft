const ResumeService = require('./src/services/resume.service');
const path = require('path');

const testFile = './uploads/cv_1772912654403_5576.pdf';

console.log('Testing resume extraction...');
console.log('File:', testFile);

ResumeService.extractResumeText(testFile)
    .then(text => {
        console.log('Success! Extracted text length:', text.length);
        console.log('First 200 chars:', text.substring(0, 200));
    })
    .catch(err => {
        console.error('Error:', err.message);
    });

