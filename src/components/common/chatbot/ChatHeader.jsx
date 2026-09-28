import React from 'react';
import {
  Bot,
  ChevronUp,
  Minus,
  Maximize2,
  Minimize2,
  X,
  Globe
} from 'lucide-react';
import { supportedLanguages } from './chatbotData';

const ChatHeader = ({
  isMinimized,
  setIsMinimized,
  isMaximized,
  setIsMaximized,
  setIsOpen,
  currentLang,
  setCurrentLang
}) => {
  return (
    <>
      <div
        style={{
          background: 'linear-gradient(135deg, #092617, #063820)',
          color: '#ffffff',
          padding: '0.65rem 1rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid #14532d',
          flexShrink: 0
        }}
      >
        <div className="flex items-center gap-2.5" style={{ minWidth: 0, flex: 1 }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              minWidth: '32px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #15803d, #166534)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1.5px solid #86efac',
              boxShadow: '0 2px 8px rgba(34, 197, 94, 0.4)',
              flexShrink: 0
            }}
          >
            <Bot size={18} color="#fef08a" />
          </div>
          <div style={{ minWidth: 0, overflow: 'hidden' }}>
            <div style={{ fontWeight: 800, fontSize: '0.875rem', color: '#ffffff', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
              Kisan AI Specialist
            </div>
            <div style={{ fontSize: '0.7rem', color: '#86efac', display: 'flex', alignItems: 'center', gap: '0.3rem', whiteSpace: 'nowrap' }}>
              <span style={{ width: '6px', height: '6px', minWidth: '6px', borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 6px #22c55e' }} />
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>24×7 Multilingual Farm Assistant</span>
            </div>
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem',
            marginLeft: '0.75rem',
            padding: '0.15rem 0.35rem',
            background: 'rgba(0, 0, 0, 0.45)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            borderRadius: '8px',
            backdropFilter: 'blur(8px)',
            boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.5)',
            flexShrink: 0
          }}
        >
          <button
            type="button"
            onClick={() => setIsMinimized(!isMinimized)}
            style={{
              background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.3), rgba(180, 83, 9, 0.45))',
              border: '1px solid rgba(245, 158, 11, 0.65)',
              borderRadius: '6px',
              color: '#fef08a',
              width: '23px',
              height: '23px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.18s ease'
            }}
            className="hover:scale-110 hover:shadow-[0_0_10px_rgba(245,158,11,0.7)] active:scale-95"
            title={isMinimized ? 'Restore Window' : 'Minimize Window'}
          >
            {isMinimized ? <ChevronUp size={11} strokeWidth={2.8} /> : <Minus size={11} strokeWidth={3} />}
          </button>

          {!isMinimized && (
            <button
              type="button"
              onClick={() => setIsMaximized(!isMaximized)}
              style={{
                background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.3), rgba(2, 132, 199, 0.45))',
                border: '1px solid rgba(56, 189, 248, 0.65)',
                borderRadius: '6px',
                color: '#bae6fd',
                width: '23px',
                height: '23px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.18s ease'
              }}
              className="hover:scale-110 hover:shadow-[0_0_10px_rgba(56,189,248,0.7)] active:scale-95"
              title={isMaximized ? 'Exit Full Screen' : 'Full Screen'}
            >
              {isMaximized ? <Minimize2 size={11} strokeWidth={2.5} /> : <Maximize2 size={11} strokeWidth={2.5} />}
            </button>
          )}

          <button
            type="button"
            onClick={() => setIsOpen(false)}
            style={{
              background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.4), rgba(185, 28, 28, 0.55))',
              border: '1px solid rgba(239, 68, 68, 0.75)',
              borderRadius: '6px',
              color: '#fecaca',
              width: '23px',
              height: '23px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.18s ease'
            }}
            className="hover:scale-110 hover:bg-red-600 hover:text-white hover:shadow-[0_0_12px_rgba(239,68,68,0.9)] active:scale-95"
            title="Close Chat"
          >
            <X size={11} strokeWidth={2.8} />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <div
          style={{
            background: '#071d12',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
            padding: '0.35rem 0.85rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.75rem',
            flexShrink: 0
          }}
        >
          <div className="flex items-center gap-1.5" style={{ color: '#86efac', fontWeight: 700 }}>
            <Globe size={13} color="#34d399" />
            <span>Language / भाषा:</span>
          </div>
          <select
            value={currentLang}
            onChange={(e) => setCurrentLang(e.target.value)}
            style={{
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '6px',
              color: '#ffffff',
              fontSize: '0.725rem',
              fontWeight: 700,
              padding: '0.15rem 0.45rem',
              cursor: 'pointer',
              outline: 'none'
            }}
            className="hover:bg-white/20"
          >
            {supportedLanguages.map((l) => (
              <option key={l.code} value={l.code} style={{ color: 'var(--text-main)', background: 'var(--bg-surface)' }}>
                {l.flag} {l.name}
              </option>
            ))}
          </select>
        </div>
      )}
    </>
  );
};

export default ChatHeader;
