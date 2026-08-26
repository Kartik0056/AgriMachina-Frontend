import React, { useState, useEffect, useRef } from 'react';
import {
  MessageSquare,
  Send,
  Camera,
  Video,
  Play,
  Plus,
  RefreshCw,
  Clock,
  CheckCheck,
  ShieldCheck,
  Headphones,
  Tractor,
  HelpCircle,
  PhoneCall,
  MessageCircle,
  Paperclip,
  X,
  Search,
  ChevronDown,
  Sparkles,
  ArrowDown,
  FileText,
  Download,
  UploadCloud,
  Image as ImageIcon,
  Minimize2,
  Maximize2,
  Minus,
  ChevronUp,
  ArrowUpRight
} from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useSync } from '../../context/SyncContext';
import { useLanguage } from '../../context/LanguageContext';
import { Link, useSearchParams, useLocation } from 'react-router-dom';
import Modal from '../../components/common/Modal';
import { getYouTubeEmbedUrl } from '../../services/videoHelper';

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

const quickFarmerQuestions = [
  'Is this machine suitable for heavy black cotton / clay soil?',
  'What is the subsidy percentage under SMAM / DBT for this model?',
  'How to apply for 0% No-Cost EMI via SBI Kisan / HDFC?',
  'When will the spare parts and blade set be dispatched?',
  'Please share full working demonstration video in field.'
];

const UserSupportPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const openTicketParam = searchParams.get('ticket') || location.state?.openTicketId;

  const { user, isAuthenticated } = useAuth();
  const { addToast } = useToast();
  const { subscribe } = useSync();
  const { t, tr } = useLanguage();

  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Active Popup Chat Widget State (Gmail Compose Style)
  const [activeTicket, setActiveTicket] = useState(null);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);

  // Message input state inside popup
  const [replyText, setReplyText] = useState('');
  const [photoInput, setPhotoInput] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [attachmentsList, setAttachmentsList] = useState([]);
  const [showAttachmentDrawer, setShowAttachmentDrawer] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState(false);
  const [sending, setSending] = useState(false);

  // New Inquiry Modal State
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [newSubject, setNewSubject] = useState('');
  const [newTopic, setNewTopic] = useState('Technical Guidance');
  const [newMsg, setNewMsg] = useState('');
  const [newModalFiles, setNewModalFiles] = useState([]);

  // File Input Refs
  const fileInputRef = useRef(null);
  const modalFileInputRef = useRef(null);
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

  const fetchTickets = async (showLoading = false) => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }
    if (showLoading) setLoading(true);
    try {
      const res = await api.get('/support/my-tickets');
      if (res.data.success) {
        const fetched = res.data.tickets || [];
        setTickets(fetched);

        if (activeTicketIdRef.current) {
          const updated = fetched.find(t => t._id === activeTicketIdRef.current);
          if (updated) {
            const newCount = updated.messages?.length || 0;
            const oldCount = activeTicket?.messages?.length || 0;
            if (newCount !== oldCount || updated.status !== activeTicket?.status) {
              setActiveTicket(updated);
            }
          }
        }
      }
    } catch (error) {
      console.error('Failed to load farmer tickets:', error);
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets(true);
  }, [isAuthenticated]);

  // Real-time update listener via SSE
  useEffect(() => {
    const unsubscribe = subscribe((event) => {
      if (event.type === 'TICKET_UPDATED' || event.type === 'NEW_SUPPORT_QUERY') {
        const payload = event.payload || {};
        // If user is currently looking at this active ticket and an admin reply arrives, auto-mark as read
        if (activeTicketIdRef.current === payload.ticketId && !isMinimizedRef.current && payload.type === 'admin_reply') {
          api.put(`/support/tickets/${payload.ticketId}/read`).catch(() => {});
        }
        if (payload.type === 'ticket_read_by_user') {
          setTickets(prev => prev.map(t => t._id === payload.ticketId ? { ...t, unreadByUser: 0 } : t));
        }
        fetchTickets(false);
      }
    });
    return unsubscribe;
  }, [subscribe]);

  // Open Chat Popup & Instantly Clear Unread Count
  const handleOpenChatPopup = async (t) => {
    try {
      setIsMinimized(false);
      prevMessagesCountRef.current = 0;
      activeTicketIdRef.current = t._id;
      const unreadCount = t.unreadByUser || 0;

      // Mark as read locally immediately so the NEW badge vanishes on click
      setTickets(prev => prev.map(item => item._id === t._id ? { ...item, unreadByUser: 0 } : item));
      window.dispatchEvent(new CustomEvent('user_ticket_read', { detail: { ticketId: t._id, count: unreadCount } }));

      const res = await api.get(`/support/tickets/${t._id}`);
      if (res.data.success) {
        setActiveTicket(res.data.ticket);
        fetchTickets(false);
        setTimeout(scrollToBottomInner, 60);
      }
    } catch (error) {
      setActiveTicket(t);
    }
  };

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
  }, [openTicketParam, tickets, searchParams, setSearchParams]);

  // Scroll popup when new message arrives
  useEffect(() => {
    if (!activeTicket?.messages) return;
    const currentCount = activeTicket.messages.length;
    if (currentCount > prevMessagesCountRef.current) {
      setTimeout(scrollToBottomInner, 50);
      prevMessagesCountRef.current = currentCount;
    }
  }, [activeTicket?.messages]);

