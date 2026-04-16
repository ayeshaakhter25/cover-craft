import React, { useState, useEffect } from 'react';
import './Header.css';

const Header = ({ user, onLogout }) => {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const isDark = localStorage.getItem('darkMode') === 'true';
    setDarkMode(isDark);
    document.documentElement.classList.toggle('dark', isDark);
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode);
    document.documentElement.classList.toggle('dark', newDarkMode);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    onLogout();
  };

  // Track hash for simple active nav highlighting (works with anchor links)
  const [activeHash, setActiveHash] = React.useState(window.location.hash || '#');

  React.useEffect(() => {
    const onHash = () => setActiveHash(window.location.hash || '#');
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-brand">
          <div className="logo">
            🎯
          </div>
          <h1 className="brand-text">CareerCraft AI</h1>
        </div>
        
        <nav className="header-nav">
          <a href="#upload" className={`nav-link ${activeHash === '#upload' ? 'active' : ''}`}>Upload CV</a>
          <a href="#job" className={`nav-link ${activeHash === '#job' ? 'active' : ''}`}>Job Description</a>
          <a href="#match" className={`nav-link ${activeHash === '#match' ? 'active' : ''}`}>Match Analysis</a>
        </nav>

        <div className="header-actions">
          <button 
            className="theme-toggle"
            onClick={toggleDarkMode}
            aria-label="Toggle dark mode"
            title="Toggle dark mode"
          >
            {darkMode ? '☀️' : '🌙'}
          </button>
          
          <div className="user-profile">
            <span className="user-name">{user?.name || 'User'}</span>
            <button 
              className="logout-btn"
              onClick={handleLogout}
              aria-label="Logout"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

