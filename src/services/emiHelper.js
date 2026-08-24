/**
 * Client-side reducing balance EMI calculator for instant slider interactivity
 */
export const calculateClientEMI = (price, downPayment = 0, annualRate = 13.5, tenureMonths = 12) => {
  const p = Math.max(0, Number(price) - Number(downPayment));
  const n = Math.max(1, Number(tenureMonths));
  const r = Number(annualRate) / (12 * 100);

  if (p <= 0 || n <= 0) {
    return {
      monthlyEMI: 0,
      principalLoanAmount: 0,
      totalInterest: 0,
      totalPayable: 0
    };
  }

  if (r <= 0) {
    const emi = Math.round(p / n);
    return {
      monthlyEMI: emi,
      principalLoanAmount: p,
      totalInterest: 0,
      totalPayable: p
    };
  }

  const factor = Math.pow(1 + r, n);
  const emi = Math.round((p * r * factor) / (factor - 1));
  const totalRepayment = emi * n;
  const totalInterest = Math.max(0, totalRepayment - p);

  return {
    monthlyEMI: emi,
    principalLoanAmount: p,
    totalInterest,
    totalPayable: totalRepayment
  };
};

export const formatINR = (amount) => {
  if (amount === undefined || amount === null || isNaN(amount)) return '₹0';
  return '₹' + Number(amount).toLocaleString('en-IN');
};
