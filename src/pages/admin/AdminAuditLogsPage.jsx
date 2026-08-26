import React, { useState, useEffect } from 'react';
import { ShieldAlert, RefreshCw, Eye, User, Clock, ShieldCheck, Search, Database } from 'lucide-react';
import adminApi from '../../services/adminApi';
import { useToast } from '../../context/ToastContext';

const AdminAuditLogsPage = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionFilter, setActionFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLog, setSelectedLog] = useState(null);
  const { addToast } = useToast();

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await adminApi.get('/audit-logs', {
        params: { action: actionFilter, search: searchQuery, limit: 100 }
      });
      if (res.data.success) {
        setLogs(res.data.logs || []);
      }
    } catch (err) {
      addToast('Failed to load audit logs', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [actionFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchLogs();
  };

  const actionTypes = [
    { label: 'All Operations', value: '' },
    { label: '🔑 Logins', value: 'ADMIN_LOGIN' },
    { label: '📦 Order Status', value: 'ORDER_STATUS_CHANGED' },
    { label: '🚜 Product Create', value: 'PRODUCT_CREATE' },
    { label: '✏️ Product Updates', value: 'PRODUCT_UPDATED' },
    { label: '💰 Price Changes', value: 'PRICE_CHANGED' },
    { label: '📊 Stock Changes', value: 'STOCK_CHANGED' },
    { label: '⭐ Review Actions', value: 'REVIEW_APPROVED' }
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Top Banner */}
      <div className="flex justify-between items-center" style={{ flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', color: 'var(--admin-text-main)', fontWeight: 800 }}>
            Administrative Audit Trail & Security Logs
          </h1>
          <p style={{ color: 'var(--admin-text-muted)', fontSize: '0.85rem' }}>
            Immutable security log of all admin operations, catalog mutations, pricing changes, and logins with exact timestamps
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchLogs}
            className="btn btn-secondary btn-sm"
            style={{
              background: 'var(--admin-bg-card)',
              borderColor: 'var(--admin-border)',
              color: 'var(--admin-text-main)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem'
            }}
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            <span>Refresh Audit Logs</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Strip */}
      <div className="admin-card" style={{ padding: '1rem 1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {/* Action Filters */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--admin-text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginRight: '0.25rem' }}>
            Filter:
          </span>
          {actionTypes.map((act) => {
            const isActive = actionFilter === act.value;
            return (
              <button
                key={act.value}
                type="button"
                onClick={() => setActionFilter(act.value)}
                className={`btn btn-sm ${isActive ? 'btn-primary' : 'btn-secondary'}`}
                style={{
                  background: isActive ? 'var(--admin-accent, #166534)' : 'var(--admin-bg-main, #0b1324)',
                  borderColor: isActive ? 'var(--admin-accent, #22c55e)' : 'var(--admin-border, #1e2e4f)',
                  color: isActive ? '#ffffff' : 'var(--admin-text-main, #e2e8f0)',
                  fontSize: '0.75rem',
                  fontWeight: isActive ? 800 : 600,
                  padding: '0.35rem 0.75rem'
                }}
              >
                {act.label}
              </button>
            );
          })}
        </div>

        {/* Search by admin / keyword */}
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '0.5rem', maxWidth: '480px' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <input
              type="text"
              placeholder="Search audit by Admin name, email, IP, or resource ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                backgroundColor: 'var(--admin-input-bg)',
                border: '1px solid var(--admin-input-border, var(--admin-border))',
                borderRadius: '8px',
                padding: '0.45rem 0.85rem 0.45rem 2.2rem',
                color: 'var(--admin-text-main)',
                fontSize: '0.825rem',
                outline: 'none'
              }}
            />
            <Search size={14} color="var(--admin-text-muted, #94a3b8)" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }} />
          </div>
          <button type="submit" className="btn btn-primary btn-sm" style={{ padding: '0.45rem 0.95rem', fontSize: '0.8rem' }}>
            Search
          </button>
        </form>
      </div>

      {/* Logs Table */}
      <div className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="admin-table-container" style={{ border: 'none' }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ width: '210px' }}>Exact Timestamp</th>
                <th>Admin Operator</th>
                <th>Action Performed</th>
                <th>Resource / Target</th>
                <th>Client IP</th>
                <th style={{ textAlign: 'right' }}>Details</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '3rem', color: 'var(--admin-text-muted)' }}>
                    Loading audit trail from MongoDB...
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '3rem', color: 'var(--admin-text-muted)' }}>
                    No audit records match the selected criteria.
                  </td>
                </tr>
              ) : (
                logs.map((log) => {
                  const logDate = log.timestamp || log.createdAt;
                  const formattedDate = logDate
                    ? new Date(logDate).toLocaleString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                        hour12: true
                      })
                    : 'Just Now';

                  return (
                    <tr key={log._id}>
                      <td style={{ fontSize: '0.8rem', color: 'var(--admin-text-main)', whiteSpace: 'nowrap' }}>
                        <div className="flex items-center gap-1.5">
                          <Clock size={13} color="var(--admin-accent, #34d399)" />
                          <span style={{ fontWeight: 600 }}>{formattedDate}</span>
                        </div>
                      </td>
                      <td>
                        <div className="flex items-center gap-1.5">
                          <User size={14} color="var(--admin-accent, #34d399)" />
                          <span style={{ fontWeight: 700, color: 'var(--admin-text-main)' }}>
                            {log.adminName || log.adminUser?.name || 'Super Admin'}
                          </span>
                        </div>
                        {log.adminEmail && (
                          <div style={{ fontSize: '0.7rem', color: 'var(--admin-text-muted)' }}>
                            {log.adminEmail}
                          </div>
                        )}
                      </td>
                      <td>
                        <span
                          className="badge"
                          style={{
                            background: log.action.includes('LOGIN')
                              ? '#0284c7'
                              : log.action.includes('ORDER')
                              ? '#15803d'
                              : log.action.includes('DELETE')
                              ? '#dc2626'
                              : log.action.includes('PRICE') || log.action.includes('STOCK')
                              ? '#d97706'
                              : '#166534',
                            color: '#ffffff',
                            fontWeight: 700,
                            fontSize: '0.725rem'
                          }}
                        >
                          {log.action}
                        </span>
                      </td>
                      <td>
                        <span style={{ fontSize: '0.8rem', color: 'var(--admin-text-muted)' }}>
                          <strong>{log.resource || log.resourceType || 'General'}:</strong>{' '}
                          <code>{log.resourceId ? String(log.resourceId).slice(0, 24) : 'Global'}</code>
                        </span>
                      </td>
                      <td>
                        <code style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)', backgroundColor: 'var(--admin-input-bg)', padding: '0.2rem 0.4rem', borderRadius: '4px' }}>
                          {log.ip || log.ipAddress || '127.0.0.1'}
                        </code>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <button
                          type="button"
                          onClick={() => setSelectedLog(log)}
                          className="btn btn-secondary btn-sm"
                          style={{
                            background: 'var(--admin-bg-card)',
                            borderColor: 'var(--admin-border)',
                            color: 'var(--admin-text-main)',
                            padding: '0.35rem 0.75rem'
                          }}
                        >
                          <Eye size={13} />
                          <span>Inspect</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Log Details JSON Modal */}
      {selectedLog && (
        <div className="modal-overlay" onClick={() => setSelectedLog(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '650px', background: 'var(--admin-bg-card)', border: '1px solid var(--admin-border, #334155)' }}>
            <h3 style={{ fontSize: '1.25rem', color: 'var(--admin-text-main)', marginBottom: '0.5rem', fontWeight: 800 }}>
              Audit Log Event: {selectedLog.action}
            </h3>
            <div style={{ fontSize: '0.8rem', color: 'var(--admin-text-muted)', marginBottom: '1rem' }}>
              Operator: <strong style={{ color: 'var(--admin-text-main)' }}>{selectedLog.adminName || selectedLog.adminUser?.name || 'Super Admin'}</strong> • Time:{' '}
              <strong style={{ color: 'var(--admin-accent, #34d399)' }}>
                {new Date(selectedLog.timestamp || selectedLog.createdAt).toLocaleString('en-IN')}
              </strong>
            </div>

            <div className="input-group">
              <label className="input-label" style={{ color: 'var(--admin-text-muted)' }}>Payload / Mutation Diff (JSON)</label>
              <pre
                style={{
                  backgroundColor: 'var(--admin-input-bg)',
                  border: '1px solid var(--admin-border, #1e2e4f)',
                  borderRadius: '8px',
                  padding: '1rem',
                  color: 'var(--admin-accent, #34d399)',
                  fontSize: '0.8rem',
                  maxHeight: '350px',
                  overflowY: 'auto'
                }}
              >
                {JSON.stringify(selectedLog.details || {}, null, 2)}
              </pre>
            </div>

            <div className="flex justify-end" style={{ marginTop: '1.25rem' }}>
              <button
                type="button"
                onClick={() => setSelectedLog(null)}
                className="btn btn-secondary btn-sm"
                style={{ background: 'var(--admin-bg-card-alt)', borderColor: 'var(--admin-border)', color: 'var(--admin-text-main)' }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAuditLogsPage;
