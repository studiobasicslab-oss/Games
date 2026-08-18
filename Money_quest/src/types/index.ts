// ============================================================
// Money Quest — Complete Type System
// ============================================================

// --- Difficulty & Game Phase ---

export type Difficulty = 'easy' | 'normal' | 'hard';

export type GamePhase =
  | 'setup'
  | 'income'
  | 'expenses'
  | 'events'
  | 'decisions'
  | 'feedback'
  | 'summary'
  | 'game_over';

// --- Career ---

export enum CareerTrack {
  IT = 'IT',
  Finance = 'Finance',
  Marketing = 'Marketing',
  Consulting = 'Consulting',
  Government = 'Government',
  Healthcare = 'Healthcare',
  Creative = 'Creative',
  Teaching = 'Teaching',
}

export interface CareerLevel {
  title: string;
  minExperience: number; // months
  salaryMultiplier: number;
}

export interface CareerPath {
  track: CareerTrack;
  name: string;
  description: string;
  icon: string;
  startingSalary: number; // monthly gross
  annualGrowthRate: number; // e.g. 0.10 for 10%
  levels: CareerLevel[];
  skills: string[];
  sideHustlePotential: number; // 0-1
}

export interface Career {
  track: CareerTrack;
  title: string;
  company: string;
  monthlySalary: number;
  experienceMonths: number;
  level: number;
  skills: Record<string, number>; // skill -> 0-100
  isEmployed: boolean;
  monthsSinceLastPromotion: number;
  monthsSinceLastSwitch: number;
  performanceScore: number; // 0-100
}

// --- Investments ---

export enum InvestmentType {
  SavingsAccount = 'SavingsAccount',
  FixedDeposit = 'FixedDeposit',
  PPF = 'PPF',
  LargeCapMF = 'LargeCapMF',
  MidCapMF = 'MidCapMF',
  SmallCapMF = 'SmallCapMF',
  IndexFund = 'IndexFund',
  DirectStocks = 'DirectStocks',
  Gold = 'Gold',
  RealEstate = 'RealEstate',
  NPS = 'NPS',
  ELSS = 'ELSS',
  USStocks = 'USStocks',
  Crypto = 'Crypto',
}

export interface InvestmentOption {
  type: InvestmentType;
  name: string;
  description: string;
  icon: string;
  expectedReturn: number; // annual
  volatility: number; // annual std dev
  minInvestment: number;
  lockInMonths: number;
  liquidity: 'instant' | 'high' | 'medium' | 'low' | 'very_low';
  taxBenefit: boolean;
  riskLevel: 'low' | 'medium' | 'high' | 'very_high';
  category: 'debt' | 'equity' | 'gold' | 'real_estate' | 'hybrid';
  unlockLevel: number;
}

export interface Investment {
  id: string;
  type: InvestmentType;
  name: string;
  investedAmount: number;
  currentValue: number;
  monthlyContribution: number; // for SIPs
  startMonth: number; // game month when started
  returnRate: number; // actual rate achieved
  unrealizedGain: number;
  isActive: boolean;
}

export interface Portfolio {
  investments: Investment[];
  totalInvested: number;
  totalCurrentValue: number;
  totalUnrealizedGain: number;
  assetAllocation: Record<string, number>; // category -> percentage
}

// --- Loans ---

export enum LoanType {
  HomeLoan = 'HomeLoan',
  CarLoan = 'CarLoan',
  PersonalLoan = 'PersonalLoan',
  EducationLoan = 'EducationLoan',
}

export interface Loan {
  id: string;
  type: LoanType;
  name: string;
  principal: number;
  remainingPrincipal: number;
  interestRate: number; // annual
  emi: number;
  tenureMonths: number;
  remainingMonths: number;
  totalInterestPaid: number;
  isActive: boolean;
  startMonth: number;
  monthlyPayments: number; // count of payments made
  missedPayments: number;
}

// --- Insurance ---

export enum InsuranceType {
  HealthInsurance = 'HealthInsurance',
  TermLifeInsurance = 'TermLifeInsurance',
}

export interface InsurancePolicy {
  id: string;
  type: InsuranceType;
  name: string;
  coverAmount: number;
  annualPremium: number;
  monthlyPremium: number;
  isActive: boolean;
  startMonth: number;
  claimsMade: number;
}

// --- Expenses ---

