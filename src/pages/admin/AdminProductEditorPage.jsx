import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  FileText,
  DollarSign,
  Layers,
  Image,
  Settings,
  Sparkles,
  Sprout,
  Wrench,
  Package,
  Truck,
  ShieldCheck,
  CreditCard,
  Search,
  HelpCircle,
  ArrowLeft,
  Eye,
  Save,
  Send,
  RefreshCw
} from 'lucide-react';

import TabBasic from '../../components/admin/ProductForm/TabBasic';
import TabPricing from '../../components/admin/ProductForm/TabPricing';
import TabInventory from '../../components/admin/ProductForm/TabInventory';
import TabMedia from '../../components/admin/ProductForm/TabMedia';
import TabSpecs from '../../components/admin/ProductForm/TabSpecs';
import TabFeatures from '../../components/admin/ProductForm/TabFeatures';
import TabApplications from '../../components/admin/ProductForm/TabApplications';
import TabIdealCompatibility from '../../components/admin/ProductForm/TabIdealCompatibility';
import TabWhatsIncluded from '../../components/admin/ProductForm/TabWhatsIncluded';
import TabShipping from '../../components/admin/ProductForm/TabShipping';
import TabWarranty from '../../components/admin/ProductForm/TabWarranty';
import TabEMI from '../../components/admin/ProductForm/TabEMI';
import TabSEO from '../../components/admin/ProductForm/TabSEO';
import TabRecommendations from '../../components/admin/ProductForm/TabRecommendations';
import TabFAQPublish from '../../components/admin/ProductForm/TabFAQPublish';

import adminApi from '../../services/adminApi';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { useToast } from '../../context/ToastContext';
import { useSync } from '../../context/SyncContext';

const tabs = [
  { id: 'basic', label: '1. Basic Info', icon: <FileText size={15} /> },
  { id: 'pricing', label: '2. Pricing', icon: <DollarSign size={15} /> },
  { id: 'inventory', label: '3. Inventory', icon: <Layers size={15} /> },
  { id: 'media', label: '4. Media', icon: <Image size={15} /> },
  { id: 'specs', label: '5. Specifications', icon: <Settings size={15} /> },
  { id: 'features', label: '6. Features', icon: <Sparkles size={15} /> },
  { id: 'applications', label: '7. Applications', icon: <Sprout size={15} /> },
  { id: 'ideal', label: '8. Ideal & Compat', icon: <Wrench size={15} /> },
  { id: 'included', label: '9. What\'s Included', icon: <Package size={15} /> },
  { id: 'shipping', label: '10. Shipping', icon: <Truck size={15} /> },
  { id: 'warranty', label: '11. Warranty', icon: <ShieldCheck size={15} /> },
  { id: 'emi', label: '12. EMI Financing', icon: <CreditCard size={15} /> },
  { id: 'seo', label: '13. SEO Meta', icon: <Search size={15} /> },
  { id: 'recs', label: '14. Recommendations', icon: <Sparkles size={15} /> },
  { id: 'publish', label: '15. FAQ & Publish', icon: <HelpCircle size={15} /> }
];

