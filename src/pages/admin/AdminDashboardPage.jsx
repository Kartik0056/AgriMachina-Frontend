import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  TrendingUp,
  DollarSign,
  ShoppingBag,
  Package,
  Users,
  AlertTriangle,
  Star,
  RefreshCw,
  ArrowUpRight,
  ShieldCheck,
  Tractor
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import adminApi from '../../services/adminApi';
import { formatINR } from '../../services/emiHelper';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { useSync } from '../../context/SyncContext';

// Register ChartJS modules
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const AdminDashboardPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { adminPanelPath } = useAdminAuth();
  const { subscribeToSync } = useSync();

  const fetchStats = async (isBackground = false) => {
    if (!isBackground) setLoading(true);
    try {
      const res = await adminApi.get('/dashboard/stats');
      if (res.data.success) {
        setData(res.data);
      }
    } catch (err) {
      console.error('Failed to load dashboard metrics', err);
    } finally {
      if (!isBackground) setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  // Real-time live synchronization for Admin Dashboard metrics
  useEffect(() => {
    if (!subscribeToSync) return;

    const unsubscribe = subscribeToSync((event) => {
      if (!event || !event.type) return;

      if (event.type === 'ORDER_CREATED' || event.type === 'ORDER_UPDATED' || event.type === 'ORDER_STATUS_CHANGED' || event.type === 'CATALOG_CHANGED') {
        fetchStats(true);
      }
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [subscribeToSync]);

  if (loading || !data) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--admin-text-muted)' }}>
        <RefreshCw className="animate-spin" size={32} color="var(--admin-accent, #34d399)" style={{ margin: '0 auto 1rem auto' }} />
        <div>Querying live MongoDB aggregations...</div>
      </div>
    );
  }

  const { stats, charts, topProducts, criticalStockProducts } = data;

  // Chart 1: Revenue Line Data
  const revenueChartData = {
    labels: charts.timeline.labels || [],
    datasets: [
      {
        label: 'Revenue (₹)',
        data: charts.timeline.revenue || [],
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.15)',
        fill: true,
        tension: 0.35,
        borderWidth: 2
      }
    ]
  };

  // Chart 2: Category Distribution Doughnut
  const categoryChartData = {
    labels: charts.categoryDistribution.labels || [],
    datasets: [
      {
        data: charts.categoryDistribution.revenue || [100],
        backgroundColor: [
          '#10b981',
          '#f59e0b',
          '#38bdf8',
          '#a855f7',
          '#ec4899',
          '#64748b'
        ],
        borderWidth: 0
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { labels: { color: 'var(--admin-text-muted)', font: { size: 12 } } }
    },
    scales: {
      x: { ticks: { color: 'var(--admin-text-subtle, #64748b)' }, grid: { color: 'rgba(128,128,128,0.1)' } },
      y: { ticks: { color: 'var(--admin-text-subtle, #64748b)' }, grid: { color: 'rgba(128,128,128,0.1)' } }
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Top Banner */}
      <div className="flex justify-between items-center" style={{ flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', color: 'var(--admin-text-main)', fontWeight: 800 }}>
            Agricultural Machinery Operations
          </h1>
          <p style={{ color: 'var(--admin-text-muted)', fontSize: '0.85rem' }}>
            Live MongoDB commerce telemetry, equipment inventory & verified farmer reviews
          </p>
        </div>

        <button
          onClick={fetchStats}
          className="btn btn-secondary btn-sm"
          style={{
            background: 'var(--admin-bg-card)',
            color: 'var(--admin-text-main)',
            borderColor: 'var(--admin-border)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem'
          }}
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          <span>Refresh Real-time Stats</span>
        </button>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <div className="admin-card">
          <div className="flex justify-between items-center" style={{ color: 'var(--admin-text-muted)', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase' }}>
            <span>Total Revenue</span>
            <DollarSign size={18} color="#10b981" />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--admin-text-main)', margin: '0.35rem 0' }}>
            {formatINR(stats.totalRevenue)}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--admin-accent, #34d399)', display: 'flex', itemsCenter: 'center', gap: '0.25rem' }}>
            <span>✓ Verified MongoDB Sum</span>
          </div>
        </div>

        {/* Total Orders */}
        <div className="admin-card">
          <div className="flex justify-between items-center" style={{ color: 'var(--admin-text-muted)', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase' }}>
            <span>Total Orders</span>
            <ShoppingBag size={18} color="#38bdf8" />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--admin-text-main)', margin: '0.35rem 0' }}>
            {stats.totalOrders}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)' }}>
            Today's Orders: <strong style={{ color: '#38bdf8' }}>{stats.todayOrders}</strong>
          </div>
        </div>

        {/* Total Products */}
        <div className="admin-card">
          <div className="flex justify-between items-center" style={{ color: 'var(--admin-text-muted)', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase' }}>
            <span>Catalog Machines</span>
            <Tractor size={18} color="#f59e0b" />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--admin-text-main)', margin: '0.35rem 0' }}>
            {stats.totalProducts}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)' }}>
            Active Machinery Listings
          </div>
        </div>

        {/* Pending Moderation */}
        <div className="admin-card">
          <div className="flex justify-between items-center" style={{ color: 'var(--admin-text-muted)', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase' }}>
            <span>Pending Moderation</span>
            <Star size={18} color="#ec4899" />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--admin-text-main)', margin: '0.35rem 0' }}>
            {stats.pendingReviews}
          </div>
          <Link to={`${adminPanelPath}/reviews`} style={{ fontSize: '0.75rem', color: '#ec4899', fontWeight: 600 }}>
            Inspect & Approve Reviews →
          </Link>
        </div>
      </div>

      {/* Interactive Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Trend Line Chart */}
        <div className="admin-card lg:col-span-2">
          <div className="flex justify-between items-center" style={{ marginBottom: '1.25rem' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', color: 'var(--admin-text-main)', fontWeight: 700 }}>7-Day Machinery Revenue Velocity</h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)' }}>Daily revenue calculated from confirmed agricultural orders</p>
            </div>
          </div>
          <div style={{ height: '260px' }}>
            <Line data={revenueChartData} options={chartOptions} />
          </div>
        </div>

        {/* Category Breakdown Doughnut Chart */}
        <div className="admin-card">
          <div style={{ marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.1rem', color: 'var(--admin-text-main)', fontWeight: 700 }}>Sales by Category</h3>
            <p style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)' }}>Volume distribution across farm machine types</p>
          </div>
          <div style={{ height: '240px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Doughnut data={categoryChartData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { color: 'var(--admin-text-muted)', boxWidth: 12 } } } }} />
          </div>
        </div>
      </div>

      {/* Tables Row: Top Selling Machinery & Stock Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Machinery */}
        <div className="admin-card">
          <div className="flex justify-between items-center" style={{ marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.1rem', color: 'var(--admin-text-main)', fontWeight: 700 }}>Top Performing Machinery</h3>
            <Link to={`${adminPanelPath}/products`} style={{ fontSize: '0.75rem', color: 'var(--admin-accent, #34d399)', fontWeight: 600 }}>View All Products →</Link>
          </div>

          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>SKU</th>
                  <th>Price</th>
                  <th>Purchases</th>
                </tr>
              </thead>
              <tbody>
                {topProducts.map((p) => (
                  <tr key={p._id}>
                    <td>
                      <div className="flex items-center" style={{ gap: '0.65rem' }}>
                        <img src={p.mainImage?.url || 'https://images.unsplash.com/photo-1592878904946-b3cd8ae243d0?w=100&q=80'} alt="" style={{ width: '34px', height: '34px', borderRadius: '6px', objectFit: 'cover', border: '1px solid var(--admin-border)', flexShrink: 0 }} />
                        <span style={{ fontWeight: 600, color: 'var(--admin-text-main)' }}>{p.name}</span>
                      </div>
                    </td>
                    <td><code style={{ color: 'var(--admin-text-main)', whiteSpace: 'nowrap', fontSize: '0.75rem', backgroundColor: 'var(--admin-input-bg)', padding: '0.2rem 0.5rem', borderRadius: '4px', border: '1px solid var(--admin-border)', letterSpacing: '0.03em', fontFamily: "'SF Mono', Consolas, monospace" }}>{p.sku}</code></td>
                    <td style={{ color: 'var(--admin-text-main)' }}>{formatINR(p.sellingPrice)}</td>
                    <td><strong style={{ color: '#10b981' }}>{p.analytics?.purchasesCount || 0} units</strong></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Critical Stock Alerts */}
        <div className="admin-card">
          <div className="flex justify-between items-center" style={{ marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.1rem', color: 'var(--admin-text-main)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <AlertTriangle size={18} color="#f59e0b" />
              <span>Low & Out of Stock Alerts</span>
            </h3>
            <Link to={`${adminPanelPath}/inventory`} style={{ fontSize: '0.75rem', color: '#f59e0b', fontWeight: 600 }}>Manage Inventory →</Link>
          </div>

          {criticalStockProducts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--admin-text-muted)', fontSize: '0.85rem' }}>
              ✓ All machinery inventory levels are currently healthy!
            </div>
          ) : (
            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Machine</th>
                    <th>SKU</th>
                    <th>Current Stock</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {criticalStockProducts.map((p) => (
                    <tr key={p._id}>
                      <td style={{ color: 'var(--admin-text-main)', fontWeight: 600 }}>{p.name}</td>
                      <td><code style={{ color: 'var(--admin-text-main)', whiteSpace: 'nowrap', fontSize: '0.75rem', backgroundColor: 'var(--admin-input-bg)', padding: '0.2rem 0.5rem', borderRadius: '4px', border: '1px solid var(--admin-border)', letterSpacing: '0.03em', fontFamily: "'SF Mono', Consolas, monospace" }}>{p.sku}</code></td>
                      <td>
                        <span style={{ fontWeight: 800, color: p.stockQuantity <= 0 ? '#ef4444' : '#f59e0b' }}>
                          {p.stockQuantity} units
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${p.stockStatus === 'OUT OF STOCK' ? 'badge-danger' : 'badge-warning'}`}>
                          {p.stockStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
