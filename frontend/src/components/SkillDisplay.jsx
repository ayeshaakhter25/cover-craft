import React from 'react';
import './SkillDisplay.css';

const SkillDisplay = ({ skills, type = 'default', className = '' }) => {
  if (!skills || skills.length === 0) {
    return (
      <div className={`skill-display ${className}`}>
        <div className="no-skills">
          <span className="no-skills-icon">🎯</span>
          <p>No {type === 'matching' ? 'matching' : type === 'missing' ? 'missing' : ''} skills found</p>
        </div>
      </div>
    );
  }

  const getTitle = () => {
    switch(type) {
      case 'matching': return '✅ Matching Skills';
      case 'missing': return '❌ Missing Skills';
      case 'resume': return '📄 Resume Skills';
      default: return '🎯 Detected Skills';
    };
  };

  const getBadgeClass = (index) => {
    switch(type) {
      case 'matching': return 'skill-badge matching';
      case 'missing': return 'skill-badge missing';
      default: return 'skill-badge default';
    };
  };

  const getProgress = (skill, index) => {
    // Mock proficiency based on type and index for demo
    switch(type) {
      case 'matching': return 90 + (index % 3) * 5;
      case 'missing': return 20 + (index % 4) * 10;
      default: return 70 + (index % 5) * 6;
    }
  };

  return (
    <div className={`skill-display ${className}`}>
      <div className="skill-header">
        <h3>{getTitle()}</h3>
        <span className="skill-count">{skills.length}</span>
      </div>
      
      <div className="skills-grid">
        {skills.map((skill, index) => (
          <div key={`${skill}-${index}`} className="skill-item">
            <div className={`skill-badge ${getBadgeClass(index)}`}>
              <span className="skill-name">{skill}</span>
            </div>
            <div className="skill-progress">
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${getProgress(skill, index)}%` }}
                ></div>
              </div>
              <span className="progress-text">{getProgress(skill, index)}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkillDisplay;

