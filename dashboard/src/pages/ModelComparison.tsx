import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend,
  LineChart,
  Line
} from 'recharts';
import { Award, Zap, ShieldCheck, HelpCircle } from 'lucide-react';
import { modelComparisonMetrics } from '../services/mockDataService';

// ROC data mapping
const rocCurveData = [
  { fpr: 0.0, centralized: 0.0, fedavg: 0.0, fedprox: 0.0, ditto: 0.0, fpdaf: 0.0 },
  { fpr: 0.1, centralized: 0.45, fedavg: 0.35, fedprox: 0.42, ditto: 0.40, fpdaf: 0.38 },
  { fpr: 0.2, centralized: 0.65, fedavg: 0.55, fedprox: 0.62, ditto: 0.61, fpdaf: 0.58 },
  { fpr: 0.3, centralized: 0.75, fedavg: 0.68, fedprox: 0.72, ditto: 0.71, fpdaf: 0.67 },
  { fpr: 0.4, centralized: 0.82, fedavg: 0.74, fedprox: 0.79, ditto: 0.78, fpdaf: 0.74 },
  { fpr: 0.5, centralized: 0.87, fedavg: 0.79, fedprox: 0.84, ditto: 0.83, fpdaf: 0.79 },
  { fpr: 0.6, centralized: 0.91, fedavg: 0.84, fedprox: 0.88, ditto: 0.87, fpdaf: 0.83 },
  { fpr: 0.7, centralized: 0.94, fedavg: 0.89, fedprox: 0.92, ditto: 0.91, fpdaf: 0.88 },
  { fpr: 0.8, centralized: 0.97, fedavg: 0.94, fedprox: 0.96, ditto: 0.95, fpdaf: 0.93 },
  { fpr: 0.9, centralized: 0.99, fedavg: 0.98, fedprox: 0.99, ditto: 0.99, fpdaf: 0.97 },
  { fpr: 1.0, centralized: 1.0, fedavg: 1.0, fedprox: 1.0, ditto: 1.0, fpdaf: 1.0 }
];

