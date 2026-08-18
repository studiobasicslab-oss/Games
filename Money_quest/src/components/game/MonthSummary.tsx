'use client';
import { motion } from 'framer-motion';
import GlassCard from '@/components/ui/GlassCard';
import { formatCurrency } from '@/utils/format';
import { ArrowRight } from 'lucide-react';

import { useGameStore } from '@/store/gameStore';

interface Props {
  onContinue: () => void;
}

export default function MonthSummary({ onContinue }: Props) {
  const history = useGameStore(s => s.history);
  const lastHistory = history[history.length - 1];
  
  if (!lastHistory) return null;
  
  const income = lastHistory.totalIncome;
  const expenses = lastHistory.totalExpenses;
  const events = lastHistory.events || [];
  
  const netWorthChange = history.length > 1 
    ? lastHistory.netWorth - history[history.length - 2].netWorth 
    : lastHistory.netWorth - 500000;
    
  const investmentChange = history.length > 1
    ? lastHistory.investmentValue - history[history.length - 2].investmentValue
    : lastHistory.investmentValue;
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const item = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0 }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-md"
      >
        <GlassCard className="p-6 flex flex-col gap-6">
          <h2 className="text-2xl font-bold text-slate-100 text-center">Month Summary</h2>
          
          <motion.div variants={container} initial="hidden" animate="show" className="flex flex-col gap-4">
            <motion.div variants={item} className="flex justify-between items-center pb-2 border-b border-white/5">
              <span className="text-slate-400">Income Received</span>
              <span className="text-emerald-400 font-semibold">+{formatCurrency(income)}</span>
            </motion.div>
            
            <motion.div variants={item} className="flex justify-between items-center pb-2 border-b border-white/5">
              <span className="text-slate-400">Expenses Paid</span>
              <span className="text-rose-400 font-semibold">-{formatCurrency(expenses)}</span>
            </motion.div>
            
            <motion.div variants={item} className="flex justify-between items-center pb-2 border-b border-white/5">
              <span className="text-slate-400">Investment Returns</span>
              <span className={`font-semibold ${investmentChange >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {investmentChange >= 0 ? '+' : ''}{formatCurrency(investmentChange)}
              </span>
            </motion.div>

            {events.length > 0 && (
              <motion.div variants={item} className="pb-2 border-b border-white/5">
                <span className="text-slate-400 block mb-2">Events Occurred</span>
                <ul className="list-disc pl-4 text-sm text-slate-300">
                  {events.map((e, i) => <li key={i}>{e}</li>)}
                </ul>
              </motion.div>
            )}
            
            <motion.div variants={item} className="flex justify-between items-center pt-2 mt-2">
              <span className="text-lg font-bold text-slate-200">Net Worth Change</span>
              <span className={`text-xl font-bold ${netWorthChange >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {netWorthChange >= 0 ? '+' : ''}{formatCurrency(netWorthChange)}
              </span>
            </motion.div>
          </motion.div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onContinue}
            className="w-full mt-4 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold flex items-center justify-center gap-2 transition-colors"
          >
            Continue to Next Month <ArrowRight className="w-5 h-5" />
          </motion.button>
        </GlassCard>
      </motion.div>
    </div>
  );
}
