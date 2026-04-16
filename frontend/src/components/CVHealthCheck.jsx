import React, { useState } from 'react';
import { LucideActivity, AlertCircle, CheckCircle2, Target } from 'lucide-react';
import Toast from './Toast';

const CVHealthCheck = ({ uploadedFilename, onHealthCheck, loading, result }) => {
  const [showDetailed, setShowDetailed] = useState(false);

  const handleCheck = () => {
    if (!uploadedFilename) {
      alert('Please upload a CV first');
      return;
    }
    onHealthCheck(uploadedFilename);
  };

  const formatScore = (score) => {
    if (typeof score === 'number') {
      return score.toFixed(0) + '%';
    }
    return 'N/A';
  };

  return (
    <div className="cv-health-container">
      <div className="section-header">
        <h2 className="section-title">
          <LucideActivity className="inline-icon" />
          CV Health Check
        </h2>
        <p className="section-subtitle">AI-powered analysis for ATS compatibility and quality</p>
      </div>

      <div className="health-actions">
        <button 
          onClick={handleCheck}
          disabled={loading || !uploadedFilename}
          className="btn btn-primary"
        >
          {loading ? (
            <>
              <span className="spinner"></span>
              Analyzing...
            </>
          ) : (
            '🔍 Run CV Health Check'
          )}
        </button>
      </div>

      {result && (
        <div className="health-result">
          <div className="health-summary">
            <div className="overall-score">
              <span className="score-number">{formatScore(result.analysis?.OVERALL_SCORE || 0)}</span>
              <span className="score-label">Overall Quality</span>
            </div>
            
            <div className="score-breakdown">
              {result.analysis?.SCORES && Object.entries(result.analysis.SCORES).map(([category, score]) => (
                <div key={category} className="score-item">
                  <span className="category">{category.replace(/_/g, ' ').toUpperCase()}</span>
                  <span className="score-bar">
                    <div 
                      className="score-fill" 
                      style={{ width: `${Math.min(score * 10, 100)}%` }}
                    />
                  </span>
                  <span className="score-value">{score}/10</span>
                </div>
              ))}
            </div>
          </div>

          {result.analysis?.STRENGTHS && (
            <div className="strengths-section">
              <h4><CheckCircle2 className="inline-icon-sm" /> Strengths</h4>
              <ul>
                {result.analysis.STRENGTHS.slice(0, showDetailed ? 999 : 3).map((strength, i) => (
                  <li key={i}>{strength}</li>
                ))}
                {result.analysis.STRENGTHS.length > 3 && (
                  <button 
                    className="show-more"
                    onClick={() => setShowDetailed(!showDetailed)}
                  >
                    {showDetailed ? 'Show Less' : 'Show All'}
                  </button>
                )}
              </ul>
            </div>
          )}

          {result.analysis?.IMPROVEMENTS && (
            <div className="improvements-section">
              <h4><AlertCircle className="inline-icon-sm" /> Priority Improvements</h4>
              <ol>
                {result.analysis.IMPROVEMENTS.slice(0, showDetailed ? 999 : 5).map((improvement, i) => (
                  <li key={i}>{improvement}</li>
                ))}
                {result.analysis.IMPROVEMENTS.length > 5 && (
                  <button 
                    className="show-more"
                    onClick={() => setShowDetailed(!showDetailed)}
                  >
                    {showDetailed ? 'Show Less' : 'Show All'}
                  </button>
                )}
              </ol>
            </div>
          )}

          {result.analysis?.ATS_KEYWORDS && (
            <div className="ats-section">
              <h4><Target className="inline-icon-sm" /> ATS Keywords to Add</h4>
              <div className="keyword-tags">
                {result.analysis.ATS_KEYWORDS.slice(0, 12).map((keyword, i) => (
                  <span key={i} className="keyword-tag">{keyword}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <style jsx>{`
        .cv-health-container {
          background: var(--card-bg);
          border-radius: var(--radius);
          padding: 2rem;
        }
        .overall-score {
          text-align: center;
          margin-bottom: 2rem;
        }
        .score-number {
          font-size: 3rem;
          font-weight: bold;
          background: linear-gradient(135deg, var(--primary), var(--secondary));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          display: block;
        }
        .score-breakdown {
          display: grid;
          gap: 1rem;
          margin-bottom: 2rem;
        }
        .score-item {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        .category {
          min-width: 150px;
          font-weight: 500;
        }
        .score-bar {
          flex: 1;
          height: 8px;
          background: var(--border);
          border-radius: 4px;
          overflow: hidden;
        }
        .score-fill {
          height: 100%;
          background: linear-gradient(90deg, var(--success), var(--primary));
          transition: width 0.3s ease;
        }
        .strengths-section, .improvements-section {
          margin: 2rem 0;
        }
        .keyword-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }
        .keyword-tag {
          background: var(--primary-bg);
          color: var(--primary);
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.875rem;
        }
        .show-more {
          background: none;
          border: none;
          color: var(--muted);
          cursor: pointer;
          font-size: 0.875rem;
        }
      `}</style>
    </div>
  );
};

export default CVHealthCheck;

