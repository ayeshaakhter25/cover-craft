import React from 'react';
import { useNavigate } from 'react-router-dom';
import './DashboardOverview.css';

const COMPANY_ICONS = ['🟦', '🟫', '🍏', '🟧'];

export default function DashboardOverview({ stats, recentMatches }) {
  const navigate = useNavigate();

  const s = stats || { userName: 'User', cvUploads: 0, avgMatchScore: 0, coversGenerated: 0 };
  const matches = recentMatches || [];

  return (
    <div className="dash-page">

      {/* ── Top Stats ── */}
      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-icon-wrap si-blue">📄</div>
          <div>
            <div className="stat-val">{s.cvUploads}</div>
            <div className="stat-lbl">Total CVs Analyzed</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrap si-green">🎯</div>
          <div>
            <div className="stat-val">{s.avgMatchScore}%</div>
            <div className="stat-lbl">Average Match Score</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrap si-orange">💼</div>
          <div>
            <div className="stat-val">{s.coversGenerated}</div>
            <div className="stat-lbl">Job Applications</div>
          </div>
        </div>
      </div>

      {/* ── Middle ── */}
      <div className="dash-main">

        {/* Recent Activity */}
        <div className="card dash-card">
          <h3 className="card-section-title">Recent Activity</h3>
          {matches.length === 0 ? (
            <p className="dash-empty">No analyses yet. Start your first analysis!</p>
          ) : (
            <ul className="activity-list">
              {matches.map((m, i) => (
                <li key={i} className="activity-item">
                  <span className="activity-icon">{COMPANY_ICONS[i % COMPANY_ICONS.length]}</span>
                  <div className="activity-info">
                    <span className="activity-title">{m.jobTitle || 'Untitled Job'}</span>
                    <span className="activity-sub">{m.company || 'Company'}</span>
                  </div>
                  <span className="activity-score">{m.score ?? m.matchScore ?? 0}%</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Quick Actions */}
        <div className="card dash-card quick-actions-card">
          <h3 className="card-section-title">Quick Actions</h3>
          <div className="quick-btns">
            <button
              className="btn btn-primary quick-btn"
              onClick={() => navigate('/analysis')}
            >
              New Analysis
            </button>
            <button
              className="btn btn-primary quick-btn"
              onClick={() => navigate('/cover')}
            >
              Generate Cover Letter
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

