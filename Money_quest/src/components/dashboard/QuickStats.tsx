'use client';
import GlassCard from '@/components/ui/GlassCard';
import ProgressRing from '@/components/ui/ProgressRing';
import AnimatedNumber from '@/components/ui/AnimatedNumber';
import { Shield, Umbrella, CreditCard, PiggyBank, Target, TrendingUp } from 'lucide-react';
import { formatCurrency, formatPercent } from '@/utils/format';
import { useGameStore } from '@/store/gameStore';

export default function QuickStats() {
  const emergencyFundMonths = useGameStore(s => s.life.emergencyFundMonths);
  const insuranceCoverage = useGameStore(s => s.insurance.reduce((sum, p) => sum + p.coverAmount, 0));
  const creditScore = useGameStore(s => s.creditScore.score);
  const retirementProgress = useGameStore(s => s.getRetirementProgress());
  const fiPercentage = useGameStore(s => s.getFinancialIndependencePercentage());
  const passiveIncome = useGameStore(s => s.passiveIncome);
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full">
      <GlassCard hover className="p-4 flex flex-col gap-3">
        <div className="flex items-center gap-2 text-slate-400 mb-2">
          <Shield className="w-4 h-4 text-emerald-400" />
          <span className="text-xs uppercase tracking-wider">Emergency Fund</span>
        </div>
        <div className="flex items-end gap-1">
          <AnimatedNumber value={emergencyFundMonths} isCurrency={false} className="text-2xl font-bold text-slate-100" />
          <span className="text-sm text-slate-400 mb-1">months</span>
        </div>
        <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
          <div className="h-full bg-emerald-400" style={{ width: `${Math.min((emergencyFundMonths / 6) * 100, 100)}%` }} />
        </div>
      </GlassCard>

      <GlassCard hover className="p-4 flex flex-col gap-3">
        <div className="flex items-center gap-2 text-slate-400 mb-2">
          <Umbrella className="w-4 h-4 text-blue-400" />
          <span className="text-xs uppercase tracking-wider">Insurance</span>
        </div>
        <div className="text-xl font-bold text-slate-100 mt-auto">{formatCurrency(insuranceCoverage)}</div>
      </GlassCard>

      <GlassCard hover className="p-4 flex flex-col items-center justify-between">
        <div className="flex items-center gap-2 text-slate-400 self-start w-full">
          <CreditCard className="w-4 h-4 text-indigo-400" />
          <span className="text-xs uppercase tracking-wider">Credit Score</span>
        </div>
        <ProgressRing progress={(creditScore / 900) * 100} size={80} strokeWidth={6} color="stroke-indigo-400" value={creditScore} />
      </GlassCard>

      <GlassCard hover className="p-4 flex flex-col items-center justify-between">
        <div className="flex items-center gap-2 text-slate-400 self-start w-full">
          <PiggyBank className="w-4 h-4 text-purple-400" />
          <span className="text-xs uppercase tracking-wider">Retirement</span>
        </div>
        <ProgressRing progress={retirementProgress} size={80} strokeWidth={6} color="stroke-purple-400" value={formatPercent(retirementProgress, 0)} />
      </GlassCard>

      <GlassCard hover className="p-4 flex flex-col items-center justify-between">
        <div className="flex items-center gap-2 text-slate-400 self-start w-full">
          <Target className="w-4 h-4 text-rose-400" />
          <span className="text-xs uppercase tracking-wider">FI Progress</span>
        </div>
        <ProgressRing progress={fiPercentage} size={80} strokeWidth={6} color="stroke-rose-400" value={formatPercent(fiPercentage, 0)} />
      </GlassCard>

      <GlassCard hover className="p-4 flex flex-col gap-3">
        <div className="flex items-center gap-2 text-slate-400 mb-2">
          <TrendingUp className="w-4 h-4 text-amber-400" />
          <span className="text-xs uppercase tracking-wider">Passive Income</span>
        </div>
        <div className="flex items-end gap-1 mt-auto">
          <AnimatedNumber value={passiveIncome} className="text-2xl font-bold text-amber-400" />
          <span className="text-xs text-slate-400 mb-1">/mo</span>
        </div>
      </GlassCard>
    </div>
  );
}
