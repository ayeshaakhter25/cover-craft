import React, { useState } from 'react';
import './CoverLetter.css';

const STYLES = [
  { key: 'technical',   label: 'Technical' },
  { key: 'achievement', label: 'Achievement' },
  { key: 'creative',    label: 'Creative' },
  { key: 'short',       label: 'Short' },
];

export default function CoverLetter({ uploadedFilename, jdFilename, addToast, apiBase }) {
  const [activeStyle, setActiveStyle]   = useState('technical');
  const [letter, setLetter]             = useState('');
  const [loading, setLoading]           = useState(false);
  const [allowEdit, setAllowEdit]       = useState(false);

  const generate = async () => {
    if (!uploadedFilename) { addToast('Upload a CV first', 'warning'); return; }
    if (!jdFilename)        { addToast('Run an analysis with a job description first', 'warning'); return; }
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res  = await fetch(`${apiBase}/api/cover/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : ''
        },
        body: JSON.stringify({
          resumeFile: uploadedFilename,
          jobFile: jdFilename,
          style: activeStyle
        })
      });
      const data = await res.json();
      if (res.ok) {
        setLetter(data.coverLetter || '');
        addToast('Cover letter generated!', 'success');
      } else {
        addToast(data.error || 'Generation failed', 'error');
      }
    } catch {
      addToast('Network error', 'error');
    } finally {
      setLoading(false);
    }
  };

  const downloadTxt = () => {
    if (!letter) return;
    const blob = new Blob([letter], { type: 'text/plain;charset=utf-8' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url; a.download = 'cover_letter.txt';
    document.body.appendChild(a); a.click();
    a.remove(); URL.revokeObjectURL(url);
  };

  const downloadDocx = () => {
    // Simple HTML to download as .doc (opens in Word)
    if (!letter) return;
    const html  = `<html><body><pre style="font-family:Calibri,sans-serif;font-size:12pt;">${letter}</pre></body></html>`;
    const blob  = new Blob([html], { type: 'application/msword' });
    const url   = URL.createObjectURL(blob);
    const a     = document.createElement('a');
    a.href = url; a.download = 'cover_letter.doc';
    document.body.appendChild(a); a.click();
    a.remove(); URL.revokeObjectURL(url);
  };

  const printPDF = () => {
    if (!letter) return;
    const win = window.open('', '_blank');
    win.document.write(`
      <html>
        <head>
          <title>Cover Letter</title>
          <style>
            body { font-family: 'Calibri', sans-serif; font-size: 13pt; line-height: 1.7; padding: 3rem; color: #1a1a2e; }
            pre  { white-space: pre-wrap; word-break: break-word; }
          </style>
        </head>
        <body><pre>${letter}</pre></body>
      </html>`);
    win.document.close();
    win.focus();
    setTimeout(() => { win.print(); win.close(); }, 400);
  };

  return (
    <div className="cover-page">

      {/* ── Style Selector ── */}
      <div className="card cover-card">
        <h3 className="cover-section-title">Style Selector</h3>
        <div className="style-tabs">
          {STYLES.map(s => (
            <button
              key={s.key}
              className={`style-tab ${activeStyle === s.key ? 'active' : ''}`}
              onClick={() => setActiveStyle(s.key)}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── AI Editor ── */}
      <div className="card cover-card">
        <div className="cover-editor-header">
          <h3 className="cover-section-title">AI Editor</h3>
          <label className="allow-edit-label">
            <input
              type="checkbox"
              checked={allowEdit}
              onChange={(e) => setAllowEdit(e.target.checked)}
            />
            ✏️ Allow editor
          </label>
        </div>
        <p className="cover-editor-sub">
          Generated letter text editor, and generated letter to allows editing.
        </p>

        {/* Generate button */}
        <button
          className="btn btn-primary cover-gen-btn"
          onClick={generate}
          disabled={loading}
        >
          {loading ? <><span className="spinner" /> Generating...</> : '✨ Generate Cover Letter'}
        </button>

        {/* Editor area */}
        <div className={`editor-wrap ${!letter ? 'editor-empty' : ''}`}>
          {!letter && !loading && (
            <div className="editor-placeholder">
              <span>🤖</span>
              <p>Your AI-generated cover letter will appear here.</p>
              <p className="editor-placeholder-sub">Click "Generate Cover Letter" above to get started.</p>
            </div>
          )}
          {(letter || loading) && (
            <textarea
              className="cover-editor-textarea"
              value={loading ? 'Generating your cover letter...' : letter}
              onChange={(e) => allowEdit && setLetter(e.target.value)}
              readOnly={!allowEdit}
              rows={18}
            />
          )}
        </div>
      </div>

      {/* ── Download Options ── */}
      <div className="card cover-card cover-downloads">
        <button
          className="btn btn-download-pdf"
          onClick={printPDF}
          disabled={!letter}
        >
          ⬇ Download PDF
        </button>
        <button
          className="btn btn-download-docx"
          onClick={downloadDocx}
          disabled={!letter}
        >
          📄 Export to .docx
        </button>
        <button
          className="btn btn-ghost"
          onClick={downloadTxt}
          disabled={!letter}
        >
          📋 Copy as Text
        </button>
      </div>

    </div>
  );
}

