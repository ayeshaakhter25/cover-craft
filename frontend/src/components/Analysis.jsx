import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './Analysis.css';

export default function Analysis({ apiBase, uploadedFilename, setUploadedFilename, setExtractedText, setSkills, setJdFilename, setMatchResult, addToast }) {
  const [jdText, setJdText]     = useState('');
  const [file, setFile]         = useState(null);
  const [filePreview, setFilePreview] = useState('');
  const [loading, setLoading]   = useState(false);
  const fileRef = useRef();
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    const valid = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!valid.includes(f.type)) { addToast('Only PDF or DOCX allowed', 'error'); return; }
    if (f.size > 10 * 1024 * 1024) { addToast('File must be < 10 MB', 'error'); return; }
    setFile(f);
    setFilePreview(f.name);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const f = e.dataTransfer.files[0];
    if (f) { const fakeEv = { target: { files: [f] } }; handleFileChange(fakeEv); }
  };

  const uploadCV = async () => {
    if (!file) return null;
    const formData = new FormData();
    formData.append('cv', file);
    const token = localStorage.getItem('token');
    const res  = await fetch(`${apiBase}/api/upload-cv`, {
      method: 'POST', body: formData,
      headers: { 'Authorization': token ? `Bearer ${token}` : '' }
    });
    const data = await res.json();
    if (res.ok) {
      setUploadedFilename(data.filename);
      setExtractedText(data.extractedText || '');
      setSkills(data.skills || []);
      return data.filename;
    }
    addToast(data.message || 'Upload failed', 'error');
    return null;
  };

  const saveJob = async () => {
    const token = localStorage.getItem('token');
    const res  = await fetch(`${apiBase}/api/job-description`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': token ? `Bearer ${token}` : '' },
      body: JSON.stringify({ jobDescription: jdText })
    });
    const data = await res.json();
    if (res.ok) {
      if (setJdFilename) setJdFilename(data.filename);
      return data.filename;
    }
    addToast(data.message || 'Failed to save JD', 'error');
    return null;
  };

  const handleAnalyze = async () => {
    if (!jdText.trim() && !jdText) { addToast('Please paste a job description', 'warning'); return; }
    if (!file && !uploadedFilename) { addToast('Please upload your CV', 'warning'); return; }
    setLoading(true);
    try {
      let resume = uploadedFilename;
      if (!resume && file) resume = await uploadCV();
      if (!resume) { setLoading(false); return; }

      let jobFile = null;
      if (jdText.trim()) jobFile = await saveJob();

      const token = localStorage.getItem('token');
      const res  = await fetch(`${apiBase}/api/match-score`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': token ? `Bearer ${token}` : '' },
        body: JSON.stringify({ resumeFile: resume, jobFile })
      });
      const data = await res.json();
      if (res.ok) {
        setMatchResult(data);
        addToast(`Match score: ${data.matchScore}%`, 'success');
        navigate('/results');
      } else {
        addToast(data.error || 'Analysis failed', 'error');
      }
    } catch {
      addToast('Network error. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="analysis-page">

      {/* ── Split View ── */}
      <div className="analysis-split">

        {/* Left – JD */}
        <div className="card analysis-panel">
          <h3 className="panel-title">Job Description (JD)</h3>
          <textarea
            className="jd-textarea"
            placeholder="Paste job description here...&#10;&#10;e.g. We are looking for a Software Engineer with 2+ years of experience..."
            value={jdText}
            onChange={(e) => setJdText(e.target.value)}
          />
        </div>

        {/* Right – CV */}
        <div className="card analysis-panel">
          <h3 className="panel-title">Your CV</h3>
          <div
            className={`cv-dropzone ${filePreview ? 'has-file' : ''}`}
            onClick={() => fileRef.current.click()}
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
          >
            {filePreview ? (
              <>
                <div className="cv-file-icon">📄</div>
                <p className="cv-file-name">{filePreview}</p>
                <p className="cv-file-sub">Click to change file</p>
              </>
            ) : (
              <>
                <div className="cv-upload-icon">⬆</div>
                <p className="cv-upload-text">Click or drag &amp; drop</p>
                <p className="cv-upload-sub">PDF or DOCX · Max 10 MB</p>
              </>
            )}
          </div>
          <input ref={fileRef} type="file" accept=".pdf,.docx" style={{ display: 'none' }} onChange={handleFileChange} />

          {uploadedFilename && !filePreview && (
            <div className="cv-prev-notice">
              <span className="cv-prev-icon">✅</span>
              Using previously uploaded: <strong>{uploadedFilename}</strong>
            </div>
          )}

          {/* Preview area mimicking a resume card */}
          {filePreview && (
            <div className="cv-preview-box">
              <div className="cv-preview-lines">
                {[80, 60, 70, 50, 65, 40].map((w, i) => (
                  <div key={i} className="cv-preview-line" style={{ width: `${w}%` }} />
                ))}
              </div>
            </div>
          )}
        </div>

      </div>

      {/* ── Analyze Button ── */}
      <div className="analyze-bar">
        <button
          className="btn analyze-btn"
          onClick={handleAnalyze}
          disabled={loading}
        >
          {loading ? (
            <><span className="spinner" />Analyzing...</>
          ) : (
            'Analyze'
          )}
        </button>
      </div>

    </div>
  );
}
