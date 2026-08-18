'use client';
import { useGameStore } from '@/store/gameStore';
import AnimatedNumber from '@/components/ui/AnimatedNumber';
import GlassCard from '@/components/ui/GlassCard';
import { monthToAge, getMonthShort } from '@/utils/format';
import { motion } from 'framer-motion';
import { Volume2, VolumeX } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function StatusBar() {
  const currentMonth = useGameStore((state) => state.currentMonth);
  const monthlyIncome = useGameStore((state) => state.monthlyIncome);
  const netWorth = useGameStore((state) => state.netWorth);
  const cashFlow = useGameStore((state) => state.cashFlow);
  const creditScore = useGameStore((state) => state.creditScore);

  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    setIsMuted(localStorage.getItem('moneyquest_muted') === 'true');
  }, []);

  const toggleMute = () => {
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    localStorage.setItem('moneyquest_muted', newMuted.toString());
  };

  if (currentMonth === undefined) return null;
  const { age, month, year } = monthToAge(currentMonth);
  const monthProgress = (month / 12) * 100;

  return (
    <GlassCard className="flex items-center justify-between px-6 py-4 rounded-xl sticky top-4 z-40">
      <div className="flex flex-col">
        <span className="text-xs text-slate-400 uppercase tracking-wider mb-1">Time</span>
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold text-slate-100">{age} yrs</span>
          <span className="text-sm text-slate-300 bg-white/10 px-2 py-0.5 rounded">{getMonthShort(month)} '{year.toString().slice(-2)}</span>
        </div>
        <div className="w-32 h-1 bg-white/10 rounded-full mt-2 overflow-hidden">
          <motion.div 
            className="h-full bg-blue-400"
            initial={{ width: 0 }}
            animate={{ width: `${monthProgress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      <div className="w-px h-10 bg-white/10 hidden md:block"></div>

      <div className="flex flex-col items-center">
        <span className="text-xs text-slate-400 uppercase tracking-wider mb-1">Monthly Salary</span>
        <AnimatedNumber value={monthlyIncome} className="text-lg font-semibold text-emerald-400" />
      </div>

      <div className="w-px h-10 bg-white/10 hidden md:block"></div>

      <div className="flex flex-col items-center">
        <span className="text-xs text-slate-400 uppercase tracking-wider mb-1">Net Worth</span>
        <AnimatedNumber value={netWorth} className="text-xl font-bold text-amber-400" />
      </div>

      <div className="w-px h-10 bg-white/10 hidden md:block"></div>

      <div className="flex flex-col items-center">
        <span className="text-xs text-slate-400 uppercase tracking-wider mb-1">Cash Flow</span>
        <AnimatedNumber value={cashFlow} prefix={cashFlow >= 0 ? '+' : ''} className={`text-lg font-semibold ${cashFlow >= 0 ? 'text-emerald-400' : 'text-rose-400'}`} />
      </div>

      <div className="w-px h-10 bg-white/10 hidden md:block"></div>

      <div className="flex flex-col items-end">
        <span className="text-xs text-slate-400 uppercase tracking-wider mb-1">Credit Score</span>
        <div className="flex items-center gap-4">
          <AnimatedNumber value={creditScore.score} isCurrency={false} className="text-xl font-bold text-blue-400" />
          <button 
            onClick={toggleMute}
            className="p-2 bg-slate-800/50 hover:bg-slate-700/50 rounded-lg text-slate-400 transition-colors"
            title={isMuted ? "Unmute sounds" : "Mute sounds"}
          >
            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </GlassCard>
  );
}
