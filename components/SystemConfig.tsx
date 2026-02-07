import React, { useState } from 'react';
import { Settings, Shield, Zap, Radio, Bell, Save, Database, Server } from 'lucide-react';

export const SystemConfig: React.FC = () => {
  const [activeTab, setActiveTab] = useState('GRID');

  const Toggle = ({ label, checked }: { label: string, checked: boolean }) => (
    <div className="flex items-center justify-between py-3 border-b border-slate-700 last:border-0">
      <span className="text-slate-300 text-sm font-medium">{label}</span>
      <button className={`w-11 h-6 flex items-center rounded-full transition-colors duration-200 focus:outline-none ${checked ? 'bg-emerald-500' : 'bg-slate-600'}`}>
        <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${checked ? 'translate-x-6' : 'translate-x-1'}`} />
      </button>
    </div>
  );

  const InputField = ({ label, value, unit }: { label: string, value: string, unit: string }) => (
    <div className="flex flex-col space-y-1 mb-4">
      <label className="text-xs text-slate-400 font-medium uppercase tracking-wider">{label}</label>
      <div className="flex items-center space-x-2">
        <input 
          type="text" 
          defaultValue={value} 
          className="bg-slate-900 border border-slate-700 text-slate-200 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block w-full p-2.5" 
        />
        <span className="text-slate-500 text-sm w-8">{unit}</span>
      </div>
    </div>
  );

  return (
    <div className="h-full flex flex-col space-y-6">
      <div className="flex items-center justify-between">
         <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-3">
            <Settings className="text-slate-400" />
            System Configuration
         </h2>
         <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors font-medium text-sm">
            <Save size={16} />
            Save Changes
         </button>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-1 space-y-2">
           {[
             { id: 'GRID', label: 'Grid Interconnection', icon: Zap },
             { id: 'SAFETY', label: 'Safety & Thresholds', icon: Shield },
             { id: 'SCADA', label: 'SCADA & Connectivity', icon: Server },
             { id: 'NOTIFICATIONS', label: 'Alerts & Reporting', icon: Bell },
           ].map((tab) => (
             <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                    activeTab === tab.id 
                    ? 'bg-slate-800 text-emerald-400 border border-slate-700 shadow-lg' 
                    : 'text-slate-400 hover:bg-slate-800/50'
                }`}
             >
                <tab.icon size={18} />
                <span className="font-medium">{tab.label}</span>
             </button>
           ))}

           <div className="mt-8 p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
              <h4 className="text-xs font-semibold text-slate-400 uppercase mb-3">System Info</h4>
              <div className="space-y-2 text-xs text-slate-500 font-mono">
                 <div className="flex justify-between"><span>Version:</span> <span className="text-slate-300">v2.4.1-stable</span></div>
                 <div className="flex justify-between"><span>Build:</span> <span className="text-slate-300">20241014-GUJ</span></div>
                 <div className="flex justify-between"><span>Node ID:</span> <span className="text-slate-300">REZ-GJ-04</span></div>
              </div>
           </div>
        </div>

        {/* Configuration Panel */}
        <div className="lg:col-span-3 bg-slate-800 rounded-xl border border-slate-700 p-6 overflow-y-auto">
           {activeTab === 'GRID' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                 <div>
                    <h3 className="text-lg font-semibold text-slate-200 mb-4 pb-2 border-b border-slate-700">Grid Compliance Parameters (CEA 2019)</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <InputField label="Frequency Deadband" value="0.03" unit="Hz" />
                       <InputField label="Voltage Droop" value="2.5" unit="%" />
                       <InputField label="Active Power Ramp Rate" value="10" unit="MW/min" />
                       <InputField label="Reactive Power (Q) Mode" value="Auto-Volt" unit="Mode" />
                    </div>
                 </div>
                 
                 <div>
                    <h3 className="text-lg font-semibold text-slate-200 mb-4 pb-2 border-b border-slate-700">Control Logic</h3>
                    <div className="bg-slate-900 rounded-lg p-4 space-y-1">
                       <Toggle label="Enable Automatic Generation Control (AGC)" checked={true} />
                       <Toggle label="Primary Frequency Response (PFR)" checked={true} />
                       <Toggle label="Low Voltage Ride Through (LVRT)" checked={true} />
                       <Toggle label="Anti-Islanding Protection" checked={true} />
                    </div>
                 </div>
              </div>
           )}

           {activeTab === 'SAFETY' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                 <div>
                    <h3 className="text-lg font-semibold text-slate-200 mb-4 pb-2 border-b border-slate-700">BESS Safety Limits</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <InputField label="Max Charge Current (C-Rate)" value="0.5" unit="C" />
                       <InputField label="Min SoC Limit" value="10" unit="%" />
                       <InputField label="Max Cell Temperature" value="45.0" unit="°C" />
                       <InputField label="Cell Voltage Imbalance Threshold" value="0.15" unit="V" />
                    </div>
                 </div>
                 <div className="bg-red-900/20 border border-red-900/50 p-4 rounded-lg flex items-start gap-3">
                    <Shield className="text-red-500 mt-1" size={20} />
                    <div>
                       <h4 className="text-red-200 font-medium">Emergency Power Off (EPO) Override</h4>
                       <p className="text-sm text-red-300/70 mb-3">Enabling this allows remote manual override of safety interlocks. Use with extreme caution.</p>
                       <Toggle label="Enable Remote EPO" checked={false} />
                    </div>
                 </div>
              </div>
           )}

           {activeTab === 'SCADA' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                 <div>
                    <h3 className="text-lg font-semibold text-slate-200 mb-4 pb-2 border-b border-slate-700">Protocol Settings</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <InputField label="IEC 60870-5-104 Server IP" value="192.168.1.100" unit="" />
                       <InputField label="Modbus TCP Port" value="502" unit="" />
                       <InputField label="Polling Interval" value="100" unit="ms" />
                       <InputField label="Cloud Telemetry Uplink" value="wss://api.param-ems.io/v1/stream" unit="" />
                    </div>
                 </div>
              </div>
           )}

           {activeTab === 'NOTIFICATIONS' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                 <div>
                    <h3 className="text-lg font-semibold text-slate-200 mb-4 pb-2 border-b border-slate-700">Alert Routing</h3>
                    <div className="bg-slate-900 rounded-lg p-4 space-y-1">
                       <Toggle label="Email Critical Alerts to Site Manager" checked={true} />
                       <Toggle label="SMS Gateway for Thermal Runaway Events" checked={true} />
                       <Toggle label="Slack/Teams Webhook Integration" checked={false} />
                    </div>
                 </div>
              </div>
           )}
        </div>
      </div>
    </div>
  );
};