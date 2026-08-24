import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Bell, LogOut, ExternalLink, ShieldCheck, MessageSquare, ArrowRight, CheckCheck, Clock, X } from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';
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
  const { subscribe } = useSync();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [unreadCount, setUnreadCount] = useState(0);
  const [recentQueries, setRecentQueries] = useState([]);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const dropdownRef = useRef(null);

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

  // Click outside listener for notification dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate(`${adminPanelPath}/login`);
  };

  return (
    <header className="admin-topbar">
      {/* Search Input in Topbar */}
      <div style={{ position: 'relative', width: '320px' }}>
        <input
          type="text"
          placeholder="Search products, orders, SKU, audits..."
          style={{
            width: '100%',
            background: 'rgba(0,0,0,0.3)',
            border: '1px solid var(--bg-dark-border)',
            borderRadius: '8px',
            padding: '0.45rem 0.85rem 0.45rem 2.2rem',
            color: '#ffffff',
            fontSize: '0.85rem',
            outline: 'none'
          }}
        />
        <Search size={15} color="#94a3b8" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }} />
      </div>

      {/* Topbar Actions */}
      <div className="flex items-center gap-4">
        {/* Live Storefront Link */}
        <Link
          to="/"
          target="_blank"
          style={{
            fontSize: '0.8rem',
            color: '#94a3b8',
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
            padding: '0.35rem 0.65rem',
            borderRadius: '6px',
            background: 'rgba(255,255,255,0.05)'
          }}
          className="hover:text-white"
        >
          <span>Live Storefront</span>
          <ExternalLink size={13} />
        </Link>

        {/* Live Support Notification Bell */}
        <div style={{ position: 'relative' }} ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            style={{
              position: 'relative',
              background: isNotifOpen ? '#166534' : 'rgba(255, 255, 255, 0.08)',
              border: unreadCount > 0 ? '1px solid #f59e0b' : '1px solid var(--bg-dark-border)',
              borderRadius: '8px',
              padding: '0.45rem 0.65rem',
              color: '#ffffff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.15s ease'
            }}
            title="Live Farmer Inquiries & Support Alerts"
          >
            <Bell size={17} color={unreadCount > 0 ? '#fef08a' : '#94a3b8'} />
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
                background: '#0f172a',
                border: '1px solid #334155',
                borderRadius: '14px',
                boxShadow: '0 16px 36px rgba(0,0,0,0.5)',
                zIndex: 1500,
                overflow: 'hidden'
              }}
            >
              {/* Header */}
              <div style={{ padding: '0.85rem 1.1rem', background: '#1e293b', borderBottom: '1px solid #334155', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div className="flex items-center gap-2">
                  <MessageSquare size={16} color="#34d399" />
                  <span style={{ fontSize: '0.875rem', fontWeight: 800, color: '#ffffff' }}>Live Farmer Inquiries</span>
                </div>
                <span className="badge" style={{ background: unreadCount > 0 ? '#dc2626' : '#15803d', color: '#ffffff', fontSize: '0.7rem', fontWeight: 700 }}>
                  {unreadCount} Unread
                </span>
              </div>

              {/* Inquiries List */}
              <div style={{ maxHeight: '340px', overflowY: 'auto' }}>
                {recentQueries.length === 0 ? (
                  <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b', fontSize: '0.8rem' }}>
                    No customer inquiries at this time.
                  </div>
                ) : (
                  recentQueries.map((q) => (
                    <div
                      key={q._id}
                      onClick={() => {
                        setIsNotifOpen(false);
                        navigate(`${adminPanelPath}/support`);
                      }}
                      style={{
                        padding: '0.75rem 1.1rem',
                        borderBottom: '1px solid rgba(255,255,255,0.06)',
                        cursor: 'pointer',
                        background: q.unreadByAdmin > 0 ? 'rgba(234, 179, 8, 0.08)' : 'transparent',
                        transition: 'background 0.15s ease'
                      }}
                      className="hover:bg-slate-800"
                    >
                      <div className="flex justify-between items-start" style={{ marginBottom: '0.2rem' }}>
                        <span style={{ fontSize: '0.825rem', fontWeight: 800, color: '#ffffff' }}>
                          {q.userName}
                        </span>
                        <span style={{ fontSize: '0.65rem', color: '#94a3b8' }}>
                          {new Date(q.lastMessageAt || q.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.775rem', color: '#86efac', fontWeight: 600, marginBottom: '0.2rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {q.subject}
                      </div>
                      <div style={{ fontSize: '0.7rem', color: '#94a3b8', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span>📞 {q.userPhone}</span>
                        {q.productTitle && <span style={{ color: '#fef08a' }}>🚜 {q.productTitle.slice(0, 20)}...</span>}
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
                  background: '#166534',
                  color: '#ffffff',
                  fontSize: '0.8rem',
                  fontWeight: 800,
                  textDecoration: 'none',
                  borderTop: '1px solid #22c55e'
                }}
                className="hover:bg-green-700"
              >
                <span>Open Full Support Desk</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          )}
        </div>

        {/* Security Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', color: '#34d399', background: 'rgba(16, 185, 129, 0.1)', padding: '0.35rem 0.65rem', borderRadius: '6px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
          <ShieldCheck size={14} />
          <span>RBAC Protected</span>
        </div>

        {/* User Info & Logout */}
        <div className="flex items-center gap-3" style={{ borderLeft: '1px solid var(--bg-dark-border)', paddingLeft: '1rem' }}>
          <div className="flex items-center gap-2">
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: '#166534',
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
              <div style={{ color: '#ffffff', fontWeight: 600 }}>{admin?.username || 'admin'}</div>
              <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>{admin?.email}</div>
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
          >
            <LogOut size={17} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default AdminTopBar;
