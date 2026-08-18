import { InsurancePolicy, InsuranceType } from '@/types';
import { generateId, roundMoney } from '@/utils/format';

export function calculateHealthPremium(age: number, coverAmount: number, familySize: number): number {
  let baseRate = 5000;
  
  if (age > 30) baseRate += 1000;
  if (age > 40) baseRate += 3000;
  if (age > 50) baseRate += 8000;
  
  const coverMultiplier = coverAmount / 500000;
  const familyMultiplier = 1 + (familySize * 0.3);
  
  return roundMoney(baseRate * coverMultiplier * familyMultiplier);
}

export function calculateTermPremium(age: number, coverAmount: number): number {
  // Rough estimate: ₹1Cr cover at 25 costs ~₹8000/yr
  let ratePerLakh = 8;
  
  if (age > 30) ratePerLakh = 12;
  if (age > 40) ratePerLakh = 22;
  if (age > 50) ratePerLakh = 45;
  
  return roundMoney((coverAmount / 100000) * ratePerLakh);
}

export function processInsuranceClaim(policy: InsurancePolicy, claimAmount: number): { payout: number; newPolicy: InsurancePolicy } {
  const payout = Math.min(claimAmount, policy.coverAmount);
  
  return {
    payout,
    newPolicy: {
      ...policy,
      claimsMade: policy.claimsMade + 1,
    }
  };
}

export function getRecommendedCoverage(salary: number, dependents: number): { term: number; health: number } {
  const annualSalary = salary * 12;
  return {
    term: dependents > 0 ? annualSalary * 15 : 0, // 15x annual salary if dependents
    health: 500000 + (dependents * 200000) // ₹5L base + ₹2L per dependent
  };
}

export function checkUnderinsurance(policies: InsurancePolicy[], salary: number, dependents: number): string[] {
  const warnings = [];
  const recs = getRecommendedCoverage(salary, dependents);
  
  let totalTerm = 0;
  let totalHealth = 0;
  
  policies.filter(p => p.isActive).forEach(p => {
    if (p.type === InsuranceType.TermLifeInsurance) totalTerm += p.coverAmount;
    if (p.type === InsuranceType.HealthInsurance) totalHealth += p.coverAmount;
  });
  
  if (dependents > 0 && totalTerm < recs.term * 0.5) {
    warnings.push('Critically underinsured for life cover. Recommend 15x annual salary.');
  }
  
  if (totalHealth < recs.health * 0.5) {
    warnings.push('Health insurance cover is inadequate. One major hospitalization could wipe out savings.');
  }
  
  return warnings;
}
