import React, { useState, useEffect } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell 
} from 'recharts';
import { ShieldAlert, BookOpen, AlertTriangle, Eye, Sliders } from 'lucide-react';
import { fetchPatientAttention, getFeatureImportance } from '../services/mockDataService';
import type { Patient, AttentionData } from '../services/mockDataService';

interface ExplainableAIProps {
  patient: Patient;
}

export const ExplainableAI: React.FC<ExplainableAIProps> = ({ patient }) => {
  const [attentionData, setAttentionData] = useState<AttentionData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedHour, setSelectedHour] = useState<number>(20);
  const featureImportance = getFeatureImportance();
  const isHighRisk = patient.riskLevel === 'High';

  useEffect(() => {
    setIsLoading(true);
    fetchPatientAttention(patient.id).then((data) => {
      setAttentionData(data);
      if (data.length > 0) {
        setSelectedHour(isHighRisk ? 20 : 12);
      }
      setIsLoading(false);
    });
  }, [patient.id, isHighRisk]);

  if (isLoading || attentionData.length === 0) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[300px]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  const activeAttention = attentionData.find(a => a.hour === selectedHour) || attentionData[0];

  return (
    <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(100vh-3.5rem)] font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-white tracking-tight">Clinical Sepsis Explainability (XAI)</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Saliency Attributions and Temporal Self-Attention Maps for Bedside Target: {patient.id}</p>
        </div>

        <div className="flex items-center gap-2 bg-teal-500/10 text-teal-400 px-3 py-1.5 rounded-xl border border-teal-500/20 text-xs font-bold">
          <Eye className="h-4 w-4" /> Multi-Head Attention Head Active
        </div>
      </div>

      {/* Primary Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Side: XAI Summary & Explanation panel */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-[#0d1829] border border-slate-200 dark:border-[#1a2744] p-6 rounded-2xl space-y-5 shadow-sm">
            <h3 className="font-bold text-slate-800 dark:text-white text-sm flex items-center gap-2">
              <BookOpen className="h-4.5 w-4.5 text-teal-400" /> Sepsis Interpretability Report
            </h3>
            
            <div className={`p-4 rounded-xl border flex items-center gap-3.5 ${
              isHighRisk 
                ? 'bg-red-500/10 border-red-500/30 text-red-500' 
                : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
            }`}>
              <div className={`p-2.5 rounded-xl shrink-0 ${isHighRisk ? 'bg-red-500 text-white' : 'bg-emerald-500 text-white'}`}>
                <ShieldAlert className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-bold text-xs leading-tight">FPDAF Personalized Model</h4>
                <span className="text-[10px] opacity-80 font-semibold block mt-0.5">
                  Diagnosis: {isHighRisk ? 'Sepsis (Positive Onset Flagged)' : 'Normal (Negative)'}
                </span>
              </div>
            </div>

            {/* Interactive Scrubber Detail Card */}
            <div className="bg-slate-50 dark:bg-[#0a1323] border border-slate-200 dark:border-[#1a2744] p-4 rounded-xl space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Hour {selectedHour} Detail Snapshot</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  selectedHour >= 17 && selectedHour <= 22 && isHighRisk 
                    ? 'bg-red-500 text-white' 
                    : 'bg-teal-500/20 text-teal-400'
                }`}>
                  Weight: {activeAttention.attentionScore}
                </span>
              </div>

              <div className="space-y-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-400">Heart Rate (HR):</span>
                  <span className={selectedHour >= 17 && isHighRisk ? 'text-red-400 font-bold' : ''}>
                    {selectedHour >= 17 && isHighRisk ? '124 bpm (High)' : '82 bpm (Normal)'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Systolic BP (SBP):</span>
                  <span className={selectedHour >= 17 && isHighRisk ? 'text-amber-400 font-bold' : ''}>
                    {selectedHour >= 17 && isHighRisk ? '94 mmHg (Low)' : '120 mmHg (Normal)'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Oxygen Saturation (SpO₂):</span>
                  <span className={selectedHour >= 17 && isHighRisk ? 'text-red-400 font-bold' : ''}>
                    {selectedHour >= 17 && isHighRisk ? '91% (Low)' : '98% (Normal)'}
                  </span>
                </div>
              </div>
            </div>

            {/* Structured Explanation Panel */}
            <div className="bg-slate-50 dark:bg-[#0a1323] border border-slate-200 dark:border-[#1a2744] p-4 rounded-xl space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Bedside Attribution Rationale</span>
              <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-350 font-medium">
                {isHighRisk ? (
                  <>
                    The model focused heavily on abnormal <strong>Heart Rate (&gt;120 bpm)</strong> and <strong>SpO₂ (&lt;92%)</strong> during <strong>Hours 17–22</strong>. 
                    Simultaneous cardiac acceleration and tissue hypoxia triggered high query-key inner products in the BiLSTM self-attention layer.
                  </>
                ) : (
                  <>
                    The model analyzed the 24-hour vitals sequence and verified stable parameters across all window frames. 
                    No focal temporal self-attentions or physiological boundary violations were observed.
                  </>
                )}
              </p>
            </div>
            
            {/* Clinical Trust Check */}
            <div className="flex gap-2.5 items-start text-xs text-slate-400 leading-relaxed bg-teal-500/10 p-3.5 rounded-xl border border-teal-500/20">
              <AlertTriangle className="h-4 w-4 text-teal-400 shrink-0 mt-0.5" />
              <span>
                Attention scores are computed across the 24-hour sliding telemetry window to establish clinician trust and transparency.
              </span>
            </div>
          </div>
        </div>

        {/* Right Side: Charts Grid & Interactive Scrubber */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Interactive Timeline Scrubber & Bar Chart */}
          <div className="bg-white dark:bg-[#0d1829] border border-slate-200 dark:border-[#1a2744] p-6 rounded-2xl space-y-5 shadow-sm">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Sliders className="h-4 w-4 text-teal-400" />
                <h4 className="font-bold text-slate-800 dark:text-white text-sm">Temporal Self-Attention Weight Timeline</h4>
              </div>
              <span className="text-[10px] font-bold text-teal-400 bg-teal-500/10 px-3 py-1 rounded-full border border-teal-500/20">
                Selected Hour: {selectedHour}
              </span>
            </div>

            {/* Slider Control */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-[10px] font-bold text-slate-400">
                <span>Hour 1 (Admission)</span>
                <span>Hour 12</span>
                <span>Hour 24 (Current)</span>
              </div>
              <input
                type="range"
                min={1}
                max={24}
                value={selectedHour}
                onChange={(e) => setSelectedHour(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 dark:bg-[#1a2744] rounded-lg appearance-none cursor-pointer accent-teal-500"
              />
            </div>

            {/* Bar Chart */}
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={attentionData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:hidden" />
                  <CartesianGrid strokeDasharray="3 3" stroke="#1a2744" className="hidden dark:block" />
                  <XAxis dataKey="hour" stroke="#94a3b8" fontSize={10} />
                  <YAxis stroke="#94a3b8" fontSize={10} domain={[0, 0.2]} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0d1829', border: '1px solid #1a2744', borderRadius: '12px', fontSize: '11px' }}
                    labelStyle={{ color: '#fff', fontSize: '11px', fontWeight: 700 }}
                  />
                  <Bar dataKey="attentionScore" fill="#0d9488" radius={[4, 4, 0, 0]} name="Attention weight">
                    {attentionData.map((entry, index) => {
                      const isSelected = entry.hour === selectedHour;
                      const isTriggerZone = isHighRisk && entry.hour >= 17 && entry.hour <= 22;
                      return (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={isSelected ? '#38bdf8' : isTriggerZone ? '#ef4444' : '#0d9488'} 
                        />
                      );
                    })}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {isHighRisk && (
              <div className="text-center text-xs text-red-500 font-bold bg-red-500/10 p-3 rounded-xl border border-red-500/30">
                🚨 High Attention Trigger Zone detected during ICU hours 17–22!
              </div>
            )}
          </div>

          {/* Feature Importance Attributions */}
          <div className="bg-white dark:bg-[#0d1829] border border-slate-200 dark:border-[#1a2744] p-6 rounded-2xl space-y-4 shadow-sm">
            <h4 className="font-bold text-slate-800 dark:text-white text-sm">Multivariate Feature Importance Contribution</h4>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  layout="vertical"
                  data={featureImportance}
                  margin={{ top: 5, right: 10, left: 20, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:hidden" />
                  <CartesianGrid strokeDasharray="3 3" stroke="#1a2744" className="hidden dark:block" />
                  <XAxis type="number" stroke="#94a3b8" fontSize={10} domain={[0, 50]} />
                  <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={10} width={130} />
                  <Tooltip contentStyle={{ backgroundColor: '#0d1829', border: '1px solid #1a2744', borderRadius: '12px', fontSize: '11px' }} />
                  <Bar dataKey="importance" fill="#0d9488" radius={[0, 4, 4, 0]} barSize={18}>
                    {featureImportance.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
