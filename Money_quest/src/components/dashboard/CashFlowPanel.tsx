'use client';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { formatCurrency } from '@/utils/format';
import { useGameStore } from '@/store/gameStore';

export default function CashFlowPanel() {
  const income = useGameStore(s => s.monthlyIncome);
  const expenses = useGameStore(s => s.getTotalExpenses());
  const surplus = income - expenses;
  const data = [
    { name: 'Income', value: income, color: '#10b981' },
    { name: 'Expenses', value: expenses, color: '#f43f5e' }
  ];

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="h-24 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
            <XAxis type="number" hide />
            <YAxis dataKey="name" type="category" width={80} stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
            <Tooltip 
              cursor={{ fill: 'rgba(255,255,255,0.05)' }}
              contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '0.5rem', color: '#f1f5f9' }}
              formatter={(value: unknown) => [formatCurrency(value as number), 'Amount']}
            />
            <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={20}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      <div className="flex justify-between items-center p-3 rounded-lg bg-white/5 border border-white/5">
        <span className="text-sm text-slate-300">Monthly Surplus</span>
        <span className={`font-bold ${surplus >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
          {surplus >= 0 ? '+' : ''}{formatCurrency(surplus)}
        </span>
      </div>
    </div>
  );
}
