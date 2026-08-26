import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Send,
  Sparkles,
  Bot,
  Globe,
  ShieldCheck,
  ChevronRight,
  Maximize2,
  Minimize2,
  Minus,
  ChevronUp,
  PhoneCall,
  MessageSquare,
  HelpCircle,
  FileText,
  AlertTriangle,
  Phone
} from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

const supportedLanguages = [
  { code: 'hi', name: 'हिंदी (Hindi)', flag: '🇮🇳' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'gu', name: 'ગુજરાતી (Gujarati)', flag: '🇮🇳' },
  { code: 'pa', name: 'ਪੰਜਾਬੀ (Punjabi)', flag: '🇮🇳' },
  { code: 'mr', name: 'मराठी (Marathi)', flag: '🇮🇳' },
  { code: 'te', name: 'తెలుగు (Telugu)', flag: '🇮🇳' },
  { code: 'ta', name: 'தமிழ் (Tamil)', flag: '🇮🇳' },
  { code: 'bn', name: 'বাংলা (Bengali)', flag: '🇮🇳' }
];

const quickQuestions = {
  hi: [
    '5 HP Power Weeder chahiye',
    'Machine start nahi ho rahi / Technical Problem',
    'Shikayat / Raise Support Ticket',
    '0% No-Cost EMI kaise milegi?',
    'Cotton & Sugarcane ke liye best weeder?',
    'Govt. SMAM Subsidy kaise claim karein?'
  ],
  en: [
    'I need 5 HP Power Weeder',
    'Machine not starting / Technical Issue',
    'Complaint / Raise Support Ticket',
    'How to get 0% No-Cost EMI?',
    'Best Power Weeder for cotton & sugarcane?',
    'How to claim Govt. SMAM Subsidy?'
  ],
  gu: [
    '0% No-Cost EMI કેવી રીતે મળશે?',
    'કપાસ અને શેરડી માટે શ્રેષ્ઠ પાવર વીડર?',
    'સરકારી સબસિડી કેવી રીતે મેળવવી?',
    'ડિલિવરી કેટલા દિવસમાં આવશે?'
  ],
  pa: [
    '0% No-Cost EMI ਕਿਵੇਂ ਮਿਲੇਗੀ?',
    'ਕਣਕ ਅਤੇ ਝੋਨੇ ਲਈ ਬੈਸਟ ਮਸ਼ੀਨਰੀ?',
    'ਸਰਕਾਰੀ ਸਬਸਿਡੀ ਦਾ ਕੀ ਤਰੀਕਾ ਹੈ?',
    'ਡਿਲਿਵਰੀ ਕਿੰਨੇ ਦਿਨਾਂ ਵਿੱਚ ਆਵੇਗੀ?'
  ],
  mr: [
    '0% No-Cost EMI कशी मिळेल?',
    'कापूस आणि उसासाठी सर्वोत्तम वीडर?',
    'शासकीय सबसिडी कशी मिळवावी?',
    'ડિલિવરી किती दिवसात होईल?'
  ],
  te: [
    '0% No-Cost EMI ఎలా పొందాలి?',
    'పత్తి మరియు చెరకు కోసం ఉత్తమ వీడర్ ఏది?',
    'ప్రభుత్వ సబ్సిడీ ఎలా పొందాలి?'
  ],
  ta: [
    '0% No-Cost EMI எப்படி பெறுவது?',
    'பருத்தி மற்றும் கரும்புக்கு சிறந்த களை எடுக்கும் கருவி எது?',
    'அரசு மானியம் பெறுவது எப்படி?'
  ],
  bn: [
    '0% No-Cost EMI কীভাবে পাব?',
    'চাষের জন্য সেরা পাওয়ার উইডার কোনটি?',
    'সরকারি ভর্তুকি কীভাবে পাওয়া যাবে?'
  ]
};

// Formatted Rich Markdown Text Renderer (Eliminates raw ** and renders lists, bold, badges)
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

        // Numbered list item: "1. ", "2. "
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

        // Bullet point: "• ", "- ", "* "
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

        // Regular line / header
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

