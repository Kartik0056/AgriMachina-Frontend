import React from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  Sparkles,
  ChevronRight,
  AlertTriangle,
  PhoneCall,
  MessageSquare,
  FileText,
  Bot
} from 'lucide-react';
import FormattedMessage from './FormattedMessage';

const ChatMessages = ({ messages, isTyping, setIsOpen, messagesEndRef }) => {
  return (
    <div
      className="hide-scrollbar"
      style={{
        flex: 1,
        padding: '1rem',
        overflowY: 'auto',
        background: 'var(--bg-surface-alt)',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.85rem'
      }}
    >
      <div
        style={{
          background: '#f0fdf4',
          border: '1px solid #bbf7d0',
          borderRadius: '8px',
          padding: '0.45rem 0.75rem',
          fontSize: '0.725rem',
          color: '#166534',
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
          fontWeight: 600
        }}
      >
        <ShieldCheck size={14} color="#16a34a" />
        <span>Ask in Hindi, English, Punjabi, Gujarati, Marathi, or any Indian language.</span>
      </div>

      {messages.map((m) => (
        <div
          key={m.id}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: m.sender === 'user' ? 'flex-end' : 'flex-start',
            width: '100%'
          }}
        >
          <div
            style={{
              maxWidth: '88%',
              padding: '0.75rem 0.95rem',
              borderRadius: m.sender === 'user' ? '14px 14px 2px 14px' : '14px 14px 14px 2px',
              background: m.sender === 'user' ? 'linear-gradient(135deg, #166534, #15803d)' : '#ffffff',
              color: m.sender === 'user' ? '#ffffff' : '#0f172a',
              border: m.sender === 'user' ? 'none' : '1px solid #e2e8f0',
              boxShadow: '0 2px 6px rgba(0,0,0,0.05)'
            }}
          >
            <FormattedMessage text={m.text} isUser={m.sender === 'user'} />

            {m.products && m.products.length > 0 && (
              <div style={{ marginTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#166534', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <Sparkles size={12} color="#16a34a" />
                  <span>Recommended Machinery from Store:</span>
                </div>
                {m.products.map((prod) => (
                  <Link
                    key={prod._id || prod.slug}
                    to={`/products/${prod.slug}`}
                    onClick={() => setIsOpen(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.6rem',
                      padding: '0.45rem 0.6rem',
                      background: 'var(--bg-surface-alt)',
                      border: '1px solid #bbf7d0',
                      borderRadius: '8px',
                      textDecoration: 'none',
                      transition: 'all 0.15s ease'
                    }}
                    className="hover:border-green-600 hover:bg-green-50/50"
                  >
                    <img
                      src={prod.image || '/images/machinery/power_weeder.jpg'}
                      alt={prod.title}
                      style={{ width: '38px', height: '38px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1592878904946-b3cd8ae243d0?w=200&q=80';
                      }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-main)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {prod.title}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.1rem' }}>
                        <span style={{ fontSize: '0.775rem', fontWeight: 900, color: '#166534' }}>
                          ₹{prod.price?.toLocaleString('en-IN')}
                        </span>
                        {prod.compareAtPrice > prod.price && (
                          <span style={{ fontSize: '0.65rem', color: 'var(--text-light)', textDecoration: 'line-through' }}>
                            ₹{prod.compareAtPrice?.toLocaleString('en-IN')}
                          </span>
                        )}
                        {prod.discountPercent > 0 && (
                          <span style={{ fontSize: '0.625rem', background: '#dcfce7', color: '#15803d', fontWeight: 800, padding: '0.05rem 0.3rem', borderRadius: '4px' }}>
                            {prod.discountPercent}% OFF
                          </span>
                        )}
                      </div>
                    </div>
                    <ChevronRight size={14} color="#166534" />
                  </Link>
                ))}
              </div>
            )}

            {m.actionLink && (
              <div style={{ marginTop: '0.65rem' }}>
                <Link
                  to={m.actionLink.url}
                  onClick={() => setIsOpen(false)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    background: '#f0fdf4',
                    border: '1px solid #86efac',
                    color: '#166534',
                    fontWeight: 800,
                    fontSize: '0.75rem',
                    padding: '0.3rem 0.65rem',
                    borderRadius: '6px',
                    textDecoration: 'none'
                  }}
                  className="hover:bg-green-100"
                >
                  <span>{m.actionLink.label}</span>
                  <ChevronRight size={13} />
                </Link>
              </div>
            )}

            {m.supportActions && m.supportActions.length > 0 && (
              <div style={{ marginTop: '0.75rem', paddingTop: '0.65rem', borderTop: '1px dashed #cbd5e1' }}>
                <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#b91c1c', display: 'flex', alignItems: 'center', gap: '0.3rem', marginBottom: '0.45rem' }}>
                  <AlertTriangle size={12} color="#dc2626" />
                  <span>Official Support & Escalation Options:</span>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                  {m.supportActions.map((act, actIdx) => {
                    if (act.type === 'call') {
                      return (
                        <a
                          key={actIdx}
                          href={`tel:${act.phone || '18002474327'}`}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                            background: '#eff6ff',
                            border: '1px solid #93c5fd',
                            color: '#1d4ed8',
                            fontWeight: 800,
                            fontSize: '0.725rem',
                            padding: '0.35rem 0.65rem',
                            borderRadius: '6px',
                            textDecoration: 'none'
                          }}
                          className="hover:bg-blue-100 active:scale-95"
                        >
                          <PhoneCall size={12} />
                          <span>{act.label}</span>
                        </a>
                      );
                    } else if (act.type === 'whatsapp') {
                      return (
                        <a
                          key={actIdx}
                          href={act.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                            background: '#f0fdf4',
                            border: '1px solid #86efac',
                            color: '#15803d',
                            fontWeight: 800,
                            fontSize: '0.725rem',
                            padding: '0.35rem 0.65rem',
                            borderRadius: '6px',
                            textDecoration: 'none'
                          }}
                          className="hover:bg-green-100 active:scale-95"
                        >
                          <MessageSquare size={12} />
                          <span>{act.label}</span>
                        </a>
                      );
                    } else {
                      return (
                        <Link
                          key={actIdx}
                          to={act.url || '/support'}
                          onClick={() => setIsOpen(false)}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                            background: '#fef2f2',
                            border: '1px solid #fca5a5',
                            color: '#b91c1c',
                            fontWeight: 800,
                            fontSize: '0.725rem',
                            padding: '0.35rem 0.65rem',
                            borderRadius: '6px',
                            textDecoration: 'none'
                          }}
                          className="hover:bg-red-100 active:scale-95"
                        >
                          <FileText size={12} />
                          <span>{act.label}</span>
                        </Link>
                      );
                    }
                  })}
                </div>
              </div>
            )}
          </div>
          <span style={{ fontSize: '0.65rem', color: 'var(--text-light)', marginTop: '2px', padding: '0 4px' }}>
            {m.time}
          </span>
        </div>
      ))}

      {isTyping && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#166534', fontSize: '0.75rem', background: 'var(--bg-surface)', border: '1px solid #bbf7d0', padding: '0.45rem 0.75rem', borderRadius: '12px', width: 'fit-content', boxShadow: '0 2px 6px rgba(0,0,0,0.04)' }}>
          <Bot size={14} className="animate-spin" />
          <span>Analyzing Siddhiva catalog & policies...</span>
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatMessages;
