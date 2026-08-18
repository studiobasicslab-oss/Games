'use client';
import { motion } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';
import GlassCard from '@/components/ui/GlassCard';
import AnimatedNumber from '@/components/ui/AnimatedNumber';
import Badge from '@/components/ui/Badge';
import { Trophy, RefreshCcw, Award } from 'lucide-react';
import { formatCurrency, formatPercent } from '@/utils/format';
import { useEffect, useState } from 'react';
import Link from 'next/link';
export default function GameOverScreen() {
  const gameState = useGameStore();
  const resetGame = useGameStore(s => s.resetGame);
  const { netWorth, passiveIncome, achievements, history, age, monthlyExpenses } = gameState;
  const score = Math.min(100, Math.floor((netWorth / 10000000) * 50 + (passiveIncome / 100000) * 50));
  
  const expensesTotal = monthlyExpenses ? Object.values(monthlyExpenses).reduce((a, b) => a + b, 0) : 1;
  const fiPercent = (passiveIncome / expensesTotal) * 100;

  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!submitted) {
      fetch('/api/leaderboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ finalNetWorth: netWorth, highestFI: fiPercent })
      }).catch(err => console.error("Failed to submit score:", err))
        .finally(() => setSubmitted(true));
    }
  }, [submitted, netWorth, fiPercent]);
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950 overflow-y-auto py-12 px-4">
      {/* Particle background simulation */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-slate-950 opacity-80" />
      
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-4xl relative z-10 flex flex-col gap-8"
      >
        <div className="text-center flex flex-col items-center gap-4">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.5, bounce: 0.5 }}
            className="w-24 h-24 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(245,158,11,0.5)]"
          >
            <Trophy className="w-12 h-12 text-slate-900" />
          </motion.div>
          <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-500">
            Journey Complete
          </h1>
          <p className="text-xl text-slate-400">Your financial life simulation has ended.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <GlassCard glow="emerald" className="p-8 flex flex-col items-center text-center">
            <span className="text-sm text-slate-400 uppercase tracking-wider mb-2">Final Net Worth</span>
            <AnimatedNumber value={netWorth} duration={2} className="text-5xl font-bold text-emerald-400" />
          </GlassCard>
          
          <GlassCard glow="amber" className="p-8 flex flex-col items-center text-center">
            <span className="text-sm text-slate-400 uppercase tracking-wider mb-2">Financial Score</span>
            <div className="flex items-end gap-2">
              <AnimatedNumber value={score} isCurrency={false} duration={2} className="text-5xl font-bold text-amber-400" />
              <span className="text-2xl text-slate-500 font-bold mb-1">/ 100</span>
            </div>
          </GlassCard>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <GlassCard className="p-6 flex flex-col items-center">
            <span className="text-slate-400 mb-1">Passive Income</span>
            <span className="text-2xl font-bold text-slate-200">{formatCurrency(passiveIncome)}/mo</span>
          </GlassCard>
          <GlassCard className="p-6 flex flex-col items-center">
            <span className="text-slate-400 mb-1">FI Reached</span>
            <span className="text-2xl font-bold text-slate-200">{formatPercent(fiPercent)}</span>
          </GlassCard>
          <GlassCard className="p-6 flex flex-col items-center">
            <span className="text-slate-400 mb-1">Age</span>
            <span className="text-2xl font-bold text-slate-200">{age} yrs</span>
          </GlassCard>
        </div>

        <div className="flex justify-center gap-4 mt-8">
          <Link
            href="/leaderboard"
            className="px-8 py-4 bg-slate-800 text-slate-200 rounded-full font-bold text-lg flex items-center gap-3 hover:bg-slate-700 transition-colors shadow-xl"
          >
            <Award className="w-5 h-5" /> View Leaderboard
          </Link>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => resetGame()}
            className="px-8 py-4 bg-white text-slate-900 rounded-full font-bold text-lg flex items-center gap-3 hover:bg-slate-200 transition-colors shadow-xl"
          >
            <RefreshCcw className="w-5 h-5" /> Start New Journey
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
