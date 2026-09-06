import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './DashboardOverview.css';
import { IconDoc, IconTarget, IconBriefcase, IconPlus, IconTrendUp, IconEditSquare, IconBarChart, IconStar, IconClock, IconBolt, IconEye, IconBookmark, IconSend, IconTrash, IconChevronRight } from './DashboardIcons';

const QUOTES = [
  'Small steps every day lead to big results.',
  'Consistency beats intensity.',
  'Every application is a step closer.',
  'Progress, not perfection.',
];

function scoreColor(s) {
  if (s >= 70) return '#15803d';   // green
  if (s >= 45) return '#b45309';   // amber
  return '#dc2626';                 // red
}

function clampPct(n) {
  const num = Number(n) || 0;
  return Math.max(0, Math.min(100, num));
}

// Strips stray markdown heading markers ("# ", "## ") that sometimes leak
// into scraped job titles/company names.
function cleanText(text) {
  if (!text) return text;
  return text.replace(/^#+\s*/, '').trim();
}

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good Morning';
  if (h < 18) return 'Good Afternoon';
  return 'Good Evening';
}

export default function DashboardOverview({ apiBase, stats, recentMatches, onMatchDeleted }) {
  const navigate = useNavigate();
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  const s = stats || { userName: 'User', cvUploads: 0, avgMatchScore: 0, coversGenerated: 0 };
  const a = s.analytics || { currentScore: s.avgMatchScore || 0, previousScore: 0, scoreImprovement: 0, skillsDone: 0, initialGaps: 0, remainingGaps: 0, skillGapReduction: 0, jobsRecommended: 0, jobsViewed: 0, jobsSaved: 0, jobsApplied: 0, interviewProbability: 0, careerProgress: 0, roadmapProgress: 0, interviewNote: 'Estimate based on currently available information.' };
  const matches = recentMatches || [];
  const quote = QUOTES[new Date().getDate() % QUOTES.length];

  const handleDeleteClick = (matchId, jobTitle) => {
    if (!matchId) return;
    setDeleteError('');
    setDeleteConfirm({ id: matchId, title: jobTitle });
  };

  const confirmDelete = async () => {
    if (!deleteConfirm?.id) return;

    setIsDeleting(true);
    setDeleteError('');
    try {
      const response = await fetch(`${apiBase}/api/users/matches/${deleteConfirm.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        onMatchDeleted?.(deleteConfirm.id);
        setDeleteConfirm(null);
      } else {
        let message = 'Failed to delete analysis';
        try {
          const body = await response.json();
          message = body?.message || message;
        } catch { /* non-JSON error body */ }
        setDeleteError(message);
      }
    } catch (error) {
      console.error('Delete error:', error);
      setDeleteError('Network error while deleting analysis. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  const cancelDelete = () => {
    setDeleteConfirm(null);
    setDeleteError('');
  };

  return (
    <div className="dash-page">

      {/* ── Greeting ── */}
      <div className="dash-greeting">
        <div>
          <h2>👋 {greeting()}, {s.userName || 'User'}</h2>
          <p>Here's your career progress at a glance. Keep going! 🎯</p>
        </div>
        <div className="dash-quote">
          <span>"{quote}"</span>
          <IconTrendUp className="dash-quote-icon" />
        </div>
      </div>

      {/* ── Top Stats ── */}
      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-icon-wrap si-blue"><IconDoc /></div>
          <div className="stat-body">
            <div className="stat-val">{a.currentScore}%</div>
            <div className="stat-lbl">Current Match Score</div>
            <div className={`stat-trend ${a.scoreImprovement >= 0 ? 'trend-up' : 'trend-down'}`}>
              {a.scoreImprovement >= 0 ? '▲' : '▼'} {a.scoreImprovement >= 0 ? '+' : ''}{a.scoreImprovement}% improvement
            </div>
          </div>
          <IconChevronRight className="stat-chevron" />
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrap si-green"><IconTarget /></div>
          <div className="stat-body">
            <div className="stat-val">{a.skillsDone}</div>
            <div className="stat-lbl">Skills Completed</div>
          </div>
          <IconChevronRight className="stat-chevron" />
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrap si-orange"><IconBriefcase /></div>
          <div className="stat-body">
            <div className="stat-val">{a.jobsRecommended}</div>
            <div className="stat-lbl">Jobs Found</div>
          </div>
          <IconChevronRight className="stat-chevron" />
        </div>
        <div className="stat-card">
          <div className="stat-icon-wrap si-blue"><IconPlus /></div>
          <div className="stat-body">
            <div className="stat-val">{a.jobsApplied}</div>
            <div className="stat-lbl">Applications</div>
          </div>
          <IconChevronRight className="stat-chevron" />
        </div>
      </div>

      <section className="analytics-grid">
        <article className="analytics-card">
          <div className="analytics-head"><span className="analytics-icon ai-blue"><IconTrendUp /></span><h3>Match Score Growth</h3></div>
          <div className="metric-compare"><span>Previous <b>{a.previousScore}%</b></span><span>Current <b>{a.currentScore}%</b></span></div>
          <p className={a.scoreImprovement >= 0 ? 'metric-positive' : 'metric-negative'}>{a.scoreImprovement >= 0 ? '▲ +' : '▼ '}{a.scoreImprovement}% improvement</p>
          <IconTrendUp className="analytics-deco deco-blue" />
        </article>
        <article className="analytics-card">
          <div className="analytics-head"><span className="analytics-icon ai-green"><IconEditSquare /></span><h3>Skill Gap Reduction</h3></div>
          <p className="analytics-value">{a.skillGapReduction}%</p>
          <p>{a.initialGaps} initial gaps → {a.remainingGaps} remaining</p>
          <div className="analytics-bar"><i className="bar-green" style={{ width: `${clampPct(a.skillGapReduction)}%` }} /></div>
          <IconTarget className="analytics-deco deco-green" />
        </article>
        <article className="analytics-card estimate-card">
          <div className="analytics-head"><span className="analytics-icon ai-gold"><IconBarChart /></span><h3>Interview Probability Indicator</h3></div>
          <p className="analytics-value">{a.interviewProbability}%</p>
          <div className="analytics-bar"><i className="bar-gold" style={{ width: `${clampPct(a.interviewProbability)}%` }} /></div>
          <small>{a.interviewNote}</small>
          <IconTrendUp className="analytics-deco deco-gold" />
        </article>
        <article className="analytics-card progress-card">
          <div className="analytics-head"><span className="analytics-icon ai-blue2"><IconStar /></span><h3>Overall Career Progress</h3></div>
          <p className="analytics-value">{a.careerProgress}%</p>
          <div className="analytics-bar"><i className="bar-blue" style={{ width: `${clampPct(a.careerProgress)}%` }} /></div>
          <small>Based on match, skill completion, roadmap, and applications.</small>
          <IconTrendUp className="analytics-deco deco-blue2" />
        </article>
      </section>

      <section className="job-statistics card">
        <div className="job-stats-header">
          <h3 className="card-section-title no-border"><span className="jstat-icon"><IconBriefcase /></span>Job Statistics</h3>
          <button className="link-btn" onClick={() => navigate('/jobs')}><IconBarChart width={16} height={16} /> Total Jobs Overview</button>
        </div>
        <div className="job-stat-grid">
          <span><i className="jstat-mini jm-star"><IconStar /></i><b>{a.jobsRecommended}</b>Jobs Recommended</span>
          <span><i className="jstat-mini jm-eye"><IconEye /></i><b>{a.jobsViewed}</b>Jobs Viewed</span>
          <span><i className="jstat-mini jm-save"><IconBookmark /></i><b>{a.jobsSaved}</b>Jobs Saved</span>
          <span><i className="jstat-mini jm-send"><IconSend /></i><b>{a.jobsApplied}</b>Jobs Applied</span>
        </div>
      </section>

      {/* ── Middle ── */}
      <div className="dash-main">

        {/* Recent Activity */}
        <div className="card dash-card">
          <div className="job-stats-header">
            <h3 className="card-section-title no-border"><span className="jstat-icon"><IconClock /></span>Recent Activity</h3>
            {matches.length > 0 && (
              <button className="link-btn" onClick={() => navigate(`/analysis-history/${matches[0].id}`)}>View All <IconChevronRight width={14} height={14} /></button>
            )}
          </div>
          {matches.length === 0 ? (
            <p className="dash-empty">No analyses yet. Start your first analysis!</p>
          ) : (
            <ul className="activity-list">
              {matches.map((m, i) => {
                const sc = m.score ?? m.matchScore ?? 0;
                const title = cleanText(m.jobTitle);
                const company = cleanText(m.company);
                return (
                  <li key={m.id || i} className="activity-item activity-item-clickable" onClick={() => navigate(`/analysis-history/${m.id}`)} role="button" tabIndex={0} onKeyDown={(event) => { if (event.key === 'Enter') navigate(`/analysis-history/${m.id}`); }}>
                    <span className="activity-icon"><IconBriefcase width={16} height={16} /></span>
                    <div className="activity-info">
                      <span className="activity-title">{title && title !== 'Untitled Job' ? title : `Job ${i + 1}`}</span>
                      <span className="activity-sub">{company && company !== 'Unknown Company' ? company : 'CareerCraft Analysis'}</span>
                    </div>
                    <span
                      className="activity-score"
                      style={{ background: `linear-gradient(135deg, ${scoreColor(sc)}, ${scoreColor(sc)}dd)` }}
                    >{sc}%</span>
                    <button
                      className="delete-btn"
                      onClick={(event) => { event.stopPropagation(); handleDeleteClick(m.id, title || `Job ${i + 1}`); }}
                      title="Delete analysis"
                    >
                      <IconTrash width={16} height={16} />
                    </button>
                    <IconChevronRight className="activity-chevron" />
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Quick Actions */}
        <div className="card dash-card quick-actions-card">
          <h3 className="card-section-title"><span className="jstat-icon"><IconBolt /></span>Quick Actions</h3>
          <div className="quick-btns">
            <button
              className="btn btn-primary quick-btn"
              onClick={() => navigate('/analysis')}
            >
              <span><IconBarChart width={16} height={16} /> New Analysis</span><IconChevronRight className="quick-chevron" />
            </button>
            <button
              className="btn btn-primary quick-btn"
              onClick={() => navigate('/cover')}
            >
              <span><IconDoc width={16} height={16} /> Generate Cover Letter</span><IconChevronRight className="quick-chevron" />
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
              {deleteError && <p className="delete-error">{deleteError}</p>}
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
