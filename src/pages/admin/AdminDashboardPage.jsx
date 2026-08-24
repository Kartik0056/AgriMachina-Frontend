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

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await adminApi.get('/dashboard/stats');
      if (res.data.success) {
        setData(res.data);
      }
    } catch (err) {
      console.error('Failed to load dashboard metrics', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading || !data) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem', color: '#94a3b8' }}>
        <RefreshCw className="animate-spin" size={32} color="#34d399" style={{ margin: '0 auto 1rem auto' }} />
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
      legend: { labels: { color: '#94a3b8', font: { size: 12 } } }
    },
    scales: {
      x: { ticks: { color: '#64748b' }, grid: { color: 'rgba(255,255,255,0.05)' } },
      y: { ticks: { color: '#64748b' }, grid: { color: 'rgba(255,255,255,0.05)' } }
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Top Banner */}
      <div className="flex justify-between items-center" style={{ flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', color: '#ffffff', fontWeight: 800 }}>
            Agricultural Machinery Operations
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
            Live MongoDB commerce telemetry, equipment inventory & verified farmer reviews
          </p>
        </div>

        <button onClick={fetchStats} className="btn btn-secondary btn-sm" style={{ background: '#1e293b', color: '#ffffff', borderColor: '#334155' }}>
          <RefreshCw size={14} />
          <span>Refresh Real-time Stats</span>
        </button>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <div className="admin-card">
          <div className="flex justify-between items-center" style={{ color: '#94a3b8', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase' }}>
            <span>Total Revenue</span>
            <DollarSign size={18} color="#10b981" />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#ffffff', margin: '0.35rem 0' }}>
            {formatINR(stats.totalRevenue)}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#34d399', display: 'flex', itemsCenter: 'center', gap: '0.25rem' }}>
            <span>✓ Verified MongoDB Sum</span>
          </div>
        </div>

        {/* Total Orders */}
        <div className="admin-card">
          <div className="flex justify-between items-center" style={{ color: '#94a3b8', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase' }}>
            <span>Total Orders</span>
            <ShoppingBag size={18} color="#38bdf8" />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#ffffff', margin: '0.35rem 0' }}>
            {stats.totalOrders}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
            Today's Orders: <strong style={{ color: '#38bdf8' }}>{stats.todayOrders}</strong>
          </div>
        </div>

        {/* Total Products */}
        <div className="admin-card">
          <div className="flex justify-between items-center" style={{ color: '#94a3b8', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase' }}>
            <span>Catalog Machines</span>
            <Tractor size={18} color="#f59e0b" />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#ffffff', margin: '0.35rem 0' }}>
            {stats.totalProducts}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
            Active Machinery Listings
          </div>
        </div>

        {/* Pending Moderation */}
        <div className="admin-card">
          <div className="flex justify-between items-center" style={{ color: '#94a3b8', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase' }}>
            <span>Pending Moderation</span>
            <Star size={18} color="#ec4899" />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#ffffff', margin: '0.35rem 0' }}>
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
              <h3 style={{ fontSize: '1.1rem', color: '#ffffff' }}>7-Day Machinery Revenue Velocity</h3>
              <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Daily revenue calculated from confirmed agricultural orders</p>
            </div>
          </div>
          <div style={{ height: '260px' }}>
            <Line data={revenueChartData} options={chartOptions} />
          </div>
        </div>

        {/* Category Breakdown Doughnut Chart */}
        <div className="admin-card">
          <div style={{ marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.1rem', color: '#ffffff' }}>Sales by Category</h3>
            <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Volume distribution across farm machine types</p>
          </div>
          <div style={{ height: '240px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Doughnut data={categoryChartData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { color: '#94a3b8', boxWidth: 12 } } } }} />
          </div>
        </div>
      </div>

      {/* Tables Row: Top Selling Machinery & Stock Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Machinery */}
        <div className="admin-card">
          <div className="flex justify-between items-center" style={{ marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.1rem', color: '#ffffff' }}>Top Performing Machinery</h3>
            <Link to={`${adminPanelPath}/products`} style={{ fontSize: '0.75rem', color: '#34d399' }}>View All Products →</Link>
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
                      <div className="flex items-center gap-2">
                        <img src={p.mainImage?.url || 'https://images.unsplash.com/photo-1592878904946-b3cd8ae243d0?w=100&q=80'} alt="" style={{ width: '32px', height: '32px', borderRadius: '4px', objectFit: 'cover' }} />
                        <span style={{ fontWeight: 600, color: '#ffffff' }}>{p.name}</span>
                      </div>
                    </td>
                    <td><code>{p.sku}</code></td>
                    <td>{formatINR(p.sellingPrice)}</td>
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
            <h3 style={{ fontSize: '1.1rem', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <AlertTriangle size={18} color="#f59e0b" />
              <span>Low & Out of Stock Alerts</span>
            </h3>
            <Link to={`${adminPanelPath}/inventory`} style={{ fontSize: '0.75rem', color: '#f59e0b' }}>Manage Inventory →</Link>
          </div>

          {criticalStockProducts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8', fontSize: '0.85rem' }}>
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
                      <td style={{ color: '#ffffff', fontWeight: 600 }}>{p.name}</td>
                      <td><code>{p.sku}</code></td>
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
