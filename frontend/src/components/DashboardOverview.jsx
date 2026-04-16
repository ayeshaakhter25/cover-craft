import React from 'react';
import { LucideUpload, FileText, Target, FilePenLine, TestTube2 } from 'lucide-react';
import './DashboardOverview.css';

const DashboardOverview = ({ stats, recentMatches, onQuickAction }) => {
  return (
    <div className="dashboard-overview">
      <div className="dashboard-card">
        <div className="overview-header">
        <h1 className="overview-title">Welcome back, {stats.userName}!</h1>
        <p className="overview-subtitle">Your AI-powered career companion</p>
        </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <LucideUpload className="icon" />
          </div>
          <div className="stat-content">
            <div className="stat-number">{stats.cvUploads}</div>
            <div className="stat-label">CVs Uploaded</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <FileText className="icon" />
          </div>
          <div className="stat-content">
            <div className="stat-number">{stats.jobsSaved}</div>
            <div className="stat-label">Jobs Saved</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <Target className="icon" />
          </div>
          <div className="stat-content">
            <div className="stat-number">{stats.avgMatchScore}%</div>
            <div className="stat-label">Avg Match</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <FilePenLine className="icon" />
          </div>
          <div className="stat-content">
            <div className="stat-number">{stats.coversGenerated}</div>
            <div className="stat-label">Covers Made</div>
          </div>
        </div>
      </div>

      <div className="recent-section">
        <h3 className="section-title">Recent Matches</h3>
        <div className="recent-grid">
          {recentMatches.map((match, index) => (
            <div key={index} className="recent-card">
              <div className="recent-header">
                <span className="recent-score">{match.score}%</span>
                <span className="recent-job">{match.jobTitle}</span>
              </div>
              <div className="match-progress" aria-hidden="true">
                <i style={{ width: `${match.score}%` }}></i>
              </div>
              <div className="recent-actions">
                <button className="btn btn-sm" onClick={() => onQuickAction('view', match)}>
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
        <button className="quick-action" onClick={() => onQuickAction('new')}>
          🚀 New Match Analysis
        </button>
      </div>
      </div>
    </div>
  );
};

export default DashboardOverview;

