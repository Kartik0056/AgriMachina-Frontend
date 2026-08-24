import React, { useState } from 'react';
import {
  CreditCard,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Search,
  Filter,
  Eye,
  Send,
  Download,
  Building,
  TrendingUp,
  DollarSign,
  User,
  Phone,
  Calendar,
  Layers,
  ArrowRight
} from 'lucide-react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement } from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import { formatINR } from '../../services/emiHelper';
import { useToast } from '../../context/ToastContext';
import Modal from '../../components/common/Modal';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement);

// Realistic customer EMI mock data
const mockCustomerEMIs = [
  {
    id: 'EMI-2026-0891',
    farmerName: 'Ramesh Patel',
    phone: '+91 98765 43210',
    village: 'Gondal, Rajkot (Gujarat)',
    machineName: 'Power Weeder 7HP Petrol 4-Stroke (AV-708)',
    machineImage: '/images/machinery/power_weeder.jpg',
    loanProvider: 'Razorpay • SBI Kisan Card',
    loanAmount: 38499,
    monthlyEmi: 3448,
    totalTenureMonths: 12,
    paidInstallments: 8,
    paidAmount: 27584,
    remainingAmount: 13792,
    nextDueDate: '2026-09-05',
    status: 'ACTIVE', // ACTIVE, COMPLETED, DELAYED
    daysOverdue: 0,
    installments: [
      { num: 1, date: '2026-01-05', amount: 3448, status: 'PAID', ref: 'RZP-PAY-81921' },
      { num: 2, date: '2026-02-05', amount: 3448, status: 'PAID', ref: 'RZP-PAY-82711' },
      { num: 3, date: '2026-03-05', amount: 3448, status: 'PAID', ref: 'RZP-PAY-83490' },
      { num: 4, date: '2026-04-05', amount: 3448, status: 'PAID', ref: 'RZP-PAY-84102' },
      { num: 5, date: '2026-05-05', amount: 3448, status: 'PAID', ref: 'RZP-PAY-85921' },
      { num: 6, date: '2026-06-05', amount: 3448, status: 'PAID', ref: 'RZP-PAY-86734' },
      { num: 7, date: '2026-07-05', amount: 3448, status: 'PAID', ref: 'RZP-PAY-87890' },
      { num: 8, date: '2026-08-05', amount: 3448, status: 'PAID', ref: 'RZP-PAY-88912' },
      { num: 9, date: '2026-09-05', amount: 3448, status: 'UPCOMING', ref: '-' },
      { num: 10, date: '2026-10-05', amount: 3448, status: 'UPCOMING', ref: '-' },
      { num: 11, date: '2026-11-05', amount: 3448, status: 'UPCOMING', ref: '-' },
      { num: 12, date: '2026-12-05', amount: 3448, status: 'UPCOMING', ref: '-' }
    ]
  },
  {
    id: 'EMI-2026-0874',
    farmerName: 'Baldev Singh Gill',
    phone: '+91 98140 77123',
    village: 'Khanna, Ludhiana (Punjab)',
    machineName: '5HP Solar Submersible Pump Set (DC Brushless)',
    machineImage: '/images/machinery/solar_pump.jpg',
    loanProvider: 'Razorpay • HDFC Agri Finance',
    loanAmount: 74999,
    monthlyEmi: 4620,
    totalTenureMonths: 18,
    paidInstallments: 18,
    paidAmount: 83160,
    remainingAmount: 0,
    nextDueDate: 'Completed',
    status: 'COMPLETED',
    daysOverdue: 0,
    installments: Array.from({ length: 18 }, (_, i) => ({
      num: i + 1,
      date: `2025-${String((i % 12) + 1).padStart(2, '0')}-10`,
      amount: 4620,
      status: 'PAID',
      ref: `RZP-PAY-${90000 + i}`
    }))
  },
  {
    id: 'EMI-2026-0842',
    farmerName: 'Suresh Deshmukh',
    phone: '+91 94230 45890',
    village: 'Baramati, Pune (Maharashtra)',
    machineName: 'Heavy-Duty 6-Foot Rotavator (Multi-Speed)',
    machineImage: '/images/machinery/rotavator.jpg',
    loanProvider: 'Razorpay • ICICI Bank Agri',
    loanAmount: 94500,
    monthlyEmi: 4650,
    totalTenureMonths: 24,
    paidInstallments: 5,
    paidAmount: 23250,
    remainingAmount: 88350,
    nextDueDate: '2026-08-10',
    status: 'DELAYED',
    daysOverdue: 12,
    installments: [
      { num: 1, date: '2026-03-10', amount: 4650, status: 'PAID', ref: 'RZP-PAY-77123' },
      { num: 2, date: '2026-04-10', amount: 4650, status: 'PAID', ref: 'RZP-PAY-77890' },
      { num: 3, date: '2026-05-10', amount: 4650, status: 'PAID', ref: 'RZP-PAY-78901' },
      { num: 4, date: '2026-06-10', amount: 4650, status: 'PAID', ref: 'RZP-PAY-79912' },
      { num: 5, date: '2026-07-10', amount: 4650, status: 'PAID', ref: 'RZP-PAY-80123' },
      { num: 6, date: '2026-08-10', amount: 4650, status: 'DELAYED', ref: 'OVERDUE' },
      { num: 7, date: '2026-09-10', amount: 4650, status: 'UPCOMING', ref: '-' }
    ]
  },
  {
    id: 'EMI-2026-0819',
    farmerName: 'Venkat Rao',
    phone: '+91 99890 12345',
    village: 'Guntur (Andhra Pradesh)',
    machineName: '50cc Backpack Multi-Crop Brush Cutter',
    machineImage: '/images/machinery/brush_cutter.jpg',
    loanProvider: 'Razorpay • 0% No-Cost Bajaj Finserv',
    loanAmount: 23999,
    monthlyEmi: 4000,
    totalTenureMonths: 6,
    paidInstallments: 4,
    paidAmount: 16000,
    remainingAmount: 7999,
    nextDueDate: '2026-09-01',
    status: 'ACTIVE',
    daysOverdue: 0,
    installments: [
      { num: 1, date: '2026-05-01', amount: 4000, status: 'PAID', ref: 'RZP-PAY-61200' },
      { num: 2, date: '2026-06-01', amount: 4000, status: 'PAID', ref: 'RZP-PAY-62300' },
      { num: 3, date: '2026-07-01', amount: 4000, status: 'PAID', ref: 'RZP-PAY-63400' },
      { num: 4, date: '2026-08-01', amount: 4000, status: 'PAID', ref: 'RZP-PAY-64500' },
      { num: 5, date: '2026-09-01', amount: 4000, status: 'UPCOMING', ref: '-' },
      { num: 6, date: '2026-10-01', amount: 4000, status: 'UPCOMING', ref: '-' }
    ]
  },
  {
    id: 'EMI-2026-0790',
    farmerName: 'Devendra Choudhary',
    phone: '+91 97840 99881',
    village: 'Nagaur (Rajasthan)',
    machineName: '2-in-1 Battery cum Manual Knapsack Sprayer 16L',
    machineImage: '/images/machinery/sprayer.jpg',
    loanProvider: 'Razorpay • Axis Bank Card',
    loanAmount: 3499,
    monthlyEmi: 1190,
    totalTenureMonths: 3,
    paidInstallments: 3,
    paidAmount: 3570,
    remainingAmount: 0,
    nextDueDate: 'Completed',
    status: 'COMPLETED',
    daysOverdue: 0,
    installments: [
      { num: 1, date: '2026-05-15', amount: 1190, status: 'PAID', ref: 'RZP-PAY-51120' },
      { num: 2, date: '2026-06-15', amount: 1190, status: 'PAID', ref: 'RZP-PAY-52210' },
      { num: 3, date: '2026-07-15', amount: 1190, status: 'PAID', ref: 'RZP-PAY-53300' }
    ]
  }
];

