import React, { useState } from "react";
import SkillDisplay from './components/SkillDisplay';

const apiBase = import.meta.env.VITE_API_URL || "http://localhost:5000";
console.log("Career Craft API base:", apiBase);

export default function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadMessage, setUploadMessage] = useState("");
  const [uploadedFilename, setUploadedFilename] = useState("");
  const [extractedText, setExtractedText] = useState("");
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(false);
  const [testResult, setTestResult] = useState("");

  const [jdText, setJdText] = useState("");
  const [jdMessage, setJdMessage] = useState("");
  const [jdFilename, setJdFilename] = useState("");
  const [jdLoading, setJdLoading] = useState(false);

  // Handle file selection
  function handleFileChange(e) {

    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!validTypes.includes(file.type)) {
        setUploadMessage("Error: Only PDF and DOCX files are allowed!");
        return;
      }
      // Validate file size (10MB max)
      if (file.size > 10 * 1024 * 1024) {
        setUploadMessage("Error: File size must be less than 10MB!");
        return;
      }
      setSelectedFile(file);
      setUploadMessage("");
      setUploadedFilename("");
      setExtractedText("");
    }
  }

  // Handle CV upload
  async function handleUpload(e) {
    e.preventDefault();
    setLoading(true);
    setUploadMessage("");

    if (!selectedFile) {
      setUploadMessage("Error: Please select a file first!");
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append('cv', selectedFile);

      const res = await fetch(`${apiBase}/api/upload-cv`, {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        setUploadMessage("✅ " + data.message);
        setUploadedFilename(data.filename);
        setExtractedText(data.extractedText || "No text extracted");
        setSkills(data.skills || []);
        setSelectedFile(null);
        // Reset file input
        document.getElementById('fileInput').value = '';
      } else {
        setUploadMessage("❌ " + (data.message || "Upload failed"));
      }
    } catch (err) {
      console.error("Upload error:", err);
      setUploadMessage("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  // Handle job description submit
  async function handleJobSubmit(e) {
    e.preventDefault();
    setJdLoading(true);
    setJdMessage("");

    if (!jdText.trim()) {
      setJdMessage("Error: Job description cannot be empty");
      setJdLoading(false);
      return;
    }

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
        setJdMessage("✅ " + data.message);
        setJdFilename(data.filename);
        setJdText("");
      } else {
        setJdMessage("❌ " + (data.message || "Failed to save job description"));
      }
    } catch (err) {
      console.error("Job submit error:", err);
      setJdMessage("Error: " + err.message);
    } finally {
      setJdLoading(false);
    }
  }

  // Test API connection
  async function testConnection() {

    try {
      const res = await fetch(`${apiBase}/api/test`);
      const data = await res.json();
      setTestResult("✅ API Connected: " + JSON.stringify(data));
    } catch (err) {
      console.error("Connection test error:", err);
      setTestResult("❌ Connection failed: " + err.message);
    }
  }

  // Test health endpoint
  async function testHealth() {
    try {
      const res = await fetch(`${apiBase}/health`);
      const data = await res.json();
      setTestResult("✅ Health OK: " + JSON.stringify(data));
    } catch (err) {
      setTestResult("❌ Health check failed: " + err.message);
    }
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>🎯 Career Craft</h1>
      <p style={styles.subtitle}>AI-Powered Career Application Co-Pilot</p>

      {/* Test Connection Section */}
      <div style={styles.section}>
        <h3>🔌 API Connection Test</h3>
        <div style={styles.buttonGroup}>
          <button onClick={testConnection} style={styles.buttonSecondary}>
            Test /api/test
          </button>
          <button onClick={testHealth} style={styles.buttonSecondary}>
            Test /health
          </button>
        </div>
        {testResult && <div style={styles.resultBox}>{testResult}</div>}
      </div>

      <hr style={styles.divider} />

      {/* CV Upload Section */}
      <div style={styles.section}>
        <h3>📄 CV Upload</h3>
        <form onSubmit={handleUpload}>
          <input
            type="file"
            id="fileInput"
            accept=".pdf,.docx"
            onChange={handleFileChange}
            style={styles.fileInput}
          />
          <div style={styles.buttonGroup}>
            <button type="submit" disabled={loading} style={styles.buttonPrimary}>
              {loading ? "Uploading..." : "Upload CV"}
            </button>
          </div>
        </form>

        {uploadMessage && (
          <div style={uploadMessage.includes("Error") ? styles.errorBox : styles.successBox}>
            {uploadMessage}
          </div>
        )}

        {uploadedFilename && (
          <div style={styles.successBox}>
            📁 Saved as: <strong>{uploadedFilename}</strong>
          </div>
        )}

{extractedText && (
          <div style={styles.extractedTextSection}>
            <h4 style={styles.extractedTextTitle}>📄 Extracted Resume Text:</h4>
            <div style={styles.extractedTextBox}>
              {extractedText}
            </div>
          </div>
        )}
        {skills.length > 0 && (
          <div style={{marginTop: '20px'}}>
            <SkillDisplay skills={skills} />
          </div>
        )}
      </div>

      {/* Job Description Section */}
      <div style={styles.section}>
        <h3>📋 Job Description</h3>
        <form onSubmit={handleJobSubmit}>
          <textarea
            value={jdText}
            onChange={(e) => setJdText(e.target.value)}
            placeholder="Paste the full job description here..."
            rows="6"
            style={styles.textarea}
            disabled={jdLoading}
          />
          <div style={styles.buttonGroup}>
            <button type="submit" disabled={jdLoading} style={styles.buttonPrimary}>
              {jdLoading ? "Saving..." : "Save Job Description"}
            </button>
          </div>
        </form>

        {jdMessage && (
          <div style={jdMessage.includes("Error") ? styles.errorBox : styles.successBox}>
            {jdMessage}
          </div>
        )}

        {jdFilename && (
          <div style={styles.successBox}>
            📁 Saved as: <strong>{jdFilename}</strong>
            <br />
            <a 
              href={`${apiBase}/job-descriptions/${jdFilename}`} 
              target="_blank" 
              rel="noopener noreferrer" 
              style={styles.fileLink}
            >
              🔗 View File
            </a>
          </div>
        )}
      </div>

      <hr style={styles.divider} />

      {/* Info Section */}
      <div style={styles.info}>
        <p><strong>Upload Requirements:</strong></p>
        <ul>
          <li>File types: PDF, DOCX</li>
          <li>Max file size: 10MB</li>
        </ul>
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "600px",
    margin: "0 auto",
    padding: "30px",
    fontFamily: "Arial, sans-serif",
    backgroundColor: "#f9f9f9",
    borderRadius: "10px",
    marginTop: "50px",
  },
  title: {
    textAlign: "center",
    color: "#333",
    marginBottom: "5px",
  },
  subtitle: {
    textAlign: "center",
    color: "#666",
    marginTop: "0",
  },
  section: {
    marginBottom: "20px",
  },
  buttonGroup: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
    marginTop: "10px",
  },
  buttonPrimary: {
    padding: "12px 24px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px",
  },
  buttonSecondary: {
    padding: "10px 20px",
    backgroundColor: "#6c757d",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "14px",
  },
  fileInput: {
    marginTop: "10px",
    padding: "10px",
    width: "100%",
    boxSizing: "border-box",
  },
  resultBox: {
    marginTop: "15px",
    padding: "10px",
    backgroundColor: "#e9ecef",
    borderRadius: "5px",
    fontFamily: "monospace",
    fontSize: "14px",
  },
  successBox: {
    marginTop: "15px",
    padding: "10px",
    backgroundColor: "#d4edda",
    color: "#155724",
    borderRadius: "5px",
    border: "1px solid #c3e6cb",
  },
  errorBox: {
    marginTop: "15px",
    padding: "10px",
    backgroundColor: "#f8d7da",
    color: "#721c24",
    borderRadius: "5px",
    border: "1px solid #f5c6cb",
  },
  divider: {
    margin: "20px 0",
    border: "none",
    borderTop: "1px solid #ddd",
  },
  info: {
    fontSize: "14px",
    color: "#666",
  },
  extractedTextSection: {
    marginTop: "20px",
  },
  extractedTextTitle: {
    color: "#333",
    marginBottom: "10px",
  },
  extractedTextBox: {
    backgroundColor: "#f0f0f0",
    padding: "15px",
    borderRadius: "5px",
    border: "1px solid #ddd",
    maxHeight: "400px",
    overflowY: "auto",
    whiteSpace: "pre-wrap",
    fontFamily: "'Courier New', monospace",
    fontSize: "12px",
    lineHeight: "1.5",
  },
  textarea: {
    width: "100%",
    padding: "12px",
    marginTop: "10px",
    border: "1px solid #ddd",
    borderRadius: "5px",
    fontSize: "14px",
    boxSizing: "border-box",
    resize: "vertical",
  },
  fileLink: {
    color: "#007bff",
    textDecoration: "none",
    marginTop: "5px",
    display: "inline-block",
    padding: "5px 10px",
    backgroundColor: "#e7f3ff",
    borderRadius: "3px",
  },
};



