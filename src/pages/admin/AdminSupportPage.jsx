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

const quickCannedReplies = [
  'Namaste Kisan Bhai! Yeh machine cotton aur sugarcane kheti ke liye 100% suitable hai.',
  'Aapka DBT / SMAM Govt. Subsidy invoice generate kar diya gaya hai.',
  'Hamare certified agricultural engineer ne aapki field requirements note kar li hain.',
  'Machine 100% Free Palletized transport se 4-5 business days me deliver ho jayegi.',
  'Is model par SBI Kisan Credit aur HDFC par 0% No-Cost EMI uplabdh hai.',
  'Aapki suvidha ke liye humne working field demonstration video attach kar diya hai.'
];

const AdminSupportPage = () => {
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

  // Real-time SSE listener (handles instant live updates without continuous polling)
  useEffect(() => {
    const unsubscribe = subscribe((event) => {
      if (event.type === 'NEW_SUPPORT_QUERY') {
        if (soundEnabled) playChime();
        const payload = event.payload || {};

        setLiveBanner({
          ticketId: payload.ticketId,
          userName: payload.userName || 'A farmer',
          subject: payload.subject || 'Equipment inquiry',
          phone: payload.userPhone || '',
          product: payload.productTitle || '',
          preview: payload.preview || 'Customer sent a new query message.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });

        fetchTickets(false);
      } else if (event.type === 'TICKET_UPDATED') {
        fetchTickets(false);
      }
    });

    return unsubscribe;
  }, [subscribe, soundEnabled, fetchTickets]);

  // Scroll popup message list when messages change
  useEffect(() => {
    if (!activeTicket?.messages) return;
    const count = activeTicket.messages.length;
    if (count > prevMessagesCountRef.current) {
      setTimeout(scrollToBottomInner, 50);
      prevMessagesCountRef.current = count;
    }
  }, [activeTicket?.messages]);

  // Open Chat Popup Window (Gmail Style)
  const handleOpenChatPopup = async (ticket) => {
    try {
      setIsMinimized(false);
      prevMessagesCountRef.current = 0;
      // Mark as read locally immediately so the NEW badge vanishes on click
      setTickets(prev => prev.map(t => t._id === ticket._id ? { ...t, unreadByAdmin: 0 } : t));
      const res = await adminApi.get(`/support/admin/tickets/${ticket._id}`);
      if (res.data.success) {
        setActiveTicket(res.data.ticket);
        setNewStatus(res.data.ticket.status);
        setTimeout(scrollToBottomInner, 60);
      }
    } catch (error) {
      setActiveTicket(ticket);
    }
  };

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
            <h1 style={{ fontSize: '1.85rem', fontWeight: 900, color: '#ffffff', letterSpacing: '-0.02em', margin: 0, textShadow: '0 2px 8px rgba(0,0,0,0.5)' }}>
              Farmer Advisory & Machinery Inquiries Desk
            </h1>
            <span className="badge" style={{ background: '#064e3b', color: '#6ee7b7', border: '1px solid #059669', fontWeight: 800, fontSize: '0.75rem', padding: '0.25rem 0.65rem' }}>
              ● LIVE STREAM ACTIVE
            </span>
          </div>
          <p style={{ fontSize: '0.9rem', color: '#94a3b8', marginTop: '0.4rem' }}>
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
              background: soundEnabled ? '#064e3b' : 'rgba(30, 41, 59, 0.8)',
              borderColor: soundEnabled ? '#059669' : 'rgba(255,255,255,0.15)',
              color: soundEnabled ? '#6ee7b7' : '#94a3b8',
              fontWeight: 700,
              padding: '0.5rem 0.9rem'
            }}
          >
            {soundEnabled ? <Volume2 size={15} color="#6ee7b7" /> : <VolumeX size={15} color="#94a3b8" />}
            <span>Sound {soundEnabled ? 'ON' : 'OFF'}</span>
          </button>

          {/* Sync Button */}
          <button
            type="button"
            onClick={() => fetchTickets(true)}
            className="btn btn-secondary btn-sm"
            style={{ background: 'rgba(30, 41, 59, 0.8)', color: '#ffffff', borderColor: 'rgba(255,255,255,0.15)', fontWeight: 700, padding: '0.5rem 0.9rem' }}
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            <span>Sync Inbox</span>
          </button>
        </div>
      </div>

      {/* KPI Metrics Dashboard Cards with Generous Margins & 1.5rem Gaps */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem', marginTop: '1.5rem' }}>
        <div style={{ background: 'linear-gradient(145deg, #1e293b, #0f172a)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '1.5rem 1.65rem', boxShadow: '0 8px 24px rgba(0,0,0,0.25)' }}>
          <div className="flex justify-between items-center">
            <span style={{ fontSize: '0.775rem', color: '#94a3b8', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Total Inquiries</span>
            <MessageSquare size={18} color="#38bdf8" />
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#ffffff', marginTop: '0.5rem' }}>
            {tickets.length}
          </div>
          <div style={{ fontSize: '0.775rem', color: '#64748b', marginTop: '0.25rem' }}>All historical records</div>
        </div>

        <div style={{ background: 'linear-gradient(145deg, #451a03, #1e293b)', border: '1px solid #d97706', borderRadius: '16px', padding: '1.5rem 1.65rem', boxShadow: '0 8px 24px rgba(217, 119, 6, 0.15)' }}>
          <div className="flex justify-between items-center">
            <span style={{ fontSize: '0.775rem', color: '#fbbf24', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Open / Needs Reply</span>
            <Clock size={18} color="#fbbf24" />
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#fbbf24', marginTop: '0.5rem' }}>
            {stats.openCount}
          </div>
          <div style={{ fontSize: '0.775rem', color: '#f59e0b', marginTop: '0.25rem' }}>Awaiting initial advisory</div>
        </div>

        <div style={{ background: 'linear-gradient(145deg, #064e3b, #1e293b)', border: '1px solid #059669', borderRadius: '16px', padding: '1.5rem 1.65rem', boxShadow: '0 8px 24px rgba(5, 150, 105, 0.15)' }}>
          <div className="flex justify-between items-center">
            <span style={{ fontSize: '0.775rem', color: '#6ee7b7', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em' }}>In Resolution</span>
            <Tractor size={18} color="#34d399" />
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#6ee7b7', marginTop: '0.5rem' }}>
            {stats.inProgressCount}
          </div>
          <div style={{ fontSize: '0.775rem', color: '#34d399', marginTop: '0.25rem' }}>Agronomist discussing</div>
        </div>

        <div style={{ background: stats.unreadCount > 0 ? 'linear-gradient(145deg, #450a0a, #1e293b)' : 'linear-gradient(145deg, #1e293b, #0f172a)', border: stats.unreadCount > 0 ? '1.5px solid #ef4444' : '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '1.5rem 1.65rem', boxShadow: '0 8px 24px rgba(0,0,0,0.25)' }}>
          <div className="flex justify-between items-center">
            <span style={{ fontSize: '0.775rem', color: stats.unreadCount > 0 ? '#fca5a5' : '#94a3b8', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Unread Farmer Messages</span>
            <AlertCircle size={18} color={stats.unreadCount > 0 ? '#ef4444' : '#64748b'} />
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 900, color: stats.unreadCount > 0 ? '#ef4444' : '#ffffff', marginTop: '0.5rem' }}>
            {stats.unreadCount}
          </div>
          <div style={{ fontSize: '0.775rem', color: stats.unreadCount > 0 ? '#f87171' : '#64748b', marginTop: '0.25rem' }}>
            {stats.unreadCount > 0 ? '⚡ Priority reply requested' : 'All caught up'}
          </div>
        </div>
      </div>

      {/* Inquiries Management Workspace (Full-Width Card Directory) */}
      <div
        style={{
          background: '#111c34',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '20px',
          padding: '1.85rem',
          boxShadow: '0 12px 36px rgba(0,0,0,0.3)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.75rem',
          marginBottom: '3rem'
        }}
      >
        {/* Controls Bar */}
        <div className="flex justify-between items-center flex-wrap gap-3">
          {/* Search Box */}
          <div className="relative" style={{ flex: 1, minWidth: '280px', maxWidth: '480px' }}>
            <input
              type="text"
              placeholder="Search farmer name, phone, ticket #, SKU..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: '100%',
                fontSize: '0.875rem',
                padding: '0.65rem 1rem 0.65rem 2.5rem',
                background: 'rgba(15, 23, 42, 0.8)',
                border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: '12px',
                color: '#ffffff',
                outline: 'none'
              }}
            />
            <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
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
                    background: isSelected ? '#166534' : 'rgba(30, 41, 59, 0.6)',
                    color: isSelected ? '#ffffff' : '#cbd5e1',
                    border: isSelected ? '1px solid #22c55e' : '1px solid rgba(255,255,255,0.1)',
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
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem 1rem', color: '#94a3b8' }}>
              <RefreshCw size={28} className="animate-spin" style={{ margin: '0 auto 0.75rem auto', color: '#22c55e' }} />
              <div style={{ fontSize: '1rem', fontWeight: 600 }}>Loading farmer inquiry records...</div>
            </div>
          ) : tickets.length === 0 ? (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem 1rem', color: '#94a3b8', background: 'rgba(15, 23, 42, 0.4)', borderRadius: '16px' }}>
              <MessageSquare size={42} color="rgba(255,255,255,0.2)" style={{ margin: '0 auto 1rem auto' }} />
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ffffff' }}>No Inquiries Found</div>
              <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '0.35rem' }}>Try clearing your search keyword or switching status filter tabs.</p>
            </div>
          ) : (
            tickets.map((t) => {
              const lastMsg = t.messages && t.messages.length > 0 ? t.messages[t.messages.length - 1] : null;

              return (
                <div
                  key={t._id}
                  style={{
                    background: t.unreadByAdmin > 0 ? 'linear-gradient(145deg, #1c2640, #141f36)' : 'linear-gradient(145deg, #16223b, #0f172a)',
                    border: t.unreadByAdmin > 0 ? '1.5px solid #f59e0b' : '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '16px',
                    padding: '1.25rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
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
                        border: '2px solid #0f172a',
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
                          <div style={{ fontWeight: 900, color: '#ffffff', fontSize: '0.975rem' }}>
                            {t.userName}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
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
                      {t.subject}
                    </div>

                    {/* Machinery tag if present */}
                    {t.productTitle && (
                      <div style={{ fontSize: '0.75rem', color: '#38bdf8', background: 'rgba(56, 189, 248, 0.12)', border: '1px solid rgba(56, 189, 248, 0.25)', borderRadius: '6px', padding: '0.2rem 0.55rem', marginBottom: '0.6rem', display: 'inline-block', maxWidth: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        🚜 {t.productTitle} {t.productSku ? `(SKU: ${t.productSku})` : ''}
                      </div>
                    )}

                    {/* Last message preview */}
                    {lastMsg && (
                      <div style={{ fontSize: '0.8rem', color: '#cbd5e1', background: 'rgba(0,0,0,0.25)', padding: '0.5rem 0.75rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)', marginBottom: '0.75rem', lineHeight: 1.4 }}>
                        <strong style={{ color: lastMsg.sender === 'admin' ? '#86efac' : '#fbbf24' }}>
                          {lastMsg.sender === 'admin' ? 'You: ' : `${t.userName}: `}
                        </strong>
                        <span>{lastMsg.text || (lastMsg.attachments?.length > 0 ? '📎 File Attachment' : lastMsg.images?.length > 0 ? '📷 Attached Image' : '🎥 Video Link')}</span>
                      </div>
                    )}
                  </div>

                  {/* Actions Bar */}
                  <div className="flex justify-between items-center" style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '0.75rem', marginTop: '0.35rem' }}>
                    <div className="flex items-center gap-2.5">
                      <a
                        href={`tel:${t.userPhone}`}
                        style={{ color: '#86efac', fontSize: '0.75rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.25rem', textDecoration: 'none' }}
                        className="hover:underline"
                        title="Call Farmer"
                      >
                        <PhoneCall size={13} color="#86efac" />
                        <span>Call</span>
                      </a>
                      <a
                        href={`https://wa.me/${t.userPhone?.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Namaste ${t.userName} ji! 🙏 AgriMachina Support Desk se hum aapki inquiry (${t.subject}) ke sambandh me sampark kar rahe hain.`)}`}
                        target="_blank"
                        rel="noreferrer"
                        style={{ color: '#34d399', fontSize: '0.75rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.25rem', textDecoration: 'none' }}
                        className="hover:underline"
                        title="WhatsApp Farmer"
                      >
                        <MessageCircle size={13} color="#34d399" />
                        <span>WhatsApp</span>
                      </a>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleOpenChatPopup(t)}
                      className="btn btn-primary btn-sm"
                      style={{
                        background: 'linear-gradient(135deg, #166534, #15803d)',
                        borderColor: '#22c55e',
                        color: '#ffffff',
                        fontWeight: 800,
                        fontSize: '0.775rem',
                        padding: '0.35rem 0.95rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.35rem'
                      }}
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
            bottom: isMinimized ? '0' : '20px',
            right: isMinimized ? '20px' : isMaximized ? '20px' : '25px',
            left: isMaximized ? '20px' : 'auto',
            top: isMaximized ? '20px' : 'auto',
            width: isMaximized ? 'calc(100vw - 40px)' : isMinimized ? '340px' : '490px',
            height: isMaximized ? 'calc(100vh - 40px)' : isMinimized ? '48px' : '620px',
            maxHeight: isMaximized ? 'none' : '85vh',
            background: '#0f172a',
            border: '2px solid #22c55e',
            borderRadius: isMinimized ? '14px 14px 0 0' : '18px',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.7), 0 0 20px rgba(34, 197, 94, 0.25)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            zIndex: 99999,
            transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        >
          {/* Pop-up Top Header (Always Visible) */}
          <div
            style={{
              padding: '0.85rem 1.25rem',
              background: 'linear-gradient(135deg, #14532d, #064e3b)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: isMinimized ? 'pointer' : 'default',
              userSelect: 'none',
              borderBottom: isMinimized ? 'none' : '1px solid rgba(255,255,255,0.15)'
            }}
            onClick={isMinimized ? () => setIsMinimized(false) : undefined}
          >
            <div className="flex items-center gap-3" style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: '#22c55e',
                  color: '#000000',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 900,
                  fontSize: '0.95rem',
                  flexShrink: 0,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                  marginRight: '0.25rem'
                }}
              >
                {activeTicket.userName?.charAt(0) || 'K'}
              </div>
              <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#ffffff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {activeTicket.userName} <span style={{ fontSize: '0.775rem', color: '#86efac', fontWeight: 600, marginLeft: '0.25rem' }}>({activeTicket.userPhone})</span>
                </div>
                {!isMinimized && (
                  <div style={{ fontSize: '0.725rem', color: '#cbd5e1', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginTop: '0.15rem' }}>
                    #{activeTicket.ticketNumber || activeTicket._id.slice(-6).toUpperCase()} • {activeTicket.subject}
                  </div>
                )}
              </div>
            </div>

            {/* Window Controls (Minimize, Maximize, Close) */}
            <div className="flex items-center gap-2" style={{ flexShrink: 0, marginLeft: '0.75rem' }} onClick={(e) => e.stopPropagation()}>
              <button
                type="button"
                onClick={() => setIsMinimized(!isMinimized)}
                style={{ background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: '8px', color: '#ffffff', width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.15s ease' }}
                className="hover:bg-white/30"
                title={isMinimized ? 'Restore Window' : 'Minimize Window'}
              >
                {isMinimized ? <ChevronUp size={16} /> : <Minus size={16} strokeWidth={2.5} />}
              </button>

              {!isMinimized && (
                <button
                  type="button"
                  onClick={() => setIsMaximized(!isMaximized)}
                  style={{ background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: '8px', color: '#ffffff', width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.15s ease' }}
                  className="hover:bg-white/30"
                  title={isMaximized ? 'Restore Size' : 'Maximize Window'}
                >
                  <Maximize2 size={14} />
                </button>
              )}

              <button
                type="button"
                onClick={() => setActiveTicket(null)}
                style={{ background: 'rgba(239,68,68,0.3)', border: '1px solid rgba(239,68,68,0.5)', borderRadius: '8px', color: '#ffffff', width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.15s ease' }}
                className="hover:bg-red-600"
                title="Close Chat Pop-up"
              >
                <X size={15} />
              </button>
            </div>
          </div>

          {/* Pop-up Body (Hidden when minimized) */}
          {!isMinimized && (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: 'calc(100% - 48px)', overflow: 'hidden', background: '#090e1a' }}>
              {/* Context Bar: Machinery SKU + Status Selector + Call/WhatsApp Shortcuts */}
              <div
                style={{
                  padding: '0.65rem 1.25rem',
                  background: '#111c34',
                  borderBottom: '1px solid rgba(255,255,255,0.08)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '0.85rem',
                  fontSize: '0.775rem',
                  flexWrap: 'wrap'
                }}
              >
                <div className="flex items-center gap-3">
                  <a
                    href={`tel:${activeTicket.userPhone}`}
                    style={{ color: '#86efac', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.35rem', textDecoration: 'none' }}
                  >
                    <PhoneCall size={13} color="#86efac" />
                    <span>Call</span>
                  </a>
                  <a
                    href={`https://wa.me/${activeTicket.userPhone?.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Namaste ${activeTicket.userName} ji! 🙏 AgriMachina Support Desk.`)}`}
                    target="_blank"
                    rel="noreferrer"
                    style={{ color: '#34d399', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.35rem', textDecoration: 'none' }}
                  >
                    <MessageCircle size={13} color="#34d399" />
                    <span>WhatsApp</span>
                  </a>

                  {activeTicket.productTitle && (
                    <span style={{ color: '#38bdf8', fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '220px', marginLeft: '0.25rem' }}>
                      • 🚜 {activeTicket.productTitle}
                    </span>
                  )}
                </div>

                {/* Status Switcher */}
                <div className="flex items-center gap-2">
                  <span style={{ color: '#94a3b8', fontWeight: 700 }}>Status:</span>
                  <select
                    value={activeTicket.status}
                    onChange={(e) => handleStatusChange(e.target.value)}
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      padding: '0.3rem 0.6rem',
                      borderRadius: '8px',
                      background: activeTicket.status === 'Open' ? '#7f1d1d' : activeTicket.status === 'In Progress' ? '#075985' : '#14532d',
                      color: '#ffffff',
                      border: '1px solid rgba(255,255,255,0.2)',
                      outline: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="Open">🔴 Open</option>
                    <option value="In Progress">🔵 In Progress</option>
                    <option value="Resolved">🟢 Resolved</option>
                    <option value="Closed">⚪ Closed</option>
                  </select>
                </div>
              </div>

              {/* Messages Thread Stream (FULLY SCROLLABLE, 0 SCROLL BUG, SLEEK HOVER SCROLLBAR) */}
              <div
                ref={messagesScrollRef}
                className="custom-chat-scrollbar"
                style={{
                  flex: 1,
                  padding: '1.25rem 1.25rem',
                  overflowY: 'auto',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1.25rem',
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
                        marginBottom: '0.5rem'
                      }}
                    >
                      <div style={{ fontSize: '0.7rem', color: '#64748b', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <strong style={{ color: isAdmin ? '#86efac' : '#38bdf8', fontWeight: 800 }}>
                          {isAdmin ? 'AgriMachina Specialist (You)' : msg.senderName || activeTicket.userName}
                        </strong>
                        <span>•</span>
                        <span>{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>

                      <div
                        style={{
                          background: isAdmin ? 'linear-gradient(135deg, #166534, #14532d)' : '#1e293b',
                          color: '#ffffff',
                          border: isAdmin ? '1px solid #22c55e' : '1px solid rgba(255,255,255,0.1)',
                          borderRadius: isAdmin ? '18px 18px 2px 18px' : '18px 18px 18px 2px',
                          padding: '0.85rem 1.2rem',
                          fontSize: '0.875rem',
                          lineHeight: 1.55,
                          boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
                          whiteSpace: 'pre-wrap',
                          wordBreak: 'break-word'
                        }}
                      >
                        {msg.text}

                        {/* Images */}
                        {((msg.images && msg.images.length > 0) || allAttachments.some(a => a.fileType === 'image')) && (
                          <div className="flex flex-wrap gap-2.5" style={{ marginTop: '0.65rem' }}>
                            {msg.images?.map((imgUrl, imgIdx) => (
                              <a key={`pop-img-${imgIdx}`} href={imgUrl} target="_blank" rel="noreferrer">
                                <img
                                  src={imgUrl}
                                  alt="Attachment"
                                  style={{ width: '110px', height: '80px', objectFit: 'cover', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)' }}
                                />
                              </a>
                            ))}
                            {allAttachments.filter(a => a.fileType === 'image').map((att, imgIdx) => (
                              <a key={`pop-att-${imgIdx}`} href={att.url} target="_blank" rel="noreferrer">
                                <img
                                  src={att.url}
                                  alt={att.name || 'Attachment'}
                                  style={{ width: '110px', height: '80px', objectFit: 'cover', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)' }}
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
                              gap: '0.5rem',
                              marginTop: '0.55rem',
                              padding: '0.45rem 0.75rem',
                              background: 'rgba(0,0,0,0.3)',
                              borderRadius: '8px',
                              border: '1px solid rgba(255,255,255,0.15)',
                              color: '#ffffff',
                              textDecoration: 'none',
                              fontSize: '0.775rem',
                              fontWeight: 700
                            }}
                          >
                            <FileText size={15} color="#fef08a" />
                            <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {att.name || 'Document.pdf'}
                            </span>
                            <Download size={14} />
                          </a>
                        ))}

                        {/* Video */}
                        {msg.videoUrl && (
                          <div style={{ marginTop: '0.65rem', borderRadius: '8px', overflow: 'hidden' }}>
                            {embedUrl ? (
                              <iframe
                                src={embedUrl}
                                title="Video"
                                style={{ width: '100%', height: '160px', border: 'none' }}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                              />
                            ) : (
                              <a href={msg.videoUrl} target="_blank" rel="noreferrer" style={{ color: '#fef08a', fontSize: '0.775rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                                <Play size={14} /> Watch Video Demo
                              </a>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Canned Quick Suggestions Bar */}
              <div style={{ padding: '0.45rem 1rem', background: '#111c34', borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', gap: '0.45rem', overflowX: 'auto', alignItems: 'center' }}>
                <span style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 700, whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '0.25rem', marginRight: '0.25rem' }}>
                  <Sparkles size={12} color="#22c55e" />
                  <span>Suggestions:</span>
                </span>
                {quickCannedReplies.map((reply, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setReplyText(prev => (prev ? `${prev} ${reply}` : reply))}
                    style={{
                      fontSize: '0.7rem',
                      background: 'rgba(30, 41, 59, 0.8)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '14px',
                      padding: '0.25rem 0.65rem',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      color: '#e2e8f0',
                      fontWeight: 600,
                      transition: 'all 0.15s ease'
                    }}
                    className="hover:border-green-500"
                  >
                    {reply.slice(0, 26)}...
                  </button>
                ))}
              </div>

              {/* Compose & Reply Bar */}
              <form onSubmit={handleSendReply} style={{ padding: '0.85rem 1.15rem', background: '#111c34', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                {/* Attached File Badges */}
                {attachmentsList.length > 0 && (
                  <div className="flex gap-2" style={{ marginBottom: '0.6rem', flexWrap: 'wrap' }}>
                    {attachmentsList.map((att, idx) => (
                      <span key={idx} style={{ background: '#064e3b', border: '1px solid #059669', borderRadius: '8px', padding: '0.25rem 0.65rem', fontSize: '0.75rem', color: '#6ee7b7', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <FileText size={13} color="#fef08a" />
                        <span style={{ maxWidth: '160px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{att.name}</span>
                        {att.size > 0 && <span style={{ fontSize: '0.68rem', color: '#a7f3d0' }}>({formatFileSize(att.size)})</span>}
                        <button type="button" onClick={() => handleRemoveAttachment(idx)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#ef4444', fontWeight: 900, padding: '0 2px' }}>✕</button>
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex gap-2.5">
                  <textarea
                    rows={2}
                    placeholder="Type official agricultural advice or equipment details... (Ctrl+Enter to send)"
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                        handleSendReply(e);
                      }
                    }}
                    style={{
                      flex: 1,
                      fontSize: '0.875rem',
                      padding: '0.65rem 0.85rem',
                      background: 'rgba(15, 23, 42, 0.9)',
                      border: '1px solid rgba(255,255,255,0.15)',
                      borderRadius: '12px',
                      color: '#ffffff',
                      resize: 'none',
                      outline: 'none',
                      lineHeight: 1.45
                    }}
                  />

                  <button
                    type="submit"
                    disabled={sending || uploadingFiles}
                    style={{
                      background: 'linear-gradient(135deg, #166534, #15803d)',
                      border: '1px solid #22c55e',
                      color: '#ffffff',
                      borderRadius: '12px',
                      padding: '0 1.15rem',
                      fontWeight: 800,
                      fontSize: '0.85rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      cursor: 'pointer'
                    }}
                  >
                    <Send size={15} />
                    <span>{sending ? 'Sending...' : 'Send'}</span>
                  </button>
                </div>

                {/* Attachment options inside composer */}
                <div className="flex justify-between items-center gap-2" style={{ marginTop: '0.6rem', fontSize: '0.75rem', flexWrap: 'wrap' }}>
                  <div className="flex items-center gap-2.5">
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
                      style={{ background: 'rgba(34, 197, 94, 0.15)', border: '1px solid rgba(34, 197, 94, 0.3)', borderRadius: '8px', color: '#86efac', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', fontWeight: 700, padding: '0.35rem 0.75rem' }}
                    >
                      <UploadCloud size={15} />
                      <span>{uploadingFiles ? 'Uploading...' : '📎 Attach Files (Max 5MB)'}</span>
                    </button>
                    <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
                      Photos, PDFs, Docs, MP4 Videos (Max 5MB)
                    </span>
                  </div>

                  <label style={{ color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '0.35rem', cursor: 'pointer', fontSize: '0.75rem' }}>
                    <input
                      type="checkbox"
                      checked={markResolvedOnSend}
                      onChange={(e) => setMarkResolvedOnSend(e.target.checked)}
                      style={{ cursor: 'pointer' }}
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
