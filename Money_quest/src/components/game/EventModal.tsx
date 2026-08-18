'use client';
import { motion } from 'framer-motion';
import GlassCard from '@/components/ui/GlassCard';
import { GameEvent, EventChoice } from '@/types';

import { useGameStore } from '@/store/gameStore';

export default function EventModal() {
  const currentEvents = useGameStore((s) => s.currentEvents);
  const resolveEvent = useGameStore((s) => s.resolveEvent);
  
  const event = currentEvents[0];
  if (!event) return null;

  const onSelectChoice = (choiceId?: string) => {
    resolveEvent(event.id, choiceId);
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="w-full max-w-lg"
      >
        <GlassCard className="p-8 flex flex-col items-center text-center gap-6 border-amber-500/30 shadow-[0_0_40px_rgba(245,158,11,0.15)]">
          <div className="text-6xl mb-2">{event.icon}</div>
          
          <div>
            <h2 className="text-3xl font-bold text-slate-100 mb-3">{event.name}</h2>
            <p className="text-slate-300 text-lg leading-relaxed">{event.description}</p>
          </div>

          <div className="w-full bg-slate-900/50 rounded-xl p-4 border border-white/5 text-sm text-slate-400 mt-2">
            {event.financialExplanation}
          </div>

          <div className="w-full flex flex-col gap-3 mt-4">
            {event.choices && event.choices.length > 0 ? (
              event.choices.map((choice: EventChoice) => (
                <motion.button
                  key={choice.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onSelectChoice(choice.id)}
                  className="w-full p-4 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-left transition-colors flex flex-col gap-1"
                >
                  <span className="font-bold text-slate-200">{choice.label}</span>
                  <span className="text-xs text-slate-400">{choice.description}</span>
                </motion.button>
              ))
            ) : (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onSelectChoice()}
                className="w-full p-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition-colors"
              >
                Acknowledge
              </motion.button>
            )}
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
}
