import React from 'react';
import './JobMatches.css';

const JobMatches = ({ jobs = [] }) => {
    const handleApply = (link) => {
        window.open(link, '_blank', 'noopener,noreferrer');
    };

    if (!jobs || jobs.length === 0) {
        return (
            <div className="no-jobs">
                <h3>Matching Jobs</h3>
                <p className="no-jobs-message">
                    No jobs found. Add your <strong>SERPAPI_KEY</strong> to <code>backend/.env</code> to enable Google Jobs search.
                    <br/>Get free key at <a href="https://serpapi.com/users/sign_up" target="_blank" rel="noopener noreferrer">serpapi.com</a>
                </p>
            </div>
        );
    }

    return (
        <div className="job-matches">
            <h3>Matching Jobs ({jobs.length})</h3>
            <div className="jobs-grid">
                {jobs.map((job, index) => (
                    <div key={index} className="job-card">
                        <h4 className="job-title">{job.title}</h4>
                        <div className="job-meta">
                            <span className="company">{job.company}</span>
                            <span className="location">{job.location}</span>
                        </div>
                        <p className="job-snippet">{job.snippet}</p>
                        <button 
                            className="apply-button"
                            onClick={() => handleApply(job.link)}
                        >
                            Apply Now
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default JobMatches;

