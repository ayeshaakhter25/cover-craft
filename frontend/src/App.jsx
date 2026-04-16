import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import './App.css';
import Header from './components/Header';
import Login from './components/Login';
import Toast from './components/Toast';
import DashboardOverview from './components/DashboardOverview';
import CoverLetter from './components/CoverLetter';
import Tests from './components/Tests';

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

  const DashboardLayout = ({ children, user, onLogout }) => (
    <>
      <Header user={user} onLogout={onLogout} />
      <main className="dashboard-main">
        {children}
      </main>
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </>
  );

  // Skip auth for demo - always show dashboard
  // if (!isAuthenticated) {
  //   return <Login onLogin={handleLogin} />;
  // }
  const fakeUser = { name: 'Demo User' };
  const handleFakeLogin = () => {
    setIsAuthenticated(true);
    setUser(fakeUser);
  };
  if (!isAuthenticated) {
    return (
      <div>
        <Login onLogin={handleFakeLogin} />
        <div style={{textAlign: 'center', marginTop: '2rem', padding: '1rem', background: '#f0f0f0'}}>
          <p>💡 Demo mode: Click "Skip Demo" button or use test credentials:</p>
          <p><strong>Email:</strong> test@example.com | <strong>Pass:</strong> password123</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={
        <DashboardLayout user={user} onLogout={handleLogout}>
          <DashboardOverview 
            stats={{ 
              userName: user?.name || 'User',
              cvUploads: 12, 
              jobsSaved: 8, 
              avgMatchScore: 78, 
              coversGenerated: 5 
            }}
            recentMatches={[
              { score: 89, jobTitle: 'Senior Frontend Developer' },
              { score: 76, jobTitle: 'Fullstack Engineer' },
            ]}
          />
        </DashboardLayout>
      } />
      <Route path="/cover" element={
        <DashboardLayout user={user} onLogout={handleLogout}>
          <CoverLetter 
            uploadedFilename={uploadedFilename}
            jdFilename={jdFilename}
            loading={false}
            generatedCover=""
          />
        </DashboardLayout>
      } />
      <Route path="/tests" element={
        <DashboardLayout user={user} onLogout={handleLogout}>
          <Tests 
            uploadedFilename={uploadedFilename}
          />
        </DashboardLayout>
      } />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

