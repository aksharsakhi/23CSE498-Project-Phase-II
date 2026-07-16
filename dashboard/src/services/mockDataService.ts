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

const API_BASE_URL = "http://localhost:8000/api";

// Fallback mock data in case backend is offline
const fallbackPatients: Patient[] = [
  {
    id: "PAT-1000",
    age: 68,
    gender: "Male",
    hospital: "Hospital A (Age < 60)",
    ward: "ICU Bed 12",
    admittedAt: "2026-07-15 12:00",
    status: "Critical",
    riskLevel: "High",
    scores: { centralized: 0.76, fedavg: 0.70, fedprox: 0.79, ditto: 0.84, fpdaf: 0.88 },
    confidence: 88
  },
  {
    id: "PAT-1001",
    age: 42,
    gender: "Female",
    hospital: "Hospital B (Age >= 60)",
    ward: "ICU Bed 04",
    admittedAt: "2026-07-15 12:00",
    status: "Stable",
    riskLevel: "Low",
    scores: { centralized: 0.12, fedavg: 0.15, fedprox: 0.10, ditto: 0.08, fpdaf: 0.05 },
    confidence: 95
  }
];

const fallbackVitals: VitalSignRecord[] = Array.from({ length: 24 }, (_, i) => ({
  hour: i + 1,
  heartRate: 80 + Math.floor(Math.sin(i / 2) * 10),
  bloodPressure: 120 + Math.floor(Math.cos(i / 3) * 12),
  temperature: 37.0 + parseFloat((Math.sin(i / 4) * 0.5).toFixed(1)),
  respiration: 18 + Math.floor(Math.sin(i / 2) * 2),
  spo2: 97 - Math.floor(Math.random() * 2)
}));

const fallbackAttention: AttentionData[] = Array.from({ length: 24 }, (_, i) => ({
  hour: i + 1,
  attentionScore: 0.02 + Math.random() * 0.01 + (i >= 16 && i <= 22 ? 0.08 : 0)
}));

// Real-time API service integrations
export const fetchPatients = async (): Promise<Patient[]> => {
  try {
    const res = await fetch(`${API_BASE_URL}/patients`);
    if (!res.ok) throw new Error("Backend response error");
    return await res.json();
  } catch (err) {
    console.warn("FastAPI backend offline, serving fallback clinical patient cohort:", err);
    return fallbackPatients;
  }
};

export const fetchPatientVitals = async (patientId: string): Promise<VitalSignRecord[]> => {
  try {
    const res = await fetch(`${API_BASE_URL}/patients/${patientId}/vitals`);
    if (!res.ok) throw new Error("Backend response error");
    return await res.json();
  } catch (err) {
    console.warn(`FastAPI backend offline, serving fallback vitals for ${patientId}:`, err);
    return fallbackVitals;
  }
};

export const fetchPatientAttention = async (patientId: string): Promise<AttentionData[]> => {
  try {
    const res = await fetch(`${API_BASE_URL}/patients/${patientId}/attention`);
    if (!res.ok) throw new Error("Backend response error");
    return await res.json();
  } catch (err) {
    console.warn(`FastAPI backend offline, serving fallback attention timeline for ${patientId}:`, err);
    return fallbackAttention;
  }
};

export const fetchDriftData = async (): Promise<DriftRecord[]> => {
  try {
    const res = await fetch(`${API_BASE_URL}/drift`);
    if (!res.ok) throw new Error("Backend response error");
    return await res.json();
  } catch (err) {
    console.warn("FastAPI backend offline, serving fallback CUSUM drift scores:", err);
    return [
      { round: 1, client0: 0.75, client1: 0.80, client2: 0.77 },
      { round: 2, client0: 1.51, client1: 1.53, client2: 1.51 },
      { round: 3, client0: 2.26, client1: 2.43, client2: 2.44 },
      { round: 4, client0: 3.19, client1: 3.54, client2: 3.51 }
    ];
  }
};

export const fetchModelComparison = async (): Promise<ModelMetrics[]> => {
  try {
    const res = await fetch(`${API_BASE_URL}/comparison`);
    if (!res.ok) throw new Error("Backend response error");
    return await res.json();
  } catch (err) {
    console.warn("FastAPI backend offline, serving fallback comparative metrics:", err);
    return [
      { name: "Centralized Baseline", accuracy: 75.09, precision: 7.14, recall: 72.17, f1: 0.1300, auroc: 0.8058, commCost: "0 MB", trainTime: "1h 45m", driftAdaptTime: "N/A", color: "#64748b" },
      { name: "FedAvg", accuracy: 75.94, precision: 6.94, recall: 67.19, f1: 0.1259, auroc: 0.7844, commCost: "1.24 GB", trainTime: "2h 10m", driftAdaptTime: "N/A", color: "#e67e22" },
      { name: "FedProx", accuracy: 83.85, precision: 9.36, recall: 60.64, f1: 0.1622, auroc: 0.8033, commCost: "1.24 GB", trainTime: "2h 35m", driftAdaptTime: "N/A", color: "#3498db" },
      { name: "Ditto (Personalized)", accuracy: 82.45, precision: 8.98, recall: 63.58, f1: 0.1574, auroc: 0.7989, commCost: "2.48 GB", trainTime: "4h 20m", driftAdaptTime: "25m", color: "#2ecc71" },
      { name: "FPDAF (Proposed)", accuracy: 83.51, precision: 8.51, recall: 55.33, f1: 0.1475, auroc: 0.7603, commCost: "1.52 GB", trainTime: "3h 05m", driftAdaptTime: "6m", color: "#e74c3c" }
    ];
  }
};

export const fetchAblationData = async (): Promise<any> => {
  try {
    const res = await fetch(`${API_BASE_URL}/ablation`);
    if (!res.ok) throw new Error("Backend response error");
    return await res.json();
  } catch (err) {
    console.warn("FastAPI backend offline, serving fallback ablation stats:", err);
    return {
      "fpdaf_no_cusum": { accuracy: 79.59, precision: 7.74, recall: 63.35, f1_score: 0.1380, auroc: 0.7827 },
      "fpdaf_no_attention": { accuracy: 86.01, precision: 9.63, recall: 52.81, f1_score: 0.1629, auroc: 0.7878 },
      "fpdaf_no_personalization": { accuracy: 79.89, precision: 8.05, recall: 65.27, f1_score: 0.1433, auroc: 0.7887 },
      "full_fpdaf": { accuracy: 83.51, precision: 8.51, recall: 55.33, f1_score: 0.1475, auroc: 0.7603 }
    };
  }
};

// Feature importance attribution matrix (static visual mapping)
export const getFeatureImportance = (): FeatureImportance[] => [
  { name: "Heart Rate (HR)", importance: 35, color: "#ef4444" },
  { name: "Systolic Blood Pressure (SBP)", importance: 28, color: "#f97316" },
  { name: "Oxygen Saturation (SpO₂)", importance: 22, color: "#3b82f6" },
  { name: "Body Temperature (Temp)", importance: 15, color: "#10b981" }
];
