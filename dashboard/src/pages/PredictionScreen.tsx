import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, Award, Activity, Heart, ArrowRight, ShieldCheck } from 'lucide-react';
import { Patient } from '../services/mockDataService';

interface PredictionScreenProps {
  patient: Patient;
  setActiveTab: (tab: string) => void;
}

export const PredictionScreen: React.FC<PredictionScreenProps> = ({ patient, setActiveTab }) => {
  const [isPredicting, setIsPredicting] = useState(false);
  const [predictionRun, setPredictionRun] = useState(false);

  const triggerPredict = () => {
    setIsPredicting(true);
    setTimeout(() => {
      setIsPredicting(false);
      setPredictionRun(true);
    }, 2000);
  };

  const riskScore = patient.scores.fpdaf;
  const isHighRisk = patient.riskLevel === 'High';

  return (
    <div className="p-8 space-y-6 overflow-y-auto max-h-[calc(100vh-4rem)]">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-extrabold text-slate-800 dark:text-white leading-tight">Bedside Diagnostic Predictor</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Execute proposed FPDAF Sepsis prediction pipeline for Active Bed: {patient.id}</p>
      </div>

      {/* Patient Identification Card */}
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-6 rounded-2xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Currently Diagnosing</span>
          <h3 className="font-extrabold text-slate-800 dark:text-white text-lg">{patient.id}</h3>
          <span className="text-xs text-slate-400 block">{patient.age}y / {patient.gender} — {patient.hospital}</span>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setActiveTab('patients')}
            className="px-4 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 text-xs font-bold rounded-xl text-slate-600 dark:text-slate-300 transition-all"
          >
            Change Patient
          </button>
          <button 
            onClick={triggerPredict}
            disabled={isPredicting}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2.5 rounded-xl shadow-lg shadow-blue-500/20 transition-all text-xs disabled:opacity-50"
          >
            <Activity className="h-4 w-4" /> Run Prediction
          </button>
        </div>
      </div>

      {/* Animation Area */}
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-8 rounded-2xl shadow-sm min-h-[400px] flex flex-col items-center justify-center relative">
        <AnimatePresence mode="wait">
          {/* 1. Initial State */}
          {!isPredicting && !predictionRun && (
            <motion.div 
              key="initial"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center space-y-4 max-w-sm"
            >
              <div className="h-16 w-16 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto text-blue-600 dark:text-blue-400">
                <Activity className="h-8 w-8 text-blue-500" />
              </div>
              <h4 className="font-extrabold text-slate-800 dark:text-white text-base">Proposed FPDAF Prediction Engine</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-normal">
                Click "Run Prediction" above to analyze the 24-hour multivariate vital signs log using local personalized weights.
              </p>
            </motion.div>
          )}

          {/* 2. Loading State */}
          {isPredicting && (
            <motion.div 
              key="predicting"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center space-y-6"
            >
              <div className="relative h-20 w-20 mx-auto">
                <div className="absolute inset-0 rounded-full border-4 border-slate-100 dark:border-slate-800"></div>
                <div className="absolute inset-0 rounded-full border-4 border-t-blue-500 border-r-blue-500 animate-spin"></div>
                <Heart className="absolute left-6 top-6 h-8 w-8 text-red-500 animate-pulse" />
              </div>
              <div className="space-y-2">
                <h4 className="font-bold text-slate-800 dark:text-white text-sm">Aggregating Local Weights...</h4>
                <p className="text-xs text-slate-400 max-w-xs leading-normal">
                  Evaluating temporal self-attentions and computing softmax logits at the client node.
                </p>
              </div>
            </motion.div>
          )}

          {/* 3. Result State */}
          {!isPredicting && predictionRun && (
            <motion.div 
              key="result"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="w-full max-w-md mx-auto space-y-6"
            >
              {/* Dial Score Header */}
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-slate-800 dark:text-white text-sm">Diagnostic Alert Forecast</h4>
                <span className="text-xs font-semibold text-slate-400">FPDAF Local Model v1.0.4</span>
              </div>

              {/* Central Risk Indicator */}
              <div className={`p-6 rounded-2xl border flex items-center gap-5 ${
                isHighRisk 
                  ? 'bg-red-50/50 dark:bg-red-950/20 border-red-200 dark:border-red-800' 
                  : 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800'
              }`}>
                <div className={`p-4 rounded-xl shrink-0 ${isHighRisk ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-600'}`}>
                  {isHighRisk ? <ShieldAlert className="h-8 w-8" /> : <ShieldCheck className="h-8 w-8" />}
                </div>
                <div>
                  <h3 className={`font-extrabold text-lg leading-tight ${isHighRisk ? 'text-red-700 dark:text-red-400' : 'text-emerald-700 dark:text-emerald-400'}`}>
                    {isHighRisk ? 'High Sepsis Risk Alert' : 'Low Sepsis Risk Detected'}
                  </h3>
                  <span className="text-xs text-slate-400 font-medium block mt-1">Confidence Score: {patient.confidence}%</span>
                </div>
              </div>

              {/* Metrics cards */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl space-y-1">
                  <span className="text-xs text-slate-400 block font-medium">Sepsis Probability Logit</span>
                  <h3 className="font-black text-2xl text-slate-800 dark:text-white">{(riskScore * 100).toFixed(0)}%</h3>
                </div>
                <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl space-y-1">
                  <span className="text-xs text-slate-400 block font-medium">Model Classification</span>
                  <h3 className={`font-black text-lg ${isHighRisk ? 'text-red-500' : 'text-emerald-500'}`}>
                    {isHighRisk ? 'Sepsis (Positive)' : 'Normal (Negative)'}
                  </h3>
                </div>
              </div>

              {/* Action recommendations */}
              <div className="bg-slate-50 dark:bg-slate-900/60 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
                <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500">Clinician Directives</h5>
                <ul className="text-xs text-slate-600 dark:text-slate-300 font-medium space-y-2 list-disc pl-4">
                  {isHighRisk ? (
                    <>
                      <li>Initiate fluid resuscitation protocol immediately (30 mL/kg crystalloid).</li>
                      <li>Draw blood cultures and administer broad-spectrum IV antibiotics within 1 hour.</li>
                      <li>Update ICU Bedside monitor alert bounds for active observation.</li>
                    </>
                  ) : (
                    <>
                      <li>Maintain routine ICU hourly vitals telemetry checking.</li>
                      <li>No sepsis interventions indicated by consensus model.</li>
                    </>
                  )}
                </ul>
              </div>

              {/* Explain button */}
              <button
                onClick={() => setActiveTab('xai')}
                className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-blue-500/20 transition-all text-xs"
              >
                Inspect Clinical Explainability (XAI) <ArrowRight className="h-4 w-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