export interface MonthlyExpenses {
  rent: number;
  food: number;
  transport: number;
  utilities: number;
  lifestyle: number;
  medical: number;
  emiTotal: number;
  insurancePremiums: number;
  parentSupport: number;
  childExpenses: number;
  miscellaneous: number;
}

// --- Life State ---

export type HousingType = 'renting' | 'owned_apartment' | 'owned_house';
export type MaritalStatus = 'single' | 'married';
export type TransportMode = 'public' | 'two_wheeler' | 'car_budget' | 'car_premium' | 'car_luxury';
export type LifestyleLevel = 'frugal' | 'moderate' | 'comfortable' | 'premium' | 'luxury';
export type CityTier = 'tier1' | 'tier2';

export interface LifeState {
  housing: HousingType;
  maritalStatus: MaritalStatus;
  children: number;
  transport: TransportMode;
  lifestyle: LifestyleLevel;
  city: CityTier;
  hasEmergencyFund: boolean;
  emergencyFundMonths: number; // months of expenses covered
  emergencyFundAmount: number;
}

// --- Events ---

export type EventCategory =
  | 'career'
  | 'market'
  | 'health'
  | 'family'
  | 'economy'
  | 'windfall'
  | 'lifestyle';

export interface EventEffect {
  salaryChange?: number; // absolute change
  salaryMultiplier?: number; // e.g. 1.15 for 15% raise
  savingsChange?: number;
  expenseChange?: Partial<MonthlyExpenses>;
  investmentImpact?: { type: InvestmentType; multiplier: number }[];
  creditScoreChange?: number;
  xpGain?: number;
  careerLevelChange?: number;
  isEmployed?: boolean;
  description: string;
}

export interface EventChoice {
  id: string;
  label: string;
  description: string;
  effects: EventEffect;
  cost?: number;
}

export interface GameEvent {
  id: string;
  name: string;
  description: string;
  category: EventCategory;
  icon: string;
  baseProbability: number; // 0-1 per month
  preconditions: EventPrecondition[];
  effects?: EventEffect; // direct effects (no choice)
  choices?: EventChoice[]; // player choices
  cooldownMonths: number;
  isChainEvent?: boolean;
  followUpEventId?: string;
  financialExplanation: string;
}

export interface EventPrecondition {
  type: 'minAge' | 'maxAge' | 'minSavings' | 'maxSavings' | 'isEmployed' | 'isMarried' | 'hasChildren' | 'hasLoan' | 'hasCar' | 'hasHouse' | 'minNetWorth' | 'maxNetWorth' | 'minCreditScore' | 'difficulty';
  value: number | boolean | string;
}

// --- Decisions ---

export type DecisionCategory = 'invest' | 'spend' | 'career' | 'life' | 'protect' | 'debt';

export interface Decision {
  id: string;
  category: DecisionCategory;
  label: string;
  description: string;
  icon: string;
  cost?: number;
  monthlyCost?: number;
  effects: EventEffect;
  requirements?: DecisionRequirement[];
  unlockLevel: number;
  financialExplanation: string;
  longTermImpact: string;
}

export interface DecisionRequirement {
  type: 'minSavings' | 'minSalary' | 'minCreditScore' | 'isEmployed' | 'isSingle' | 'isMarried' | 'noExistingLoan' | 'minLevel' | 'maxLoans';
  value: number | boolean;
  label: string;
}

// --- Achievements ---

export type AchievementCategory = 'wealth' | 'investing' | 'debt' | 'career' | 'life' | 'literacy' | 'challenge';

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: AchievementCategory;
  xpReward: number;
  condition: AchievementCondition;
  unlocks?: string;
  isHidden?: boolean;
}

export interface AchievementCondition {
  type: 'netWorth' | 'passiveIncome' | 'debtFree' | 'investmentCount' | 'sipCount' | 'emergencyFund' | 'insuranceCoverage' | 'creditScore' | 'age' | 'fiPercentage' | 'portfolioDiversification' | 'careerLevel' | 'married' | 'children' | 'homeOwner' | 'survivedEvent' | 'totalInvested' | 'retirementReady';
  value: number | boolean;
  comparator?: 'gte' | 'lte' | 'eq';
}

// --- Market State ---

