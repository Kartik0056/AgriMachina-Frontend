import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  ChevronDown,
  Globe,
  Sun,
  Moon,
  Check,
  CheckCircle2,
  PhoneCall
} from 'lucide-react';
import { useTheme, THEMES } from '../../../context/ThemeContext';
import { useLanguage, LANGUAGES } from '../../../context/LanguageContext';
import { tickerAnnouncements } from './categoriesData';

const AnnouncementStrip = () => {
  const { theme, isDark, toggleTheme, setTheme } = useTheme();
  const { language, setLanguage, currentLangMeta } = useLanguage();

  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [themeDropdownOpen, setThemeDropdownOpen] = useState(false);
  const [tickerIndex, setTickerIndex] = useState(0);

  const themeDropdownRef = useRef(null);
  const langDropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (themeDropdownRef.current && !themeDropdownRef.current.contains(e.target)) {
        setThemeDropdownOpen(false);
      }
      if (langDropdownRef.current && !langDropdownRef.current.contains(e.target)) {
        setLangDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setTickerIndex((prev) => (prev + 1) % tickerAnnouncements.length);
    }, 3800);
    return () => clearInterval(timer);
  }, []);

  const curTicker = tickerAnnouncements[tickerIndex];

  return (
    <div
      className="top-announcement-strip"
      style={{
        background: 'linear-gradient(90deg, #05190e, #0c3e27, #05190e)',
        color: '#ffffff',
        fontSize: '0.825rem',
        padding: '0.4rem 1rem',
        borderBottom: '1px solid #14532d',
        position: 'relative',
        zIndex: 1100
      }}
    >
      <div className="container flex items-center justify-between" style={{ minHeight: '26px', gap: '0.5rem' }}>
        <div className="hidden lg:flex items-center gap-1.5" style={{ fontSize: '0.75rem', color: '#86efac', fontWeight: 700, flexShrink: 0 }}>
          <Sparkles size={14} color="#f59e0b" />
          <span>Kisan Priority Desk</span>
        </div>

        <div
          key={tickerIndex}
          className="top-ticker-text flex items-center justify-center gap-1.5 flex-1 text-center"
          style={{
            animation: 'fadeInUp 0.45s ease-out forwards',
            padding: '0 0.25rem'
          }}
        >
          <span style={{ fontSize: '0.9rem' }}>{curTicker.icon}</span>
          <span style={{ fontWeight: 600, color: '#f8fafc', letterSpacing: '0.01em', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {curTicker.text}
          </span>
          <span
            className="badge hide-on-mobile"
            style={{
              fontSize: '0.65rem',
              fontWeight: 800,
              background: '#15803d',
              color: '#fef08a',
              border: '1px solid #86efac',
              padding: '0.1rem 0.45rem',
              borderRadius: '12px',
              flexShrink: 0
            }}
          >
            {curTicker.highlight}
          </span>
        </div>

        <div className="flex items-center gap-2" style={{ flexShrink: 0 }}>
          <div style={{ position: 'relative' }} ref={langDropdownRef}>
            <button
              type="button"
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.25rem',
                background: 'rgba(255,255,255,0.12)',
                border: '1px solid rgba(255,255,255,0.25)',
                color: '#ffffff',
                padding: '0.2rem 0.5rem',
                borderRadius: '7px',
                fontSize: '0.75rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
              className="hover:bg-green-900"
              title="Change Language / भाषा बदलें"
            >
              <Globe size={13} color="#86efac" />
              <span>{currentLangMeta.native}</span>
              <ChevronDown size={10} />
            </button>

            {langDropdownOpen && (
              <div
                className="top-dropdown-menu"
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 6px)',
                  right: 0,
                  background: 'var(--bg-surface, #ffffff)',
                  border: '1px solid var(--border-color, #cbd5e1)',
                  borderRadius: '10px',
                  boxShadow: '0 12px 30px rgba(0,0,0,0.35)',
                  zIndex: 1200,
                  minWidth: '165px',
                  overflow: 'hidden',
                  padding: '5px'
                }}
              >
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => {
                      setLanguage(lang.code);
                      setLangDropdownOpen(false);
                    }}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.5rem 0.75rem',
                      border: 'none',
                      background: language === lang.code ? 'var(--primary-50, #f0fdf4)' : 'transparent',
                      color: language === lang.code ? '#166534' : 'var(--text-main, #1e293b)',
                      fontWeight: language === lang.code ? 800 : 600,
                      fontSize: '0.8rem',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'background 0.12s ease'
                    }}
                    className="hover:bg-green-50 dark:hover:bg-slate-800"
                  >
                    <span className="flex items-center gap-2" style={{ color: language === lang.code ? '#166534' : 'var(--text-main, #1e293b)' }}>
                      <span>{lang.flag}</span>
                      <span style={{ color: language === lang.code ? '#166534' : 'var(--text-main, #1e293b)' }}>{lang.native}</span>
                    </span>
                    {language === lang.code && <CheckCircle2 size={14} color="#166534" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div style={{ position: 'relative' }} ref={themeDropdownRef}>
            <button
              type="button"
              onClick={() => setThemeDropdownOpen(!themeDropdownOpen)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.3rem',
                background: 'rgba(255,255,255,0.12)',
                border: '1px solid rgba(255,255,255,0.25)',
                color: '#ffffff',
                padding: '0.2rem 0.5rem',
                borderRadius: '7px',
                fontSize: '0.75rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
              className="hover:bg-green-900"
              title="Select Theme / थीम बदलें"
            >
              <span>{THEMES.find((t) => t.id === theme)?.icon || '🎨'}</span>
              <span className="hide-on-mobile">{THEMES.find((t) => t.id === theme)?.name.split(' ')[0] || 'Theme'}</span>
              <ChevronDown size={10} />
            </button>

            {themeDropdownOpen && (
              <div
                className="top-dropdown-menu"
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 6px)',
                  right: 0,
                  background: 'var(--bg-surface, #ffffff)',
                  border: '1px solid var(--border-color, #cbd5e1)',
                  borderRadius: '12px',
                  boxShadow: '0 16px 36px rgba(0,0,0,0.35)',
                  zIndex: 1200,
                  minWidth: '220px',
                  overflow: 'hidden',
                  padding: '6px'
                }}
              >
                <div
                  style={{
                    padding: '0.4rem 0.6rem',
                    borderBottom: '1px solid var(--border-color, #e2e8f0)',
                    fontSize: '0.7rem',
                    fontWeight: 800,
                    color: 'var(--text-muted, #64748b)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}
                >
                  Select Store Theme
                </div>
                {THEMES.map((thm) => {
                  const isCur = theme === thm.id;
                  return (
                    <button
                      key={thm.id}
                      type="button"
                      onClick={() => {
                        setTheme(thm.id);
                        setThemeDropdownOpen(false);
                      }}
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.5rem 0.75rem',
                        border: 'none',
                        background: isCur ? 'var(--primary-50, rgba(22, 101, 52, 0.15))' : 'transparent',
                        color: isCur ? 'var(--primary-600, #166534)' : 'var(--text-main, #1e293b)',
                        fontWeight: isCur ? 800 : 600,
                        fontSize: '0.8rem',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        textAlign: 'left',
                        margin: '2px 0',
                        transition: 'background 0.12s ease'
                      }}
                      className="hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                      <div className="flex items-center gap-2.5">
                        <span
                          style={{
                            width: '20px',
                            height: '20px',
                            borderRadius: '50%',
                            background: thm.bgPreview,
                            border: `2px solid ${thm.primaryColor}`,
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.7rem'
                          }}
                        >
                          {thm.icon}
                        </span>
                        <span style={{ color: isCur ? 'var(--primary-600, #166534)' : 'var(--text-main, #1e293b)' }}>{thm.name}</span>
                      </div>
                      {isCur && <Check size={14} color={thm.primaryColor} />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={toggleTheme}
            style={{
              width: '26px',
              height: '26px',
              borderRadius: '50%',
              background: isDark ? 'rgba(30, 41, 59, 0.8)' : 'rgba(255, 255, 255, 0.15)',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 2px 5px rgba(0,0,0,0.15)',
              transition: 'transform 0.18s cubic-bezier(0.34, 1.56, 0.64, 1), background 0.15s ease'
            }}
            className="hover:scale-110 active:scale-95"
            title={isDark ? 'Switch to Day Light Mode' : 'Switch to Dark Farm Mode'}
          >
            {isDark ? <Sun size={14} color="#fef08a" /> : <Moon size={14} color="#86efac" />}
          </button>

          <a
            href="tel:6395211953"
            className="hide-on-mobile"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              color: '#fef08a',
              textDecoration: 'none',
              fontWeight: 800,
              fontSize: '0.775rem',
              background: 'rgba(255,255,255,0.1)',
              padding: '0.15rem 0.5rem',
              borderRadius: '6px',
              border: '1px solid rgba(254,240,138,0.3)',
              flexShrink: 0
            }}
          >
            <PhoneCall size={12} color="#f59e0b" />
            <span>+91 63952 11953</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementStrip;
