import React from 'react';
import { Link } from 'react-router-dom';
import './Landing.css';

export default function Landing() {
  return (
    <div className="landing">

      {/* ── Top Nav ── */}
      <nav className="landing-nav">
        <div className="lnav-inner">
          <span className="lnav-logo">
            <span className="lnav-logo-icon">C</span>
            Career Craft
          </span>
          <div className="lnav-links">
            <a href="#features">Features</a>
            <a href="#steps">Pricing</a>
          </div>
          <div className="lnav-auth">
            <Link to="/login" className="lnav-login">Login</Link>
            <Link to="/login" className="lnav-signup">Signup</Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="hero-section">
        <div className="hero-inner fade-up">
          <h1 className="hero-title">Your AI Career Co-Pilot</h1>
          <p className="hero-sub">
            Career Craft: AI-Powered Career Application Co-Pilot with the clean,
            professional, and modern SaaS design. Match CVs, generate cover letters
            and track applications — all in one place.
          </p>
          <Link to="/login" className="hero-cta">Get Started</Link>
        </div>
      </section>

      {/* ── Feature Grid ── */}
      <section className="features-section" id="features">
        <div className="section-inner">
          <h2 className="section-heading">Feature Grid</h2>
          <div className="features-grid">

            <div className="feature-card">
              <div className="feature-icon feat-blue">🎯</div>
              <h3>CV Match Score</h3>
              <p>Match resume source and CV row with search to get an accurate match score.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon feat-violet">✉️</div>
              <h3>AI Cover Letters</h3>
              <p>AI-generated tailored cover letters for every job application in seconds.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon feat-cyan">🔔</div>
              <h3>Job Alerts</h3>
              <p>Get personalised job alerts matched to your CV skills and career goals.</p>
            </div>

          </div>
        </div>
      </section>

      {/* ── Simple Steps ── */}
      <section className="steps-section" id="steps">
        <div className="section-inner">
          <h2 className="section-heading">Simple Steps</h2>
          <p className="section-sub">Stop choosing — here are three clear steps to land your dream role.</p>
          <div className="steps-grid">

            <div className="step-card">
              <div className="step-num">1</div>
              <div className="step-icon">📄</div>
              <h3>Upload CV</h3>
              <p>Upload your CV in PDF or DOCX format to get started.</p>
            </div>

            <div className="step-arrow">→</div>

            <div className="step-card">
              <div className="step-num">2</div>
              <div className="step-icon">📋</div>
              <h3>Paste Job Description</h3>
              <p>Paste any job description and let AI extract the required skills.</p>
            </div>

            <div className="step-arrow">→</div>

            <div className="step-card">
              <div className="step-num">3</div>
              <div className="step-icon">🤖</div>
              <h3>Get AI Analysis</h3>
              <p>Receive match score, skill gaps, cover letter and CV health report.</p>
            </div>

          </div>

          {/* mini preview mockup */}
          <div className="steps-preview">
            <div className="preview-screen">
              <div className="preview-col">
                <div className="preview-label">Job Description</div>
                <div className="preview-textarea" />
              </div>
              <div className="preview-col">
                <div className="preview-label">Your CV</div>
                <div className="preview-upload">⬆ Upload zone</div>
              </div>
              <div className="preview-analyze-btn">Analyze</div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
