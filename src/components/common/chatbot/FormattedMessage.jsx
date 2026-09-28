import React from 'react';

const FormattedMessage = ({ text, isUser }) => {
  if (!text) return null;

  const lines = text.split('\n');

  const formatInline = (str) => {
    if (!str) return '';
    const parts = [];
    const regex = /(\*\*[^*]+\*\*|~~[^~]+~~|\*[^*]+\*)/g;
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(str)) !== null) {
      if (match.index > lastIndex) {
        parts.push(str.slice(lastIndex, match.index));
      }
      const token = match[0];
      if (token.startsWith('**') && token.endsWith('**')) {
        parts.push(
          <strong
            key={`b-${match.index}`}
            style={{
              fontWeight: 800,
              color: isUser ? '#ffffff' : '#14532d'
            }}
          >
            {token.slice(2, -2)}
          </strong>
        );
      } else if (token.startsWith('~~') && token.endsWith('~~')) {
        parts.push(
          <del key={`d-${match.index}`} style={{ opacity: 0.65 }}>
            {token.slice(2, -2)}
          </del>
        );
      } else if (token.startsWith('*') && token.endsWith('*')) {
        parts.push(
          <em key={`i-${match.index}`} style={{ fontStyle: 'italic', opacity: 0.9 }}>
            {token.slice(1, -1)}
          </em>
        );
      }
      lastIndex = regex.lastIndex;
    }

    if (lastIndex < str.length) {
      parts.push(str.slice(lastIndex));
    }

    return parts;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
      {lines.map((line, lineIdx) => {
        const trimmed = line.trim();
        if (!trimmed) {
          return <div key={lineIdx} style={{ height: '0.2rem' }} />;
        }

        const numMatch = trimmed.match(/^(\d+)\.\s+(.*)$/);
        if (numMatch) {
          const num = numMatch[1];
          const content = numMatch[2];
          return (
            <div
              key={lineIdx}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.45rem',
                fontSize: '0.825rem',
                lineHeight: 1.45
              }}
            >
              <span
                style={{
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  background: isUser ? 'rgba(255,255,255,0.25)' : 'linear-gradient(135deg, #16a34a, #15803d)',
                  color: '#ffffff',
                  fontSize: '0.65rem',
                  fontWeight: 900,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  marginTop: '2px'
                }}
              >
                {num}
              </span>
              <div style={{ flex: 1 }}>{formatInline(content)}</div>
            </div>
          );
        }

        if (trimmed.startsWith('• ') || trimmed.startsWith('- ') || (trimmed.startsWith('* ') && !trimmed.startsWith('** '))) {
          const content = trimmed.replace(/^[•\-*]\s+/, '');
          return (
            <div
              key={lineIdx}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.45rem',
                fontSize: '0.825rem',
                lineHeight: 1.45
              }}
            >
              <span style={{ color: isUser ? '#ffffff' : '#16a34a', fontSize: '0.85rem', lineHeight: '1.2' }}>•</span>
              <div style={{ flex: 1 }}>{formatInline(content)}</div>
            </div>
          );
        }

        return (
          <div
            key={lineIdx}
            style={{
              fontSize: '0.835rem',
              lineHeight: 1.48,
              color: isUser ? '#ffffff' : '#0f172a'
            }}
          >
            {formatInline(trimmed)}
          </div>
        );
      })}
    </div>
  );
};

export default FormattedMessage;
