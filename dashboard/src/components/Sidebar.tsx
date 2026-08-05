import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Activity, 
  Eye, 
  LineChart, 
  Network, 
  BarChart3, 
  FileText, 
  LogOut,
  HeartPulse,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface SidebarProps {
  userRole: 'Doctor' | 'Admin' | 'Full Access';
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ userRole, activeTab, setActiveTab, onLogout }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'ICU Overview', icon: LayoutDashboard, roles: ['Doctor', 'Admin', 'Full Access'] },
    { id: 'patients', label: 'ICU Patient List', icon: Users, roles: ['Doctor', 'Full Access'] },
    { id: 'prediction', label: 'Sepsis Risk Predict', icon: Activity, roles: ['Doctor', 'Full Access'] },
    { id: 'xai', label: 'Explainable AI (XAI)', icon: Eye, roles: ['Doctor', 'Full Access'] },
    { id: 'drift', label: 'CUSUM Drift Monitor', icon: LineChart, roles: ['Admin', 'Full Access'] },
    { id: 'federated', label: 'Federated FL Monitor', icon: Network, roles: ['Admin', 'Full Access'] },
    { id: 'comparison', label: 'Model Benchmark', icon: BarChart3, roles: ['Admin', 'Full Access'] },
    { id: 'research', label: 'Research & Paper', icon: FileText, roles: ['Doctor', 'Admin', 'Full Access'] },
  ].filter(item => userRole === 'Full Access' || item.roles.includes(userRole));

  return (
    <aside className={`bg-[#0a1628] text-slate-300 flex flex-col min-h-screen border-r border-[#152238] shrink-0 transition-all duration-300 ${
      isCollapsed ? 'w-16' : 'w-60'
    }`}>
      {/* Brand */}
      <div className="px-4 py-4 border-b border-[#152238] flex items-center justify-between">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="h-9 w-9 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 shrink-0 shadow-lg shadow-teal-500/5">
            <HeartPulse className="h-5 w-5 animate-pulse" />
          </div>
          {!isCollapsed && (
            <div className="overflow-hidden">
              <h1 className="font-bold text-sm leading-tight text-white tracking-tight truncate">FPDAF CDSS</h1>
              <span className="text-[10px] text-teal-400 font-semibold uppercase tracking-wider block">Clinical AI Suite</span>
            </div>
          )}
        </div>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors hidden sm:block"
          title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              title={isCollapsed ? item.label : undefined}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                isActive 
                  ? 'bg-teal-500/15 text-teal-400 border border-teal-500/30 shadow-md shadow-teal-500/5' 
                  : 'text-slate-400 hover:bg-white/5 hover:text-slate-200 border border-transparent'
              } ${isCollapsed ? 'justify-center px-0' : ''}`}
            >
              <Icon className={`h-4 w-4 shrink-0 transition-transform group-hover:scale-110 ${isActive ? 'text-teal-400' : 'text-slate-400'}`} />
              {!isCollapsed && <span className="truncate">{item.label}</span>}
            </button>
          );
        })}
      </nav>

      {/* Footer / Role indicator */}
      <div className="p-3 border-t border-[#152238] space-y-2">
        {!isCollapsed && (
          <div className="bg-[#0e1d35] p-2.5 rounded-xl border border-[#1a2b4a] text-[10px] space-y-1">
            <div className="flex justify-between items-center text-slate-400">
              <span>Access Level</span>
              <span className="font-bold text-teal-400">{userRole}</span>
            </div>
            <p className="text-[9px] text-slate-500 leading-tight">
              Personalized Federated Learning node active.
            </p>
            <div className="mt-2 pt-2 border-t border-[#1a2b4a]">
              <div className="flex justify-between items-center text-[10px] text-slate-400 mb-1">
                <span>Project Progress (DDP Met)</span>
                <span className="text-teal-400 font-bold">60%</span>
              </div>
              <div className="w-full bg-[#0a1628] rounded-full h-1.5 border border-[#1a2b4a]">
                <div className="bg-teal-500 h-1.5 rounded-full" style={{ width: '60%' }}></div>
              </div>
            </div>
          </div>
        )}
        
        <button 
          onClick={onLogout}
          title={isCollapsed ? "Sign Out" : undefined}
          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20 border border-transparent transition-all ${
            isCollapsed ? 'justify-center px-0' : ''
          }`}
        >
          <LogOut className="h-4 w-4 shrink-0" />
          {!isCollapsed && <span>Sign Out</span>}
        </button>
      </div>
    </aside>
  );
};

