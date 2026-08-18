import { GameState, FeedbackItem } from '@/types';
import { roundMoney } from '@/utils/format';
import { generateMarketState, applyInflation } from './economy';
import { processInvestments } from './investment';
import { processLoanPayment } from './loan';
import { generateMonthlyEvents } from './events';
import { calculateMonthlyTDS } from './tax';
import { checkAchievements, calculateXP, getLevelFromXP } from './achievements';
import { processCareerMonth } from './career';

export function processMonth(state: GameState): Partial<GameState> {
  const newState = { ...state };
  
  newState.market = generateMarketState(state.market, state.difficulty);
  newState.career = processCareerMonth(state.career, newState.market);
  
  const passiveIncome = newState.portfolio.investments
    .filter(i => i.isActive && i.currentValue > 0)
    .reduce((sum, inv) => sum + (inv.currentValue * 0.04) / 12, 0); 
  newState.passiveIncome = roundMoney(passiveIncome);
  newState.monthlyIncome = newState.career.isEmployed ? newState.career.monthlySalary + newState.passiveIncome : newState.passiveIncome;
  newState.annualIncome += newState.monthlyIncome;
  
  const isJan = ((newState.currentMonth - 1) % 12) + 1 === 1;
  if (isJan && newState.currentMonth > 1) {
    newState.monthlyExpenses = applyInflation(newState.monthlyExpenses, newState.market.inflationRate);
    newState.age += 1;
  }
  
  const monthlyTax = calculateMonthlyTDS(newState.career.monthlySalary);
  
  newState.loans = state.loans.map(loan => processLoanPayment(loan));
  newState.monthlyExpenses.emiTotal = newState.loans.reduce((sum, loan) => sum + (loan.isActive ? loan.emi : 0), 0);
  
  newState.portfolio = processInvestments(newState.portfolio, newState.market);
  
  const sipTotal = newState.portfolio.investments
    .filter(i => i.isActive)
    .reduce((sum, i) => sum + i.monthlyContribution, 0);
    
  newState.cashFlow = calculateCashFlow(newState);
  newState.savings = roundMoney(newState.savings + newState.cashFlow - sipTotal);
  
  const events = generateMonthlyEvents(newState, newState.difficulty);
  newState.currentEvents = events;
  
  newState.netWorth = calculateNetWorth(newState);
  
  newState.xp += calculateXP(newState, 0, events.length);
  newState.level = getLevelFromXP(newState.xp);
  
  const newAchievements = checkAchievements(newState);
  newState.achievements = [...newState.achievements, ...newAchievements];
  
  const totalExpenses = Object.values(newState.monthlyExpenses).reduce((a, b) => a + (b as number), 0) as number + monthlyTax;
  
  const snapshot = {
    month: newState.currentMonth,
    age: newState.age,
    year: 2024 + Math.floor((newState.currentMonth - 1) / 12),
    salary: newState.career.monthlySalary,
    totalIncome: newState.monthlyIncome,
    totalExpenses: totalExpenses,
    netWorth: newState.netWorth,
    savings: newState.savings,
    investmentValue: newState.portfolio.totalCurrentValue,
    debtTotal: newState.loans.reduce((sum, l) => sum + l.remainingPrincipal, 0),
    cashFlow: newState.cashFlow,
    creditScore: newState.creditScore.score,
    events: events.map((e: any) => e.id),
    decisions: [],
    passiveIncome: newState.passiveIncome,
    fiPercentage: Math.min(100, (newState.passiveIncome / Math.max(1, totalExpenses)) * 100),
  };
  
  newState.history = [...newState.history, snapshot];
  newState.currentMonth += 1;
  
  const { isGameOver, gameOverReason } = checkWinConditions(newState);
  if (isGameOver) {
    newState.isGameOver = true;
    newState.gameOverReason = gameOverReason;
  }
  
  return newState;
}

export function calculateNetWorth(state: GameState): number {
  const totalAssets = state.savings + state.portfolio.totalCurrentValue;
  const totalLiabilities = state.loans.reduce((sum, l) => sum + l.remainingPrincipal, 0);
  return roundMoney(totalAssets - totalLiabilities);
}

export function calculateCashFlow(state: GameState): number {
  const expenseValues = Object.values(state.monthlyExpenses).reduce((a, b) => (typeof a === 'number' && typeof b === 'number' ? a + b : a), 0) as number;
  const tax = calculateMonthlyTDS(state.career.monthlySalary);
  return roundMoney(state.monthlyIncome - (expenseValues + tax));
}

export function checkWinConditions(state: GameState): { isGameOver: boolean; gameOverReason?: string } {
  if (state.savings < 0 && state.portfolio.totalCurrentValue <= 0) {
    return { isGameOver: true, gameOverReason: 'Bankrupt: You ran out of money and assets.' };
  }
  
  if (state.netWorth >= 100000000) { 
    return { isGameOver: true, gameOverReason: 'Victory: Reached ₹10 Crore net worth!' };
  }
  
  const totalExpenses = Object.values(state.monthlyExpenses).reduce((a, b) => a + (b as number), 0) as number;
  if (state.passiveIncome > totalExpenses * 1.5 && state.age >= 40) {
    return { isGameOver: true, gameOverReason: 'Victory: Achieved Financial Independence!' };
  }
  
  if (state.age >= 60) {
    return { isGameOver: true, gameOverReason: 'Retirement: Reached age 60.' };
  }
  
  return { isGameOver: false };
}

export function generateFeedback(decisions: string[], state: GameState): FeedbackItem[] {
  return [];
}
