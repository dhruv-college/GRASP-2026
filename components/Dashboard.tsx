import React, { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Activity, Battery, Sun, Droplets, Zap, TrendingUp, AlertTriangle, Info } from 'lucide-react';
import { AssetStatus, TimeSeriesPoint } from '../types';

interface DashboardProps {
  data: TimeSeriesPoint[];
  assets: AssetStatus[];
}

export const Dashboard: React.FC<DashboardProps> = ({ data, assets }) => {
  
  const currentTotalExport = useMemo(() => {
    const lastPoint = data[data.length - 1];
    return lastPoint ? lastPoint.gridExportMW : 0;
  }, [data]);

  const currentRevenue = useMemo(() => {
    // Rough estimation of daily revenue so far
    return data.reduce((acc, curr) => acc + (curr.gridExportMW * (curr.marketPriceINR / 1000)), 0); 
  }, [data]);

  const bessAsset = assets.find(a => a.type === 'BESS');
  const h2Asset = assets.find(a => a.type === 'H2');

  const StatCard = ({ title, value, unit, icon: Icon, color, subtext, tooltipData }: any) => (
    <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 shadow-sm relative overflow-hidden group">
      <div className={`absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity ${color}`}>
        <Icon size={64} />
      </div>
      <div className="flex items-center space-x-3 mb-2">
        <div className={`p-2 rounded-lg ${color} bg-opacity-20 text-white`}>
          <Icon size={20} />
        </div>
        <h3 className="text-slate-400 text-sm font-medium">{title}</h3>
      </div>
      <div className="text-2xl font-bold text-slate-100">
        {value} <span className="text-sm font-normal text-slate-400">{unit}</span>
      </div>
      {subtext && <div className="text-xs text-slate-500 mt-1">{subtext}</div>}

      {/* Hover Tooltip Overlay */}
      {tooltipData && (
        <div className="absolute inset-0 bg-slate-900/95 backdrop-blur-sm p-4 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0 flex flex-col justify-center border border-slate-600 z-10 rounded-xl">
           <div className="flex items-center gap-2 mb-2">
             <Info size={14} className="text-slate-400" />
             <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Asset Details</span>
           </div>
           <div className="space-y-1 text-xs">
             <div className="flex justify-between">
                <span className="text-slate-500">ID:</span>
                <span className="font-mono text-slate-300">{tooltipData.id}</span>
             </div>
             <div className="flex justify-between">
                <span className="text-slate-500">Status:</span>
                <span className={`font-bold ${tooltipData.status === 'ONLINE' ? 'text-emerald-400' : 'text-amber-400'}`}>{tooltipData.status}</span>
             </div>
             <div className="flex justify-between">
                <span className="text-slate-500">Capacity:</span>
                <span className="text-slate-300">{tooltipData.capacity}</span>
             </div>
             {tooltipData.temp && (
                 <div className="flex justify-between">
                    <span className="text-slate-500">Temp:</span>
                    <span className="text-slate-300">{tooltipData.temp}°C</span>
                 </div>
             )}
           </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6 h-full flex flex-col">
      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Grid Injection" 
          value={currentTotalExport.toFixed(1)} 
          unit="MW" 
          icon={Zap} 
          color="bg-emerald-500" 
          subtext="Firm Power Commitment: 200 MW"
          tooltipData={{
             id: 'PSS-GW-01',
             status: 'ONLINE',
             capacity: '1200 MW'
          }}
        />
        <StatCard 
          title="BESS State of Charge" 
          value={bessAsset?.efficiency || 0} 
          unit="%" 
          icon={Battery} 
          color="bg-blue-500" 
          subtext="Target: 60% for Evening Peak"
          tooltipData={{
            id: bessAsset?.id || 'N/A',
            status: bessAsset?.status || 'OFFLINE',
            capacity: `${bessAsset?.capacity} MWh`,
            temp: bessAsset?.temperature
          }}
        />
        <StatCard 
          title="H2 Production" 
          value={h2Asset?.output || 0} 
          unit="kg/hr" 
          icon={Droplets} 
          color="bg-cyan-500" 
          subtext="Electrolyzer Load: 42 MW"
          tooltipData={{
            id: h2Asset?.id || 'N/A',
            status: h2Asset?.status || 'OFFLINE',
            capacity: `${h2Asset?.capacity} MW`,
            temp: h2Asset?.temperature
          }}
        />
        <StatCard 
          title="Daily Revenue" 
          value={currentRevenue.toFixed(2)} 
          unit="₹ Lakh" 
          icon={TrendingUp} 
          color="bg-amber-500" 
          subtext="Avg. Realized Price: ₹4.2/kWh"
          tooltipData={{
            id: 'MKT-IEX-DAM',
            status: 'ACTIVE',
            capacity: 'Open Access'
          }}
        />
      </div>

      {/* Main Chart */}
      <div className="flex-1 bg-slate-800 rounded-xl border border-slate-700 p-4 min-h-[400px]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-slate-100 flex items-center gap-2">
            <Activity size={18} className="text-blue-400" />
            Real-Time Power Flow & Optimization
          </h2>
          <div className="flex gap-2">
             <span className="flex items-center text-xs text-slate-400"><div className="w-2 h-2 rounded-full bg-yellow-400 mr-1"></div>Solar</span>
             <span className="flex items-center text-xs text-slate-400"><div className="w-2 h-2 rounded-full bg-green-400 mr-1"></div>Grid Export</span>
             <span className="flex items-center text-xs text-slate-400"><div className="w-2 h-2 rounded-full bg-blue-500 mr-1"></div>BESS</span>
          </div>
        </div>
        
        <ResponsiveContainer width="100%" height="90%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorSolar" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#fbbf24" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#fbbf24" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorGrid" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#34d399" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#34d399" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="time" stroke="#94a3b8" fontSize={12} tickLine={false} />
            <YAxis yAxisId="power" stroke="#94a3b8" fontSize={12} tickLine={false} unit=" MW" />
            <YAxis yAxisId="price" orientation="right" stroke="#f43f5e" fontSize={12} tickLine={false} unit=" ₹" />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f1f5f9' }}
              itemStyle={{ color: '#f1f5f9' }}
            />
            <Area yAxisId="power" type="monotone" dataKey="solarMW" stroke="#fbbf24" fillOpacity={1} fill="url(#colorSolar)" name="Solar Gen" />
            <Area yAxisId="power" type="monotone" dataKey="gridExportMW" stroke="#34d399" fillOpacity={1} fill="url(#colorGrid)" name="Grid Export" />
            <Area yAxisId="power" type="basis" dataKey="bessChargeMW" stroke="#3b82f6" fillOpacity={0} fill="transparent" strokeDasharray="5 5" name="BESS Flow (+Chg/-Dis)" />
            <Area yAxisId="price" type="step" dataKey="marketPriceINR" stroke="#f43f5e" fill="url(#colorPrice)" name="Market Price (₹/unit)" />
            
            {/* Firm Power Baseline */}
            <ReferenceLine yAxisId="power" y={200} label={{ position: 'right',  value: 'Firm Commitment (200MW)', fill: '#94a3b8', fontSize: 10 }} stroke="#94a3b8" strokeDasharray="3 3" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};