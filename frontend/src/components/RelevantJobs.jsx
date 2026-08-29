import React, { useEffect, useState } from 'react';
import './JobMatches.css';

export default function RelevantJobs({ apiBase, addToast }) {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [preferences, setPreferences] = useState({ emailEnabled: true, minimumMatchScore: 80 });
  const load = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${apiBase}/api/jobs/relevant`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setJobs(data.jobs || []);
    } catch (error) { addToast(error.message || 'Could not load jobs', 'error'); }
    finally { setLoading(false); }
  };
  useEffect(() => {
    load();
    const token = localStorage.getItem('token');
    fetch(`${apiBase}/api/users/notification-preferences`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.ok ? res.json() : null)
      .then(data => data?.notificationPreferences && setPreferences(data.notificationPreferences))
      .catch(() => {});
  }, []);
  const savePreferences = async () => {
    const token = localStorage.getItem('token');
    const res = await fetch(`${apiBase}/api/users/notification-preferences`, { method: 'PUT', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ ...preferences, minimumMatchScore: Number(preferences.minimumMatchScore) }) });
    if (res.ok) addToast('Email alert settings saved', 'success');
    else addToast('Could not save email alert settings', 'error');
  };
  const updateState = async (jobId, state) => {
    const token = localStorage.getItem('token');
    const res = await fetch(`${apiBase}/api/jobs/${jobId}/history`, { method: 'PATCH', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ state }) });
    if (res.ok) setJobs(items => items.map(job => job._id === jobId ? { ...job, state } : job));
  };
  if (loading) return <div className="no-jobs"><h3>Relevant Jobs</h3><p>Loading your matched jobs…</p></div>;
  return <section className="job-matches">
    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', gap:'1rem' }}><h3>Relevant Jobs ({jobs.length})</h3><button className="btn btn-ghost" onClick={load}>Refresh</button></div>
    <div className="job-card" style={{ marginBottom:'1.5rem' }}>
      <h4 className="job-title">Email Job Alerts</h4>
      <label style={{ display:'block', margin:'1rem 0' }}><input type="checkbox" checked={preferences.emailEnabled} onChange={event => setPreferences({ ...preferences, emailEnabled: event.target.checked })} /> Send me email alerts for new high-match jobs</label>
      <label>Minimum match score&nbsp; <input type="number" min="0" max="100" value={preferences.minimumMatchScore} onChange={event => setPreferences({ ...preferences, minimumMatchScore: event.target.value })} style={{ width:'70px' }} />%</label>
      <button className="btn btn-primary" style={{ marginLeft:'1rem' }} onClick={savePreferences}>Save settings</button>
    </div>
    {!jobs.length ? <div className="no-jobs"><p>Jobs will appear here after the next scheduled fetch. Upload a CV with skills first.</p></div> : <div className="jobs-grid">{jobs.map(job => <article className="job-card" key={job._id}>
      <h4 className="job-title">{job.title}</h4><div className="job-meta"><span className="company">{job.company}</span><span className="location">{job.location}</span></div>
      <p className="job-snippet">{job.description?.slice(0, 180) || 'No description available'}</p>
      <p><strong>{job.matchScore}% match</strong> · {job.state}</p>
      <div className="tags">{(job.matchingSkills || []).map(skill => <span className="tag tag-green" key={skill}>{skill}</span>)}</div>
      <div style={{ display:'flex', gap:'.5rem', marginTop:'1rem' }}><a className="apply-button" style={{ textAlign:'center', textDecoration:'none' }} href={job.jobUrl} target="_blank" rel="noreferrer" onClick={() => updateState(job._id, 'VIEWED')}>View job</a><select value={job.state} onChange={event => updateState(job._id, event.target.value)} aria-label="Job status"><option>NEW</option><option>VIEWED</option><option>SAVED</option><option>APPLIED</option><option>REJECTED</option></select></div>
    </article>)}</div>}
  </section>;
}
