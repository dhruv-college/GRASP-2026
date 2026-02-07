import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { RevenueOptimizer } from './components/RevenueOptimizer';
import { PredictiveMaintenance } from './components/PredictiveMaintenance';
import { SystemConfig } from './components/SystemConfig';
import { AIInsightPanel } from './components/AIInsightPanel';
import { ViewState, TimeSeriesPoint, AssetStatus } from './types';
import { generateDayData, getAssetsStatus } from './services/mockDataService';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.DASHBOARD);
  const [data, setData] = useState<TimeSeriesPoint[]>([]);
  const [assets, setAssets] = useState<AssetStatus[]>([]);

  useEffect(() => {
    // Load initial mock data
    setData(generateDayData());
    setAssets(getAssetsStatus());
  }, []);

  const renderContent = () => {
    switch (currentView) {
      case ViewState.DASHBOARD:
        return <Dashboard data={data} assets={assets} />;
      case ViewState.REVENUE:
        return <RevenueOptimizer />;
      case ViewState.MAINTENANCE:
        return <PredictiveMaintenance />;
      case ViewState.SETTINGS:
        return <SystemConfig />;
      default:
        return <Dashboard data={data} assets={assets} />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-900 text-slate-100 font-sans">
      <Sidebar currentView={currentView} onViewChange={setCurrentView} />
      
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-6 shrink-0">
          <h2 className="text-xl font-semibold text-white">
            {currentView === ViewState.DASHBOARD && "Real-Time Operations Center"}
            {currentView === ViewState.REVENUE && "Market Revenue & Optimization"}
            {currentView === ViewState.MAINTENANCE && "Asset Health & Predictive Maintenance"}
            {currentView === ViewState.SETTINGS && "System Configuration"}
          </h2>
          <div className="flex items-center space-x-4">
             <div className="text-right hidden sm:block">
                <div className="text-xs text-slate-400">Grid Frequency</div>
                <div className="text-sm font-mono text-emerald-400 font-bold">50.02 Hz</div>
             </div>
             <div className="w-px h-8 bg-slate-800"></div>
             <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-xs text-slate-400 font-medium">SCADA Connected</span>
             </div>
          </div>
        </header>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-auto p-6 relative">
          {renderContent()}
        </div>
      </main>

      {/* AI Assistant Overlay */}
      {data.length > 0 && (
         <AIInsightPanel latestData={data[12]} /> // Passing mid-day data for demo context
      )}
    </div>
  );
};

export default App;