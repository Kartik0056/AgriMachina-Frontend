import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ShieldCheck, Lock, User, Tractor, AlertCircle, ArrowRight } from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { useToast } from '../../context/ToastContext';

const AdminLoginPage = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login, adminPanelPath } = useAdminAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || adminPanelPath;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(identifier, password);
      addToast('Administrative session established successfully.', 'success');
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Invalid administrative credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'radial-gradient(circle at top, #132742 0%, #070d1a 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.5rem'
    }}>
      <div style={{
        maxWidth: '440px',
        width: '100%',
        background: '#0e172a',
        border: '1px solid #1e2e4f',
        borderRadius: '20px',
        padding: '2.5rem',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
        color: '#ffffff'
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: '54px',
            height: '54px',
            background: 'linear-gradient(135deg, #166534, #15803d)',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem auto',
            boxShadow: '0 0 20px rgba(34, 197, 94, 0.3)'
          }}>
            <ShieldCheck size={30} color="#86efac" />
          </div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em' }}>
            Secure Operations Portal
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '0.8rem', marginTop: '0.25rem' }}>
            Authorized Agricultural Machinery Operations & CMS Access
          </p>
        </div>

        {error && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid #ef4444',
            padding: '0.75rem 1rem',
            borderRadius: '8px',
            color: '#fca5a5',
            fontSize: '0.825rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginBottom: '1.25rem'
          }}>
            <AlertCircle size={16} color="#ef4444" style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="input-group">
            <label className="input-label" style={{ color: '#cbd5e1' }}>Admin Username or Email</label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                required
                className="input-field"
                style={{
                  background: 'rgba(0,0,0,0.3)',
                  borderColor: '#1e2e4f',
                  color: '#ffffff',
                  paddingLeft: '2.5rem'
                }}
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="admin@agrimachinery.com"
                autoComplete="username"
              />
              <User size={16} color="#64748b" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </div>

          <div className="input-group">
            <label className="input-label" style={{ color: '#cbd5e1' }}>Admin Master Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type="password"
                required
                className="input-field"
                style={{
                  background: 'rgba(0,0,0,0.3)',
                  borderColor: '#1e2e4f',
                  color: '#ffffff',
                  paddingLeft: '2.5rem'
                }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                autoComplete="current-password"
              />
              <Lock size={16} color="#64748b" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary btn-lg"
            style={{ marginTop: '0.75rem', width: '100%', background: '#166534' }}
          >
            <span>{loading ? 'Authenticating...' : 'Authenticate Admin Session'}</span>
            <ArrowRight size={18} />
          </button>
        </form>

        <div style={{
          marginTop: '2rem',
          borderTop: '1px solid #1e2e4f',
          paddingTop: '1rem',
          textAlign: 'center',
          fontSize: '0.75rem',
          color: '#64748b'
        }}>
          Protected by bcrypt / Argon2 hashing, rate limits, and audit logs.
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;
