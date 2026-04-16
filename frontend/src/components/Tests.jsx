import React, { useState } from 'react';
import { LucideTestTube2, Play, Download, RefreshCw } from 'lucide-react';

const Tests = ({ uploadedFilename, onGenerateTest }) => {
  const [testType, setTestType] = useState('technical');
  const [difficulty, setDifficulty] = useState('medium');
  const [testLoading, setTestLoading] = useState(false);
  const [generatedTest, setGeneratedTest] = useState(null);

  const testTemplates = [
    { id: 'technical', name: 'Technical Test', desc: 'Coding challenges & technical questions' },
    { id: 'behavioral', name: 'Behavioral Test', desc: 'Situational & behavioral questions' },
    { id: 'aptitude', name: 'Aptitude Test', desc: 'Logical reasoning & aptitude' },
  ];

  const handleGenerateTest = async () => {
    setTestLoading(true);
    try {
      const testData = await onGenerateTest({
        resumeFile: uploadedFilename,
        type: testType,
        difficulty,
        numQuestions: 5
      });
      setGeneratedTest(testData);
    } catch (error) {
      console.error('Test generation failed', error);
    } finally {
      setTestLoading(false);
    }
  };

  return (
    <div className="tests-container">
      <div className="section-header">
        <h2 className="section-title">
          <LucideTestTube2 className="inline-icon" />
          AI-Powered Tests
        </h2>
        <p className="section-subtitle">Practice with personalized test questions</p>
      </div>

      {!uploadedFilename ? (
        <div className="empty-state">
          <div className="empty-icon">🧪</div>
          <h3>Upload your CV to get personalized tests</h3>
          <p>AI generates relevant technical, behavioral, and aptitude tests</p>
        </div>
      ) : (
        <div className="tests-form">
          <div className="form-row">
            <div className="form-group">
              <label>Test Type</label>
              <div className="test-type-grid">
                {testTemplates.map((template) => (
                  <button
                    key={template.id}
                    className={`test-type-btn ${testType === template.id ? 'active' : ''}`}
                    onClick={() => setTestType(template.id)}
                  >
                    <span className="test-type-icon">{template.icon || '⚡'}</span>
                    <span>{template.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Difficulty</label>
              <select 
                value={difficulty} 
                onChange={(e) => setDifficulty(e.target.value)}
                className="form-input"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
          </div>

          <button 
            onClick={handleGenerateTest}
            disabled={testLoading}
            className="generate-test-btn"
          >
            {testLoading ? (
              <>
                <RefreshCw className="spin" />
                Generating Test...
              </>
            ) : (
              <>
                <Play />
                Generate Practice Test
              </>
            )}
          </button>

          {generatedTest && (
            <div className="test-result">
              <div className="test-header">
                <h3>📋 Your Practice Test</h3>
                <button className="btn btn-success btn-sm">
                  <Download size={18} />
                  Download PDF
                </button>
              </div>
              <div className="test-questions">
                {generatedTest.questions.map((question, index) => (
                  <div key={index} className="question-card">
                    <div className="question-number">Q{index + 1}</div>
                    <div className="question-content">
                      <h4>{question.text}</h4>
                      {question.type === 'multiple' && (
                        <ul className="options">
                          {question.options.map((option, optIndex) => (
                            <li key={optIndex}>
                              <label className="option-label">
                                <input type="radio" name={`q${index}`} />
                                {option}
                              </label>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Tests;

