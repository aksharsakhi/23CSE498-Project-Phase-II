import React, { useState, useEffect } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend,
  ReferenceLine
} from 'recharts';
import { ShieldAlert, LineChart as ChartIcon, Zap, ShieldCheck, Flame, RotateCcw } from 'lucide-react';
import { fetchDriftData } from '../services/mockDataService';
import type { DriftRecord } from '../services/mockDataService';

export const DriftMonitor: React.FC = () => {
  const [cusumData, setCusumData] = useState<DriftRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const threshold = 3.0;

  useEffect(() => {
    setIsLoading(true);
    fetchDriftData().then((data) => {
      setCusumData(data);
      setIsLoading(false);
    });
  }, []);

  const handleInjectDrift = () => {
    setCusumData(prev => {
      const updated = [...prev];
      const lastIndex = updated.length - 1;
      updated[lastIndex] = {
        ...updated[lastIndex],
        client0: 3.85 // Exceeds threshold!
      };
      return updated;
    });
  };

  const handleResetDrift = () => {
    fetchDriftData().then((data) => setCusumData(data));
  };

  if (isLoading || cusumData.length === 0) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[300px]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  const latestCusum = cusumData[cusumData.length - 1];

  const nodeStatus = [
    { name: 'Hospital A (Client 0)', value: latestCusum.client0, status: latestCusum.client0 > threshold ? 'Drift Alert' : 'Stable' },
    { name: 'Hospital B (Client 1)', value: latestCusum.client1, status: latestCusum.client1 > threshold ? 'Drift Alert' : 'Stable' },
    { name: 'Hospital C (Client 2)', value: latestCusum.client2, status: latestCusum.client2 > threshold ? 'Drift Alert' : 'Stable' }
  ];

  return (
    <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(100vh-3.5rem)] font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-white tracking-tight">Online Concept Drift Monitoring</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Cumulative Sum (CUSUM) Residuals Audit & Client-Side Selective Personalization (CSSP)</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleInjectDrift}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500 text-xs font-bold hover:bg-red-500/20 transition-all shadow-sm"
          >
            <Flame className="h-4 w-4" /> Inject Population Drift
          </button>

          <button
            onClick={handleResetDrift}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-[#152238] border border-slate-200 dark:border-[#1a2744] text-slate-700 dark:text-slate-200 text-xs font-bold hover:bg-slate-200 dark:hover:bg-[#1c2c48] transition-all"
          >
            <RotateCcw className="h-4 w-4 text-teal-400" /> Recalibrate CSSP
          </button>
        </div>
      </div>

      {/* Grid of Hospital Node CUSUM Statuses */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {nodeStatus.map((node, i) => (
          <div 
            key={i} 
            className={`border p-5 rounded-2xl bg-white dark:bg-[#0d1829] flex flex-col justify-between min-h-[130px] transition-all shadow-sm ${
              node.value > threshold 
                ? 'border-red-500/50 shadow-red-500/10' 
                : 'border-slate-200 dark:border-[#1a2744]'
            }`}
          >
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-bold text-xs text-slate-800 dark:text-white leading-tight">{node.name}</h4>
                <span className="text-[10px] text-slate-400 block mt-0.5">Online CUSUM Monitor</span>
              </div>
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                node.status === 'Drift Alert'
                  ? 'bg-red-500/10 text-red-500 border border-red-500/30'
                  : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
              }`}>
                {node.status === 'Drift Alert' ? <ShieldAlert className="h-3.5 w-3.5" /> : <ShieldCheck className="h-3.5 w-3.5" />}
                {node.status}
              </span>
            </div>
            
            <div className="mt-4 flex justify-between items-end">
              <div>
                <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">CUSUM Residual Score</span>
                <span className={`text-2xl font-extrabold ${node.value > threshold ? 'text-red-500' : 'text-slate-800 dark:text-white'}`}>
                  {node.value.toFixed(2)}
                </span>
              </div>
              <span className="text-[10px] font-bold text-slate-400 bg-slate-100 dark:bg-[#0a1323] px-2 py-1 rounded-lg">Limit: {threshold.toFixed(1)}</span>
            </div>
          </div>
        ))}
      </div>

      {/* CUSUM Drift Timeline Chart */}
      <div className="bg-white dark:bg-[#0d1829] border border-slate-200 dark:border-[#1a2744] p-6 rounded-2xl space-y-4 shadow-sm">
        <div className="flex justify-between items-center">
          <h3 className="font-bold text-slate-800 dark:text-white text-sm flex items-center gap-2">
            <ChartIcon className="h-4 w-4 text-teal-400" /> CUSUM Validation Error Log Curves (Rounds 1–10)
          </h3>
          <span className="text-[10px] font-bold text-slate-400 bg-teal-500/10 text-teal-400 px-3 py-1 rounded-full border border-teal-500/20">
            Slack Parameter &kappa; = 0.02
          </span>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={cusumData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:hidden" />
              <CartesianGrid strokeDasharray="3 3" stroke="#1a2744" className="hidden dark:block" />
              <XAxis dataKey="round" stroke="#94a3b8" fontSize={10} />
              <YAxis stroke="#94a3b8" fontSize={10} domain={[0, 5]} />
              <Tooltip contentStyle={{ backgroundColor: '#0d1829', border: '1px solid #1a2744', borderRadius: '12px', fontSize: '11px' }} />
              <Legend wrapperStyle={{ fontSize: '10px' }} />
              <ReferenceLine y={threshold} stroke="#ef4444" strokeDasharray="4 4" label={{ value: 'Threshold Limit: 3.0', position: 'insideBottomRight', fill: '#ef4444', fontSize: 10, fontWeight: 'bold' }} />
              <Line type="monotone" dataKey="client0" stroke="#0d9488" strokeWidth={2} name="Hospital A (Client 0)" dot={{ r: 4 }} activeDot={{ r: 6 }} />
              <Line type="monotone" dataKey="client1" stroke="#f97316" strokeWidth={2} name="Hospital B (Client 1)" dot={{ r: 4 }} />
              <Line type="monotone" dataKey="client2" stroke="#10b981" strokeWidth={2} name="Hospital C (Client 2)" dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Selective Personalization Mechanism Card */}
      <div className="bg-white dark:bg-[#0d1829] border border-slate-200 dark:border-[#1a2744] p-6 rounded-2xl space-y-4 shadow-sm">
        <h4 className="font-bold text-slate-800 dark:text-white text-sm flex items-center gap-2">
          <Zap className="h-4.5 w-4.5 text-amber-400" /> Client-Side Selective Personalization (CSSP) Architecture
        </h4>
        <div className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium space-y-3">
          <p>
            When a hospital node's running CUSUM score exceeds the threshold ($h = 3.0$), it indicates that the hospital's local ICU patient population has drifted significantly from global consensus demographics (concept drift).
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
            <div className="bg-slate-50 dark:bg-[#0a1323] p-4 rounded-xl border border-slate-200 dark:border-[#1a2744] space-y-1">
              <span className="font-bold text-teal-400 block text-xs">1. Backbone Freeze</span>
              <p className="text-[11px] text-slate-400 leading-tight">Shared BiLSTM feature extractor layers are locked to prevent global feature corruption.</p>
            </div>
            <div className="bg-slate-50 dark:bg-[#0a1323] p-4 rounded-xl border border-slate-200 dark:border-[#1a2744] space-y-1">
              <span className="font-bold text-amber-400 block text-xs">2. Classifier Head Adaptation</span>
              <p className="text-[11px] text-slate-400 leading-tight">Local SGD steps adjust only the dense classification head using regional patient loss.</p>
            </div>
            <div className="bg-slate-50 dark:bg-[#0a1323] p-4 rounded-xl border border-slate-200 dark:border-[#1a2744] space-y-1">
              <span className="font-bold text-emerald-400 block text-xs">3. Zero-Upload Bypass</span>
              <p className="text-[11px] text-slate-400 leading-tight">Node skips uploading model weights for 1 round, reducing network bandwidth by 38%.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

