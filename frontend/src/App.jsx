import React, { useState } from "react";

const apiBase = import.meta.env.VITE_API_URL || "http://localhost:5000";
console.log("CoverCraft API base:", apiBase);

export default function App() {
  const [resume, setResume] = useState("");
  const [job, setJob] = useState("");
  const [loading, setLoading] = useState(false);
  const [cover, setCover] = useState("");

  async function handleGenerate(e) {
    e.preventDefault();
    setLoading(true);
    setCover("");

    if (!resume.trim() || !job.trim()) {
      setCover("Error: Please provide both resume and job description.");
      setLoading(false);
      return;
    }

    try {
      // health check to provide clearer failure reason
      const health = await fetch(`${apiBase}/health`, { method: "GET", mode: "cors" });
      if (!health.ok) throw new Error("Backend health check failed");

      const res = await fetch(`${apiBase}/generate`, {
        method: "POST",
        mode: "cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resume, job }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Server error");
      setCover(data.cover_letter);
    } catch (err) {
      console.error("Generate error:", err);
      if (err instanceof TypeError && err.message === "Failed to fetch") {
        setCover("Error: Failed to fetch — backend may be down, wrong URL, or CORS blocked. Check backend, README troubleshooting, and browser console.");
      } else {
        setCover("Error: " + (err.message || err));
      }
    } finally {
      setLoading(false);
    }
  }

  async function testConnection() {
    try {
      const res = await fetch(`${apiBase}/debug-origin`, { method: "GET", mode: "cors" });
      const data = await res.json();
      setCover("Connection OK. debug-origin: " + JSON.stringify(data));
    } catch (err) {
      console.error("Connection test error:", err);
      setCover("Connection test failed: " + err.message);
    }
  }

  return (
    <div style={{ padding: 20, fontFamily: "Arial, sans-serif" }}>
      <h1>CoverCraft</h1>
      <form onSubmit={handleGenerate}>
        <div>
          <label>Resume</label><br />
          <textarea value={resume} onChange={(e)=>setResume(e.target.value)} rows={8} cols={80} />
        </div>
        <div>
          <label>Job Description</label><br />
          <textarea value={job} onChange={(e)=>setJob(e.target.value)} rows={6} cols={80} />
        </div>
        <div style={{ marginTop: 8 }}>
          <button type="submit" disabled={loading}>{loading ? "Generating..." : "Generate Cover Letter"}</button>
          <button type="button" onClick={testConnection} style={{ marginLeft: 8 }}>Test Connection</button>
        </div>
      </form>
      <hr />
      <h2>Result</h2>
      <pre style={{ whiteSpace: "pre-wrap" }}>{cover}</pre>
    </div>
  );
}
