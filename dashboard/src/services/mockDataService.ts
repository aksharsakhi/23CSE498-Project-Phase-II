export interface Patient {
  id: string;
  age: number;
  gender: 'Male' | 'Female';
  hospital: string;
  ward: string;
  admittedAt: string;
  status: 'Stable' | 'Critical' | 'Discharged';
  riskLevel: 'Low' | 'Medium' | 'High';
  scores: {
    centralized: number;
    fedavg: number;
    fedprox: number;
    ditto: number;
    fpdaf: number;
  };
  confidence: number;
}

export interface VitalSignRecord {
  hour: number;
  heartRate: number;
  bloodPressure: number;
  temperature: number;
  respiration: number;
  spo2: number;
}

export interface AttentionData {
  hour: number;
  attentionScore: number;
}

export interface FeatureImportance {
  name: string;
  importance: number;
  color: string;
}

export interface DriftRecord {
  round: number;
  client0: number;
  client1: number;
  client2: number;
}

export interface ModelMetrics {
  name: string;
  accuracy: number;
  precision: number;
  recall: number;
  f1: number;
  auroc: number;
  commCost: string;
  trainTime: string;
  driftAdaptTime: string;
  color: string;
}

export interface ICUStats {
  total_patients: number;
  high_risk: number;
  medium_risk: number;
  low_risk: number;
  admissions: Array<{ time: string; admissions: number; discharges: number }>;
  trends: Array<{ date: string; sepsisAlerts: number; fpdafBypasses: number }>;
}

const API_BASE_URL = "http://localhost:8000/api";

// Fetch Patients
export const fetchPatients = async (): Promise<Patient[]> => {
  const res = await fetch(`${API_BASE_URL}/patients`);
  if (!res.ok) throw new Error("Clinical warehouse database connection failed.");
  return await res.json();
};

// Fetch Vitals
export const fetchPatientVitals = async (patientId: string): Promise<VitalSignRecord[]> => {
  const res = await fetch(`${API_BASE_URL}/patients/${patientId}/vitals`);
  if (!res.ok) throw new Error(`Failed to load vital sign records for patient ${patientId}`);
  return await res.json();
};

// Fetch Attention Scores
export const fetchPatientAttention = async (patientId: string): Promise<AttentionData[]> => {
  const res = await fetch(`${API_BASE_URL}/patients/${patientId}/attention`);
  if (!res.ok) throw new Error(`Failed to load attention maps for patient ${patientId}`);
  return await res.json();
};

// Fetch CUSUM Drift Scores
export const fetchDriftData = async (): Promise<DriftRecord[]> => {
  const res = await fetch(`${API_BASE_URL}/drift`);
  if (!res.ok) throw new Error("Failed to load CUSUM drift scores");
  return await res.json();
};

// Fetch Model Comparison metrics
export const fetchModelComparison = async (): Promise<ModelMetrics[]> => {
  const res = await fetch(`${API_BASE_URL}/comparison`);
  if (!res.ok) throw new Error("Failed to load model comparison benchmarks");
  return await res.json();
};

// Fetch Ablation metrics
export const fetchAblationData = async (): Promise<any> => {
  const res = await fetch(`${API_BASE_URL}/ablation`);
  if (!res.ok) throw new Error("Failed to load ablation metrics");
  return await res.json();
};

// Fetch ICU stats
export const fetchStats = async (): Promise<ICUStats> => {
  const res = await fetch(`${API_BASE_URL}/stats`);
  if (!res.ok) throw new Error("Failed to load ICU clinical stats metrics");
  return await res.json();
};

// Feature importance attribution matrix (static visual mapping)
export const getFeatureImportance = (): FeatureImportance[] => [
  { name: "Heart Rate (HR)", importance: 35, color: "#ef4444" },
  { name: "Systolic Blood Pressure (SBP)", importance: 28, color: "#f97316" },
  { name: "Oxygen Saturation (SpO₂)", importance: 22, color: "#3b82f6" },
  { name: "Body Temperature (Temp)", importance: 15, color: "#10b981" }
];
