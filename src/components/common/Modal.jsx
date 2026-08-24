import React, { useEffect } from 'react';
import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, children, maxWidth = '650px', theme = 'light' }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className={`modal-content ${theme === 'dark' ? 'dark-theme' : ''}`}
        style={{ maxWidth }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between" style={{ marginBottom: '1.25rem', borderBottom: theme === 'dark' ? '1px solid #1e2e4f' : '1px solid #e2e8f0', paddingBottom: '0.85rem' }}>
          <h3 style={{ fontSize: '1.2rem', color: theme === 'dark' ? '#ffffff' : '#0f172a' }}>{title}</h3>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: theme === 'dark' ? '#94a3b8' : '#64748b',
              display: 'flex',
              alignItems: 'center',
              padding: '0.25rem'
            }}
          >
            <X size={20} />
          </button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
};

export default Modal;