const KisanAIChatbot = () => {
  const [isLauncherHovered, setIsLauncherHovered] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [currentLang, setCurrentLang] = useState('hi');
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: 'Namaste Kisan Bhai! 🙏 Main aapka 24x7 **Kisan AI Assistant** hoon. Main aapki bhasha me kheti ki machinery, 0% EMI loan, subsidy aur technical sawalon me madad kar sakta hoon. Kahiye, main aapki kya seva karoon?',
      time: 'Just now'
    }
  ]);
  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, isTyping]);

  const handleSendMessage = async (textToSend = null) => {
    const text = textToSend || inputVal;
    if (!text || !text.trim()) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: text.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputVal('');
    setIsTyping(true);

    try {
      // Call intelligent backend RAG knowledge engine (analyzes live catalog & policies)
      const res = await api.post('/ai/chat', { message: text.trim(), lang: currentLang });
      if (res.data.success && (res.data.data || res.data.text)) {
        const botData = res.data.data || {};
        const newBotMsg = {
          id: Date.now() + 1,
          sender: 'bot',
          text: botData.text || res.data.text || '',
          actionLink: botData.actionLink || res.data.actionLink || null,
          products: botData.products || res.data.products || [],
          supportActions: botData.supportActions || res.data.supportActions || [],
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, newBotMsg]);
      } else {
        throw new Error('Fallback required');
      }
    } catch (err) {
      // Fallback response if offline
      const fallbackMsg = {
        id: Date.now() + 1,
        sender: 'bot',
        text: `🙏 **Namaste Kisan Bhai!**\n\nHamara **Kisan AI Assistant** aapki seva me hajir hai. Kheti ki machinery (Power Weeders, Brush Cutters, Solar Pumps), 0% EMI Loan, aur Govt. SMAM Subsidy ke baare me poochhein.`,
        actionLink: { label: 'Explore Agriculture Store', url: '/products' },
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, fallbackMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      {/* Floating Widget Launcher Button */}
      {!isOpen && (
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
          {/* Tooltip Callout Badge */}
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

          {/* Main Floating Button */}
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
      )}

      {/* Interactive Chat Window */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            bottom: isMinimized ? '0' : isMaximized ? '0' : '24px',
            right: isMinimized ? '24px' : isMaximized ? '0' : '24px',
            left: isMaximized ? '0' : 'auto',
            top: isMaximized ? '0' : 'auto',
            width: isMaximized ? '100vw' : isMinimized ? '340px' : '440px',
            height: isMaximized ? '100vh' : isMinimized ? '46px' : '600px',
            maxHeight: isMaximized ? '100vh' : '90vh',
            maxWidth: isMaximized ? '100vw' : 'calc(100vw - 32px)',
            background: 'var(--bg-surface)',
            borderRadius: isMaximized ? '0px' : isMinimized ? '14px 14px 0 0' : '18px',
            boxShadow: '0 25px 60px -10px rgba(6, 36, 22, 0.45), 0 0 0 1px rgba(0,0,0,0.1)',
            zIndex: 999999,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            border: isMaximized ? 'none' : '1.5px solid #22c55e',
            transition: 'all 0.22s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        >
          {/* Header */}
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
            {/* Left: Avatar + Title (Zero wrapping, perfectly aligned) */}
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

            {/* Right: Window Controls Dock (Compact, Refined, Spaced Glowing Buttons) */}
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
              {/* Minimize Button */}
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

              {/* Maximize / Fullscreen Button */}
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

              {/* Close Button */}
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

          {/* Subheader Language Switcher Bar (Spacious and neatly separated) */}
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
                {supportedLanguages.map(l => (
                  <option key={l.code} value={l.code} style={{ color: 'var(--text-main)', background: 'var(--bg-surface)' }}>
                    {l.flag} {l.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {!isMinimized && (
            <>
              {/* Messages Area */}
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
                {/* Advisor Notice */}
                <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', padding: '0.45rem 0.75rem', fontSize: '0.725rem', color: '#166534', display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 600 }}>
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
                      {/* Rich Formatted Markdown Output */}
                      <FormattedMessage text={m.text} isUser={m.sender === 'user'} />

                      {/* Matching Live Product Cards from Catalog */}
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
                                onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1592878904946-b3cd8ae243d0?w=200&q=80'; }}
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

                      {/* Action Button Link inside Bot Bubble */}
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

                      {/* Interactive Support & Escalation Quick Buttons */}
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
                    <span>Analyzing AgriMachina catalog & policies...</span>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Quick Question Chips */}
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
                {(quickQuestions[currentLang] || quickQuestions['en']).map((q, idx) => (
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

              {/* Input Footer */}
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
                    placeholder="Type your agricultural question..."
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
          )}
        </div>
      )}
    </>
  );
};

export default KisanAIChatbot;
