'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Decision } from '@/types';
import DecisionCard from './DecisionCard';

import { useGameStore } from '@/store/gameStore';
import { DECISIONS } from '@/data/decisions';
import { ArrowRight } from 'lucide-react';

interface Props {
  onEndTurn: () => void;
}

const TABS = ['Invest', 'Spend', 'Career', 'Life', 'Protect', 'Debt'];

export default function DecisionPanel({ onEndTurn }: Props) {
  const playerLevel = useGameStore(s => s.level);
  const makeDecision = useGameStore(s => s.makeDecision);
  
  const onSelect = (decision: Decision) => {
    makeDecision(decision);
  };
  const [activeTab, setActiveTab] = useState(TABS[0].toLowerCase());

  const filteredDecisions = DECISIONS.filter(d => d.category === activeTab);

  return (
    <div className="flex flex-col gap-6 h-full w-full">
      <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-hide">
        {TABS.map(tab => {
          const isActive = activeTab === tab.toLowerCase();
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab.toLowerCase())}
              className={`relative px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
                isActive ? 'text-slate-900' : 'text-slate-400 hover:text-slate-200 bg-white/5'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-emerald-400 rounded-full"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span className="relative z-10">{tab}</span>
            </button>
          );
        })}
      </div>

      <div className="flex-1 overflow-y-auto pr-2 pb-20">
        <AnimatePresence mode="popLayout">
          <motion.div 
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {filteredDecisions.length > 0 ? (
              filteredDecisions.map(decision => {
                const isLocked = decision.unlockLevel > playerLevel;
                return (
                  <DecisionCard 
                    key={decision.id} 
                    decision={decision} 
                    onSelect={() => onSelect(decision)} 
                    isLocked={isLocked}
                    lockReason={isLocked ? `Unlocks at Level ${decision.unlockLevel}` : undefined}
                  />
                );
              })
            ) : (
              <div className="col-span-full py-12 text-center text-slate-500">
                No decisions available in this category yet.
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex justify-center mt-2">
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={onEndTurn}
          className="px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 transition-shadow flex items-center gap-2"
        >
          End Turn <ArrowRight className="w-5 h-5" />
        </motion.button>
      </div>
    </div>
  );
}
