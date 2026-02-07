import React, { useState } from 'react';
import { MarketBid } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { Coins, TrendingUp, Zap, IndianRupee } from 'lucide-react';

export const RevenueOptimizer: React.FC = () => {
  const [strategy, setStrategy] = useState<'BALANCED' | 'AGGRESSIVE_ARBITRAGE' | 'FIRM_CONTRACT'>('BALANCED');

  // Mock Market Bids
  const bids: MarketBid[] = [
    { timeBlock: '10:00', quantityMW: 150, priceINR: 3.5, type: 'DAM', status: 'ACCEPTED' },
    { timeBlock: '10:15', quantityMW: 160, priceINR: 3.4, type: 'DAM', status: 'ACCEPTED' },
    { timeBlock: '18:00', quantityMW: 200, priceINR: 8.5, type: 'RTM', status: 'PENDING' },
    { timeBlock: '18:15', quantityMW: 200, priceINR: 9.1, type: 'RTM', status: 'PENDING' },
    { timeBlock: '19:00', quantityMW: 50, priceINR: 12.0, type: 'ANCILLARY', status: 'PENDING' },
  ];

  const financialData = [
    { name: 'Solar PPA', value: 450, color: '#fbbf24' },
    { name: 'BESS Arbitrage', value: 320, color: '#3b82f6' },
    { name: 'H2 Sales', value: 150, color: '#06b6d4' },
    { name: 'Ancillary', value: 80, color: '#a855f7' },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
      {/* Strategy Control Panel */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 flex flex-col space-y-6">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2 mb-2">
            <Coins className="text-amber-500" />
            Revenue Stack
          </h2>
          <p className="text-slate-400 text-sm">
            AI-driven multi-market optimization targeting IRR 14-16%.
          </p>
        </div>

        <div className="space-y-4">
          <label className="block text-sm font-medium text-slate-300">Active Bidding Strategy</label>
          <div className="grid grid-cols-1 gap-2">
            <button 
              onClick={() => setStrategy('FIRM_CONTRACT')}
              className={`p-3 rounded-lg border text-left transition-all ${strategy === 'FIRM_CONTRACT' ? 'bg-emerald-500/20 border-emerald-500 text-emerald-100' : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-500'}`}
            >
              <div className="font-semibold text-sm">Firm Power (SECI)</div>
              <div className="text-xs opacity-70">Strict 200MW flat profile. Low risk, moderate return.</div>
            </button>
            <button 
              onClick={() => setStrategy('BALANCED')}
              className={`p-3 rounded-lg border text-left transition-all ${strategy === 'BALANCED' ? 'bg-blue-500/20 border-blue-500 text-blue-100' : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-500'}`}
            >
              <div className="font-semibold text-sm">Hybrid Balanced</div>
              <div className="text-xs opacity-70">Base load + Peak shifting. H2 overflow enabled.</div>
            </button>
            <button 
              onClick={() => setStrategy('AGGRESSIVE_ARBITRAGE')}
              className={`p-3 rounded-lg border text-left transition-all ${strategy === 'AGGRESSIVE_ARBITRAGE' ? 'bg-purple-500/20 border-purple-500 text-purple-100' : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-500'}`}
            >
              <div className="font-semibold text-sm">Max Arbitrage (IEX)</div>
              <div className="text-xs opacity-70">Chase price spikes. Higher risk, max potential yield.</div>
            </button>
          </div>
        </div>

        <div className="bg-slate-900 rounded-lg p-4 mt-auto">
            <div className="flex justify-between items-center mb-2">
                <span className="text-slate-400 text-sm">Current IEX Clearing Price</span>
                <span className="text-green-400 font-bold text-lg">₹ 4.85 / kWh</span>
            </div>
            <div className="flex justify-between items-center">
                <span className="text-slate-400 text-sm">Predicted Evening Peak</span>
                <span className="text-amber-400 font-bold text-lg">₹ 11.20 / kWh</span>
            </div>
        </div>
      </div>

      {/* Revenue Breakdown Chart */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 flex flex-col col-span-2">
        <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <IndianRupee size={18} />
            Daily Revenue Mix (Projected)
        </h3>
        <ResponsiveContainer width="100%" height={300}>
            <BarChart data={financialData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={false} />
                <XAxis type="number" stroke="#94a3b8" unit="k" />
                <YAxis dataKey="name" type="category" stroke="#e2e8f0" width={100} />
                <Tooltip cursor={{fill: '#334155'}} contentStyle={{ backgroundColor: '#1e293b', borderColor: '#475569', color: '#f8fafc' }} />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                    {financialData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                </Bar>
            </BarChart>
        </ResponsiveContainer>

        <div className="mt-6">
            <h4 className="text-sm font-semibold text-slate-400 mb-3">Live Bids (Real-Time Market)</h4>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-slate-300">
                    <thead className="text-xs text-slate-500 uppercase bg-slate-900">
                        <tr>
                            <th className="px-4 py-2">Time Block</th>
                            <th className="px-4 py-2">Type</th>
                            <th className="px-4 py-2">Quantity</th>
                            <th className="px-4 py-2">Bid Price</th>
                            <th className="px-4 py-2">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bids.map((bid, i) => (
                            <tr key={i} className="border-b border-slate-700 hover:bg-slate-700/50">
                                <td className="px-4 py-2 font-mono">{bid.timeBlock}</td>
                                <td className="px-4 py-2">
                                    <span className={`px-2 py-0.5 rounded text-xs ${bid.type === 'DAM' ? 'bg-blue-900 text-blue-300' : bid.type === 'RTM' ? 'bg-amber-900 text-amber-300' : 'bg-purple-900 text-purple-300'}`}>
                                        {bid.type}
                                    </span>
                                </td>
                                <td className="px-4 py-2">{bid.quantityMW} MW</td>
                                <td className="px-4 py-2">₹ {bid.priceINR}</td>
                                <td className="px-4 py-2">
                                    <span className={`text-xs font-bold ${bid.status === 'ACCEPTED' ? 'text-emerald-400' : 'text-slate-400'}`}>
                                        {bid.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
      </div>
    </div>
  );
};
