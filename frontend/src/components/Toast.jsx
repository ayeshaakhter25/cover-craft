import React, { useEffect, useState } from 'react';
import './Toast.css';

const Toast = ({ message, type = 'info', duration = 5000, onClose }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => {
        setVisible(false);
        if (onClose) onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [visible, duration, onClose]);

  if (!visible) return null;

  const getIcon = () => {
    switch (type) {
      case 'success': return '✅';
      case 'error': return '❌';
      case 'warning': return '⚠️';
      default: return 'ℹ️';
    }
  };

  return (
    <div className={`toast toast--${type}`}>
      <div className="toast-icon">{getIcon()}</div>
      <div className="toast-content">
        <div className="toast-message">{message}</div>
      </div>
      <button 
        className="toast-close"
        onClick={() => setVisible(false)}
        aria-label="Close toast"
      >
        ×
      </button>
    </div>
  );
};

export default Toast;

