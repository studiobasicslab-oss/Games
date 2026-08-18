'use client';

import { useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useGameStore } from '@/store/gameStore';
import StatusBar from '@/components/dashboard/StatusBar';
import PortfolioChart from '@/components/dashboard/PortfolioChart';
import NetWorthChart from '@/components/dashboard/NetWorthChart';
import CashFlowPanel from '@/components/dashboard/CashFlowPanel';
import QuickStats from '@/components/dashboard/QuickStats';
import ExpenseBreakdown from '@/components/dashboard/ExpenseBreakdown';
import MonthSummary from '@/components/game/MonthSummary';
import DecisionPanel from '@/components/game/DecisionPanel';
import EventModal from '@/components/game/EventModal';
import FeedbackPanel from '@/components/game/FeedbackPanel';
import GameOverScreen from '@/components/game/GameOverScreen';
import ToastComponent from '@/components/ui/Toast';
import { getMonthName } from '@/utils/format';

export default function GamePage() {
  const router = useRouter();
  const gamePhase = useGameStore((s) => s.gamePhase);
  const isGameOver = useGameStore((s) => s.isGameOver);
  const currentMonth = useGameStore((s) => s.currentMonth);
  const age = useGameStore((s) => s.age);
  const advanceTurn = useGameStore((s) => s.advanceTurn);
  const setGamePhase = useGameStore((s) => s.setGamePhase);
  const currentEvents = useGameStore((s) => s.currentEvents);
  const currentFeedback = useGameStore((s) => s.currentFeedback);
  const toasts = useGameStore((s) => s.toasts);
  const removeToast = useGameStore((s) => s.removeToast);

  // Redirect to home if no game started
  useEffect(() => {
    if (gamePhase === 'setup') {
      router.push('/');
    }
  }, [gamePhase, router]);

  // Phase transition handler
  const handleNextPhase = useCallback(() => {
    switch (gamePhase) {
      case 'income':
        setGamePhase('expenses');
        break;
      case 'expenses':
        // Generate events (simplified - in full game, event engine handles this)
        if (currentEvents.length > 0) {
          setGamePhase('events');
        } else {
          setGamePhase('decisions');
        }
        break;
      case 'events':
        setGamePhase('decisions');
        break;
      case 'decisions':
        // Player made decisions, now process the turn
        advanceTurn();
        break;
      case 'feedback':
        setGamePhase('decisions');
        break;
      case 'summary':
        // Start next month
        setGamePhase('income');
        break;
      default:
        break;
    }
  }, [gamePhase, advanceTurn, setGamePhase, currentEvents.length]);

  const monthInYear = ((currentMonth - 1) % 12) + 1;
  const year = 2024 + Math.floor((currentMonth - 1) / 12);

  if (gamePhase === 'setup') return null;

  return (
    <div className="min-h-screen bg-[#030712] pb-8">
      {/* Toast notifications */}
      <ToastComponent toasts={toasts} onDismiss={removeToast} />

      {/* Status Bar - Always visible */}
      <StatusBar />

      {/* Game Over Screen */}
      <AnimatePresence>
        {isGameOver && <GameOverScreen />}
      </AnimatePresence>

      {/* Event Modal */}
      <AnimatePresence>
        {gamePhase === 'events' && currentEvents.length > 0 && (
          <EventModal />
        )}
      </AnimatePresence>

      {/* Feedback Panel */}
      <AnimatePresence>
        {gamePhase === 'feedback' && currentFeedback.length > 0 && (
          <FeedbackPanel />
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 pt-4">
        {/* Month indicator */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-6"
        >
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <h2 className="text-sm font-medium text-slate-400">
              {getMonthName(monthInYear)} {year} · Age {age}
            </h2>
            <span className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-slate-500 border border-white/5">
              Month {currentMonth}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className={`text-xs px-3 py-1 rounded-full font-medium ${
              gamePhase === 'income' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
              gamePhase === 'expenses' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' :
              gamePhase === 'events' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
              gamePhase === 'decisions' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
              gamePhase === 'feedback' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' :
              'bg-slate-500/10 text-slate-400 border border-slate-500/20'
            }`}>
              {gamePhase === 'income' && '💰 Income Phase'}
              {gamePhase === 'expenses' && '💸 Expenses Phase'}
              {gamePhase === 'events' && '🎲 Life Event!'}
              {gamePhase === 'decisions' && '🤔 Decision Time'}
              {gamePhase === 'feedback' && '📊 Impact Analysis'}
              {gamePhase === 'summary' && '📋 Month Summary'}
            </span>
          </div>
        </motion.div>

        {/* Phase Content */}
        <AnimatePresence mode="wait">
          {/* Summary Phase */}
          {gamePhase === 'summary' && (
            <motion.div
              key="summary"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <MonthSummary onContinue={handleNextPhase} />
            </motion.div>
          )}

          {/* Decision Phase */}
          {gamePhase === 'decisions' && (
            <motion.div
              key="decisions"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <DecisionPanel onEndTurn={handleNextPhase} />
            </motion.div>
          )}

          {/* Income / Expenses / Default - Show Dashboard */}
          {(gamePhase === 'income' || gamePhase === 'expenses') && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {/* Dashboard Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
                {/* Portfolio Chart */}
                <div className="glass p-4">
                  <h3 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
                    <span className="text-base">📊</span> Portfolio Allocation
                  </h3>
                  <PortfolioChart />
                </div>

                {/* Net Worth Chart */}
                <div className="glass p-4 lg:col-span-2">
                  <h3 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
                    <span className="text-base">📈</span> Net Worth Over Time
                  </h3>
                  <NetWorthChart />
                </div>
              </div>

              {/* Second Row */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
                <div className="glass p-4">
                  <h3 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
                    <span className="text-base">💸</span> Cash Flow
                  </h3>
                  <CashFlowPanel />
                </div>
                <div className="glass p-4">
                  <h3 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
                    <span className="text-base">🧾</span> Expense Breakdown
                  </h3>
                  <ExpenseBreakdown />
                </div>
              </div>

              {/* Quick Stats */}
              <QuickStats />

              {/* Continue Button */}
              <div className="mt-6 flex justify-center">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleNextPhase}
                  className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 transition-shadow"
                >
                  {gamePhase === 'income' ? 'Review Expenses →' : 'Make Decisions →'}
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