export const ModelComparison: React.FC = () => {
  return (
    <div className="p-8 space-y-8 overflow-y-auto max-h-[calc(100vh-4rem)]">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-extrabold text-slate-800 dark:text-white leading-tight">Decentralized Model Benchmark</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Five-way metrics verification overlay comparing centralized baselines and personalized federated algorithms</p>
      </div>

      {/* Model Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {modelComparisonMetrics.map((model, i) => {
          const isProposed = model.name.includes('Proposed');
          return (
            <div 
              key={i}
              className={`p-5 rounded-2xl shadow-sm border bg-white dark:bg-slate-800 flex flex-col justify-between transition-all ${
                isProposed 
                  ? 'border-red-500 ring-2 ring-red-500/20 scale-102 bg-gradient-to-b from-white to-red-50/10 dark:from-slate-800 dark:to-red-950/10' 
                  : 'border-slate-200 dark:border-slate-700'
              }`}
            >
              <div>
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-extrabold text-xs text-slate-800 dark:text-white leading-tight pr-2">{model.name}</h4>
                  {isProposed && <Award className="h-4 w-4 text-red-500 fill-red-500 shrink-0" />}
                </div>
                <span className="text-[10px] text-slate-400 block">Test set AUROC</span>
                <span className={`text-2xl font-black block mt-1 ${isProposed ? 'text-red-500' : 'text-slate-750 dark:text-slate-300'}`}>
                  {model.auroc.toFixed(4)}
                </span>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700 text-[10px] space-y-1.5 font-medium text-slate-500 dark:text-slate-400">
                <div className="flex justify-between">
                  <span>Accuracy:</span>
                  <span className="font-bold text-slate-700 dark:text-slate-350">{model.accuracy.toFixed(2)}%</span>
                </div>
                <div className="flex justify-between">
                  <span>F1-Score:</span>
                  <span className="font-bold text-slate-700 dark:text-slate-350">{model.f1.toFixed(4)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Comm Cost:</span>
                  <span className="font-bold text-slate-750 dark:text-slate-350">{model.commCost}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Graphs Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* ROC Overlay curve */}
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-6 rounded-2xl shadow-sm space-y-6">
          <div className="flex justify-between items-center">
            <h4 className="font-bold text-slate-800 dark:text-white text-base">Five-Way ROC Curve Overlay</h4>
            <span className="text-xs font-semibold text-slate-450 uppercase tracking-wider">Test Set Evaluator</span>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={rocCurveData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" className="dark:hidden" />
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" className="hidden dark:block" />
                <XAxis dataKey="fpr" stroke="#94a3b8" fontSize={11} name="FPR" />
                <YAxis stroke="#94a3b8" fontSize={11} domain={[0, 1.0]} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '12px' }} />
                <Legend wrapperStyle={{ fontSize: '10px', fontWeight: 500 }} />
                <Line type="monotone" dataKey="centralized" stroke="#64748b" strokeWidth={2.5} name="Centralized" dot={false} />
                <Line type="monotone" dataKey="fedavg" stroke="#e67e22" strokeWidth={2} name="FedAvg" dot={false} />
                <Line type="monotone" dataKey="fedprox" stroke="#3498db" strokeWidth={2} name="FedProx" dot={false} />
                <Line type="monotone" dataKey="ditto" stroke="#2ecc71" strokeWidth={2} name="Ditto P." dot={false} />
                <Line type="monotone" dataKey="fpdaf" stroke="#e74c3c" strokeWidth={3} name="FPDAF P. (Proposed)" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* F1 & Accuracy Bar Chart */}
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-6 rounded-2xl shadow-sm space-y-6">
          <div className="flex justify-between items-center">
            <h4 className="font-bold text-slate-800 dark:text-white text-base">Accuracy & F1 Score Comparison</h4>
            <span className="text-xs font-semibold text-slate-450 uppercase tracking-wider">Metrics Overlay</span>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={modelComparisonMetrics} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" className="dark:hidden" />
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" className="hidden dark:block" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={9} tickFormatter={(name) => name.split(' ')[0]} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '12px' }} />
                <Legend wrapperStyle={{ fontSize: '11px', fontWeight: 500 }} />
                <Bar dataKey="accuracy" fill="#3b82f6" name="Accuracy (%)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="recall" fill="#ef4444" name="Recall / Sensitivity (%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Communication & Time Efficiency Table */}
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-200 dark:border-slate-700">
          <h4 className="font-bold text-slate-800 dark:text-white text-base flex items-center gap-2">
            <Zap className="h-5 w-5 text-amber-500 fill-amber-500/20" /> Efficiency and Communication Savings Telemetry
          </h4>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-700">
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">Model Configuration</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">Total Comm Bandwidth</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">Aggregate Training Time</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">Drift Adaptation Latency</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">Privacy Safeguards</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700 text-xs font-semibold">
              {modelComparisonMetrics.map((model, i) => {
                const isProposed = model.name.includes('Proposed');
                return (
                  <tr key={i} className={isProposed ? 'bg-red-500/5 dark:bg-red-950/10' : ''}>
                    <td className="px-6 py-4 text-slate-800 dark:text-slate-200">{model.name}</td>
                    <td className="px-6 py-4 text-slate-500 dark:text-slate-400">{model.commCost}</td>
                    <td className="px-6 py-4 text-slate-500 dark:text-slate-400">{model.trainTime}</td>
                    <td className="px-6 py-4 text-slate-500 dark:text-slate-400">{model.driftAdaptTime}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        model.name.includes('Centralized')
                          ? 'bg-red-100 text-red-700 dark:bg-red-900/30'
                          : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30'
                      }`}>
                        {model.name.includes('Centralized') ? 'No (Data Shared)' : 'Yes (Decentralized)'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
