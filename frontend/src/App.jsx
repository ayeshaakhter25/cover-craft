import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import './App.css';
import Header         from './components/Header';
import Login          from './components/Login';
import Toast          from './components/Toast';
import Landing        from './components/Landing';
import DashboardOverview from './components/DashboardOverview';
import Analysis       from './components/Analysis';
import Results        from './components/Results';
import CoverLetter    from './components/CoverLetter';
import CVHealthCheck  from './components/CVHealthCheck';
import Tests          from './components/Tests';
import RelevantJobs   from './components/RelevantJobs';

const apiBase = import.meta.env.VITE_API_URL || "http://localhost:5000";

/* ─── Layout wrapper used by every authenticated page ─── */
function AppLayout({ user, onLogout, toasts, removeToast, children }) {
  return (
    <>
      <Header user={user} onLogout={onLogout} />
      <main style={{ flex: 1, background: 'var(--page-bg)', padding: '2rem' }}>
        {children}
      </main>
      {toasts.map(t => (
        <Toast key={t.id} message={t.message} type={t.type} onClose={() => removeToast(t.id)} />
      ))}
    </>
  );
}

/* ─── Main app ─── */
export default function App() {

  /* Toast */
  const [toasts, setToasts]   = useState([]);
  const addToast = (message, type = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 5000);
  };
  const removeToast = (id) => setToasts(prev => prev.filter(t => t.id !== id));

  /* Auth */
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser]                        = useState(null);

  /* State shared across screens */
  const [uploadedFilename, setUploadedFilename] = useState('');
  const [extractedText,    setExtractedText]    = useState('');
  const [skills,           setSkills]           = useState([]);
  const [jdFilename,       setJdFilename]       = useState('');
  const [matchResult,      setMatchResult]      = useState(null);
  const [matchingJobs,     setMatchingJobs]     = useState([]);

  /* Dashboard data */
  const [dashboardStats,  setDashboardStats]  = useState(null);
  const [recentMatches,   setRecentMatches]   = useState([]);
  const [dashboardLoading, setDashboardLoading] = useState(false);

  /* CV Health */
  const [cvHealthResult, setCvHealthResult] = useState(null);
  const [cvHealthLoading, setCvHealthLoading] = useState(false);

  /* Restore session */
  useEffect(() => {
    const token     = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    if (token && savedUser) {
      setIsAuthenticated(true);
      setUser(JSON.parse(savedUser));
    }
  }, []);

  /* Fetch dashboard data (graceful — never crashes the view) */
  useEffect(() => {
    if (!isAuthenticated) return;
    const load = async () => {
      setDashboardLoading(true);
      try {
        const token   = localStorage.getItem('token');
        const headers = { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };
        const [sRes, mRes] = await Promise.all([
          fetch(`${apiBase}/api/users/stats`,         { headers }),
          fetch(`${apiBase}/api/users/recent-matches`, { headers })
        ]);
        if (sRes.ok)  setDashboardStats(await sRes.json());
        if (mRes.ok)  setRecentMatches(await mRes.json());
      } catch {
        /* silently fail — fallback values shown */
      } finally {
        setDashboardLoading(false);
      }
    };
    load();
  }, [isAuthenticated]);

  const handleLogin = (data) => {
    localStorage.setItem('token', data.token);
    localStorage.setItem('user',  JSON.stringify(data.user));
    setIsAuthenticated(true);
    setUser(data.user);
    addToast(`Welcome back, ${data.user.name}!`, 'success');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
    setDashboardStats(null);
    setRecentMatches([]);
    setUploadedFilename(''); setExtractedText(''); setSkills([]);
    setJdFilename(''); setMatchResult(null);
    addToast('Logged out', 'info');
  };

  /* ── Unauthenticated routes ── */
  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/"      element={<Landing />} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="*"      element={<Landing />} />
      </Routes>
    );
  }

  /* ── Authenticated routes ── */
  const wrap = (el) => (
    <AppLayout user={user} onLogout={handleLogout} toasts={toasts} removeToast={removeToast}>
      {el}
    </AppLayout>
  );

  return (
    <Routes>

      {/* Dashboard */}
      <Route path="/" element={wrap(
        dashboardLoading
          ? <div style={{ textAlign:'center', padding:'4rem', color:'var(--text-muted)' }}>
              <span className="spinner spinner-dark" style={{ width:32,height:32,borderWidth:3 }} />
              <p>Loading dashboard…</p>
            </div>
          : <DashboardOverview
              apiBase={apiBase}
              stats={dashboardStats || {
                userName:       user?.name || 'User',
                cvUploads:      0,
                avgMatchScore:  0,
                coversGenerated: 0
              }}
              recentMatches={recentMatches}
            />
      )} />

      {/* Analysis */}
      <Route path="/analysis" element={wrap(
        <Analysis
          apiBase={apiBase}
          uploadedFilename={uploadedFilename}
          setUploadedFilename={setUploadedFilename}
          setExtractedText={setExtractedText}
          setSkills={setSkills}
          setJdFilename={setJdFilename}
          setMatchResult={setMatchResult}
          setMatchingJobs={setMatchingJobs}
          addToast={addToast}
        />
      )} />

      {/* Results */}
      <Route path="/results" element={wrap(
        <Results
          apiBase={apiBase}
          matchResult={matchResult}
          skills={skills}
          extractedText={extractedText}
          matchingJobs={matchingJobs}
          uploadedFilename={uploadedFilename}
        />
      )} />

      {/* Cover Letter */}
      <Route path="/cover" element={wrap(
        <CoverLetter
          apiBase={apiBase}
          uploadedFilename={uploadedFilename}
          jdFilename={jdFilename}
          addToast={addToast}
        />
      )} />

      <Route path="/jobs" element={wrap(<RelevantJobs apiBase={apiBase} addToast={addToast} />)} />

      {/* CV Health */}
      <Route path="/cv-health" element={wrap(
        <CVHealthCheck
          uploadedFilename={uploadedFilename}
          onHealthCheck={async (filename) => {
            setCvHealthLoading(true);
            try {
              const token = localStorage.getItem('token');
              const res   = await fetch(`${apiBase}/api/cv-health/health-check`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({ resumeFile: filename })
              });
              const data = await res.json();
              if (res.ok) { setCvHealthResult(data); addToast('CV Health Check done!', 'success'); }
              else          addToast(data.error || 'Health check failed', 'error');
            } catch { addToast('Network error', 'error'); }
            finally    { setCvHealthLoading(false); }
          }}
          loading={cvHealthLoading}
          result={cvHealthResult}
        />
      )} />

      {/* Tests */}
      <Route path="/tests" element={wrap(<Tests uploadedFilename={uploadedFilename} />)} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

