import { GameState, Achievement } from '@/types';
import { ACHIEVEMENTS } from '@/data/achievements';

export function checkAchievements(state: GameState): string[] {
  const newUnlocks: string[] = [];

  for (const ach of (ACHIEVEMENTS as any[])) {
    if (state.achievements.includes(ach.id)) continue;
    
    let isUnlocked = false;
    const cond = ach.condition;

    switch (cond.type) {
      case 'netWorth':
        isUnlocked = evaluateCondition(state.netWorth, cond.value as number, cond.comparator);
        break;
      case 'passiveIncome':
        isUnlocked = evaluateCondition(state.passiveIncome, cond.value as number, cond.comparator);
        break;
      case 'debtFree':
        isUnlocked = state.loans.every(l => !l.isActive) === (cond.value as boolean);
        break;
      case 'investmentCount':
        isUnlocked = evaluateCondition(state.portfolio.investments.filter(i => i.isActive).length, cond.value as number, cond.comparator);
        break;
      case 'sipCount':
        isUnlocked = evaluateCondition(state.portfolio.investments.filter(i => i.isActive && i.monthlyContribution > 0).length, cond.value as number, cond.comparator);
        break;
      case 'emergencyFund':
        isUnlocked = state.life.hasEmergencyFund === (cond.value as boolean);
        break;
      case 'creditScore':
        isUnlocked = evaluateCondition(state.creditScore.score, cond.value as number, cond.comparator);
        break;
      case 'age':
        isUnlocked = evaluateCondition(state.age, cond.value as number, cond.comparator);
        break;
      case 'careerLevel':
        isUnlocked = evaluateCondition(state.career.level, cond.value as number, cond.comparator);
        break;
      case 'totalInvested':
        isUnlocked = evaluateCondition(state.portfolio.totalInvested, cond.value as number, cond.comparator);
        break;
    }

    if (isUnlocked) {
      newUnlocks.push(ach.id);
    }
  }

  return newUnlocks;
}

function evaluateCondition(actual: number, expected: number, comp: 'gte' | 'lte' | 'eq' = 'gte'): boolean {
  if (comp === 'gte') return actual >= expected;
  if (comp === 'lte') return actual <= expected;
  return actual === expected;
}

export function calculateXP(state: GameState, decisionsMade: number, eventsHandled: number): number {
  let xp = 0;
  
  xp += 10;
  
  if (state.savings > 0) xp += 5;
  if (state.passiveIncome > 0) xp += 10;
  
  xp += decisionsMade * 20;
  xp += eventsHandled * 15;
  
  return xp;
}

export function getLevelFromXP(xp: number): number {
  return Math.min(50, Math.floor(Math.sqrt(xp / 100)) + 1);
}

export function getUnlockedFeatures(level: number): string[] {
  const features = [];
  if (level >= 2) features.push('basic_investing');
  if (level >= 5) features.push('advanced_investing');
  if (level >= 10) features.push('real_estate');
  if (level >= 15) features.push('business_ventures');
  return features;
}
