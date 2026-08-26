import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  MessageSquare,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertCircle,
  Phone,
  Mail,
  Tractor,
  Send,
  Camera,
  Video,
  Plus,
  RefreshCw,
  User,
  ShieldCheck,
  Play,
  ArrowLeft,
  Volume2,
  VolumeX,
  ExternalLink,
  Tag,
  Check,
  Sparkles,
  Zap,
  PhoneCall,
  MessageCircle,
  Eye,
  CheckCheck,
  Paperclip,
  UploadCloud,
  FileText,
  Download,
  Image as ImageIcon,
  Minimize2,
  Maximize2,
  Minus,
  X,
  ChevronUp,
  ChevronDown,
  ArrowUpRight
} from 'lucide-react';
import { useSearchParams, useLocation } from 'react-router-dom';
import adminApi from '../../services/adminApi';
import { useToast } from '../../context/ToastContext';
import { useSync } from '../../context/SyncContext';
import { getYouTubeEmbedUrl } from '../../services/videoHelper';

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
  } catch (e) { }
};

const decodeText = (str) => {
  if (!str) return '';
  return str
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ');
};

const quickCannedReplies = [
  'Namaste Kisan Bhai! Yeh machine cotton aur sugarcane kheti ke liye 100% suitable hai.',
  'Aapka DBT / SMAM Govt. Subsidy invoice generate kar diya gaya hai.',
  'Hamare certified agricultural engineer ne aapki field requirements note kar li hain.',
  'Machine 100% Free Palletized transport se 4-5 business days me deliver ho jayegi.',
  'Is model par SBI Kisan Credit aur HDFC par 0% No-Cost EMI uplabdh hai.',
  'Aapki suvidha ke liye humne working field demonstration video attach kar diya hai.'
];

const AdminSupportPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const openTicketParam = searchParams.get('ticket') || location.state?.openTicketId;

  const [tickets, setTickets] = useState([]);
  const [stats, setStats] = useState({ openCount: 0, inProgressCount: 0, unreadCount: 0 });
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Active Popup Chat Widget State (Gmail Compose Style)
  const [activeTicket, setActiveTicket] = useState(null);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);

  // Live incoming query banner notification
  const [liveBanner, setLiveBanner] = useState(null);

  // Reply Form State inside Chat Popup
  const [replyText, setReplyText] = useState('');
  const [photoInput, setPhotoInput] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [attachmentsList, setAttachmentsList] = useState([]);
  const [newStatus, setNewStatus] = useState('');
  const [markResolvedOnSend, setMarkResolvedOnSend] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState(false);
  const [sending, setSending] = useState(false);

  const { addToast } = useToast();
  const { subscribe } = useSync();

  const fileInputRef = useRef(null);
  const messagesScrollRef = useRef(null);
  const prevMessagesCountRef = useRef(0);
  const activeTicketIdRef = useRef(null);
  activeTicketIdRef.current = activeTicket?._id;

  const isMinimizedRef = useRef(isMinimized);
  isMinimizedRef.current = isMinimized;

  const scrollToBottomInner = () => {
    if (messagesScrollRef.current) {
      messagesScrollRef.current.scrollTop = messagesScrollRef.current.scrollHeight;
    }
  };

  const fetchTickets = useCallback(async (showLoading = false) => {
    if (showLoading) setLoading(true);
    try {
      const res = await adminApi.get('/support/admin/tickets', {
        params: { status: statusFilter, search }
      });
      if (res.data.success) {
        const fetched = res.data.tickets || [];
        setTickets(fetched);
        setStats(res.data.stats || { openCount: 0, inProgressCount: 0, unreadCount: 0 });

        // Update active ticket if currently open
        if (activeTicketIdRef.current) {
          const updated = fetched.find(t => t._id === activeTicketIdRef.current);
          if (updated) {
            setActiveTicket(prev => {
              if (!prev) return updated;
              const newLen = updated.messages?.length || 0;
              const oldLen = prev.messages?.length || 0;
              if (newLen !== oldLen || updated.status !== prev.status) {
                return updated;
              }
              return prev;
            });
          }
        }
      }
    } catch (error) {
      console.error('Failed to load support tickets:', error);
    } finally {
      if (showLoading) setLoading(false);
    }
  }, [statusFilter, search]);

  // Initial fetch and on filter/search change
  useEffect(() => {
    fetchTickets(true);
  }, [fetchTickets]);

  // Listen to external window events for all tickets marked read
  useEffect(() => {
    const handleAllRead = () => {
      setTickets(prev => prev.map(t => ({ ...t, unreadByAdmin: 0 })));
      setStats(prev => ({ ...prev, unreadCount: 0 }));
    };
    window.addEventListener('admin_all_tickets_read', handleAllRead);
    return () => window.removeEventListener('admin_all_tickets_read', handleAllRead);
  }, []);

  // Real-time SSE listener (handles instant live updates without continuous polling)
  useEffect(() => {
    const unsubscribe = subscribe((event) => {
      if (event.type === 'NEW_SUPPORT_QUERY') {
        const payload = event.payload || {};

        // If admin is currently looking at this active ticket, immediately mark as read
        if (activeTicketIdRef.current === payload.ticketId && !isMinimizedRef.current) {
          adminApi.put(`/support/admin/tickets/${payload.ticketId}/read`).catch(() => {});
        } else {
          if (soundEnabled) playChime();
          setLiveBanner({
            ticketId: payload.ticketId,
            userName: payload.userName || 'A farmer',
            subject: payload.subject || 'Equipment inquiry',
            phone: payload.userPhone || '',
            product: payload.productTitle || '',
            preview: payload.preview || 'Customer sent a new query message.',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          });
        }

        fetchTickets(false);
      } else if (event.type === 'TICKET_UPDATED') {
        const payload = event.payload || {};
        if (payload.type === 'ticket_read_by_admin') {
          setTickets(prev => prev.map(t => t._id === payload.ticketId ? { ...t, unreadByAdmin: 0 } : t));
        }
        if (activeTicketIdRef.current === payload.ticketId && !isMinimizedRef.current && payload.type === 'user_reply') {
          adminApi.put(`/support/admin/tickets/${payload.ticketId}/read`).catch(() => {});
        }
        fetchTickets(false);
      }
    });

    return unsubscribe;
  }, [subscribe, soundEnabled, fetchTickets]);

  // Open Chat Popup Window (Gmail Style) & Auto-Clear Unread Notification
  const handleOpenChatPopup = useCallback(async (ticket) => {
    try {
      setIsMinimized(false);
      prevMessagesCountRef.current = 0;
      activeTicketIdRef.current = ticket._id;
      const unreadAmount = ticket.unreadByAdmin || 0;

      // Mark as read locally immediately so the NEW badge and notification count vanishes on click
      setTickets(prev => prev.map(t => t._id === ticket._id ? { ...t, unreadByAdmin: 0 } : t));
      if (unreadAmount > 0) {
        setStats(prev => ({
          ...prev,
          unreadCount: Math.max(0, (prev.unreadCount || 0) - unreadAmount)
        }));
      }

      // Dispatch local event so AdminTopBar bell instantly updates
      window.dispatchEvent(new CustomEvent('admin_ticket_read', { detail: { ticketId: ticket._id, count: unreadAmount } }));

      // Fetch latest ticket details and persist read status in backend
      const res = await adminApi.get(`/support/admin/tickets/${ticket._id}`);
      if (res.data.success) {
        setActiveTicket(res.data.ticket);
        setNewStatus(res.data.ticket.status);
        setTimeout(scrollToBottomInner, 60);
      }
    } catch (error) {
      setActiveTicket(ticket);
    }
  }, []);

  // Auto-open ticket if specified in URL query param ?ticket=... or location.state
  useEffect(() => {
    if (openTicketParam && tickets.length > 0) {
      const found = tickets.find(t => t._id === openTicketParam || t.ticketNumber === openTicketParam);
      if (found) {
        handleOpenChatPopup(found);
        if (searchParams.has('ticket')) {
          setSearchParams(prev => {
            const next = new URLSearchParams(prev);
            next.delete('ticket');
            return next;
          }, { replace: true });
        }
      }
    }
  }, [openTicketParam, tickets, handleOpenChatPopup, searchParams, setSearchParams]);

  // Scroll popup message list when messages change
  useEffect(() => {
    if (!activeTicket?.messages) return;
    const count = activeTicket.messages.length;
    if (count > prevMessagesCountRef.current) {
      setTimeout(scrollToBottomInner, 50);
      prevMessagesCountRef.current = count;
    }
  }, [activeTicket?.messages]);

  const formatFileSize = (bytes) => {
    if (!bytes || bytes === 0) return '';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  // Direct File Upload from Admin Computer (Max 5MB per file)
  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Validate 5MB maximum file size per file
    const maxSizeBytes = 5 * 1024 * 1024;
    for (const f of files) {
      if (f.size > maxSizeBytes) {
        addToast(`File "${f.name}" (${(f.size / (1024 * 1024)).toFixed(1)} MB) exceeds the maximum allowed size of 5MB.`, 'error');
        if (e.target) e.target.value = '';
        return;
      }
    }

    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    });

    setUploadingFiles(true);
    try {
      let res;
      try {
        res = await adminApi.post('/support/admin/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } catch (err1) {
        res = await adminApi.post('/support/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }

      if (res.data.success && res.data.files) {
        setAttachmentsList(prev => [...prev, ...res.data.files]);
        addToast(`${files.length} document(s) / file(s) attached! (Max 5MB)`, 'success');
      }
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to upload files. Max allowed size is 5MB.', 'error');
    } finally {
      setUploadingFiles(false);
      if (e.target) e.target.value = '';
    }
  };

  const handleAddPhotoUrl = (e) => {
    e?.preventDefault();
    if (!photoInput.trim()) return;
    setAttachmentsList(prev => [
      ...prev,
      { url: photoInput.trim(), name: 'Web Image Link', size: 0, fileType: 'image' }
    ]);
    setPhotoInput('');
  };

  const handleRemoveAttachment = (idx) => {
    setAttachmentsList(prev => prev.filter((_, i) => i !== idx));
  };

  const handleSendReply = async (e) => {
    e?.preventDefault();
    if ((!replyText || !replyText.trim()) && attachmentsList.length === 0 && !videoUrl) {
      addToast('Please enter a reply message or attach files/media.', 'warning');
      return;
    }

    setSending(true);
    try {
      const statusToSend = markResolvedOnSend ? 'Resolved' : (newStatus || activeTicket.status);
      const images = attachmentsList.filter(a => a.fileType === 'image').map(a => a.url);

      const res = await adminApi.post(`/support/admin/tickets/${activeTicket._id}/reply`, {
        text: replyText.trim(),
        images,
        attachments: attachmentsList,
        videoUrl: videoUrl.trim(),
        status: statusToSend
      });

      if (res.data.success) {
        addToast('Reply dispatched to customer successfully!', 'success');
        setActiveTicket(res.data.ticket);
        setReplyText('');
        setAttachmentsList([]);
        setVideoUrl('');
        setMarkResolvedOnSend(false);
        setTimeout(scrollToBottomInner, 50);
        fetchTickets(false);
      }
    } catch (error) {
      addToast(error.response?.data?.message || 'Failed to send reply.', 'error');
    } finally {
      setSending(false);
    }
  };

  const handleStatusChange = async (status) => {
    setNewStatus(status);
    try {
      await adminApi.put(`/support/admin/tickets/${activeTicket._id}/status`, { status });
      addToast(`Inquiry status updated to ${status}`, 'success');
      setActiveTicket(prev => ({ ...prev, status }));
      fetchTickets(false);
    } catch (error) {
      addToast('Failed to update status.', 'error');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', minHeight: 'calc(100vh - 120px)', color: '#f8fafc' }}>
      {/* Live Incoming Inquiry Notification Banner */}
      {liveBanner && (
        <div
          style={{
            background: 'linear-gradient(135deg, #064e3b, #022c22)',
            border: '1.5px solid #34d399',
            borderRadius: '16px',
            padding: '1.15rem 1.75rem',
            color: '#ffffff',
            boxShadow: '0 16px 36px rgba(0, 0, 0, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem'
          }}
        >
          <div className="flex items-center gap-3.5">
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                background: '#059669',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 16px rgba(52, 211, 153, 0.6)'
              }}
            >
              <Zap size={24} color="#fef08a" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <span style={{ fontSize: '1.05rem', fontWeight: 900, color: '#ffffff' }}>
                  🚨 New Live Inquiry: {liveBanner.userName} ({liveBanner.phone})
                </span>
                <span className="badge" style={{ background: '#f59e0b', color: '#000000', fontWeight: 800, fontSize: '0.7rem' }}>
                  {liveBanner.time}
                </span>
              </div>
              <div style={{ fontSize: '0.875rem', color: '#a7f3d0', marginTop: '0.2rem' }}>
                <strong>Subject:</strong> {liveBanner.subject} {liveBanner.product ? `• 🚜 ${liveBanner.product}` : ''}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => {
                handleOpenChatPopup({ _id: liveBanner.ticketId });
                setLiveBanner(null);
              }}
              className="btn btn-accent btn-sm"
              style={{ background: '#f59e0b', color: '#000000', fontWeight: 800, padding: '0.55rem 1.25rem' }}
            >
              <MessageSquare size={15} />
              <span>Open Chat Pop-up</span>
            </button>
            <button
              type="button"
              onClick={() => setLiveBanner(null)}
              className="btn btn-secondary btn-sm"
              style={{ background: 'rgba(255,255,255,0.12)', color: '#ffffff', border: '1px solid rgba(255,255,255,0.2)' }}
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Top Header */}
      <div className="flex justify-between items-center" style={{ flexWrap: 'wrap', gap: '1.25rem', marginBottom: '2rem' }}>
        <div>
          <div className="flex items-center gap-3">
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 10px #22c55e' }} />
            <h1 style={{ fontSize: '1.85rem', fontWeight: 900, color: 'var(--admin-text-main)', letterSpacing: '-0.02em', margin: 0 }}>
              Farmer Advisory & Machinery Inquiries Desk
            </h1>
            <span className="badge" style={{ background: '#064e3b', color: '#6ee7b7', border: '1px solid #059669', fontWeight: 800, fontSize: '0.75rem', padding: '0.25rem 0.65rem' }}>
              ● LIVE STREAM ACTIVE
            </span>
          </div>
          <p style={{ fontSize: '0.9rem', color: 'var(--admin-text-muted)', marginTop: '0.4rem' }}>
            Omnichannel agricultural advisory CRM. Click any inquiry to launch an interactive floating resolution chat popup.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Sound Toggle */}
          <button
            type="button"
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="btn btn-secondary btn-sm"
            style={{
              background: soundEnabled ? 'var(--admin-accent, #064e3b)' : 'var(--admin-bg-card, #1e293b)',
              borderColor: soundEnabled ? 'var(--admin-accent, #059669)' : 'var(--admin-border, #334155)',
              color: soundEnabled ? '#ffffff' : 'var(--admin-text-muted, #94a3b8)',
              fontWeight: 700,
              padding: '0.5rem 0.9rem'
            }}
          >
            {soundEnabled ? <Volume2 size={15} color="#ffffff" /> : <VolumeX size={15} color="var(--admin-text-muted, #94a3b8)" />}
            <span>Sound {soundEnabled ? 'ON' : 'OFF'}</span>
          </button>

          {/* Sync Button */}
          <button
            type="button"
            onClick={() => fetchTickets(true)}
            className="btn btn-secondary btn-sm"
            style={{
              background: 'var(--admin-bg-card)',
              color: 'var(--admin-text-main)',
              borderColor: 'var(--admin-border)',
              fontWeight: 700,
              padding: '0.5rem 0.9rem'
            }}
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            <span>Sync Inbox</span>
          </button>
        </div>
      </div>

      {/* KPI Metrics Dashboard Cards with Generous Margins & 1.5rem Gaps */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem', marginTop: '1.5rem' }}>
        <div style={{ background: 'var(--admin-bg-card)', border: '1px solid var(--admin-border, rgba(255,255,255,0.1))', borderRadius: '16px', padding: '1.5rem 1.65rem', boxShadow: '0 8px 24px rgba(0,0,0,0.1)' }}>
          <div className="flex justify-between items-center">
            <span style={{ fontSize: '0.775rem', color: 'var(--admin-text-muted)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Total Inquiries</span>
            <MessageSquare size={18} color="var(--admin-accent, #38bdf8)" />
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 900, color: 'var(--admin-text-main)', marginTop: '0.5rem' }}>
            {tickets.length}
          </div>
          <div style={{ fontSize: '0.775rem', color: 'var(--admin-text-muted)', marginTop: '0.25rem' }}>All historical records</div>
        </div>

        <div style={{ background: 'var(--admin-bg-card)', border: '1px solid #d97706', borderRadius: '16px', padding: '1.5rem 1.65rem', boxShadow: '0 8px 24px rgba(217, 119, 6, 0.15)' }}>
          <div className="flex justify-between items-center">
            <span style={{ fontSize: '0.775rem', color: '#fbbf24', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Open / Needs Reply</span>
            <Clock size={18} color="#fbbf24" />
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#fbbf24', marginTop: '0.5rem' }}>
            {stats.openCount}
          </div>
          <div style={{ fontSize: '0.775rem', color: '#f59e0b', marginTop: '0.25rem' }}>Awaiting initial advisory</div>
        </div>

        <div style={{ background: 'var(--admin-bg-card)', border: '1px solid #059669', borderRadius: '16px', padding: '1.5rem 1.65rem', boxShadow: '0 8px 24px rgba(5, 150, 105, 0.15)' }}>
          <div className="flex justify-between items-center">
            <span style={{ fontSize: '0.775rem', color: '#34d399', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em' }}>In Resolution</span>
            <Tractor size={18} color="#34d399" />
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#34d399', marginTop: '0.5rem' }}>
            {stats.inProgressCount}
          </div>
          <div style={{ fontSize: '0.775rem', color: '#10b981', marginTop: '0.25rem' }}>Agronomist discussing</div>
        </div>

        <div style={{ background: 'var(--admin-bg-card)', border: stats.unreadCount > 0 ? '1.5px solid #ef4444' : '1px solid var(--admin-border, rgba(255,255,255,0.1))', borderRadius: '16px', padding: '1.5rem 1.65rem', boxShadow: '0 8px 24px rgba(0,0,0,0.1)' }}>
          <div className="flex justify-between items-center">
            <span style={{ fontSize: '0.775rem', color: stats.unreadCount > 0 ? '#fca5a5' : 'var(--admin-text-muted, #94a3b8)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Unread Farmer Messages</span>
            <AlertCircle size={18} color={stats.unreadCount > 0 ? '#ef4444' : 'var(--admin-text-muted, #64748b)'} />
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 900, color: stats.unreadCount > 0 ? '#ef4444' : 'var(--admin-text-main, #ffffff)', marginTop: '0.5rem' }}>
            {stats.unreadCount}
          </div>
          <div style={{ fontSize: '0.775rem', color: stats.unreadCount > 0 ? '#f87171' : 'var(--admin-text-muted, #64748b)', marginTop: '0.25rem' }}>
            {stats.unreadCount > 0 ? '⚡ Priority reply requested' : 'All caught up'}
          </div>
        </div>
      </div>

      {/* Inquiries Management Workspace (Full-Width Card Directory) */}
      <div
        style={{
          background: 'var(--admin-bg-card)',
          border: '1px solid var(--admin-border, rgba(255,255,255,0.1))',
          borderRadius: '20px',
          padding: '1.85rem',
          boxShadow: '0 12px 36px rgba(0,0,0,0.08)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.75rem',
          marginBottom: '3rem'
        }}
      >
        {/* Controls Bar */}
        <div className="flex justify-between items-center flex-wrap gap-3">
          {/* Search Box */}
          <div style={{ position: 'relative', flex: 1, minWidth: '280px', maxWidth: '480px' }}>
            <input
              type="text"
              placeholder="Search farmer name, phone, ticket #, SKU..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: '100%',
                fontSize: '0.875rem',
                padding: '0.65rem 1rem 0.65rem 2.5rem',
                backgroundColor: 'var(--admin-input-bg)',
                border: '1px solid var(--admin-input-border, rgba(255,255,255,0.15))',
                borderRadius: '12px',
                color: 'var(--admin-text-main)',
                outline: 'none'
              }}
            />
            <Search size={16} color="var(--admin-text-muted, #94a3b8)" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
          </div>

          {/* Status Filter Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto">
            {['All', 'Open', 'In Progress', 'Resolved', 'Closed'].map((s) => {
              const count = s === 'All' ? tickets.length : s === 'Open' ? stats.openCount : s === 'In Progress' ? stats.inProgressCount : 0;
              const isSelected = statusFilter === s;
              return (
                <button
                  key={s}
                  type="button"
                  onClick={() => setStatusFilter(s)}
                  style={{
                    padding: '0.5rem 0.95rem',
                    borderRadius: '10px',
                    fontSize: '0.8rem',
                    fontWeight: isSelected ? 800 : 600,
                    background: isSelected ? 'var(--admin-accent, #166534)' : 'var(--admin-bg-card-alt, rgba(30, 41, 59, 0.6))',
                    color: isSelected ? '#ffffff' : 'var(--admin-text-main, #cbd5e1)',
                    border: isSelected ? '1px solid var(--admin-accent, #22c55e)' : '1px solid var(--admin-border, rgba(255,255,255,0.1))',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <span>{s}</span>
                  {count > 0 && (
                    <span style={{
                      fontSize: '0.7rem',
                      background: isSelected ? '#22c55e' : 'rgba(255,255,255,0.15)',
                      color: isSelected ? '#000000' : '#ffffff',
                      padding: '0.1rem 0.4rem',
                      borderRadius: '999px',
                      fontWeight: 800
                    }}>
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Inquiries Cards Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem', marginTop: '0.5rem' }}>
          {loading ? (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem 1rem', color: 'var(--admin-text-muted)' }}>
              <RefreshCw size={28} className="animate-spin" style={{ margin: '0 auto 0.75rem auto', color: 'var(--admin-accent, #22c55e)' }} />
              <div style={{ fontSize: '1rem', fontWeight: 600 }}>Loading farmer inquiry records...</div>
            </div>
          ) : tickets.length === 0 ? (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem 1rem', color: 'var(--admin-text-muted)', backgroundColor: 'var(--admin-input-bg)', borderRadius: '16px', border: '1px solid var(--admin-border)' }}>
              <MessageSquare size={42} color="var(--admin-text-muted, rgba(255,255,255,0.2))" style={{ margin: '0 auto 1rem auto' }} />
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--admin-text-main)' }}>No Inquiries Found</div>
              <p style={{ fontSize: '0.85rem', color: 'var(--admin-text-muted)', marginTop: '0.35rem' }}>Try clearing your search keyword or switching status filter tabs.</p>
            </div>
          ) : (
            tickets.map((t) => {
              const lastMsg = t.messages && t.messages.length > 0 ? t.messages[t.messages.length - 1] : null;

              return (
                <div
                  key={t._id}
                  style={{
                    background: 'var(--admin-bg-card-alt)',
                    border: t.unreadByAdmin > 0 ? '1.5px solid #f59e0b' : '1px solid var(--admin-border, rgba(255,255,255,0.1))',
                    borderRadius: '16px',
                    padding: '1.25rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
                    transition: 'all 0.2s ease',
                    position: 'relative'
                  }}
                  className="hover:border-green-500 hover:shadow-lg"
                >
                  {/* Floating Notification Badge at Top Right Corner */}
                  {t.unreadByAdmin > 0 && (
                    <div
                      className="animate-notif-badge"
                      style={{
                        position: 'absolute',
                        top: '-8px',
                        right: '-8px',
                        background: 'linear-gradient(135deg, #ef4444, #b91c1c)',
                        color: '#ffffff',
                        fontWeight: 900,
                        fontSize: '0.7rem',
                        padding: '0.2rem 0.6rem',
                        borderRadius: '999px',
                        boxShadow: '0 0 12px rgba(239, 68, 68, 0.9), 0 2px 6px rgba(0,0,0,0.5)',
                        border: '2px solid var(--admin-bg-card, #0f172a)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        zIndex: 10
                      }}
                    >
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#ffffff', display: 'inline-block' }} />
                      <span>{t.unreadByAdmin} NEW</span>
                    </div>
                  )}

                  {/* Top Row: User Avatar, Name, Status Badge */}
                  <div>
                    <div className="flex justify-between items-start" style={{ marginBottom: '0.5rem' }}>
                      <div className="flex items-center gap-2.5">
                        <div
                          style={{
                            width: '38px',
                            height: '38px',
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #166534, #059669)',
                            color: '#ffffff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.95rem',
                            fontWeight: 900,
                            boxShadow: '0 2px 8px rgba(22, 101, 52, 0.4)'
                          }}
                        >
                          {t.userName?.charAt(0) || 'K'}
                        </div>
                        <div>
                          <div style={{ fontWeight: 900, color: 'var(--admin-text-main)', fontSize: '0.975rem' }}>
                            {t.userName}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)' }}>
                            #{t.ticketNumber || t._id.slice(-6).toUpperCase()} • {t.userPhone}
                          </div>
                        </div>
                      </div>

                      <div>
                        <span
                          className={t.status === 'In Progress' ? 'animate-in-progress-badge' : ''}
                          style={{
                            fontSize: '0.725rem',
                            fontWeight: 800,
                            padding: '0.22rem 0.6rem',
                            borderRadius: '8px',
                            background: t.status === 'Open' ? 'rgba(239, 68, 68, 0.2)' : t.status === 'In Progress' ? 'rgba(2, 132, 199, 0.2)' : 'rgba(34, 197, 94, 0.2)',
                            color: t.status === 'Open' ? '#fca5a5' : t.status === 'In Progress' ? '#7dd3fc' : '#86efac',
                            border: t.status === 'Open' ? '1px solid #ef4444' : t.status === 'In Progress' ? '1px solid #0284c7' : '1px solid #22c55e',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.35rem'
                          }}
                        >
                          {t.status === 'In Progress' && (
                            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#38bdf8', display: 'inline-block' }} />
                          )}
                          <span>{t.status}</span>
                        </span>
                      </div>
                    </div>

                    {/* Subject Line */}
                    <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#86efac', margin: '0.4rem 0 0.35rem 0' }}>
                      {decodeText(t.subject)}
                    </div>

                    {/* Machinery tag if present */}
                    {t.productTitle && (
                      <div style={{ fontSize: '0.75rem', color: '#38bdf8', background: 'rgba(56, 189, 248, 0.12)', border: '1px solid rgba(56, 189, 248, 0.25)', borderRadius: '6px', padding: '0.2rem 0.55rem', marginBottom: '0.6rem', display: 'inline-block', maxWidth: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        🚜 {decodeText(t.productTitle)} {t.productSku ? `(SKU: ${t.productSku})` : ''}
                      </div>
                    )}

                    {/* Last message preview */}
                    {lastMsg && (
                      <div style={{ fontSize: '0.8rem', color: '#cbd5e1', background: 'rgba(0,0,0,0.25)', padding: '0.5rem 0.75rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)', marginBottom: '0.75rem', lineHeight: 1.4 }}>
                        <strong style={{ color: lastMsg.sender === 'admin' ? '#86efac' : '#fbbf24' }}>
                          {lastMsg.sender === 'admin' ? 'You: ' : `${decodeText(t.userName)}: `}
                        </strong>
                        <span>{lastMsg.text || (lastMsg.attachments?.length > 0 ? '📎 File Attachment' : lastMsg.images?.length > 0 ? '📷 Attached Image' : '🎥 Video Link')}</span>
                      </div>
                    )}
                  </div>

                  {/* Actions Bar */}
                  <div className="flex justify-between items-center" style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '0.75rem', marginTop: '0.35rem' }}>
                    <div className="flex items-center gap-2">
                      <a
                        href={`tel:${t.userPhone}`}
                        style={{
                          color: '#86efac',
                          fontSize: '0.75rem',
                          fontWeight: 800,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.25rem',
                          textDecoration: 'none',
                          background: 'rgba(34, 197, 94, 0.12)',
                          padding: '0.2rem 0.55rem',
                          borderRadius: '6px',
                          border: '1px solid rgba(34, 197, 94, 0.25)',
                          transition: 'all 0.15s ease'
                        }}
                        className="hover:scale-105 hover:bg-green-700/30 hover:border-green-400"
                        title="Call Farmer"
                      >
                        <PhoneCall size={12} color="#86efac" />
                        <span>Call</span>
                      </a>
                      <a
                        href={`https://wa.me/${t.userPhone?.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Namaste ${t.userName} ji! 🙏 AgriMachina Support Desk se hum aapki inquiry (${t.subject}) ke sambandh me sampark kar rahe hain.`)}`}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          color: '#34d399',
                          fontSize: '0.75rem',
                          fontWeight: 800,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.25rem',
                          textDecoration: 'none',
                          background: 'rgba(52, 211, 153, 0.12)',
                          padding: '0.2rem 0.55rem',
                          borderRadius: '6px',
                          border: '1px solid rgba(52, 211, 153, 0.25)',
                          transition: 'all 0.15s ease'
                        }}
                        className="hover:scale-105 hover:bg-emerald-700/30 hover:border-emerald-400"
                        title="WhatsApp Farmer"
                      >
                        <MessageCircle size={12} color="#34d399" />
                        <span>WhatsApp</span>
                      </a>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleOpenChatPopup(t)}
                      style={{
                        background: 'linear-gradient(135deg, #16a34a, #15803d)',
                        border: '1px solid #22c55e',
                        color: '#ffffff',
                        fontWeight: 800,
                        fontSize: '0.775rem',
                        padding: '0.35rem 0.85rem',
                        borderRadius: '8px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        cursor: 'pointer',
                        boxShadow: '0 2px 8px rgba(34, 197, 94, 0.3)',
                        transition: 'all 0.2s ease'
                      }}
                      className="hover:scale-105 hover:shadow-[0_0_12px_rgba(34,197,94,0.5)] active:scale-95"
                    >
                      <MessageSquare size={13} />
                      <span>Open Chat</span>
                      <ArrowUpRight size={13} />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* FLOATING DOCKED CHAT POP-UP WIDGET (Gmail Compose Style at Bottom Right) */}
      {/* ========================================================================= */}
      {activeTicket && (
        <div
          className="floating-chat-popup-widget custom-chat-scrollbar"
          style={{
            position: 'fixed',
            bottom: isMinimized ? '0' : isMaximized ? '0' : '20px',
            right: isMinimized ? '20px' : isMaximized ? '0' : '25px',
            left: isMaximized ? '0' : 'auto',
            top: isMaximized ? '0' : 'auto',
            width: isMaximized ? '100vw' : isMinimized ? '340px' : '460px',
            height: isMaximized ? '100vh' : isMinimized ? '46px' : '590px',
            maxHeight: isMaximized ? '100vh' : '88vh',
            maxWidth: isMaximized ? '100vw' : 'calc(100vw - 32px)',
            background: '#090e1a',
            border: isMaximized ? 'none' : '1px solid rgba(34, 197, 94, 0.45)',
            borderRadius: isMaximized ? '0px' : isMinimized ? '12px 12px 0 0' : '16px',
            boxShadow: '0 24px 60px rgba(0, 0, 0, 0.85), 0 0 25px rgba(34, 197, 94, 0.18)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            zIndex: 999999,
            transition: 'all 0.22s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        >
          {/* Pop-up Top Header (Always Visible) */}
          <div
            style={{
              padding: '0.65rem 1rem',
              background: 'linear-gradient(135deg, #092617, #063820)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: isMinimized ? 'pointer' : 'default',
              userSelect: 'none',
              borderBottom: isMinimized ? 'none' : '1px solid rgba(255,255,255,0.1)'
            }}
            onClick={isMinimized ? () => setIsMinimized(false) : undefined}
          >
            <div className="flex items-center gap-2.5" style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 900,
                  fontSize: '0.85rem',
                  flexShrink: 0,
                  boxShadow: '0 2px 8px rgba(34, 197, 94, 0.4)'
                }}
              >
                {activeTicket.userName?.charAt(0) || 'K'}
              </div>
              <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                <div style={{ fontWeight: 800, fontSize: '0.875rem', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{decodeText(activeTicket.userName)}</span>
                  <span style={{ fontSize: '0.75rem', color: '#86efac', fontWeight: 600 }}>({activeTicket.userPhone})</span>
                </div>
                {!isMinimized && (
                  <div style={{ fontSize: '0.7rem', color: '#94a3b8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    #{activeTicket.ticketNumber || activeTicket._id.slice(-6).toUpperCase()} • {decodeText(activeTicket.subject)}
                  </div>
                )}
              </div>
            </div>

            {/* Window Controls Dock (Compact, Refined, Spaced Glowing Buttons) */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                marginLeft: '0.75rem',
                padding: '0.15rem 0.35rem',
                background: 'rgba(0, 0, 0, 0.45)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '8px',
                backdropFilter: 'blur(8px)',
                boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.5)',
                flexShrink: 0
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Minimize Button */}
              <button
                type="button"
                onClick={() => setIsMinimized(!isMinimized)}
                style={{
                  background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.25), rgba(180, 83, 9, 0.4))',
                  border: '1px solid rgba(245, 158, 11, 0.6)',
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
                    background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.25), rgba(2, 132, 199, 0.4))',
                    border: '1px solid rgba(56, 189, 248, 0.6)',
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
                onClick={() => setActiveTicket(null)}
                style={{
                  background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.35), rgba(185, 28, 28, 0.5))',
                  border: '1px solid rgba(239, 68, 68, 0.7)',
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
                title="Close Chat Pop-up"
              >
                <X size={11} strokeWidth={2.8} />
              </button>
            </div>
          </div>

          {/* Pop-up Body (Hidden when minimized) */}
          {!isMinimized && (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: 'calc(100% - 44px)', overflow: 'hidden', background: '#090e1a' }}>
              {/* Context Bar: Machinery SKU + Status Selector + Call/WhatsApp Shortcuts */}
              <div
                style={{
                  padding: '0.45rem 0.85rem',
                  background: '#0b1120',
                  borderBottom: '1px solid rgba(255,255,255,0.08)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '0.65rem',
                  fontSize: '0.75rem',
                  flexWrap: 'wrap'
                }}
              >
                <div className="flex items-center gap-2">
                  <a
                    href={`tel:${activeTicket.userPhone}`}
                    style={{
                      color: '#86efac',
                      fontWeight: 800,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.3rem',
                      textDecoration: 'none',
                      background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.2), rgba(22, 101, 52, 0.35))',
                      padding: '0.25rem 0.6rem',
                      borderRadius: '8px',
                      border: '1px solid rgba(34, 197, 94, 0.45)',
                      fontSize: '0.725rem',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.25)',
                      transition: 'all 0.15s ease'
                    }}
                    className="hover:scale-105 hover:border-green-400 hover:shadow-[0_0_10px_rgba(34,197,94,0.4)]"
                  >
                    <PhoneCall size={12} color="#86efac" />
                    <span>Call</span>
                  </a>
                  <a
                    href={`https://wa.me/${activeTicket.userPhone?.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Namaste ${activeTicket.userName} ji! 🙏 AgriMachina Support Desk.`)}`}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      color: '#34d399',
                      fontWeight: 800,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.3rem',
                      textDecoration: 'none',
                      background: 'linear-gradient(135deg, rgba(52, 211, 153, 0.2), rgba(5, 150, 105, 0.35))',
                      padding: '0.25rem 0.6rem',
                      borderRadius: '8px',
                      border: '1px solid rgba(52, 211, 153, 0.45)',
                      fontSize: '0.725rem',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.25)',
                      transition: 'all 0.15s ease'
                    }}
                    className="hover:scale-105 hover:border-emerald-400 hover:shadow-[0_0_10px_rgba(52,211,153,0.4)]"
                  >
                    <MessageCircle size={12} color="#34d399" />
                    <span>WhatsApp</span>
                  </a>

                  {activeTicket.productTitle && (
                    <span style={{ color: '#38bdf8', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '170px', fontSize: '0.725rem', background: 'rgba(56, 189, 248, 0.1)', padding: '0.2rem 0.5rem', borderRadius: '6px', border: '1px solid rgba(56, 189, 248, 0.2)' }}>
                      🚜 {decodeText(activeTicket.productTitle)}
                    </span>
                  )}
                </div>

                {/* Compact Status Switcher Pill */}
                <div className="flex items-center gap-1.5">
                  <span style={{ color: '#94a3b8', fontSize: '0.7rem', fontWeight: 700 }}>Status:</span>
                  <select
                    value={activeTicket.status}
                    onChange={(e) => handleStatusChange(e.target.value)}
                    style={{
                      fontSize: '0.725rem',
                      fontWeight: 800,
                      padding: '0.25rem 0.6rem',
                      borderRadius: '8px',
                      background: activeTicket.status === 'Open'
                        ? 'linear-gradient(135deg, #7f1d1d, #991b1b)'
                        : activeTicket.status === 'In Progress'
                        ? 'linear-gradient(135deg, #0369a1, #0284c7)'
                        : 'linear-gradient(135deg, #15803d, #16a34a)',
                      color: '#ffffff',
                      border: '1px solid rgba(255,255,255,0.3)',
                      outline: 'none',
                      cursor: 'pointer',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
                      transition: 'all 0.15s ease'
                    }}
                    className="hover:border-white/60 hover:scale-105"
                  >
                    <option value="Open">🔴 Open</option>
                    <option value="In Progress">🔵 In Progress</option>
                    <option value="Resolved">🟢 Resolved</option>
                    <option value="Closed">⚪ Closed</option>
                  </select>
                </div>
              </div>

              {/* Messages Thread Stream */}
              <div
                ref={messagesScrollRef}
                className="custom-chat-scrollbar"
                style={{
                  flex: 1,
                  padding: '1rem 1rem',
                  overflowY: 'auto',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.85rem',
                  background: '#090e1a'
                }}
              >
                {activeTicket.messages?.map((msg, idx) => {
                  const isAdmin = msg.sender === 'admin';
                  const embedUrl = msg.videoUrl ? getYouTubeEmbedUrl(msg.videoUrl) : null;
                  const allAttachments = msg.attachments || [];

                  return (
                    <div
                      key={idx}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: isAdmin ? 'flex-end' : 'flex-start',
                        maxWidth: '85%',
                        alignSelf: isAdmin ? 'flex-end' : 'flex-start',
                        marginBottom: '0.25rem'
                      }}
                    >
                      <div style={{ fontSize: '0.68rem', color: '#64748b', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <strong style={{ color: isAdmin ? '#86efac' : '#38bdf8', fontWeight: 700 }}>
                          {isAdmin ? 'AgriMachina Specialist (You)' : msg.senderName || activeTicket.userName}
                        </strong>
                        <span>•</span>
                        <span>{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>

                      <div
                        style={{
                          background: isAdmin ? 'linear-gradient(135deg, #15803d, #14532d)' : '#1e293b',
                          color: '#ffffff',
                          border: isAdmin ? '1px solid #22c55e' : '1px solid rgba(255,255,255,0.08)',
                          borderRadius: isAdmin ? '14px 14px 2px 14px' : '14px 14px 14px 2px',
                          padding: '0.65rem 0.95rem',
                          fontSize: '0.825rem',
                          lineHeight: 1.45,
                          boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
                          whiteSpace: 'pre-wrap',
                          wordBreak: 'break-word'
                        }}
                      >
                        {msg.text}

                        {/* Images */}
                        {((msg.images && msg.images.length > 0) || allAttachments.some(a => a.fileType === 'image')) && (
                          <div className="flex flex-wrap gap-2" style={{ marginTop: '0.5rem' }}>
                            {msg.images?.map((imgUrl, imgIdx) => (
                              <a key={`pop-img-${imgIdx}`} href={imgUrl} target="_blank" rel="noreferrer">
                                <img
                                  src={imgUrl}
                                  alt="Attachment"
                                  style={{ width: '95px', height: '70px', objectFit: 'cover', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.2)' }}
                                />
                              </a>
                            ))}
                            {allAttachments.filter(a => a.fileType === 'image').map((att, imgIdx) => (
                              <a key={`pop-att-${imgIdx}`} href={att.url} target="_blank" rel="noreferrer">
                                <img
                                  src={att.url}
                                  alt={att.name || 'Attachment'}
                                  style={{ width: '95px', height: '70px', objectFit: 'cover', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.2)' }}
                                />
                              </a>
                            ))}
                          </div>
                        )}

                        {/* Document & PDF Attachments */}
                        {allAttachments.filter(a => a.fileType === 'document').map((att, i) => (
                          <a
                            key={`pop-doc-${i}`}
                            href={att.url}
                            target="_blank"
                            rel="noreferrer"
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.4rem',
                              marginTop: '0.45rem',
                              padding: '0.35rem 0.65rem',
                              background: 'rgba(0,0,0,0.3)',
                              borderRadius: '6px',
                              border: '1px solid rgba(255,255,255,0.15)',
                              color: '#ffffff',
                              textDecoration: 'none',
                              fontSize: '0.75rem',
                              fontWeight: 600
                            }}
                          >
                            <FileText size={14} color="#fef08a" />
                            <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {att.name || 'Document.pdf'}
                            </span>
                            <Download size={13} />
                          </a>
                        ))}

                        {/* Video */}
                        {msg.videoUrl && (
                          <div style={{ marginTop: '0.5rem', borderRadius: '6px', overflow: 'hidden' }}>
                            {embedUrl ? (
                              <iframe
                                src={embedUrl}
                                title="Video"
                                style={{ width: '100%', height: '150px', border: 'none' }}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                              />
                            ) : (
                              <a href={msg.videoUrl} target="_blank" rel="noreferrer" style={{ color: '#fef08a', fontSize: '0.75rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                                <Play size={13} /> Watch Video Demo
                              </a>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Canned Quick Suggestions Bar (No ugly green scrollbar artifact) */}
              <div
                className="hide-scrollbar"
                style={{
                  padding: '0.35rem 0.75rem',
                  background: '#0a101d',
                  borderTop: '1px solid rgba(255,255,255,0.06)',
                  display: 'flex',
                  gap: '0.35rem',
                  overflowX: 'auto',
                  alignItems: 'center'
                }}
              >
                <span style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 700, whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '0.2rem', flexShrink: 0 }}>
                  <Sparkles size={11} color="#22c55e" />
                  <span>Quick:</span>
                </span>
                {quickCannedReplies.map((reply, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setReplyText(prev => (prev ? `${prev} ${reply}` : reply))}
                    style={{
                      fontSize: '0.68rem',
                      background: 'rgba(30, 41, 59, 0.6)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      borderRadius: '999px',
                      padding: '0.18rem 0.55rem',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      color: '#cbd5e1',
                      fontWeight: 500,
                      transition: 'all 0.15s ease',
                      flexShrink: 0
                    }}
                    className="hover:border-green-500 hover:text-white hover:bg-green-950/30"
                  >
                    {reply.slice(0, 24)}...
                  </button>
                ))}
              </div>

              {/* Sleek, Compact Modern Composer */}
              <form
                onSubmit={handleSendReply}
                style={{
                  padding: '0.55rem 0.75rem 0.65rem 0.75rem',
                  background: '#0d1527',
                  borderTop: '1px solid rgba(255,255,255,0.08)'
                }}
              >
                {/* Attached File Badges Strip */}
                {attachmentsList.length > 0 && (
                  <div className="flex gap-1.5" style={{ marginBottom: '0.45rem', flexWrap: 'wrap' }}>
                    {attachmentsList.map((att, idx) => (
                      <span key={idx} style={{ background: 'rgba(6, 78, 59, 0.8)', border: '1px solid #059669', borderRadius: '6px', padding: '0.15rem 0.45rem', fontSize: '0.7rem', color: '#6ee7b7', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                        <FileText size={12} color="#fef08a" />
                        <span style={{ maxWidth: '140px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{att.name}</span>
                        {att.size > 0 && <span style={{ fontSize: '0.65rem', color: '#a7f3d0' }}>({formatFileSize(att.size)})</span>}
                        <button type="button" onClick={() => handleRemoveAttachment(idx)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#ef4444', fontWeight: 900, padding: '0 2px', lineHeight: 1 }}>✕</button>
                      </span>
                    ))}
                  </div>
                )}

                {/* Unified Modern Input Capsule */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    background: '#070d19',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: '20px',
                    padding: '0.2rem 0.35rem 0.2rem 0.65rem',
                    transition: 'all 0.2s ease'
                  }}
                  className="focus-within:border-green-500 focus-within:ring-1 focus-within:ring-green-500/50"
                >
                  {/* File Attachment Hidden Input & Icon Button */}
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    multiple
                    accept="image/*,application/pdf,video/mp4,.doc,.docx,.xls,.xlsx,.csv,.txt,.zip"
                    style={{ display: 'none' }}
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingFiles}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: uploadingFiles ? '#34d399' : '#94a3b8',
                      width: '28px',
                      height: '28px',
                      minWidth: '28px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      borderRadius: '50%',
                      padding: 0,
                      transition: 'all 0.15s ease'
                    }}
                    className="hover:text-green-400 hover:bg-white/5"
                    title="Attach Images, PDF, Docs, MP4 (Max 5MB)"
                  >
                    {uploadingFiles ? <RefreshCw size={15} className="animate-spin text-green-400" /> : <Paperclip size={16} />}
                  </button>

                  {/* Compact Auto-Fit Text Input */}
                  <textarea
                    rows={1}
                    placeholder="Type reply... (Enter to send, Shift+Enter for newline)"
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendReply(e);
                      }
                    }}
                    style={{
                      flex: 1,
                      fontSize: '0.825rem',
                      background: 'transparent',
                      border: 'none',
                      color: '#ffffff',
                      resize: 'none',
                      outline: 'none',
                      padding: '0.35rem 0.2rem',
                      lineHeight: 1.35,
                      height: '32px',
                      minHeight: '32px',
                      maxHeight: '80px',
                      fontFamily: 'inherit'
                    }}
                  />

                  {/* Compact Circular Send Button */}
                  <button
                    type="submit"
                    disabled={sending || uploadingFiles || (!replyText.trim() && attachmentsList.length === 0 && !videoUrl)}
                    style={{
                      width: '32px',
                      height: '32px',
                      minWidth: '32px',
                      borderRadius: '50%',
                      background: (!replyText.trim() && attachmentsList.length === 0 && !videoUrl)
                        ? 'rgba(255, 255, 255, 0.08)'
                        : 'linear-gradient(135deg, #16a34a, #15803d)',
                      border: 'none',
                      color: (!replyText.trim() && attachmentsList.length === 0 && !videoUrl) ? '#475569' : '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: (!replyText.trim() && attachmentsList.length === 0 && !videoUrl) ? 'not-allowed' : 'pointer',
                      boxShadow: (!replyText.trim() && attachmentsList.length === 0 && !videoUrl) ? 'none' : '0 2px 8px rgba(34, 197, 94, 0.35)',
                      transition: 'all 0.15s ease',
                      padding: 0
                    }}
                    className="hover:scale-105 active:scale-95"
                    title="Send Reply (Enter)"
                  >
                    {sending ? (
                      <RefreshCw size={13} className="animate-spin" />
                    ) : (
                      <Send size={14} style={{ marginLeft: '1px' }} />
                    )}
                  </button>
                </div>

                {/* Minimalist Footer Row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.35rem', padding: '0 0.35rem', fontSize: '0.68rem', color: '#64748b' }}>
                  <span>Max 5MB files • Enter to send</span>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', cursor: 'pointer', color: markResolvedOnSend ? '#34d399' : '#94a3b8', fontWeight: 600, userSelect: 'none' }}>
                    <input
                      type="checkbox"
                      checked={markResolvedOnSend}
                      onChange={(e) => setMarkResolvedOnSend(e.target.checked)}
                      style={{ width: '12px', height: '12px', accentColor: '#16a34a', cursor: 'pointer' }}
                    />
                    <span>Mark as Resolved</span>
                  </label>
                </div>
              </form>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminSupportPage;
