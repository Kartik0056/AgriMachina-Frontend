import React, { useState, useEffect } from 'react';
import { ShieldAlert, RefreshCw, Eye, Filter, User, Clock } from 'lucide-react';
import adminApi from '../../services/adminApi';
import { useToast } from '../../context/ToastContext';

const AdminAuditLogsPage = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionFilter, setActionFilter] = useState('');
  const [selectedLog, setSelectedLog] = useState(null);
  const { addToast } = useToast();

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await adminApi.get('/audit-logs', {
        params: { action: actionFilter, limit: 50 }
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

  return (
    <div className="flex flex-col gap-6">
      {/* Top Banner */}
      <div className="flex justify-between items-center" style={{ flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', color: '#ffffff', fontWeight: 800 }}>
            Administrative Audit Trail & Activity Logs
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
            Immutable security log of all admin operations, catalog mutations, pricing changes, and logins
          </p>
        </div>

        <button onClick={fetchLogs} className="btn btn-secondary btn-sm" style={{ background: '#1e293b', borderColor: '#334155', color: '#ffffff' }}>
          <RefreshCw size={14} />
          <span>Refresh Logs</span>
        </button>
      </div>

      {/* Filter Strip */}
      <div className="admin-card" style={{ padding: '0.75rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 600 }}>Filter by Action:</span>
        {['', 'PRODUCT_CREATE', 'PRODUCT_UPDATE', 'PRODUCT_DELETE', 'PRODUCT_BULK_IMPORT', 'REVIEW_MODERATED', 'ADMIN_LOGIN', 'ORDER_STATUS_UPDATE'].map((act) => (
          <button
            key={act}
            type="button"
            onClick={() => setActionFilter(act)}
            className={`btn btn-sm ${actionFilter === act ? 'btn-primary' : 'btn-secondary'}`}
            style={{
              background: actionFilter === act ? '#166534' : '#0b1324',
              borderColor: actionFilter === act ? '#22c55e' : '#1e2e4f',
              color: '#ffffff',
              fontSize: '0.75rem'
            }}
          >
            {act === '' ? 'All Actions' : act.replace(/_/g, ' ')}
          </button>
        ))}
      </div>

      {/* Logs Table */}
      <div className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="admin-table-container" style={{ border: 'none' }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Admin User</th>
                <th>Action</th>
                <th>Resource / Target</th>
                <th>IP Address</th>
                <th style={{ textAlign: 'right' }}>Details</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
                    Loading audit trail from MongoDB...
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
                    No audit records match the selected action filter.
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log._id}>
                    <td style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                    <td>
                      <div className="flex items-center gap-1.5">
                        <User size={14} color="#34d399" />
                        <span style={{ fontWeight: 600, color: '#ffffff' }}>
                          {log.adminUser?.name || log.adminUser?.username || 'Super Admin'}
                        </span>
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-primary">{log.action}</span>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>
                        {log.resourceType}: <code>{log.resourceId || 'System'}</code>
                      </span>
                    </td>
                    <td>
                      <code style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{log.ipAddress || '127.0.0.1'}</code>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        type="button"
                        onClick={() => setSelectedLog(log)}
                        className="btn btn-secondary btn-sm"
                        style={{ background: '#1e293b', borderColor: '#334155', color: '#ffffff' }}
                      >
                        <Eye size={13} />
                        <span>Inspect</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Log Details JSON Modal */}
      {selectedLog && (
        <div className="modal-overlay" onClick={() => setSelectedLog(null)}>
          <div className="modal-content dark-theme" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '650px' }}>
            <h3 style={{ fontSize: '1.25rem', color: '#ffffff', marginBottom: '0.5rem' }}>
              Audit Log Event: {selectedLog.action}
            </h3>
            <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '1rem' }}>
              Admin: <strong>{selectedLog.adminUser?.name}</strong> • Time: <strong>{new Date(selectedLog.createdAt).toLocaleString()}</strong>
            </div>

            <div className="input-group">
              <label className="input-label" style={{ color: '#cbd5e1' }}>Payload / Mutation Diff (JSON)</label>
              <pre style={{
                background: '#070d1a',
                border: '1px solid #1e2e4f',
                borderRadius: '8px',
                padding: '1rem',
                color: '#34d399',
                fontSize: '0.8rem',
                maxHeight: '350px',
                overflowY: 'auto'
              }}>
                {JSON.stringify(selectedLog.details || {}, null, 2)}
              </pre>
            </div>

            <div className="flex justify-end" style={{ marginTop: '1.25rem' }}>
              <button
                type="button"
                onClick={() => setSelectedLog(null)}
                className="btn btn-secondary btn-sm"
                style={{ background: '#1e293b', borderColor: '#334155', color: '#ffffff' }}
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
