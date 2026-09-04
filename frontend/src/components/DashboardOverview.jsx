import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './DashboardOverview.css';

const COMPANY_ICONS = ['💼', '🏢', '🚀', '⭐', '🎯', '🔧', '💡', '📊', '🎪', '🏆'];

function scoreColor(s) {
  if (s >= 70) return '#15803d';   // green
  if (s >= 45) return '#b45309';   // amber
  return '#dc2626';                 // red
}

export default function DashboardOverview({ apiBase, stats, recentMatches }) {
  const navigate = useNavigate();
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const s = stats || { userName: 'User', cvUploads: 0, avgMatchScore: 0, coversGenerated: 0 };
  const a = s.analytics || { currentScore: s.avgMatchScore || 0, previousScore: 0, scoreImprovement: 0, skillsDone: 0, initialGaps: 0, remainingGaps: 0, skillGapReduction: 0, jobsRecommended: 0, jobsViewed: 0, jobsSaved: 0, jobsApplied: 0, interviewProbability: 0, careerProgress: 0, interviewNote: 'Estimate based on currently available information.' };
  const matches = recentMatches || [];

  const handleDeleteClick = (matchId, jobTitle) => {
    setDeleteConfirm({ id: matchId, title: jobTitle });
  };

  const confirmDelete = async () => {
    if (!deleteConfirm) return;
    
    setIsDeleting(true);
    try {
      const response = await fetch(`${apiBase}/api/users/matches/${deleteConfirm.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        // Reload the page to refresh data
        window.location.reload();
      } else {
        alert('Failed to delete analysis');
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('Error deleting analysis');
    } finally {
      setIsDeleting(false);
      setDeleteConfirm(null);
    }
  };

  const cancelDelete = () => {
    setDeleteConfirm(null);
  };

  return (
    <div className="dash-page">

      {/* ── Top Stats ── */}
      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-icon-wrap si-blue">📄</div>
          <div>
            <div className="stat-val">{a.currentScore}%</div>
            <div className="stat-lbl">Current Match Score</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrap si-green">🎯</div>
          <div>
            <div className="stat-val">{a.skillsDone}</div>
            <div className="stat-lbl">Skills Completed</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrap si-orange">💼</div>
          <div>
            <div className="stat-val">{a.jobsRecommended}</div>
            <div className="stat-lbl">Jobs Found</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon-wrap si-blue">+</div>
          <div>
            <div className="stat-val">{a.jobsApplied}</div>
            <div className="stat-lbl">Applications</div>
          </div>
        </div>
      </div>

      <section className="analytics-grid">
        <article className="analytics-card">
          <h3>Match Score Growth</h3>
          <div className="metric-compare"><span>Previous <b>{a.previousScore}%</b></span><span>Current <b>{a.currentScore}%</b></span></div>
          <p className={a.scoreImprovement >= 0 ? 'metric-positive' : 'metric-negative'}>{a.scoreImprovement >= 0 ? '+' : ''}{a.scoreImprovement}% improvement</p>
        </article>
        <article className="analytics-card">
          <h3>Skill Gap Reduction</h3>
          <p className="analytics-value">{a.skillGapReduction}%</p>
          <p>{a.initialGaps} initial gaps → {a.remainingGaps} remaining</p>
          <div className="analytics-bar"><i style={{ width: `${a.skillGapReduction}%` }} /></div>
        </article>
        <article className="analytics-card estimate-card">
          <h3>Interview Probability Indicator</h3>
          <p className="analytics-value">{a.interviewProbability}%</p>
          <div className="analytics-bar"><i style={{ width: `${a.interviewProbability}%` }} /></div>
          <small>{a.interviewNote}</small>
        </article>
        <article className="analytics-card progress-card">
          <h3>Overall Career Progress</h3>
          <p className="analytics-value">{a.careerProgress}%</p>
          <div className="analytics-bar"><i style={{ width: `${a.careerProgress}%` }} /></div>
          <small>Based on match, skill completion, roadmap, and applications.</small>
        </article>
      </section>

      <section className="job-statistics card">
        <h3 className="card-section-title">Job Statistics</h3>
        <div className="job-stat-grid"><span><b>{a.jobsRecommended}</b> Jobs Recommended</span><span><b>{a.jobsViewed}</b> Jobs Viewed</span><span><b>{a.jobsSaved}</b> Jobs Saved</span><span><b>{a.jobsApplied}</b> Jobs Applied</span></div>
      </section>

      {/* ── Middle ── */}
      <div className="dash-main">

        {/* Recent Activity */}
        <div className="card dash-card">
          <h3 className="card-section-title">Recent Activity</h3>
          {matches.length === 0 ? (
            <p className="dash-empty">No analyses yet. Start your first analysis!</p>
          ) : (
            <ul className="activity-list">
              {matches.map((m, i) => {
                const sc = m.score ?? m.matchScore ?? 0;
                return (
                  <li key={m.id || i} className="activity-item activity-item-clickable" onClick={() => navigate(`/analysis-history/${m.id}`)} role="button" tabIndex={0} onKeyDown={(event) => { if (event.key === 'Enter') navigate(`/analysis-history/${m.id}`); }}>
                    <span className="activity-icon">{COMPANY_ICONS[i % COMPANY_ICONS.length]}</span>
                    <div className="activity-info">
                      <span className="activity-title">{m.jobTitle && m.jobTitle !== 'Untitled Job' ? m.jobTitle : `Job ${i + 1}`}</span>
                      <span className="activity-sub">{m.company && m.company !== 'Unknown Company' ? m.company : 'CareerCraft Analysis'}</span>
                    </div>
                    <span
                      className="activity-score"
                      style={{ background: `linear-gradient(135deg, ${scoreColor(sc)}, ${scoreColor(sc)}dd)` }}
                    >{sc}%</span>
                    <button 
                      className="delete-btn" 
                      onClick={(event) => { event.stopPropagation(); handleDeleteClick(m.id, m.jobTitle || `Job ${i + 1}`); }}
                      title="Delete analysis"
                    >
                      🗑️
                    </button>
                  </li>
                );
              })}
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

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="delete-modal-overlay">
          <div className="delete-modal">
            <div className="delete-modal-header">
              <h3>Delete Analysis</h3>
            </div>
            <div className="delete-modal-body">
              <p>Are you sure you want to delete the analysis for:</p>
              <p className="delete-target">"{deleteConfirm.title}"</p>
              <p className="delete-warning">This action cannot be undone.</p>
            </div>
            <div className="delete-modal-actions">
              <button 
                className="btn btn-cancel" 
                onClick={cancelDelete}
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button 
                className="btn btn-delete" 
                onClick={confirmDelete}
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
