import { MarketState, DifficultyConfig, Difficulty, MonthlyExpenses } from '@/types';
import { randomBetween, chance } from '@/utils/random';
import { roundMoney } from '@/utils/format';

export function getDifficultyConfig(difficulty: Difficulty): DifficultyConfig {
  switch (difficulty) {
    case 'hard':
      return {
        inflationRate: 0.08,
        equityReturn: 0.10,
        equityVolatility: 0.20,
        fdRate: 0.06,
        homeLoanRate: 0.10,
        carLoanRate: 0.12,
        salaryGrowthMultiplier: 0.8,
        negativeEventMultiplier: 1.5,
        medicalEmergencyRange: [100000, 500000],
        jobLossProbability: 0.05,
        startingSavings: 50000,
      };
    case 'easy':
      return {
        inflationRate: 0.05,
        equityReturn: 0.14,
        equityVolatility: 0.12,
        fdRate: 0.08,
        homeLoanRate: 0.08,
        carLoanRate: 0.09,
        salaryGrowthMultiplier: 1.2,
        negativeEventMultiplier: 0.5,
        medicalEmergencyRange: [20000, 100000],
        jobLossProbability: 0.01,
        startingSavings: 200000,
      };
    case 'normal':
    default:
      return {
        inflationRate: 0.06,
        equityReturn: 0.12,
        equityVolatility: 0.15,
        fdRate: 0.07,
        homeLoanRate: 0.09,
        carLoanRate: 0.10,
        salaryGrowthMultiplier: 1.0,
        negativeEventMultiplier: 1.0,
        medicalEmergencyRange: [50000, 300000],
        jobLossProbability: 0.02,
        startingSavings: 100000,
      };
  }
}

export function generateMarketState(prevState: MarketState, difficulty: Difficulty): MarketState {
  let { marketPhase, marketCycleMonth, marketCycleLength, interestRate, inflationRate } = prevState;
  
  marketCycleMonth++;
  
  if (marketCycleMonth > marketCycleLength) {
    marketCycleMonth = 1;
    marketCycleLength = Math.floor(randomBetween(12, 36));
    
    // Switch phase
    if (marketPhase === 'neutral') {
      marketPhase = chance(0.5) ? 'bull' : 'bear';
    } else {
      marketPhase = chance(0.7) ? 'neutral' : (marketPhase === 'bull' ? 'bear' : 'bull');
    }
  }

  const config = getDifficultyConfig(difficulty);
  
  let niftyReturn = config.equityReturn;
  if (marketPhase === 'bull') {
    niftyReturn += randomBetween(0.02, 0.05);
  } else if (marketPhase === 'bear') {
    niftyReturn -= randomBetween(0.03, 0.08);
  }

  interestRate = roundMoney(Math.max(0.04, Math.min(0.12, interestRate + randomBetween(-0.002, 0.002))));
  inflationRate = roundMoney(Math.max(0.03, Math.min(0.10, config.inflationRate + randomBetween(-0.01, 0.01))));
  
  const goldReturn = roundMoney(inflationRate + randomBetween(-0.02, 0.05));
  const realEstateReturn = roundMoney(inflationRate + randomBetween(0.01, 0.04));

  return {
    ...prevState,
    niftyReturn: roundMoney(niftyReturn),
    marketPhase,
    marketCycleMonth,
    marketCycleLength,
    interestRate,
    inflationRate,
    goldReturn,
    realEstateReturn,
  };
}

export function applyInflation(expenses: MonthlyExpenses, inflationRate: number): MonthlyExpenses {
  const multiplier = 1 + inflationRate;
  
  return {
    ...expenses,
    rent: roundMoney(expenses.rent * multiplier),
    food: roundMoney(expenses.food * multiplier),
    transport: roundMoney(expenses.transport * multiplier),
    utilities: roundMoney(expenses.utilities * multiplier),
    lifestyle: roundMoney(expenses.lifestyle * multiplier),
    medical: roundMoney(expenses.medical * multiplier),
    childExpenses: roundMoney(expenses.childExpenses * multiplier),
    miscellaneous: roundMoney(expenses.miscellaneous * multiplier),
    emiTotal: expenses.emiTotal,
    insurancePremiums: expenses.insurancePremiums,
    parentSupport: roundMoney(expenses.parentSupport * multiplier),
  };
}
