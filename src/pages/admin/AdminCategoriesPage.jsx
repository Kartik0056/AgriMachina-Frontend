import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  FolderTree,
  Plus,
  Search,
  Edit2,
  Trash2,
  ExternalLink,
  CheckCircle2,
  XCircle,
  Sparkles,
  Layers,
  Tractor,
  RefreshCw,
  Eye,
  EyeOff,
  ChevronUp,
  ChevronDown,
  Tag,
  HelpCircle,
  Loader2,
  AlertTriangle,
  LayoutGrid,
  List,
  Check,
  PackageCheck
} from 'lucide-react';
import adminApi from '../../services/adminApi';
import { useToast } from '../../context/ToastContext';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { useLiveRefresh, useSync } from '../../context/SyncContext';
import Modal from '../../components/common/Modal';
import CategoryIcon from '../../components/common/CategoryIcon';

// Preset icon suggestions grouped by industry
const ICON_CATEGORIES = {
  '🌾 Agri & Machinery': [
    { icon: '🌱', label: 'Sprout' },
    { icon: '🌾', label: 'Crops' },
    { icon: 'Tractor', label: 'Tractor' },
    { icon: 'Droplets', label: 'Irrigation' },
    { icon: 'Sparkles', label: 'Sprayers' },
    { icon: 'Scissors', label: 'Harvester' },
    { icon: 'Layers', label: 'Thresher' },
    { icon: 'Zap', label: 'Engines' },
    { icon: '☀️', label: 'Solar' },
    { icon: '⛏️', label: 'Auger' },
    { icon: '🌲', label: 'Trees' },
    { icon: '🍎', label: 'Orchard' },
    { icon: '🌻', label: 'Sunflower' },
    { icon: 'Axe', label: 'Axe/Tools' }
  ],
  '🌶️ Spices & Groceries': [
    { icon: '🌶️', label: 'Chili' },
    { icon: '🧂', label: 'Masala' },
    { icon: 'Utensils', label: 'Cooking' },
    { icon: 'CookingPot', label: 'Pot' },
    { icon: 'Leaf', label: 'Organic' },
    { icon: 'Apple', label: 'Fruits' },
    { icon: 'Carrot', label: 'Vegetables' },
    { icon: 'Milk', label: 'Dairy' },
    { icon: 'Coffee', label: 'Coffee' },
    { icon: 'ShoppingBag', label: 'Groceries' },
    { icon: 'Boxes', label: 'Bulk Packs' },
    { icon: 'Fish', label: 'Fish/Meat' },
    { icon: 'Egg', label: 'Eggs' }
  ],
  '⚡ Electronics': [
    { icon: 'Cpu', label: 'Processor' },
    { icon: 'Tv', label: 'Television' },
    { icon: 'Smartphone', label: 'Mobile' },
    { icon: 'Laptop', label: 'Laptop' },
    { icon: 'Tablet', label: 'Tablet' },
    { icon: 'Radio', label: 'Audio' },
    { icon: 'Camera', label: 'Camera' },
    { icon: 'Watch', label: 'Watch' },
    { icon: 'BatteryMedium', label: 'Battery' },
    { icon: 'PlugZap', label: 'Appliances' },
    { icon: 'Fan', label: 'Fan/Cooling' },
    { icon: 'Refrigerator', label: 'Fridge' },
    { icon: 'Headphones', label: 'Audio' },
    { icon: 'Speaker', label: 'Speaker' }
  ],
  '👕 Fashion & Retail': [
    { icon: 'Shirt', label: 'Apparel' },
    { icon: 'Gem', label: 'Jewelry' },
    { icon: 'Glasses', label: 'Eyewear' },
    { icon: 'Footprints', label: 'Footwear' },
    { icon: 'Scissors', label: 'Fabric' },
    { icon: 'Sparkles', label: 'Beauty' },
    { icon: 'ShoppingBag', label: 'Bags' }
  ],
  '🛠️ Hardware & Tools': [
    { icon: 'Wrench', label: 'Wrench' },
    { icon: 'Hammer', label: 'Hammer' },
    { icon: 'Cog', label: 'Machinery' },
    { icon: 'ShieldCheck', label: 'Safety' },
    { icon: 'Package', label: 'Parts Box' },
    { icon: 'Truck', label: 'Logistics' }
  ],
  '📦 General FMCG': [
    { icon: 'Store', label: 'Store' },
    { icon: 'Tag', label: 'Offers' },
    { icon: 'Star', label: 'Featured' },
    { icon: 'Award', label: 'Certified' },
    { icon: 'Gift', label: 'Gift' },
    { icon: 'ShoppingCart', label: 'Cart' }
  ]
};

const INITIAL_FORM = {
  name: '',
  slug: '',
  description: '',
  tagline: '',
  categoryType: 'Agricultural Machinery',
  unitType: 'general',
  icon: '🌱',
  image: '',
  startingPrice: '',
  emiStarting: '',
  order: 0,
  isActive: true,
  features: [''],
  subcategories: [],
  seo: {
    seoTitle: '',
    metaDescription: '',
    focusKeyword: '',
    canonicalUrl: '',
    faqs: []
  }
};