const AdminEMIPage = () => {
  const { addToast } = useToast();
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);

  // Filter list
  const filteredList = mockCustomerEMIs.filter((item) => {
    const matchesFilter = filterStatus === 'ALL' || item.status === filterStatus;
    const matchesSearch =
      item.farmerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.phone.includes(searchQuery) ||
      item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.machineName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Calculate Metrics
  const totalLoanVolume = mockCustomerEMIs.reduce((acc, c) => acc + c.loanAmount, 0);
  const totalRecovered = mockCustomerEMIs.reduce((acc, c) => acc + c.paidAmount, 0);
  const activeCount = mockCustomerEMIs.filter(c => c.status === 'ACTIVE').length;
  const completedCount = mockCustomerEMIs.filter(c => c.status === 'COMPLETED').length;
  const delayedCount = mockCustomerEMIs.filter(c => c.status === 'DELAYED').length;
  const monthlyExpected = mockCustomerEMIs.filter(c => c.status === 'ACTIVE' || c.status === 'DELAYED').reduce((acc, c) => acc + c.monthlyEmi, 0);

  // Chart Data 1: Monthly Collection & Recovery
  const barChartData = {
    labels: ['Mar 2026', 'Apr 2026', 'May 2026', 'Jun 2026', 'Jul 2026', 'Aug 2026'],
    datasets: [
      {
        label: 'EMI Collected (₹)',
        data: [184000, 212000, 245000, 280000, 310000, 264320],
        backgroundColor: '#10b981',
        borderRadius: 6
      },
      {
        label: 'Delayed / Pending (₹)',
        data: [12000, 15000, 8000, 14000, 9000, 18600],
        backgroundColor: '#ef4444',
        borderRadius: 6
      }
    ]
  };

  // Chart Data 2: Status Breakdown
  const doughnutStatusData = {
    labels: ['Completed (Fully Paid)', 'Active (On-Time)', 'Delayed / Overdue'],
    datasets: [
      {
        data: [completedCount, activeCount, delayedCount],
        backgroundColor: ['#10b981', '#3b82f6', '#ef4444'],
        borderWidth: 0
      }
    ]
  };

  // Chart Data 3: Financing Provider Distribution
  const doughnutBankData = {
    labels: ['Razorpay • SBI Kisan', 'Razorpay • HDFC Agri', 'Razorpay • ICICI Bank', '0% No-Cost Bajaj Finserv', 'Others'],
    datasets: [
      {
        data: [42, 28, 16, 10, 4],
        backgroundColor: ['#10b981', '#6366f1', '#f59e0b', '#ec4899', '#94a3b8'],
        borderWidth: 0
      }
    ]
  };

  const handleOpenSchedule = (loan) => {
    setSelectedLoan(loan);
    setIsScheduleModalOpen(true);
  };

  const handleSendReminder = (loan) => {
    addToast(`Payment reminder SMS & WhatsApp dispatched to ${loan.farmerName} (${loan.phone}) with Razorpay direct payment link!`, 'success');
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex justify-between items-center" style={{ flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', color: '#ffffff', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CreditCard size={24} color="#34d399" />
            <span>Customer EMI Financing & Installments Recovery Ledger</span>
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
            Live payment gateway financing tracking, monthly EMI collection progress, and customer installment ledger.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => addToast('Exporting Customer EMI Statement (CSV)...', 'info')}
            className="btn btn-secondary btn-sm"
            style={{ background: '#1e293b', borderColor: '#334155', color: '#ffffff' }}
          >
            <Download size={15} />
            <span>Export EMI Ledger</span>
          </button>
        </div>
      </div>

      {/* 5 KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="admin-card flex flex-col gap-1">
          <span style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>Total Financed Volume</span>
          <span style={{ fontSize: '1.5rem', fontWeight: 900, color: '#ffffff' }}>{formatINR(totalLoanVolume)}</span>
          <span style={{ fontSize: '0.7rem', color: '#86efac' }}>Across all financed machines</span>
        </div>

        <div className="admin-card flex flex-col gap-1">
          <span style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>Monthly Run-Rate</span>
          <span style={{ fontSize: '1.5rem', fontWeight: 900, color: '#fef08a' }}>{formatINR(monthlyExpected)}/mo</span>
          <span style={{ fontSize: '0.7rem', color: '#cbd5e1' }}>Expected monthly inflow</span>
        </div>

        <div className="admin-card flex flex-col gap-1">
          <span style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>Completed Loans</span>
          <span style={{ fontSize: '1.5rem', fontWeight: 900, color: '#34d399' }}>{completedCount} Farmers</span>
          <span style={{ fontSize: '0.7rem', color: '#86efac' }}>100% Fully Paid Off</span>
        </div>

        <div className="admin-card flex flex-col gap-1">
          <span style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>Active (On-Track)</span>
          <span style={{ fontSize: '1.5rem', fontWeight: 900, color: '#60a5fa' }}>{activeCount} Farmers</span>
          <span style={{ fontSize: '0.7rem', color: '#bfdbfe' }}>Paying monthly installments</span>
        </div>

        <div className="admin-card flex flex-col gap-1">
          <span style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>Delayed / Overdue</span>
          <span style={{ fontSize: '1.5rem', fontWeight: 900, color: '#ef4444' }}>{delayedCount} Accounts</span>
          <span style={{ fontSize: '0.7rem', color: '#fca5a5' }}>Reminder dispatch required</span>
        </div>
      </div>

      {/* Visual Analytics Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart 1: Monthly Collection Trend */}
        <div className="admin-card lg:col-span-2">
          <div className="flex justify-between items-center" style={{ marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1rem', color: '#ffffff', fontWeight: 700 }}>
              📈 Monthly EMI Collection & Recovery Health
            </h3>
            <span className="badge badge-success" style={{ fontSize: '0.7rem' }}>96.2% On-Time Recovery</span>
          </div>
          <div style={{ height: '230px' }}>
            <Bar
              data={barChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { labels: { color: '#94a3b8', font: { size: 11 } } }
                },
                scales: {
                  x: { ticks: { color: '#94a3b8' }, grid: { display: false } },
                  y: { ticks: { color: '#94a3b8' }, grid: { color: '#1e2e4f' } }
                }
              }}
            />
          </div>
        </div>

        {/* Chart 2: EMI Status Health */}
        <div className="admin-card">
          <h3 style={{ fontSize: '1rem', color: '#ffffff', fontWeight: 700, marginBottom: '1rem' }}>
            🎯 EMI Portfolio Distribution
          </h3>
          <div style={{ height: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Doughnut
              data={doughnutStatusData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { position: 'bottom', labels: { color: '#94a3b8', font: { size: 10 } } }
                }
              }}
            />
          </div>
        </div>
      </div>

      {/* Customer EMI Installment Tracking Ledger */}
      <div className="admin-card flex flex-col gap-4">
        {/* Table Filters & Search */}
        <div className="flex justify-between items-center" style={{ flexWrap: 'wrap', gap: '1rem' }}>
          {/* Status Filter Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilterStatus('ALL')}
              className={`btn btn-sm ${filterStatus === 'ALL' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ padding: '0.4rem 0.85rem' }}
            >
              All Loans ({mockCustomerEMIs.length})
            </button>
            <button
              onClick={() => setFilterStatus('ACTIVE')}
              className={`btn btn-sm ${filterStatus === 'ACTIVE' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ padding: '0.4rem 0.85rem' }}
            >
              Active ({activeCount})
            </button>
            <button
              onClick={() => setFilterStatus('DELAYED')}
              className={`btn btn-sm ${filterStatus === 'DELAYED' ? 'btn-danger' : 'btn-secondary'}`}
              style={{ padding: '0.4rem 0.85rem' }}
            >
              Delayed ({delayedCount})
            </button>
            <button
              onClick={() => setFilterStatus('COMPLETED')}
              className={`btn btn-sm ${filterStatus === 'COMPLETED' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ padding: '0.4rem 0.85rem' }}
            >
              Completed ({completedCount})
            </button>
          </div>

          {/* Search Box */}
          <div style={{ position: 'relative', width: '280px' }}>
            <input
              type="text"
              className="input-field"
              style={{ background: '#070d1a', borderColor: '#1e2e4f', color: '#ffffff', paddingLeft: '2.2rem', fontSize: '0.825rem' }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search farmer name, phone, machine..."
            />
            <Search size={15} color="#94a3b8" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }} />
          </div>
        </div>

        {/* EMI Customer Table */}
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Farmer & Loan ID</th>
                <th>Machinery Financed</th>
                <th>Monthly EMI</th>
                <th>Tenure Progress</th>
                <th>Paid / Balance</th>
                <th>Next Due Date</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredList.map((loan) => {
                const percent = Math.round((loan.paidInstallments / loan.totalTenureMonths) * 100);
                return (
                  <tr key={loan.id}>
                    {/* Farmer Profile */}
                    <td>
                      <div style={{ fontWeight: 800, color: '#ffffff', fontSize: '0.9rem' }}>{loan.farmerName}</div>
                      <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{loan.phone}</div>
                      <div style={{ fontSize: '0.7rem', color: '#34d399', fontFamily: 'monospace' }}>{loan.id}</div>
                    </td>

                    {/* Machinery */}
                    <td style={{ maxWidth: '220px' }}>
                      <div className="flex items-center gap-2">
                        <img
                          src={loan.machineImage}
                          alt=""
                          style={{ width: '38px', height: '38px', objectFit: 'contain', background: '#ffffff', borderRadius: '6px', padding: '2px', flexShrink: 0 }}
                        />
                        <div>
                          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#cbd5e1', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '180px' }}>
                            {loan.machineName}
                          </div>
                          <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>{loan.loanProvider}</div>
                        </div>
                      </div>
                    </td>

                    {/* Monthly EMI */}
                    <td>
                      <div style={{ fontWeight: 900, color: '#fef08a', fontSize: '0.95rem' }}>
                        {formatINR(loan.monthlyEmi)}
                      </div>
                      <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>per month</div>
                    </td>

                    {/* Tenure Progress Bar */}
                    <td style={{ minWidth: '150px' }}>
                      <div className="flex justify-between items-center" style={{ fontSize: '0.75rem', marginBottom: '4px' }}>
                        <span style={{ color: '#ffffff', fontWeight: 700 }}>
                          {loan.paidInstallments} of {loan.totalTenureMonths} Mo
                        </span>
                        <span style={{ color: percent === 100 ? '#34d399' : '#fef08a', fontWeight: 800 }}>
                          {percent}%
                        </span>
                      </div>
                      <div style={{ height: '6px', background: '#1e2e4f', borderRadius: '999px', overflow: 'hidden' }}>
                        <div
                          style={{
                            height: '100%',
                            width: `${percent}%`,
                            background: percent === 100 ? '#10b981' : loan.status === 'DELAYED' ? '#ef4444' : '#3b82f6',
                            borderRadius: '999px'
                          }}
                        />
                      </div>
                    </td>

                    {/* Paid / Balance */}
                    <td>
                      <div style={{ fontSize: '0.8rem', color: '#34d399', fontWeight: 700 }}>
                        Paid: {formatINR(loan.paidAmount)}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: loan.remainingAmount > 0 ? '#fca5a5' : '#94a3b8' }}>
                        Bal: {formatINR(loan.remainingAmount)}
                      </div>
                    </td>

                    {/* Next Due Date */}
                    <td>
                      <div style={{ fontSize: '0.8rem', fontWeight: 700, color: loan.status === 'DELAYED' ? '#ef4444' : '#cbd5e1' }}>
                        {loan.nextDueDate}
                      </div>
                      {loan.status === 'DELAYED' && (
                        <div style={{ fontSize: '0.7rem', color: '#ef4444', fontWeight: 800 }}>
                          ⚠️ {loan.daysOverdue} Days Overdue
                        </div>
                      )}
                    </td>

                    {/* Status Badge */}
                    <td>
                      {loan.status === 'COMPLETED' ? (
                        <span className="badge badge-success" style={{ fontSize: '0.7rem' }}>✓ COMPLETED</span>
                      ) : loan.status === 'DELAYED' ? (
                        <span className="badge badge-danger" style={{ fontSize: '0.7rem' }}>⚠️ DELAYED</span>
                      ) : (
                        <span className="badge" style={{ background: '#1e3a8a', color: '#93c5fd', fontSize: '0.7rem' }}>● ACTIVE</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td style={{ textAlign: 'right' }}>
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleOpenSchedule(loan)}
                          className="btn btn-secondary btn-sm"
                          style={{ padding: '0.3rem 0.6rem', background: '#1e293b', borderColor: '#334155', color: '#ffffff' }}
                          title="View 12-Month Schedule"
                        >
                          <Eye size={13} />
                          <span>Schedule</span>
                        </button>

                        {loan.status === 'DELAYED' && (
                          <button
                            type="button"
                            onClick={() => handleSendReminder(loan)}
                            className="btn btn-danger btn-sm"
                            style={{ padding: '0.3rem 0.6rem' }}
                            title="Send Payment Reminder SMS/WhatsApp"
                          >
                            <Send size={13} />
                            <span>Remind</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Month-by-Month EMI Installment Schedule */}
      {selectedLoan && (
        <Modal
          isOpen={isScheduleModalOpen}
          onClose={() => setIsScheduleModalOpen(false)}
          title={`Farmer EMI Schedule • ${selectedLoan.farmerName}`}
        >
          <div className="flex flex-col gap-4">
            {/* Header overview */}
            <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
              <div className="grid grid-cols-2 gap-2 text-sm" style={{ color: '#1e293b' }}>
                <div><strong>Loan Account:</strong> {selectedLoan.id}</div>
                <div><strong>Gateway:</strong> {selectedLoan.loanProvider}</div>
                <div><strong>Machine:</strong> {selectedLoan.machineName}</div>
                <div><strong>Monthly EMI:</strong> {formatINR(selectedLoan.monthlyEmi)}</div>
                <div><strong>Paid So Far:</strong> <span style={{ color: '#166534', fontWeight: 800 }}>{formatINR(selectedLoan.paidAmount)}</span></div>
                <div><strong>Remaining Loan:</strong> <span style={{ color: '#b91c1c', fontWeight: 800 }}>{formatINR(selectedLoan.remainingAmount)}</span></div>
              </div>
            </div>

            {/* Installments Table */}
            <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
                <thead>
                  <tr style={{ background: '#f1f5f9', borderBottom: '2px solid #cbd5e1', textAlign: 'left' }}>
                    <th style={{ padding: '0.5rem' }}>Inst. #</th>
                    <th style={{ padding: '0.5rem' }}>Due Date</th>
                    <th style={{ padding: '0.5rem' }}>Amount</th>
                    <th style={{ padding: '0.5rem' }}>Status</th>
                    <th style={{ padding: '0.5rem' }}>Payment Ref</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedLoan.installments.map((inst) => (
                    <tr key={inst.num} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '0.5rem', fontWeight: 700 }}>Month {inst.num}</td>
                      <td style={{ padding: '0.5rem' }}>{inst.date}</td>
                      <td style={{ padding: '0.5rem', fontWeight: 700 }}>{formatINR(inst.amount)}</td>
                      <td style={{ padding: '0.5rem' }}>
                        {inst.status === 'PAID' ? (
                          <span className="badge badge-success" style={{ fontSize: '0.65rem' }}>✓ PAID</span>
                        ) : inst.status === 'DELAYED' ? (
                          <span className="badge badge-danger" style={{ fontSize: '0.65rem' }}>⚠️ OVERDUE</span>
                        ) : (
                          <span className="badge" style={{ background: '#e2e8f0', color: '#475569', fontSize: '0.65rem' }}>UPCOMING</span>
                        )}
                      </td>
                      <td style={{ padding: '0.5rem', fontFamily: 'monospace', color: '#64748b' }}>{inst.ref}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-between items-center" style={{ marginTop: '0.5rem' }}>
              <button
                type="button"
                onClick={() => handleSendReminder(selectedLoan)}
                className="btn btn-primary btn-sm"
              >
                <Send size={14} />
                <span>Send WhatsApp Payment Link</span>
              </button>

              <button
                type="button"
                onClick={() => setIsScheduleModalOpen(false)}
                className="btn btn-secondary btn-sm"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default AdminEMIPage;
