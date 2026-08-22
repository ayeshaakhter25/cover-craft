import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './Header.css';

export default function Header({ user, onLogout }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    onLogout();
    navigate('/');
  };

  return (
    <header className="app-header">
      <div className="hdr-inner">

        {/* Brand */}
        <NavLink to="/" className="hdr-brand">
          <span className="hdr-logo-box">C</span>
          Career Craft
        </NavLink>

        {/* Nav Links */}
        <nav className={`hdr-nav ${menuOpen ? 'open' : ''}`}>
          <NavLink to="/"        end className={({ isActive }) => `hdr-link ${isActive ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>Dashboard</NavLink>
          <NavLink to="/analysis"    className={({ isActive }) => `hdr-link ${isActive ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>Analysis</NavLink>
          <NavLink to="/jobs"        className={({ isActive }) => `hdr-link ${isActive ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>Jobs</NavLink>
          <NavLink to="/cover"       className={({ isActive }) => `hdr-link ${isActive ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>Cover Letter</NavLink>
          {/* <NavLink to="/cv-health"   className={({ isActive }) => `hdr-link ${isActive ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>CV Health</NavLink> */}
        </nav>

        {/* Right actions */}
        <div className="hdr-right">
          <span className="hdr-user">{user?.name || 'User'}</span>
          <button className="hdr-logout" onClick={handleLogout}>Logout</button>
          {/* Hamburger */}
          <button className="hdr-burger" onClick={() => setMenuOpen(p => !p)} aria-label="Menu">
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>

      </div>
    </header>
  );
}