const AdminCategoriesPage = () => {
  const { addToast } = useToast();
  const { adminPanelPath, hasPermission } = useAdminAuth();
  const { broadcastLocal } = useSync();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL'); // 'ALL' | 'ACTIVE' | 'INACTIVE'
  const [viewMode, setViewMode] = useState('GRID'); // 'GRID' | 'TABLE'

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTab, setModalTab] = useState('BASIC'); // 'BASIC' | 'COMMERCIAL' | 'SUBCATEGORIES' | 'SEO'
  const [iconCategoryTab, setIconCategoryTab] = useState('🌾 Agri & Machinery');
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [autoSlug, setAutoSlug] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Subcategory draft item in form
  const [newSubName, setNewSubName] = useState('');
  const [newSubSlug, setNewSubSlug] = useState('');
  const [newSubDesc, setNewSubDesc] = useState('');

  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [deleting, setDeleting] = useState(false);

  // FAQ draft item in form
  const [newFaqQuestion, setNewFaqQuestion] = useState('');
  const [newFaqAnswer, setNewFaqAnswer] = useState('');

  // 1. Fetch categories
  const fetchCategories = async (isBackground = false) => {
    if (!isBackground) setLoading(true);
    try {
      const res = await adminApi.get('/categories');
      if (res.data.success) {
        setCategories(res.data.categories || []);
      }
    } catch (err) {
      if (!isBackground) {
        addToast(err.response?.data?.message || 'Failed to load categories', 'error');
      }
    } finally {
      if (!isBackground) setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Real-time synchronization
  useLiveRefresh(() => {
    fetchCategories(true);
  }, ['CATEGORY_CHANGED', 'CATALOG_CHANGED']);

  // Slug generator helper
  const generateSlug = (text) => {
    return (text || '')
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  };

  // Handle Form Name change
  const handleNameChange = (e) => {
    const val = e.target.value;
    setFormData((prev) => ({
      ...prev,
      name: val,
      slug: autoSlug ? generateSlug(val) : prev.slug
    }));
  };

  // Open Create Modal
  const handleOpenAdd = () => {
    setEditingCategory(null);
    setFormData({
      ...INITIAL_FORM,
      order: categories.length + 1
    });
    setAutoSlug(true);
    setModalTab('BASIC');
    setNewSubName('');
    setNewSubSlug('');
    setNewSubDesc('');
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (cat) => {
    setEditingCategory(cat);
    setFormData({
      name: cat.name || '',
      slug: cat.slug || '',
      description: cat.description || '',
      tagline: cat.tagline || '',
      categoryType: cat.categoryType || 'Agricultural Machinery',
      unitType: cat.unitType || 'general',
      icon: cat.icon || '🌱',
      image: cat.image || '',
      startingPrice: cat.startingPrice || '',
      emiStarting: cat.emiStarting || '',
      order: cat.order !== undefined ? cat.order : 0,
      isActive: cat.isActive !== undefined ? cat.isActive : true,
      features: Array.isArray(cat.features) && cat.features.length > 0 ? [...cat.features] : [''],
      subcategories: Array.isArray(cat.subcategories) ? cat.subcategories.map(s => ({ ...s })) : [],
      seo: {
        seoTitle: cat.seo?.seoTitle || '',
        metaDescription: cat.seo?.metaDescription || '',
        focusKeyword: cat.seo?.focusKeyword || '',
        canonicalUrl: cat.seo?.canonicalUrl || '',
        faqs: Array.isArray(cat.seo?.faqs) ? cat.seo.faqs.map(f => ({ ...f })) : []
      }
    });
    setAutoSlug(false);
    setModalTab('BASIC');
    setNewSubName('');
    setNewSubSlug('');
    setNewSubDesc('');
    setIsModalOpen(true);
  };

  // Toggle Active Status with Optimistic Update
  const handleToggleActive = async (cat) => {
    const originalStatus = cat.isActive;
    // Optimistic UI update
    setCategories((prev) =>
      prev.map((c) => (c._id === cat._id ? { ...c, isActive: !originalStatus } : c))
    );

    try {
      const res = await adminApi.patch(`/categories/${cat._id}/toggle`);
      if (res.data.success) {
        addToast(`Category "${cat.name}" is now ${res.data.isActive ? 'Active & Visible' : 'Hidden from Storefront'}.`, 'success');
        broadcastLocal('CATEGORY_CHANGED', { action: 'toggle', categoryId: cat._id });
      }
    } catch (err) {
      // Revert optimistic update on failure
      setCategories((prev) =>
        prev.map((c) => (c._id === cat._id ? { ...c, isActive: originalStatus } : c))
      );
      addToast(err.response?.data?.message || 'Failed to update category status', 'error');
    }
  };

  // Reorder category (Move Up / Move Down)
  const handleMoveOrder = async (index, direction) => {
    const targetIndex = direction === 'UP' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= categories.length) return;

    const newCats = [...categories];
    const [moved] = newCats.splice(index, 1);
    newCats.splice(targetIndex, 0, moved);

    // Update order numbers sequentially
    const updatedWithOrder = newCats.map((c, idx) => ({ ...c, order: idx + 1 }));
    setCategories(updatedWithOrder);

    try {
      const orderedIds = updatedWithOrder.map((c) => c._id);
      await adminApi.put('/categories/reorder', { orderedIds });
      addToast('Category display order updated.', 'success');
      broadcastLocal('CATEGORY_CHANGED', { action: 'reorder' });
    } catch (err) {
      fetchCategories();
      addToast('Failed to save reordered list', 'error');
    }
  };

  // Subcategory management in Modal
  const handleAddSubcategory = () => {
    if (!newSubName.trim()) {
      addToast('Please enter a subcategory name.', 'warning');
      return;
    }
    const slug = newSubSlug.trim() ? generateSlug(newSubSlug) : generateSlug(newSubName);
    const exists = formData.subcategories.some(
      (s) => s.name.toLowerCase() === newSubName.trim().toLowerCase() || s.slug === slug
    );
    if (exists) {
      addToast('A subcategory with this name or slug already exists in this category.', 'warning');
      return;
    }

    setFormData((prev) => ({
      ...prev,
      subcategories: [
        ...prev.subcategories,
        {
          name: newSubName.trim(),
          slug,
          description: newSubDesc.trim()
        }
      ]
    }));
    setNewSubName('');
    setNewSubSlug('');
    setNewSubDesc('');
  };

  const handleRemoveSubcategory = (subIndex) => {
    setFormData((prev) => ({
      ...prev,
      subcategories: prev.subcategories.filter((_, idx) => idx !== subIndex)
    }));
  };

  // Features builder in Modal
  const handleFeatureChange = (index, value) => {
    setFormData((prev) => {
      const updated = [...prev.features];
      updated[index] = value;
      return { ...prev, features: updated };
    });
  };

  const handleAddFeature = () => {
    setFormData((prev) => ({ ...prev, features: [...prev.features, ''] }));
  };

  const handleRemoveFeature = (index) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.filter((_, idx) => idx !== index)
    }));
  };

  // FAQ management in Modal
  const handleAddFaq = () => {
    if (!newFaqQuestion.trim() || !newFaqAnswer.trim()) {
      addToast('Please provide both question and answer for FAQ.', 'warning');
      return;
    }
    setFormData((prev) => ({
      ...prev,
      seo: {
        ...prev.seo,
        faqs: [...(prev.seo?.faqs || []), { question: newFaqQuestion.trim(), answer: newFaqAnswer.trim() }]
      }
    }));
    setNewFaqQuestion('');
    setNewFaqAnswer('');
  };

  const handleRemoveFaq = (index) => {
    setFormData((prev) => ({
      ...prev,
      seo: {
        ...prev.seo,
        faqs: prev.seo.faqs.filter((_, idx) => idx !== index)
      }
    }));
  };

  // Save Category Form (Create or Update)
  const handleSaveCategory = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      addToast('Category Name is required.', 'warning');
      setModalTab('BASIC');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        name: formData.name.trim(),
        slug: formData.slug.trim() ? generateSlug(formData.slug) : generateSlug(formData.name),
        description: formData.description.trim(),
        tagline: formData.tagline.trim(),
        icon: formData.icon.trim() || '🌱',
        image: formData.image.trim(),
        startingPrice: formData.startingPrice.trim(),
        emiStarting: formData.emiStarting.trim(),
        order: Number(formData.order) || 0,
        isActive: Boolean(formData.isActive),
        features: formData.features.filter((f) => f && f.trim().length > 0),
        subcategories: formData.subcategories,
        seo: {
          seoTitle: formData.seo.seoTitle.trim(),
          metaDescription: formData.seo.metaDescription.trim(),
          focusKeyword: formData.seo.focusKeyword.trim(),
          canonicalUrl: formData.seo.canonicalUrl.trim(),
          faqs: formData.seo.faqs || []
        }
      };

      if (editingCategory) {
        const res = await adminApi.put(`/categories/${editingCategory._id}`, payload);
        if (res.data.success) {
          addToast(`Category "${payload.name}" updated successfully!`, 'success');
          broadcastLocal('CATEGORY_CHANGED', { action: 'update', categoryId: editingCategory._id });
        }
      } else {
        const res = await adminApi.post('/categories', payload);
        if (res.data.success) {
          addToast(`Category "${payload.name}" created successfully!`, 'success');
          broadcastLocal('CATEGORY_CHANGED', { action: 'create', categoryId: res.data.category?._id });
        }
      }

      setIsModalOpen(false);
      fetchCategories();
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to save category.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  // Delete category flow
  const handleOpenDelete = (cat) => {
    setCategoryToDelete(cat);
    setDeleteConfirmText('');
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async (force = false) => {
    if (!categoryToDelete) return;
    setDeleting(true);
    try {
      const res = await adminApi.delete(`/categories/${categoryToDelete._id}${force ? '?force=true' : ''}`);
      if (res.data.success) {
        addToast(res.data.message || `Category "${categoryToDelete.name}" deleted.`, 'success');
        broadcastLocal('CATEGORY_CHANGED', { action: 'delete', categoryId: categoryToDelete._id });
        setDeleteModalOpen(false);
        setCategoryToDelete(null);
        fetchCategories();
      }
    } catch (err) {
      if (err.response?.data?.requiresConfirmation) {
        // Show prompt to force delete with auto-reassignment
        addToast(err.response.data.message, 'warning');
      } else {
        addToast(err.response?.data?.message || 'Failed to delete category.', 'error');
      }
    } finally {
      setDeleting(false);
    }
  };

  // Filtering & Metrics
  const filteredCategories = useMemo(() => {
    return categories.filter((cat) => {
      // Search
      const matchSearch =
        searchQuery.trim() === '' ||
        cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cat.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (cat.description && cat.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (cat.subcategories &&
          cat.subcategories.some((s) => s.name.toLowerCase().includes(searchQuery.toLowerCase())));

      // Status
      const matchStatus =
        statusFilter === 'ALL' ||
        (statusFilter === 'ACTIVE' && cat.isActive) ||
        (statusFilter === 'INACTIVE' && !cat.isActive);

      return matchSearch && matchStatus;
    });
  }, [categories, searchQuery, statusFilter]);

  const totalCategories = categories.length;
  const activeCount = categories.filter((c) => c.isActive).length;
  const inactiveCount = totalCategories - activeCount;
  const totalSubcategories = categories.reduce((acc, c) => acc + (c.subcategoriesCount || c.subcategories?.length || 0), 0);
  const totalMappedProducts = categories.reduce((acc, c) => acc + (c.productCount || 0), 0);

  return (
    <div style={{ padding: '1.5rem', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Top Header Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4" style={{ marginBottom: '1.75rem' }}>
        <div>
          <div className="flex items-center gap-2" style={{ marginBottom: '0.25rem' }}>
            <div style={{ background: 'var(--admin-accent, #166534)', padding: '0.4rem', borderRadius: '8px', color: '#ffffff' }}>
              <FolderTree size={20} />
            </div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--admin-text-main)', letterSpacing: '-0.02em', margin: 0 }}>
              Machinery Categories Management
            </h1>
          </div>
          <p style={{ color: 'var(--admin-text-muted)', fontSize: '0.875rem', margin: 0 }}>
            Configure and publish agricultural equipment categories, multi-tier subcategories, mega menu badges, and SEO metadata.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => fetchCategories()}
            className="btn btn-secondary btn-sm"
            style={{
              background: 'var(--admin-bg-card)',
              borderColor: 'var(--admin-border)',
              color: 'var(--admin-text-main)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem'
            }}
            title="Refresh categories list"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            <span>Refresh</span>
          </button>

          {hasPermission('PRODUCT_CREATE') && (
            <button
              onClick={handleOpenAdd}
              className="btn btn-primary btn-sm"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                fontWeight: 700,
                boxShadow: '0 4px 12px rgba(22, 101, 52, 0.3)'
              }}
            >
              <Plus size={16} />
              <span>Add New Category</span>
            </button>
          )}
        </div>
      </div>

      {/* 4 Stat Overview Metrics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4" style={{ marginBottom: '1.5rem' }}>
        <div className="admin-card" style={{ padding: '1.25rem' }}>
          <div className="flex items-center justify-between" style={{ marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--admin-text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Total Categories
            </span>
            <div style={{ background: 'rgba(59, 130, 246, 0.12)', color: '#3b82f6', padding: '0.35rem', borderRadius: '8px' }}>
              <Layers size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--admin-text-main)' }}>{totalCategories}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)', marginTop: '0.2rem' }}>Catalog taxonomy layers</div>
        </div>

        <div className="admin-card" style={{ padding: '1.25rem' }}>
          <div className="flex items-center justify-between" style={{ marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--admin-text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Active on Storefront
            </span>
            <div style={{ background: 'rgba(34, 197, 94, 0.12)', color: '#22c55e', padding: '0.35rem', borderRadius: '8px' }}>
              <CheckCircle2 size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#22c55e' }}>{activeCount}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)', marginTop: '0.2rem' }}>
            {inactiveCount > 0 ? `${inactiveCount} hidden / draft` : 'All categories published'}
          </div>
        </div>

        <div className="admin-card" style={{ padding: '1.25rem' }}>
          <div className="flex items-center justify-between" style={{ marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--admin-text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Subcategories
            </span>
            <div style={{ background: 'rgba(245, 158, 11, 0.12)', color: '#f59e0b', padding: '0.35rem', borderRadius: '8px' }}>
              <Tag size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--admin-text-main)' }}>{totalSubcategories}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)', marginTop: '0.2rem' }}>Granular machinery sub-types</div>
        </div>

        <div className="admin-card" style={{ padding: '1.25rem' }}>
          <div className="flex items-center justify-between" style={{ marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--admin-text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Mapped Products
            </span>
            <div style={{ background: 'rgba(168, 85, 247, 0.12)', color: '#a855f7', padding: '0.35rem', borderRadius: '8px' }}>
              <Tractor size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--admin-text-main)' }}>{totalMappedProducts}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)', marginTop: '0.2rem' }}>Live agricultural inventory items</div>
        </div>
      </div>

      {/* Filter and Control Bar */}
      <div
        className="admin-card flex flex-col md:flex-row items-center justify-between gap-3"
        style={{ padding: '1rem', marginBottom: '1.5rem' }}
      >
        {/* Search input */}
        <div style={{ position: 'relative', width: '100%', maxWidth: '400px' }}>
          <Search
            size={16}
            style={{
              position: 'absolute',
              left: '0.85rem',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--admin-text-muted)'
            }}
          />
          <input
            type="text"
            className="input-field"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search categories, subcategories, slugs..."
            style={{
              paddingLeft: '2.5rem',
              background: 'var(--admin-bg-main)',
              borderColor: 'var(--admin-border)',
              color: 'var(--admin-text-main)',
              fontSize: '0.875rem'
            }}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              style={{
                position: 'absolute',
                right: '0.75rem',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'transparent',
                border: 'none',
                color: 'var(--admin-text-muted)',
                cursor: 'pointer'
              }}
            >
              <XCircle size={14} />
            </button>
          )}
        </div>

        {/* Status Filter & View Toggle */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end flex-wrap">
          {/* Status Buttons */}
          <div
            style={{
              display: 'flex',
              background: 'var(--admin-bg-main)',
              border: '1px solid var(--admin-border)',
              borderRadius: '8px',
              padding: '0.2rem'
            }}
          >
            {['ALL', 'ACTIVE', 'INACTIVE'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                style={{
                  padding: '0.35rem 0.75rem',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  borderRadius: '6px',
                  border: 'none',
                  cursor: 'pointer',
                  background: statusFilter === st ? 'var(--admin-accent, #166534)' : 'transparent',
                  color: statusFilter === st ? '#ffffff' : 'var(--admin-text-muted)',
                  transition: 'all 0.15s ease'
                }}
              >
                {st === 'ALL' ? `All (${totalCategories})` : st === 'ACTIVE' ? `Active (${activeCount})` : `Inactive (${inactiveCount})`}
              </button>
            ))}
          </div>

          {/* View Mode Toggle */}
          <div
            style={{
              display: 'flex',
              background: 'var(--admin-bg-main)',
              border: '1px solid var(--admin-border)',
              borderRadius: '8px',
              padding: '0.2rem'
            }}
          >
            <button
              onClick={() => setViewMode('GRID')}
              style={{
                padding: '0.35rem 0.6rem',
                borderRadius: '6px',
                border: 'none',
                cursor: 'pointer',
                background: viewMode === 'GRID' ? 'var(--admin-bg-card-alt)' : 'transparent',
                color: viewMode === 'GRID' ? 'var(--admin-text-main)' : 'var(--admin-text-muted)'
              }}
              title="Grid Card View"
            >
              <LayoutGrid size={16} />
            </button>
            <button
              onClick={() => setViewMode('TABLE')}
              style={{
                padding: '0.35rem 0.6rem',
                borderRadius: '6px',
                border: 'none',
                cursor: 'pointer',
                background: viewMode === 'TABLE' ? 'var(--admin-bg-card-alt)' : 'transparent',
                color: viewMode === 'TABLE' ? 'var(--admin-text-main)' : 'var(--admin-text-muted)'
              }}
              title="Table List View"
            >
              <List size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Categories Display */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem 1rem', color: 'var(--admin-text-muted)' }}>
          <Loader2 size={36} className="animate-spin" style={{ margin: '0 auto 1rem auto', color: 'var(--admin-accent)' }} />
          <div style={{ fontSize: '0.95rem', fontWeight: 600 }}>Loading category catalog...</div>
        </div>
      ) : filteredCategories.length === 0 ? (
        <div
          className="admin-card"
          style={{
            textAlign: 'center',
            padding: '3.5rem 1.5rem',
            color: 'var(--admin-text-muted)'
          }}
        >
          <FolderTree size={42} style={{ margin: '0 auto 1rem auto', opacity: 0.4 }} />
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--admin-text-main)', marginBottom: '0.5rem' }}>
            No Categories Found
          </h3>
          <p style={{ fontSize: '0.875rem', maxWidth: '400px', margin: '0 auto 1.5rem auto' }}>
            {searchQuery ? `No category matching "${searchQuery}". Try clearing search or add a new category.` : 'You have not added any categories yet. Create your first category to organize your machinery inventory.'}
          </p>
          {hasPermission('PRODUCT_CREATE') && (
            <button onClick={handleOpenAdd} className="btn btn-primary btn-sm">
              <Plus size={16} /> Add First Category
            </button>
          )}
        </div>
      ) : viewMode === 'GRID' ? (
        /* GRID CARDS VIEW */
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
            gap: '1.25rem'
          }}
        >
          {filteredCategories.map((cat, index) => {
            const subs = cat.subcategories || [];
            return (
              <div
                key={cat._id}
                className="admin-card"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  padding: '1.25rem',
                  border: cat.isActive ? '1px solid var(--admin-border)' : '1px dashed rgba(239, 68, 68, 0.35)',
                  position: 'relative',
                  overflow: 'hidden',
                  background: cat.isActive ? 'var(--admin-bg-card)' : 'rgba(239, 68, 68, 0.02)'
                }}
              >
                {/* Top Status & Reorder Bar */}
                <div className="flex items-center justify-between" style={{ marginBottom: '0.85rem' }}>
                  {/* Order Controls */}
                  <div className="flex items-center gap-1">
                    <span
                      style={{
                        fontSize: '0.7rem',
                        fontWeight: 800,
                        background: 'var(--admin-bg-main)',
                        border: '1px solid var(--admin-border)',
                        color: 'var(--admin-text-muted)',
                        padding: '0.15rem 0.45rem',
                        borderRadius: '6px'
                      }}
                      title="Display Order Index"
                    >
                      #{cat.order !== undefined ? cat.order : index + 1}
                    </span>

                    <button
                      onClick={() => handleMoveOrder(index, 'UP')}
                      disabled={index === 0}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: index === 0 ? 'var(--admin-border)' : 'var(--admin-text-muted)',
                        cursor: index === 0 ? 'default' : 'pointer',
                        padding: '0.15rem'
                      }}
                      title="Move Up"
                    >
                      <ChevronUp size={15} />
                    </button>
                    <button
                      onClick={() => handleMoveOrder(index, 'DOWN')}
                      disabled={index === filteredCategories.length - 1}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: index === filteredCategories.length - 1 ? 'var(--admin-border)' : 'var(--admin-text-muted)',
                        cursor: index === filteredCategories.length - 1 ? 'default' : 'pointer',
                        padding: '0.15rem'
                      }}
                      title="Move Down"
                    >
                      <ChevronDown size={15} />
                    </button>
                  </div>

                  {/* Active / Inactive Badge & Quick Toggle */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleActive(cat)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        padding: '0.2rem 0.55rem',
                        borderRadius: '20px',
                        border: 'none',
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        background: cat.isActive ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                        color: cat.isActive ? '#22c55e' : '#ef4444',
                        transition: 'all 0.15s ease'
                      }}
                      title="Click to toggle visibility on Storefront"
                    >
                      {cat.isActive ? <Eye size={12} /> : <EyeOff size={12} />}
                      <span>{cat.isActive ? 'Active' : 'Hidden'}</span>
                    </button>
                  </div>
                </div>

                {/* Category Identity (Image + Icon + Title + Slug) */}
                <div className="flex gap-3" style={{ marginBottom: '0.85rem' }}>
                  <div
                    style={{
                      width: '64px',
                      height: '64px',
                      borderRadius: '12px',
                      background: 'var(--admin-bg-main)',
                      border: '1px solid var(--admin-border)',
                      overflow: 'hidden',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      position: 'relative'
                    }}
                  >
                    {cat.image ? (
                      <img
                        src={cat.image}
                        alt={cat.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    ) : null}
                    <div style={{ position: cat.image ? 'absolute' : 'static', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <CategoryIcon icon={cat.icon} size={28} color="var(--admin-accent)" />
                    </div>
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h3
                      style={{
                        fontSize: '1.05rem',
                        fontWeight: 800,
                        color: 'var(--admin-text-main)',
                        margin: '0 0 0.2rem 0',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {cat.name}
                    </h3>
                    <code
                      style={{
                        fontSize: '0.725rem',
                        color: 'var(--admin-accent)',
                        background: 'rgba(22, 101, 52, 0.12)',
                        padding: '0.1rem 0.35rem',
                        borderRadius: '4px',
                        display: 'inline-block',
                        maxWidth: '100%',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      slug: {cat.slug}
                    </code>
                    {cat.tagline && (
                      <p
                        style={{
                          fontSize: '0.775rem',
                          color: 'var(--admin-text-muted)',
                          margin: '0.35rem 0 0 0',
                          lineHeight: 1.3,
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden'
                        }}
                      >
                        {cat.tagline}
                      </p>
                    )}
                  </div>
                </div>

                {/* Subcategories preview chips */}
                <div style={{ flex: 1, marginBottom: '0.85rem' }}>
                  <div className="flex items-center justify-between" style={{ marginBottom: '0.35rem' }}>
                    <span style={{ fontSize: '0.725rem', color: 'var(--admin-text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      Subcategories ({subs.length})
                    </span>
                    {cat.startingPrice && (
                      <span style={{ fontSize: '0.75rem', color: '#22c55e', fontWeight: 700 }}>
                        From {cat.startingPrice}
                      </span>
                    )}
                  </div>

                  {subs.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {subs.slice(0, 4).map((sub, sIdx) => (
                        <span
                          key={sIdx}
                          style={{
                            fontSize: '0.675rem',
                            fontWeight: 600,
                            background: 'var(--admin-bg-main)',
                            border: '1px solid var(--admin-border)',
                            color: 'var(--admin-text-main)',
                            padding: '0.15rem 0.4rem',
                            borderRadius: '4px'
                          }}
                        >
                          {sub.name}
                        </span>
                      ))}
                      {subs.length > 4 && (
                        <span
                          style={{
                            fontSize: '0.675rem',
                            fontWeight: 700,
                            color: 'var(--admin-accent)',
                            background: 'var(--admin-bg-main)',
                            padding: '0.15rem 0.35rem',
                            borderRadius: '4px'
                          }}
                        >
                          +{subs.length - 4} more
                        </span>
                      )}
                    </div>
                  ) : (
                    <div style={{ fontSize: '0.725rem', color: 'var(--admin-text-muted)', fontStyle: 'italic' }}>
                      No subcategories configured
                    </div>
                  )}
                </div>

                {/* Bottom Stats & Action Buttons */}
                <div
                  className="flex items-center justify-between"
                  style={{
                    borderTop: '1px solid var(--admin-border)',
                    paddingTop: '0.75rem',
                    gap: '0.5rem'
                  }}
                >
                  {/* Linked products link badge */}
                  <Link
                    to={`${adminPanelPath}/products?category=${encodeURIComponent(cat.name)}`}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      color: cat.productCount > 0 ? 'var(--admin-text-main)' : 'var(--admin-text-muted)',
                      textDecoration: 'none',
                      background: 'var(--admin-bg-main)',
                      padding: '0.25rem 0.5rem',
                      borderRadius: '6px',
                      border: '1px solid var(--admin-border)'
                    }}
                    title="Filter machinery catalog for this category"
                  >
                    <Tractor size={13} color="var(--admin-accent)" />
                    <span>{cat.productCount || 0} Products</span>
                  </Link>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5">
                    {/* Storefront Link */}
                    <a
                      href={`/products?category=${encodeURIComponent(cat.name)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-secondary btn-sm"
                      style={{
                        padding: '0.3rem 0.45rem',
                        background: 'var(--admin-bg-main)',
                        borderColor: 'var(--admin-border)',
                        color: 'var(--admin-text-muted)'
                      }}
                      title="Preview on Public Storefront"
                    >
                      <ExternalLink size={14} />
                    </a>

                    {/* Edit button */}
                    {hasPermission('PRODUCT_UPDATE') && (
                      <button
                        onClick={() => handleOpenEdit(cat)}
                        className="btn btn-secondary btn-sm"
                        style={{
                          padding: '0.3rem 0.55rem',
                          background: 'var(--admin-bg-main)',
                          borderColor: 'var(--admin-border)',
                          color: 'var(--admin-text-main)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.3rem'
                        }}
                        title="Edit Category & Subcategories"
                      >
                        <Edit2 size={13} />
                        <span>Edit</span>
                      </button>
                    )}

                    {/* Delete button */}
                    {hasPermission('PRODUCT_DELETE') && (
                      <button
                        onClick={() => handleOpenDelete(cat)}
                        className="btn btn-sm"
                        style={{
                          padding: '0.3rem 0.45rem',
                          background: 'rgba(239, 68, 68, 0.1)',
                          borderColor: 'rgba(239, 68, 68, 0.3)',
                          color: '#ef4444'
                        }}
                        title="Delete Category"
                      >
                        <Trash2 size={13} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* TABLE LIST VIEW */
        <div className="admin-card" style={{ overflowX: 'auto', padding: 0 }}>
          <table className="admin-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--admin-bg-card-alt)', borderBottom: '1px solid var(--admin-border)', textAlign: 'left' }}>
                <th style={{ padding: '0.85rem 1rem', fontSize: '0.75rem', fontWeight: 800, color: 'var(--admin-text-muted)' }}>ORDER</th>
                <th style={{ padding: '0.85rem 1rem', fontSize: '0.75rem', fontWeight: 800, color: 'var(--admin-text-muted)' }}>CATEGORY</th>
                <th style={{ padding: '0.85rem 1rem', fontSize: '0.75rem', fontWeight: 800, color: 'var(--admin-text-muted)' }}>SLUG</th>
                <th style={{ padding: '0.85rem 1rem', fontSize: '0.75rem', fontWeight: 800, color: 'var(--admin-text-muted)' }}>SUBCATEGORIES</th>
                <th style={{ padding: '0.85rem 1rem', fontSize: '0.75rem', fontWeight: 800, color: 'var(--admin-text-muted)' }}>PRODUCTS</th>
                <th style={{ padding: '0.85rem 1rem', fontSize: '0.75rem', fontWeight: 800, color: 'var(--admin-text-muted)' }}>STATUS</th>
                <th style={{ padding: '0.85rem 1rem', fontSize: '0.75rem', fontWeight: 800, color: 'var(--admin-text-muted)', textAlign: 'right' }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filteredCategories.map((cat, idx) => (
                <tr key={cat._id} style={{ borderBottom: '1px solid var(--admin-border)' }}>
                  <td style={{ padding: '0.85rem 1rem', fontWeight: 700, color: 'var(--admin-text-muted)' }}>
                    #{cat.order !== undefined ? cat.order : idx + 1}
                  </td>
                  <td style={{ padding: '0.85rem 1rem' }}>
                    <div className="flex items-center gap-2.5">
                      <div style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(22, 101, 52, 0.12)', borderRadius: '6px', flexShrink: 0 }}>
                        <CategoryIcon icon={cat.icon} size={18} color="var(--admin-accent)" />
                      </div>
                      <div>
                        <div style={{ fontWeight: 800, color: 'var(--admin-text-main)', fontSize: '0.9rem' }}>{cat.name}</div>
                        {cat.tagline && <div style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)' }}>{cat.tagline}</div>}
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '0.85rem 1rem' }}>
                    <code style={{ fontSize: '0.75rem', color: 'var(--admin-accent)' }}>{cat.slug}</code>
                  </td>
                  <td style={{ padding: '0.85rem 1rem', fontSize: '0.8rem', color: 'var(--admin-text-main)' }}>
                    {cat.subcategories?.length || 0} sub-items
                  </td>
                  <td style={{ padding: '0.85rem 1rem' }}>
                    <Link
                      to={`${adminPanelPath}/products?category=${encodeURIComponent(cat.name)}`}
                      style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--admin-text-main)', textDecoration: 'underline' }}
                    >
                      {cat.productCount || 0} items
                    </Link>
                  </td>
                  <td style={{ padding: '0.85rem 1rem' }}>
                    <button
                      onClick={() => handleToggleActive(cat)}
                      style={{
                        padding: '0.2rem 0.5rem',
                        borderRadius: '20px',
                        border: 'none',
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        background: cat.isActive ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                        color: cat.isActive ? '#22c55e' : '#ef4444'
                      }}
                    >
                      {cat.isActive ? 'Active' : 'Hidden'}
                    </button>
                  </td>
                  <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                    <div className="flex items-center justify-end gap-1.5">
                      {hasPermission('PRODUCT_UPDATE') && (
                        <button
                          onClick={() => handleOpenEdit(cat)}
                          className="btn btn-secondary btn-sm"
                          style={{ padding: '0.25rem 0.5rem', background: 'var(--admin-bg-main)', borderColor: 'var(--admin-border)' }}
                        >
                          <Edit2 size={13} />
                        </button>
                      )}
                      {hasPermission('PRODUCT_DELETE') && (
                        <button
                          onClick={() => handleOpenDelete(cat)}
                          className="btn btn-sm"
                          style={{ padding: '0.25rem 0.5rem', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }}
                        >
                          <Trash2 size={13} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ADD / EDIT CATEGORY MODAL */}
      {/* ========================================================================= */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => !submitting && setIsModalOpen(false)}
        title={editingCategory ? `Edit Category: ${editingCategory.name}` : 'Create New Machinery Category'}
        maxWidth="780px"
      >
        <form onSubmit={handleSaveCategory} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Modal Tabs */}
          <div
            style={{
              display: 'flex',
              borderBottom: '1px solid var(--admin-border)',
              gap: '0.5rem',
              overflowX: 'auto'
            }}
          >
            {[
              { id: 'BASIC', label: '1. Basic Info & Icon' },
              { id: 'SUBCATEGORIES', label: `2. Subcategories (${formData.subcategories.length})` },
              { id: 'COMMERCIAL', label: '3. Pricing & Features' },
              { id: 'SEO', label: '4. SEO & FAQs' }
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setModalTab(tab.id)}
                style={{
                  padding: '0.6rem 0.9rem',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  border: 'none',
                  background: 'transparent',
                  cursor: 'pointer',
                  borderBottom: modalTab === tab.id ? '2px solid var(--admin-accent)' : '2px solid transparent',
                  color: modalTab === tab.id ? 'var(--admin-accent)' : 'var(--admin-text-muted)',
                  whiteSpace: 'nowrap'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* TAB 1: BASIC INFO */}
          {modalTab === 'BASIC' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Category Name */}
                <div className="input-group">
                  <label className="input-label" style={{ color: 'var(--admin-text-muted)', fontWeight: 700 }}>
                    Category Name *
                  </label>
                  <input
                    type="text"
                    required
                    className="input-field"
                    style={{ background: 'var(--admin-bg-main)', borderColor: 'var(--admin-border)', color: 'var(--admin-text-main)' }}
                    placeholder="e.g. Power Weeders & Tillers"
                    value={formData.name}
                    onChange={handleNameChange}
                  />
                </div>

                {/* Slug */}
                <div className="input-group">
                  <div className="flex justify-between items-center" style={{ marginBottom: '0.25rem' }}>
                    <label className="input-label" style={{ color: 'var(--admin-text-muted)', fontWeight: 700, margin: 0 }}>
                      URL Slug *
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setAutoSlug(true);
                        setFormData((p) => ({ ...p, slug: generateSlug(p.name) }));
                      }}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--admin-accent)',
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      Auto-generate
                    </button>
                  </div>
                  <input
                    type="text"
                    required
                    className="input-field"
                    style={{ background: 'var(--admin-bg-main)', borderColor: 'var(--admin-border)', color: 'var(--admin-text-main)' }}
                    placeholder="e.g. power-weeders-tillers"
                    value={formData.slug}
                    onChange={(e) => {
                      setAutoSlug(false);
                      setFormData((p) => ({ ...p, slug: generateSlug(e.target.value) }));
                    }}
                  />
                </div>
              </div>

              {/* Industry Type & Default Unit Recommendation */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="input-group">
                  <label className="input-label" style={{ color: 'var(--admin-text-muted)', fontWeight: 700 }}>
                    Category Industry / Department *
                  </label>
                  <select
                    className="select-field"
                    style={{ background: 'var(--admin-bg-main)', borderColor: 'var(--admin-border)', color: 'var(--admin-text-main)' }}
                    value={formData.categoryType || 'Agricultural Machinery'}
                    onChange={(e) => setFormData((p) => ({ ...p, categoryType: e.target.value }))}
                  >
                    <option value="Agricultural Machinery">🌾 Agricultural Machinery & Implements</option>
                    <option value="Spices & Groceries">🌶️ Spices, Masala & Grocery Products</option>
                    <option value="Electronics & Appliances">⚡ Electronics, Motors & Gadgets</option>
                    <option value="Fashion & Apparel">👕 Fashion, Workwear & Uniforms</option>
                    <option value="Hardware & Tools">🛠️ Hardware, Spare Parts & Workshop</option>
                    <option value="General FMCG">📦 General FMCG & Retail</option>
                    <option value="Other">🏷️ Other Custom Category</option>
                  </select>
                </div>

                <div className="input-group">
                  <label className="input-label" style={{ color: 'var(--admin-text-muted)', fontWeight: 700 }}>
                    Default Recommended Unit Type
                  </label>
                  <select
                    className="select-field"
                    style={{ background: 'var(--admin-bg-main)', borderColor: 'var(--admin-border)', color: 'var(--admin-text-main)' }}
                    value={formData.unitType || 'general'}
                    onChange={(e) => setFormData((p) => ({ ...p, unitType: e.target.value }))}
                  >
                    <option value="general">📦 General / Units (pcs, pack, set, box)</option>
                    <option value="weight">⚖️ Weight based (gm, kg, mg - Spices, Crops, Seeds)</option>
                    <option value="volume">💧 Volume based (ml, ltr - Oils, Sprays, Liquids)</option>
                    <option value="power">⚡ Power / Capacity (HP, kW, Watt, cc)</option>
                    <option value="dimension">📏 Dimensions (meter, cm, feet, inch)</option>
                  </select>
                </div>
              </div>

              {/* Tagline */}
              <div className="input-group">
                <label className="input-label" style={{ color: 'var(--admin-text-muted)', fontWeight: 700 }}>
                  Short Tagline / Subtitle
                </label>
                <input
                  type="text"
                  className="input-field"
                  style={{ background: 'var(--admin-bg-main)', borderColor: 'var(--admin-border)', color: 'var(--admin-text-main)' }}
                  placeholder="e.g. 100% Pure, authentic ground & whole spices directly from verified farms."
                  value={formData.tagline}
                  onChange={(e) => setFormData((p) => ({ ...p, tagline: e.target.value }))}
                />
              </div>

              {/* Multi-Industry Categorized Icon Picker */}
              <div className="input-group">
                <div className="flex items-center justify-between" style={{ marginBottom: '0.4rem' }}>
                  <label className="input-label" style={{ color: 'var(--admin-text-muted)', fontWeight: 700, margin: 0 }}>
                    Category Icon / Badge
                  </label>
                  <div className="flex items-center gap-2">
                    <span style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)' }}>Selected:</span>
                    <div style={{ width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(22, 101, 52, 0.2)', border: '1px solid var(--admin-accent)', borderRadius: '6px' }}>
                      <CategoryIcon icon={formData.icon} size={18} color="var(--admin-accent)" />
                    </div>
                  </div>
                </div>

                {/* Icon Category Tabs */}
                <div className="flex gap-1 flex-wrap" style={{ marginBottom: '0.5rem', background: 'var(--admin-bg-main)', padding: '0.3rem', borderRadius: '8px', border: '1px solid var(--admin-border)' }}>
                  {Object.keys(ICON_CATEGORIES).map((catTab) => (
                    <button
                      key={catTab}
                      type="button"
                      onClick={() => setIconCategoryTab(catTab)}
                      style={{
                        padding: '0.25rem 0.55rem',
                        fontSize: '0.72rem',
                        fontWeight: iconCategoryTab === catTab ? 800 : 600,
                        borderRadius: '6px',
                        border: 'none',
                        cursor: 'pointer',
                        background: iconCategoryTab === catTab ? 'var(--admin-accent, #166534)' : 'transparent',
                        color: iconCategoryTab === catTab ? '#ffffff' : 'var(--admin-text-muted)'
                      }}
                    >
                      {catTab}
                    </button>
                  ))}
                </div>

                {/* Preset Icon Grid */}
                <div className="flex items-center gap-2 flex-wrap" style={{ marginBottom: '0.65rem', maxHeight: '110px', overflowY: 'auto', padding: '0.4rem', background: 'var(--admin-bg-main)', borderRadius: '8px', border: '1px solid var(--admin-border)' }}>
                  {(ICON_CATEGORIES[iconCategoryTab] || []).map(({ icon, label }) => {
                    const isCur = formData.icon === icon;
                    return (
                      <button
                        key={icon}
                        type="button"
                        onClick={() => setFormData((p) => ({ ...p, icon }))}
                        title={label}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.3rem',
                          padding: '0.35rem 0.6rem',
                          borderRadius: '6px',
                          border: isCur ? '2px solid var(--admin-accent)' : '1px solid var(--admin-border)',
                          background: isCur ? 'rgba(22, 101, 52, 0.25)' : 'var(--admin-bg-card)',
                          color: isCur ? 'var(--admin-accent)' : 'var(--admin-text-main)',
                          cursor: 'pointer',
                          fontSize: '0.75rem',
                          fontWeight: isCur ? 800 : 500
                        }}
                      >
                        <CategoryIcon icon={icon} size={16} />
                        <span>{label}</span>
                      </button>
                    );
                  })}
                </div>

                <div className="flex gap-2 items-center">
                  <input
                    type="text"
                    className="input-field"
                    style={{ flex: 1, background: 'var(--admin-bg-main)', borderColor: 'var(--admin-border)', color: 'var(--admin-text-main)', fontSize: '0.85rem' }}
                    placeholder="Or type custom icon name (e.g. Droplets, Utensils, Cpu, Shirt) or Emoji (🌶️, 🧂)"
                    value={formData.icon}
                    onChange={(e) => setFormData((p) => ({ ...p, icon: e.target.value }))}
                  />
                </div>
              </div>

              {/* Image URL & Preview */}
              <div className="input-group">
                <label className="input-label" style={{ color: 'var(--admin-text-muted)', fontWeight: 700 }}>
                  Category Image Banner URL
                </label>
                <div className="flex gap-3 items-center">
                  <input
                    type="text"
                    className="input-field"
                    style={{ flex: 1, background: 'var(--admin-bg-main)', borderColor: 'var(--admin-border)', color: 'var(--admin-text-main)' }}
                    placeholder="e.g. /images/machinery/power_weeder.jpg or https://..."
                    value={formData.image}
                    onChange={(e) => setFormData((p) => ({ ...p, image: e.target.value }))}
                  />
                  {formData.image && (
                    <div
                      style={{
                        width: '45px',
                        height: '45px',
                        borderRadius: '8px',
                        background: 'var(--admin-bg-main)',
                        border: '1px solid var(--admin-border)',
                        overflow: 'hidden',
                        flexShrink: 0
                      }}
                    >
                      <img src={formData.image} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="input-group">
                <label className="input-label" style={{ color: 'var(--admin-text-muted)', fontWeight: 700 }}>
                  Full Description
                </label>
                <textarea
                  rows={3}
                  className="input-field"
                  style={{ background: 'var(--admin-bg-main)', borderColor: 'var(--admin-border)', color: 'var(--admin-text-main)' }}
                  placeholder="Explain the machinery usage, suitable soils, and farmer benefits..."
                  value={formData.description}
                  onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
                />
              </div>

              {/* Display Order & Active Toggle */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="input-group">
                  <label className="input-label" style={{ color: 'var(--admin-text-muted)', fontWeight: 700 }}>
                    Display Order Index
                  </label>
                  <input
                    type="number"
                    min="0"
                    className="input-field"
                    style={{ background: 'var(--admin-bg-main)', borderColor: 'var(--admin-border)', color: 'var(--admin-text-main)' }}
                    value={formData.order}
                    onChange={(e) => setFormData((p) => ({ ...p, order: Number(e.target.value) }))}
                  />
                </div>

                <div className="input-group">
                  <label className="input-label" style={{ color: 'var(--admin-text-muted)', fontWeight: 700 }}>
                    Publish Status
                  </label>
                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.65rem 0.85rem',
                      background: 'var(--admin-bg-main)',
                      border: '1px solid var(--admin-border)',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      color: 'var(--admin-text-main)'
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData((p) => ({ ...p, isActive: e.target.checked }))}
                    />
                    <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>
                      {formData.isActive ? 'Active (Visible on Storefront)' : 'Hidden (Draft Mode)'}
                    </span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SUBCATEGORIES BUILDER */}
          {modalTab === 'SUBCATEGORIES' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ background: 'var(--admin-bg-main)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--admin-border)' }}>
                <div style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--admin-text-main)', marginBottom: '0.75rem' }}>
                  + Add New Subcategory
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3" style={{ marginBottom: '0.75rem' }}>
                  <div>
                    <label className="input-label" style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)' }}>
                      Subcategory Name *
                    </label>
                    <input
                      type="text"
                      className="input-field"
                      placeholder="e.g. 7HP Petrol Power Weeders"
                      value={newSubName}
                      onChange={(e) => {
                        setNewSubName(e.target.value);
                        if (!newSubSlug) setNewSubSlug(generateSlug(e.target.value));
                      }}
                      style={{ background: 'var(--admin-bg-card)', borderColor: 'var(--admin-border)', color: 'var(--admin-text-main)' }}
                    />
                  </div>
                  <div>
                    <label className="input-label" style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)' }}>
                      Subcategory Slug
                    </label>
                    <input
                      type="text"
                      className="input-field"
                      placeholder="e.g. petrol-weeders"
                      value={newSubSlug}
                      onChange={(e) => setNewSubSlug(generateSlug(e.target.value))}
                      style={{ background: 'var(--admin-bg-card)', borderColor: 'var(--admin-border)', color: 'var(--admin-text-main)' }}
                    />
                  </div>
                </div>

                <div style={{ marginBottom: '0.75rem' }}>
                  <label className="input-label" style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)' }}>
                    Description / Scope (Optional)
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="e.g. Lightweight weeders for vegetable farming & sugarcane"
                    value={newSubDesc}
                    onChange={(e) => setNewSubDesc(e.target.value)}
                    style={{ background: 'var(--admin-bg-card)', borderColor: 'var(--admin-border)', color: 'var(--admin-text-main)' }}
                  />
                </div>

                <button
                  type="button"
                  onClick={handleAddSubcategory}
                  className="btn btn-secondary btn-sm"
                  style={{
                    background: 'var(--admin-accent, #166534)',
                    color: '#ffffff',
                    border: 'none',
                    fontWeight: 700
                  }}
                >
                  <Plus size={14} /> Add to Subcategory List
                </button>
              </div>

              {/* Subcategories List Table */}
              <div style={{ marginTop: '0.5rem' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--admin-text-muted)', marginBottom: '0.5rem' }}>
                  Configured Subcategories ({formData.subcategories.length})
                </div>

                {formData.subcategories.length === 0 ? (
                  <div
                    style={{
                      textAlign: 'center',
                      padding: '2rem',
                      background: 'var(--admin-bg-main)',
                      borderRadius: '8px',
                      border: '1px dashed var(--admin-border)',
                      color: 'var(--admin-text-muted)',
                      fontSize: '0.85rem'
                    }}
                  >
                    No subcategories added yet. Use the form above to add sub-types like Petrol / Diesel / Mini models.
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {formData.subcategories.map((sub, sIdx) => (
                      <div
                        key={sIdx}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'between',
                          padding: '0.75rem 1rem',
                          background: 'var(--admin-bg-main)',
                          border: '1px solid var(--admin-border)',
                          borderRadius: '8px',
                          gap: '1rem'
                        }}
                      >
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 800, color: 'var(--admin-text-main)', fontSize: '0.9rem' }}>
                            {sub.name}
                          </div>
                          <div className="flex items-center gap-2" style={{ marginTop: '0.2rem' }}>
                            <code style={{ fontSize: '0.7rem', color: 'var(--admin-accent)' }}>slug: {sub.slug}</code>
                            {sub.description && (
                              <span style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)' }}>
                                • {sub.description}
                              </span>
                            )}
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleRemoveSubcategory(sIdx)}
                          style={{
                            background: 'transparent',
                            border: 'none',
                            color: '#ef4444',
                            cursor: 'pointer',
                            padding: '0.25rem'
                          }}
                          title="Remove Subcategory"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: COMMERCIAL & PRICING FEATURES */}
          {modalTab === 'COMMERCIAL' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="input-group">
                  <label className="input-label" style={{ color: 'var(--admin-text-muted)', fontWeight: 700 }}>
                    Mega Menu Starting Price (Badge)
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    style={{ background: 'var(--admin-bg-main)', borderColor: 'var(--admin-border)', color: 'var(--admin-text-main)' }}
                    placeholder="e.g. ₹38,499"
                    value={formData.startingPrice}
                    onChange={(e) => setFormData((p) => ({ ...p, startingPrice: e.target.value }))}
                  />
                </div>

                <div className="input-group">
                  <label className="input-label" style={{ color: 'var(--admin-text-muted)', fontWeight: 700 }}>
                    Mega Menu Starting EMI (Badge)
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    style={{ background: 'var(--admin-bg-main)', borderColor: 'var(--admin-border)', color: 'var(--admin-text-main)' }}
                    placeholder="e.g. ₹1,171/mo"
                    value={formData.emiStarting}
                    onChange={(e) => setFormData((p) => ({ ...p, emiStarting: e.target.value }))}
                  />
                </div>
              </div>

              {/* Key Selling Features Bullet Points */}
              <div className="input-group">
                <div className="flex justify-between items-center" style={{ marginBottom: '0.5rem' }}>
                  <label className="input-label" style={{ color: 'var(--admin-text-muted)', fontWeight: 700, margin: 0 }}>
                    Key Category Highlights & Badges (e.g. 100% Pure, FSSAI Certified, 1 Year Warranty)
                  </label>
                  <button
                    type="button"
                    onClick={handleAddFeature}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--admin-accent)',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    + Add Bullet Point
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {formData.features.map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="text"
                        className="input-field"
                        style={{ background: 'var(--admin-bg-main)', borderColor: 'var(--admin-border)', color: 'var(--admin-text-main)' }}
                        placeholder={`e.g. 100% Natural & FSSAI Certified / OEM Certified Warranty`}
                        value={feat}
                        onChange={(e) => handleFeatureChange(idx, e.target.value)}
                      />
                      {formData.features.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveFeature(idx)}
                          style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer' }}
                        >
                          <Trash2 size={15} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: SEO & FAQS */}
          {modalTab === 'SEO' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="input-group">
                <label className="input-label" style={{ color: 'var(--admin-text-muted)', fontWeight: 700 }}>
                  Meta Title
                </label>
                <input
                  type="text"
                  className="input-field"
                  style={{ background: 'var(--admin-bg-main)', borderColor: 'var(--admin-border)', color: 'var(--admin-text-main)' }}
                  placeholder="e.g. Buy Best Power Weeders & Tillers in India | AgriMachina"
                  value={formData.seo.seoTitle}
                  onChange={(e) => setFormData((p) => ({ ...p, seo: { ...p.seo, seoTitle: e.target.value } }))}
                />
              </div>

              <div className="input-group">
                <label className="input-label" style={{ color: 'var(--admin-text-muted)', fontWeight: 700 }}>
                  Meta Description
                </label>
                <textarea
                  rows={2}
                  className="input-field"
                  style={{ background: 'var(--admin-bg-main)', borderColor: 'var(--admin-border)', color: 'var(--admin-text-main)' }}
                  placeholder="e.g. Explore certified petrol and diesel power weeders for intercultural tilling with 50% govt subsidy."
                  value={formData.seo.metaDescription}
                  onChange={(e) => setFormData((p) => ({ ...p, seo: { ...p.seo, metaDescription: e.target.value } }))}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="input-group">
                  <label className="input-label" style={{ color: 'var(--admin-text-muted)', fontWeight: 700 }}>
                    Focus Keyword
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    style={{ background: 'var(--admin-bg-main)', borderColor: 'var(--admin-border)', color: 'var(--admin-text-main)' }}
                    placeholder="e.g. power weeder price"
                    value={formData.seo.focusKeyword}
                    onChange={(e) => setFormData((p) => ({ ...p, seo: { ...p.seo, focusKeyword: e.target.value } }))}
                  />
                </div>

                <div className="input-group">
                  <label className="input-label" style={{ color: 'var(--admin-text-muted)', fontWeight: 700 }}>
                    Canonical URL
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    style={{ background: 'var(--admin-bg-main)', borderColor: 'var(--admin-border)', color: 'var(--admin-text-main)' }}
                    placeholder="e.g. https://agrimachina.in/products?category=power-weeders"
                    value={formData.seo.canonicalUrl}
                    onChange={(e) => setFormData((p) => ({ ...p, seo: { ...p.seo, canonicalUrl: e.target.value } }))}
                  />
                </div>
              </div>

              {/* FAQs Section */}
              <div style={{ borderTop: '1px solid var(--admin-border)', paddingTop: '1rem', marginTop: '0.5rem' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--admin-text-main)', marginBottom: '0.75rem' }}>
                  Frequently Asked Questions (FAQs)
                </div>

                <div style={{ background: 'var(--admin-bg-main)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--admin-border)', marginBottom: '1rem' }}>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="Question (e.g. Which engine is best: petrol or diesel?)"
                    value={newFaqQuestion}
                    onChange={(e) => setNewFaqQuestion(e.target.value)}
                    style={{ background: 'var(--admin-bg-card)', borderColor: 'var(--admin-border)', color: 'var(--admin-text-main)', marginBottom: '0.5rem' }}
                  />
                  <textarea
                    rows={2}
                    className="input-field"
                    placeholder="Answer explanation..."
                    value={newFaqAnswer}
                    onChange={(e) => setNewFaqAnswer(e.target.value)}
                    style={{ background: 'var(--admin-bg-card)', borderColor: 'var(--admin-border)', color: 'var(--admin-text-main)', marginBottom: '0.5rem' }}
                  />
                  <button type="button" onClick={handleAddFaq} className="btn btn-secondary btn-sm">
                    + Add FAQ
                  </button>
                </div>

                {formData.seo.faqs && formData.seo.faqs.length > 0 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {formData.seo.faqs.map((faq, fIdx) => (
                      <div
                        key={fIdx}
                        style={{
                          padding: '0.75rem',
                          background: 'var(--admin-bg-main)',
                          border: '1px solid var(--admin-border)',
                          borderRadius: '8px',
                          display: 'flex',
                          justifyContent: 'space-between',
                          gap: '0.5rem'
                        }}
                      >
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--admin-text-main)' }}>
                            Q: {faq.question}
                          </div>
                          <div style={{ fontSize: '0.775rem', color: 'var(--admin-text-muted)', marginTop: '0.2rem' }}>
                            A: {faq.answer}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveFaq(fIdx)}
                          style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer' }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Modal Footer Controls */}
          <div
            className="flex items-center justify-end gap-3"
            style={{
              borderTop: '1px solid var(--admin-border)',
              paddingTop: '1rem',
              marginTop: '0.5rem'
            }}
          >
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              disabled={submitting}
              className="btn btn-secondary btn-sm"
              style={{ background: 'var(--admin-bg-main)', borderColor: 'var(--admin-border)', color: 'var(--admin-text-main)' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="btn btn-primary btn-sm"
              style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem' }}
            >
              {submitting ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  <span>Saving Category...</span>
                </>
              ) : (
                <>
                  <Check size={16} />
                  <span>{editingCategory ? 'Update Category' : 'Save & Publish Category'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </Modal>

      {/* ========================================================================= */}
      {/* DELETE CONFIRMATION MODAL WITH PRODUCT SAFETY CHECK */}
      {/* ========================================================================= */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => !deleting && setDeleteModalOpen(false)}
        title={`Delete Category: ${categoryToDelete?.name || ''}`}
        maxWidth="500px"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.75rem',
              padding: '1rem',
              borderRadius: '10px',
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#ef4444'
            }}
          >
            <AlertTriangle size={24} style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>Caution: Permanent Action</div>
              <div style={{ fontSize: '0.825rem', marginTop: '0.25rem', color: 'var(--admin-text-main)' }}>
                Are you sure you want to delete <strong>{categoryToDelete?.name}</strong>? This will remove its navigation menu entry and subcategory taxonomy.
              </div>
            </div>
          </div>

          {categoryToDelete?.productCount > 0 && (
            <div
              style={{
                padding: '0.85rem',
                background: 'rgba(245, 158, 11, 0.1)',
                border: '1px solid rgba(245, 158, 11, 0.3)',
                borderRadius: '8px',
                fontSize: '0.825rem',
                color: '#f59e0b'
              }}
            >
              <strong>Notice:</strong> This category has <strong>{categoryToDelete.productCount} active machinery product(s)</strong> attached. If you delete this category, those products will automatically be reassigned to <em>General Machinery</em> to protect your store catalog.
            </div>
          )}

          <div
            className="flex items-center justify-end gap-3"
            style={{ borderTop: '1px solid var(--admin-border)', paddingTop: '1rem' }}
          >
            <button
              type="button"
              onClick={() => setDeleteModalOpen(false)}
              disabled={deleting}
              className="btn btn-secondary btn-sm"
              style={{ background: 'var(--admin-bg-main)', borderColor: 'var(--admin-border)', color: 'var(--admin-text-main)' }}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => handleConfirmDelete(categoryToDelete?.productCount > 0)}
              disabled={deleting}
              className="btn btn-sm"
              style={{
                background: '#ef4444',
                color: '#ffffff',
                border: 'none',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem'
              }}
            >
              {deleting ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  <span>Deleting...</span>
                </>
              ) : (
                <>
                  <Trash2 size={14} />
                  <span>Delete Category</span>
                </>
              )}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AdminCategoriesPage;
