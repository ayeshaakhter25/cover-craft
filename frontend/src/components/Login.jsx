import React, { useState } from 'react';
import './Login.css';

const apiBase = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function Login({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!isLogin && !formData.name.trim()) {
      newErrors.name = 'Full name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear error on change
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setMessage('');

    try {
      const submitData = isLogin ? { email: formData.email, password: formData.password } : formData;
      const endpoint = isLogin ? 'login' : 'register';
      
      const res = await fetch(`${apiBase}/api/users/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submitData),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        onLogin(data);
        setMessage(`✅ ${isLogin ? 'Login' : 'Registration'} successful!`);
      } else {
        setMessage(`❌ ${data.message || 'Error occurred'}`);
      }
    } catch (err) {
      setMessage('❌ Network error. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <div className="login-icon">🔐</div>
          <h1 className="login-title">{isLogin ? 'Welcome Back' : 'Create Account'}</h1>
          <p className="login-subtitle">
            {isLogin ? 'Sign in to your account' : 'Join CareerCraft AI today'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="login-form" noValidate>
          {!isLogin && (
            <div className="form-group">
              <label htmlFor="name" className="form-label">Full Name</label>
              <input
                id="name"
                name="name"
                type="text"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
                className={`form-input ${errors.name ? 'error' : ''}`}
                required
                aria-describedby="name-error"
              />
              {errors.name && (
                <div id="name-error" className="error-message" role="alert">
                  {errors.name}
                </div>
              )}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email" className="form-label">Email Address</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              className={`form-input ${errors.email ? 'error' : ''}`}
              required
              aria-describedby="email-error"
            />
            {errors.email && (
              <div id="email-error" className="error-message" role="alert">
                {errors.email}
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              className={`form-input ${errors.password ? 'error' : ''}`}
              required
              aria-describedby="password-error"
            />
            {errors.password && (
              <div id="password-error" className="error-message" role="alert">
                {errors.password}
              </div>
            )}
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="submit-button"
            aria-label={loading ? 'Signing in...' : (isLogin ? 'Sign in' : 'Create account')}
          >
            {loading ? (
              <>
                <span className="spinner" aria-hidden="true"></span>
                {isLogin ? 'Signing in...' : 'Creating account...'}
              </>
            ) : (
              isLogin ? 'Sign In' : 'Create Account'
            )}
          </button>
          <button 
            type="button"
            onClick={() => onLogin({ token: 'demo', user: { name: 'Demo User' } })}
            className="demo-button"
            style={{marginTop: '1rem', width: '100%'}}
          >
            🚀 Skip Demo - View Full UI
          </button>
        </form>

        {message && (
          <div className={`message ${message.includes('✅') ? 'success' : 'error'}`} role="alert">
            {message}
          </div>
        )}

        <div className="login-footer">
          <p>
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <button 
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="toggle-button"
              disabled={loading}
              aria-label={isLogin ? 'Create account' : 'Sign in'}
            >
              {isLogin ? ' Create one' : ' Sign in'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

