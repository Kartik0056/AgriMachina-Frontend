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
  CheckCircle2,
  ShieldCheck,
  Headphones,
  Tractor,
  HelpCircle
} from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Link } from 'react-router-dom';

const getYouTubeEmbedUrl = (url) => {
  if (!url) return null;
  const ytMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
  if (ytMatch && ytMatch[1]) {
    return `https://www.youtube.com/embed/${ytMatch[1]}`;
  }
  return null;
};

const UserSupportPage = () => {
  const { user, isAuthenticated } = useAuth();
  const { addToast } = useToast();

  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [loading, setLoading] = useState(true);

  // New Message Form State
  const [replyText, setReplyText] = useState('');
  const [photoInput, setPhotoInput] = useState('');
  const [photosList, setPhotosList] = useState([]);
  const [videoUrl, setVideoUrl] = useState('');
  const [sending, setSending] = useState(false);

  // New Inquiry Modal State
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [newSubject, setNewSubject] = useState('');
  const [newTopic, setNewTopic] = useState('Technical Guidance');
  const [newMsg, setNewMsg] = useState('');

  const chatBottomRef = useRef(null);

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

        if (selectedTicket) {
          const updated = fetched.find(t => t._id === selectedTicket._id);
          if (updated) setSelectedTicket(updated);
        } else if (fetched.length > 0) {
          setSelectedTicket(fetched[0]);
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
    const interval = setInterval(() => fetchTickets(false), 5000); // Live 5s auto-polling
    return () => clearInterval(interval);
  }, [isAuthenticated]);

  const handleSelectTicket = async (t) => {
    try {
      const res = await api.get(`/support/tickets/${t._id}`);
      if (res.data.success) {
        setSelectedTicket(res.data.ticket);
        fetchTickets(false);
      }
    } catch (error) {
      setSelectedTicket(t);
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

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if ((!replyText || !replyText.trim()) && photosList.length === 0 && !videoUrl) {
      addToast('Please enter a message or attach photos/video.', 'warning');
      return;
    }

    setSending(true);
    try {
      const res = await api.post(`/support/tickets/${selectedTicket._id}/message`, {
        text: replyText.trim(),
        images: photosList,
        videoUrl: videoUrl.trim()
      });

      if (res.data.success) {
        addToast('Message sent to AgriMachina support team.', 'success');
        setSelectedTicket(res.data.ticket);
        setReplyText('');
        setPhotosList([]);
        setVideoUrl('');
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
      addToast('Please fill all fields.', 'warning');
      return;
    }

    try {
      const res = await api.post('/support/tickets', {
        name: user?.name || 'Farmer Friend',
        phone: user?.phone || '9027799171',
        email: user?.email || '',
        subject: newSubject.trim(),
        inquiryType: newTopic,
        message: newMsg.trim()
      });

      if (res.data.success) {
        addToast('Your new inquiry has been submitted! Support team will respond shortly.', 'success');
        setIsNewModalOpen(false);
        setNewSubject('');
        setNewMsg('');
        fetchTickets(true);
        if (res.data.ticket) setSelectedTicket(res.data.ticket);
      }
    } catch (error) {
      addToast(error.response?.data?.message || 'Failed to create inquiry.', 'error');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="container" style={{ padding: '4rem 1rem', textAlign: 'center' }}>
        <Headphones size={48} color="#166534" style={{ margin: '0 auto 1rem auto' }} />
        <h2 style={{ fontSize: '1.75rem', color: '#062416', fontWeight: 900, marginBottom: '0.5rem' }}>
          Farmer Support & Technical Messages
        </h2>
        <p style={{ color: '#64748b', maxWidth: '480px', margin: '0 auto 1.5rem auto' }}>
          Please login to view your support conversation history and chat directly with our certified agricultural engineers.
        </p>
        <Link to="/login" className="btn btn-primary btn-lg">
          Login to Access Support Desk
        </Link>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '2.5rem 1.25rem 4rem 1.25rem' }}>
      {/* Header */}
      <div className="flex justify-between items-center" style={{ marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <span className="badge badge-primary" style={{ marginBottom: '0.4rem' }}>
            🛠️ 24x7 Certified Agronomy & Technical Support
          </span>
          <h1 style={{ fontSize: '2rem', color: '#062416', fontWeight: 900 }}>
            My Support Inquiries & Messages
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
            Chat live with AgriMachina technical specialists, get machinery advice, and share field videos.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsNewModalOpen(true)}
            className="btn btn-primary"
          >
            <Plus size={16} />
            <span>New Inquiry</span>
          </button>
        </div>
      </div>

      {/* Main Split Layout: Inquiries List (4 Cols) & Active Chat (8 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" style={{ minHeight: '620px' }}>
        {/* Left Column: My Tickets List */}
        <div className="lg:col-span-4 flex flex-col gap-3" style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '1.25rem', height: '650px' }}>
          <div className="flex justify-between items-center" style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '0.75rem' }}>
            <h3 style={{ fontSize: '1.05rem', color: '#062416', fontWeight: 800 }}>
              All Conversations ({tickets.length})
            </h3>
            <button onClick={() => fetchTickets(true)} className="btn btn-secondary btn-sm" style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem' }}>
              <RefreshCw size={12} />
              <span>Refresh</span>
            </button>
          </div>

          <div className="flex flex-col gap-2 overflow-y-auto flex-1 pr-1">
            {loading ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>Loading messages...</div>
            ) : tickets.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#64748b' }}>
                <HelpCircle size={32} color="#cbd5e1" style={{ margin: '0 auto 0.5rem auto' }} />
                <div style={{ fontWeight: 700, color: '#0f172a' }}>No support conversations yet</div>
                <p style={{ fontSize: '0.8rem', marginTop: '0.25rem' }}>
                  Have questions about subsidies, 0% EMI, or spare parts? Start an inquiry below.
                </p>
                <button onClick={() => setIsNewModalOpen(true)} className="btn btn-primary btn-sm" style={{ marginTop: '1rem' }}>
                  Start First Inquiry
                </button>
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
                      background: isSelected ? '#f0fdf4' : t.unreadByUser > 0 ? '#fefce8' : '#ffffff',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                    className="hover:border-green-600"
                  >
                    <div className="flex justify-between items-start" style={{ marginBottom: '0.25rem' }}>
                      <div className="flex items-center gap-1.5">
                        <span style={{ fontWeight: 800, color: '#0f172a', fontSize: '0.875rem' }}>
                          {t.subject}
                        </span>
                        {t.unreadByUser > 0 && (
                          <span className="badge badge-accent" style={{ fontSize: '0.65rem', background: '#dc2626', color: '#ffffff' }}>
                            {t.unreadByUser} NEW
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

                    {t.productTitle && (
                      <div style={{ fontSize: '0.75rem', color: '#166534', fontWeight: 700, marginBottom: '0.2rem' }}>
                        🚜 {t.productTitle}
                      </div>
                    )}

                    {lastMsg && (
                      <div style={{ fontSize: '0.775rem', color: '#64748b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        <strong>{lastMsg.sender === 'admin' ? 'Support Team: ' : 'You: '}</strong>
                        {lastMsg.text || 'Attached media'}
                      </div>
                    )}

                    <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '0.35rem', textAlign: 'right' }}>
                      {new Date(t.lastMessageAt || t.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Interactive Chat Panel */}
        <div className="lg:col-span-8" style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', display: 'flex', flexDirection: 'column', height: '650px', overflow: 'hidden' }}>
          {selectedTicket ? (
            <>
              {/* Chat Header */}
              <div style={{ padding: '1rem 1.5rem', background: '#f8fafc', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 style={{ fontSize: '1.1rem', color: '#062416', fontWeight: 900 }}>
                      {selectedTicket.subject}
                    </h3>
                    <span className="badge badge-secondary" style={{ fontSize: '0.7rem' }}>
                      #{selectedTicket.ticketNumber}
                    </span>
                  </div>
                  {selectedTicket.productTitle && (
                    <div style={{ fontSize: '0.775rem', color: '#166534', fontWeight: 700, marginTop: '0.2rem' }}>
                      Inquiry for: {selectedTicket.productTitle} {selectedTicket.productSku ? `(SKU: ${selectedTicket.productSku})` : ''}
                    </div>
                  )}
                </div>

                <span style={{
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  padding: '0.25rem 0.65rem',
                  borderRadius: '20px',
                  background: selectedTicket.status === 'Open' ? '#fee2e2' : selectedTicket.status === 'In Progress' ? '#e0f2fe' : '#dcfce7',
                  color: selectedTicket.status === 'Open' ? '#991b1b' : selectedTicket.status === 'In Progress' ? '#0369a1' : '#166534'
                }}>
                  ● {selectedTicket.status}
                </span>
              </div>

              {/* Messages History List */}
              <div style={{ flex: 1, padding: '1.25rem', overflowY: 'auto', background: '#f8fafc', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', padding: '0.6rem 0.85rem', fontSize: '0.775rem', color: '#166534', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <ShieldCheck size={16} color="#16a34a" />
                  <span>You are connected directly with AgriMachina's Certified Agricultural Engineering Desk.</span>
                </div>

                {selectedTicket.messages?.map((msg, idx) => {
                  const isMine = msg.sender === 'user';
                  const embedVid = getYouTubeEmbedUrl(msg.videoUrl);

                  return (
                    <div
                      key={idx}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: isMine ? 'flex-end' : 'flex-start'
                      }}
                    >
                      <div className="flex items-center gap-1.5" style={{ fontSize: '0.725rem', color: '#64748b', marginBottom: '0.25rem' }}>
                        <span>{isMine ? '🌾 You (Farmer)' : '🛠️ AgriMachina Support Specialist'}</span>
                        <span>•</span>
                        <span>{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>

                      <div
                        style={{
                          maxWidth: '75%',
                          padding: '0.85rem 1.1rem',
                          borderRadius: isMine ? '16px 16px 2px 16px' : '16px 16px 16px 2px',
                          background: isMine ? '#166534' : '#ffffff',
                          color: isMine ? '#ffffff' : '#0f172a',
                          border: isMine ? 'none' : '1px solid #e2e8f0',
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

                        {/* Video Player */}
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
                              <a href={msg.videoUrl} target="_blank" rel="noreferrer" style={{ color: isMine ? '#fef08a' : '#166534', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                                <Play size={13} /> Watch Shared Video
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

              {/* Reply Form */}
              <form onSubmit={handleSendMessage} style={{ padding: '1rem', background: '#ffffff', borderTop: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div className="flex gap-2">
                  <textarea
                    rows="2"
                    className="textarea-field"
                    style={{ flex: 1, fontSize: '0.85rem' }}
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Type your message, field questions, or reply to the support team..."
                  />
                  <button
                    type="submit"
                    disabled={sending}
                    className="btn btn-primary"
                    style={{ height: 'auto', alignSelf: 'stretch', padding: '0 1.25rem' }}
                  >
                    <Send size={16} />
                    <span>{sending ? 'Sending...' : 'Send'}</span>
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
                      placeholder="Attach Video / YouTube Demo Link"
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
                Select a Support Conversation
              </h3>
              <p style={{ fontSize: '0.85rem', maxWidth: '400px', textAlign: 'center', marginTop: '0.35rem' }}>
                Click any inquiry on the left to review engineer answers and chat live.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* New Inquiry Modal */}
      {isNewModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ background: '#ffffff', borderRadius: '16px', maxWidth: '520px', width: '100%', padding: '1.75rem', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.2)' }}>
            <h3 style={{ fontSize: '1.3rem', color: '#062416', fontWeight: 900, marginBottom: '0.5rem' }}>
              Start a New Support Inquiry
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '1.25rem' }}>
              Our agricultural engineers will review your question and respond in this chat.
            </p>

            <form onSubmit={handleCreateNewInquiry} className="flex flex-col gap-3">
              <div className="input-group">
                <label className="input-label">Inquiry Subject *</label>
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
                <label className="input-label">Topic</label>
                <select className="select-field" value={newTopic} onChange={(e) => setNewTopic(e.target.value)}>
                  <option value="Technical Guidance">Technical Guidance & Performance</option>
                  <option value="Govt Subsidy Assistance">Govt. SMAM / DBT Subsidy Assistance</option>
                  <option value="0% EMI Financing">0% No-Cost EMI & Bank Loan Support</option>
                  <option value="Order & Delivery Tracking">Order Dispatch & Delivery Tracking</option>
                  <option value="Spare Parts & Warranty">Spare Parts Replacement & Warranty</option>
                </select>
              </div>

              <div className="input-group">
                <label className="input-label">Your Message *</label>
                <textarea
                  rows="4"
                  required
                  className="textarea-field"
                  value={newMsg}
                  onChange={(e) => setNewMsg(e.target.value)}
                  placeholder="Describe your question or requirement..."
                />
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
          </div>
        </div>
      )}
    </div>
  );
};

export default UserSupportPage;
