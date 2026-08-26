import React, { useEffect } from 'react';
import { X, Sparkles } from 'lucide-react';
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
          borderRadius: '24px',
          padding: '1.5rem',
          boxShadow: '0 25px 60px -15px rgba(6, 36, 22, 0.35), 0 0 0 1px rgba(22, 101, 52, 0.1)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modern Polished Header */}
        <div
          className="flex items-center justify-between"
          style={{
            marginBottom: '1.25rem',
            borderBottom: '1px solid var(--border-color)',
            paddingBottom: '1rem',
            gap: '1rem'
          }}
        >
          <div className="flex items-center gap-2.5" style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'var(--primary-50, #f0fdf4)',
              border: '1px solid var(--primary-100, #dcfce7)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--primary-600, #166534)',
              flexShrink: 0
            }}>
              <Sparkles size={18} color="var(--primary-600)" />
            </div>
            <h3 style={{
              fontSize: '1.15rem',
              color: 'var(--text-main)',
              fontWeight: 900,
              letterSpacing: '-0.01em',
              lineHeight: 1.3,
              margin: 0,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}>
              {title}
            </h3>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'var(--bg-surface-alt)',
              border: '1px solid var(--border-color)',
              borderRadius: '50%',
              width: '34px',
              height: '34px',
              cursor: 'pointer',
              color: 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s ease',
              flexShrink: 0
            }}
            className="hover:bg-red-50 hover:text-red-600 hover:scale-105 active:scale-95"
            title="Close / बंद करें"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body Container */}
        <div style={{ color: 'var(--text-main)' }}>{children}</div>
      </div>
    </div>
  );
};

export default Modal;

