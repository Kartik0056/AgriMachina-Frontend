import React from 'react';
import { Send } from 'lucide-react';
import { quickQuestions } from './chatbotData';

const ChatInput = ({ currentLang, inputVal, setInputVal, handleSendMessage }) => {
  const currentQuestions = quickQuestions[currentLang] || quickQuestions['en'];

  return (
    <>
      <div
        className="hide-scrollbar"
        style={{
          padding: '0.45rem 0.75rem',
          background: 'var(--bg-surface)',
          borderTop: '1px solid #e2e8f0',
          display: 'flex',
          gap: '0.4rem',
          overflowX: 'auto',
          whiteSpace: 'nowrap'
        }}
      >
        {currentQuestions.map((q, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleSendMessage(q)}
            style={{
              background: 'var(--bg-surface-alt)',
              border: '1px solid #cbd5e1',
              borderRadius: '16px',
              padding: '0.25rem 0.65rem',
              fontSize: '0.725rem',
              color: '#1e293b',
              fontWeight: 600,
              cursor: 'pointer',
              flexShrink: 0,
              transition: 'all 0.15s ease'
            }}
            className="hover:bg-green-100 hover:text-green-900 hover:border-green-400 hover:scale-105"
          >
            💡 {q}
          </button>
        ))}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        style={{
          padding: '0.55rem 0.75rem',
          background: 'var(--bg-surface)',
          borderTop: '1px solid #e2e8f0'
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem',
            background: 'var(--bg-surface-alt)',
            border: '1.5px solid #cbd5e1',
            borderRadius: '24px',
            padding: '0.2rem 0.35rem 0.2rem 0.75rem',
            boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.04)'
          }}
        >
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="Type your product or order question..."
            style={{
              fontSize: '0.825rem',
              background: 'transparent',
              border: 'none',
              outline: 'none',
              flex: 1,
              color: 'var(--text-main)',
              padding: '0.25rem 0'
            }}
          />
          <button
            type="submit"
            disabled={!inputVal.trim()}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: inputVal.trim() ? 'linear-gradient(135deg, #16a34a, #15803d)' : '#cbd5e1',
              color: '#ffffff',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: inputVal.trim() ? 'pointer' : 'default',
              flexShrink: 0,
              boxShadow: inputVal.trim() ? '0 2px 6px rgba(22, 163, 74, 0.4)' : 'none',
              transition: 'all 0.18s ease'
            }}
            className="hover:scale-105 active:scale-95"
          >
            <Send size={14} />
          </button>
        </div>
      </form>
    </>
  );
};

export default ChatInput;
