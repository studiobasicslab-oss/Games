'use client';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { formatCurrency, formatPercent } from '@/utils/format';
import { useGameStore } from '@/store/gameStore';

const CATEGORY_COLORS: Record<string, string> = {
  equity: '#10b981', // emerald-500
  debt: '#3b82f6', // blue-500
  gold: '#f59e0b', // amber-500
  real_estate: '#a855f7', // purple-500
  hybrid: '#06b6d4', // cyan-500
};

export default function PortfolioChart() {
  const investments = useGameStore(s => s.portfolio.investments);
  const totalValue = useGameStore(s => s.portfolio.totalCurrentValue);
  
  const categoryTotals: Record<string, number> = {
    equity: 0, debt: 0, gold: 0, real_estate: 0, hybrid: 0
  };
  
  investments.forEach(inv => {
    let cat = 'hybrid';
    if (inv.type.includes('MF') || inv.type === 'DirectStocks' || inv.type === 'IndexFund') cat = 'equity';
    else if (inv.type === 'FixedDeposit' || inv.type === 'PPF' || inv.type === 'SavingsAccount') cat = 'debt';
    else if (inv.type === 'Gold') cat = 'gold';
    else if (inv.type === 'RealEstate') cat = 'real_estate';
    
    categoryTotals[cat] += inv.currentValue;
  });
  
  const data = Object.entries(categoryTotals).map(([cat, val]) => ({
    name: cat.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
    value: val,
    category: cat
  }));

  const chartData = data.filter(d => d.value > 0);

  return (
    <div className="relative w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={70}
            outerRadius={90}
            paddingAngle={2}
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[entry.category] || '#64748b'} stroke="rgba(255,255,255,0.1)" />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '0.5rem', color: '#f1f5f9' }}
            itemStyle={{ color: '#f1f5f9' }}
            formatter={(value: unknown, name: any) => [
              `${formatCurrency(value as number)} (${formatPercent(((value as number)/totalValue)*100)})`, 
              name
            ]}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span className="text-xs text-slate-400 uppercase tracking-wider">Total Value</span>
        <span className="text-lg font-bold text-slate-100">{formatCurrency(totalValue)}</span>
      </div>
    </div>
  );
}
