import { Decision } from '@/types';

export const DECISIONS: Decision[] = [
  // Invest
  {
    id: 'dec_start_sip_nifty',
    category: 'invest',
    label: 'Start Nifty 50 SIP',
    description: 'Invest systematically in the top 50 Indian companies.',
    icon: '📊',
    requirements: [{ type: 'minSavings', value: 5000, label: '₹5k Savings' }],
    effects: { description: 'Opens SIP menu for Index Funds.' },
    unlockLevel: 2,
    financialExplanation: 'Index funds offer low-cost, broad market exposure. A SIP averages out market volatility (Rupee Cost Averaging).',
    longTermImpact: 'Historically returns 12-14% CAGR over 10+ years, beating inflation comfortably.'
  },
  {
    id: 'dec_invest_ppf',
    category: 'invest',
    label: 'Open PPF Account',
    description: 'Lock-in funds for 15 years with tax-free interest.',
    icon: '🏛️',
    requirements: [{ type: 'minSavings', value: 10000, label: '₹10k Savings' }],
    effects: { description: 'Opens investment menu for PPF.' },
    unlockLevel: 1,
    financialExplanation: 'PPF falls under the EEE (Exempt-Exempt-Exempt) tax category, making it the best debt instrument in India.',
    longTermImpact: 'Provides a safe, guaranteed corpus for retirement or child\'s education.'
  },

  // Spend
  {
    id: 'dec_buy_car',
    category: 'spend',
    label: 'Buy a Car',
    description: 'Purchase a ₹8 Lakh hatchback.',
    icon: '🚗',
    cost: 800000,
    requirements: [{ type: 'minSavings', value: 100000, label: '₹1L Downpayment' }],
    effects: { expenseChange: { transport: -2000, lifestyle: 5000 }, description: 'Takes a ₹7L car loan (if savings < 8L) or pays cash.' },
    unlockLevel: 3,
    financialExplanation: 'A car is a depreciating asset. Taking a loan to buy one increases your monthly fixed obligations (EMI).',
    longTermImpact: 'Reduces investable surplus but improves lifestyle and convenience.'
  },
  {
    id: 'dec_vacation_intl',
    category: 'spend',
    label: 'International Vacation',
    description: 'A 7-day trip to Bali.',
    icon: '✈️',
    cost: 150000,
    requirements: [{ type: 'minSavings', value: 200000, label: '₹2L Savings' }],
    effects: { savingsChange: -150000, xpGain: 300, description: 'Spent ₹1.5L. Great memories!' },
    unlockLevel: 4,
    financialExplanation: 'Experiences are important, but they should be funded from a dedicated sinking fund, not your emergency stash.',
    longTermImpact: 'Zero financial return, but massive mental health and happiness boost.'
  },

  // Career
  {
    id: 'dec_upskill_mba',
    category: 'career',
    label: 'Executive MBA',
    description: 'Enroll in a weekend MBA program to boost your career.',
    icon: '🎓',
    cost: 500000,
    requirements: [{ type: 'minSavings', value: 500000, label: '₹5L Savings' }],
    effects: { savingsChange: -500000, xpGain: 1000, salaryMultiplier: 1.4, description: 'Spent ₹5L. Salary increased by 40%!' },
    unlockLevel: 5,
    financialExplanation: 'Investing in yourself often yields the highest ROI. Education acts as a multiplier on your human capital.',
    longTermImpact: 'Permanently shifts your earning trajectory to a higher band.'
  },
  
  // Protect
  {
    id: 'dec_health_insurance',
    category: 'protect',
    label: 'Buy Health Insurance',
    description: '₹10L comprehensive cover for peace of mind.',
    icon: '🛡️',
    monthlyCost: 800,
    requirements: [],
    effects: { expenseChange: { insurancePremiums: 800 }, description: 'Protected against medical emergencies.' },
    unlockLevel: 1,
    financialExplanation: 'Health insurance transfers the risk of a catastrophic hospital bill to the insurer for a small premium.',
    longTermImpact: 'Protects your wealth from being wiped out by a single illness.'
  },
  {
    id: 'dec_term_insurance',
    category: 'protect',
    label: 'Buy Term Insurance',
    description: '₹1 Crore life cover for your dependents.',
    icon: '☂️',
    monthlyCost: 1000,
    requirements: [{ type: 'isEmployed', value: true, label: 'Must be employed' }],
    effects: { expenseChange: { insurancePremiums: 1000 }, description: 'Family is financially secured.' },
    unlockLevel: 2,
    financialExplanation: 'Term life is the cheapest way to secure your family\'s future if you are the primary breadwinner.',
    longTermImpact: 'Ensures dependents can maintain their lifestyle and pay off debts in your absence.'
  }
];
