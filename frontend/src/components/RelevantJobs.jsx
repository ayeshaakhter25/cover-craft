import React, { useEffect, useState } from 'react';
import './JobMatches.css';

export default function RelevantJobs({ apiBase, addToast }) {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
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
  useEffect(() => { load(); }, []);
  const updateState = async (jobId, state) => {
    const token = localStorage.getItem('token');
    const res = await fetch(`${apiBase}/api/jobs/${jobId}/history`, { method: 'PATCH', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ state }) });
    if (res.ok) setJobs(items => items.map(job => job._id === jobId ? { ...job, state } : job));
  };
  if (loading) return <div className="no-jobs"><h3>Relevant Jobs</h3><p>Loading your matched jobs…</p></div>;
  return <section className="job-matches">
    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', gap:'1rem' }}><h3>Relevant Jobs ({jobs.length})</h3><button className="btn btn-ghost" onClick={load}>Refresh</button></div>
    {!jobs.length ? <div className="no-jobs"><p>Jobs will appear here after the next scheduled fetch. Upload a CV with skills first.</p></div> : <div className="jobs-grid">{jobs.map(job => <article className="job-card" key={job._id}>
      <h4 className="job-title">{job.title}</h4><div className="job-meta"><span className="company">{job.company}</span><span className="location">{job.location}</span></div>
      <p className="job-snippet">{job.description?.slice(0, 180) || 'No description available'}</p>
      <p><strong>{job.matchScore}% match</strong> · {job.state}</p>
      <div className="tags">{(job.matchingSkills || []).map(skill => <span className="tag tag-green" key={skill}>{skill}</span>)}</div>
      <div style={{ display:'flex', gap:'.5rem', marginTop:'1rem' }}><a className="apply-button" style={{ textAlign:'center', textDecoration:'none' }} href={job.jobUrl} target="_blank" rel="noreferrer" onClick={() => updateState(job._id, 'VIEWED')}>View job</a><select value={job.state} onChange={event => updateState(job._id, event.target.value)} aria-label="Job status"><option>NEW</option><option>VIEWED</option><option>SAVED</option><option>APPLIED</option><option>REJECTED</option></select></div>
    </article>)}</div>}
  </section>;
}
