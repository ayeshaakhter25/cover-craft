import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Results.css';

/* ── SVG circular gauge ── */
function Gauge({ value }) {
  const r       = 60;
  const cx      = 80;
  const cy      = 80;
  const circ    = 2 * Math.PI * r;
  const pct     = Math.min(Math.max(value, 0), 100);
  const offset  = circ * (1 - pct / 100);

  const color   = pct >= 70 ? '#16a34a' : pct >= 45 ? '#d97706' : '#dc2626';

  return (
    <svg width="160" height="160" viewBox="0 0 160 160" className="gauge-svg">
      {/* background arc */}
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#e2e8f0" strokeWidth="12" />
      {/* progress arc */}
      <circle
        cx={cx} cy={cy} r={r}
        fill="none"
        stroke={color}
        strokeWidth="12"
        strokeLinecap="round"
        strokeDasharray={circ}
        strokeDashoffset={offset}
        transform={`rotate(-90 ${cx} ${cy})`}
        style={{ transition: 'stroke-dashoffset .8s ease' }}
      />
      <text x={cx} y={cy - 6} textAnchor="middle" className="gauge-pct" fill={color}>{pct}%</text>
      <text x={cx} y={cy + 16} textAnchor="middle" className="gauge-label" fill="#64748b">Match</text>
    </svg>
  );
}

/* ── Health row ── */
function HealthRow({ label, status }) {
  const icon = status === 'ok' ? '✅' : '⚠️';
  return (
    <div className="health-row">
      <span>{icon}</span>
      <span className="health-label">{label}</span>
    </div>
  );
}

export default function Results({ matchResult, skills }) {
  const navigate = useNavigate();

  if (!matchResult) {
    return (
      <div className="results-empty">
        <div className="results-empty-icon">📊</div>
        <h3>No results yet</h3>
        <p>Run an analysis first to see your match score and insights.</p>
        <button className="btn btn-primary" onClick={() => navigate('/analysis')}>
          Go to Analysis
        </button>
      </div>
    );
  }

  const score    = matchResult.matchScore ?? 0;
  const matching = matchResult.matchingSkills ?? [];
  const missing  = matchResult.missingSkills  ?? [];

  // Simple CV health heuristics
  const health = [
    { label: 'Good Length',       status: (matchResult.extractedTextLength || 500) > 300 ? 'ok' : 'warn' },
    { label: 'Professional Tone', status: 'ok' },
    { label: 'Keywords Present',  status: matching.length > 0 ? 'ok' : 'warn' },
    { label: 'Action Verbs',      status: 'ok' },
  ];

  const tips = [
    missing[0] && `Add '${missing[0]}' to your experience section.`,
    missing[1] && `Highlight your knowledge of '${missing[1]}' in a project.`,
    `Quantify achievements: use numbers and percentages.`,
    `Tailor the CV summary to match this specific job.`,
    `Include relevant certifications if available.`,
  ].filter(Boolean);

  return (
    <div className="results-page">

      {/* ── Top row (Gauge + Skill Gap) ── */}
      <div className="results-top">

        {/* Match Gauge */}
        <div className="card results-card gauge-card">
          <h3 className="rc-title">Match Score Gauge</h3>
          <div className="gauge-wrap">
            <Gauge value={score} />
            <p className="gauge-sub">Software Engineer</p>
          </div>
          <div className="gauge-footer">
            Recommended: Software Engineer @ this role → cover-gen
          </div>
        </div>

        {/* Skill Gap */}
        <div className="card results-card skill-card">
          <h3 className="rc-title">Skill Gap Analysis</h3>
          <div className="skill-cols">
            <div className="skill-col">
              <div className="skill-col-head">Skills You Have</div>
              <div className="tags">
                {matching.length === 0 && <span className="no-skills">None matched</span>}
                {matching.map((s, i) => <span key={i} className="tag tag-green">{s}</span>)}
              </div>
            </div>
            <div className="skill-col">
              <div className="skill-col-head missing">Missing Skills</div>
              <div className="tags">
                {missing.length === 0 && <span className="no-skills" style={{color:'var(--success)'}}>All skills matched! 🎉</span>}
                {missing.map((s, i) => (
                  <span key={i} className={`tag ${i % 2 === 0 ? 'tag-red' : 'tag-orange'}`}>{s}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* ── Bottom row (Health + Tips) ── */}
      <div className="results-bottom">

        {/* CV Health Check */}
        <div className="card results-card health-card">
          <h3 className="rc-title">CV Health Check™ Card</h3>
          <div className="health-list">
            {health.map((h, i) => <HealthRow key={i} label={h.label} status={h.status} />)}
          </div>
          <p className="health-note">
            Recommendations and keywords found consistently in starters in reactors.
          </p>
        </div>

        {/* Optimization Tips */}
        <div className="card results-card tips-card">
          <h3 className="rc-title">Optimization Tips</h3>
          <ul className="tips-list">
            {tips.map((t, i) => (
              <li key={i} className="tip-item">
                <span className="tip-num">{i + 1}</span>
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </div>

      </div>

      {/* ── Actions ── */}
      <div className="results-actions">
        <button className="btn btn-primary" onClick={() => navigate('/cover')}>
          ✨ Generate Cover Letter
        </button>
        <button className="btn btn-ghost" onClick={() => navigate('/analysis')}>
          ← New Analysis
        </button>
      </div>

    </div>
  );
}
