import { roundMoney } from '@/utils/format';

export function calculateAnnualTax(annualIncome: number): number {
  let taxableIncome = Math.max(0, annualIncome - 75000); // Standard deduction

  if (taxableIncome <= 1200000) {
    return 0; // Section 87A rebate for income up to 12L
  }

  let tax = 0;

  // 0% up to 4L
  if (taxableIncome > 400000) {
    const slab = Math.min(taxableIncome, 800000) - 400000;
    tax += slab * 0.05;
  }

  // 10% 8-12L
  if (taxableIncome > 800000) {
    const slab = Math.min(taxableIncome, 1200000) - 800000;
    tax += slab * 0.10;
  }

  // 15% 12-16L
  if (taxableIncome > 1200000) {
    const slab = Math.min(taxableIncome, 1600000) - 1200000;
    tax += slab * 0.15;
  }

  // 20% 16-20L
  if (taxableIncome > 1600000) {
    const slab = Math.min(taxableIncome, 2000000) - 1600000;
    tax += slab * 0.20;
  }

  // 25% 20-24L
  if (taxableIncome > 2000000) {
    const slab = Math.min(taxableIncome, 2400000) - 2000000;
    tax += slab * 0.25;
  }

  // 30% above 24L
  if (taxableIncome > 2400000) {
    const slab = taxableIncome - 2400000;
    tax += slab * 0.30;
  }

  const cess = tax * 0.04;
  return roundMoney(tax + cess);
}

export function calculateMonthlyTDS(monthlySalary: number): number {
  const annualIncome = monthlySalary * 12;
  const annualTax = calculateAnnualTax(annualIncome);
  return roundMoney(annualTax / 12);
}

export function calculateCapitalGainsTax(gain: number, holdingMonths: number, assetType: 'equity' | 'debt' | 'gold' | 'real_estate'): number {
  if (gain <= 0) return 0;
  
  if (assetType === 'equity') {
    if (holdingMonths < 12) {
      // STCG is 15%
      return roundMoney(gain * 0.15);
    } else {
      // LTCG is 10% above 1L
      const taxableGain = Math.max(0, gain - 100000);
      return roundMoney(taxableGain * 0.10);
    }
  } else {
    // Simplified for other assets: 20% LTCG with indexation or slab rate for STCG. 
    // Using a flat 20% for simplicity in game if held > 36 months, else 30%
    if (holdingMonths < 36) {
      return roundMoney(gain * 0.30);
    } else {
      return roundMoney(gain * 0.20);
    }
  }
}
