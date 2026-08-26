import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  User,
  MapPin,
  Lock,
  Package,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  ShieldCheck,
  Building,
  Home,
  Tractor,
  KeyRound,
  Mail,
  Phone,
  Save,
  AlertCircle,
  Camera,
  Upload,
  Image as ImageIcon,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import Modal from '../../components/common/Modal';
import api from '../../services/api';

const indianStates = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
];

const UserProfilePage = () => {
  const { user, updateUserData, isAuthenticated, logout } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('profile'); // 'profile', 'addresses', 'security', 'orders'

  // Profile form state
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    avatar: user?.avatar || '',
    farmType: user?.farmDetails?.farmType || 'Vegetable & Crop Farming',
    farmSizeAcres: user?.farmDetails?.farmSizeAcres || 5,
    state: user?.farmDetails?.state || 'Gujarat',
    district: user?.farmDetails?.district || '',
    preferredLanguage: user?.farmDetails?.preferredLanguage || 'Hindi / English'
  });

  // Password change form state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Address modal state
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [addressForm, setAddressForm] = useState({
    fullName: '',
    phone: '',
    street: '',
    villageCity: '',
    district: '',
    state: 'Gujarat',
    pincode: '',
    landmark: '',
    addressType: 'Farm',
    isDefault: false
  });

  // Forgot password OTP modal
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [forgotStep, setForgotStep] = useState(1); // 1: enter email, 2: enter otp & new pass
  const [forgotEmail, setForgotEmail] = useState(user?.email || '');
  const [forgotOtp, setForgotOtp] = useState('');
  const [forgotNewPass, setForgotNewPass] = useState('');
  const [demoOtpNotice, setDemoOtpNotice] = useState('');

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setProfileForm({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        avatar: user.avatar || '',
        farmType: user.farmDetails?.farmType || 'Vegetable & Crop Farming',
        farmSizeAcres: user.farmDetails?.farmSizeAcres || 5,
        state: user.farmDetails?.state || 'Gujarat',
        district: user.farmDetails?.district || '',
        preferredLanguage: user.farmDetails?.preferredLanguage || 'Hindi / English'
      });
    }
  }, [user]);

  const handleAvatarFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      addToast('Image size should be less than 5MB', 'warning');
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setProfileForm(prev => ({ ...prev, avatar: reader.result }));
      addToast('Profile photo selected! Save changes to apply.', 'info');
    };
    reader.readAsDataURL(file);
  };

  // 1. Handle Profile Update
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.put('/users/profile', {
        name: profileForm.name,
        email: profileForm.email,
        phone: profileForm.phone,
        avatar: profileForm.avatar,
        farmDetails: {
          farmType: profileForm.farmType,
          farmSizeAcres: Number(profileForm.farmSizeAcres),
          state: profileForm.state,
          district: profileForm.district,
          preferredLanguage: profileForm.preferredLanguage
        }
      });
      if (res.data.success) {
        updateUserData(res.data.user);
        addToast('Farmer profile & photo updated successfully! 🌾', 'success');
      }
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to update profile.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // 2. Handle Password Change
  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      addToast('New password and confirm password do not match.', 'warning');
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      addToast('New password must be at least 6 characters long.', 'warning');
      return;
    }

    setLoading(true);
    try {
      const res = await api.put('/users/change-password', {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      });
      if (res.data.success) {
        addToast('Password changed successfully!', 'success');
        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      }
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to change password.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // 3. Forgot Password Request
  const handleForgotRequest = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/users/forgot-password', { email: forgotEmail });
      if (res.data.success) {
        setDemoOtpNotice(res.data.demoOtp ? `(Demo OTP: ${res.data.demoOtp})` : '');
        if (res.data.demoOtp) setForgotOtp(res.data.demoOtp);
        setForgotStep(2);
        addToast(`Password reset OTP generated! ${res.data.demoOtp ? 'OTP: ' + res.data.demoOtp : ''}`, 'info');
      }
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to request reset OTP.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotReset = async (e) => {
    e.preventDefault();
    if (forgotNewPass.length < 6) {
      addToast('New password must be at least 6 characters.', 'warning');
      return;
    }
    setLoading(true);
    try {
      const res = await api.post('/users/reset-password', {
        email: forgotEmail,
        otp: forgotOtp,
        newPassword: forgotNewPass
      });
      if (res.data.success) {
        addToast('Password reset successfully! You can now login with your new password.', 'success');
        setIsForgotModalOpen(false);
        setForgotStep(1);
        setForgotOtp('');
        setForgotNewPass('');
      }
    } catch (err) {
      addToast(err.response?.data?.message || 'Password reset failed.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // 4. Address Operations
  const handleOpenAddAddress = () => {
    setEditingAddressId(null);
    setAddressForm({
      fullName: user?.name || '',
      phone: user?.phone || '',
      street: '',
      villageCity: '',
      district: '',
      state: user?.farmDetails?.state || 'Gujarat',
      pincode: '',
      landmark: '',
      addressType: 'Farm',
      isDefault: user?.addresses?.length === 0
    });
    setIsAddressModalOpen(true);
  };

  const handleOpenEditAddress = (addr) => {
    setEditingAddressId(addr._id);
    setAddressForm({
      fullName: addr.fullName || '',
      phone: addr.phone || '',
      street: addr.street || '',
      villageCity: addr.villageCity || '',
      district: addr.district || '',
      state: addr.state || 'Gujarat',
      pincode: addr.pincode || '',
      landmark: addr.landmark || '',
      addressType: addr.addressType || 'Farm',
      isDefault: addr.isDefault || false
    });
    setIsAddressModalOpen(true);
  };

  const handleSaveAddress = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let res;
      if (editingAddressId) {
        res = await api.put(`/users/addresses/${editingAddressId}`, addressForm);
      } else {
        res = await api.post('/users/addresses', addressForm);
      }
      if (res.data.success) {
        updateUserData({ ...user, addresses: res.data.addresses });
        addToast(res.data.message || 'Delivery address saved successfully!', 'success');
        setIsAddressModalOpen(false);
      }
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to save address.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAddress = async (addressId) => {
    if (!window.confirm('Are you sure you want to remove this delivery address?')) return;
    try {
      const res = await api.delete(`/users/addresses/${addressId}`);
      if (res.data.success) {
        updateUserData({ ...user, addresses: res.data.addresses });
        addToast('Address removed successfully.', 'info');
      }
    } catch (err) {
      addToast('Failed to delete address.', 'error');
    }
  };

  const handleSetDefaultAddress = async (addressId) => {
    try {
      const res = await api.put(`/users/addresses/${addressId}/default`);
      if (res.data.success) {
        updateUserData({ ...user, addresses: res.data.addresses });
        addToast('Default farm delivery address updated!', 'success');
      }
    } catch (err) {
      addToast('Failed to set default address.', 'error');
    }
  };

  if (!isAuthenticated && !user) {
    return (
      <div className="container" style={{ padding: '4rem 1.25rem', textAlign: 'center' }}>
        <div style={{ background: 'var(--bg-surface)', borderRadius: '16px', border: '1px solid var(--border-color)', padding: '3rem', maxWidth: '500px', margin: '0 auto' }}>
          <User size={48} color="#166534" style={{ margin: '0 auto 1rem auto' }} />
          <h2 style={{ fontSize: '1.5rem', color: 'var(--text-main)', marginBottom: '0.5rem' }}>Farmer Account Login Required</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            Please login to view your profile details, farm addresses, order history, and security settings.
          </p>
          <Link to="/login?redirect=/profile" className="btn btn-primary btn-lg" style={{ width: '100%' }}>
            <span>Login to Your Account</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '2.5rem 1.25rem 5rem 1.25rem' }}>
      {/* Header Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #062416, #14532d)',
          color: '#ffffff',
          borderRadius: '20px',
          padding: '2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.5rem',
          marginBottom: '2.5rem',
          boxShadow: 'var(--shadow-md)'
        }}
      >
        <div className="flex items-center gap-4">
          {profileForm.avatar || user?.avatar ? (
            <img
              src={profileForm.avatar || user?.avatar}
              alt={user?.name}
              style={{
                width: '68px',
                height: '68px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '3px solid #86efac',
                boxShadow: '0 4px 12px rgba(0,0,0,0.25)'
              }}
            />
          ) : (
            <div
              style={{
                width: '68px',
                height: '68px',
                borderRadius: '50%',
                background: '#86efac',
                color: 'var(--text-main)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.75rem',
                fontWeight: 900,
                boxShadow: '0 4px 12px rgba(0,0,0,0.25)'
              }}
            >
              {user?.name?.charAt(0)?.toUpperCase() || 'F'}
            </div>
          )}
          <div>
            <div className="flex items-center gap-2">
              <h1 style={{ fontSize: '1.75rem', fontWeight: 900, color: '#ffffff', margin: 0 }}>
                {user?.name}
              </h1>
              <span className="badge badge-success" style={{ fontSize: '0.7rem' }}>VERIFIED FARMER</span>
            </div>
            <div style={{ fontSize: '0.85rem', color: '#dcfce7', marginTop: '0.2rem' }}>
              {user?.email} • {user?.phone || 'No phone added'}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#a7f3d0', marginTop: '0.15rem' }}>
              {user?.farmDetails?.farmType} ({user?.farmDetails?.farmSizeAcres || 5} Acres in {user?.farmDetails?.state})
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/orders" className="btn btn-secondary btn-sm" style={{ background: 'rgba(255,255,255,0.15)', borderColor: 'rgba(255,255,255,0.3)', color: '#ffffff' }}>
            <Package size={16} />
            <span>My Machinery Orders</span>
          </Link>
          <button onClick={logout} className="btn btn-danger btn-sm">
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Layout: Nav Tabs Sidebar + Content */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Left Navigation Sidebar */}
        <div className="flex flex-col gap-2" style={{ background: 'var(--bg-surface)', borderRadius: '16px', border: '1px solid var(--border-color)', padding: '1rem', height: 'fit-content' }}>
          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.85rem 1rem',
              borderRadius: '10px',
              border: 'none',
              background: activeTab === 'profile' ? '#f0fdf4' : 'transparent',
              color: activeTab === 'profile' ? '#166534' : '#475569',
              fontWeight: activeTab === 'profile' ? 800 : 500,
              fontSize: '0.9rem',
              cursor: 'pointer',
              textAlign: 'left',
              width: '100%'
            }}
          >
            <User size={18} color={activeTab === 'profile' ? '#166534' : '#64748b'} />
            <span>Farmer Profile & Details</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('addresses')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.85rem 1rem',
              borderRadius: '10px',
              border: 'none',
              background: activeTab === 'addresses' ? '#f0fdf4' : 'transparent',
              color: activeTab === 'addresses' ? '#166534' : '#475569',
              fontWeight: activeTab === 'addresses' ? 800 : 500,
              fontSize: '0.9rem',
              cursor: 'pointer',
              textAlign: 'left',
              width: '100%'
            }}
          >
            <MapPin size={18} color={activeTab === 'addresses' ? '#166534' : '#64748b'} />
            <span>Saved Farm Addresses ({user?.addresses?.length || 0})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('security')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.85rem 1rem',
              borderRadius: '10px',
              border: 'none',
              background: activeTab === 'security' ? '#f0fdf4' : 'transparent',
              color: activeTab === 'security' ? '#166534' : '#475569',
              fontWeight: activeTab === 'security' ? 800 : 500,
              fontSize: '0.9rem',
              cursor: 'pointer',
              textAlign: 'left',
              width: '100%'
            }}
          >
            <Lock size={18} color={activeTab === 'security' ? '#166534' : '#64748b'} />
            <span>Security & Password</span>
          </button>

          <Link
            to="/orders"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.85rem 1rem',
              borderRadius: '10px',
              color: 'var(--text-muted)',
              fontSize: '0.9rem',
              fontWeight: 500,
              textDecoration: 'none'
            }}
          >
            <Package size={18} color="#64748b" />
            <span>My Machinery Orders</span>
          </Link>
        </div>

        {/* Right Content Area */}
        <div className="md:col-span-3">
          {/* TAB 1: PROFILE & CONTACT DETAILS */}
          {activeTab === 'profile' && (
            <div style={{ background: 'var(--bg-surface)', borderRadius: '16px', border: '1px solid var(--border-color)', padding: '2rem', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.25rem', color: 'var(--text-main)', fontWeight: 800 }}>Farmer Profile Information</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  Update your contact details, farm profile, and land cultivation information.
                </p>
              </div>

              <form onSubmit={handleUpdateProfile} className="flex flex-col gap-6">
                {/* Farmer Profile Avatar Photo Upload Card */}
                <div style={{
                  background: 'var(--bg-surface-alt)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '12px',
                  padding: '1.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1.5rem',
                  flexWrap: 'wrap'
                }}>
                  <div style={{ position: 'relative' }}>
                    {profileForm.avatar ? (
                      <img
                        src={profileForm.avatar}
                        alt="Avatar Preview"
                        style={{
                          width: '74px',
                          height: '74px',
                          borderRadius: '50%',
                          objectFit: 'cover',
                          border: '3px solid #16a34a',
                          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                        }}
                      />
                    ) : (
                      <div style={{
                        width: '74px',
                        height: '74px',
                        borderRadius: '50%',
                        background: '#166534',
                        color: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.75rem',
                        fontWeight: 900
                      }}>
                        {profileForm.name?.charAt(0)?.toUpperCase() || 'F'}
                      </div>
                    )}
                  </div>

                  <div className="flex-1" style={{ minWidth: '220px' }}>
                    <div style={{ fontWeight: 800, color: 'var(--text-main)', fontSize: '0.95rem', marginBottom: '0.25rem' }}>
                      Profile Photo / Kisan Avatar
                    </div>
                    <p style={{ fontSize: '0.785rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                      Upload your farm photo or portrait. Supported: JPG, PNG, WebP (Max 5MB).
                    </p>

                    <div className="flex items-center gap-3 flex-wrap">
                      <label className="btn btn-primary btn-sm" style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                        <Camera size={15} />
                        <span>Upload Photo</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleAvatarFileChange}
                          style={{ display: 'none' }}
                        />
                      </label>

                      {profileForm.avatar && (
                        <button
                          type="button"
                          onClick={() => setProfileForm(prev => ({ ...prev, avatar: '' }))}
                          className="btn btn-secondary btn-sm"
                          style={{ color: '#dc2626', borderColor: '#fca5a5' }}
                        >
                          <Trash2 size={14} />
                          <span>Remove Photo</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="input-group">
                    <label className="input-label">Full Name *</label>
                    <input
                      type="text"
                      required
                      className="input-field"
                      value={profileForm.name}
                      onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                    />
                  </div>

                  <div className="input-group">
                    <label className="input-label">Email Address (Login ID) *</label>
                    <input
                      type="email"
                      required
                      className="input-field"
                      value={profileForm.email}
                      onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                    />
                  </div>

                  <div className="input-group">
                    <label className="input-label">Mobile Number *</label>
                    <input
                      type="tel"
                      className="input-field"
                      value={profileForm.phone}
                      onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                      placeholder="e.g. +91 98765 43210"
                    />
                  </div>

                  <div className="input-group">
                    <label className="input-label">Primary Farm Type</label>
                    <select
                      className="select-field"
                      value={profileForm.farmType}
                      onChange={(e) => setProfileForm({ ...profileForm, farmType: e.target.value })}
                    >
                      <option value="Vegetable & Crop Farming">Vegetable & Crop Farming</option>
                      <option value="Cotton & Sugarcane">Cotton & Sugarcane</option>
                      <option value="Paddy & Wheat">Paddy & Wheat</option>
                      <option value="Horticulture Orchards">Horticulture Orchards</option>
                      <option value="Multi-Crop Integrated Farm">Multi-Crop Integrated Farm</option>
                    </select>
                  </div>

                  <div className="input-group">
                    <label className="input-label">Cultivated Land Area (Acres)</label>
                    <input
                      type="number"
                      min="1"
                      max="1000"
                      className="input-field"
                      value={profileForm.farmSizeAcres}
                      onChange={(e) => setProfileForm({ ...profileForm, farmSizeAcres: e.target.value })}
                    />
                  </div>

                  <div className="input-group">
                    <label className="input-label">State</label>
                    <select
                      className="select-field"
                      value={profileForm.state}
                      onChange={(e) => setProfileForm({ ...profileForm, state: e.target.value })}
                    >
                      {indianStates.map(st => (
                        <option key={st} value={st}>{st}</option>
                      ))}
                    </select>
                  </div>

                  <div className="input-group">
                    <label className="input-label">District</label>
                    <input
                      type="text"
                      className="input-field"
                      value={profileForm.district}
                      onChange={(e) => setProfileForm({ ...profileForm, district: e.target.value })}
                      placeholder="e.g. Rajkot, Ludhiana, Pune..."
                    />
                  </div>

                  <div className="input-group">
                    <label className="input-label">Preferred Advisory Language</label>
                    <select
                      className="select-field"
                      value={profileForm.preferredLanguage}
                      onChange={(e) => setProfileForm({ ...profileForm, preferredLanguage: e.target.value })}
                    >
                      <option value="Hindi / English">Hindi / English</option>
                      <option value="Gujarati">Gujarati</option>
                      <option value="Punjabi">Punjabi</option>
                      <option value="Marathi">Marathi</option>
                      <option value="Telugu">Telugu</option>
                      <option value="Tamil">Tamil</option>
                    </select>
                  </div>
                </div>

                <div style={{ marginTop: '1rem' }}>
                  <button type="submit" disabled={loading} className="btn btn-primary btn-lg">
                    <Save size={18} />
                    <span>{loading ? 'Saving Changes...' : 'Save Profile Changes'}</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 2: MULTIPLE SAVED ADDRESSES */}
          {activeTab === 'addresses' && (
            <div style={{ background: 'var(--bg-surface)', borderRadius: '16px', border: '1px solid var(--border-color)', padding: '2rem', boxShadow: 'var(--shadow-sm)' }}>
              <div className="flex justify-between items-center" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.25rem', color: 'var(--text-main)', fontWeight: 800 }}>Saved Farm Delivery Addresses</h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    Manage multiple farm plots, warehouses, and doorstep delivery destinations.
                  </p>
                </div>
                <button type="button" onClick={handleOpenAddAddress} className="btn btn-primary btn-sm">
                  <Plus size={16} />
                  <span>Add New Farm Address</span>
                </button>
              </div>

              {(!user?.addresses || user.addresses.length === 0) ? (
                <div style={{ textAlign: 'center', padding: '3rem', background: 'var(--bg-surface-alt)', borderRadius: '12px', border: '1px dashed #cbd5e1' }}>
                  <MapPin size={36} color="#94a3b8" style={{ margin: '0 auto 0.75rem auto' }} />
                  <h4 style={{ fontSize: '1rem', color: 'var(--text-main)', marginBottom: '0.25rem' }}>No Saved Delivery Addresses</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                    Add your farm plot or village delivery address for 1-click checkout.
                  </p>
                  <button onClick={handleOpenAddAddress} className="btn btn-primary btn-sm">
                    Add First Address
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {user.addresses.map((addr) => (
                    <div
                      key={addr._id}
                      style={{
                        border: addr.isDefault ? '2px solid #166534' : '1px solid #e2e8f0',
                        background: addr.isDefault ? '#f0fdf4' : '#ffffff',
                        borderRadius: '12px',
                        padding: '1.25rem',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        position: 'relative'
                      }}
                    >
                      <div>
                        <div className="flex justify-between items-start" style={{ marginBottom: '0.5rem' }}>
                          <span className="badge" style={{ background: '#e2e8f0', color: 'var(--text-main)', fontSize: '0.7rem' }}>
                            {addr.addressType || 'Farm'} Address
                          </span>
                          {addr.isDefault && (
                            <span className="badge badge-success" style={{ fontSize: '0.7rem' }}>
                              Default Address
                            </span>
                          )}
                        </div>

                        <div style={{ fontWeight: 800, color: 'var(--text-main)', fontSize: '1rem', marginBottom: '0.25rem' }}>
                          {addr.fullName || user.name}
                        </div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.4, marginBottom: '0.5rem' }}>
                          <div>{addr.street}</div>
                          <div>{addr.villageCity}, {addr.district} - {addr.pincode}</div>
                          <div>{addr.state}, India</div>
                          {addr.landmark && <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Landmark: {addr.landmark}</div>}
                          {addr.phone && <div style={{ color: '#166534', fontWeight: 600, marginTop: '0.25rem' }}>📞 {addr.phone}</div>}
                        </div>
                      </div>

                      <div className="flex items-center justify-between" style={{ borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem', marginTop: '0.5rem' }}>
                        {!addr.isDefault ? (
                          <button
                            type="button"
                            onClick={() => handleSetDefaultAddress(addr._id)}
                            style={{ background: 'none', border: 'none', color: '#166534', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer', padding: 0 }}
                          >
                            Set as Default
                          </button>
                        ) : (
                          <span style={{ fontSize: '0.75rem', color: '#166534', fontWeight: 700 }}>✓ Primary Delivery</span>
                        )}

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleOpenEditAddress(addr)}
                            className="btn btn-secondary btn-sm"
                            style={{ padding: '0.35rem 0.6rem' }}
                            title="Edit Address"
                          >
                            <Edit2 size={13} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteAddress(addr._id)}
                            className="btn btn-danger btn-sm"
                            style={{ padding: '0.35rem 0.6rem' }}
                            title="Delete Address"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: SECURITY & PASSWORD */}
          {activeTab === 'security' && (
            <div style={{ background: 'var(--bg-surface)', borderRadius: '16px', border: '1px solid var(--border-color)', padding: '2rem', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.25rem', color: 'var(--text-main)', fontWeight: 800 }}>Account Security & Password</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  Update your account password or initiate OTP password recovery.
                </p>
              </div>

              <form onSubmit={handleChangePassword} style={{ maxWidth: '480px' }} className="flex flex-col gap-4">
                <div className="input-group">
                  <label className="input-label">Current Password *</label>
                  <input
                    type="password"
                    required
                    className="input-field"
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                  />
                </div>

                <div className="input-group">
                  <label className="input-label">New Password * (Min. 6 chars)</label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    className="input-field"
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                  />
                </div>

                <div className="input-group">
                  <label className="input-label">Confirm New Password *</label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    className="input-field"
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                  />
                </div>

                <div className="flex items-center justify-between" style={{ marginTop: '0.75rem' }}>
                  <button type="submit" disabled={loading} className="btn btn-primary">
                    <KeyRound size={16} />
                    <span>{loading ? 'Updating Password...' : 'Update Password'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setForgotEmail(user?.email || '');
                      setForgotStep(1);
                      setIsForgotModalOpen(true);
                    }}
                    style={{ background: 'none', border: 'none', color: '#166534', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}
                  >
                    Forgot Password?
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* MODAL: ADD / EDIT ADDRESS */}
      <Modal
        isOpen={isAddressModalOpen}
        onClose={() => setIsAddressModalOpen(false)}
        title={editingAddressId ? 'Edit Farm Delivery Address' : 'Add New Farm Delivery Address'}
      >
        <form onSubmit={handleSaveAddress} className="flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="input-group">
              <label className="input-label">Recipient / Farmer Name *</label>
              <input
                type="text"
                required
                className="input-field"
                value={addressForm.fullName}
                onChange={(e) => setAddressForm({ ...addressForm, fullName: e.target.value })}
              />
            </div>

            <div className="input-group">
              <label className="input-label">Contact Mobile *</label>
              <input
                type="tel"
                required
                className="input-field"
                value={addressForm.phone}
                onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
              />
            </div>

            <div className="input-group sm:col-span-2">
              <label className="input-label">Farm Plot / Survey No. / Street Address *</label>
              <input
                type="text"
                required
                className="input-field"
                value={addressForm.street}
                onChange={(e) => setAddressForm({ ...addressForm, street: e.target.value })}
                placeholder="e.g. Survey No. 42, Near Primary School"
              />
            </div>

            <div className="input-group">
              <label className="input-label">Village / Town / City *</label>
              <input
                type="text"
                required
                className="input-field"
                value={addressForm.villageCity}
                onChange={(e) => setAddressForm({ ...addressForm, villageCity: e.target.value })}
                placeholder="e.g. Gondal"
              />
            </div>

            <div className="input-group">
              <label className="input-label">District *</label>
              <input
                type="text"
                required
                className="input-field"
                value={addressForm.district}
                onChange={(e) => setAddressForm({ ...addressForm, district: e.target.value })}
                placeholder="e.g. Rajkot"
              />
            </div>

            <div className="input-group">
              <label className="input-label">State *</label>
              <select
                className="select-field"
                value={addressForm.state}
                onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
              >
                {indianStates.map(st => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </select>
            </div>

            <div className="input-group">
              <label className="input-label">Postal Pincode *</label>
              <input
                type="text"
                required
                className="input-field"
                value={addressForm.pincode}
                onChange={(e) => setAddressForm({ ...addressForm, pincode: e.target.value })}
                placeholder="e.g. 360001"
              />
            </div>

            <div className="input-group">
              <label className="input-label">Landmark (Optional)</label>
              <input
                type="text"
                className="input-field"
                value={addressForm.landmark}
                onChange={(e) => setAddressForm({ ...addressForm, landmark: e.target.value })}
                placeholder="e.g. Near Kisan Cooperative Bank"
              />
            </div>

            <div className="input-group">
              <label className="input-label">Address Type</label>
              <select
                className="select-field"
                value={addressForm.addressType}
                onChange={(e) => setAddressForm({ ...addressForm, addressType: e.target.value })}
              >
                <option value="Farm">Farm Land Plot</option>
                <option value="Home">Home Residence</option>
                <option value="Warehouse">Warehouse / Godown</option>
                <option value="Cooperative">Village Cooperative Center</option>
              </select>
            </div>
          </div>

          <label className="flex items-center gap-2" style={{ fontSize: '0.85rem', cursor: 'pointer', marginTop: '0.5rem' }}>
            <input
              type="checkbox"
              checked={addressForm.isDefault}
              onChange={(e) => setAddressForm({ ...addressForm, isDefault: e.target.checked })}
            />
            <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>Make this my default farm delivery address</span>
          </label>

          <div className="flex justify-end gap-2" style={{ marginTop: '1rem' }}>
            <button type="button" onClick={() => setIsAddressModalOpen(false)} className="btn btn-secondary btn-sm">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn btn-primary btn-sm">
              {loading ? 'Saving...' : 'Save Address'}
            </button>
          </div>
        </form>
      </Modal>

      {/* MODAL: FORGOT PASSWORD OTP RECOVERY */}
      <Modal
        isOpen={isForgotModalOpen}
        onClose={() => setIsForgotModalOpen(false)}
        title="Forgot Password • OTP Reset"
      >
        {forgotStep === 1 ? (
          <form onSubmit={handleForgotRequest} className="flex flex-col gap-4">
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Enter your registered email address to receive a 6-digit password reset verification OTP.
            </p>

            <div className="input-group">
              <label className="input-label">Registered Email *</label>
              <input
                type="email"
                required
                className="input-field"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
              />
            </div>

            <div className="flex justify-end gap-2" style={{ marginTop: '0.5rem' }}>
              <button type="button" onClick={() => setIsForgotModalOpen(false)} className="btn btn-secondary btn-sm">
                Cancel
              </button>
              <button type="submit" disabled={loading} className="btn btn-primary btn-sm">
                {loading ? 'Sending OTP...' : 'Send Verification OTP'}
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleForgotReset} className="flex flex-col gap-4">
            <div style={{ background: 'var(--primary-50)', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid #bbf7d0', fontSize: '0.8rem', color: '#166534' }}>
              ✓ Verification OTP sent to <strong>{forgotEmail}</strong> {demoOtpNotice}
            </div>

            <div className="input-group">
              <label className="input-label">Enter 6-Digit OTP *</label>
              <input
                type="text"
                required
                maxLength={6}
                className="input-field"
                value={forgotOtp}
                onChange={(e) => setForgotOtp(e.target.value)}
                placeholder="e.g. 749281"
              />
            </div>

            <div className="input-group">
              <label className="input-label">New Password * (Min. 6 chars)</label>
              <input
                type="password"
                required
                minLength={6}
                className="input-field"
                value={forgotNewPass}
                onChange={(e) => setForgotNewPass(e.target.value)}
                placeholder="Enter strong password"
              />
            </div>

            <div className="flex justify-between items-center" style={{ marginTop: '0.5rem' }}>
              <button type="button" onClick={() => setForgotStep(1)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '0.8rem', cursor: 'pointer' }}>
                ← Change Email
              </button>

              <button type="submit" disabled={loading} className="btn btn-primary btn-sm">
                {loading ? 'Resetting...' : 'Confirm & Reset Password'}
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};

export default UserProfilePage;
