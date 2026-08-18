import { Loan, LoanType } from '@/types';
import { generateId, roundMoney } from '@/utils/format';

export function calculateEMI(principal: number, annualRate: number, tenureMonths: number): number {
  if (annualRate === 0) return roundMoney(principal / tenureMonths);
  const monthlyRate = annualRate / 12;
  const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) / (Math.pow(1 + monthlyRate, tenureMonths) - 1);
  return roundMoney(emi);
}

export function processLoanPayment(loan: Loan): Loan {
  if (!loan.isActive) return loan;

  const monthlyInterest = roundMoney(loan.remainingPrincipal * (loan.interestRate / 12));
  const principalComponent = roundMoney(loan.emi - monthlyInterest);
  const newPrincipal = Math.max(0, roundMoney(loan.remainingPrincipal - principalComponent));

  const isPaidOff = newPrincipal <= 0;

  return {
    ...loan,
    remainingPrincipal: newPrincipal,
    remainingMonths: isPaidOff ? 0 : loan.remainingMonths - 1,
    totalInterestPaid: roundMoney(loan.totalInterestPaid + monthlyInterest),
    monthlyPayments: loan.monthlyPayments + 1,
    isActive: !isPaidOff,
  };
}

export function takeLoan(type: LoanType, principal: number, rate: number, tenureMonths: number, gameMonth: number): Loan {
  const emi = calculateEMI(principal, rate, tenureMonths);

  return {
    id: generateId(),
    type,
    name: `${type}`,
    principal,
    remainingPrincipal: principal,
    interestRate: rate,
    emi,
    tenureMonths,
    remainingMonths: tenureMonths,
    totalInterestPaid: 0,
    isActive: true,
    startMonth: gameMonth,
    monthlyPayments: 0,
    missedPayments: 0,
  };
}

export function prepayLoan(loan: Loan, amount: number): { savings: number; newLoan: Loan } {
  const actualAmount = Math.min(amount, loan.remainingPrincipal);
  const newPrincipal = roundMoney(loan.remainingPrincipal - actualAmount);
  
  // Assuming same EMI, calculating new tenure and total interest saved
  // For simplicity in game, we'll keep same EMI and reduce tenure
  let newTenure = 0;
  let remainingInterestWithPrepayment = 0;
  let tempPrincipal = newPrincipal;
  const monthlyRate = loan.interestRate / 12;

  if (newPrincipal > 0) {
    while (tempPrincipal > 0 && newTenure < loan.remainingMonths) {
      const interest = tempPrincipal * monthlyRate;
      const principalPart = loan.emi - interest;
      tempPrincipal -= principalPart;
      remainingInterestWithPrepayment += interest;
      newTenure++;
    }
  }

  const originalRemainingInterest = (loan.emi * loan.remainingMonths) - loan.remainingPrincipal;
  const savings = Math.max(0, roundMoney(originalRemainingInterest - remainingInterestWithPrepayment));

  return {
    savings,
    newLoan: {
      ...loan,
      remainingPrincipal: newPrincipal,
      remainingMonths: newPrincipal <= 0 ? 0 : newTenure,
      isActive: newPrincipal > 0,
    },
  };
}

export function checkLoanEligibility(salary: number, existingEMIs: number, creditScore: number): number {
  // Max EMI is typically 50% of salary
  const maxEMI = (salary * 0.5) - existingEMIs;
  if (maxEMI <= 0 || creditScore < 600) return 0;
  
  // Approximation for personal loan amount (using 14% rate and 5 years)
  // Max Loan = (Max EMI * ( (1+r)^n - 1 )) / ( r * (1+r)^n )
  const r = 0.14 / 12;
  const n = 60; // 5 years
  
  const eligibleAmount = (maxEMI * (Math.pow(1 + r, n) - 1)) / (r * Math.pow(1 + r, n));
  return roundMoney(Math.max(0, eligibleAmount));
}
