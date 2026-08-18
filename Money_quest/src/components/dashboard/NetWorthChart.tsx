'use client';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { formatCurrency, formatCompact } from '@/utils/format';
import { useGameStore } from '@/store/gameStore';

export default function NetWorthChart() {
  const history = useGameStore(s => s.history);
  if (!history || history.length === 0) return null;

  const data = history.map(h => ({
    age: h.age,
    netWorth: h.netWorth,
    month: h.month
  }));

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorNetWorth" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <XAxis 
            dataKey="age" 
            tickFormatter={(val) => `${val}y`} 
            stroke="#475569" 
            tick={{ fill: '#94a3b8', fontSize: 12 }} 
            tickMargin={10}
            axisLine={false}
          />
          <YAxis 
            tickFormatter={(val) => formatCompact(val)} 
            stroke="#475569" 
            tick={{ fill: '#94a3b8', fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            width={50}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '0.5rem' }}
            labelStyle={{ color: '#94a3b8', marginBottom: '0.25rem' }}
            labelFormatter={(label) => `Age ${label}`}
            formatter={(value: unknown) => [formatCurrency(value as number), 'Net Worth']}
          />
          <ReferenceLine y={10000000} stroke="#a855f7" strokeDasharray="3 3" label={{ value: '₹1Cr', fill: '#a855f7', position: 'insideTopLeft' }} />
          <Area type="monotone" dataKey="netWorth" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorNetWorth)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
