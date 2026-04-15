const fetch = require('node-fetch');

async function testMatch() {
  try {
    const response = await fetch('http://localhost:5000/api/match-score', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        resumeFile: 'cv_1775501526908_1740.pdf',
        jobFile: 'jd_1775501568663_7430.txt'
      }),
    });

    const data = await response.json();
    console.log('Status:', response.status);
    console.log('Response:', JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testMatch();
