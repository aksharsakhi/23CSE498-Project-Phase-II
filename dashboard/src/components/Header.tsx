import React, { useState } from 'react';
import { Bell, User, ShieldAlert, Sun, Moon, Radio, ShieldCheck, Cpu } from 'lucide-react';

interface HeaderProps {
  userRole: 'Doctor' | 'Admin' | 'Full Access';
  setUserRole: (role: 'Doctor' | 'Admin' | 'Full Access') => void;
  userName: string;
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  isLiveStreaming: boolean;
  setIsLiveStreaming: React.Dispatch<React.SetStateAction<boolean>>;
  setActiveTab: (tab: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  userRole, 
  setUserRole, 
  userName, 
  theme, 
  setTheme,
  isLiveStreaming,
  setIsLiveStreaming,
  setActiveTab
}) => {
  const [showNotifications, setShowNotifications] = useState(false);

  const notifications = [
    { id: 1, message: "Sepsis Warning: PAT-2091 crossed 89% risk threshold", type: 'critical' as const, tab: 'prediction' },
    { id: 2, message: "Drift Alarm: Hospital A (Client 0) CUSUM score > 3.0", type: 'warning' as const, tab: 'drift' },
    { id: 3, message: "FedAvg Aggregation Round 10 completed successfully", type: 'success' as const, tab: 'federated' }
  ];

  return (
    <header className="h-14 border-b bg-white dark:bg-[#0d1829] border-slate-200 dark:border-[#1a2744] px-6 flex items-center justify-between shrink-0 z-40 transition-colors">
      {/* Left: System Status & Brand */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="h-2.5 w-2.5 rounded-full bg-teal-500 animate-pulse" />
          <span className="font-semibold text-slate-800 dark:text-white text-sm tracking-tight">FPDAF Bedside Workstation</span>
        </div>
        <span className="hidden sm:inline-block text-[10px] bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20 font-bold px-2 py-0.5 rounded uppercase tracking-wider">
          v2.0 Clinical CDSS
        </span>

        {/* Live Streaming Toggle */}
        <button
          onClick={() => setIsLiveStreaming(!isLiveStreaming)}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all ${
            isLiveStreaming 
              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30' 
              : 'bg-slate-100 dark:bg-slate-800 text-slate-400 border border-slate-200 dark:border-slate-700'
          }`}
          title="Toggle live telemetry feed simulation"
        >
          <Radio className={`h-3 w-3 ${isLiveStreaming ? 'animate-pulse text-emerald-500' : ''}`} />
          <span>{isLiveStreaming ? 'Live Feed Active' : 'Feed Paused'}</span>
        </button>
      </div>

      {/* Right: Controls */}
      <div className="flex items-center gap-2.5">
        {/* Role Switcher */}
        <div className="hidden lg:flex items-center bg-slate-100 dark:bg-[#0a1323] p-1 rounded-lg border border-slate-200 dark:border-[#1a2744] text-[11px] font-semibold">
          <button
            onClick={() => setUserRole('Doctor')}
            className={`px-2.5 py-1 rounded-md transition-colors ${
              userRole === 'Doctor' ? 'bg-white dark:bg-[#152238] text-teal-600 dark:text-teal-400 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'
            }`}
          >
            Clinician View
          </button>
          <button
            onClick={() => setUserRole('Admin')}
            className={`px-2.5 py-1 rounded-md transition-colors ${
              userRole === 'Admin' ? 'bg-white dark:bg-[#152238] text-amber-600 dark:text-amber-400 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'
            }`}
          >
            Admin View
          </button>
          <button
            onClick={() => setUserRole('Full Access')}
            className={`px-2.5 py-1 rounded-md transition-colors ${
              userRole === 'Full Access' ? 'bg-teal-600 text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'
            }`}
          >
            All Modules
          </button>
        </div>

        {/* Theme Toggle */}
        <button
          onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          className="p-2 rounded-lg text-slate-400 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-600 dark:hover:text-slate-200 transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
          title="Toggle Dark/Light Mode"
        >
          {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4 text-amber-400" />}
        </button>

        {/* Notifications */}
        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-lg text-slate-400 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-600 dark:hover:text-slate-200 transition-colors relative border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
            title="Clinical Alerts"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-red-500 rounded-full ring-2 ring-white dark:ring-[#0d1829]" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-[#0d1829] border border-slate-200 dark:border-[#1a2744] rounded-xl shadow-xl z-50 overflow-hidden">
              <div className="px-4 py-3 border-b border-slate-100 dark:border-[#1a2744] flex justify-between items-center bg-slate-50/50 dark:bg-[#0a1323]/50">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="h-4 w-4 text-teal-500" />
                  <span className="font-semibold text-xs text-slate-800 dark:text-white">Active Clinical Alerts</span>
                </div>
                <span className="text-[10px] bg-red-500/10 text-red-500 font-bold px-2 py-0.5 rounded-full">{notifications.length}</span>
              </div>
              <div className="divide-y divide-slate-100 dark:divide-[#1a2744] max-h-64 overflow-y-auto">
                {notifications.map((notif) => (
                  <button
                    key={notif.id} 
                    onClick={() => {
                      setActiveTab(notif.tab);
                      setShowNotifications(false);
                    }}
                    className="w-full text-left p-3 hover:bg-slate-50 dark:hover:bg-[#152238] flex gap-3 transition-colors group"
                  >
                    <div className={`p-1.5 rounded-lg shrink-0 mt-0.5 ${
                      notif.type === 'critical' ? 'bg-red-500/10 text-red-500' : notif.type === 'warning' ? 'bg-amber-500/10 text-amber-500' : 'bg-emerald-500/10 text-emerald-500'
                    }`}>
                      {notif.type === 'critical' ? <ShieldAlert className="h-4 w-4" /> : notif.type === 'warning' ? <Cpu className="h-4 w-4" /> : <ShieldCheck className="h-4 w-4" />}
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-xs font-medium text-slate-700 dark:text-slate-300 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                        {notif.message}
                      </p>
                      <span className="text-[10px] text-teal-600 dark:text-teal-400 font-semibold block">Click to view in {notif.tab} &rarr;</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Card */}
        <div className="flex items-center gap-2 border-l border-slate-200 dark:border-[#1a2744] pl-3 ml-1">
          <div className="h-8 w-8 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-600 dark:text-teal-400 font-bold text-xs">
            <User className="h-4 w-4" />
          </div>
          <div className="text-left hidden md:block">
            <h4 className="text-xs font-bold text-slate-800 dark:text-white leading-tight">{userName}</h4>
            <span className="text-[10px] text-slate-400 font-medium block">{userRole} Mode</span>
          </div>
        </div>
      </div>
    </header>
  );
};

