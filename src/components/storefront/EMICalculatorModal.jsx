import React, { useState, useEffect } from 'react';
import {
  CreditCard,
  Calculator,
  Info,
  CheckCircle2,
  Shield,
  Sparkles,
  Flame,
  Building2,
  Wallet,
  Landmark,
  ChevronRight
} from 'lucide-react';
import Modal from '../common/Modal';
import { formatINR } from '../../services/emiHelper';
import api from '../../services/api';

const EMICalculatorModal = ({ isOpen, onClose, productPrice = 38499, emiConfig = {} }) => {
  const [downPayment, setDownPayment] = useState(emiConfig.minDownPayment || 0);
  const [activeTab, setActiveTab] = useState('noCost'); // 'noCost', 'credit', 'debit', 'nbfc', 'custom'
  const [emiData, setEmiData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Custom interactive slider values
  const [customInterest, setCustomInterest] = useState(13.5);
  const [customTenure, setCustomTenure] = useState(12);

  const fetchEMIPlans = async (dp) => {
    try {
      const res = await api.get(`/payment/razorpay/emi-plans?amount=${productPrice}&downPayment=${dp}`);
      if (res.data.success) {
        setEmiData(res.data.emiPlans);
      }
    } catch (err) {
      console.error('Failed to load Razorpay EMI plans', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchEMIPlans(downPayment);
    }
  }, [isOpen, productPrice, downPayment]);

  const handleDownPaymentChange = (val) => {
    const num = Number(val);
    setDownPayment(num);
  };

  const loanAmount = Math.max(0, productPrice - downPayment);

  // Custom calculation helper
  const r = (customInterest / 12) / 100;
  const factor = Math.pow(1 + r, customTenure);
  const customMonthly = loanAmount > 0 && customTenure > 0
    ? Math.round(loanAmount * r * (factor / (factor - 1)))
    : 0;
  const customTotal = customMonthly * customTenure;
  const customInterestTotal = customTotal - loanAmount;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Kisan Equipment EMI Plans & No-Cost Financing" maxWidth="880px">
      <div className="flex flex-col gap-6">
        {/* Top Summary Banner Powered by Razorpay */}
        <div style={{
          background: 'linear-gradient(135deg, #062416, #166534)',
          color: '#ffffff',
          borderRadius: '16px',
          padding: '1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.25rem',
          boxShadow: 'var(--shadow-md)'
        }}>
          <div>
            <div className="flex items-center gap-2" style={{ marginBottom: '0.35rem' }}>
              <span className="badge" style={{ background: '#f59e0b', color: '#ffffff', fontSize: '0.75rem', fontWeight: 800 }}>
                ⚡ Powered by Razorpay
              </span>
              <span style={{ fontSize: '0.8rem', color: '#86efac', fontWeight: 700 }}>
                Kisan Credit & Bank EMI Available
              </span>
            </div>
            <div style={{ fontSize: '2.25rem', fontWeight: 900, color: '#fef08a', lineHeight: 1.1 }}>
              {formatINR(loanAmount > 0 ? Math.round(loanAmount / 6) : 0)}
              <span style={{ fontSize: '0.95rem', color: '#ffffff', fontWeight: 500 }}> / month</span>
            </div>
            <div style={{ fontSize: '0.8rem', color: '#dcfce7', marginTop: '0.25rem' }}>
              For 6 Months with <strong>0% No-Cost EMI</strong> (Zero Interest)
            </div>
          </div>

          <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <div style={{ fontSize: '0.85rem', color: '#86efac' }}>Product Price: <strong>{formatINR(productPrice)}</strong></div>
            <div style={{ fontSize: '0.85rem', color: '#86efac' }}>Down Payment: <strong>{formatINR(downPayment)}</strong></div>
            <div style={{ fontSize: '0.95rem', color: '#fef08a', fontWeight: 800 }}>Net Loan Amount: {formatINR(loanAmount)}</div>
          </div>
        </div>

        {/* Interactive Down Payment Slider */}
        <div style={{ background: 'var(--bg-surface-alt)', padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
          <div className="flex justify-between items-center" style={{ marginBottom: '0.5rem' }}>
            <label className="input-label" style={{ margin: 0, fontWeight: 700, color: 'var(--text-main)' }}>
              Adjust Down Payment Amount (₹)
            </label>
            <span style={{ fontWeight: 800, fontSize: '1.1rem', color: '#166534' }}>
              {formatINR(downPayment)} {downPayment === 0 && '(Zero Down)'}
            </span>
          </div>
          <input
            type="range"
            min="0"
            max={Math.round(productPrice * 0.8)}
            step="1000"
            value={downPayment}
            onChange={(e) => handleDownPaymentChange(e.target.value)}
          />
          <div className="flex justify-between text-xs" style={{ color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            <span>₹0 (Zero Down Payment)</span>
            <span>Max Down: {formatINR(Math.round(productPrice * 0.8))}</span>
          </div>
        </div>

        {/* Tab Navigation for EMI Types */}
        <div className="flex flex-wrap gap-2" style={{ borderBottom: '2px solid #e2e8f0', paddingBottom: '0.5rem' }}>
          <button
            type="button"
            onClick={() => setActiveTab('noCost')}
            className={`btn btn-sm ${activeTab === 'noCost' ? 'btn-primary' : 'btn-secondary'}`}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              background: activeTab === 'noCost' ? '#166534' : '#f1f5f9',
              color: activeTab === 'noCost' ? '#ffffff' : '#334155'
            }}
          >
            <Flame size={15} color={activeTab === 'noCost' ? '#f59e0b' : '#f59e0b'} />
            <span>🔥 No-Cost EMI (0% Interest)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('credit')}
            className={`btn btn-sm ${activeTab === 'credit' ? 'btn-primary' : 'btn-secondary'}`}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              background: activeTab === 'credit' ? '#166534' : '#f1f5f9',
              color: activeTab === 'credit' ? '#ffffff' : '#334155'
            }}
          >
            <CreditCard size={15} />
            <span>Bank Credit Cards ({emiData?.creditCardPlans?.length || 7} Banks)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('debit')}
            className={`btn btn-sm ${activeTab === 'debit' ? 'btn-primary' : 'btn-secondary'}`}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              background: activeTab === 'debit' ? '#166534' : '#f1f5f9',
              color: activeTab === 'debit' ? '#ffffff' : '#334155'
            }}
          >
            <Wallet size={15} />
            <span>Debit Card EMI</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('nbfc')}
            className={`btn btn-sm ${activeTab === 'nbfc' ? 'btn-primary' : 'btn-secondary'}`}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              background: activeTab === 'nbfc' ? '#166534' : '#f1f5f9',
              color: activeTab === 'nbfc' ? '#ffffff' : '#334155'
            }}
          >
            <Landmark size={15} />
            <span>Bajaj & Kisan NBFC Loans</span>
          </button>
        </div>

        {/* TAB 1: NO-COST EMI PLANS */}
        {activeTab === 'noCost' && (
          <div className="flex flex-col gap-3">
            <div style={{ background: '#fef3c7', padding: '0.85rem 1.25rem', borderRadius: '10px', border: '1px solid #fde68a', fontSize: '0.85rem', color: '#92400e', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Sparkles size={18} color="#d97706" style={{ flexShrink: 0 }} />
              <span>
                <strong>Zero Interest Subvention:</strong> The entire bank interest for 3 and 6 month tenures is subsidized by AgriMachina. You pay exactly the machine price with ₹0 extra interest!
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {(emiData?.noCostPlans || []).map((plan, idx) => (
                <div
                  key={idx}
                  style={{
                    background: 'var(--bg-surface)',
                    border: '2px solid #86efac',
                    borderRadius: '12px',
                    padding: '1.25rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    boxShadow: 'var(--shadow-sm)'
                  }}
                >
                  <div>
                    <div className="flex justify-between items-start" style={{ marginBottom: '0.5rem' }}>
                      <div>
                        <div style={{ fontWeight: 800, color: 'var(--text-main)', fontSize: '1rem' }}>{plan.bank}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{plan.cardType}</div>
                      </div>
                      <span className="badge badge-success" style={{ fontSize: '0.7rem' }}>
                        0% Interest
                      </span>
                    </div>

                    <div style={{ margin: '0.75rem 0' }}>
                      <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#166534' }}>
                        {formatINR(plan.calculation.monthlyEMI)}
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 500 }}> / mo</span>
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-main)', fontWeight: 600 }}>
                        Tenure: {plan.tenureMonths} Months
                      </div>
                    </div>
                  </div>

                  <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '0.65rem', fontSize: '0.75rem', color: '#166534', fontWeight: 700 }}>
                    Total Payable: {formatINR(plan.calculation.totalPayable + downPayment)} (Interest: ₹0)
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: CREDIT CARD EMI */}
        {activeTab === 'credit' && (
          <div className="flex flex-col gap-3">
            <div className="admin-table-container" style={{ maxHeight: '350px', overflowY: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                <thead style={{ background: 'var(--bg-surface-alt)', position: 'sticky', top: 0, zIndex: 2 }}>
                  <tr style={{ textAlign: 'left', borderBottom: '2px solid #e2e8f0', color: 'var(--text-muted)' }}>
                    <th style={{ padding: '0.75rem 1rem' }}>Bank Name</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Tenure</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Monthly Installment</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Annual Interest %</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Total Interest</th>
                    <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Total Payable</th>
                  </tr>
                </thead>
                <tbody>
                  {(emiData?.creditCardPlans || []).map((p, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9', background: idx % 2 === 0 ? '#ffffff' : '#fafafa' }}>
                      <td style={{ padding: '0.75rem 1rem', fontWeight: 700, color: 'var(--text-main)' }}>{p.bank}</td>
                      <td style={{ padding: '0.75rem 1rem' }}>{p.tenureMonths} Months</td>
                      <td style={{ padding: '0.75rem 1rem', fontWeight: 800, color: '#166534' }}>
                        {formatINR(p.calculation.monthlyEMI)}/mo
                      </td>
                      <td style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)' }}>{p.annualRate}% p.a.</td>
                      <td style={{ padding: '0.75rem 1rem', color: '#b45309' }}>{formatINR(p.calculation.totalInterest)}</td>
                      <td style={{ padding: '0.75rem 1rem', textAlign: 'right', fontWeight: 700, color: 'var(--text-main)' }}>
                        {formatINR(p.calculation.totalPayable + downPayment)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: DEBIT CARD EMI */}
        {activeTab === 'debit' && (
          <div className="flex flex-col gap-3">
            <div style={{ background: 'var(--primary-50)', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid #bbf7d0', fontSize: '0.8rem', color: '#166534' }}>
              ✓ <strong>No Credit Card Required:</strong> Eligible account holders at HDFC, ICICI, Axis, and SBI (Kisan ATM debit cards) can avail pre-approved EMI directly through Razorpay.
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {(emiData?.debitCardPlans || []).map((p, idx) => (
                <div
                  key={idx}
                  style={{
                    background: 'var(--bg-surface)',
                    border: '1px solid #cbd5e1',
                    borderRadius: '10px',
                    padding: '1rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '0.95rem' }}>{p.bank}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Tenure: {p.tenureMonths} Months @ {p.annualRate}%</div>

                    <div style={{ margin: '0.5rem 0' }}>
                      <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#166534' }}>
                        {formatINR(p.calculation.monthlyEMI)}
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 400 }}> / mo</span>
                      </div>
                    </div>
                  </div>

                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', borderTop: '1px solid #f1f5f9', paddingTop: '0.5rem' }}>
                    Total: {formatINR(p.calculation.totalPayable + downPayment)} (Interest: {formatINR(p.calculation.totalInterest)})
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: CARDLESS & KISAN NBFC */}
        {activeTab === 'nbfc' && (
          <div className="flex flex-col gap-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(emiData?.cardlessNbfcPlans || []).map((p, idx) => (
                <div
                  key={idx}
                  style={{
                    background: 'var(--bg-surface)',
                    border: p.isNoCost ? '2px solid #86efac' : '1px solid #cbd5e1',
                    borderRadius: '12px',
                    padding: '1.25rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <div className="flex justify-between items-start" style={{ marginBottom: '0.35rem' }}>
                      <div style={{ fontWeight: 800, color: 'var(--text-main)', fontSize: '1rem' }}>{p.partner}</div>
                      {p.badge && (
                        <span className={`badge ${p.isNoCost ? 'badge-success' : 'badge-gold'}`} style={{ fontSize: '0.7rem' }}>
                          {p.badge}
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{p.type} • {p.tenureMonths} Months ({p.annualRate}% p.a.)</div>

                    <div style={{ margin: '0.75rem 0' }}>
                      <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#166534' }}>
                        {formatINR(p.calculation.monthlyEMI)}
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 500 }}> / month</span>
                      </div>
                    </div>
                  </div>

                  <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '0.65rem', fontSize: '0.75rem', color: 'var(--text-main)', display: 'flex', justifyContent: 'space-between' }}>
                    <span>Total Interest: <strong>{formatINR(p.calculation.totalInterest)}</strong></span>
                    <span>Total Payable: <strong>{formatINR(p.calculation.totalPayable + downPayment)}</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Razorpay Banking Partners Notice */}
        <div style={{ background: 'var(--bg-surface-alt)', padding: '1rem', borderRadius: '10px', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div className="flex items-center gap-2" style={{ fontSize: '0.8rem', color: 'var(--text-main)', fontWeight: 600 }}>
            <Shield size={16} color="#166534" />
            <span>Select EMI option at Razorpay Checkout screen during order placement</span>
          </div>
          <div className="flex gap-1.5">
            <span className="badge" style={{ background: 'var(--bg-surface)', border: '1px solid #cbd5e1', color: 'var(--text-main)', fontSize: '0.7rem' }}>HDFC</span>
            <span className="badge" style={{ background: 'var(--bg-surface)', border: '1px solid #cbd5e1', color: 'var(--text-main)', fontSize: '0.7rem' }}>SBI</span>
            <span className="badge" style={{ background: 'var(--bg-surface)', border: '1px solid #cbd5e1', color: 'var(--text-main)', fontSize: '0.7rem' }}>ICICI</span>
            <span className="badge" style={{ background: 'var(--bg-surface)', border: '1px solid #cbd5e1', color: 'var(--text-main)', fontSize: '0.7rem' }}>Axis</span>
            <span className="badge" style={{ background: 'var(--bg-surface)', border: '1px solid #cbd5e1', color: 'var(--text-main)', fontSize: '0.7rem' }}>Bajaj Finserv</span>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default EMICalculatorModal;
