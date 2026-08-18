'use client';
import { motion } from 'framer-motion';
import GlassCard from '@/components/ui/GlassCard';
import { FeedbackItem } from '@/types';
import { Check, Info, TrendingUp, AlertTriangle } from 'lucide-react';

import { useGameStore } from '@/store/gameStore';

export default function FeedbackPanel() {
  const currentFeedback = useGameStore(s => s.currentFeedback);
  const dismissFeedback = useGameStore(s => s.dismissFeedback);
  
  const feedback = currentFeedback[0];
  if (!feedback) return null;
  
  const onDismiss = () => dismissFeedback();
  const getIcon = () => {
    switch (feedback.type) {
      case 'positive': return <TrendingUp className="w-8 h-8 text-emerald-400" />;
      case 'negative': return <AlertTriangle className="w-8 h-8 text-rose-400" />;
      default: return <Info className="w-8 h-8 text-blue-400" />;
    }
  };

  const getGlow = () => {
    switch (feedback.type) {
      case 'positive': return 'emerald';
      case 'negative': return 'rose';
      default: return 'cyan';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="w-full max-w-md"
      >
        <GlassCard glow={getGlow()} className="p-6 flex flex-col gap-5">
          <div className="flex items-center gap-4 border-b border-white/10 pb-4">
            <div className="p-3 bg-slate-800 rounded-full border border-white/10">
              {getIcon()}
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-100">{feedback.title}</h3>
              <p className="text-sm text-slate-400">{feedback.description}</p>
            </div>
          </div>

          <div className="flex flex-col gap-3 py-2">
            <span className="text-xs uppercase tracking-wider text-slate-500">Immediate Impact</span>
            <div className="grid grid-cols-2 gap-3">
              {feedback.numbers.map((num, i) => (
                <div key={i} className="bg-white/5 rounded-lg p-3 flex flex-col">
                  <span className="text-xs text-slate-400 mb-1">{num.label}</span>
                  <span className={`font-bold ${num.color}`}>{num.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 mt-2">
            <span className="text-xs uppercase tracking-wider text-blue-400 block mb-1">Long-term Projection</span>
            <p className="text-sm text-slate-300">{feedback.longTermProjection}</p>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onDismiss}
            className="w-full mt-2 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold transition-colors flex items-center justify-center gap-2"
          >
            Got it <Check className="w-4 h-4" />
          </motion.button>
        </GlassCard>
      </motion.div>
    </div>
  );
}
