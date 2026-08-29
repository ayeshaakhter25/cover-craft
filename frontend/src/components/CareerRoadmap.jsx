import React, { useEffect, useState } from 'react';
import './CareerRoadmap.css';

export default function CareerRoadmap({ apiBase, addToast }) {
  const [jobs, setJobs] = useState([]); const [roadmaps, setRoadmaps] = useState([]); const [jobId, setJobId] = useState(''); const [loading, setLoading] = useState(true); const [creating, setCreating] = useState(false);
  const headers = () => ({ Authorization: `Bearer ${localStorage.getItem('token')}` });
  const load = async () => {
    setLoading(true);
    try {
      const [jobsRes, roadmapsRes] = await Promise.all([fetch(`${apiBase}/api/jobs/relevant`, { headers: headers() }), fetch(`${apiBase}/api/roadmaps`, { headers: headers() })]);
      const jobsData = await jobsRes.json(); const roadmapsData = await roadmapsRes.json();
      setJobs(jobsData.jobs || []); setRoadmaps(roadmapsData.roadmaps || []);
      if (!jobId && jobsData.jobs?.length) setJobId(jobsData.jobs[0]._id);
    } catch { addToast('Could not load roadmap data', 'error'); } finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);
  const generate = async () => {
    if (!jobId) return addToast('Choose a matched job first', 'warning');
    setCreating(true);
    try {
      const res = await fetch(`${apiBase}/api/roadmaps/generate`, { method: 'POST', headers: { ...headers(), 'Content-Type': 'application/json' }, body: JSON.stringify({ jobId }) });
      const data = await res.json(); if (!res.ok) throw new Error(data.error);
      setRoadmaps(items => [data.roadmap, ...items.filter(item => item._id !== data.roadmap._id)]); addToast('Your learning roadmap is ready', 'success');
    } catch (error) { addToast(error.message || 'Could not generate roadmap', 'error'); } finally { setCreating(false); }
  };
  const setStatus = async (roadmap, skill, status) => {
    const res = await fetch(`${apiBase}/api/roadmaps/${roadmap._id}/skills/${encodeURIComponent(skill.name)}`, { method: 'PATCH', headers: { ...headers(), 'Content-Type': 'application/json' }, body: JSON.stringify({ status }) });
    const data = await res.json(); if (res.ok) setRoadmaps(items => items.map(item => item._id === roadmap._id ? data.roadmap : item)); else addToast(data.error || 'Could not update progress', 'error');
  };
  if (loading) return <div className="roadmap-empty">Loading your career roadmap…</div>;
  return <section className="roadmap-page"><div className="roadmap-hero"><div><h2>My Career Roadmap</h2><p>Turn your job-skill gaps into a practical weekly plan.</p></div><button className="btn btn-ghost" onClick={load}>Refresh</button></div>
    <div className="roadmap-builder"><label>Target job<select value={jobId} onChange={e => setJobId(e.target.value)}><option value="">Select a matched job</option>{jobs.map(job => <option key={job._id} value={job._id}>{job.title} — {job.company} ({job.matchScore}%)</option>)}</select></label><button className="btn btn-primary" disabled={creating || !jobId} onClick={generate}>{creating ? 'Generating…' : 'Generate Roadmap'}</button></div>
    {!roadmaps.length && <div className="roadmap-empty">Select a matched job and generate your first personalized roadmap.</div>}
    {roadmaps.map(roadmap => { const done = roadmap.skills.filter(skill => skill.status === 'COMPLETED').length; const progress = roadmap.skills.length ? Math.round(done / roadmap.skills.length * 100) : 0; return <article className="roadmap-card" key={roadmap._id}><div className="roadmap-card-head"><div><h3>{roadmap.targetRole}</h3><p>Progress: <strong>{progress}%</strong> · {done}/{roadmap.skills.length} skills completed</p></div><div className="roadmap-progress"><span style={{ width: `${progress}%` }} /></div></div><div className="roadmap-grid">{roadmap.skills.map((skill, index) => <div className="roadmap-skill" key={skill.name}><div className="week-label">Week {index + 1}</div><h4>{skill.name}</h4><p><b>{skill.priority}</b> priority · {skill.difficulty} · ~{skill.estimatedHours} hours</p><p className="roadmap-reason">{skill.reason}</p><ul>{skill.topics.map(topic => <li key={topic}>{topic}</li>)}</ul><select value={skill.status} onChange={e => setStatus(roadmap, skill, e.target.value)}><option value="NOT_STARTED">○ Not started</option><option value="IN_PROGRESS">◉ In progress</option><option value="COMPLETED">✓ Completed</option></select></div>)}</div></article>; })}</section>;
}
