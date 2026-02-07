import React, { useState, useEffect } from 'react';
import { Bot, RefreshCw, X, Minimize2, Maximize2, Sparkles } from 'lucide-react';
import { getEnergyAnalysis } from '../services/geminiService';
import { TimeSeriesPoint } from '../types';

interface AIInsightPanelProps {
  latestData: TimeSeriesPoint;
}

export const AIInsightPanel: React.FC<AIInsightPanelProps> = ({ latestData }) => {
  const [insight, setInsight] = useState<string>("Initializing Param AI...");
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);

  const fetchInsight = async () => {
    setLoading(true);
    // Add randomness to prompt to avoid caching identical responses if data hasn't changed much
    const context = `
      Timestamp: ${latestData.time}
      Solar Generation: ${latestData.solarMW} MW
      Grid Export: ${latestData.gridExportMW} MW
      BESS Charge Power: ${latestData.bessChargeMW} MW
      Market Price: ₹${latestData.marketPriceINR}/kWh
    `;
    const result = await getEnergyAnalysis(context);
    setInsight(result.text);
    setLoading(false);
  };

  useEffect(() => {
    if (latestData) {
        fetchInsight();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Function to parse raw markdown-like text from Gemini and render nice HTML
  const renderFormattedText = (text: string) => {
    if (!text) return null;

    return text.split('\n').map((line, index) => {
      const cleanLine = line.trim();
      if (!cleanLine) return <div key={index} className="h-2" />;

      // Handle Headers (### or ##)
      if (cleanLine.startsWith('#')) {
        const title = cleanLine.replace(/^#+\s*/, '').replace(/\*\*/g, '');
        return (
          <h3 key={index} className="text-orange-400 font-bold text-sm uppercase tracking-wider mt-4 mb-2 border-b border-orange-500/20 pb-1">
            {title}
          </h3>
        );
      }

      // Handle Bullet Points
      if (cleanLine.startsWith('-') || cleanLine.startsWith('*')) {
        const content = cleanLine.replace(/^[\-\*]\s*/, '');
        return (
          <div key={index} className="flex items-start space-x-2 mb-2 ml-1">
            <span className="text-emerald-500 mt-1.5 text-[8px]">●</span>
            <p className="text-slate-300 text-sm leading-relaxed flex-1">
              {parseBold(content)}
            </p>
          </div>
        );
      }

      // Standard Paragraph
      return (
        <p key={index} className="text-slate-300 text-sm leading-relaxed mb-2">
          {parseBold(cleanLine)}
        </p>
      );
    });
  };

  // Helper to parse **Bold** text inside lines
  const parseBold = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <span key={i} className="font-semibold text-white">{part.replace(/\*\*/g, '')}</span>;
      }
      return part;
    });
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white p-3 rounded-full shadow-lg shadow-orange-900/20 transition-all hover:scale-105 z-50 group"
      >
        <Sparkles size={24} className="group-hover:animate-spin-slow" />
      </button>
    );
  }

  return (
    <div className={`fixed bottom-6 right-6 bg-slate-900/95 backdrop-blur-md border border-slate-700/50 rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden transition-all duration-300 ease-in-out ${isExpanded ? 'w-[600px] h-[80vh]' : 'w-96 max-h-[600px]'}`}>
      
      {/* Header */}
      <div className="bg-slate-800/80 p-4 border-b border-slate-700 flex justify-between items-center select-none">
        <div className="flex items-center space-x-3">
          <div className="p-1.5 bg-gradient-to-br from-orange-500 to-amber-500 rounded-lg">
            <Bot size={18} className="text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-100 text-sm">Param Co-Pilot</h3>
            <p className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
               <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                </span>
               LIVE OPTIMIZATION
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-1 text-slate-400">
          <button onClick={() => setIsExpanded(!isExpanded)} className="p-1.5 hover:bg-slate-700 rounded-md transition-colors">
            {isExpanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>
          <button onClick={() => setIsOpen(false)} className="p-1.5 hover:bg-slate-700 hover:text-red-400 rounded-md transition-colors">
            <X size={16} />
          </button>
        </div>
      </div>
      
      {/* Content */}
      <div className="flex-1 p-5 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
        {loading ? (
            <div className="flex flex-col items-center justify-center h-48 space-y-4 text-slate-400 animate-pulse">
                <div className="relative">
                    <div className="absolute inset-0 bg-orange-500 blur-xl opacity-20 rounded-full"></div>
                    <RefreshCw className="animate-spin relative z-10 text-orange-400" size={32} />
                </div>
                <div className="text-center space-y-1">
                    <p className="text-sm font-medium text-slate-300">Analyzing Grid Conditions...</p>
                    <p className="text-xs text-slate-500">Fetching spot prices & forecast</p>
                </div>
            </div>
        ) : (
            <div className="animate-in fade-in duration-500">
                {renderFormattedText(insight)}
            </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-3 bg-slate-800/50 border-t border-slate-700/50">
        <button 
            onClick={fetchInsight}
            disabled={loading}
            className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-lg border border-slate-600 transition-all flex items-center justify-center gap-2 group"
        >
            <RefreshCw size={14} className={`text-orange-400 transition-transform ${loading ? "animate-spin" : "group-hover:rotate-180"}`} />
            Refresh Analysis
        </button>
      </div>
    </div>
  );
};