import React from 'react';
import { ViewState } from '../types';
import { LayoutDashboard, IndianRupee, Wrench, Settings, Zap } from 'lucide-react';

interface SidebarProps {
  currentView: ViewState;
  onViewChange: (view: ViewState) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onViewChange }) => {
  
  const NavItem = ({ view, icon: Icon, label }: { view: ViewState, icon: any, label: string }) => (
    <button
      onClick={() => onViewChange(view)}
      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
        currentView === view 
          ? 'bg-orange-600/20 text-orange-400 border border-orange-500/20' 
          : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
      }`}
    >
      <Icon size={20} />
      <span className="font-medium">{label}</span>
    </button>
  );

  return (
    <div className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col h-full shrink-0">
      <div className="p-6 flex items-center space-x-3">
        {/* Logo: Saffron to Green Gradient representing Indian Energy */}
        <div className="p-2.5 bg-gradient-to-br from-[#FF9933] to-[#138808] rounded-xl text-white shadow-lg border border-white/10">
           <Zap size={24} fill="currentColor" />
        </div>
        <div>
           <h1 className="text-xl font-bold text-slate-100 leading-none tracking-tight">Param</h1>
           <span className="text-[10px] text-slate-400 font-mono tracking-widest uppercase">Energy Cloud</span>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-4">
        <NavItem view={ViewState.DASHBOARD} icon={LayoutDashboard} label="Overview" />
        <NavItem view={ViewState.REVENUE} icon={IndianRupee} label="Revenue & Bidding" />
        <NavItem view={ViewState.MAINTENANCE} icon={Wrench} label="Predictive Maint." />
        <NavItem view={ViewState.SETTINGS} icon={Settings} label="System Config" />
      </nav>

      <div className="p-4 border-t border-slate-800">
        <div className="bg-slate-800 rounded-lg p-3 border border-slate-700">
           <div className="flex items-center justify-between mb-2">
             <span className="text-xs text-slate-400">System Uptime</span>
             <span className="text-xs text-emerald-400 font-bold">99.99%</span>
           </div>
           <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
             <div className="bg-gradient-to-r from-orange-500 to-green-500 w-[99%] h-full"></div>
           </div>
           <div className="mt-3 text-xs text-slate-500">
             Gujarat REZ Node: <span className="text-slate-300">Connected</span>
           </div>
        </div>
      </div>
    </div>
  );
};