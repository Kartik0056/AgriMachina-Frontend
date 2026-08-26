import React, { useState, useEffect } from 'react';
import { ShieldCheck, UserPlus, Key, Lock, CheckCircle2, XCircle, RefreshCw } from 'lucide-react';
import adminApi from '../../services/adminApi';
import { useToast } from '../../context/ToastContext';

const AdminUsersRolesPage = () => {
  const [admins, setAdmins] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('CATALOG_MANAGER');
  const [submitting, setSubmitting] = useState(false);

  const { addToast } = useToast();

  const fetchData = async () => {
    setLoading(true);
    try {
      const [adminRes, roleRes] = await Promise.all([
        adminApi.get('/roles/admins'),
        adminApi.get('/roles')
      ]);
      if (adminRes.data.success) setAdmins(adminRes.data.admins || []);
      if (roleRes.data.success) setRoles(roleRes.data.roles || []);
    } catch (err) {
      addToast('Failed to load RBAC permissions data', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await adminApi.post('/roles/admins', {
        name,
        email,
        username,
        password,
        role
      });
      if (res.data.success) {
        addToast(`Admin user "${name}" successfully created!`, 'success');
        setIsModalOpen(false);
        setName('');
        setEmail('');
        setUsername('');
        setPassword('');
        fetchData();
      }
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to create admin user', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Top Banner */}
      <div className="flex justify-between items-center" style={{ flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', color: 'var(--admin-text-main)', fontWeight: 800 }}>
            Administrators & Role-Based Access Control (RBAC)
          </h1>
          <p style={{ color: 'var(--admin-text-muted)', fontSize: '0.85rem' }}>
            Manage staff accounts, assign granular security privileges, and inspect system roles
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="btn btn-primary btn-sm"
        >
          <UserPlus size={16} />
          <span>Create Admin User</span>
        </button>
      </div>

      {/* Admin Users Table */}
      <div className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '1.25rem', borderBottom: '1px solid var(--admin-border, #1e2e4f)' }}>
          <h3 style={{ fontSize: '1.1rem', color: 'var(--admin-text-main)', fontWeight: 700 }}>Active System Administrators</h3>
        </div>
        <div className="admin-table-container" style={{ border: 'none' }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Admin Name</th>
                <th>Username</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Last Login</th>
              </tr>
            </thead>
            <tbody>
              {admins.map((adm) => (
                <tr key={adm._id}>
                  <td style={{ color: 'var(--admin-text-main)', fontWeight: 700 }}>{adm.name}</td>
                  <td><code style={{ color: 'var(--admin-text-main)' }}>{adm.username}</code></td>
                  <td style={{ color: 'var(--admin-text-muted)' }}>{adm.email}</td>
                  <td>
                    <span className="badge badge-primary">{adm.role}</span>
                  </td>
                  <td>
                    <span className={`badge ${adm.isActive ? 'badge-success' : 'badge-danger'}`}>
                      {adm.isActive ? 'Active' : 'Locked'}
                    </span>
                  </td>
                  <td style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)' }}>
                    {adm.lastLogin ? new Date(adm.lastLogin).toLocaleString('en-IN') : 'Never'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Roles & Permissions Matrix */}
      <div className="admin-card">
        <h3 style={{ fontSize: '1.1rem', color: 'var(--admin-text-main)', marginBottom: '1rem', fontWeight: 700 }}>
          Standard RBAC Security Roles
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {roles.map((r) => (
            <div
              key={r._id}
              style={{
                background: 'var(--admin-bg-card-alt)',
                border: '1px solid var(--admin-border, #1e2e4f)',
                borderRadius: '10px',
                padding: '1.25rem'
              }}
            >
              <div style={{ fontWeight: 800, color: 'var(--admin-accent, #34d399)', fontSize: '0.95rem', marginBottom: '0.35rem' }}>
                {r.name}
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--admin-text-muted)', lineHeight: 1.4, marginBottom: '0.75rem' }}>
                {r.description}
              </p>
              <div style={{ fontSize: '0.75rem', color: 'var(--admin-text-main)' }}>
                Privileges: <strong>{r.permissions?.length || 0} permissions</strong>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Create Admin Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '500px', background: 'var(--admin-bg-card)', border: '1px solid var(--admin-border, #334155)' }}>
            <h3 style={{ fontSize: '1.25rem', color: 'var(--admin-text-main)', marginBottom: '1rem', fontWeight: 800 }}>
              Create Staff Administrator Account
            </h3>

            <form onSubmit={handleCreateAdmin} className="flex flex-col gap-4">
              <div className="input-group">
                <label className="input-label" style={{ color: 'var(--admin-text-muted)' }}>Full Name *</label>
                <input
                  type="text"
                  required
                  className="input-field"
                  style={{ backgroundColor: 'var(--admin-input-bg)', borderColor: 'var(--admin-input-border)', color: 'var(--admin-text-main)' }}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Anand Sharma"
                />
              </div>

              <div className="input-group">
                <label className="input-label" style={{ color: 'var(--admin-text-muted)' }}>Username *</label>
                <input
                  type="text"
                  required
                  className="input-field"
                  style={{ backgroundColor: 'var(--admin-input-bg)', borderColor: 'var(--admin-input-border)', color: 'var(--admin-text-main)' }}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. anand_sharma"
                />
              </div>

              <div className="input-group">
                <label className="input-label" style={{ color: 'var(--admin-text-muted)' }}>Work Email Address *</label>
                <input
                  type="email"
                  required
                  className="input-field"
                  style={{ backgroundColor: 'var(--admin-input-bg)', borderColor: 'var(--admin-input-border)', color: 'var(--admin-text-main)' }}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="anand@agrimachinery.com"
                />
              </div>

              <div className="input-group">
                <label className="input-label" style={{ color: 'var(--admin-text-muted)' }}>Initial Master Password *</label>
                <input
                  type="password"
                  required
                  className="input-field"
                  style={{ backgroundColor: 'var(--admin-input-bg)', borderColor: 'var(--admin-input-border)', color: 'var(--admin-text-main)' }}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                />
              </div>

              <div className="input-group">
                <label className="input-label" style={{ color: 'var(--admin-text-muted)' }}>Assigned RBAC Role *</label>
                <select
                  className="select-field"
                  style={{ backgroundColor: 'var(--admin-input-bg)', borderColor: 'var(--admin-input-border)', color: 'var(--admin-text-main)' }}
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                >
                  <option value="CATALOG_MANAGER">CATALOG_MANAGER (Product Creation & Edits)</option>
                  <option value="INVENTORY_MANAGER">INVENTORY_MANAGER (Stock & Warehouses)</option>
                  <option value="ORDER_MANAGER">ORDER_MANAGER (Orders & Waybills)</option>
                  <option value="REVIEW_MODERATOR">REVIEW_MODERATOR (Farmer Reviews)</option>
                  <option value="SUPPORT_AGENT">SUPPORT_AGENT (Customer Read-only)</option>
                  <option value="SUPER_ADMIN">SUPER_ADMIN (Full System Privileges)</option>
                </select>
              </div>

              <div className="flex justify-end gap-2" style={{ marginTop: '1rem' }}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn btn-secondary btn-sm"
                  style={{ background: 'var(--admin-bg-card-alt)', borderColor: 'var(--admin-border)', color: 'var(--admin-text-main)' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn btn-primary btn-sm"
                >
                  {submitting ? 'Creating...' : 'Authorize & Create Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsersRolesPage;
