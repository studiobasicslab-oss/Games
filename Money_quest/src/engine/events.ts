import { GameState, GameEvent, Difficulty, EventChoice } from '@/types';
import { chance, weightedRandom } from '@/utils/random';
import { getDifficultyConfig } from './economy';
import { GAME_EVENTS } from '@/data/events';
import { roundMoney } from '@/utils/format';

export function generateMonthlyEvents(state: GameState, difficulty: Difficulty): GameEvent[] {
  const possibleEvents = GAME_EVENTS.filter((e: any) => evaluatePreconditions(e, state));
  if (possibleEvents.length === 0) return [];

  const config = getDifficultyConfig(difficulty);
  const eventsToTrigger: GameEvent[] = [];

  const count = chance(0.2 * config.negativeEventMultiplier) ? (chance(0.2) ? 2 : 1) : 0;
  
  if (count === 0) return [];

  const probabilities = possibleEvents.map((e: any) => getEventProbability(e, difficulty, state.age));
  
  for (let i = 0; i < count; i++) {
    const ev = weightedRandom(possibleEvents, probabilities);
    if (!eventsToTrigger.find((e: any) => e.id === ev.id)) {
      eventsToTrigger.push(ev);
    }
  }

  return eventsToTrigger;
}

export function evaluatePreconditions(event: GameEvent, state: GameState): boolean {
  if (!event.preconditions || event.preconditions.length === 0) return true;

  return event.preconditions.every((p: any) => {
    switch (p.type) {
      case 'minAge': return state.age >= (p.value as number);
      case 'maxAge': return state.age <= (p.value as number);
      case 'minSavings': return state.savings >= (p.value as number);
      case 'maxSavings': return state.savings <= (p.value as number);
      case 'isEmployed': return state.career.isEmployed === (p.value as boolean);
      case 'isMarried': return (state.life.maritalStatus === 'married') === (p.value as boolean);
      case 'hasChildren': return (state.life.children > 0) === (p.value as boolean);
      case 'hasLoan': return (state.loans.some(l => l.isActive)) === (p.value as boolean);
      case 'hasCar': return (state.life.transport.includes('car')) === (p.value as boolean);
      case 'hasHouse': return (state.life.housing.includes('owned')) === (p.value as boolean);
      case 'minNetWorth': return state.netWorth >= (p.value as number);
      case 'maxNetWorth': return state.netWorth <= (p.value as number);
      case 'minCreditScore': return state.creditScore.score >= (p.value as number);
      case 'difficulty': return state.difficulty === (p.value as string);
      default: return true;
    }
  });
}

export function getEventProbability(event: GameEvent, difficulty: Difficulty, age: number): number {
  let prob = event.baseProbability;
  
  const config = getDifficultyConfig(difficulty);
  
  if (event.category === 'health' || event.category === 'family' || event.category === 'economy') {
    prob *= config.negativeEventMultiplier;
  }
  
  if (event.category === 'health' && age > 40) prob *= 1.5;
  if (event.category === 'health' && age > 50) prob *= 2.0;

  return prob;
}

export function applyEventEffects(state: GameState, event: GameEvent, choiceId?: string): GameState {
  const effect = choiceId 
    ? event.choices?.find((c: any) => c.id === choiceId)?.effects 
    : event.effects;
    
  if (!effect) return state;

  const newState = { ...state };

  if (effect.savingsChange) {
    newState.savings = Math.max(0, newState.savings + effect.savingsChange);
  }

  if (effect.salaryChange && newState.career.isEmployed) {
    newState.career.monthlySalary = Math.max(0, newState.career.monthlySalary + effect.salaryChange);
  }

  if (effect.salaryMultiplier && newState.career.isEmployed) {
    newState.career.monthlySalary = roundMoney(newState.career.monthlySalary * effect.salaryMultiplier);
  }

  if (effect.isEmployed !== undefined) {
    newState.career.isEmployed = effect.isEmployed;
    if (!effect.isEmployed) {
      newState.career.monthlySalary = 0;
    }
  }

  if (effect.expenseChange) {
    newState.monthlyExpenses = { ...newState.monthlyExpenses };
    for (const [key, value] of Object.entries(effect.expenseChange)) {
      if (value) {
         // @ts-ignore
         newState.monthlyExpenses[key] = Math.max(0, newState.monthlyExpenses[key] + value);
      }
    }
  }

  if (effect.creditScoreChange) {
    newState.creditScore.score = Math.max(300, Math.min(900, newState.creditScore.score + effect.creditScoreChange));
  }

  if (effect.xpGain) {
    newState.xp += effect.xpGain;
  }

  return newState;
}
