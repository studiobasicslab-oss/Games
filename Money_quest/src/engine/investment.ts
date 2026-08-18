import { Portfolio, MarketState, Investment, InvestmentType } from '@/types';
import { generateId, roundMoney } from '@/utils/format';
import { simulateMonthlyReturn } from '@/utils/random';

export function processInvestments(portfolio: Portfolio, marketState: MarketState): Portfolio {
  let totalInvested = 0;
  let totalCurrentValue = 0;
  
  const investments = portfolio.investments.map(inv => {
    if (!inv.isActive) {
      totalInvested += inv.investedAmount;
      totalCurrentValue += inv.currentValue;
      return inv;
    }
    
    let monthlyReturn = 0;
    
    switch(inv.type) {
      case InvestmentType.SavingsAccount:
        monthlyReturn = (marketState.interestRate - 0.02) / 12;
        break;
      case InvestmentType.FixedDeposit:
      case InvestmentType.PPF:
      case InvestmentType.NPS:
        monthlyReturn = marketState.interestRate / 12;
        break;
      case InvestmentType.LargeCapMF:
      case InvestmentType.IndexFund:
      case InvestmentType.ELSS:
        monthlyReturn = simulateMonthlyReturn(marketState.niftyReturn, 0.15);
        break;
      case InvestmentType.MidCapMF:
        monthlyReturn = simulateMonthlyReturn(marketState.niftyReturn + 0.02, 0.20);
        break;
      case InvestmentType.SmallCapMF:
        monthlyReturn = simulateMonthlyReturn(marketState.niftyReturn + 0.04, 0.25);
        break;
      case InvestmentType.DirectStocks:
        monthlyReturn = simulateMonthlyReturn(marketState.niftyReturn + 0.05, 0.30);
        break;
      case InvestmentType.USStocks:
        monthlyReturn = simulateMonthlyReturn(marketState.niftyReturn + 0.07, 0.35); // Tech + USD/INR volatility
        break;
      case InvestmentType.Crypto:
        monthlyReturn = simulateMonthlyReturn(0.25, 0.60); // Independent of Nifty
        break;
      case InvestmentType.Gold:
        monthlyReturn = simulateMonthlyReturn(marketState.goldReturn, 0.10);
        break;
      case InvestmentType.RealEstate:
        monthlyReturn = simulateMonthlyReturn(marketState.realEstateReturn, 0.05);
        break;
    }
    
    const newValue = roundMoney(inv.currentValue * (1 + monthlyReturn) + inv.monthlyContribution);
    const newInvested = roundMoney(inv.investedAmount + inv.monthlyContribution);
    
    totalInvested += newInvested;
    totalCurrentValue += newValue;
    
    return {
      ...inv,
      currentValue: newValue,
      investedAmount: newInvested,
      returnRate: newInvested > 0 ? (newValue - newInvested) / newInvested : 0,
      unrealizedGain: roundMoney(newValue - newInvested),
    };
  });
  
  return {
    investments,
    totalInvested: roundMoney(totalInvested),
    totalCurrentValue: roundMoney(totalCurrentValue),
    totalUnrealizedGain: roundMoney(totalCurrentValue - totalInvested),
    assetAllocation: calculatePortfolioAllocation({ investments, totalInvested, totalCurrentValue, totalUnrealizedGain: 0, assetAllocation: {} }),
  };
}

export function startNewSIP(type: InvestmentType, monthlyAmount: number, gameMonth: number): Investment {
  return {
    id: generateId(),
    type,
    name: `${type} SIP`,
    investedAmount: 0,
    currentValue: 0,
    monthlyContribution: monthlyAmount,
    startMonth: gameMonth,
    returnRate: 0,
    unrealizedGain: 0,
    isActive: true,
  };
}

export function lumpSumInvest(type: InvestmentType, amount: number, gameMonth: number): Investment {
  return {
    id: generateId(),
    type,
    name: `${type} Lump Sum`,
    investedAmount: amount,
    currentValue: amount,
    monthlyContribution: 0,
    startMonth: gameMonth,
    returnRate: 0,
    unrealizedGain: 0,
    isActive: true,
  };
}

export function redeemInvestment(investment: Investment, amount: number): { proceeds: number, remainingInvestment: Investment } {
  const ratio = amount / investment.currentValue;
  const actualAmount = Math.min(amount, investment.currentValue);
  
  const proceeds = roundMoney(actualAmount);
  
  const remainingValue = roundMoney(investment.currentValue - actualAmount);
  const remainingInvested = roundMoney(investment.investedAmount * (1 - ratio));
  
  return {
    proceeds,
    remainingInvestment: {
      ...investment,
      currentValue: remainingValue,
      investedAmount: remainingInvested,
      isActive: remainingValue > 0,
      unrealizedGain: roundMoney(remainingValue - remainingInvested),
      returnRate: remainingInvested > 0 ? (remainingValue - remainingInvested) / remainingInvested : 0,
    },
  };
}

export function calculateSIPFutureValue(monthly: number, rate: number, months: number): number {
  const monthlyRate = rate / 12;
  return roundMoney(monthly * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate));
}

export function calculatePortfolioAllocation(portfolio: Portfolio): Record<string, number> {
  const allocation: Record<string, number> = {
    debt: 0,
    equity: 0,
    gold: 0,
    real_estate: 0,
    hybrid: 0,
  };
  
  if (portfolio.totalCurrentValue === 0) return allocation;
  
  portfolio.investments.forEach(inv => {
    const value = inv.currentValue;
    switch(inv.type) {
      case InvestmentType.SavingsAccount:
      case InvestmentType.FixedDeposit:
      case InvestmentType.PPF:
        allocation.debt += value;
        break;
      case InvestmentType.LargeCapMF:
      case InvestmentType.MidCapMF:
      case InvestmentType.SmallCapMF:
      case InvestmentType.IndexFund:
      case InvestmentType.DirectStocks:
      case InvestmentType.USStocks:
      case InvestmentType.ELSS:
        allocation.equity += value;
        break;
      case InvestmentType.Gold:
        allocation.gold += value;
        break;
      case InvestmentType.RealEstate:
        allocation.real_estate += value;
        break;
      case InvestmentType.NPS:
      case InvestmentType.Crypto:
        allocation.hybrid += value;
        break;
    }
  });
  
  for (const key in allocation) {
    allocation[key] = roundMoney((allocation[key] / portfolio.totalCurrentValue) * 100);
  }
  
  return allocation;
}
