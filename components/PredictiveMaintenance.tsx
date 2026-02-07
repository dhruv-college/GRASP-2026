import React, { useState } from 'react';
import { BESSCellData, AIAnalysisResult } from '../types';
import { AlertTriangle, Thermometer, ZapOff, CheckCircle, Search, Cpu } from 'lucide-react';
import { getMaintenanceDiagnosis } from '../services/geminiService';

export const PredictiveMaintenance: React.FC = () => {
  const [selectedCell, setSelectedCell] = useState<string | null>(null);
  const [diagnosis, setDiagnosis] = useState<AIAnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);

  // Mock Cell Data for a BESS Container
  const cells: BESSCellData[] = Array.from({ length: 64 }, (_, i) => ({
    id: `C-${100 + i}`,
    voltage: 3.2 + Math.random() * 0.4,
    temp: 25 + Math.random() * (i === 42 ? 25 : 5), // Cell 42 is overheating
    soc: 60 + Math.random() * 5,
    soh: 98 - Math.random() * 2,
    cluster: 'Rack-04'
  }));

  const handleDiagnose = async () => {
    if (!selectedCell) return;
    setLoading(true);
    const cellData = cells.find(c => c.id === selectedCell);
    const cellString = JSON.stringify(cellData);
    
    const result = await getMaintenanceDiagnosis(cellString);
    setDiagnosis(result);
    setLoading(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
      {/* Battery Matrix */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Cpu className="text-blue-400" />
            BESS Rack-04 Thermal Matrix
          </h2>
          <div className="flex gap-4 text-sm">
            <span className="flex items-center gap-1"><div className="w-3 h-3 bg-emerald-500 rounded"></div> Optimal</span>
            <span className="flex items-center gap-1"><div className="w-3 h-3 bg-amber-500 rounded"></div> Warm</span>
            <span className="flex items-center gap-1"><div className="w-3 h-3 bg-red-500 rounded"></div> Critical</span>
          </div>
        </div>

        <div className="grid grid-cols-8 gap-2 mb-4">
            {cells.map((cell) => {
                let color = "bg-emerald-500";
                if (cell.temp > 35) color = "bg-amber-500";
                if (cell.temp > 45) color = "bg-red-500 animate-pulse";
                
                return (
                    <button
                        key={cell.id}
                        onClick={() => { setSelectedCell(cell.id); setDiagnosis(null); }}
                        className={`aspect-square rounded-md ${color} hover:opacity-80 transition-all ${selectedCell === cell.id ? 'ring-2 ring-white' : ''} relative group`}
                    >
                        <span className="hidden group-hover:block absolute bottom-full left-1/2 -translate-x-1/2 bg-slate-900 text-xs px-2 py-1 rounded mb-1 whitespace-nowrap z-10 border border-slate-700">
                            {cell.id}: {cell.temp.toFixed(1)}°C
                        </span>
                    </button>
                )
            })}
        </div>
        <p className="text-sm text-slate-400 mt-4">
            Analysis running on XGBoost Anomaly Detection Model v2.4. Detecting thermal runaway precursors with 7-day lead time.
        </p>
      </div>

      {/* Diagnostics Panel */}
      <div className="flex flex-col space-y-6">
        {/* Active Alerts List */}
        <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 flex-1">
           <h3 className="text-lg font-semibold mb-4 text-slate-100 flex items-center gap-2">
             <AlertTriangle className="text-amber-500" size={20} />
             Predictive Alerts
           </h3>
           <div className="space-y-3">
             <div className="p-3 bg-red-900/20 border border-red-900/50 rounded-lg flex items-start gap-3">
                <Thermometer className="text-red-500 mt-1" size={18} />
                <div>
                    <h4 className="text-red-200 font-medium">Thermal Anomaly Detected</h4>
                    <p className="text-xs text-red-300/70">Cell C-142 (Rack-04) deviating +15°C from cluster mean. 92% probability of thermal runaway in 48h.</p>
                </div>
             </div>
             <div className="p-3 bg-amber-900/20 border border-amber-900/50 rounded-lg flex items-start gap-3">
                <ZapOff className="text-amber-500 mt-1" size={18} />
                <div>
                    <h4 className="text-amber-200 font-medium">Inverter Efficiency Drop</h4>
                    <p className="text-xs text-amber-300/70">Inv-03 String-B showing 4% output sag. Possible PID effect detected.</p>
                </div>
             </div>
           </div>
        </div>

        {/* AI Inspector */}
        <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
            <h3 className="text-lg font-semibold mb-4 text-slate-100 flex items-center gap-2">
                <Search className="text-purple-400" size={20} />
                AI Root Cause Analysis
            </h3>
            
            {!selectedCell ? (
                <div className="text-slate-500 text-center py-8 text-sm">
                    Select a cell from the matrix to analyze health telemetry.
                </div>
            ) : (
                <div>
                     <div className="flex justify-between items-center mb-4 p-3 bg-slate-900 rounded-lg">
                        <span className="font-mono font-bold text-slate-200">{selectedCell}</span>
                        <div className="text-sm space-x-4">
                             <span className="text-slate-400">Temp: <span className={cells.find(c => c.id === selectedCell)!.temp > 40 ? "text-red-400" : "text-slate-200"}>{cells.find(c => c.id === selectedCell)?.temp.toFixed(1)}°C</span></span>
                             <span className="text-slate-400">SoH: <span className="text-slate-200">{cells.find(c => c.id === selectedCell)?.soh.toFixed(1)}%</span></span>
                        </div>
                     </div>
                     
                     {!diagnosis ? (
                         <button 
                            onClick={handleDiagnose}
                            disabled={loading}
                            className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors text-sm font-medium flex justify-center items-center gap-2"
                         >
                            {loading ? "Analyzing Telemetry..." : "Run Digital Twin Diagnosis"}
                         </button>
                     ) : (
                         <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-4 animate-in fade-in slide-in-from-bottom-2">
                             <p className="text-sm text-slate-200 leading-relaxed">
                                {diagnosis.text}
                             </p>
                             <div className="mt-3 flex items-center justify-between text-xs text-purple-300">
                                <span>Confidence: {(diagnosis.confidence * 100).toFixed(0)}%</span>
                                <button onClick={() => setDiagnosis(null)} className="underline hover:text-white">Reset</button>
                             </div>
                         </div>
                     )}
                </div>
            )}
        </div>
      </div>
    </div>
  );
};
