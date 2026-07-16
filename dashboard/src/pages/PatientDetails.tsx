import { useState } from 'react';
import { 
  Heart, 
  Activity, 
  Thermometer, 
  ArrowLeft, 
  ArrowRight,
  Stethoscope
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { useEffect } from 'react';
import { fetchPatientVitals } from '../services/mockDataService';
import type { Patient, VitalSignRecord } from '../services/mockDataService';

interface PatientDetailsProps {
  patient: Patient;
  setActiveTab: (tab: string) => void;
}

export const PatientDetails: React.FC<PatientDetailsProps> = ({ patient, setActiveTab }) => {
  const [vitals, setVitals] = useState<VitalSignRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeMetric, setActiveMetric] = useState<'all' | 'hr' | 'bp' | 'spo2'>('all');

  useEffect(() => {
    setIsLoading(true);
    fetchPatientVitals(patient.id).then((data) => {
      setVitals(data);
      setIsLoading(false);
    });
  }, [patient.id]);

  if (isLoading || vitals.length === 0) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6 overflow-y-auto max-h-[calc(100vh-4rem)]">
      {/* Navigation header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => setActiveTab('patients')}
          className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div>
          <h2 className="text-2xl font-extrabold text-slate-800 dark:text-white leading-tight">Patient Clinical Records</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">ICU bed vital signs monitoring logs for Patient: {patient.id}</p>
        </div>
      </div>

      {/* Bedside Info Card */}
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-6 rounded-2xl shadow-sm grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="space-y-1">
          <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Admission ID</span>
          <h4 className="font-extrabold text-slate-800 dark:text-white text-base">{patient.id}</h4>
          <span className="text-xs text-slate-500 dark:text-slate-400 block">{patient.age}y / {patient.gender}</span>
        </div>

        <div className="space-y-1">
          <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">ICU Ward Location</span>
          <h4 className="font-bold text-slate-700 dark:text-slate-350 text-base">{patient.ward}</h4>
          <span className="text-xs text-slate-400 block">{patient.hospital}</span>
        </div>

        <div className="space-y-1">
          <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Sepsis Alert Risk</span>
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
            patient.riskLevel === 'High'
              ? 'bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400'
              : 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400'
          }`}>
            {patient.riskLevel} Risk Profile
          </span>
        </div>

        <div className="flex items-center md:justify-end">
          <button
            onClick={() => setActiveTab('prediction')}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2.5 rounded-xl shadow-lg shadow-blue-500/20 transition-all text-xs"
          >
            Sepsis Predict Diagnostic <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Vital Metric Selection */}
      <div className="flex gap-3 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-xl w-fit">
        <button
          onClick={() => setActiveMetric('all')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
            activeMetric === 'all' ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-white shadow-sm' : 'text-slate-500'
          }`}
        >
          Bedside Monitor (All)
        </button>
        <button
          onClick={() => setActiveMetric('hr')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
            activeMetric === 'hr' ? 'bg-white dark:bg-slate-700 text-red-500 dark:text-white shadow-sm' : 'text-slate-500'
          }`}
        >
          Heart Rate (HR)
        </button>
        <button
          onClick={() => setActiveMetric('bp')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
            activeMetric === 'bp' ? 'bg-white dark:bg-slate-700 text-orange-500 dark:text-white shadow-sm' : 'text-slate-500'
          }`}
        >
          Blood Pressure
        </button>
        <button
          onClick={() => setActiveMetric('spo2')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
            activeMetric === 'spo2' ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-white shadow-sm' : 'text-slate-500'
          }`}
        >
          Oxygen (SpO₂)
        </button>
      </div>

      {/* Recharts Vital Graphs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {(activeMetric === 'all' || activeMetric === 'hr') && (
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-6 rounded-2xl shadow-sm space-y-4">
            <div className="flex justify-between items-center text-red-500">
              <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Heart className="h-4 w-4 animate-pulse" /> Heart Rate (HR)
              </span>
              <span className="text-sm font-extrabold">{vitals[vitals.length - 1].heartRate} bpm</span>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={vitals} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" className="dark:hidden" />
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" className="hidden dark:block" />
                  <XAxis dataKey="hour" stroke="#94a3b8" fontSize={11} name="Hour" />
                  <YAxis stroke="#94a3b8" fontSize={11} domain={[50, 150]} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '12px' }} />
                  <Line type="monotone" dataKey="heartRate" stroke="#ef4444" strokeWidth={2.5} dot={false} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {(activeMetric === 'all' || activeMetric === 'bp') && (
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-6 rounded-2xl shadow-sm space-y-4">
            <div className="flex justify-between items-center text-orange-500">
              <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Activity className="h-4 w-4" /> Systolic Blood Pressure (SBP)
              </span>
              <span className="text-sm font-extrabold">{vitals[vitals.length - 1].bloodPressure} mmHg</span>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={vitals} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" className="dark:hidden" />
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" className="hidden dark:block" />
                  <XAxis dataKey="hour" stroke="#94a3b8" fontSize={11} />
                  <YAxis stroke="#94a3b8" fontSize={11} domain={[70, 160]} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '12px' }} />
                  <Line type="monotone" dataKey="bloodPressure" stroke="#f97316" strokeWidth={2.5} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {(activeMetric === 'all' || activeMetric === 'spo2') && (
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-6 rounded-2xl shadow-sm space-y-4">
            <div className="flex justify-between items-center text-blue-500">
              <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Stethoscope className="h-4 w-4" /> Oxygen Saturation (SpO₂)
              </span>
              <span className="text-sm font-extrabold">{vitals[vitals.length - 1].spo2} %</span>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={vitals} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" className="dark:hidden" />
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" className="hidden dark:block" />
                  <XAxis dataKey="hour" stroke="#94a3b8" fontSize={11} />
                  <YAxis stroke="#94a3b8" fontSize={11} domain={[85, 100]} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '12px' }} />
                  <Line type="monotone" dataKey="spo2" stroke="#3b82f6" strokeWidth={2.5} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {activeMetric === 'all' && (
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-6 rounded-2xl shadow-sm space-y-4">
            <div className="flex justify-between items-center text-emerald-500">
              <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Thermometer className="h-4 w-4" /> Body Temperature
              </span>
              <span className="text-sm font-extrabold">{vitals[vitals.length - 1].temperature} °C</span>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={vitals} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" className="dark:hidden" />
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" className="hidden dark:block" />
                  <XAxis dataKey="hour" stroke="#94a3b8" fontSize={11} />
                  <YAxis stroke="#94a3b8" fontSize={11} domain={[35.0, 41.0]} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '12px' }} />
                  <Line type="monotone" dataKey="temperature" stroke="#10b981" strokeWidth={2.5} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
