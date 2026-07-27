import React, { useState } from 'react';
import { ShieldAlert, Activity, ArrowRight, ShieldCheck, CheckSquare, Square, Printer, Sparkles } from 'lucide-react';
import type { Patient } from '../services/mockDataService';

interface PredictionScreenProps {
  patient: Patient;
  setActiveTab: (tab: string) => void;
}

export const PredictionScreen: React.FC<PredictionScreenProps> = ({ patient, setActiveTab }) => {
  const [isPredicting, setIsPredicting] = useState(false);
  const [bundleChecklist, setBundleChecklist] = useState<{ [key: string]: boolean }>({
    bld: false,
    lac: false,
    abx: false,
    fld: false,
    vaso: false
  });

  const toggleCheck = (key: string) => {
    setBundleChecklist(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const triggerPredict = () => {
    setIsPredicting(true);
    setTimeout(() => {
      setIsPredicting(false);
    }, 1200);
  };

  const riskScore = patient.scores.fpdaf;
  const isHighRisk = patient.riskLevel === 'High';
  const riskPercentage = Math.round(riskScore * 100);

  return (
    <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(100vh-3.5rem)] font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-white tracking-tight">Bedside Diagnostic Predictor Engine</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Continuous 24-Hour Multivariate Inference — FPDAF Personalized Local Head</p>
        </div>
        
        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-[#152238] border border-slate-200 dark:border-[#1a2744] text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-[#1c2c48] transition-all"
        >
          <Printer className="h-4 w-4 text-teal-400" /> Print Diagnostic Report
        </button>
      </div>

      {/* Patient Identification Card */}
      <div className="bg-white dark:bg-[#0d1829] border border-slate-200 dark:border-[#1a2744] p-5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 font-bold text-lg">
            {patient.id.split('-')[1]}
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Active ICU Bedside Target</span>
            <h3 className="font-extrabold text-base text-slate-800 dark:text-white leading-tight">{patient.id}</h3>
            <span className="text-xs text-slate-400 block mt-0.5">{patient.age}y / {patient.gender} &bull; {patient.ward} &bull; {patient.hospital}</span>
          </div>
        </div>

        <div className="flex gap-2.5">
          <button 
            onClick={() => setActiveTab('patients')}
            className="px-4 py-2 border border-slate-200 dark:border-[#1a2744] bg-white dark:bg-[#0d1829] hover:bg-slate-50 dark:hover:bg-[#152238] text-xs font-bold rounded-xl text-slate-700 dark:text-slate-300 transition-all"
          >
            Switch Patient
          </button>
          <button 
            onClick={triggerPredict}
            disabled={isPredicting}
            className="flex items-center gap-2 bg-teal-600 hover:bg-teal-500 text-white font-bold px-4 py-2 rounded-xl transition-all text-xs shadow-lg shadow-teal-600/20 disabled:opacity-50"
          >
            <Activity className="h-4 w-4" /> Run FPDAF Inference
          </button>
        </div>
      </div>

      {/* Main Diagnostic Dashboard Canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Col: Diagnostic Risk Dial & Classification */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-[#0d1829] border border-slate-200 dark:border-[#1a2744] p-6 rounded-2xl space-y-6 flex flex-col items-center justify-center text-center shadow-sm">
            <div className="w-full flex justify-between items-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">FPDAF Forecast Ring</span>
              <span className="text-[10px] bg-teal-500/10 text-teal-400 font-bold px-2 py-0.5 rounded-full border border-teal-500/20">CSSP Local Head</span>
            </div>

            {/* Glowing Ring Gauge */}
            <div className="relative h-44 w-44 flex items-center justify-center">
              <svg className="h-full w-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="8" className="text-slate-100 dark:text-slate-800" fill="transparent" />
                <circle 
                  cx="50" 
                  cy="50" 
                  r="40" 
                  stroke="currentColor" 
                  strokeWidth="8" 
                  strokeDasharray={`${2 * Math.PI * 40}`}
                  strokeDashoffset={`${2 * Math.PI * 40 * (1 - riskPercentage / 100)}`}
                  strokeLinecap="round"
                  className={`transition-all duration-1000 ${isHighRisk ? 'text-red-500' : riskPercentage > 40 ? 'text-amber-500' : 'text-emerald-500'}`} 
                  fill="transparent" 
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={`text-4xl font-extrabold tracking-tight ${isHighRisk ? 'text-red-500' : 'text-emerald-400'}`}>
                  {riskPercentage}%
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mt-1">Sepsis Probability</span>
              </div>
            </div>

            {/* Classification Status */}
            <div className={`w-full p-4 rounded-xl border flex items-center gap-3 text-left ${
              isHighRisk 
                ? 'bg-red-500/10 border-red-500/30 text-red-500' 
                : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
            }`}>
              <div className={`p-2.5 rounded-xl shrink-0 ${isHighRisk ? 'bg-red-500 text-white' : 'bg-emerald-500 text-white'}`}>
                {isHighRisk ? <ShieldAlert className="h-5 w-5" /> : <ShieldCheck className="h-5 w-5" />}
              </div>
              <div>
                <h4 className="font-bold text-sm leading-tight">
                  {isHighRisk ? 'High Risk Sepsis Alert' : 'Normal / Low Risk'}
                </h4>
                <span className="text-[10px] opacity-80 font-medium block mt-0.5">
                  Confidence: {patient.confidence}% &bull; Sensor Quality: 99.4%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Hour-1 Sepsis Resuscitation Bundle & Directives */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Hour-1 Sepsis Bundle Checklist */}
          <div className="bg-white dark:bg-[#0d1829] border border-slate-200 dark:border-[#1a2744] p-6 rounded-2xl space-y-5 shadow-sm">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-bold text-base text-slate-800 dark:text-white flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-teal-400" /> Hour-1 Sepsis Resuscitation Bundle
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">Surviving Sepsis Campaign (SSC) International Clinical Directives</p>
              </div>
              <span className="text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2.5 py-1 rounded-full">
                ICU Immediate Protocol
              </span>
            </div>

            <div className="space-y-3">
              {[
                { key: 'bld', label: 'Draw Blood Cultures prior to initiating antimicrobial therapy', time: 'Within 30 mins' },
                { key: 'lac', label: 'Measure initial Blood Lactate levels & re-measure if elevated (> 2 mmol/L)', time: 'Immediate' },
                { key: 'abx', label: 'Administer Empirical Broad-Spectrum IV Antibiotics', time: 'Within 60 mins' },
                { key: 'fld', label: 'Begin rapid administration of 30 mL/kg crystalloid fluid for hypotension', time: 'Within 60 mins' },
                { key: 'vaso', label: 'Apply Vasopressors (Norepinephrine) if hypotensive during/after fluid resuscitation', time: 'As needed' }
              ].map(item => (
                <div 
                  key={item.key}
                  onClick={() => toggleCheck(item.key)}
                  className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                    bundleChecklist[item.key]
                      ? 'bg-teal-500/10 border-teal-500/40 text-teal-400'
                      : 'bg-slate-50 dark:bg-[#0a1323] border-slate-200 dark:border-[#1a2744] text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {bundleChecklist[item.key] ? (
                      <CheckSquare className="h-5 w-5 text-teal-400 shrink-0" />
                    ) : (
                      <Square className="h-5 w-5 text-slate-400 shrink-0" />
                    )}
                    <span className={`text-xs font-semibold ${bundleChecklist[item.key] ? 'line-through opacity-70' : ''}`}>
                      {item.label}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 shrink-0 ml-2">{item.time}</span>
                </div>
              ))}
            </div>

            {/* Action button to navigate to Explainability */}
            <button
              onClick={() => setActiveTab('xai')}
              className="w-full flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-500 text-white font-bold py-3 rounded-xl shadow-lg shadow-teal-600/20 transition-all text-xs"
            >
              Inspect Temporal Explainability Heatmap (XAI) <ArrowRight className="h-4 w-4" />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

