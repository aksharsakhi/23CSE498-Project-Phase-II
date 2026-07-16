import React, { useState } from 'react';
import { Search, Filter, ShieldAlert, Award, User, RefreshCw } from 'lucide-react';
import { mockPatients, Patient } from '../services/mockDataService';

interface PatientListProps {
  onSelectPatient: (patient: Patient) => void;
  setActiveTab: (tab: string) => void;
}

export const PatientList: React.FC<PatientListProps> = ({ onSelectPatient, setActiveTab }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [hospitalFilter, setHospitalFilter] = useState('All');
  const [riskFilter, setRiskFilter] = useState('All');

  // Filter patients based on user options
  const filteredPatients = mockPatients.filter(patient => {
    const matchesSearch = patient.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          patient.ward.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesHospital = hospitalFilter === 'All' || patient.hospital.includes(hospitalFilter);
    const matchesRisk = riskFilter === 'All' || patient.riskLevel === riskFilter;
    return matchesSearch && matchesHospital && matchesRisk;
  });

  const handlePredictClick = (patient: Patient) => {
    onSelectPatient(patient);
    setActiveTab('prediction');
  };

  return (
    <div className="p-8 space-y-6 overflow-y-auto max-h-[calc(100vh-4rem)]">
      {/* Header section */}
      <div>
        <h2 className="text-2xl font-extrabold text-slate-800 dark:text-white leading-tight">ICU Patients Ward Telemetry</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Bedside tracking and Sepsis risk forecasting alerts across active institutional splits</p>
      </div>

      {/* Control panel */}
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-5 rounded-2xl shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search Patient ID or Bed location..."
            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-slate-100"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 w-full md:w-auto items-center">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-slate-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Filter By:</span>
          </div>

          <select
            value={hospitalFilter}
            onChange={(e) => setHospitalFilter(e.target.value)}
            className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs font-semibold px-3 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="All">All Hospitals</option>
            <option value="Hospital A">Hospital A (Age &lt; 60)</option>
            <option value="Hospital B">Hospital B (Age &gt;= 60)</option>
            <option value="Hospital C">Hospital C (General)</option>
          </select>

          <select
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value)}
            className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs font-semibold px-3 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="All">All Risks</option>
            <option value="High">High Risk Alert</option>
            <option value="Medium">Medium Risk</option>
            <option value="Low">Low Risk</option>
          </select>
        </div>
      </div>

      {/* Grid Table */}
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-700">
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">Patient Details</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">ICU Placement</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">Hospital Node</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">Clinical Status</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">Forecasting Risk</th>
                <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-slate-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {filteredPatients.map((patient) => (
                <tr 
                  key={patient.id} 
                  className="hover:bg-slate-55 dark:hover:bg-slate-700/30 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-400">
                        <User className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-slate-800 dark:text-white leading-tight">{patient.id}</h4>
                        <span className="text-xs text-slate-400 font-medium">{patient.age}y / {patient.gender}</span>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{patient.ward}</span>
                  </td>

                  <td className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400">
                    {patient.hospital}
                  </td>

                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                      patient.status === 'Critical'
                        ? 'bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400'
                        : 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400'
                    }`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${patient.status === 'Critical' ? 'bg-red-500' : 'bg-emerald-500'}`}></span>
                      {patient.status}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <span className={`text-sm font-bold flex items-center gap-1.5 ${
                      patient.riskLevel === 'High' 
                        ? 'text-red-500' 
                        : patient.riskLevel === 'Medium' 
                        ? 'text-orange-500' 
                        : 'text-emerald-500'
                    }`}>
                      {patient.riskLevel === 'High' && <ShieldAlert className="h-4 w-4" />}
                      {patient.riskLevel} Risk
                    </span>
                  </td>

                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handlePredictClick(patient)}
                      className="inline-flex items-center gap-1.5 bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 text-blue-600 dark:text-blue-400 font-bold px-3.5 py-2 rounded-xl transition-all text-xs"
                    >
                      <RefreshCw className="h-3.5 w-3.5" /> Predict
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
