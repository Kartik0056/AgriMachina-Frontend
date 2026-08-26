import React from 'react';
import { CreditCard, ShieldCheck } from 'lucide-react';
import { calculateClientEMI, formatINR } from '../../../services/emiHelper';

const allTenureOptions = [3, 6, 9, 12, 18, 24, 36];

const TabEMI = ({ formData, updateField }) => {
  const emi = formData.emi || {
    enabled: true,
    minDownPayment: 0,
    interestRate: 13.5,
    tenureOptions: [3, 6, 9, 12, 18, 24, 36],
    processingFee: 499,
    financePartners: ['HDFC Bank Agri', 'SBI Kisan Credit', 'Bajaj Finserv Agri', 'Kotak Mahindra', 'TVS Credit']
  };

  const updateEMI = (key, value) => {
    updateField('emi', { ...emi, [key]: value });
  };

  const toggleTenure = (t) => {
    const current = emi.tenureOptions || [3, 6, 9, 12, 18, 24, 36];
    if (current.includes(t)) {
      updateEMI('tenureOptions', current.filter(item => item !== t));
    } else {
      updateEMI('tenureOptions', [...current, t].sort((a, b) => a - b));
    }
  };

  // Preview min monthly EMI for max tenure
  const price = formData.sellingPrice || 39999;
  const maxTenure = Math.max(...(emi.tenureOptions?.length ? emi.tenureOptions : [36]));
  const preview = calculateClientEMI(price, emi.minDownPayment || 0, emi.interestRate || 13.5, maxTenure);

  return (
    <div className="flex flex-col gap-6">
      {/* EMI Enable Toggle */}
      <div style={{ background: 'var(--admin-bg-sidebar)', border: '1px solid #1e2e4f', borderRadius: '12px', padding: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontWeight: 700, color: '#ffffff', fontSize: '1rem' }}>
            Enable Kisan EMI Plans & Calculator for this Machine
          </div>
          <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
            Displays "EASY EMI AVAILABLE: Starting from ₹X/mo" badge on storefront and PDP.
          </div>
        </div>
        <input
          type="checkbox"
          checked={emi.enabled !== false}
          onChange={(e) => updateEMI('enabled', e.target.checked)}
          style={{ width: '22px', height: '22px', cursor: 'pointer' }}
        />
      </div>

      {emi.enabled !== false && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="input-group">
              <label className="input-label" style={{ color: '#cbd5e1' }}>Annual Interest Rate (%) *</label>
              <input
                type="number"
                step="0.1"
                className="input-field"
                style={{ background: 'var(--admin-bg-main)', borderColor: 'var(--admin-border)', color: '#ffffff' }}
                value={emi.interestRate ?? 13.5}
                onChange={(e) => updateEMI('interestRate', Number(e.target.value))}
              />
            </div>

            <div className="input-group">
              <label className="input-label" style={{ color: '#cbd5e1' }}>Minimum Required Down Payment (₹)</label>
              <input
                type="number"
                className="input-field"
                style={{ background: 'var(--admin-bg-main)', borderColor: 'var(--admin-border)', color: '#ffffff' }}
                value={emi.minDownPayment ?? 0}
                onChange={(e) => updateEMI('minDownPayment', Number(e.target.value))}
              />
            </div>

            <div className="input-group">
              <label className="input-label" style={{ color: '#cbd5e1' }}>Bank Processing Fee (₹)</label>
              <input
                type="number"
                className="input-field"
                style={{ background: 'var(--admin-bg-main)', borderColor: 'var(--admin-border)', color: '#ffffff' }}
                value={emi.processingFee ?? 499}
                onChange={(e) => updateEMI('processingFee', Number(e.target.value))}
              />
            </div>
          </div>

          {/* Tenures Selection */}
          <div>
            <label className="input-label" style={{ color: '#cbd5e1', marginBottom: '0.5rem', display: 'block' }}>
              Allowed Tenure Installment Options (Months)
            </label>
            <div className="flex flex-wrap gap-2">
              {allTenureOptions.map((t) => {
                const isSelected = (emi.tenureOptions || []).includes(t);
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => toggleTenure(t)}
                    className={`btn btn-sm ${isSelected ? 'btn-primary' : 'btn-secondary'}`}
                    style={{
                      background: isSelected ? '#166534' : '#070d1a',
                      borderColor: isSelected ? '#22c55e' : '#1e2e4f',
                      color: isSelected ? '#ffffff' : '#cbd5e1'
                    }}
                  >
                    {t} Months
                  </button>
                );
              })}
            </div>
          </div>

          {/* Live Preview Box */}
          <div style={{
            background: 'linear-gradient(135deg, #0c3e27, #166534)',
            color: '#ffffff',
            borderRadius: '12px',
            padding: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            <div>
              <div style={{ fontSize: '0.8rem', color: '#86efac', textTransform: 'uppercase', fontWeight: 700 }}>
                Storefront Min EMI Display
              </div>
              <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#fef08a' }}>
                {formatINR(preview.monthlyEMI)} / month
              </div>
              <div style={{ fontSize: '0.75rem', color: '#dcfce7' }}>
                Auto-calculated for {maxTenure} Months tenure @ {emi.interestRate}% interest.
              </div>
            </div>

            <div style={{ fontSize: '0.8rem', color: '#dcfce7', textAlign: 'right' }}>
              <div>Principal Loan: <strong>{formatINR(preview.principalLoanAmount)}</strong></div>
              <div>Total Interest: <strong>{formatINR(preview.totalInterest)}</strong></div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default TabEMI;
