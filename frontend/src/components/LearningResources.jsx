import React, { useEffect, useState } from 'react';
import './LearningResources.css';

const GROUPS = [
  ['Tutorial', 'Tutorials', '🎬'],
  ['Project', 'Projects', '🛠️'],
  ['Documentation', 'Documentation', '📚'],
  ['Course', 'Certifications / Courses', '🎓'],
];

const TYPE_ICON = { Tutorial: '🎬', Project: '🛠️', Documentation: '📚', Course: '🎓' };

export default function LearningResources({ apiBase, addToast }) {
  const [skills, setSkills] = useState([]);
  const [skill, setSkill] = useState(new URLSearchParams(window.location.search).get('skill') || '');
  const [resources, setResources] = useState([]);
  const [saved, setSaved] = useState([]);
  const [loading, setLoading] = useState(false);
  const headers = () => ({ Authorization: `Bearer ${localStorage.getItem('token')}` });

  useEffect(() => {
    (async () => {
      try {
        const [roadmapRes, savedRes] = await Promise.all([
          fetch(`${apiBase}/api/roadmaps`, { headers: headers() }),
          fetch(`${apiBase}/api/resources/saved`, { headers: headers() }),
        ]);
        const roadmapData = await roadmapRes.json();
        const savedData = await savedRes.json();
        const gaps = [...new Set((roadmapData.roadmaps || []).flatMap(roadmap => roadmap.skills.map(item => item.name)))];
        setSkills(gaps);
        setSaved(savedData.resources || []);
      } catch {
        addToast('Could not load learning resources', 'error');
      }
    })();
  }, []);

  useEffect(() => {
    if (!skill) return;
    (async () => {
      setLoading(true);
      try {
        const res = await fetch(`${apiBase}/api/resources/search?skill=${encodeURIComponent(skill)}`, { headers: headers() });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        setResources(data.resources || []);
      } catch (error) {
        addToast(error.message || 'Could not fetch resources', 'error');
      } finally {
        setLoading(false);
      }
    })();
  }, [skill]);

  const save = async resource => {
    const res = await fetch(`${apiBase}/api/resources/saved`, {
      method: 'POST',
      headers: { ...headers(), 'Content-Type': 'application/json' },
      body: JSON.stringify(resource),
    });
    const data = await res.json();
    if (res.ok) {
      setSaved(items => [data.resource, ...items.filter(item => item.url !== data.resource.url)]);
      addToast('Resource saved', 'success');
    } else addToast(data.error || 'Could not save resource', 'error');
  };

  const remove = async id => {
    const res = await fetch(`${apiBase}/api/resources/saved/${id}`, { method: 'DELETE', headers: headers() });
    if (res.ok) setSaved(items => items.filter(item => item._id !== id));
  };

  const savedUrls = new Set(saved.map(item => item.url));

  return (
    <section className="resources-page">
      <div className="resources-head">
        <div>
          <h2><span className="res-head-icon">📖</span>Learning Resources</h2>
          <p>Curated learning links for the skill gaps in your roadmap.</p>
        </div>
        <label>
          Skill
          <select value={skill} onChange={event => setSkill(event.target.value)}>
            <option value="">Select a roadmap skill</option>
            {skills.map(item => <option key={item}>{item}</option>)}
          </select>
        </label>
      </div>

      {!skills.length && (
        <div className="resources-empty">Generate a Career Roadmap first, then its missing skills will appear here.</div>
      )}
      {loading && <div className="resources-empty">Finding the best {skill} resources...</div>}

      {!loading && skill && GROUPS.map(([type, label, icon]) => {
        const items = resources.filter(resource => resource.type === type);
        return (
          <section className="resource-section" key={type}>
            <h3><span className="res-section-icon">{icon}</span>{label}</h3>
            {items.length ? (
              <div className="resource-grid">
                {items.map(resource => (
                  <article className="resource-card" key={resource.url}>
                    <div className="resource-meta">
                      <span className="resource-source">{resource.source}</span>
                      <strong>{resource.relevanceScore}% relevant</strong>
                    </div>
                    <h4>{resource.title}</h4>
                    <p>{resource.description || 'Learning resource for this skill.'}</p>
                    <div className="resource-footer">
                      <span className="resource-difficulty">{resource.difficulty}</span>
                      <a className="resource-open" href={resource.url} target="_blank" rel="noreferrer">Open →</a>
                      {savedUrls.has(resource.url)
                        ? <span className="saved-label">✓ Saved</span>
                        : <button onClick={() => save(resource)}>Save</button>}
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <p className="resource-none">No {type.toLowerCase()} resources available right now.</p>
            )}
          </section>
        );
      })}

      <section className="saved-section">
        <h3><span className="res-section-icon">⭐</span>My Learning Resources</h3>
        {!saved.length ? (
          <p className="resource-none">Save useful resources to build your personal learning library.</p>
        ) : (
          <div className="saved-list">
            {saved.map(resource => (
              <div className="saved-resource" key={resource._id}>
                <span className="saved-icon">{TYPE_ICON[resource.type] || '🔗'}</span>
                <div className="saved-info">
                  <b>{resource.title}</b>
                  <span>{resource.skill} · {resource.type} · {resource.source}</span>
                </div>
                <a className="resource-open" href={resource.url} target="_blank" rel="noreferrer">Open →</a>
                <button className="remove-btn" onClick={() => remove(resource._id)}>Remove</button>
              </div>
            ))}
          </div>
        )}
      </section>
    </section>
  );
}
