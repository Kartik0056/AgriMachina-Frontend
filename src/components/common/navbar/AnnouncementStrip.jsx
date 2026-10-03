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
  const { language, setLanguage, currentLangMeta, t } = useLanguage();

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
    }, 4200);
    return () => clearInterval(timer);
  }, []);

  const curTicker = tickerAnnouncements[tickerIndex] || tickerAnnouncements[0];

  return (
    <div
      className="top-announcement-strip"
      style={{
        position: 'relative',
        zIndex: 1100,
        fontSize: '0.8rem',
        padding: '0 1rem',
        minHeight: '36px',
        display: 'flex',
        alignItems: 'center',
        background: 'var(--primary-900, #062416)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
        overflow: 'visible'
      }}
    >
      <div
        className="container flex items-center justify-between"
        style={{
          width: '100%',
          gap: '0.6rem',
          position: 'relative',
          overflow: 'visible'
        }}
      >
        {/* Left Branding Tag */}
        <div className="hidden lg:flex items-center gap-1.5" style={{ fontSize: '0.75rem', color: '#86efac', fontWeight: 700, flexShrink: 0 }}>
          <Sparkles size={13} color="#f59e0b" />
          <span>{t ? t('eidula_assured', 'Eidula Assured') : 'Eidula Assured'}</span>
        </div>

        {/* Center Ticker (Strict single line, no vertical scrollbar) */}
        <div
          key={tickerIndex}
          className="top-ticker-text flex items-center justify-center gap-1.5 flex-1 text-center"
          style={{
            animation: 'fadeInUp 0.35s ease-out forwards',
            padding: '0 0.5rem',
            overflow: 'hidden',
            minWidth: 0,
            whiteSpace: 'nowrap'
          }}
        >
          <span style={{ fontSize: '0.85rem', flexShrink: 0 }}>{curTicker.icon}</span>
          <span
            style={{
              fontWeight: 600,
              color: '#f8fafc',
              fontSize: '0.78rem',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}
          >
            {curTicker.text}
          </span>
          <span
            className="badge hide-on-mobile"
            style={{
              fontSize: '0.625rem',
              fontWeight: 800,
              background: '#15803d',
              color: '#fef08a',
              border: '1px solid #86efac',
              padding: '0.05rem 0.45rem',
              borderRadius: '999px',
              flexShrink: 0
            }}
          >
            {curTicker.highlight}
          </span>
        </div>

        {/* Right Actions: Language, Theme, Dark Toggle, Helpline */}
        <div className="flex items-center gap-2" style={{ flexShrink: 0 }}>
          {/* Language Selector */}
          <div style={{ position: 'relative' }} ref={langDropdownRef}>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setLangDropdownOpen(prev => !prev);
                setThemeDropdownOpen(false);
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.25rem',
                background: langDropdownOpen ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.12)',
                border: '1px solid rgba(255,255,255,0.25)',
                color: '#ffffff',
                padding: '0.2rem 0.55rem',
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
              <ChevronDown size={10} style={{ transform: langDropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
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
                  boxShadow: '0 16px 36px rgba(0,0,0,0.5)',
                  zIndex: 99999,
                  minWidth: '170px',
                  padding: '5px'
                }}
              >
                {LANGUAGES.map((lang) => {
                  const isCurLang = language === lang.code;
                  return (
                    <button
                      key={lang.code}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
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
                        background: isCurLang ? 'var(--bg-surface-alt, #f1f5f9)' : 'transparent',
                        color: isCurLang ? 'var(--primary-600, #16a34a)' : 'var(--text-main, #0f172a)',
                        fontWeight: isCurLang ? 800 : 600,
                        fontSize: '0.8rem',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'background 0.12s ease'
                      }}
                      className="hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                      <span className="flex items-center gap-2" style={{ color: isCurLang ? 'var(--primary-600, #16a34a)' : 'var(--text-main, #0f172a)' }}>
                        <span>{lang.flag}</span>
                        <span>{lang.native}</span>
                      </span>
                      {isCurLang && <CheckCircle2 size={14} color="var(--primary-600, #16a34a)" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Theme Selector Dropdown */}
          <div style={{ position: 'relative' }} ref={themeDropdownRef}>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setThemeDropdownOpen(prev => !prev);
                setLangDropdownOpen(false);
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.3rem',
                background: themeDropdownOpen ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.12)',
                border: '1px solid rgba(255,255,255,0.25)',
                color: '#ffffff',
                padding: '0.2rem 0.55rem',
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
              <ChevronDown size={10} style={{ transform: themeDropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
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
                  boxShadow: '0 16px 36px rgba(0,0,0,0.5)',
                  zIndex: 99999,
                  minWidth: '225px',
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
                      onClick={(e) => {
                        e.stopPropagation();
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
                        background: isCur ? 'var(--bg-surface-alt, rgba(255, 255, 255, 0.1))' : 'transparent',
                        color: isCur ? 'var(--primary-600, #16a34a)' : 'var(--text-main, #0f172a)',
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
                        <span style={{ color: isCur ? 'var(--primary-600, #16a34a)' : 'var(--text-main, #0f172a)' }}>
                          {thm.name}
                        </span>
                      </div>
                      {isCur && <Check size={14} color="var(--primary-600, #16a34a)" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Quick Day / Night Toggle Icon */}
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
            title={isDark ? 'Switch to Day Light Mode' : 'Switch to Dark Mode'}
          >
            {isDark ? <Sun size={14} color="#fef08a" /> : <Moon size={14} color="#86efac" />}
          </button>

          {/* Customer Helpline */}
          <a
            href="tel:6395211953"
            className="hidden sm:flex items-center gap-1.5"
            style={{
              color: '#fef08a',
              textDecoration: 'none',
              fontWeight: 700,
              fontSize: '0.72rem',
              background: 'rgba(255,255,255,0.1)',
              padding: '0.15rem 0.45rem',
              borderRadius: '6px',
              border: '1px solid rgba(254,240,138,0.25)',
              flexShrink: 0,
              whiteSpace: 'nowrap'
            }}
            title="Customer Helpline: +91 63952 11953"
          >
            <PhoneCall size={11} color="#f59e0b" />
            <span>63952 11953</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementStrip;
