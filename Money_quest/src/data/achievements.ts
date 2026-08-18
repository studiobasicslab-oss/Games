import { Achievement } from '@/types';

export const ACHIEVEMENTS: Achievement[] = [
  // Wealth
  { id: 'wealth_10l', name: 'First Milestone', description: 'Reach a net worth of ₹10 Lakhs.', icon: '🥉', category: 'wealth', xpReward: 100, condition: { type: 'netWorth', value: 1000000, comparator: 'gte' } },
  { id: 'wealth_50l', name: 'Half Crore', description: 'Reach a net worth of ₹50 Lakhs.', icon: '🏅', category: 'wealth', xpReward: 250, condition: { type: 'netWorth', value: 5000000, comparator: 'gte' } },
  { id: 'wealth_1cr', name: 'Crorepati', description: 'Reach a net worth of ₹1 Crore.', icon: '🥈', category: 'wealth', xpReward: 500, condition: { type: 'netWorth', value: 10000000, comparator: 'gte' } },
  { id: 'wealth_5cr', name: '₹5Cr Club', description: 'Reach a net worth of ₹5 Crores.', icon: '🥇', category: 'wealth', xpReward: 1000, condition: { type: 'netWorth', value: 50000000, comparator: 'gte' } },
  { id: 'wealth_10cr', name: 'Empire Builder', description: 'Reach a net worth of ₹10 Crores.', icon: '👑', category: 'wealth', xpReward: 2500, condition: { type: 'netWorth', value: 100000000, comparator: 'gte' } },
  
  // Investing
  { id: 'inv_first_sip', name: 'The Journey Begins', description: 'Start your first SIP.', icon: '🌱', category: 'investing', xpReward: 50, condition: { type: 'sipCount', value: 1, comparator: 'gte' } },
  { id: 'inv_diver', name: 'Diversified', description: 'Invest in 5 different asset classes.', icon: '🧺', category: 'investing', xpReward: 200, condition: { type: 'portfolioDiversification', value: 5, comparator: 'gte' } },
  { id: 'inv_1L_passive', name: 'Money Makes Money', description: 'Generate ₹1 Lakh/month in passive income.', icon: '💸', category: 'investing', xpReward: 600, condition: { type: 'passiveIncome', value: 100000, comparator: 'gte' } },
  
  // Debt
  { id: 'debt_free', name: 'Debt Free', description: 'Pay off all your loans.', icon: '🕊️', category: 'debt', xpReward: 300, condition: { type: 'debtFree', value: true } },
  
  // Career
  { id: 'car_promo1', name: 'Moving Up', description: 'Get your first promotion.', icon: '📈', category: 'career', xpReward: 150, condition: { type: 'careerLevel', value: 2, comparator: 'gte' } },
  { id: 'car_boss', name: 'Corner Office', description: 'Reach the highest level in your career.', icon: '🏢', category: 'career', xpReward: 800, condition: { type: 'careerLevel', value: 5, comparator: 'gte' } },
  
  // Life
  { id: 'life_married', name: 'Tying the Knot', description: 'Get married.', icon: '💍', category: 'life', xpReward: 100, condition: { type: 'married', value: true } },
  { id: 'life_parent', name: 'Parenthood', description: 'Have a child.', icon: '👶', category: 'life', xpReward: 100, condition: { type: 'children', value: 1, comparator: 'gte' } },
  { id: 'life_home', name: 'Dream Home', description: 'Buy your own house.', icon: '🏡', category: 'life', xpReward: 400, condition: { type: 'homeOwner', value: true } },
  
  // Literacy
  { id: 'lit_ef', name: 'Safety Net', description: 'Build a 6-month emergency fund.', icon: '🛡️', category: 'literacy', xpReward: 200, condition: { type: 'emergencyFund', value: 6, comparator: 'gte' } },
  { id: 'lit_ins', name: 'Fully Covered', description: 'Get adequate health and term insurance.', icon: '☂️', category: 'literacy', xpReward: 200, condition: { type: 'insuranceCoverage', value: true } },
  { id: 'lit_fire', name: 'FIRE Achiever', description: 'Reach 100% Financial Independence (Passive Income > Expenses).', icon: '🔥', category: 'literacy', xpReward: 2000, condition: { type: 'fiPercentage', value: 100, comparator: 'gte' } },
  
  // Challenge
  { id: 'chal_mill_35', name: 'Crorepati by 35', description: 'Reach ₹1 Crore net worth before age 35.', icon: '⚡', category: 'challenge', xpReward: 1500, condition: { type: 'age', value: 35, comparator: 'lte' } },
];
