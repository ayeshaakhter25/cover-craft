import React from 'react';
import './SkillDisplay.css';

const SkillDisplay = ({ skills, className = '' }) => {
    if (!skills || skills.length === 0) {
        return (
            <div className={`skill-display ${className}`}>
                <p>No skills detected</p>
            </div>
        );
    }

    return (
        <div className={`skill-display ${className}`}>
            <h3>🎯 Detected Skills</h3>
            <div className="skills-grid">
                {skills.map((skill, index) => (
                    <span key={index} className="skill-badge">
                        {skill}
                    </span>
                ))}
            </div>
            <p className="skills-count">Total: {skills.length} skills</p>
        </div>
    );
};

export default SkillDisplay;

