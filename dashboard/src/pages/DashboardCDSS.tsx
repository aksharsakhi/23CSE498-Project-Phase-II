import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  AlertTriangle, 
  Heart, 
  Activity, 
  TrendingUp 
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend 
} from 'recharts';
import { fetchStats } from '../services/mockDataService';
import type { ICUStats } from '../services/mockDataService';

export const DashboardCDSS: React.FC = () => {
  const [stats, setStats] = useState<ICUStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(true);
    setError(null);
    fetchStats()
      .then((data) => {
        setStats(data);
        setIsLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Failed to reach clinical warehouse server");
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-[400px] text-center space-y-4">
        <AlertTriangle className="h-16 w-16 text-amber-500 animate-bounce" />
        <h3 className="text-xl font-bold text-slate-800 dark:text-white">Clinical Node Offline</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md">
          Unable to connect to the SQLite clinical warehouse database server (port 8000). Please ensure your FastAPI backend is running.
        </p>
        <code className="bg-slate-100 dark:bg-slate-900 px-3 py-1.5 rounded font-mono text-xs dark:text-slate-350 select-all">
          python3 backend/main.py
        </code>
      </div>
    );
  }

  const cardData = [
    { id: 1, title: 'Total ICU Patients', value: stats.total_patients.toString(), change: 'Synchronized dynamically', icon: Users, color: 'text-blue-500 bg-blue-50 dark:bg-blue-900/20' },
    { id: 2, title: 'High Sepsis Risk', value: stats.high_risk.toString(), change: 'Urgent intervention needed', icon: AlertTriangle, color: 'text-red-500 bg-red-50 dark:bg-red-900/20' },
    { id: 3, title: 'Medium Risk Patients', value: stats.medium_risk.toString(), change: 'Monitor hourly vitals', icon: Heart, color: 'text-orange-500 bg-orange-50 dark:bg-orange-900/20' },
    { id: 4, title: 'Low Risk Patients', value: stats.low_risk.toString(), change: 'Stable physiological parameters', icon: Activity, color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20' }
  ];

  return (
    <div className="p-8 space-y-8 overflow-y-auto max-h-[calc(100vh-4rem)]">
      {/* Clinician Welcome Banner */}
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-800 dark:text-white leading-tight">ICU Clinical Decision Support System</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Real-time Sepsis early warning telemetry utilizing Personalized Federated Learning (FPDAF)</p>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-4 py-2 rounded-xl">
          Hospital Node: Active
        </div>
      </div>

      {/* Grid Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cardData.map((card) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.id}
              whileHover={{ y: -4 }}
              className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all flex justify-between items-start"
            >
              <div className="space-y-3">
                <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">{card.title}</span>
                <h3 className="text-3xl font-extrabold text-slate-800 dark:text-white leading-none">{card.value}</h3>
                <span className="text-xs text-slate-400 dark:text-slate-400 font-medium block">{card.change}</span>
              </div>
              <div className={`p-3.5 rounded-xl ${card.color}`}>
                <Icon className="h-6 w-6" />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Charts Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Today's Admission Monitor */}
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-6 rounded-2xl shadow-sm space-y-6">
          <div className="flex justify-between items-center">
            <h4 className="font-bold text-slate-800 dark:text-white text-base">ICU Admissions & Discharges Telemetry</h4>
            <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-2.5 py-1 rounded-full">Hourly Update</span>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.admissions} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" className="dark:hidden" />
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" className="hidden dark:block" />
                <XAxis dataKey="time" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '12px' }} 
                  labelStyle={{ color: '#fff', fontSize: '11px', fontWeight: 'bold' }}
                  itemStyle={{ fontSize: '11px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', fontWeight: 500 }} />
                <Bar dataKey="admissions" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Admitted Patients" />
                <Bar dataKey="discharges" fill="#10b981" radius={[4, 4, 0, 0]} name="Discharged Patients" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sepsis alerts Trend Area Chart */}
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-6 rounded-2xl shadow-sm space-y-6">
          <div className="flex justify-between items-center">
            <h4 className="font-bold text-slate-800 dark:text-white text-base">Sepsis Alerts & FPDAF Drift Trigger Trends</h4>
            <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-2.5 py-1 rounded-full">
              <TrendingUp className="h-3.5 w-3.5" /> Stable Operations
            </span>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.trends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSepsis" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorBypasses" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" className="dark:hidden" />
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" className="hidden dark:block" />
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '12px' }} 
                  labelStyle={{ color: '#fff', fontSize: '11px', fontWeight: 'bold' }}
                  itemStyle={{ fontSize: '11px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', fontWeight: 500 }} />
                <Area type="monotone" dataKey="sepsisAlerts" stroke="#ef4444" strokeWidth={2.5} fillOpacity={1} fill="url(#colorSepsis)" name="Critical Sepsis Alerts" />
                <Area type="monotone" dataKey="fpdafBypasses" stroke="#f97316" strokeWidth={2} fillOpacity={1} fill="url(#colorBypasses)" name="CSSP Personalization Bypasses" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
