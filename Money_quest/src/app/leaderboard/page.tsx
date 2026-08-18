"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { formatCurrency } from "@/utils/format";

type LeaderboardEntry = {
  id: string;
  finalNetWorth: number;
  highestFI: number;
  completedAt: string;
  user: {
    name: string | null;
    image: string | null;
  };
};

export default function LeaderboardPage() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/leaderboard")
      .then(res => res.json())
      .then(data => {
        if (data.leaderboard) {
          setEntries(data.leaderboard);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-emerald-200">
              Global Leaderboard
            </h1>
            <p className="text-slate-400 mt-2">Top players by final Net Worth at Age 60</p>
          </div>
          <Link href="/" className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm font-medium transition-colors">
            Back to Home
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-20 text-slate-500">Loading top players...</div>
        ) : (
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden backdrop-blur-xl">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-800 text-left text-sm font-medium text-slate-400">
                  <th className="py-4 px-6">Rank</th>
                  <th className="py-4 px-6">Player</th>
                  <th className="py-4 px-6 text-right">Final Net Worth</th>
                  <th className="py-4 px-6 text-right">Highest FI%</th>
                </tr>
              </thead>
              <tbody>
                {entries.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-12 text-center text-slate-500">
                      No entries yet. Be the first to complete a game!
                    </td>
                  </tr>
                ) : (
                  entries.map((entry, index) => (
                    <tr key={entry.id} className="border-b border-slate-800/50 hover:bg-slate-800/20 transition-colors">
                      <td className="py-4 px-6">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm
                          ${index === 0 ? 'bg-amber-500/20 text-amber-400' : 
                            index === 1 ? 'bg-slate-300/20 text-slate-300' : 
                            index === 2 ? 'bg-amber-700/20 text-amber-600' : 
                            'bg-slate-800 text-slate-400'}`}>
                          #{index + 1}
                        </div>
                      </td>
                      <td className="py-4 px-6 font-medium text-slate-200">
                        {entry.user.name || "Anonymous Player"}
                      </td>
                      <td className="py-4 px-6 text-right font-mono text-emerald-400 font-medium">
                        {formatCurrency(entry.finalNetWorth)}
                      </td>
                      <td className="py-4 px-6 text-right text-slate-300">
                        {entry.highestFI.toFixed(1)}%
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