export interface MarketState {
  niftyReturn: number; // current annual return
  marketPhase: 'bull' | 'bear' | 'neutral';
  interestRate: number; // RBI repo rate
  inflationRate: number;
  goldReturn: number;
  realEstateReturn: number;
  marketCycleMonth: number;
  marketCycleLength: number;
}

// --- Credit Score ---

export interface CreditScore {
  score: number; // 300-900
  paymentHistory: number; // 0-100 (35% weight)
  creditUtilization: number; // 0-100 (30% weight)
  creditAge: number; // months (15% weight)
  creditMix: number; // 0-100 (10% weight)
  newCredit: number; // 0-100 (10% weight)
}

// --- Month Snapshot (History) ---

export interface MonthSnapshot {
  month: number; // game month (1-based)
  age: number;
  year: number;
  salary: number;
  totalIncome: number;
  totalExpenses: number;
  netWorth: number;
  savings: number;
  investmentValue: number;
  debtTotal: number;
  cashFlow: number;
  creditScore: number;
  events: string[];
  decisions: string[];
  passiveIncome: number;
  fiPercentage: number;
}

// --- Feedback ---

export interface FeedbackItem {
  id: string;
  title: string;
  description: string;
  impact: string;
  longTermProjection: string;
  type: 'positive' | 'negative' | 'neutral' | 'info';
  icon: string;
  numbers: { label: string; value: string; color: string }[];
}

// --- Toast / Notification ---

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'warning' | 'error' | 'info' | 'achievement';
  duration?: number;
}

// --- Game Config ---

export interface DifficultyConfig {
  inflationRate: number;
  equityReturn: number;
  equityVolatility: number;
  fdRate: number;
  homeLoanRate: number;
  carLoanRate: number;
  salaryGrowthMultiplier: number;
  negativeEventMultiplier: number;
  medicalEmergencyRange: [number, number];
  jobLossProbability: number;
  startingSavings: number;
}

// --- Complete Game State ---

export interface GameState {
  // Core
  currentMonth: number; // total months elapsed since game start
  age: number;
  difficulty: Difficulty;
  gamePhase: GamePhase;
  isGameOver: boolean;
  gameOverReason?: string;

  // Financial
  savings: number;
  monthlyIncome: number;
  monthlyExpenses: MonthlyExpenses;
  netWorth: number;
  cashFlow: number;
  passiveIncome: number;
  annualIncome: number; // for tax calculation

  // Portfolio
  portfolio: Portfolio;

  // Loans
  loans: Loan[];

  // Insurance
  insurance: InsurancePolicy[];

  // Career
  career: Career;

  // Life
  life: LifeState;

  // Credit
  creditScore: CreditScore;

  // Market
  market: MarketState;

  // Progression
  xp: number;
  level: number;
  achievements: string[]; // achievement IDs that have been unlocked
  unlockedFeatures: string[];

  // History
  history: MonthSnapshot[];

  // Current turn state
  currentEvents: GameEvent[];
  currentFeedback: FeedbackItem[];
  pendingDecisions: Decision[];

  // UI State
  toasts: Toast[];
  showTutorial: boolean;
}

// --- Action types for the store ---

export interface GameActions {
  // Game lifecycle
  startNewGame: (difficulty: Difficulty, careerTrack: CareerTrack) => void;
  resetGame: () => void;
  saveGame: () => void;
  loadGame: () => boolean;

  // Turn management
  advanceTurn: () => void;
  setGamePhase: (phase: GamePhase) => void;

  // Player decisions
  makeDecision: (decision: Decision, params?: Record<string, number>) => void;
  resolveEvent: (eventId: string, choiceId?: string) => void;
  dismissEvent: (eventId: string) => void;

  // Investment actions
  startSIP: (type: InvestmentType, monthlyAmount: number) => void;
  lumpSumInvest: (type: InvestmentType, amount: number) => void;
  redeemInvestment: (investmentId: string, amount: number) => void;

  // Loan actions
  takeLoan: (type: LoanType, principal: number, tenureMonths: number) => void;
  prepayLoan: (loanId: string, amount: number) => void;

  // Insurance actions
  buyInsurance: (type: InsuranceType, coverAmount: number) => void;
  cancelInsurance: (policyId: string) => void;

  // UI actions
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
  dismissFeedback: () => void;

  // Computed getters
  getTotalExpenses: () => number;
  getFinancialIndependencePercentage: () => number;
  getRetirementProgress: () => number;
}
