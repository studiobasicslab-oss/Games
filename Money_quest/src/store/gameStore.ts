'use client';

/**
 * Money Quest — Zustand Game Store
 * Central state management with immer for immutable updates and persist for save/load
 */

import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { persist, createJSONStorage } from 'zustand/middleware';
import {
  GameState,
  GameActions,
  Difficulty,
  GamePhase,
  Decision,
  Toast,
  MonthlyExpenses,
  Career,
  LifeState,
  Portfolio,
  CreditScore,
  MarketState,
  FeedbackItem,
  CareerTrack,
  InvestmentType,
  LoanType,
  InsuranceType,
} from '@/types';
import { generateId, roundMoney } from '@/utils/format';

// --- Default initial state ---

const defaultExpenses: MonthlyExpenses = {
  rent: 14000,
  food: 8000,
  transport: 3500,
  utilities: 4000,
  lifestyle: 5500,
  medical: 500,
  emiTotal: 0,
  insurancePremiums: 0,
  parentSupport: 0,
  childExpenses: 0,
  miscellaneous: 2000,
};

const defaultCareer: Career = {
  track: CareerTrack.IT,
  title: 'Junior Developer',
  company: 'TechCorp India',
  monthlySalary: 40000,
  experienceMonths: 0,
  level: 0,
  skills: { technical: 40, communication: 30, management: 10, domain: 20 },
  isEmployed: true,
  monthsSinceLastPromotion: 0,
  monthsSinceLastSwitch: 0,
  performanceScore: 60,
};

const defaultLife: LifeState = {
  housing: 'renting',
  maritalStatus: 'single',
  children: 0,
  transport: 'public',
  lifestyle: 'moderate',
  city: 'tier1',
  hasEmergencyFund: false,
  emergencyFundMonths: 0,
  emergencyFundAmount: 0,
};

const defaultPortfolio: Portfolio = {
  investments: [],
  totalInvested: 0,
  totalCurrentValue: 0,
  totalUnrealizedGain: 0,
  assetAllocation: {},
};

const defaultCreditScore: CreditScore = {
  score: 750,
  paymentHistory: 80,
  creditUtilization: 90,
  creditAge: 0,
  creditMix: 50,
  newCredit: 80,
};

const defaultMarket: MarketState = {
  niftyReturn: 0.12,
  marketPhase: 'neutral',
  interestRate: 0.065,
  inflationRate: 0.06,
  goldReturn: 0.10,
  realEstateReturn: 0.06,
  marketCycleMonth: 0,
  marketCycleLength: 24,
};

function createInitialState(difficulty: Difficulty, careerTrack: CareerTrack): Omit<GameState, keyof GameActions> {
  const careerSalaries: Record<CareerTrack, { salary: number; title: string; company: string }> = {
    [CareerTrack.IT]: { salary: 40000, title: 'Junior Developer', company: 'TechCorp India' },
    [CareerTrack.Finance]: { salary: 35000, title: 'Financial Analyst', company: 'FinServe Capital' },
    [CareerTrack.Marketing]: { salary: 28000, title: 'Marketing Executive', company: 'BrandWorks Media' },
    [CareerTrack.Consulting]: { salary: 50000, title: 'Junior Consultant', company: 'StratEdge Consulting' },
    [CareerTrack.Government]: { salary: 32000, title: 'Probationary Officer', company: 'Government of India' },
    [CareerTrack.Healthcare]: { salary: 40000, title: 'Junior Resident', company: 'Apollo Hospitals' },
    [CareerTrack.Creative]: { salary: 25000, title: 'Junior Designer', company: 'PixelCraft Studios' },
    [CareerTrack.Teaching]: { salary: 22000, title: 'Assistant Teacher', company: 'Delhi Public School' },
  };

  const careerInfo = careerSalaries[careerTrack];

  return {
    currentMonth: 1,
    age: 22,
    difficulty,
    gamePhase: 'income',
    isGameOver: false,
    gameOverReason: undefined,

    savings: 500000,
    monthlyIncome: careerInfo.salary,
    monthlyExpenses: { ...defaultExpenses },
    netWorth: 500000,
    cashFlow: 0,
    passiveIncome: 0,
    annualIncome: careerInfo.salary * 12,

    portfolio: { ...defaultPortfolio },
    loans: [],
    insurance: [],

    career: {
      ...defaultCareer,
      track: careerTrack,
      title: careerInfo.title,
      company: careerInfo.company,
      monthlySalary: careerInfo.salary,
    },

    life: { ...defaultLife },
    creditScore: { ...defaultCreditScore },
    market: { ...defaultMarket },

    xp: 0,
    level: 1,
    achievements: [],
    unlockedFeatures: ['SavingsAccount', 'FixedDeposit', 'HealthInsurance'],

    history: [],

    currentEvents: [],
    currentFeedback: [],
    pendingDecisions: [],

    toasts: [],
    showTutorial: true,
  };
}

