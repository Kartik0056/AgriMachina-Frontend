import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  Bell,
  LogOut,
  ExternalLink,
  ShieldCheck,
  MessageSquare,
  ArrowRight,
  CheckCheck,
  Clock,
  X,
  Sun,
  Moon,
  Trees,
  Palette,
  Check,
  ChevronDown
} from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { useTheme, ADMIN_THEMES } from '../../context/ThemeContext';
import { useSync } from '../../context/SyncContext';
import { useToast } from '../../context/ToastContext';
import adminApi from '../../services/adminApi';

// Synthesize pleasant double chime via Web Audio API
const playChime = () => {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();

    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(880, ctx.currentTime);
    gain1.gain.setValueAtTime(0.12, ctx.currentTime);
    gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start();
    osc1.stop(ctx.currentTime + 0.35);

    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(1174.66, ctx.currentTime + 0.12);
    gain2.gain.setValueAtTime(0.18, ctx.currentTime + 0.12);
    gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.55);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(ctx.currentTime + 0.12);
    osc2.stop(ctx.currentTime + 0.55);
  } catch (e) {}
};

const AdminTopBar = () => {
  const { admin, logout, adminPanelPath } = useAdminAuth();
  const { adminTheme, setAdminTheme, toggleAdminTheme } = useTheme();
  const { subscribe } = useSync();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [unreadCount, setUnreadCount] = useState(0);
  const [recentQueries, setRecentQueries] = useState([]);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isThemeOpen, setIsThemeOpen] = useState(false);
  const dropdownRef = useRef(null);
  const themeDropdownRef = useRef(null);

  const loadNotifications = async () => {
    try {
      const res = await adminApi.get('/support/admin/tickets', { params: { limit: 6 } });
      if (res.data.success) {
        setUnreadCount(res.data.stats?.unreadCount || 0);
        setRecentQueries(res.data.tickets || []);
      }
    } catch (e) {}
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  // Sync with same-window ticket read events
  useEffect(() => {
    const handleLocalRead = (e) => {
      const { ticketId, count } = e.detail || {};
      if (ticketId) {
        setRecentQueries(prev => prev.map(q => q._id === ticketId ? { ...q, unreadByAdmin: 0 } : q));
      }
      if (count !== undefined) {
        setUnreadCount(prev => Math.max(0, prev - count));
      } else {
        loadNotifications();
      }
    };
    const handleAllRead = () => {
      setUnreadCount(0);
      setRecentQueries(prev => prev.map(q => ({ ...q, unreadByAdmin: 0 })));
    };

    window.addEventListener('admin_ticket_read', handleLocalRead);
    window.addEventListener('admin_all_tickets_read', handleAllRead);
    return () => {
      window.removeEventListener('admin_ticket_read', handleLocalRead);
      window.removeEventListener('admin_all_tickets_read', handleAllRead);
    };
  }, []);

  // Listen to Live Real-Time Events for New Support Queries
  useEffect(() => {
    const unsubscribe = subscribe((event) => {
      if (event.type === 'NEW_SUPPORT_QUERY') {
        playChime();
        const payload = event.payload || {};
        const name = payload.userName || 'A farmer';
        const subj = payload.subject || 'Equipment inquiry';
        addToast(`🚨 New Live Inquiry from ${name}: "${subj}"`, 'info');
        loadNotifications();
      } else if (event.type === 'TICKET_UPDATED') {
        loadNotifications();
      }
    });
    return unsubscribe;
  }, [subscribe]);

  const handleMarkAllRead = async () => {
    try {
      const unreadTickets = recentQueries.filter(q => q.unreadByAdmin > 0);
      setUnreadCount(0);
      setRecentQueries(prev => prev.map(q => ({ ...q, unreadByAdmin: 0 })));
      window.dispatchEvent(new CustomEvent('admin_all_tickets_read'));
      await Promise.allSettled(unreadTickets.map(q => adminApi.put(`/support/admin/tickets/${q._id}/read`)));
    } catch (e) {}
  };

  // Click outside listener for notification & theme dropdowns
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsNotifOpen(false);
      }
      if (themeDropdownRef.current && !themeDropdownRef.current.contains(e.target)) {
        setIsThemeOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate(`${adminPanelPath}/login`);
  };

  const currentThemeObj = ADMIN_THEMES.find(t => t.id === adminTheme) || ADMIN_THEMES[0];

  return (
    <header className="admin-topbar">
      {/* Search Input in Topbar */}
      <div style={{ position: 'relative', width: '320px' }}>
        <input
          type="text"
          placeholder="Search products, orders, SKU, audits..."
          style={{
            width: '100%',
            backgroundColor: 'var(--admin-input-bg)',
            border: '1px solid var(--admin-input-border)',
            borderRadius: '8px',
            padding: '0.45rem 0.85rem 0.45rem 2.2rem',
            color: 'var(--admin-text-main)',
            fontSize: '0.85rem',
            outline: 'none'
          }}
        />
        <Search size={15} color="var(--admin-text-muted)" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }} />
      </div>

      {/* Topbar Actions */}
      <div className="flex items-center gap-3">
        {/* Live Storefront Link */}
        <Link
          to="/"
          target="_blank"
          style={{
            fontSize: '0.8rem',
            color: 'var(--admin-text-muted)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
            padding: '0.4rem 0.75rem',
            borderRadius: '8px',
            background: 'var(--admin-bg-card-alt, rgba(255,255,255,0.05))',
            border: '1px solid var(--admin-border, rgba(255,255,255,0.1))',
            textDecoration: 'none',
            fontWeight: 600
          }}
          className="hover:text-green-500"
          title="Open Public Storefront in New Tab"
        >
          <span>Live Store</span>
          <ExternalLink size={13} />
        </Link>

        {/* Admin Theme Selector Dropdown */}
        <div style={{ position: 'relative' }} ref={themeDropdownRef}>
          <button
            type="button"
            onClick={() => setIsThemeOpen(!isThemeOpen)}
            style={{
              background: isThemeOpen ? 'var(--admin-accent-glow, rgba(16,185,129,0.2))' : 'var(--admin-bg-card-alt, rgba(255, 255, 255, 0.05))',
              border: isThemeOpen ? '1px solid var(--admin-accent, #10b981)' : '1px solid var(--admin-border, rgba(255, 255, 255, 0.1))',
              borderRadius: '8px',
              padding: '0.4rem 0.75rem',
              color: 'var(--admin-text-main)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              fontSize: '0.8rem',
              fontWeight: 700,
              transition: 'all 0.15s ease'
            }}
            className="hover:scale-105"
            title="Change Admin Panel Theme"
          >
            {adminTheme === 'light' ? (
              <Sun size={15} color="#f59e0b" />
            ) : adminTheme === 'forest' ? (
              <Trees size={15} color="#34d399" />
            ) : adminTheme === 'amber' ? (
              <Palette size={15} color="#f59e0b" />
            ) : (
              <Moon size={15} color="#38bdf8" />
            )}
            <span style={{ fontSize: '0.775rem' }}>{currentThemeObj.name.split(' ')[0]}</span>
            <ChevronDown size={12} style={{ transform: isThemeOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease', opacity: 0.7 }} />
          </button>

          {/* Theme Dropdown Popover */}
          {isThemeOpen && (
            <div
              style={{
                position: 'absolute',
                top: 'calc(100% + 8px)',
                right: 0,
                width: '270px',
                background: 'var(--admin-bg-card)',
                border: '1px solid var(--admin-border, #334155)',
                borderRadius: '12px',
                boxShadow: '0 16px 36px rgba(0,0,0,0.45)',
                zIndex: 1500,
                overflow: 'hidden',
                padding: '0.5rem'
              }}
            >
              <div style={{ padding: '0.45rem 0.6rem 0.6rem 0.6rem', borderBottom: '1px solid var(--admin-border, #334155)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.725rem', fontWeight: 800, color: 'var(--admin-text-main)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  🎨 Admin Theme
                </span>
                <button
                  type="button"
                  onClick={toggleAdminTheme}
                  style={{
                    background: 'var(--admin-bg-card-alt, rgba(255,255,255,0.1))',
                    border: '1px solid var(--admin-border, rgba(255,255,255,0.15))',
                    borderRadius: '4px',
                    fontSize: '0.65rem',
                    padding: '0.2rem 0.45rem',
                    color: 'var(--admin-accent, #34d399)',
                    cursor: 'pointer',
                    fontWeight: 700
                  }}
                  title="Quick toggle Light / Dark"
                >
                  {adminTheme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode'}
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', marginTop: '0.45rem' }}>
                {ADMIN_THEMES.map((th) => {
                  const isSelected = adminTheme === th.id;
                  return (
                    <button
                      key={th.id}
                      type="button"
                      onClick={() => {
                        setAdminTheme(th.id);
                        setIsThemeOpen(false);
                        addToast(`Admin theme set to ${th.name}!`, 'success');
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.55rem 0.75rem',
                        borderRadius: '8px',
                        background: isSelected ? 'var(--admin-accent-glow, rgba(16,185,129,0.15))' : 'transparent',
                        border: isSelected ? '1px solid var(--admin-accent, #10b981)' : '1px solid transparent',
                        color: 'var(--admin-text-main)',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'all 0.15s ease'
                      }}
                      className="hover:bg-black/5 dark:hover:bg-white/5"
                    >
                      <div className="flex items-center gap-2.5">
                        <span style={{ fontSize: '1.1rem' }}>{th.icon}</span>
                        <div>
                          <div style={{ fontSize: '0.785rem', fontWeight: isSelected ? 800 : 600, color: 'var(--admin-text-main)' }}>
                            {th.name}
                          </div>
                        </div>
                      </div>
                      {isSelected && <Check size={15} color="var(--admin-accent, #10b981)" strokeWidth={3} />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Live Support Notification Bell */}
        <div style={{ position: 'relative' }} ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            style={{
              position: 'relative',
              background: isNotifOpen ? 'var(--admin-accent, #166534)' : 'var(--admin-bg-card-alt, rgba(255, 255, 255, 0.08))',
              border: unreadCount > 0 ? '1px solid #f59e0b' : '1px solid var(--admin-border, rgba(255, 255, 255, 0.1))',
              borderRadius: '8px',
              padding: '0.45rem 0.65rem',
              color: 'var(--admin-text-main)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.15s ease'
            }}
            title="Live Farmer Inquiries & Support Alerts"
          >
            <Bell size={17} color={unreadCount > 0 ? '#fef08a' : 'var(--admin-text-muted, #94a3b8)'} />
            {unreadCount > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '-4px',
                  right: '-4px',
                  background: '#dc2626',
                  color: '#ffffff',
                  fontSize: '0.65rem',
                  fontWeight: 900,
                  borderRadius: '50%',
                  width: '18px',
                  height: '18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 0 8px rgba(220, 38, 38, 0.8)',
                  animation: 'pulse 1.8s infinite'
                }}
              >
                {unreadCount}
              </span>
            )}
          </button>

          {/* Floating Dropdown Popover */}
          {isNotifOpen && (
            <div
              style={{
                position: 'absolute',
                top: 'calc(100% + 8px)',
                right: 0,
                width: '360px',
                background: 'var(--admin-bg-card)',
                border: '1px solid var(--admin-border, #334155)',
                borderRadius: '14px',
                boxShadow: '0 16px 36px rgba(0,0,0,0.5)',
                zIndex: 1500,
                overflow: 'hidden'
              }}
            >
              {/* Header */}
              <div style={{ padding: '0.75rem 1rem', background: 'var(--admin-bg-card-alt)', borderBottom: '1px solid var(--admin-border, #334155)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div className="flex items-center gap-2">
                  <MessageSquare size={15} color="var(--admin-accent, #34d399)" />
                  <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--admin-text-main)' }}>Live Farmer Inquiries</span>
                </div>
                <div className="flex items-center gap-2">
                  {unreadCount > 0 && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMarkAllRead();
                      }}
                      style={{
                        backgroundColor: 'var(--admin-input-bg)',
                        border: '1px solid var(--admin-border, rgba(255,255,255,0.15))',
                        borderRadius: '6px',
                        color: 'var(--admin-text-muted)',
                        fontSize: '0.65rem',
                        padding: '0.15rem 0.4rem',
                        cursor: 'pointer'
                      }}
                      className="hover:text-white hover:bg-white/15"
                      title="Mark all as read"
                    >
                      Mark all read
                    </button>
                  )}
                  <span className="badge" style={{ background: unreadCount > 0 ? '#dc2626' : 'var(--admin-accent, #15803d)', color: '#ffffff', fontSize: '0.68rem', fontWeight: 700 }}>
                    {unreadCount} Unread
                  </span>
                </div>
              </div>

              {/* Inquiries List */}
              <div style={{ maxHeight: '340px', overflowY: 'auto' }}>
                {recentQueries.length === 0 ? (
                  <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--admin-text-muted)', fontSize: '0.8rem' }}>
                    No customer inquiries at this time.
                  </div>
                ) : (
                  recentQueries.map((q) => (
                    <div
                      key={q._id}
                      onClick={async () => {
                        setIsNotifOpen(false);
                        const unread = q.unreadByAdmin || 0;
                        setRecentQueries(prev => prev.map(item => item._id === q._id ? { ...item, unreadByAdmin: 0 } : item));
                        if (unread > 0) {
                          setUnreadCount(prev => Math.max(0, prev - unread));
                        }
                        window.dispatchEvent(new CustomEvent('admin_ticket_read', { detail: { ticketId: q._id, count: unread } }));
                        try {
                          await adminApi.put(`/support/admin/tickets/${q._id}/read`);
                        } catch (e) {}
                        navigate(`${adminPanelPath}/support?ticket=${q._id}`, { state: { openTicketId: q._id } });
                      }}
                      style={{
                        padding: '0.75rem 1.1rem',
                        borderBottom: '1px solid var(--admin-border-subtle, rgba(255,255,255,0.06))',
                        cursor: 'pointer',
                        background: q.unreadByAdmin > 0 ? 'var(--admin-accent-glow, rgba(234, 179, 8, 0.08))' : 'transparent',
                        transition: 'background 0.15s ease'
                      }}
                      className="hover:bg-slate-800/40"
                    >
                      <div className="flex justify-between items-start" style={{ marginBottom: '0.2rem' }}>
                        <span style={{ fontSize: '0.825rem', fontWeight: 800, color: 'var(--admin-text-main)' }}>
                          {q.userName}
                        </span>
                        <span style={{ fontSize: '0.65rem', color: 'var(--admin-text-muted)' }}>
                          {new Date(q.lastMessageAt || q.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.775rem', color: 'var(--admin-accent, #86efac)', fontWeight: 600, marginBottom: '0.2rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {q.subject}
                      </div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--admin-text-muted)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span>📞 {q.userPhone}</span>
                        {q.productTitle && <span style={{ color: '#f59e0b' }}>🚜 {q.productTitle.slice(0, 20)}...</span>}
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* View All Footer Button */}
              <Link
                to={`${adminPanelPath}/support`}
                onClick={() => setIsNotifOpen(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.4rem',
                  padding: '0.75rem',
                  background: 'var(--admin-accent, #166534)',
                  color: '#ffffff',
                  fontSize: '0.8rem',
                  fontWeight: 800,
                  textDecoration: 'none',
                  borderTop: '1px solid var(--admin-border)'
                }}
                className="hover:opacity-90"
              >
                <span>Open Full Support Desk</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          )}
        </div>

        {/* Security Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.725rem', color: 'var(--admin-accent, #34d399)', background: 'var(--admin-accent-glow, rgba(16, 185, 129, 0.1))', padding: '0.35rem 0.65rem', borderRadius: '6px', border: '1px solid var(--admin-border)' }}>
          <ShieldCheck size={14} />
          <span>RBAC Protected</span>
        </div>

        {/* User Info & Logout */}
        <div className="flex items-center gap-3" style={{ borderLeft: '1px solid var(--admin-border)', paddingLeft: '1rem' }}>
          <div className="flex items-center gap-2">
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: 'var(--admin-accent, #166534)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '0.8rem'
            }}>
              {admin?.name?.charAt(0) || 'A'}
            </div>
            <div style={{ fontSize: '0.85rem' }}>
              <div style={{ color: 'var(--admin-text-main)', fontWeight: 600 }}>{admin?.username || 'admin'}</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--admin-text-muted)' }}>{admin?.email}</div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            title="Secure Admin Logout"
            style={{
              background: 'transparent',
              border: 'none',
              color: '#ef4444',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              padding: '0.4rem',
              borderRadius: '6px'
            }}
            className="hover:bg-red-500/10 active:scale-95"
          >
            <LogOut size={17} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default AdminTopBar;
