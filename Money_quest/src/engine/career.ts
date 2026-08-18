import { Career, MarketState } from '@/types';
import { CAREER_PATHS } from '@/data/careers';
import { roundMoney } from '@/utils/format';
import { chance, randomBetween, normalRandom } from '@/utils/random';

export function processCareerMonth(career: Career, market: MarketState): Career {
  if (!career.isEmployed) return career;
  
  let performanceScore = career.performanceScore + normalRandom(0, 2);
  performanceScore = Math.max(0, Math.min(100, performanceScore));
  
  return {
    ...career,
    experienceMonths: career.experienceMonths + 1,
    monthsSinceLastPromotion: career.monthsSinceLastPromotion + 1,
    monthsSinceLastSwitch: career.monthsSinceLastSwitch + 1,
    performanceScore,
  };
}

export function checkPromotion(career: Career): { promoted: boolean; newCareer: Career } {
  const path = CAREER_PATHS[career.track];
  if (!path || !career.isEmployed) return { promoted: false, newCareer: career };
  
  const nextLevel = path.levels[career.level];
  if (!nextLevel) return { promoted: false, newCareer: career };
  
  if (career.experienceMonths >= nextLevel.minExperience && career.monthsSinceLastPromotion >= 12) {
    const prob = career.performanceScore > 80 ? 0.4 : (career.performanceScore > 60 ? 0.1 : 0.01);
    
    if (chance(prob)) {
      const oldSalary = career.monthlySalary;
      const newSalary = roundMoney(oldSalary * nextLevel.salaryMultiplier);
      
      return {
        promoted: true,
        newCareer: {
          ...career,
          level: career.level + 1,
          title: nextLevel.title,
          monthlySalary: newSalary,
          monthsSinceLastPromotion: 0,
        },
      };
    }
  }
  
  return { promoted: false, newCareer: career };
}

export function switchJob(career: Career, market: MarketState): Career {
  if (career.monthsSinceLastSwitch < 12) return career;
  
  let bump = randomBetween(0.15, 0.40);
  if (market.marketPhase === 'bull') bump += 0.05;
  if (market.marketPhase === 'bear') bump -= 0.10;
  
  const newSalary = roundMoney(career.monthlySalary * (1 + bump));
  
  return {
    ...career,
    monthlySalary: newSalary,
    monthsSinceLastSwitch: 0,
    company: 'New Company',
  };
}

export function negotiateSalary(career: Career): { success: boolean; newCareer: Career } {
  if (career.monthsSinceLastPromotion < 12 && career.monthsSinceLastSwitch < 12) {
    return { success: false, newCareer: career };
  }
  
  const prob = career.performanceScore > 85 ? 0.6 : 0.2;
  
  if (chance(prob)) {
    const bump = randomBetween(0.05, 0.15);
    const newSalary = roundMoney(career.monthlySalary * (1 + bump));
    
    return {
      success: true,
      newCareer: {
        ...career,
        monthlySalary: newSalary,
        monthsSinceLastPromotion: 0, 
      }
    };
  }
  
  return { success: false, newCareer: career };
}

export function calculateSideIncome(career: Career): number {
  if (!career.isEmployed) return 0;
  
  const path = CAREER_PATHS[career.track];
  if (!path || path.sideHustlePotential <= 0) return 0;
  
  const base = career.monthlySalary * path.sideHustlePotential * 0.5;
  const experienceMultiplier = Math.min(2.0, 1 + (career.experienceMonths / 60));
  
  return roundMoney(base * experienceMultiplier * randomBetween(0.5, 1.5));
}
