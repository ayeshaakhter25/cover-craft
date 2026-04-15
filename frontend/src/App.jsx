import React, { useState, useEffect } from "react";
import './App.css';
import Header from './components/Header';
import SkillDisplay from './components/SkillDisplay';
import Login from './components/Login';
import Toast from './components/Toast';

const apiBase = import.meta.env.VITE_API_URL || "http://localhost:5000";
console.log("Career Craft API base:", apiBase);

export default function App() {
  // Toast state
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'info') => {
    const id = Date.now();
    const toast = { id, message, type };
    setToasts(prev => [...prev, toast]);

    // Auto remove after 5s
    setTimeout(() => {
      removeToast(id);
    }, 5000);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const [selectedFile, setSelectedFile] = useState(null);
  const [extractedText, setExtractedText] = useState("");
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(false);
  const [testResult, setTestResult] = useState("");

  const [jdText, setJdText] = useState("");
  const [jdFilename, setJdFilename] = useState("");
  const [jdLoading, setJdLoading] = useState(false);

  // Match calculation state
  const [matchLoading, setMatchLoading] = useState(false);
  const [matchResult, setMatchResult] = useState(null);
  const [uploadedFilename, setUploadedFilename] = useState("");

  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    if (token && savedUser) {
      setIsAuthenticated(true);
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogin = (data) => {
    setIsAuthenticated(true);
    setUser(data.user);
    addToast('Welcome back!', 'success');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
    // Reset state
    setSelectedFile(null);
    setExtractedText("");
    setSkills([]);
    setJdText("");
    setJdFilename("");
    setMatchResult(null);
    setUploadedFilename("");
    setTestResult("");
    addToast('Logged out successfully', 'info');
  };

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!validTypes.includes(file.type)) {
        addToast("Only PDF and DOCX files are allowed!", 'error');
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        addToast("File size must be less than 10MB!", 'error');
        return;
      }
      setSelectedFile(file);
    }
  };

  // Handle CV upload
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      addToast("Please select a file first!", 'warning');
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('cv', selectedFile);

      const res = await fetch(`${apiBase}/api/upload-cv`, {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        setUploadedFilename(data.filename);
        setExtractedText(data.extractedText || "No text extracted");
        setSkills(data.skills || []);
        setSelectedFile(null);
        document.getElementById('fileInput').value = '';
        addToast('CV uploaded successfully!', 'success');
      } else {
        addToast(data.message || "Upload failed", 'error');
      }
    } catch (err) {
      addToast("Network error. Please try again.", 'error');
    } finally {
      setLoading(false);
    }
  };

  // Handle job description submit
  const handleJobSubmit = async (e) => {
    e.preventDefault();
    if (!jdText.trim()) {
      addToast("Job description cannot be empty", 'warning');
      return;
    }

    setJdLoading(true);

    try {
      const res = await fetch(`${apiBase}/api/job-description`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ jobDescription: jdText.trim() }),
      });

      const data = await res.json();

      if (res.ok) {
        setJdFilename(data.filename);
        setJdText("");
        addToast('Job description saved!', 'success');
      } else {
        addToast(data.message || "Failed to save", 'error');
      }
    } catch (err) {
      addToast("Network error. Please try again.", 'error');
    } finally {
      setJdLoading(false);
    }
  };

  // Test API connection
  const testConnection = async () => {
    try {
      const res = await fetch(`${apiBase}/api/test`);
      const data = await res.json();
      setTestResult("✅ API Connected: " + JSON.stringify(data));
      addToast('API test successful!', 'success');
    } catch (err) {
      setTestResult("❌ Connection failed");
      addToast("API connection failed", 'error');
    }
  };

  // Test health endpoint
  const testHealth = async () => {
    try {
      const res = await fetch(`${apiBase}/health`);
      const data = await res.json();
      setTestResult("✅ Health OK: " + JSON.stringify(data));
      addToast('Health check passed!', 'success');
    } catch (err) {
      setTestResult("❌ Health check failed");
      addToast("Health check failed", 'error');
    }
  };

  // Calculate match score
  const handleCalculateMatch = async () => {
    if (!uploadedFilename || !jdFilename) {
      addToast("Upload CV and save job description first!", 'warning');
      return;
    }

    setMatchLoading(true);

    try {
      const res = await fetch(`${apiBase}/api/match-score`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          resumeFile: uploadedFilename,
          jobFile: jdFilename
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setMatchResult(data);
        addToast(`Match score calculated: ${data.matchScore}%`, 'success');
      } else {
        addToast(data.error || data.message || "Calculation failed", 'error');
      }
    } catch (err) {
      addToast("Calculation failed. Please try again.", 'error');
    } finally {
      setMatchLoading(false);
    }
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="dashboard">
      <Header user={user} onLogout={handleLogout} />
      
      <div className="dashboard-layout">
        {/* Sidebar */}
        <aside className="dashboard-sidebar">
          <nav className="sidebar-nav">
            <button className="sidebar-item active" aria-label="CV Upload">
              📄 CV Upload
            </button>
            <button className="sidebar-item" aria-label="Job Description">
              📋 Job Description
            </button>
            <button className="sidebar-item" aria-label="Match Analysis">
              📊 Match Analysis
            </button>
            <button className="sidebar-item" aria-label="API Test">
              🔌 API Test
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="dashboard-main">
          {/* API Test Section */}
          <section className="card">
            <h2 className="card-title">🔌 API Connection Test</h2>
            <div className="card-content">
              <div className="button-group">
                <button onClick={testConnection} className="btn btn-secondary" type="button">
                  Test /api/test
                </button>
                <button onClick={testHealth} className="btn btn-secondary" type="button">
                  Test /health
                </button>
              </div>
              {testResult && (
                <div className="alert alert-info">
                  {testResult}
                </div>
              )}
            </div>
          </section>

          {/* CV Upload Section */}
          <section className="card">
            <h2 className="card-title">📄 CV Upload</h2>
            <form onSubmit={handleUpload} className="card-content">
              <div className="form-group">
                <label htmlFor="fileInput" className="form-label">
                  Choose your resume (PDF/DOCX, max 10MB)
                </label>
                <input
                  type="file"
                  id="fileInput"
                  accept=".pdf,.docx"
                  onChange={handleFileChange}
                  className="form-input"
                  disabled={loading}
                  aria-describedby="file-help"
                />
                <small id="file-help" className="form-help">
                  Only PDF and DOCX files are supported, max 10MB
                </small>
              </div>
              <div className="button-group">
                <button type="submit" disabled={loading} className="btn btn-primary">
                  {loading ? (
                    <>
                      <span className="spinner" aria-hidden="true" />
                      Uploading...
                    </>
                  ) : (
                    "Upload CV"
                  )}
                </button>
              </div>
            </form>

            {uploadedFilename && (
              <div className="card">
                <h3 className="card-subtitle">📁 Uploaded File</h3>
                <div className="alert alert-success">
                  Saved as: <strong>{uploadedFilename}</strong>
                </div>
              </div>
            )}

            {extractedText && (
              <div className="card">
                <h3 className="card-subtitle">📄 Extracted Resume Text</h3>
                <div className="text-content">
                  {extractedText}
                </div>
              </div>
            )}

            {skills.length > 0 && (
              <SkillDisplay skills={skills} />
            )}
          </section>

          {/* Job Description Section */}
          <section className="card">
            <h2 className="card-title">📋 Job Description</h2>
            <form onSubmit={handleJobSubmit} className="card-content">
              <div className="form-group">
                <label htmlFor="jdText" className="form-label">
                  Paste the job description
                </label>
                <textarea
                  id="jdText"
                  value={jdText}
                  onChange={(e) => setJdText(e.target.value)}
                  placeholder="Paste the full job description here..."
                  className="form-textarea"
                  rows="8"
                  disabled={jdLoading}
                />
              </div>
              <div className="button-group">
                <button type="submit" disabled={jdLoading} className="btn btn-primary">
                  {jdLoading ? (
                    <>
                      <span className="spinner" aria-hidden="true" />
                      Saving...
                    </>
                  ) : (
                    "Save Job Description"
                  )}
                </button>
              </div>
            </form>

            {jdFilename && (
              <div className="card">
                <h3 className="card-subtitle">📁 Saved Job Description</h3>
                <div className="alert alert-success">
                  Saved as: <strong>{jdFilename}</strong>
                  <br />
                  <a 
                    href={`${apiBase}/job-descriptions/${jdFilename}`} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="btn btn-secondary"
                  >
                    🔗 View File
                  </a>
                </div>
              </div>
            )}

            {/* Calculate Match Section */}
            <div className="button-group">
              <button 
                onClick={handleCalculateMatch} 
                disabled={matchLoading || !uploadedFilename || !jdFilename}
                className="btn btn-success"
                type="button"
              >
                {matchLoading ? (
                  <>
                    <span className="spinner" aria-hidden="true" />
                    Calculating...
                  </>
                ) : (
                  "🚀 Calculate Match Score"
                )}
              </button>
            </div>
          </section>

          {/* Match Results Section */}
          {matchResult && (
            <section className="card">
              <h2 className="card-title">📊 Match Analysis Results</h2>
              <div className="match-score-container">
                <div className="score-circle large">
                  <div className="score-ring" style={{ '--score': `${matchResult.matchScore}%` }}>
                    <div className="score-inner">
                      <div className="score-value">{matchResult.matchScore}%</div>
                      <div className="score-label">
                        {matchResult.matchScore >= 80 ? '🎉 Excellent fit!' : 
                         matchResult.matchScore >= 60 ? '👍 Good fit!' : 
                         matchResult.matchScore >= 40 ? '⚠️ Fair fit' : '💪 Needs improvement'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="match-skills-grid">
                {matchResult.matchingSkills && matchResult.matchingSkills.length > 0 && (
                  <div className="skills-section">
                    <SkillDisplay skills={matchResult.matchingSkills} type="matching" />
                  </div>
                )}
                {matchResult.missingSkills && matchResult.missingSkills.length > 0 && (
                  <div className="skills-section">
                    <SkillDisplay skills={matchResult.missingSkills} type="missing" />
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Info Section */}
          <section className="card info-card">
            <h3 className="card-subtitle">ℹ️ Upload Requirements</h3>
            <ul className="requirements-list">
              <li>✅ File types: PDF, DOCX</li>
              <li>✅ Max file size: 10MB</li>
            </ul>
          </section>
        </main>
      </div>

      {/* Toast Notifications */}
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
}