const formatFileSize = (bytes) => {
  if (!bytes || bytes === 0) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

  // Direct Device File Upload Handler (Max 5MB per file)
  const handleFileUpload = async (e, isModal = false) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Validate 5MB maximum file size per file
    const maxSizeBytes = 5 * 1024 * 1024;
    for (const f of files) {
      if (f.size > maxSizeBytes) {
        addToast(`File "${f.name}" (${(f.size / (1024 * 1024)).toFixed(1)} MB) exceeds maximum allowed size of 5MB.`, 'error');
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
      const res = await api.post('/support/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (res.data.success && res.data.files) {
        if (isModal) {
          setNewModalFiles(prev => [...prev, ...res.data.files]);
        } else {
          setAttachmentsList(prev => [...prev, ...res.data.files]);
        }
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
      { url: photoInput.trim(), name: 'Web Photo Link', size: 0, fileType: 'image' }
    ]);
    setPhotoInput('');
  };

  const handleRemoveAttachment = (idx, isModal = false) => {
    if (isModal) {
      setNewModalFiles(prev => prev.filter((_, i) => i !== idx));
    } else {
      setAttachmentsList(prev => prev.filter((_, i) => i !== idx));
    }
  };

  const handleSendMessage = async (e) => {
    e?.preventDefault();
    if ((!replyText || !replyText.trim()) && attachmentsList.length === 0 && !videoUrl) {
      addToast('Please type a message or attach photos/files.', 'warning');
      return;
    }

    setSending(true);
    try {
      const images = attachmentsList.filter(a => a.fileType === 'image').map(a => a.url);

      const res = await api.post(`/support/tickets/${activeTicket._id}/message`, {
        text: replyText.trim(),
        images,
        attachments: attachmentsList,
        videoUrl: videoUrl.trim()
      });

      if (res.data.success) {
        addToast('Message sent to AgriMachina specialists.', 'success');
        setActiveTicket(res.data.ticket);
        setReplyText('');
        setAttachmentsList([]);
        setVideoUrl('');
        setShowAttachmentDrawer(false);
        setTimeout(scrollToBottomInner, 50);
        fetchTickets(false);
      }
    } catch (error) {
      addToast(error.response?.data?.message || 'Failed to send message.', 'error');
    } finally {
      setSending(false);
    }
  };

  const handleCreateNewInquiry = async (e) => {
    e.preventDefault();
    if (!newSubject.trim() || !newMsg.trim()) {
      addToast('Please fill all required fields.', 'warning');
      return;
    }

    try {
      const images = newModalFiles.filter(a => a.fileType === 'image').map(a => a.url);

      const res = await api.post('/support/tickets', {
        name: user?.name || 'Farmer Friend',
        phone: user?.phone || '9027799171',
        email: user?.email || '',
        subject: newSubject.trim(),
        inquiryType: newTopic,
        message: newMsg.trim(),
        images,
        attachments: newModalFiles
      });

      if (res.data.success) {
        addToast('Your inquiry has been submitted! Support team will respond shortly.', 'success');
        setIsNewModalOpen(false);
        setNewSubject('');
        setNewMsg('');
        setNewModalFiles([]);
        fetchTickets(true);
        if (res.data.ticket) {
          handleOpenChatPopup(res.data.ticket);
        }
      }
    } catch (error) {
      addToast(error.response?.data?.message || 'Failed to create inquiry.', 'error');
    }
  };

  const filteredTickets = tickets.filter(t => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      t.subject?.toLowerCase().includes(q) ||
      t.productTitle?.toLowerCase().includes(q) ||
      t.ticketNumber?.toLowerCase().includes(q)
    );
  });

  if (!isAuthenticated) {
    return (
      <div className="container" style={{ padding: '5rem 1.5rem', textAlign: 'center' }}>
        <Headphones size={52} color="#166534" style={{ margin: '0 auto 1.25rem auto' }} />
        <h2 style={{ fontSize: '2rem', color: 'var(--text-main)', fontWeight: 900, marginBottom: '0.75rem' }}>
          Farmer Support & Technical Advisory Chat
        </h2>
        <p style={{ color: 'var(--text-muted)', maxWidth: '520px', margin: '0 auto 2rem auto', fontSize: '1rem' }}>
          Please login to view your support conversations, chat directly with certified agricultural engineers, and receive field advice.
        </p>
        <Link to="/login" className="btn btn-primary btn-lg" style={{ padding: '0.85rem 2rem', fontWeight: 800 }}>
          Login to Access Support Chat
        </Link>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '1.5rem 1rem 4rem 1rem' }}>
      {/* Top Banner & Heading with generous margin & responsive flex */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4" style={{ marginBottom: '2rem' }}>
        <div className="flex items-center gap-3.5">
          <div style={{ width: '46px', height: '46px', borderRadius: '13px', background: 'linear-gradient(135deg, #166534, #059669)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff', flexShrink: 0, boxShadow: '0 4px 12px rgba(22, 101, 52, 0.25)' }}>
            <Headphones size={24} color="#86efac" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 style={{ fontSize: 'clamp(1.2rem, 3.5vw, 1.75rem)', fontWeight: 900, color: 'var(--text-main)', margin: 0, letterSpacing: '-0.02em', lineHeight: 1.2 }}>
                My Support Inquiries & Advisory
              </h1>
              <span className="badge" style={{ background: '#dcfce7', color: '#166534', border: '1px solid var(--primary-400, #86efac)', fontWeight: 800, fontSize: '0.7rem', padding: '0.15rem 0.5rem', borderRadius: '999px' }}>
                🟢 24x7 Active
              </span>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '0.25rem 0 0 0', lineHeight: 1.4 }}>
              Chat directly with OEM Agricultural Engineers, request field demonstration videos, and track subsidy assistance.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
          <a
            href="tel:180024743276"
            className="btn btn-secondary btn-sm"
            style={{ fontWeight: 700, fontSize: '0.8rem', padding: '0.5rem 0.85rem', flex: '1 1 auto', justifyContent: 'center' }}
          >
            <PhoneCall size={14} color="#166534" />
            <span>1800-AGRI-FARM</span>
          </a>

          <button
            onClick={() => setIsNewModalOpen(true)}
            className="btn btn-primary btn-sm"
            style={{ fontWeight: 800, fontSize: '0.8rem', padding: '0.5rem 1rem', flex: '1 1 auto', justifyContent: 'center' }}
          >
            <Plus size={15} />
            <span>Start Inquiry</span>
          </button>
        </div>
      </div>

      {/* Main Inquiries Cards Grid with generous breathing space */}
      <div
        style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-color)',
          borderRadius: '20px',
          padding: '1.5rem',
          boxShadow: '0 8px 30px rgba(0,0,0,0.05)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem'
        }}
      >
        {/* Search Bar */}
        <div className="flex justify-between items-center flex-wrap gap-3">
          <div style={{ position: 'relative', flex: 1, minWidth: '260px', maxWidth: '420px' }}>
            <input
              type="text"
              placeholder="Search your conversations or machinery..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field"
              style={{ paddingLeft: '2.5rem', fontSize: '0.85rem' }}
            />
            <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)' }} />
          </div>

          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>
            Showing {filteredTickets.length} conversation(s)
          </div>
        </div>

        {/* Tickets Cards Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
          {loading ? (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem 1rem', color: 'var(--text-muted)' }}>
              <RefreshCw size={26} className="animate-spin" style={{ margin: '0 auto 0.75rem auto', color: '#166534' }} />
              <div style={{ fontSize: '0.95rem', fontWeight: 600 }}>Loading your conversations...</div>
            </div>
          ) : filteredTickets.length === 0 ? (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem 1.5rem', color: 'var(--text-muted)', background: 'var(--bg-surface-alt)', borderRadius: '16px' }}>
              <HelpCircle size={44} color="var(--border-color)" style={{ margin: '0 auto 1rem auto' }} />
              <div style={{ fontWeight: 800, color: 'var(--text-main)', fontSize: '1.15rem' }}>No Support Conversations Yet</div>
              <p style={{ fontSize: '0.875rem', marginTop: '0.35rem', maxWidth: '440px', margin: '0.35rem auto 1.5rem auto' }}>
                Have questions regarding machine attachments, subsidy documents, or 0% EMI? Click below to chat with an expert.
              </p>
              <button
                onClick={() => setIsNewModalOpen(true)}
                className="btn btn-primary btn-md"
                style={{ fontWeight: 800 }}
              >
                <Plus size={16} />
                <span>Start Your First Inquiry</span>
              </button>
            </div>
          ) : (
            filteredTickets.map((t) => {
              const lastMsg = t.messages && t.messages.length > 0 ? t.messages[t.messages.length - 1] : null;

              return (
                <div
                  key={t._id}
                  style={{
                    background: 'var(--bg-surface-alt)',
                    border: t.unreadByUser > 0 ? '1.5px solid #ef4444' : '1px solid var(--border-color)',
                    borderRadius: '16px',
                    padding: '1.35rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
                    transition: 'all 0.2s ease',
                    position: 'relative'
                  }}
                  className="hover:border-green-600 hover:shadow-md"
                >
                  {/* Floating Notification Badge at Top Right Corner */}
                  {t.unreadByUser > 0 && (
                    <div
                      className="animate-notif-badge"
                      style={{
                        position: 'absolute',
                        top: '-8px',
                        right: '-8px',
                        background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                        color: '#ffffff',
                        fontWeight: 900,
                        fontSize: '0.7rem',
                        padding: '0.2rem 0.6rem',
                        borderRadius: '999px',
                        boxShadow: '0 0 12px rgba(239, 68, 68, 0.8), 0 2px 6px rgba(0,0,0,0.2)',
                        border: '2px solid var(--bg-surface)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        zIndex: 10
                      }}
                    >
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--bg-surface)', display: 'inline-block' }} />
                      <span>{t.unreadByUser} NEW</span>
                    </div>
                  )}

                  <div>
                    {/* Header Row */}
                    <div className="flex justify-between items-start" style={{ marginBottom: '0.5rem' }}>
                      <div className="flex items-center gap-2">
                        <span style={{ fontWeight: 900, color: 'var(--text-main)', fontSize: '0.975rem', lineHeight: 1.3 }}>
                          {t.subject?.replace(/&amp;/g, '&')}
                        </span>
                      </div>

                      <div>
                        <span
                          className={t.status === 'In Progress' ? 'animate-in-progress-badge' : ''}
                          style={{
                            fontSize: '0.725rem',
                            fontWeight: 800,
                            padding: '0.22rem 0.6rem',
                            borderRadius: '8px',
                            background: t.status === 'Open' ? '#fee2e2' : t.status === 'In Progress' ? '#e0f2fe' : '#dcfce7',
                            color: t.status === 'Open' ? '#991b1b' : t.status === 'In Progress' ? '#0369a1' : '#166534',
                            border: t.status === 'Open' ? '1px solid #f87171' : t.status === 'In Progress' ? '1px solid #38bdf8' : '1px solid #4ade80',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.35rem'
                          }}
                        >
                          {t.status === 'In Progress' && (
                            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#0284c7', display: 'inline-block' }} />
                          )}
                          <span>{t.status}</span>
                        </span>
                      </div>
                    </div>

                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.6rem' }}>
                      Ticket #{t.ticketNumber || t._id.slice(-6).toUpperCase()} • {new Date(t.createdAt).toLocaleDateString()}
                    </div>

                    {/* Machinery tag if present */}
                    {t.productTitle && (
                      <div style={{ fontSize: '0.75rem', color: '#166534', background: '#dcfce7', border: '1px solid var(--primary-400, #86efac)', borderRadius: '6px', padding: '0.2rem 0.55rem', marginBottom: '0.6rem', display: 'inline-block', maxWidth: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: 700 }}>
                        🚜 {t.productTitle}
                      </div>
                    )}

                    {/* Subject */}
                    <div style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-main)', margin: '0.4rem 0 0.35rem 0' }}>
                      {decodeText(t.subject)}
                    </div>

                    {/* Machinery tag if present */}
                    {t.productTitle && (
                      <div style={{ fontSize: '0.75rem', color: '#166534', background: 'var(--primary-50)', border: '1px solid #bbf7d0', borderRadius: '6px', padding: '0.2rem 0.55rem', marginBottom: '0.6rem', display: 'inline-block', maxWidth: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        🚜 {decodeText(t.productTitle)} {t.productSku ? `(SKU: ${t.productSku})` : ''}
                      </div>
                    )}

                    {/* Last message snippet */}
                    {lastMsg && (
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', background: 'var(--bg-surface)', padding: '0.5rem 0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', marginBottom: '0.75rem', lineHeight: 1.4 }}>
                        <strong style={{ color: lastMsg.sender === 'user' ? '#166534' : '#0284c7' }}>
                          {lastMsg.sender === 'user' ? 'You: ' : 'Specialist: '}
                        </strong>
                        <span>{lastMsg.text || (lastMsg.attachments?.length > 0 ? '📎 File Attachment' : '📷 Media')}</span>
                      </div>
                    )}
                  </div>

                  {/* Open Chat Button */}
                  <div className="flex justify-between items-center" style={{ borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem', marginTop: '0.5rem' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      Updated: {new Date(t.lastMessageAt || t.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>

                    <button
                      type="button"
                      onClick={() => handleOpenChatPopup(t)}
                      style={{
                        background: 'linear-gradient(135deg, #166534, #15803d)',
                        border: '1px solid #22c55e',
                        color: '#ffffff',
                        fontWeight: 800,
                        fontSize: '0.775rem',
                        padding: '0.35rem 0.95rem',
                        borderRadius: '8px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        cursor: 'pointer',
                        boxShadow: '0 2px 8px rgba(22, 101, 52, 0.3)',
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
            background: 'var(--bg-surface)',
            border: isMaximized ? 'none' : '2px solid #16a34a',
            borderRadius: isMaximized ? '0px' : isMinimized ? '14px 14px 0 0' : '18px',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.4), 0 0 25px rgba(22, 163, 74, 0.25)',
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
            <div className="flex items-center gap-2.5" style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: 'var(--bg-surface)',
                  color: '#166534',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 900,
                  fontSize: '0.85rem',
                  flexShrink: 0,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.25)'
                }}
              >
                🛠️
              </div>
              <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                <div style={{ fontWeight: 800, fontSize: '0.875rem', color: '#ffffff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  AgriMachina Specialist Desk
                </div>
                {!isMinimized && (
                  <div style={{ fontSize: '0.7rem', color: '#dcfce7', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
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
                border: '1px solid rgba(255, 255, 255, 0.15)',
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
                onClick={() => setActiveTicket(null)}
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
                title="Close Chat Pop-up"
              >
                <X size={11} strokeWidth={2.8} />
              </button>
            </div>
          </div>

          {/* Pop-up Body (Hidden when minimized) */}
          {!isMinimized && (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: 'calc(100% - 48px)', overflow: 'hidden', background: 'var(--bg-surface)' }}>
              {/* Context Bar */}
              <div
                style={{
                  padding: '0.65rem 1.25rem',
                  background: 'var(--bg-surface-alt)',
                  borderBottom: '1px solid var(--border-color)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '0.75rem',
                  fontSize: '0.775rem'
                }}
              >
                <span style={{ color: '#16a34a', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  ● Verified Support Line
                  {activeTicket.productTitle && (
                    <span style={{ color: 'var(--text-muted)', fontWeight: 600, marginLeft: '0.35rem' }}>
                      • 🚜 {activeTicket.productTitle}
                    </span>
                  )}
                </span>

                <span style={{
                  fontSize: '0.7rem',
                  fontWeight: 800,
                  padding: '0.2rem 0.6rem',
                  borderRadius: '6px',
                  background: activeTicket.status === 'Open' ? '#fee2e2' : activeTicket.status === 'In Progress' ? '#e0f2fe' : '#dcfce7',
                  color: activeTicket.status === 'Open' ? '#991b1b' : activeTicket.status === 'In Progress' ? '#0369a1' : '#166534'
                }}>
                  {activeTicket.status}
                </span>
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
                  background: 'var(--bg-surface-alt)'
                }}
              >
                {activeTicket.messages?.map((msg, idx) => {
                  const isUser = msg.sender === 'user';
                  const embedVid = msg.videoUrl ? getYouTubeEmbedUrl(msg.videoUrl) : null;
                  const allAttachments = msg.attachments || [];

                  return (
                    <div
                      key={idx}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: isUser ? 'flex-end' : 'flex-start',
                        maxWidth: '85%',
                        alignSelf: isUser ? 'flex-end' : 'flex-start',
                        marginBottom: '0.5rem'
                      }}
                    >
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <strong style={{ color: isUser ? '#166534' : '#0284c7', fontWeight: 800 }}>
                          {isUser ? '🌾 You' : '🛠️ Specialist'}
                        </strong>
                        <span>•</span>
                        <span>{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>

                      <div
                        style={{
                          background: isUser ? '#166534' : 'var(--bg-surface)',
                          color: isUser ? '#ffffff' : 'var(--text-main)',
                          border: isUser ? 'none' : '1px solid var(--border-color)',
                          borderRadius: isUser ? '18px 18px 2px 18px' : '18px 18px 18px 2px',
                          padding: '0.85rem 1.2rem',
                          fontSize: '0.875rem',
                          lineHeight: 1.55,
                          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                          whiteSpace: 'pre-wrap',
                          wordBreak: 'break-word'
                        }}
                      >
                        {msg.text}

                        {/* Images */}
                        {((msg.images && msg.images.length > 0) || allAttachments.some(a => a.fileType === 'image')) && (
                          <div className="flex flex-wrap gap-2.5" style={{ marginTop: '0.65rem' }}>
                            {msg.images?.map((img, i) => (
                              <a key={`u-img-${i}`} href={img} target="_blank" rel="noreferrer">
                                <img
                                  src={img}
                                  alt="Attached"
                                  style={{ width: '110px', height: '80px', objectFit: 'cover', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.1)' }}
                                />
                              </a>
                            ))}
                            {allAttachments.filter(a => a.fileType === 'image').map((att, i) => (
                              <a key={`u-att-${i}`} href={att.url} target="_blank" rel="noreferrer">
                                <img
                                  src={att.url}
                                  alt={att.name || 'Attachment'}
                                  style={{ width: '110px', height: '80px', objectFit: 'cover', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.1)' }}
                                />
                              </a>
                            ))}
                          </div>
                        )}

                        {/* Document & PDF Attachments */}
                        {allAttachments.filter(a => a.fileType === 'document').map((att, i) => (
                          <a
                            key={`u-doc-${i}`}
                            href={att.url}
                            target="_blank"
                            rel="noreferrer"
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.5rem',
                              marginTop: '0.55rem',
                              padding: '0.45rem 0.75rem',
                              background: isUser ? 'rgba(255,255,255,0.15)' : 'var(--bg-surface-alt)',
                              borderRadius: '8px',
                              border: isUser ? '1px solid rgba(255,255,255,0.25)' : '1px solid var(--border-color)',
                              color: isUser ? '#ffffff' : 'var(--text-main)',
                              textDecoration: 'none',
                              fontSize: '0.775rem',
                              fontWeight: 700
                            }}
                          >
                            <FileText size={15} color={isUser ? '#fef08a' : '#166534'} />
                            <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {att.name || 'Document.pdf'}
                            </span>
                            <Download size={14} />
                          </a>
                        ))}

                        {/* Video */}
                        {msg.videoUrl && (
                          <div style={{ marginTop: '0.65rem', borderRadius: '8px', overflow: 'hidden' }}>
                            {embedVid ? (
                              <iframe
                                src={embedVid}
                                title="Video"
                                style={{ width: '100%', height: '160px', border: 'none' }}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                              />
                            ) : (
                              <a href={msg.videoUrl} target="_blank" rel="noreferrer" style={{ color: isUser ? '#fef08a' : '#166534', fontSize: '0.775rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                                <Play size={14} /> Watch Video Demo
                              </a>
                            )}
                          </div>
                        )}

                        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '0.25rem', marginTop: '0.35rem', fontSize: '0.65rem', color: isUser ? '#a7f3d0' : 'var(--text-muted)' }}>
                          <CheckCheck size={13} color={isUser ? '#a7f3d0' : '#16a34a'} />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Suggestions Quick Bar */}
              <div
                className="hide-scrollbar"
                style={{
                  padding: '0.4rem 0.85rem',
                  background: 'var(--bg-surface-alt)',
                  borderTop: '1px solid var(--border-color)',
                  display: 'flex',
                  gap: '0.4rem',
                  overflowX: 'auto',
                  alignItems: 'center'
                }}
              >
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700, whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '0.25rem', marginRight: '0.25rem' }}>
                  <Sparkles size={12} color="#166534" />
                  <span>Suggestions:</span>
                </span>
                {quickFarmerQuestions.map((q, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setReplyText(prev => (prev ? `${prev} ${q}` : q))}
                    style={{
                      fontSize: '0.7rem',
                      background: 'var(--bg-surface)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '14px',
                      padding: '0.25rem 0.65rem',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      color: 'var(--text-main)',
                      fontWeight: 600,
                      transition: 'all 0.15s ease'
                    }}
                    className="hover:border-green-600 hover:scale-105"
                  >
                    {q.slice(0, 26)}...
                  </button>
                ))}
              </div>

              {/* Drawer for photo link / video link / file upload */}
              {showAttachmentDrawer && (
                <div style={{ padding: '0.75rem 1rem', background: 'var(--bg-surface-alt)', borderTop: '1px solid var(--border-color)', display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
                  {/* File size & format guideline badge */}
                  <div style={{ width: '100%', fontSize: '0.7rem', color: '#15803d', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.2rem' }}>
                    <Sparkles size={12} color="#16a34a" />
                    <span>Max 5MB per file • Photos (JPG, PNG), PDFs, Word/Excel Docs & MP4 Field Videos</span>
                  </div>

                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={(e) => handleFileUpload(e, false)}
                    multiple
                    accept="image/*,application/pdf,video/mp4,.doc,.docx,.xls,.xlsx,.csv,.txt,.zip"
                    style={{ display: 'none' }}
                  />

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingFiles}
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      padding: '0.35rem 0.75rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      background: 'linear-gradient(135deg, #166534, #15803d)',
                      color: '#ffffff',
                      border: '1px solid #22c55e',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                      transition: 'all 0.15s ease'
                    }}
                    className="hover:scale-105"
                  >
                    <UploadCloud size={15} color="#ffffff" />
                    <span>{uploadingFiles ? 'Uploading...' : '📎 Choose Device File (Max 5MB)'}</span>
                  </button>

                  <div className="flex items-center gap-1.5" style={{ flex: 1, minWidth: '140px' }}>
                    <Camera size={14} color="#166534" />
                    <input
                      type="url"
                      placeholder="Paste Image Link..."
                      value={photoInput}
                      onChange={(e) => setPhotoInput(e.target.value)}
                      style={{ fontSize: '0.75rem', padding: '0.35rem 0.65rem', border: '1px solid var(--border-color)', borderRadius: '8px', flex: 1 }}
                    />
                    <button type="button" onClick={handleAddPhotoUrl} style={{ padding: '0.3rem 0.6rem', fontSize: '0.7rem', background: 'var(--primary-50)', border: '1px solid var(--primary-400, #86efac)', borderRadius: '6px', color: '#166534', fontWeight: 700, cursor: 'pointer' }}>
                      Add
                    </button>
                  </div>

                  <div className="flex items-center gap-1.5" style={{ flex: 1, minWidth: '140px' }}>
                    <Video size={14} color="#0284c7" />
                    <input
                      type="url"
                      placeholder="YouTube Demo Link..."
                      value={videoUrl}
                      onChange={(e) => setVideoUrl(e.target.value)}
                      style={{ fontSize: '0.75rem', padding: '0.35rem 0.65rem', border: '1px solid var(--border-color)', borderRadius: '8px', flex: 1 }}
                    />
                  </div>
                </div>
              )}

              {/* Compose Bar - Sleek Modern Capsule */}
              <form onSubmit={handleSendMessage} style={{ padding: '0.55rem 0.85rem', background: 'var(--bg-surface)', borderTop: '1px solid var(--border-color)' }}>
                {attachmentsList.length > 0 && (
                  <div className="flex gap-2" style={{ marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                    {attachmentsList.map((att, idx) => (
                      <span key={idx} style={{ background: 'var(--primary-50)', border: '1px solid var(--primary-400, #86efac)', borderRadius: '8px', padding: '0.2rem 0.6rem', fontSize: '0.725rem', color: '#166534', display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 600 }}>
                        <FileText size={13} color="#059669" />
                        <span style={{ maxWidth: '160px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{att.name}</span>
                        {att.size > 0 && <span style={{ fontSize: '0.68rem', color: '#15803d' }}>({formatFileSize(att.size)})</span>}
                        <button type="button" onClick={() => handleRemoveAttachment(idx, false)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#dc2626', fontWeight: 900, padding: '0 2px' }}>✕</button>
                      </span>
                    ))}
                  </div>
                )}

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    background: 'var(--bg-surface-alt)',
                    border: '1.5px solid var(--border-color)',
                    borderRadius: '24px',
                    padding: '0.25rem 0.45rem 0.25rem 0.65rem',
                    boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.06)'
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setShowAttachmentDrawer(!showAttachmentDrawer)}
                    style={{
                      background: showAttachmentDrawer ? 'rgba(34, 197, 94, 0.2)' : 'transparent',
                      border: 'none',
                      borderRadius: '50%',
                      width: '28px',
                      height: '28px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      color: showAttachmentDrawer ? '#15803d' : 'var(--text-muted)',
                      flexShrink: 0,
                      transition: 'all 0.15s ease'
                    }}
                    className="hover:text-green-600 hover:scale-110"
                    title="Attach File or Video Link"
                  >
                    <Paperclip size={15} />
                  </button>

                  <input
                    type="text"
                    placeholder="Type message to engineers... (Enter to send)"
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    style={{
                      flex: 1,
                      fontSize: '0.825rem',
                      background: 'transparent',
                      border: 'none',
                      outline: 'none',
                      color: 'var(--text-main)',
                      padding: '0.25rem 0'
                    }}
                  />

                  <button
                    type="submit"
                    disabled={sending || uploadingFiles || (!replyText.trim() && attachmentsList.length === 0)}
                    style={{
                      background: 'linear-gradient(135deg, #16a34a, #15803d)',
                      border: 'none',
                      color: '#ffffff',
                      borderRadius: '50%',
                      width: '32px',
                      height: '32px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      flexShrink: 0,
                      boxShadow: '0 2px 8px rgba(22, 163, 74, 0.35)',
                      opacity: (!replyText.trim() && attachmentsList.length === 0) ? 0.5 : 1,
                      transition: 'all 0.18s ease'
                    }}
                    className="hover:scale-110 hover:shadow-[0_0_12px_rgba(22,163,74,0.6)] active:scale-95"
                    title="Send Message"
                  >
                    <Send size={14} />
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}

      {/* New Inquiry Modal */}
      <Modal
        isOpen={isNewModalOpen}
        onClose={() => setIsNewModalOpen(false)}
        title="Start a New Support Inquiry"
        maxWidth="540px"
      >
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
          Our certified agricultural engineers will review your question and respond in this chat.
        </p>

        <form onSubmit={handleCreateNewInquiry} className="flex flex-col gap-3">
          <div className="input-group">
            <label className="input-label" style={{ color: 'var(--text-main)', fontWeight: 700 }}>Inquiry Subject *</label>
            <input
              type="text"
              required
              className="input-field"
              value={newSubject}
              onChange={(e) => setNewSubject(e.target.value)}
              placeholder="e.g. Query regarding power weeder blade attachment"
            />
          </div>

          <div className="input-group">
            <label className="input-label" style={{ color: 'var(--text-main)', fontWeight: 700 }}>Topic</label>
            <select className="select-field" value={newTopic} onChange={(e) => setNewTopic(e.target.value)}>
              <option value="Technical Guidance">Technical Guidance & Performance</option>
              <option value="Govt Subsidy Assistance">Govt. SMAM / DBT Subsidy Assistance</option>
              <option value="0% EMI Financing">0% No-Cost EMI & Bank Loan Support</option>
              <option value="Order & Delivery Tracking">Order Dispatch & Delivery Tracking</option>
              <option value="Spare Parts & Warranty">Spare Parts Replacement & Warranty</option>
            </select>
          </div>

          <div className="input-group">
            <label className="input-label" style={{ color: 'var(--text-main)', fontWeight: 700 }}>Your Message *</label>
            <textarea
              rows="4"
              required
              className="textarea-field"
              value={newMsg}
              onChange={(e) => setNewMsg(e.target.value)}
              placeholder="Describe your question or requirement..."
            />
          </div>

          <div>
            <input
              type="file"
              ref={modalFileInputRef}
              onChange={(e) => handleFileUpload(e, true)}
              multiple
              accept="image/*,application/pdf,video/mp4"
              style={{ display: 'none' }}
            />
            <button
              type="button"
              onClick={() => modalFileInputRef.current?.click()}
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '0.75rem', fontWeight: 700 }}
            >
              <UploadCloud size={14} color="#166534" />
              <span>Attach Photos / Field Documents (Optional)</span>
            </button>

            {newModalFiles.length > 0 && (
              <div className="flex gap-1.5" style={{ marginTop: '0.5rem', flexWrap: 'wrap' }}>
                {newModalFiles.map((att, idx) => (
                  <span key={idx} style={{ background: 'var(--primary-50)', border: '1px solid var(--primary-400, #86efac)', borderRadius: '4px', padding: '0.15rem 0.45rem', fontSize: '0.7rem', color: '#166534', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    {att.name}
                    <button type="button" onClick={() => handleRemoveAttachment(idx, true)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#dc2626' }}>✕</button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2" style={{ marginTop: '0.5rem' }}>
            <button type="button" onClick={() => setIsNewModalOpen(false)} className="btn btn-secondary btn-sm">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary btn-sm">
              Submit Inquiry
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default UserSupportPage;