// --- Store ---

type GameStore = GameState & GameActions;

export const useGameStore = create<GameStore>()(
  persist(
    immer((set, get) => ({
      // Initial state (default - will be overwritten by startNewGame)
      ...createInitialState('normal', CareerTrack.IT),

      // === Game Lifecycle ===

      startNewGame: (difficulty: Difficulty, careerTrack: CareerTrack) => {
        set((draft) => {
          const initial = createInitialState(difficulty, careerTrack);
          Object.assign(draft, initial);
        });
      },

      resetGame: () => {
        set((draft) => {
          const initial = createInitialState('normal', CareerTrack.IT);
          Object.assign(draft, initial);
          draft.gamePhase = 'setup';
        });
      },

      saveGame: () => {
        // Handled automatically by persist middleware
        const state = get();
        state.addToast({ message: 'Game saved!', type: 'success' });
      },

      loadGame: (): boolean => {
        // Persist middleware auto-loads
        const state = get();
        return state.currentMonth > 0;
      },

      // === Turn Management ===

      advanceTurn: () => {
        set((draft) => {
          // Calculate total expenses
          const expenses = draft.monthlyExpenses;
          const totalExpenses =
            expenses.rent + expenses.food + expenses.transport + expenses.utilities +
            expenses.lifestyle + expenses.medical + expenses.emiTotal +
            expenses.insurancePremiums + expenses.parentSupport +
            expenses.childExpenses + expenses.miscellaneous;

          // 1. Apply income
          const totalIncome = draft.career.monthlySalary + draft.passiveIncome;
          draft.savings = roundMoney(draft.savings + totalIncome);
          draft.monthlyIncome = totalIncome;

          // 2. Deduct expenses
          draft.savings = roundMoney(draft.savings - totalExpenses);

          // 3. Process loan payments
          draft.loans.forEach((loan) => {
            if (loan.isActive && loan.remainingMonths > 0) {
              const monthlyRate = loan.interestRate / 12;
              const interestPayment = roundMoney(loan.remainingPrincipal * monthlyRate);
              const principalPayment = roundMoney(loan.emi - interestPayment);
              loan.remainingPrincipal = roundMoney(Math.max(0, loan.remainingPrincipal - principalPayment));
              loan.totalInterestPaid = roundMoney(loan.totalInterestPaid + interestPayment);
              loan.remainingMonths -= 1;
              loan.monthlyPayments += 1;
              if (loan.remainingMonths <= 0 || loan.remainingPrincipal <= 0) {
                loan.isActive = false;
              }
            }
          });

          // 4. Update investment values (simplified - engines handle detailed calculations)
          draft.portfolio.investments.forEach((inv) => {
            if (inv.isActive) {
              // Apply monthly SIP contribution
              if (inv.monthlyContribution > 0) {
                draft.savings = roundMoney(draft.savings - inv.monthlyContribution);
                inv.investedAmount = roundMoney(inv.investedAmount + inv.monthlyContribution);
              }
              // Simplified return (engine provides more accurate calculations)
              const monthlyReturn = inv.returnRate / 12;
              inv.currentValue = roundMoney(inv.currentValue * (1 + monthlyReturn) + inv.monthlyContribution);
              inv.unrealizedGain = roundMoney(inv.currentValue - inv.investedAmount);
            }
          });

          // 5. Update portfolio totals
          const activeInvestments = draft.portfolio.investments.filter((i) => i.isActive);
          draft.portfolio.totalInvested = activeInvestments.reduce((sum, i) => sum + i.investedAmount, 0);
          draft.portfolio.totalCurrentValue = activeInvestments.reduce((sum, i) => sum + i.currentValue, 0);
          draft.portfolio.totalUnrealizedGain = roundMoney(
            draft.portfolio.totalCurrentValue - draft.portfolio.totalInvested
          );

          // 6. Calculate cash flow
          draft.cashFlow = roundMoney(totalIncome - totalExpenses);

          // 7. Calculate net worth
          const totalAssets = draft.savings + draft.portfolio.totalCurrentValue + draft.life.emergencyFundAmount;
          const totalLiabilities = draft.loans
            .filter((l) => l.isActive)
            .reduce((sum, l) => sum + l.remainingPrincipal, 0);
          draft.netWorth = roundMoney(totalAssets - totalLiabilities);

          // 8. Calculate passive income
          draft.passiveIncome = roundMoney(
            activeInvestments
              .filter((i) => i.type === 'RealEstate')
              .reduce((sum, i) => sum + i.currentValue * 0.03 / 12, 0)
          );

          // 9. Update annual income for tax
          draft.annualIncome = draft.career.monthlySalary * 12;

          // 10. Update emergency fund status
          if (draft.life.emergencyFundAmount > 0) {
            draft.life.emergencyFundMonths = Math.floor(draft.life.emergencyFundAmount / totalExpenses);
            draft.life.hasEmergencyFund = draft.life.emergencyFundMonths >= 3;
          }

          // 11. Record history snapshot
          draft.history.push({
            month: draft.currentMonth,
            age: draft.age,
            year: 2024 + Math.floor((draft.currentMonth - 1) / 12),
            salary: draft.career.monthlySalary,
            totalIncome,
            totalExpenses,
            netWorth: draft.netWorth,
            savings: draft.savings,
            investmentValue: draft.portfolio.totalCurrentValue,
            debtTotal: totalLiabilities,
            cashFlow: draft.cashFlow,
            creditScore: draft.creditScore.score,
            events: draft.currentEvents.map((e) => e.name),
            decisions: [],
            passiveIncome: draft.passiveIncome,
            fiPercentage: totalExpenses > 0
              ? Math.min(100, (draft.portfolio.totalCurrentValue / (totalExpenses * 12 * 25)) * 100)
              : 0,
          });

          // 12. Update EMI total in expenses
          draft.monthlyExpenses.emiTotal = draft.loans
            .filter((l) => l.isActive)
            .reduce((sum, l) => sum + l.emi, 0);

          // 13. Update insurance premiums in expenses
          draft.monthlyExpenses.insurancePremiums = draft.insurance
            .filter((p) => p.isActive)
            .reduce((sum, p) => sum + p.monthlyPremium, 0);

          // 14. Advance time
          draft.currentMonth += 1;
          if (draft.currentMonth > 1 && (draft.currentMonth - 1) % 12 === 0) {
            draft.age += 1;
          }

          // 15. Check game over
          if (draft.age >= 60) {
            draft.isGameOver = true;
            draft.gamePhase = 'game_over';
            draft.gameOverReason = 'Retirement age reached!';
          } else if (draft.savings < -500000) {
            draft.isGameOver = true;
            draft.gamePhase = 'game_over';
            draft.gameOverReason = 'Bankruptcy — you ran out of money!';
          }

          // 16. Clear current events for next turn
          draft.currentEvents = [];
          draft.currentFeedback = [];

          // Set phase to income for next turn (or game_over)
          if (!draft.isGameOver) {
            draft.gamePhase = 'summary';
          }
        });
      },

      setGamePhase: (phase: GamePhase) => {
        set((draft) => {
          draft.gamePhase = phase;
        });
      },

      // === Player Decisions ===

      makeDecision: (decision: Decision, params?: Record<string, number>) => {
        set((draft) => {
          const cost = params?.amount || decision.cost || 0;

          // Deduct cost
          if (cost > 0) {
            draft.savings = roundMoney(draft.savings - cost);
          }

          // Apply effects
          const effects = decision.effects;

          if (effects.salaryMultiplier) {
            draft.career.monthlySalary = roundMoney(draft.career.monthlySalary * effects.salaryMultiplier);
          }
          if (effects.salaryChange) {
            draft.career.monthlySalary = roundMoney(draft.career.monthlySalary + effects.salaryChange);
          }
          if (effects.savingsChange) {
            draft.savings = roundMoney(draft.savings + effects.savingsChange);
          }
          if (effects.creditScoreChange) {
            draft.creditScore.score = Math.max(300, Math.min(900,
              draft.creditScore.score + effects.creditScoreChange
            ));
          }
          if (effects.xpGain) {
            draft.xp += effects.xpGain;
            // Level up check (100 XP per level)
            const newLevel = Math.floor(draft.xp / 100) + 1;
            if (newLevel > draft.level) {
              draft.level = Math.min(50, newLevel);
              draft.toasts.push({
                id: generateId(),
                message: `Level Up! You're now level ${draft.level}!`,
                type: 'achievement',
              });
            }
          }
          if (effects.expenseChange) {
            const ec = effects.expenseChange;
            if (ec.rent !== undefined) draft.monthlyExpenses.rent += ec.rent;
            if (ec.food !== undefined) draft.monthlyExpenses.food += ec.food;
            if (ec.transport !== undefined) draft.monthlyExpenses.transport += ec.transport;
            if (ec.utilities !== undefined) draft.monthlyExpenses.utilities += ec.utilities;
            if (ec.lifestyle !== undefined) draft.monthlyExpenses.lifestyle += ec.lifestyle;
            if (ec.parentSupport !== undefined) draft.monthlyExpenses.parentSupport += ec.parentSupport;
            if (ec.childExpenses !== undefined) draft.monthlyExpenses.childExpenses += ec.childExpenses;
          }
          if (effects.isEmployed !== undefined) {
            draft.career.isEmployed = effects.isEmployed;
            if (!effects.isEmployed) {
              draft.career.monthlySalary = 0;
            }
          }

          // Generate feedback
          draft.currentFeedback.push({
            id: generateId(),
            title: decision.label,
            description: decision.financialExplanation,
            impact: effects.description,
            longTermProjection: decision.longTermImpact,
            type: cost > 0 ? 'neutral' : 'positive',
            icon: decision.icon,
            numbers: [
              ...(cost > 0 ? [{ label: 'Cost', value: `₹${cost.toLocaleString('en-IN')}`, color: 'text-rose-400' }] : []),
              ...(effects.salaryMultiplier ? [{ label: 'Salary Change', value: `${((effects.salaryMultiplier - 1) * 100).toFixed(0)}%`, color: effects.salaryMultiplier > 1 ? 'text-emerald-400' : 'text-rose-400' }] : []),
            ],
          });

          // Record decision in last history entry
          if (draft.history.length > 0) {
            draft.history[draft.history.length - 1].decisions.push(decision.label);
          }

          draft.gamePhase = 'feedback';
        });
      },

      resolveEvent: (eventId: string, choiceId?: string) => {
        set((draft) => {
          const event = draft.currentEvents.find((e) => e.id === eventId);
          if (!event) return;

          let effects;
          if (choiceId && event.choices) {
            const choice = event.choices.find((c) => c.id === choiceId);
            if (choice) {
              effects = choice.effects;
              if (choice.cost) {
                draft.savings = roundMoney(draft.savings - choice.cost);
              }
            }
          } else if (event.effects) {
            effects = event.effects;
          }

          if (effects) {
            if (effects.salaryMultiplier) {
              draft.career.monthlySalary = roundMoney(draft.career.monthlySalary * effects.salaryMultiplier);
            }
            if (effects.salaryChange) {
              draft.career.monthlySalary = roundMoney(draft.career.monthlySalary + effects.salaryChange);
            }
            if (effects.savingsChange) {
              draft.savings = roundMoney(draft.savings + effects.savingsChange);
            }
            if (effects.creditScoreChange) {
              draft.creditScore.score = Math.max(300, Math.min(900,
                draft.creditScore.score + effects.creditScoreChange
              ));
            }
            if (effects.xpGain) {
              draft.xp += effects.xpGain;
            }
            if (effects.isEmployed !== undefined) {
              draft.career.isEmployed = effects.isEmployed;
              if (!effects.isEmployed) {
                draft.career.monthlySalary = 0;
              }
            }
          }

          // Remove resolved event
          draft.currentEvents = draft.currentEvents.filter((e) => e.id !== eventId);

          // If no more events, move to decisions
          if (draft.currentEvents.length === 0) {
            draft.gamePhase = 'decisions';
          }
        });
      },

      dismissEvent: (eventId: string) => {
        set((draft) => {
          draft.currentEvents = draft.currentEvents.filter((e) => e.id !== eventId);
          if (draft.currentEvents.length === 0) {
            draft.gamePhase = 'decisions';
          }
        });
      },

      // === Investment Actions ===

      startSIP: (type: InvestmentType, monthlyAmount: number) => {
        set((draft) => {
          const returnRates: Record<string, number> = {
            LargeCapMF: 0.12, MidCapMF: 0.15, SmallCapMF: 0.18,
            IndexFund: 0.12, ELSS: 0.13, Gold: 0.10,
          };
          const newInvestment = {
            id: generateId(),
            type,
            name: `SIP - ${type}`,
            investedAmount: monthlyAmount,
            currentValue: monthlyAmount,
            monthlyContribution: monthlyAmount,
            startMonth: draft.currentMonth,
            returnRate: returnRates[type] || 0.10,
            unrealizedGain: 0,
            isActive: true,
          };
          draft.portfolio.investments.push(newInvestment);
          draft.savings = roundMoney(draft.savings - monthlyAmount);
          draft.xp += 15;

          draft.toasts.push({
            id: generateId(),
            message: `Started SIP of ₹${monthlyAmount.toLocaleString('en-IN')}/month in ${type}!`,
            type: 'success',
          });
        });
      },

      lumpSumInvest: (type: InvestmentType, amount: number) => {
        set((draft) => {
          if (draft.savings < amount) return;

          const returnRates: Record<string, number> = {
            SavingsAccount: 0.035, FixedDeposit: 0.07, PPF: 0.071,
            LargeCapMF: 0.12, MidCapMF: 0.15, SmallCapMF: 0.18,
            IndexFund: 0.12, DirectStocks: 0.14, Gold: 0.10,
            RealEstate: 0.09, NPS: 0.09, ELSS: 0.13,
          };
          const newInvestment = {
            id: generateId(),
            type,
            name: `${type} Investment`,
            investedAmount: amount,
            currentValue: amount,
            monthlyContribution: 0,
            startMonth: draft.currentMonth,
            returnRate: returnRates[type] || 0.08,
            unrealizedGain: 0,
            isActive: true,
          };
          draft.portfolio.investments.push(newInvestment);
          draft.savings = roundMoney(draft.savings - amount);
          draft.xp += 20;

          draft.toasts.push({
            id: generateId(),
            message: `Invested ₹${amount.toLocaleString('en-IN')} in ${type}!`,
            type: 'success',
          });
        });
      },

      redeemInvestment: (investmentId: string, amount: number) => {
        set((draft) => {
          const inv = draft.portfolio.investments.find((i) => i.id === investmentId);
          if (!inv || !inv.isActive) return;

          const redeemAmount = Math.min(amount, inv.currentValue);
          const ratio = redeemAmount / inv.currentValue;

          inv.currentValue = roundMoney(inv.currentValue - redeemAmount);
          inv.investedAmount = roundMoney(inv.investedAmount * (1 - ratio));
          inv.unrealizedGain = roundMoney(inv.currentValue - inv.investedAmount);

          if (inv.currentValue <= 0) {
            inv.isActive = false;
            inv.monthlyContribution = 0;
          }

          draft.savings = roundMoney(draft.savings + redeemAmount);

          draft.toasts.push({
            id: generateId(),
            message: `Redeemed ₹${redeemAmount.toLocaleString('en-IN')} from ${inv.name}`,
            type: 'info',
          });
        });
      },

      // === Loan Actions ===

      takeLoan: (type: LoanType, principal: number, tenureMonths: number) => {
        set((draft) => {
          const rates: Record<string, number> = {
            HomeLoan: 0.09, CarLoan: 0.10, PersonalLoan: 0.14, EducationLoan: 0.085,
          };
          const rate = rates[type] || 0.12;
          const monthlyRate = rate / 12;
          const emi = roundMoney(
            (principal * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) /
            (Math.pow(1 + monthlyRate, tenureMonths) - 1)
          );

          const newLoan = {
            id: generateId(),
            type,
            name: `${type.replace(/([A-Z])/g, ' $1').trim()}`,
            principal,
            remainingPrincipal: principal,
            interestRate: rate,
            emi,
            tenureMonths,
            remainingMonths: tenureMonths,
            totalInterestPaid: 0,
            isActive: true,
            startMonth: draft.currentMonth,
            monthlyPayments: 0,
            missedPayments: 0,
          };

          draft.loans.push(newLoan);
          draft.savings = roundMoney(draft.savings + principal);
          draft.monthlyExpenses.emiTotal += emi;
          draft.creditScore.score = Math.max(300, draft.creditScore.score - 5);
          draft.xp += 10;

          draft.toasts.push({
            id: generateId(),
            message: `Loan of ₹${principal.toLocaleString('en-IN')} approved! EMI: ₹${emi.toLocaleString('en-IN')}/month`,
            type: 'warning',
          });
        });
      },

      prepayLoan: (loanId: string, amount: number) => {
        set((draft) => {
          const loan = draft.loans.find((l) => l.id === loanId);
          if (!loan || !loan.isActive || draft.savings < amount) return;

          const prepayAmount = Math.min(amount, loan.remainingPrincipal);
          loan.remainingPrincipal = roundMoney(loan.remainingPrincipal - prepayAmount);
          draft.savings = roundMoney(draft.savings - prepayAmount);

          // Recalculate remaining months
          if (loan.remainingPrincipal > 0) {
            const monthlyRate = loan.interestRate / 12;
            const n = Math.log(loan.emi / (loan.emi - loan.remainingPrincipal * monthlyRate)) / Math.log(1 + monthlyRate);
            loan.remainingMonths = Math.ceil(n);
          } else {
            loan.isActive = false;
            loan.remainingMonths = 0;
            draft.monthlyExpenses.emiTotal = roundMoney(draft.monthlyExpenses.emiTotal - loan.emi);
          }

          draft.creditScore.score = Math.min(900, draft.creditScore.score + 3);

          draft.toasts.push({
            id: generateId(),
            message: `Prepaid ₹${prepayAmount.toLocaleString('en-IN')} on your ${loan.name}!`,
            type: 'success',
          });
        });
      },

      // === Insurance Actions ===

      buyInsurance: (type: InsuranceType, coverAmount: number) => {
        set((draft) => {
          let annualPremium: number;
          let name: string;

          if (type === 'HealthInsurance') {
            // Base premium scales with cover amount and age
            annualPremium = roundMoney(coverAmount * 0.017 * (1 + (draft.age - 22) * 0.03));
            name = `Health Insurance - ₹${(coverAmount / 100000).toFixed(0)}L Cover`;
          } else {
            // Term life insurance
            annualPremium = roundMoney(coverAmount * 0.001 * (1 + (draft.age - 22) * 0.05));
            name = `Term Life - ₹${(coverAmount / 10000000).toFixed(0)}Cr Cover`;
          }

          const monthlyPremium = roundMoney(annualPremium / 12);

          const policy = {
            id: generateId(),
            type,
            name,
            coverAmount,
            annualPremium,
            monthlyPremium,
            isActive: true,
            startMonth: draft.currentMonth,
            claimsMade: 0,
          };

          draft.insurance.push(policy);
          draft.monthlyExpenses.insurancePremiums += monthlyPremium;
          draft.xp += 20;

          draft.toasts.push({
            id: generateId(),
            message: `${name} purchased!`,
            type: 'success',
          });
        });
      },

      cancelInsurance: (policyId: string) => {
        set((draft) => {
          const policy = draft.insurance.find((p) => p.id === policyId);
          if (!policy) return;
          policy.isActive = false;
          draft.monthlyExpenses.insurancePremiums = roundMoney(
            draft.monthlyExpenses.insurancePremiums - policy.monthlyPremium
          );
        });
      },

      // === UI Actions ===

      addToast: (toast: Omit<Toast, 'id'>) => {
        set((draft) => {
          draft.toasts.push({ ...toast, id: generateId() });
        });
      },

      removeToast: (id: string) => {
        set((draft) => {
          draft.toasts = draft.toasts.filter((t) => t.id !== id);
        });
      },

      dismissFeedback: () => {
        set((draft) => {
          draft.currentFeedback = [];
          draft.gamePhase = 'decisions';
        });
      },

      // === Computed Getters ===

      getTotalExpenses: () => {
        const state = get();
        const e = state.monthlyExpenses;
        return e.rent + e.food + e.transport + e.utilities + e.lifestyle +
          e.medical + e.emiTotal + e.insurancePremiums + e.parentSupport +
          e.childExpenses + e.miscellaneous;
      },

      getFinancialIndependencePercentage: () => {
        const state = get();
        const annualExpenses = state.getTotalExpenses() * 12;
        if (annualExpenses === 0) return 0;
        const target = annualExpenses * 25; // 4% rule
        return Math.min(100, (state.portfolio.totalCurrentValue / target) * 100);
      },

      getRetirementProgress: () => {
        const state = get();
        // Target: accumulate 25x annual expenses by age 60
        const yearsToRetirement = Math.max(0, 60 - state.age);
        const monthsElapsed = state.currentMonth;
        const totalMonths = (60 - 22) * 12;
        return Math.min(100, (monthsElapsed / totalMonths) * 100);
      },
    })),
    {
      name: 'money-quest-save',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => {
        // Exclude UI-only state from persistence
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { toasts, currentFeedback, ...persistedState } = state;
        return persistedState;
      },
    }
  )
);
