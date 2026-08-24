import React, { useState, useEffect } from 'react';
import { Users, ShieldCheck, Plus, UserPlus, Lock, Mail, RefreshCw } from 'lucide-react';
import adminApi from '../../services/adminApi';
import { useToast } from '../../context/ToastContext';

const AdminUsersRolesPage = () => {
  const [admins, setAdmins] = useState([]);
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Create admin modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('CATALOG_MANAGER');
  const [saving, setSaving] = useState(false);

  const { addToast } = useToast();

  const fetchData = async () => {
    setLoading(true);
    try {
      const [admRes, roleRes, permRes] = await Promise.all([
        adminApi.get('/roles/admins'),
        adminApi.get('/roles'),
        adminApi.get('/roles/permissions')
      ]);
      if (admRes.data.success) setAdmins(admRes.data.admins || []);
      if (roleRes.data.success) setRoles(roleRes.data.roles || []);
      if (permRes.data.success) setPermissions(permRes.data.permissions || []);
    } catch (err) {
      addToast('Failed to load RBAC roles & administrators', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await adminApi.post('/roles/admins', {
        username,
        name,
        email,
        password,
        role
      });
      if (res.data.success) {
        addToast(`Admin user ${res.data.admin.username} created successfully!`, 'success');
        setIsModalOpen(false);
        setUsername('');
        setName('');
        setEmail('');
        setPassword('');
        fetchData();
      }
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to create admin user', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Top Banner */}
      <div className="flex justify-between items-center" style={{ flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', color: '#ffffff', fontWeight: 800 }}>
            Administrators & Role-Based Access Control (RBAC)
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
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
        <div style={{ padding: '1.25rem', borderBottom: '1px solid var(--bg-dark-border)' }}>
          <h3 style={{ fontSize: '1.1rem', color: '#ffffff' }}>Active System Administrators</h3>
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
                  <td style={{ color: '#ffffff', fontWeight: 700 }}>{adm.name}</td>
                  <td><code>{adm.username}</code></td>
                  <td>{adm.email}</td>
                  <td>
                    <span className="badge badge-primary">{adm.role}</span>
                  </td>
                  <td>
                    <span className={`badge ${adm.isActive ? 'badge-success' : 'badge-danger'}`}>
                      {adm.isActive ? 'Active' : 'Locked'}
                    </span>
                  </td>
                  <td style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                    {adm.lastLogin ? new Date(adm.lastLogin).toLocaleString() : 'Never'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Roles & Permissions Matrix */}
      <div className="admin-card">
        <h3 style={{ fontSize: '1.1rem', color: '#ffffff', marginBottom: '1rem' }}>
          Standard RBAC Security Roles
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {roles.map((r) => (
            <div
              key={r._id}
              style={{
                background: '#070d1a',
                border: '1px solid #1e2e4f',
                borderRadius: '10px',
                padding: '1.25rem'
              }}
            >
              <div style={{ fontWeight: 800, color: '#34d399', fontSize: '0.95rem', marginBottom: '0.35rem' }}>
                {r.name}
              </div>
              <p style={{ fontSize: '0.8rem', color: '#94a3b8', lineHeight: 1.4, marginBottom: '0.75rem' }}>
                {r.description}
              </p>
              <div style={{ fontSize: '0.75rem', color: '#cbd5e1' }}>
                Privileges: <strong>{r.permissions?.length || 0} permissions</strong>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Create Admin Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content dark-theme" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '500px' }}>
            <h3 style={{ fontSize: '1.25rem', color: '#ffffff', marginBottom: '1rem' }}>
              Create Staff Administrator Account
            </h3>

            <form onSubmit={handleCreateAdmin} className="flex flex-col gap-4">
              <div className="input-group">
                <label className="input-label" style={{ color: '#cbd5e1' }}>Full Name *</label>
                <input
                  type="text"
                  required
                  className="input-field"
                  style={{ background: '#0b1324', borderColor: '#1e2e4f', color: '#ffffff' }}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Anand Sharma"
                />
              </div>

              <div className="input-group">
                <label className="input-label" style={{ color: '#cbd5e1' }}>Username *</label>
                <input
                  type="text"
                  required
                  className="input-field"
                  style={{ background: '#0b1324', borderColor: '#1e2e4f', color: '#ffffff' }}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. anand_sharma"
                />
              </div>

              <div className="input-group">
                <label className="input-label" style={{ color: '#cbd5e1' }}>Work Email Address *</label>
                <input
                  type="email"
                  required
                  className="input-field"
                  style={{ background: '#0b1324', borderColor: '#1e2e4f', color: '#ffffff' }}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="anand@agrimachinery.com"
                />
              </div>

              <div className="input-group">
                <label className="input-label" style={{ color: '#cbd5e1' }}>Initial Master Password *</label>
                <input
                  type="password"
                  required
                  className="input-field"
                  style={{ background: '#0b1324', borderColor: '#1e2e4f', color: '#ffffff' }}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                />
              </div>

              <div className="input-group">
                <label className="input-label" style={{ color: '#cbd5e1' }}>Assigned RBAC Role *</label>
                <select
                  className="select-field"
                  style={{ background: '#0b1324', borderColor: '#1e2e4f', color: '#ffffff' }}
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
                  style={{ background: '#1e293b', borderColor: '#334155', color: '#ffffff' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="btn btn-primary btn-sm"
                >
                  {saving ? 'Creating...' : 'Create Account'}
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
