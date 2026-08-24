import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Plus,
  Edit,
  Trash2,
  ArrowUp,
  ArrowDown,
  Eye,
  Play,
  CheckCircle2,
  XCircle,
  Video,
  Image as ImageIcon,
  Link as LinkIcon,
  Tag,
  DollarSign,
  Layers,
  ChevronRight,
  HelpCircle,
  RefreshCw,
  X,
  ExternalLink
} from 'lucide-react';
import adminApi from '../../services/adminApi';
import { useToast } from '../../context/ToastContext';
import { useSync } from '../../context/SyncContext';
import { formatINR } from '../../services/emiHelper';
import { getYouTubeEmbedUrl, isDirectVideoUrl } from '../../services/videoHelper';

const PRESET_MACHINERY_IMAGES = [
  { label: 'Power Weeder 7HP', url: '/images/machinery/power_weeder.jpg' },
  { label: 'Solar Submersible Pump', url: '/images/machinery/solar_pump.jpg' },
  { label: 'Heavy Duty Rotavator', url: '/images/machinery/rotavator.jpg' },
  { label: 'Brush Cutter Harvester', url: '/images/machinery/brush_cutter.jpg' },
  { label: 'Battery Knapsack Sprayer', url: '/images/machinery/sprayer.jpg' },
  { label: 'Lawn Mower Petrol', url: 'https://images.unsplash.com/photo-1592878904946-b3cd8ae243d0?w=1200&q=80' },
  { label: 'Tractor Farm Field', url: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=1200&q=80' }
];

const AdminHeroBannersPage = () => {
  const [slides, setSlides] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSlide, setEditingSlide] = useState(null);
  const [previewVideoUrl, setPreviewVideoUrl] = useState(null);

  const { addToast } = useToast();
  const { broadcastLocal } = useSync();

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    tagline: '',
    badge: '🔥 DEAL OF THE DAY • 20% OFF',
    category: 'Power Weeder & Tiller',
    bgImage: '/images/machinery/power_weeder.jpg',
    productImage: '/images/machinery/power_weeder.jpg',
    videoUrl: '',
    isVideoBackground: false,
    specs: ['High-Torque Engine', 'Heavy Duty Gearbox'],
    price: 38499,
    mrp: 48500,
    discountPercent: 20,
    monthlyEmi: 1171,
    productId: '',
    productSlug: '',
    ctaText: 'Explore Full Machine Details',
    ctaLink: '',
    isActive: true,
    countdownHours: 5
  });

  const [newSpecInput, setNewSpecInput] = useState('');

  const fetchSlides = async () => {
    setLoading(true);
    try {
      const res = await adminApi.get('/banners');
      if (res.data.success) {
        setSlides(res.data.slides || []);
      }
    } catch (err) {
      addToast('Failed to load hero slides', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await adminApi.get('/products?limit=100');
      if (res.data.success) {
        setProducts(res.data.products || []);
      }
    } catch (err) {}
  };

  useEffect(() => {
    fetchSlides();
    fetchProducts();
  }, []);

  const handleOpenCreateModal = () => {
    setEditingSlide(null);
    setFormData({
      title: '',
      tagline: '',
      badge: '🔥 DEAL OF THE DAY • 20% OFF',
      category: 'Power Weeder & Tiller',
      bgImage: '/images/machinery/power_weeder.jpg',
      productImage: '/images/machinery/power_weeder.jpg',
      videoUrl: '',
      isVideoBackground: false,
      specs: ['High-Torque Engine', 'Heavy Duty Gearbox'],
      price: 0,
      mrp: 0,
      discountPercent: 0,
      monthlyEmi: 0,
      productId: '',
      productSlug: '',
      ctaText: 'Explore Full Machine Details',
      ctaLink: '',
      isActive: true,
      countdownHours: 5
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (slide) => {
    setEditingSlide(slide);
    setFormData({
      title: slide.title || '',
      tagline: slide.tagline || '',
      badge: slide.badge || '',
      category: slide.category || '',
      bgImage: slide.bgImage || '',
      productImage: slide.productImage || '',
      videoUrl: slide.videoUrl || '',
      isVideoBackground: !!slide.isVideoBackground,
      specs: slide.specs && slide.specs.length > 0 ? [...slide.specs] : [],
      price: slide.price || 0,
      mrp: slide.mrp || 0,
      discountPercent: slide.discountPercent || 0,
      monthlyEmi: slide.monthlyEmi || 0,
      productId: slide.productId?._id || slide.productId || '',
      productSlug: slide.productSlug || '',
      ctaText: slide.ctaText || 'Explore Full Machine Details',
      ctaLink: slide.ctaLink || '',
      isActive: slide.isActive !== false,
      countdownHours: slide.countdownHours || 5
    });
    setIsModalOpen(true);
  };

  // Product Selection Autocomplete / Autofill
  const handleSelectProduct = (selectedProdId) => {
    if (!selectedProdId) {
      setFormData(prev => ({ ...prev, productId: '', productSlug: '' }));
      return;
    }
    const found = products.find(p => p._id === selectedProdId);
    if (!found) return;

    const discount = found.mrp > found.sellingPrice
      ? Math.round(((found.mrp - found.sellingPrice) / found.mrp) * 100)
      : (found.discountPercent || 0);

    const emi = found.sellingPrice ? Math.round((found.sellingPrice * 1.135) / 36) : 0;
    const imgUrl = found.mainImage?.url || found.gallery?.[0]?.url || '/images/machinery/power_weeder.jpg';

    setFormData(prev => ({
      ...prev,
      productId: found._id,
      productSlug: found.slug,
      title: prev.title || found.name,
      category: found.category || prev.category,
      tagline: prev.tagline || found.shortDescription || '',
      price: found.sellingPrice || 0,
      mrp: found.mrp || found.sellingPrice || 0,
      discountPercent: discount,
      monthlyEmi: emi,
      bgImage: prev.bgImage || imgUrl,
      productImage: imgUrl,
      ctaLink: `/product/${found.slug}`,
      specs: prev.specs.length > 0 ? prev.specs : [
        `${found.brand || 'OEM Heavy'} Machinery`,
        found.modelNumber ? `Model: ${found.modelNumber}` : 'High-Torque Performance'
      ]
    }));
  };

  const handleAddSpec = () => {
    if (!newSpecInput.trim()) return;
    setFormData(prev => ({
      ...prev,
      specs: [...prev.specs, newSpecInput.trim()]
    }));
    setNewSpecInput('');
  };

  const handleRemoveSpec = (index) => {
    setFormData(prev => ({
      ...prev,
      specs: prev.specs.filter((_, i) => i !== index)
    }));
  };

  const handleSaveSlide = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      addToast('Please provide a slide title', 'warning');
      return;
    }

    setSaving(true);
    try {
      if (editingSlide && editingSlide._id) {
        const res = await adminApi.put(`/banners/${editingSlide._id}`, formData);
        if (res.data.success) {
          addToast('Slide updated successfully!', 'success');
        }
      } else {
        const res = await adminApi.post('/banners', formData);
        if (res.data.success) {
          addToast('New Hero Slide created!', 'success');
        }
      }
      setIsModalOpen(false);
      fetchSlides();
      broadcastLocal('BANNER_CHANGED');
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to save slide', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteSlide = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete slide "${title}"?`)) return;
    try {
      const res = await adminApi.delete(`/banners/${id}`);
      if (res.data.success) {
        addToast('Hero slide deleted', 'success');
        fetchSlides();
        broadcastLocal('BANNER_CHANGED');
      }
    } catch (err) {
      addToast('Failed to delete slide', 'error');
    }
  };

  const handleToggleActive = async (slide) => {
    try {
      const res = await adminApi.put(`/banners/${slide._id}`, { isActive: !slide.isActive });
      if (res.data.success) {
        addToast(`Slide ${!slide.isActive ? 'activated' : 'deactivated'}`, 'success');
        setSlides(prev => prev.map(s => s._id === slide._id ? { ...s, isActive: !s.isActive } : s));
        broadcastLocal('BANNER_CHANGED');
      }
    } catch (err) {
      addToast('Failed to update status', 'error');
    }
  };

  const handleMove = async (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= slides.length) return;

    const newSlides = [...slides];
    const temp = newSlides[index];
    newSlides[index] = newSlides[targetIndex];
    newSlides[targetIndex] = temp;

    setSlides(newSlides);

    try {
      const slideIds = newSlides.map(s => s._id);
      await adminApi.put('/banners/reorder', { slideIds });
      addToast('Slide order updated on storefront', 'success');
      broadcastLocal('BANNER_CHANGED');
    } catch (err) {
      addToast('Failed to reorder slides', 'error');
      fetchSlides();
    }
  };

  return (
    <div className="flex flex-col gap-6" style={{ paddingBottom: '3rem' }}>
      {/* Header Banner */}
      <div className="admin-card" style={{ background: 'linear-gradient(135deg, #0b1e13 0%, #062416 100%)', border: '1px solid #166534' }}>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2" style={{ color: '#34d399', fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              <Sparkles size={16} />
              <span>Storefront Hero CMS</span>
            </div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#ffffff', marginTop: '0.25rem' }}>
              Home Page Hero Slides & Banner Manager
            </h1>
            <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginTop: '0.35rem', maxWidth: '650px' }}>
              Select which agricultural machines are featured on the home page slider, embed field demonstration videos, configure special offer badges, and adjust display order.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchSlides}
              className="btn btn-secondary btn-md"
              style={{ background: 'rgba(255, 255, 255, 0.1)', color: '#ffffff', borderColor: 'rgba(255, 255, 255, 0.2)' }}
              title="Refresh Slides"
            >
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
              <span>Sync</span>
            </button>

            <button
              onClick={handleOpenCreateModal}
              className="btn btn-primary btn-md"
              style={{ background: '#22c55e', borderColor: '#22c55e', color: '#000000', fontWeight: 800 }}
            >
              <Plus size={18} />
              <span>Add New Hero Slide</span>
            </button>
          </div>
        </div>
      </div>

      {/* Slides Data Table & Visual Cards */}
      <div className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--bg-dark-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontWeight: 700, fontSize: '1rem', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Layers size={18} color="#22c55e" />
            <span>Active Storefront Slides ({slides.filter(s => s.isActive).length} / {slides.length})</span>
          </div>
          <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
            Slides are shown in order from top to bottom on the home page
          </span>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem 1rem', color: '#94a3b8' }}>
            <RefreshCw size={28} className="animate-spin" style={{ margin: '0 auto 0.75rem auto', color: '#22c55e' }} />
            <div>Loading hero slides...</div>
          </div>
        ) : slides.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 1rem', color: '#94a3b8' }}>
            <p>No slides found. Click "Add New Hero Slide" to create one.</p>
          </div>
        ) : (
          <div className="admin-table-container" style={{ border: 'none' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th style={{ width: '60px' }}>Order</th>
                  <th style={{ width: '100px' }}>Banner Preview</th>
                  <th>Title & Product</th>
                  <th>Badge & Category</th>
                  <th>Price / EMI</th>
                  <th>Video Demo</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {slides.map((s, idx) => (
                  <tr key={s._id}>
                    {/* Reorder Buttons */}
                    <td>
                      <div className="flex flex-col gap-1 items-center">
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={() => handleMove(idx, -1)}
                          style={{
                            background: 'rgba(255, 255, 255, 0.08)',
                            border: 'none',
                            color: idx === 0 ? '#475569' : '#ffffff',
                            borderRadius: '4px',
                            padding: '2px 6px',
                            cursor: idx === 0 ? 'not-allowed' : 'pointer'
                          }}
                          title="Move Up"
                        >
                          <ArrowUp size={14} />
                        </button>
                        <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#34d399' }}>#{idx + 1}</span>
                        <button
                          type="button"
                          disabled={idx === slides.length - 1}
                          onClick={() => handleMove(idx, 1)}
                          style={{
                            background: 'rgba(255, 255, 255, 0.08)',
                            border: 'none',
                            color: idx === slides.length - 1 ? '#475569' : '#ffffff',
                            borderRadius: '4px',
                            padding: '2px 6px',
                            cursor: idx === slides.length - 1 ? 'not-allowed' : 'pointer'
                          }}
                          title="Move Down"
                        >
                          <ArrowDown size={14} />
                        </button>
                      </div>
                    </td>

                    {/* Preview Image */}
                    <td>
                      <div style={{ width: '80px', height: '52px', borderRadius: '8px', overflow: 'hidden', border: '1px solid #1e293b', position: 'relative' }}>
                        <img
                          src={s.bgImage || s.productImage || '/images/machinery/power_weeder.jpg'}
                          alt=""
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                        {s.videoUrl && (
                          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Play size={16} color="#f59e0b" fill="#f59e0b" />
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Title & Product */}
                    <td>
                      <div style={{ fontWeight: 700, color: '#ffffff', fontSize: '0.9rem', maxWidth: '280px', lineHeight: 1.3 }}>
                        {s.title}
                      </div>
                      {s.productSlug && (
                        <a
                          href={`/product/${s.productSlug}`}
                          target="_blank"
                          rel="noreferrer"
                          style={{ fontSize: '0.75rem', color: '#34d399', display: 'inline-flex', alignItems: 'center', gap: '0.2rem', marginTop: '0.2rem' }}
                        >
                          <span>Linked: /product/{s.productSlug}</span>
                          <ExternalLink size={11} />
                        </a>
                      )}
                    </td>

                    {/* Badge & Category */}
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                        <span className="badge" style={{ background: '#f59e0b', color: '#000000', fontSize: '0.7rem', fontWeight: 800, width: 'fit-content' }}>
                          {s.badge}
                        </span>
                        <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                          {s.category}
                        </span>
                      </div>
                    </td>

                    {/* Price & EMI */}
                    <td>
                      <div style={{ fontWeight: 800, color: '#34d399', fontSize: '0.9rem' }}>
                        {formatINR(s.price)}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                        EMI: {formatINR(s.monthlyEmi)}/mo
                      </div>
                    </td>

                    {/* Video Demo */}
                    <td>
                      {s.videoUrl ? (
                        <button
                          type="button"
                          onClick={() => setPreviewVideoUrl(s.videoUrl)}
                          className="btn btn-sm"
                          style={{ background: '#0284c7', color: '#ffffff', borderColor: '#0284c7', fontSize: '0.75rem', padding: '0.25rem 0.6rem' }}
                        >
                          <Play size={12} fill="#ffffff" />
                          <span>Preview Video</span>
                        </button>
                      ) : (
                        <span style={{ fontSize: '0.75rem', color: '#64748b' }}>No Video</span>
                      )}
                    </td>

                    {/* Status */}
                    <td>
                      <button
                        type="button"
                        onClick={() => handleToggleActive(s)}
                        className={`badge ${s.isActive ? 'badge-success' : 'badge-danger'}`}
                        style={{ cursor: 'pointer', border: 'none' }}
                        title="Click to toggle"
                      >
                        {s.isActive ? 'Active' : 'Inactive'}
                      </button>
                    </td>

                    {/* Actions */}
                    <td style={{ textAlign: 'right' }}>
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEditModal(s)}
                          className="btn btn-sm btn-secondary"
                          style={{ padding: '0.35rem 0.6rem' }}
                          title="Edit Slide"
                        >
                          <Edit size={14} />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => handleDeleteSlide(s._id, s.title)}
                          className="btn btn-sm btn-danger"
                          style={{ padding: '0.35rem 0.5rem' }}
                          title="Delete Slide"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Slide Add/Edit Modal */}
      {isModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(3, 7, 18, 0.85)',
            backdropFilter: 'blur(10px)',
            zIndex: 99999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem'
          }}
        >
          <div
            className="admin-card"
            style={{
              width: '100%',
              maxWidth: '850px',
              maxHeight: '90vh',
              overflowY: 'auto',
              background: '#0b1324',
              border: '1.5px solid #1e2e4f',
              padding: '2rem',
              borderRadius: '20px',
              boxShadow: '0 25px 60px rgba(0,0,0,0.8)'
            }}
          >
            {/* Modal Header */}
            <div className="flex justify-between items-center" style={{ borderBottom: '1px solid #1e2e4f', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
              <div className="flex items-center gap-2">
                <Sparkles size={20} color="#22c55e" />
                <h2 style={{ fontSize: '1.25rem', color: '#ffffff', fontWeight: 800 }}>
                  {editingSlide ? 'Edit Home Page Hero Slide' : 'Create New Home Page Hero Slide'}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
              >
                <X size={22} />
              </button>
            </div>

            <form onSubmit={handleSaveSlide} className="flex flex-col gap-4">
              {/* Product Autofill Quick Selector */}
              <div style={{ background: 'rgba(34, 197, 94, 0.1)', border: '1px solid rgba(34, 197, 94, 0.3)', padding: '1rem', borderRadius: '12px' }}>
                <label className="input-label" style={{ color: '#86efac', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Tag size={15} />
                  <span>Choose Product from Machinery Catalog (Autofills Details):</span>
                </label>
                <select
                  value={formData.productId}
                  onChange={(e) => handleSelectProduct(e.target.value)}
                  className="select-field"
                  style={{ background: '#070d1a', borderColor: '#166534', color: '#ffffff', marginTop: '0.35rem' }}
                >
                  <option value="">-- Or enter custom machinery details below --</option>
                  {products.map((p) => (
                    <option key={p._id} value={p._id}>
                      {p.name} ({formatINR(p.sellingPrice)}) [{p.category}]
                    </option>
                  ))}
                </select>
              </div>

              {/* Title & Tagline */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="input-group md:col-span-2">
                  <label className="input-label" style={{ color: '#cbd5e1' }}>Hero Slide Headline Title *</label>
                  <input
                    type="text"
                    required
                    className="input-field"
                    style={{ background: '#070d1a', borderColor: '#1e2e4f', color: '#ffffff' }}
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Power Weeder 7HP Petrol 4-Stroke (AV-708)"
                  />
                </div>

                <div className="input-group md:col-span-2">
                  <label className="input-label" style={{ color: '#cbd5e1' }}>Short Tagline / Farm Benefit Summary</label>
                  <textarea
                    rows="2"
                    className="textarea-field"
                    style={{ background: '#070d1a', borderColor: '#1e2e4f', color: '#ffffff' }}
                    value={formData.tagline}
                    onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                    placeholder="e.g. High-torque 208cc power weeder engineered for deep inter-row soil cultivation..."
                  />
                </div>

                <div className="input-group">
                  <label className="input-label" style={{ color: '#cbd5e1' }}>Promotion Badge Text</label>
                  <input
                    type="text"
                    className="input-field"
                    style={{ background: '#070d1a', borderColor: '#1e2e4f', color: '#ffffff' }}
                    value={formData.badge}
                    onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                    placeholder="e.g. 🔥 DEAL OF THE DAY • 20% OFF"
                  />
                </div>

                <div className="input-group">
                  <label className="input-label" style={{ color: '#cbd5e1' }}>Machinery Category</label>
                  <input
                    type="text"
                    className="input-field"
                    style={{ background: '#070d1a', borderColor: '#1e2e4f', color: '#ffffff' }}
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="e.g. Power Weeder & Tiller"
                  />
                </div>
              </div>

              {/* Media Settings: Background Image / Live Background Video */}
              <div style={{ borderTop: '1px solid #1e2e4f', paddingTop: '1rem' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#34d399', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Video size={16} />
                  <span>Hero Background Media (Live Video or High-Res Image)</span>
                </h4>

                {/* Media Type Selector */}
                <div className="flex gap-4" style={{ marginBottom: '1rem', background: 'rgba(255,255,255,0.04)', padding: '0.75rem 1rem', borderRadius: '10px' }}>
                  <label className="flex items-center gap-2" style={{ color: '#ffffff', cursor: 'pointer', fontSize: '0.85rem' }}>
                    <input
                      type="radio"
                      name="bgMediaType"
                      checked={!formData.videoUrl}
                      onChange={() => setFormData({ ...formData, videoUrl: '' })}
                      style={{ accentColor: '#22c55e' }}
                    />
                    <span style={{ fontWeight: 700 }}>📸 Static Image Background</span>
                  </label>

                  <label className="flex items-center gap-2" style={{ color: '#ffffff', cursor: 'pointer', fontSize: '0.85rem' }}>
                    <input
                      type="radio"
                      name="bgMediaType"
                      checked={Boolean(formData.videoUrl)}
                      onChange={() => {
                        if (!formData.videoUrl) setFormData({ ...formData, videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' });
                      }}
                      style={{ accentColor: '#38bdf8' }}
                    />
                    <span style={{ fontWeight: 700, color: '#38bdf8' }}>🎥 Live Background Video (Plays behind text)</span>
                  </label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Live Background Video URL */}
                  <div className="input-group">
                    <label className="input-label" style={{ color: '#38bdf8', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <Video size={14} color="#38bdf8" />
                      <span>Background Video URL (YouTube or Direct MP4)</span>
                    </label>
                    <input
                      type="text"
                      className="input-field"
                      style={{ background: '#070d1a', borderColor: formData.videoUrl ? '#0284c7' : '#1e2e4f', color: '#ffffff' }}
                      value={formData.videoUrl}
                      onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                      placeholder="e.g. https://www.youtube.com/watch?v=... or https://...demo.mp4"
                    />
                    <div style={{ fontSize: '0.725rem', color: '#94a3b8', marginTop: '0.35rem', lineHeight: 1.4 }}>
                      ⚡ <strong>Live Background Video</strong>: Automatically loops in the background with cinematic overlay and volume control.
                    </div>
                  </div>

                  {/* Fallback / Banner Image URL */}
                  <div className="input-group">
                    <label className="input-label" style={{ color: '#cbd5e1' }}>Fallback / Static Image URL</label>
                    <input
                      type="text"
                      className="input-field"
                      style={{ background: '#070d1a', borderColor: '#1e2e4f', color: '#ffffff' }}
                      value={formData.bgImage}
                      onChange={(e) => setFormData({ ...formData, bgImage: e.target.value, productImage: e.target.value })}
                      placeholder="/images/machinery/power_weeder.jpg or https://..."
                    />
                    {/* Preset Picker */}
                    <div className="flex flex-wrap gap-1.5" style={{ marginTop: '0.35rem' }}>
                      <span style={{ fontSize: '0.7rem', color: '#64748b', alignSelf: 'center' }}>Presets:</span>
                      {PRESET_MACHINERY_IMAGES.map((p, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setFormData({ ...formData, bgImage: p.url, productImage: p.url })}
                          style={{ fontSize: '0.65rem', padding: '0.2rem 0.45rem', background: 'rgba(255,255,255,0.08)', border: '1px solid #1e2e4f', color: '#94a3b8', borderRadius: '4px', cursor: 'pointer' }}
                        >
                          {p.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Pricing, MRP & EMI */}
              <div style={{ borderTop: '1px solid #1e2e4f', paddingTop: '1rem' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#34d399', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <DollarSign size={16} />
                  <span>Pricing, Discount & Razorpay EMI Breakdown</span>
                </h4>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="input-group">
                    <label className="input-label" style={{ color: '#cbd5e1' }}>Selling Price (₹)</label>
                    <input
                      type="number"
                      className="input-field"
                      style={{ background: '#070d1a', borderColor: '#1e2e4f', color: '#ffffff' }}
                      value={formData.price}
                      onChange={(e) => {
                        const price = Number(e.target.value);
                        const discount = formData.mrp > price ? Math.round(((formData.mrp - price) / formData.mrp) * 100) : 0;
                        const emi = Math.round((price * 1.135) / 36);
                        setFormData({ ...formData, price, discountPercent: discount, monthlyEmi: emi });
                      }}
                    />
                  </div>

                  <div className="input-group">
                    <label className="input-label" style={{ color: '#cbd5e1' }}>MRP (₹)</label>
                    <input
                      type="number"
                      className="input-field"
                      style={{ background: '#070d1a', borderColor: '#1e2e4f', color: '#ffffff' }}
                      value={formData.mrp}
                      onChange={(e) => {
                        const mrp = Number(e.target.value);
                        const discount = mrp > formData.price ? Math.round(((mrp - formData.price) / mrp) * 100) : 0;
                        setFormData({ ...formData, mrp, discountPercent: discount });
                      }}
                    />
                  </div>

                  <div className="input-group">
                    <label className="input-label" style={{ color: '#cbd5e1' }}>Discount %</label>
                    <input
                      type="number"
                      className="input-field"
                      style={{ background: '#070d1a', borderColor: '#1e2e4f', color: '#ffffff' }}
                      value={formData.discountPercent}
                      onChange={(e) => setFormData({ ...formData, discountPercent: Number(e.target.value) })}
                    />
                  </div>

                  <div className="input-group">
                    <label className="input-label" style={{ color: '#cbd5e1' }}>Monthly EMI (₹)</label>
                    <input
                      type="number"
                      className="input-field"
                      style={{ background: '#070d1a', borderColor: '#1e2e4f', color: '#ffffff' }}
                      value={formData.monthlyEmi}
                      onChange={(e) => setFormData({ ...formData, monthlyEmi: Number(e.target.value) })}
                    />
                  </div>
                </div>
              </div>

              {/* Key Specifications Chips Builder */}
              <div style={{ borderTop: '1px solid #1e2e4f', paddingTop: '1rem' }}>
                <label className="input-label" style={{ color: '#cbd5e1', marginBottom: '0.35rem' }}>
                  Key Engineering Specification Bullet Chips:
                </label>
                <div className="flex gap-2" style={{ marginBottom: '0.5rem' }}>
                  <input
                    type="text"
                    className="input-field"
                    style={{ background: '#070d1a', borderColor: '#1e2e4f', color: '#ffffff' }}
                    value={newSpecInput}
                    onChange={(e) => setNewSpecInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddSpec(); } }}
                    placeholder="e.g. 208cc 4-Stroke Engine"
                  />
                  <button
                    type="button"
                    onClick={handleAddSpec}
                    className="btn btn-secondary btn-sm"
                    style={{ background: '#22c55e', color: '#000000', fontWeight: 800, padding: '0.5rem 1rem' }}
                  >
                    Add Chip
                  </button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {formData.specs.map((spec, idx) => (
                    <span
                      key={idx}
                      style={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        color: '#ffffff',
                        padding: '0.3rem 0.75rem',
                        borderRadius: '8px',
                        fontSize: '0.8rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.35rem'
                      }}
                    >
                      <CheckCircle2 size={13} color="#22c55e" />
                      <span>{spec}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveSpec(idx)}
                        style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: 0, marginLeft: '0.2rem' }}
                      >
                        <X size={14} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Target Link & Status */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4" style={{ borderTop: '1px solid #1e2e4f', paddingTop: '1rem' }}>
                <div className="input-group">
                  <label className="input-label" style={{ color: '#cbd5e1' }}>Call to Action (CTA) Link</label>
                  <input
                    type="text"
                    className="input-field"
                    style={{ background: '#070d1a', borderColor: '#1e2e4f', color: '#ffffff' }}
                    value={formData.ctaLink}
                    onChange={(e) => setFormData({ ...formData, ctaLink: e.target.value })}
                    placeholder="/product/power-weeder-7hp-petrol-av-708"
                  />
                </div>

                <div className="input-group flex items-center gap-3" style={{ alignSelf: 'center', marginTop: '1.25rem' }}>
                  <label className="flex items-center gap-2" style={{ color: '#ffffff', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                      style={{ width: '18px', height: '18px', accentColor: '#22c55e' }}
                    />
                    <span style={{ fontWeight: 700 }}>Enable Slide on Storefront</span>
                  </label>
                </div>
              </div>

              {/* Modal Footer Buttons */}
              <div className="flex justify-end gap-3" style={{ borderTop: '1px solid #1e2e4f', paddingTop: '1.5rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn btn-secondary btn-md"
                  style={{ background: 'transparent', borderColor: '#475569', color: '#cbd5e1' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="btn btn-primary btn-md"
                  style={{ background: '#22c55e', borderColor: '#22c55e', color: '#000000', fontWeight: 800 }}
                >
                  {saving ? 'Saving Slide...' : editingSlide ? 'Update Hero Slide' : 'Create Hero Slide'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Video Demo Modal Preview */}
      {previewVideoUrl && (
        <div
          onClick={() => setPreviewVideoUrl(null)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(3, 7, 18, 0.94)',
            backdropFilter: 'blur(12px)',
            zIndex: 999999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem'
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: '800px',
              background: '#000000',
              borderRadius: '16px',
              overflow: 'hidden',
              border: '1px solid #334155',
              boxShadow: '0 25px 60px rgba(0,0,0,0.8)',
              position: 'relative'
            }}
          >
            <div style={{ padding: '0.75rem 1.25rem', background: '#0b1324', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ color: '#ffffff', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Play size={16} color="#f59e0b" fill="#f59e0b" />
                <span>Field Video Demonstration Preview</span>
              </div>
              <button
                type="button"
                onClick={() => setPreviewVideoUrl(null)}
                style={{ background: 'none', border: 'none', color: '#ffffff', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ width: '100%', height: '440px' }}>
              {isDirectVideoUrl(previewVideoUrl) ? (
                <video src={previewVideoUrl} controls autoPlay style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              ) : getYouTubeEmbedUrl(previewVideoUrl) ? (
                <iframe
                  src={`${getYouTubeEmbedUrl(previewVideoUrl)}?autoplay=1`}
                  title="Field Video Demo"
                  style={{ width: '100%', height: '100%', border: 'none' }}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div style={{ padding: '4rem', textAlign: 'center', color: '#ffffff' }}>
                  Invalid video URL format. Please provide a YouTube link or direct MP4 URL.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminHeroBannersPage;
