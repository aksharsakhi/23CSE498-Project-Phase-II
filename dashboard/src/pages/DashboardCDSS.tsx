import React from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  AlertTriangle, 
  Heart, 
  Activity, 
  TrendingUp, 
  ArrowUpRight 
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

const cardData = [
  { id: 1, title: 'Total ICU Patients', value: '142', change: '+8% vs. yesterday', icon: Users, color: 'text-blue-500 bg-blue-50 dark:bg-blue-900/20' },
  { id: 2, title: 'High Sepsis Risk', value: '12', change: 'Immediate action needed', icon: AlertTriangle, color: 'text-red-500 bg-red-50 dark:bg-red-900/20' },
  { id: 3, title: 'Medium Risk Patients', value: '38', change: 'Monitor hourly', icon: Heart, color: 'text-orange-500 bg-orange-50 dark:bg-orange-900/20' },
  { id: 4, title: 'Low Risk Patients', value: '92', change: 'Stable vital bounds', icon: Activity, color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20' }
];

const admissionsData = [
  { time: '08:00', admissions: 5, discharges: 3 },
  { time: '10:00', admissions: 8, discharges: 6 },
  { time: '12:00', admissions: 12, discharges: 8 },
  { time: '14:00', admissions: 10, discharges: 11 },
  { time: '16:00', admissions: 15, discharges: 9 },
  { time: '18:00', admissions: 18, discharges: 12 },
  { time: '20:00', admissions: 11, discharges: 14 }
];

const trendData = [
  { date: 'Jul 10', sepsisAlerts: 4, fpdafBypasses: 1 },
  { date: 'Jul 11', sepsisAlerts: 6, fpdafBypasses: 2 },
  { date: 'Jul 12', sepsisAlerts: 5, fpdafBypasses: 1 },
  { date: 'Jul 13', sepsisAlerts: 8, fpdafBypasses: 3 },
  { date: 'Jul 14', sepsisAlerts: 11, fpdafBypasses: 4 },
  { date: 'Jul 15', sepsisAlerts: 9, fpdafBypasses: 2 },
  { date: 'Jul 16', sepsisAlerts: 12, fpdafBypasses: 5 }
];

export const DashboardCDSS: React.FC = () => {
  return (
    <div className="p-8 space-y-8 overflow-y-auto max-h-[calc(100vh-4rem)]">
      {/* Clinician Welcome Banner */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-800 dark:text-white leading-tight">ICU Clinical Decision Support System</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Real-time Sepsis early warning telemetry utilizing Personalized Federated Learning (FPDAF)</p>
        </div>
        <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2.5 rounded-xl shadow-lg shadow-blue-500/20 transition-all text-sm">
          Node Sync Logs <ArrowUpRight className="h-4 w-4" />
        </button>
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
              <BarChart data={admissionsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
              <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
