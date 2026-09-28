import React from 'react';
import { Bot } from 'lucide-react';

const ChatLauncher = ({ isOpen, setIsOpen, isLauncherHovered, setIsLauncherHovered }) => {
  if (isOpen) return null;

  return (
    <div
      onMouseEnter={() => setIsLauncherHovered(true)}
      onMouseLeave={() => setIsLauncherHovered(false)}
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 9990,
        display: 'flex',
        alignItems: 'center',
        gap: '0.65rem'
      }}
    >
      <div
        onClick={() => setIsOpen(true)}
        style={{
          background: '#062416',
          color: '#ffffff',
          padding: '0.45rem 0.85rem',
          borderRadius: '20px',
          fontSize: '0.8rem',
          fontWeight: 700,
          boxShadow: '0 10px 25px rgba(0,0,0,0.25)',
          border: '1px solid #166534',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
          opacity: isLauncherHovered ? 1 : 0,
          transform: isLauncherHovered ? 'translateX(0) scale(1)' : 'translateX(12px) scale(0.92)',
          pointerEvents: isLauncherHovered ? 'auto' : 'none',
          transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
          whiteSpace: 'nowrap'
        }}
      >
        <span style={{ fontSize: '1rem' }}>🌱</span>
        <span>Kisan AI • Ask in Any Language!</span>
      </div>

      <button
        type="button"
        onClick={() => setIsOpen(true)}
        style={{
          width: '58px',
          height: '58px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #125435, #16a34a)',
          color: '#ffffff',
          border: '2px solid #86efac',
          boxShadow: isLauncherHovered ? '0 15px 35px rgba(6, 36, 22, 0.5)' : '0 10px 25px rgba(6, 36, 22, 0.35)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          transform: isLauncherHovered ? 'scale(1.08)' : 'scale(1)',
          transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
        title="Open Free Kisan AI Chatbot"
      >
        <Bot size={28} color="#ffffff" />
        <span
          style={{
            position: 'absolute',
            top: '2px',
            right: '2px',
            width: '13px',
            height: '13px',
            borderRadius: '50%',
            background: '#22c55e',
            border: '2px solid #ffffff'
          }}
        />
      </button>
    </div>
  );
};

export default ChatLauncher;
