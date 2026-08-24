import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const Modal = ({ isOpen, onClose, title, children, maxWidth = '650px' }) => {
  const { isDark } = useTheme();

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
        className={`modal-content ${isDark ? 'dark-theme' : ''}`}
        style={{
          maxWidth,
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-color)',
          color: 'var(--text-main)',
          borderRadius: '20px',
          boxShadow: 'var(--shadow-xl)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="flex items-center justify-between"
          style={{
            marginBottom: '1.25rem',
            borderBottom: '1px solid var(--border-color)',
            paddingBottom: '0.85rem'
          }}
        >
          <h3 style={{ fontSize: '1.25rem', color: 'var(--text-main)', fontWeight: 800 }}>{title}</h3>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'var(--bg-surface-alt)',
              border: '1px solid var(--border-color)',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              cursor: 'pointer',
              color: 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.15s ease'
            }}
            className="hover:scale-110"
            title="Close"
          >
            <X size={18} />
          </button>
        </div>
        <div style={{ color: 'var(--text-main)' }}>{children}</div>
      </div>
    </div>
  );
};

export default Modal;