const AdminProductEditorPage = () => {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const { adminPanelPath } = useAdminAuth();
  const { addToast } = useToast();
  const { broadcastLocal } = useSync();

  const [activeTab, setActiveTab] = useState('basic');
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);

  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    modelNumber: '',
    sku: '',
    productType: 'Machinery',
    category: '',
    subcategory: '',
    hsnCode: '8432',
    countryOfOrigin: 'India',
    shortDescription: '',
    description: '',
    status: 'Draft',
    mrp: '',
    sellingPrice: '',
    costPrice: '',
    gstPercent: 12,
    taxIncluded: true,
    specialPrice: '',
    isDealOfTheDay: false,
    dealBadge: '',
    dealEndsAt: '',
    hasExtraDiscount: false,
    extraDiscountType: 'FLAT',
    extraDiscountValue: 0,
    extraDiscountLabel: '',
    stockQuantity: 10,
    lowStockThreshold: 4,
    warehouse: 'Central Agro Hub',
    mainImage: { url: '', alt: '' },
    gallery: [],
    video: { url: '', title: '' },
    specifications: [],
    features: [],
    applications: [],
    idealFor: ['Small Farms', 'Medium Farms', 'Vegetable Farming'],
    compatibility: { compatibleAttachments: [], compatibleBrands: [] },
    whatsIncluded: ['Machinery Base Unit', 'Farmer Tool Kit', 'User Manual'],
    shipping: { available: true, panIndia: true, estimatedDeliveryDays: '4 - 7 Business Days', shippingCharge: 0, freeShippingThreshold: 4999, installationAvailable: true },
    warranty: { period: '1 Year Full Manufacturer Warranty', type: 'Comprehensive OEM Support', provider: 'OEM Pan-India Network', terms: 'Full engine and transmission gearbox coverage.' },
    emi: { enabled: true, minDownPayment: 0, interestRate: 13.5, tenureOptions: [3, 6, 9, 12, 18, 24, 36], processingFee: 499 },
    seo: { seoTitle: '', metaDescription: '', focusKeyword: '' },
    recommendations: { manualRecommendations: [], frequentlyBoughtTogether: [] },
    faqs: []
  });

  useEffect(() => {
    const initData = async () => {
      try {
        const [catRes, brandRes] = await Promise.all([
          adminApi.get('/categories'),
          adminApi.get('/brands')
        ]);
        if (catRes.data.success) setCategories(catRes.data.categories || []);
        if (brandRes.data.success) setBrands(brandRes.data.brands || []);

        if (isEdit) {
          const prodRes = await adminApi.get(`/products/${id}`);
          if (prodRes.data.success) {
            setFormData(prodRes.data.product);
          }
        }
      } catch (err) {
        addToast('Failed to load product data', 'error');
      } finally {
        setLoading(false);
      }
    };
    initData();
  }, [id, isEdit]);

  const updateField = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async (overrideStatus) => {
    if (!formData.name || !formData.sku || !formData.category || !formData.sellingPrice) {
      addToast('Please fill in required fields: Name, SKU, Category, and Selling Price.', 'warning');
      setActiveTab('basic');
      return;
    }

    setSaving(true);
    const payload = {
      ...formData,
      status: overrideStatus || formData.status || 'Draft'
    };

    try {
      if (isEdit) {
        const res = await adminApi.put(`/products/${id}`, payload);
        if (res.data.success) {
          addToast(`Product ${res.data.product.name} updated successfully!`, 'success');
          broadcastLocal('CATALOG_CHANGED', { productId: id, action: 'update' });
          navigate(`${adminPanelPath}/products`);
        }
      } else {
        const res = await adminApi.post('/products', payload);
        if (res.data.success) {
          addToast(`Product ${res.data.product.name} created successfully!`, 'success');
          broadcastLocal('CATALOG_CHANGED', { productId: res.data.product._id, action: 'create' });
          navigate(`${adminPanelPath}/products`);
        }
      }
    } catch (error) {
      addToast(error.response?.data?.message || 'Failed to save product.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handlePreview = () => {
    if (formData.slug) {
      window.open(`/product/${formData.slug}`, '_blank');
    } else {
      addToast('Please save the product first to generate a live preview slug.', 'warning');
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem', color: '#94a3b8' }}>
        <RefreshCw className="animate-spin" size={32} color="#34d399" style={{ margin: '0 auto 1rem auto' }} />
        <div>Loading product attributes...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header Bar */}
      <div className="flex justify-between items-center" style={{ flexWrap: 'wrap', gap: '1rem' }}>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(`${adminPanelPath}/products`)}
            className="btn btn-secondary btn-sm"
            style={{ background: '#1e293b', borderColor: '#334155', color: '#ffffff' }}
          >
            <ArrowLeft size={16} />
            <span>Back to Products</span>
          </button>

          <div>
            <h1 style={{ fontSize: '1.6rem', color: '#ffffff', fontWeight: 800 }}>
              {isEdit ? `Edit Machine: ${formData.name || formData.sku}` : 'Create New Agricultural Machinery Listing'}
            </h1>
            <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
              Complete 15-Tab Technical Specifications, Media, Pricing & EMI Configuration
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isEdit && (
            <button type="button" onClick={handlePreview} className="btn btn-secondary btn-sm" style={{ background: '#1e293b', borderColor: '#334155', color: '#ffffff' }}>
              <Eye size={15} />
              <span>Preview</span>
            </button>
          )}

          <button
            type="button"
            disabled={saving}
            onClick={() => handleSave('Draft')}
            className="btn btn-secondary btn-sm"
            style={{ background: '#0b1324', borderColor: '#1e2e4f', color: '#ffffff' }}
          >
            <Save size={15} />
            <span>Save Draft</span>
          </button>

          <button
            type="button"
            disabled={saving}
            onClick={() => handleSave('Published')}
            className="btn btn-primary btn-sm"
          >
            <Send size={15} />
            <span>{isEdit ? 'Update & Publish' : 'Publish Listing'}</span>
          </button>
        </div>
      </div>

      {/* 15-Tabs Navigation Bar */}
      <div className="product-tabs-bar">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`product-tab-btn ${activeTab === tab.id ? 'active' : ''}`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content Body */}
      <div className="admin-card" style={{ minHeight: '480px' }}>
        {activeTab === 'basic' && <TabBasic formData={formData} updateField={updateField} categories={categories} brands={brands} />}
        {activeTab === 'pricing' && <TabPricing formData={formData} updateField={updateField} />}
        {activeTab === 'inventory' && <TabInventory formData={formData} updateField={updateField} isEdit={isEdit} />}
        {activeTab === 'media' && <TabMedia formData={formData} updateField={updateField} />}
        {activeTab === 'specs' && <TabSpecs formData={formData} updateField={updateField} />}
        {activeTab === 'features' && <TabFeatures formData={formData} updateField={updateField} />}
        {activeTab === 'applications' && <TabApplications formData={formData} updateField={updateField} />}
        {activeTab === 'ideal' && <TabIdealCompatibility formData={formData} updateField={updateField} />}
        {activeTab === 'included' && <TabWhatsIncluded formData={formData} updateField={updateField} />}
        {activeTab === 'shipping' && <TabShipping formData={formData} updateField={updateField} />}
        {activeTab === 'warranty' && <TabWarranty formData={formData} updateField={updateField} />}
        {activeTab === 'emi' && <TabEMI formData={formData} updateField={updateField} />}
        {activeTab === 'seo' && <TabSEO formData={formData} updateField={updateField} />}
        {activeTab === 'recs' && <TabRecommendations formData={formData} updateField={updateField} />}
        {activeTab === 'publish' && (
          <TabFAQPublish
            formData={formData}
            updateField={updateField}
            onSave={handleSave}
            onPublish={handleSave}
            onPreview={handlePreview}
            isSaving={saving}
          />
        )}
      </div>
    </div>
  );
};

export default AdminProductEditorPage;
