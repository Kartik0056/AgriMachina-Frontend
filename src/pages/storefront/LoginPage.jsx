import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link, useSearchParams } from 'react-router-dom';
import { Tractor, Lock, Mail, User as UserIcon, Phone, MapPin, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

const LoginPage = () => {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const redirectParam = searchParams.get('redirect') || location.state?.from || '/orders';

  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [farmType, setFarmType] = useState('Vegetable & Cotton');
  const [farmSizeAcres, setFarmSizeAcres] = useState(5);
  const [loading, setLoading] = useState(false);

  const { login, register, isAuthenticated } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  // If already logged in, redirect immediately
  useEffect(() => {
    if (isAuthenticated) {
      navigate(redirectParam, { replace: true });
    }
  }, [isAuthenticated, redirectParam, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isRegister) {
        await register({
          name,
          email,
          phone,
          password,
          farmDetails: {
            farmType,
            farmSizeAcres: Number(farmSizeAcres),
            state: 'Gujarat'
          }
        });
        addToast('Farmer account created successfully! 🌾', 'success');
      } else {
        await login(email, password);
        addToast('Welcome back to AgriMachina!', 'success');
      }
      navigate(redirectParam, { replace: true });
    } catch (error) {
      addToast(error.message || 'Authentication error', 'error');
    } finally {
      setLoading(false);
    }
  };

  const isCheckoutRedirect = redirectParam.includes('checkout');

  return (
    <div className="container" style={{ padding: '4rem 1.25rem', maxWidth: '520px' }}>
      {isCheckoutRedirect && (
        <div style={{
          background: '#f0fdf4',
          border: '1px solid #86efac',
          borderRadius: '14px',
          padding: '1rem 1.25rem',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          color: '#166534',
          fontSize: '0.875rem'
        }}>
          <ShieldCheck size={22} color="#16a34a" style={{ flexShrink: 0 }} />
          <div>
            <strong>Login Required for Order Confirmation</strong>
            <p style={{ margin: '0.2rem 0 0 0', color: '#15803d', fontSize: '0.8rem' }}>
              Sign in or register to link your machinery warranty, farm dispatch address, and GST tax invoice.
            </p>
          </div>
        </div>
      )}
      <div style={{
        background: '#ffffff',
        borderRadius: '20px',
        border: '1px solid #e2e8f0',
        padding: '2.5rem',
        boxShadow: 'var(--shadow-lg)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: '56px',
            height: '56px',
            background: '#166534',
            color: '#ffffff',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 0.75rem auto'
          }}>
            <Tractor size={30} color="#86efac" />
          </div>
          <h2 style={{ fontSize: '1.75rem', color: '#062416' }}>
            {isRegister ? 'Farmer Account Registration' : 'Farmer Customer Login'}
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.875rem' }}>
            {isRegister ? 'Register your agricultural holding for equipment financing and order tracking' : 'Access your machinery orders, warranties, and verified reviews'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {isRegister && (
            <>
              <div className="input-group">
                <label className="input-label">Farmer Full Name *</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    required
                    className="input-field"
                    style={{ paddingLeft: '2.5rem' }}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Ramesh Patel"
                  />
                  <UserIcon size={16} color="#64748b" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
                </div>
              </div>

              <div className="input-group">
                <label className="input-label">Mobile Number *</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="tel"
                    required
                    className="input-field"
                    style={{ paddingLeft: '2.5rem' }}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                  />
                  <Phone size={16} color="#64748b" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="input-group">
                  <label className="input-label">Primary Crop / Farm</label>
                  <input
                    type="text"
                    className="input-field"
                    value={farmType}
                    onChange={(e) => setFarmType(e.target.value)}
                    placeholder="e.g. Cotton & Paddy"
                  />
                </div>
                <div className="input-group">
                  <label className="input-label">Acres</label>
                  <input
                    type="number"
                    className="input-field"
                    value={farmSizeAcres}
                    onChange={(e) => setFarmSizeAcres(e.target.value)}
                  />
                </div>
              </div>
            </>
          )}

          <div className="input-group">
            <label className="input-label">Email Address *</label>
            <div style={{ position: 'relative' }}>
              <input
                type="email"
                required
                className="input-field"
                style={{ paddingLeft: '2.5rem' }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
              />
              <Mail size={16} color="#64748b" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </div>

          <div className="input-group">
            <label className="input-label">Password *</label>
            <div style={{ position: 'relative' }}>
              <input
                type="password"
                required
                className="input-field"
                style={{ paddingLeft: '2.5rem' }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
              <Lock size={16} color="#64748b" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn btn-primary btn-lg" style={{ marginTop: '0.5rem' }}>
            <span>{loading ? 'Processing...' : isRegister ? 'Create Farmer Account' : 'Sign In'}</span>
            <ArrowRight size={18} />
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem' }}>
          {isRegister ? (
            <div>
              Already have an account?{' '}
              <button
                onClick={() => setIsRegister(false)}
                style={{ background: 'none', border: 'none', color: '#166534', fontWeight: 700, cursor: 'pointer' }}
              >
                Sign In
              </button>
            </div>
          ) : (
            <div>
              New farmer?{' '}
              <button
                onClick={() => setIsRegister(true)}
                style={{ background: 'none', border: 'none', color: '#166534', fontWeight: 700, cursor: 'pointer' }}
              >
                Create Account
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
