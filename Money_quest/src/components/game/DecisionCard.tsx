'use client';
import { motion } from 'framer-motion';
import GlassCard from '@/components/ui/GlassCard';
import { Decision } from '@/types';
import { Lock, Info } from 'lucide-react';
import { formatCurrency } from '@/utils/format';
import Tooltip from '@/components/ui/Tooltip';

interface Props {
  decision: Decision;
  onSelect: () => void;
  isLocked?: boolean;
  lockReason?: string;
}

export default function DecisionCard({ decision, onSelect, isLocked = false, lockReason }: Props) {
  return (
    <GlassCard 
      hover={!isLocked} 
      onClick={isLocked ? undefined : onSelect}
      className={`relative p-5 flex flex-col gap-3 h-full transition-all ${isLocked ? 'opacity-50 grayscale cursor-not-allowed' : 'cursor-pointer hover:border-emerald-500/30'}`}
    >
      <div className="flex items-start justify-between">
        <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-2xl border border-white/10">
          {decision.icon}
        </div>
        {isLocked && <Lock className="w-5 h-5 text-slate-500" />}
      </div>
      
      <div>
        <h3 className="font-bold text-slate-100 mb-1">{decision.label}</h3>
        <p className="text-xs text-slate-400 line-clamp-2">{decision.description}</p>
      </div>

      <div className="mt-auto pt-4 flex items-center justify-between border-t border-white/5">
        <div className="flex flex-col">
          <span className="text-[10px] text-slate-500 uppercase">Cost</span>
          <span className="font-semibold text-rose-400">
            {decision.cost ? formatCurrency(decision.cost) : (decision.monthlyCost ? `${formatCurrency(decision.monthlyCost)}/mo` : 'Free')}
          </span>
        </div>
        
        {!isLocked && (
          <Tooltip content={decision.financialExplanation} position="top">
            <div className="p-1.5 rounded-full bg-white/5 text-slate-400 hover:text-slate-200 transition-colors">
              <Info className="w-4 h-4" />
            </div>
          </Tooltip>
        )}
      </div>

      {isLocked && lockReason && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-slate-950/40 backdrop-blur-[2px] rounded-2xl opacity-0 hover:opacity-100 transition-opacity">
          <Lock className="w-8 h-8 text-amber-400 mb-2" />
          <span className="text-sm font-medium text-slate-200 bg-slate-900/80 px-3 py-1 rounded-full">{lockReason}</span>
        </div>
      )}
    </GlassCard>
  );
}
