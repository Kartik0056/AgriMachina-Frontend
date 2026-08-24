import React, { useState, useEffect, useRef } from 'react';
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
  ArrowLeft
} from 'lucide-react';
import adminApi from '../../services/adminApi';
import { useToast } from '../../context/ToastContext';

const getYouTubeEmbedUrl = (url) => {
  if (!url) return null;
  const ytMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
  if (ytMatch && ytMatch[1]) {
    return `https://www.youtube.com/embed/${ytMatch[1]}`;
  }
  return null;
};

const quickCannedReplies = [
  'Namaste Kisan Bhai! Yeh machine cotton aur sugarcane kheti ke liye 100% suitable hai.',
  'Aapka DBT / SMAM Govt. Subsidy invoice generate kar diya gaya hai.',
  'Hamare certified agricultural engineer ne aapki field requirements note kar li hain.',
  'Machine 100% Free Palletized transport se 4-5 business days me deliver ho jayegi.',
  'Is model par SBI Kisan Credit aur HDFC par 0% No-Cost EMI uplabdh hai.'
];

const AdminSupportPage = () => {
  const [tickets, setTickets] = useState([]);
  const [stats, setStats] = useState({ openCount: 0, inProgressCount: 0, unreadCount: 0 });
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');
  const [search, setSearch] = useState('');

  // Reply Form State
  const [replyText, setReplyText] = useState('');
  const [photoInput, setPhotoInput] = useState('');
  const [photosList, setPhotosList] = useState([]);
  const [videoUrl, setVideoUrl] = useState('');
  const [newStatus, setNewStatus] = useState('');
  const [sending, setSending] = useState(false);

  const { addToast } = useToast();
  const chatBottomRef = useRef(null);

  const fetchTickets = async (showLoading = false) => {
    if (showLoading) setLoading(true);
    try {
      const res = await adminApi.get('/support/admin/tickets', {
        params: { status: statusFilter, search }
      });
      if (res.data.success) {
        setTickets(res.data.tickets || []);
        setStats(res.data.stats || { openCount: 0, inProgressCount: 0, unreadCount: 0 });

        // Update active ticket if currently selected
        if (selectedTicket) {
          const updated = (res.data.tickets || []).find(t => t._id === selectedTicket._id);
          if (updated) setSelectedTicket(updated);
        }
      }
    } catch (error) {
      console.error('Failed to load support tickets:', error);
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets(true);
    const interval = setInterval(() => fetchTickets(false), 8000);
    return () => clearInterval(interval);
  }, [statusFilter, search]);

  const handleSelectTicket = async (ticket) => {
    try {
      const res = await adminApi.get(`/support/admin/tickets/${ticket._id}`);
      if (res.data.success) {
        setSelectedTicket(res.data.ticket);
        setNewStatus(res.data.ticket.status);
        fetchTickets(false);
      }
    } catch (error) {
      setSelectedTicket(ticket);
    }
  };

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedTicket?.messages]);

  const handleAddPhoto = (e) => {
    e.preventDefault();
    if (!photoInput.trim()) return;
    setPhotosList(prev => [...prev, photoInput.trim()]);
    setPhotoInput('');
  };

  const handleSendReply = async (e) => {
    e.preventDefault();
    if ((!replyText || !replyText.trim()) && photosList.length === 0 && !videoUrl) {
      addToast('Please enter a reply message or attach media.', 'warning');
      return;
    }

    setSending(true);
    try {
      const res = await adminApi.post(`/support/admin/tickets/${selectedTicket._id}/reply`, {
        text: replyText.trim(),
        images: photosList,
        videoUrl: videoUrl.trim(),
        status: newStatus || selectedTicket.status
      });

      if (res.data.success) {
        addToast('Reply dispatched to customer successfully!', 'success');
        setSelectedTicket(res.data.ticket);
        setReplyText('');
        setPhotosList([]);
        setVideoUrl('');
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
      await adminApi.put(`/support/admin/tickets/${selectedTicket._id}/status`, { status });
      addToast(`Ticket status updated to ${status}`, 'success');
      setSelectedTicket(prev => ({ ...prev, status }));
      fetchTickets(false);
    } catch (error) {
      addToast('Failed to update status.', 'error');
    }
  };

  return (
    <div className="flex flex-col gap-6" style={{ minHeight: 'calc(100vh - 120px)' }}>
      {/* Top Banner & KPI Summary */}
      <div className="flex justify-between items-center" style={{ flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', color: '#062416', fontWeight: 900 }}>
            Customer Inquiries & Live Support Desk
          </h1>
          <p style={{ fontSize: '0.875rem', color: '#64748b' }}>
            Answer farmer questions, provide agronomy advisory, share machinery video demos, and resolve queries.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => fetchTickets(true)}
            className="btn btn-secondary btn-sm"
            style={{ background: '#ffffff' }}
          >
            <RefreshCw size={14} />
            <span>Sync Tickets</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.25rem' }}>
          <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Total Inquiries</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#062416', marginTop: '0.25rem' }}>{tickets.length}</div>
        </div>

        <div style={{ background: '#ffffff', border: '1px solid #fed7aa', borderRadius: '12px', padding: '1.25rem' }}>
          <div style={{ fontSize: '0.8rem', color: '#ea580c', fontWeight: 700, textTransform: 'uppercase' }}>Open / Needs Reply</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#c2410c', marginTop: '0.25rem' }}>{stats.openCount}</div>
        </div>

        <div style={{ background: '#ffffff', border: '1px solid #bae6fd', borderRadius: '12px', padding: '1.25rem' }}>
          <div style={{ fontSize: '0.8rem', color: '#0284c7', fontWeight: 700, textTransform: 'uppercase' }}>In Progress</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#0369a1', marginTop: '0.25rem' }}>{stats.inProgressCount}</div>
        </div>

        <div style={{ background: '#ffffff', border: '1px solid #bbf7d0', borderRadius: '12px', padding: '1.25rem' }}>
          <div style={{ fontSize: '0.8rem', color: '#16a34a', fontWeight: 700, textTransform: 'uppercase' }}>Unread Customer Messages</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#15803d', marginTop: '0.25rem' }}>{stats.unreadCount}</div>
        </div>
      </div>

      {/* Main Workspace Split (List Left 380px, Chat Right Flex) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" style={{ flex: 1, minHeight: '600px' }}>
        {/* Left Column: Tickets List */}
        <div className="lg:col-span-4 flex flex-col gap-3" style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '1.25rem', height: '700px' }}>
          {/* Search & Filter */}
          <div className="flex flex-col gap-2">
            <div className="relative">
              <input
                type="text"
                className="input-field"
                placeholder="Search by farmer name, phone, SKU..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ fontSize: '0.85rem', paddingLeft: '2.25rem' }}
              />
              <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }} />
            </div>

            <div className="flex gap-1 overflow-x-auto pb-1">
              {['All', 'Open', 'In Progress', 'Resolved', 'Closed'].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setStatusFilter(s)}
                  style={{
                    padding: '0.25rem 0.6rem',
                    borderRadius: '16px',
                    fontSize: '0.725rem',
                    fontWeight: statusFilter === s ? 800 : 600,
                    background: statusFilter === s ? '#166534' : '#f1f5f9',
                    color: statusFilter === s ? '#ffffff' : '#475569',
                    border: 'none',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Tickets Scroll Area */}
          <div className="flex flex-col gap-2 overflow-y-auto flex-1 pr-1">
            {loading ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>Loading inquiries...</div>
            ) : tickets.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#64748b' }}>
                <MessageSquare size={32} color="#cbd5e1" style={{ margin: '0 auto 0.5rem auto' }} />
                <div style={{ fontWeight: 700, color: '#0f172a' }}>No inquiries found</div>
                <p style={{ fontSize: '0.8rem' }}>No customer tickets match your search criteria.</p>
              </div>
            ) : (
              tickets.map((t) => {
                const isSelected = selectedTicket && selectedTicket._id === t._id;
                const lastMsg = t.messages && t.messages.length > 0 ? t.messages[t.messages.length - 1] : null;

                return (
                  <div
                    key={t._id}
                    onClick={() => handleSelectTicket(t)}
                    style={{
                      padding: '0.85rem',
                      borderRadius: '12px',
                      border: isSelected ? '2px solid #166534' : '1px solid #e2e8f0',
                      background: isSelected ? '#f0fdf4' : t.unreadByAdmin > 0 ? '#fefce8' : '#ffffff',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      position: 'relative'
                    }}
                    className="hover:border-green-600"
                  >
                    <div className="flex justify-between items-start" style={{ marginBottom: '0.25rem' }}>
                      <div className="flex items-center gap-1.5">
                        <span style={{ fontWeight: 800, color: '#0f172a', fontSize: '0.9rem' }}>
                          {t.userName}
                        </span>
                        {t.unreadByAdmin > 0 && (
                          <span className="badge badge-accent" style={{ fontSize: '0.65rem', background: '#dc2626', color: '#ffffff' }}>
                            {t.unreadByAdmin} NEW
                          </span>
                        )}
                      </div>

                      <span style={{
                        fontSize: '0.65rem',
                        fontWeight: 800,
                        padding: '0.15rem 0.45rem',
                        borderRadius: '4px',
                        background: t.status === 'Open' ? '#fee2e2' : t.status === 'In Progress' ? '#e0f2fe' : '#dcfce7',
                        color: t.status === 'Open' ? '#991b1b' : t.status === 'In Progress' ? '#0369a1' : '#166534'
                      }}>
                        {t.status}
                      </span>
                    </div>

                    <div style={{ fontSize: '0.775rem', fontWeight: 700, color: '#166534', marginBottom: '0.25rem' }}>
                      {t.subject}
                    </div>

                    {lastMsg && (
                      <div style={{ fontSize: '0.775rem', color: '#64748b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        <strong>{lastMsg.sender === 'admin' ? 'You: ' : ''}</strong>{lastMsg.text || 'Attached Media'}
                      </div>
                    )}

                    <div className="flex justify-between items-center" style={{ marginTop: '0.35rem', fontSize: '0.7rem', color: '#94a3b8' }}>
                      <span>📞 {t.userPhone}</span>
                      <span>{new Date(t.lastMessageAt || t.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Active Conversation Workspace */}
        <div className="lg:col-span-8" style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', display: 'flex', flexDirection: 'column', height: '700px', overflow: 'hidden' }}>
          {selectedTicket ? (
            <>
              {/* Active Conversation Header */}
              <div style={{ padding: '1rem 1.5rem', background: '#f8fafc', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 style={{ fontSize: '1.15rem', color: '#062416', fontWeight: 900 }}>
                      {selectedTicket.userName}
                    </h3>
                    <span className="badge badge-secondary" style={{ fontSize: '0.7rem' }}>
                      Ticket: {selectedTicket.ticketNumber}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b', display: 'flex', gap: '1rem', marginTop: '0.2rem' }}>
                    <span>📞 <strong>{selectedTicket.userPhone}</strong></span>
                    {selectedTicket.userEmail && <span>✉️ {selectedTicket.userEmail}</span>}
                    {selectedTicket.productTitle && (
                      <span style={{ color: '#166534', fontWeight: 700 }}>
                        🚜 {selectedTicket.productTitle} {selectedTicket.productSku ? `(SKU: ${selectedTicket.productSku})` : ''}
                      </span>
                    )}
                  </div>
                </div>

                {/* Status Selector */}
                <div className="flex items-center gap-2">
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#334155' }}>Status:</span>
                  <select
                    className="select-field"
                    value={selectedTicket.status}
                    onChange={(e) => handleStatusChange(e.target.value)}
                    style={{ fontSize: '0.8rem', padding: '0.35rem 0.75rem' }}
                  >
                    <option value="Open">Open</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>
              </div>

              {/* Chat Message History */}
              <div style={{ flex: 1, padding: '1.25rem', overflowY: 'auto', background: '#f8fafc', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {selectedTicket.messages?.map((msg, idx) => {
                  const isAdmin = msg.sender === 'admin';
                  const embedVid = getYouTubeEmbedUrl(msg.videoUrl);

                  return (
                    <div
                      key={idx}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: isAdmin ? 'flex-end' : 'flex-start'
                      }}
                    >
                      <div className="flex items-center gap-1.5" style={{ fontSize: '0.725rem', color: '#64748b', marginBottom: '0.25rem' }}>
                        <span>{isAdmin ? '🛠️ AgriMachina Support Engineer' : `🌾 Farmer: ${selectedTicket.userName}`}</span>
                        <span>•</span>
                        <span>{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>

                      <div
                        style={{
                          maxWidth: '75%',
                          padding: '0.85rem 1.1rem',
                          borderRadius: isAdmin ? '16px 16px 2px 16px' : '16px 16px 16px 2px',
                          background: isAdmin ? '#166534' : '#ffffff',
                          color: isAdmin ? '#ffffff' : '#0f172a',
                          border: isAdmin ? 'none' : '1px solid #e2e8f0',
                          fontSize: '0.875rem',
                          lineHeight: 1.5,
                          boxShadow: '0 2px 4px rgba(0,0,0,0.04)',
                          whiteSpace: 'pre-line'
                        }}
                      >
                        {msg.text}

                        {/* Photos */}
                        {msg.images && msg.images.length > 0 && (
                          <div className="flex gap-2" style={{ marginTop: '0.5rem', flexWrap: 'wrap' }}>
                            {msg.images.map((img, i) => (
                              <a key={i} href={img} target="_blank" rel="noreferrer">
                                <img
                                  src={img}
                                  alt="Attached"
                                  style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                                />
                              </a>
                            ))}
                          </div>
                        )}

                        {/* Video */}
                        {msg.videoUrl && (
                          <div style={{ marginTop: '0.5rem', borderRadius: '8px', overflow: 'hidden', border: '1px solid #cbd5e1' }}>
                            {embedVid ? (
                              <iframe
                                src={embedVid}
                                title="Video Demo"
                                style={{ width: '100%', height: '180px', border: 'none' }}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                              />
                            ) : msg.videoUrl.endsWith('.mp4') || msg.videoUrl.includes('mp4') ? (
                              <video src={msg.videoUrl} controls style={{ width: '100%', height: '180px', objectFit: 'contain', background: '#000000' }} />
                            ) : (
                              <a href={msg.videoUrl} target="_blank" rel="noreferrer" style={{ color: isAdmin ? '#fef08a' : '#166534', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                                <Play size={13} /> Watch Shared Video Demo
                              </a>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
                <div ref={chatBottomRef} />
              </div>

              {/* Quick Canned Suggestions */}
              <div style={{ padding: '0.4rem 1rem', background: '#ffffff', borderTop: '1px solid #e2e8f0', display: 'flex', gap: '0.4rem', overflowX: 'auto', whiteSpace: 'nowrap' }}>
                <span style={{ fontSize: '0.725rem', fontWeight: 800, color: '#64748b', alignSelf: 'center' }}>Quick:</span>
                {quickCannedReplies.map((q, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setReplyText(q)}
                    style={{
                      background: '#f1f5f9',
                      border: '1px solid #cbd5e1',
                      borderRadius: '12px',
                      padding: '0.2rem 0.5rem',
                      fontSize: '0.7rem',
                      color: '#1e293b',
                      cursor: 'pointer',
                      flexShrink: 0
                    }}
                    className="hover:bg-green-100"
                  >
                    💬 {q.slice(0, 32)}...
                  </button>
                ))}
              </div>

              {/* Admin Reply Composer Form */}
              <form onSubmit={handleSendReply} style={{ padding: '1rem', background: '#ffffff', borderTop: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div className="flex gap-2">
                  <textarea
                    rows="2"
                    className="textarea-field"
                    style={{ flex: 1, fontSize: '0.85rem' }}
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Type technical advice, warranty info, or instructions for the farmer..."
                  />
                  <button
                    type="submit"
                    disabled={sending}
                    className="btn btn-primary"
                    style={{ height: 'auto', alignSelf: 'stretch', padding: '0 1.25rem' }}
                  >
                    <Send size={16} />
                    <span>{sending ? 'Sending...' : 'Reply'}</span>
                  </button>
                </div>

                {/* Media Attachment Inputs Strip */}
                <div className="flex items-center gap-2" style={{ flexWrap: 'wrap' }}>
                  <div className="flex items-center gap-1" style={{ flex: 1, minWidth: '220px' }}>
                    <Camera size={15} color="#166534" />
                    <input
                      type="url"
                      className="input-field"
                      style={{ fontSize: '0.75rem', padding: '0.35rem 0.6rem' }}
                      value={photoInput}
                      onChange={(e) => setPhotoInput(e.target.value)}
                      placeholder="Attach Photo URL"
                    />
                    <button type="button" onClick={handleAddPhoto} className="btn btn-secondary btn-sm" style={{ padding: '0.25rem 0.5rem', fontSize: '0.7rem' }}>
                      Add
                    </button>
                  </div>

                  <div className="flex items-center gap-1" style={{ flex: 1, minWidth: '220px' }}>
                    <Video size={15} color="#166534" />
                    <input
                      type="url"
                      className="input-field"
                      style={{ fontSize: '0.75rem', padding: '0.35rem 0.6rem' }}
                      value={videoUrl}
                      onChange={(e) => setVideoUrl(e.target.value)}
                      placeholder="Attach YouTube / Video Demo Link"
                    />
                  </div>
                </div>

                {/* Attached Photo Tags */}
                {photosList.length > 0 && (
                  <div className="flex gap-1.5" style={{ flexWrap: 'wrap' }}>
                    {photosList.map((p, idx) => (
                      <span key={idx} style={{ background: '#f0fdf4', border: '1px solid #86efac', borderRadius: '4px', padding: '0.1rem 0.4rem', fontSize: '0.7rem', color: '#166534', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        📷 Photo {idx + 1}
                        <button type="button" onClick={() => setPhotosList(photosList.filter((_, i) => i !== idx))} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#dc2626' }}>✕</button>
                      </span>
                    ))}
                  </div>
                )}
              </form>
            </>
          ) : (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#64748b', padding: '2rem' }}>
              <MessageSquare size={48} color="#cbd5e1" style={{ marginBottom: '1rem' }} />
              <h3 style={{ fontSize: '1.2rem', color: '#0f172a', fontWeight: 800 }}>
                Select an Inquiry to Start Support Conversation
              </h3>
              <p style={{ fontSize: '0.85rem', maxWidth: '400px', textAlign: 'center', marginTop: '0.35rem' }}>
                Click on any farmer inquiry on the left panel to review questions, send live replies, and attach video demonstrations.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminSupportPage;
