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
  // Novel AD-CUSUM specific metrics
  jsd_divergence?: number;
  w_grad?: number;
  kappa_r?: number;
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

export interface ClinicalNote {
  id: string;
  patientId: string;
  author: string;
  role: string;
  timestamp: string;
  content: string;
  category: 'Observation' | 'Intervention' | 'Alert';
}

const API_BASE_URL = "http://localhost:8000/api";

// Fallback Mock Data
export const MOCK_PATIENTS: Patient[] = [
  {
    id: "PAT-2091",
    age: 68,
    gender: "Male",
    hospital: "Hospital A (Regional ICU)",
    ward: "ICU Bed 04",
    admittedAt: "2026-07-25 08:30",
    status: "Critical",
    riskLevel: "High",
    scores: { centralized: 0.82, fedavg: 0.76, fedprox: 0.81, ditto: 0.85, fpdaf: 0.89 },
    confidence: 94.2
  },
  {
    id: "PAT-1842",
    age: 72,
    gender: "Female",
    hospital: "Hospital B (Metropolitan Care)",
    ward: "ICU Bed 02",
    admittedAt: "2026-07-26 14:15",
    status: "Critical",
    riskLevel: "High",
    scores: { centralized: 0.74, fedavg: 0.69, fedprox: 0.73, ditto: 0.78, fpdaf: 0.83 },
    confidence: 91.8
  },
  {
    id: "PAT-3015",
    age: 54,
    gender: "Male",
    hospital: "Hospital A (Regional ICU)",
    ward: "ICU Bed 08",
    admittedAt: "2026-07-26 18:45",
    status: "Stable",
    riskLevel: "Medium",
    scores: { centralized: 0.51, fedavg: 0.44, fedprox: 0.49, ditto: 0.52, fpdaf: 0.56 },
    confidence: 88.5
  },
  {
    id: "PAT-4029",
    age: 41,
    gender: "Female",
    hospital: "Hospital C (General Hospital)",
    ward: "HDU Bed 01",
    admittedAt: "2026-07-27 02:10",
    status: "Stable",
    riskLevel: "Low",
    scores: { centralized: 0.18, fedavg: 0.14, fedprox: 0.16, ditto: 0.17, fpdaf: 0.15 },
    confidence: 96.0
  },
  {
    id: "PAT-5103",
    age: 63,
    gender: "Male",
    hospital: "Hospital B (Metropolitan Care)",
    ward: "ICU Bed 09",
    admittedAt: "2026-07-27 06:00",
    status: "Stable",
    riskLevel: "Low",
    scores: { centralized: 0.22, fedavg: 0.19, fedprox: 0.21, ditto: 0.23, fpdaf: 0.20 },
    confidence: 95.4
  },
  {
    id: "PAT-6218",
    age: 79,
    gender: "Female",
    hospital: "Hospital A (Regional ICU)",
    ward: "ICU Bed 01",
    admittedAt: "2026-07-27 09:30",
    status: "Critical",
    riskLevel: "High",
    scores: { centralized: 0.88, fedavg: 0.81, fedprox: 0.85, ditto: 0.89, fpdaf: 0.93 },
    confidence: 97.1
  }
];

export const MOCK_VITALS: Record<string, VitalSignRecord[]> = {
  "PAT-2091": Array.from({ length: 24 }, (_, i) => ({
    hour: i + 1,
    heartRate: Math.round(78 + (i > 15 ? (i - 15) * 6 + Math.random() * 4 : Math.sin(i / 2) * 5)),
    bloodPressure: Math.round(125 - (i > 15 ? (i - 15) * 4 + Math.random() * 3 : Math.cos(i / 3) * 4)),
    temperature: parseFloat((36.8 + (i > 16 ? (i - 16) * 0.25 : 0)).toFixed(1)),
    respiration: Math.round(16 + (i > 15 ? (i - 15) * 1.5 : 0)),
    spo2: Math.round(98 - (i > 15 ? (i - 15) * 1.2 : 0))
  })),
  "PAT-1842": Array.from({ length: 24 }, (_, i) => ({
    hour: i + 1,
    heartRate: Math.round(82 + (i > 14 ? (i - 14) * 5 : 0)),
    bloodPressure: Math.round(118 - (i > 14 ? (i - 14) * 3 : 0)),
    temperature: parseFloat((37.1 + (i > 14 ? 1.2 : 0)).toFixed(1)),
    respiration: Math.round(18 + (i > 14 ? 4 : 0)),
    spo2: Math.round(97 - (i > 14 ? 5 : 0))
  }))
};

export const MOCK_DRIFT: DriftRecord[] = [
  { round: 1, client0: 0.42, client1: 0.38, client2: 0.35, jsd_divergence: 0.012, w_grad: 1.02, kappa_r: 0.018 },
  { round: 2, client0: 0.68, client1: 0.45, client2: 0.52, jsd_divergence: 0.028, w_grad: 1.05, kappa_r: 0.019 },
  { round: 3, client0: 0.95, client1: 0.62, client2: 0.78, jsd_divergence: 0.045, w_grad: 1.12, kappa_r: 0.021 },
  { round: 4, client0: 1.45, client1: 0.88, client2: 1.12, jsd_divergence: 0.089, w_grad: 1.24, kappa_r: 0.024 },
  { round: 5, client0: 2.10, client1: 1.15, client2: 1.65, jsd_divergence: 0.142, w_grad: 1.38, kappa_r: 0.026 },
  { round: 6, client0: 2.85, client1: 1.42, client2: 2.30, jsd_divergence: 0.198, w_grad: 1.56, kappa_r: 0.029 },
  { round: 7, client0: 3.42, client1: 1.75, client2: 3.15, jsd_divergence: 0.265, w_grad: 1.78, kappa_r: 0.034 }, // AD-CUSUM Trigger for client 0 & 2
  { round: 8, client0: 0.12, client1: 2.10, client2: 0.15, jsd_divergence: 0.015, w_grad: 1.03, kappa_r: 0.020 }, // Reset post-adapt
  { round: 9, client0: 0.35, client1: 2.45, client2: 0.38, jsd_divergence: 0.022, w_grad: 1.06, kappa_r: 0.021 },
  { round: 10, client0: 0.58, client1: 2.92, client2: 0.62, jsd_divergence: 0.038, w_grad: 1.09, kappa_r: 0.022 }
];

export const MOCK_COMPARISON: ModelMetrics[] = [
  {
    name: "Centralized Baseline",
    accuracy: 84.50,
    precision: 82.10,
    recall: 81.40,
    f1: 0.8175,
    auroc: 0.8620,
    commCost: "N/A (Central)",
    trainTime: "4.2 hrs",
    driftAdaptTime: "N/A",
    color: "#64748b"
  },
  {
    name: "FedAvg (Standard FL)",
    accuracy: 78.20,
    precision: 75.80,
    recall: 74.90,
    f1: 0.7535,
    auroc: 0.8015,
    commCost: "1.00x (Baseline)",
    trainTime: "1.8 hrs",
    driftAdaptTime: "12.4 hrs",
    color: "#f97316"
  },
  {
    name: "FedProx (Proximal FL)",
    accuracy: 81.30,
    precision: 79.40,
    recall: 78.80,
    f1: 0.7910,
    auroc: 0.8350,
    commCost: "1.00x",
    trainTime: "2.1 hrs",
    driftAdaptTime: "9.8 hrs",
    color: "#3b82f6"
  },
  {
    name: "Ditto (Personalized FL)",
    accuracy: 86.40,
    precision: 84.80,
    recall: 84.10,
    f1: 0.8445,
    auroc: 0.8870,
    commCost: "1.25x",
    trainTime: "2.4 hrs",
    driftAdaptTime: "3.2 hrs",
    color: "#10b981"
  },
  {
    name: "FPDAF (Old v1 Baseline)",
    accuracy: 86.51,
    precision: 9.81,
    recall: 65.33,
    f1: 0.1706,
    auroc: 0.8214,
    commCost: "0.62x (-38%)",
    trainTime: "1.2 hrs",
    driftAdaptTime: "0.1 hrs (6m)",
    color: "#0d9488"
  },
  {
    name: "FPDAF-v2 (Enhanced DDP-ERP)",
    accuracy: 96.42,
    precision: 18.75,
    recall: 82.50,
    f1: 0.3056,
    auroc: 0.9418,
    commCost: "0.62x (-38%)",
    trainTime: "1.1 hrs",
    driftAdaptTime: "0.08 hrs (5m)",
    color: "#8b5cf6"
  }
];

export const MOCK_STATS: ICUStats = {
  total_patients: 124,
  high_risk: 18,
  medium_risk: 34,
  low_risk: 72,
  admissions: [
    { time: "00:00", admissions: 4, discharges: 2 },
    { time: "04:00", admissions: 2, discharges: 1 },
    { time: "08:00", admissions: 9, discharges: 5 },
    { time: "12:00", admissions: 14, discharges: 11 },
    { time: "16:00", admissions: 11, discharges: 8 },
    { time: "20:00", admissions: 7, discharges: 6 }
  ],
  trends: [
    { date: "Jul 21", sepsisAlerts: 4, fpdafBypasses: 1 },
    { date: "Jul 22", sepsisAlerts: 6, fpdafBypasses: 2 },
    { date: "Jul 23", sepsisAlerts: 5, fpdafBypasses: 1 },
    { date: "Jul 24", sepsisAlerts: 9, fpdafBypasses: 3 },
    { date: "Jul 25", sepsisAlerts: 14, fpdafBypasses: 4 },
    { date: "Jul 26", sepsisAlerts: 11, fpdafBypasses: 2 },
    { date: "Jul 27", sepsisAlerts: 18, fpdafBypasses: 5 }
  ]
};

// Fetch Patients
export const fetchPatients = async (): Promise<Patient[]> => {
  try {
    const res = await fetch(`${API_BASE_URL}/patients`);
    if (!res.ok) throw new Error("API Connection Failed");
    return await res.json();
  } catch {
    return MOCK_PATIENTS;
  }
};

// Fetch Vitals
export const fetchPatientVitals = async (patientId: string): Promise<VitalSignRecord[]> => {
  try {
    const res = await fetch(`${API_BASE_URL}/patients/${patientId}/vitals`);
    if (!res.ok) throw new Error("API Vitals Error");
    return await res.json();
  } catch {
    return MOCK_VITALS[patientId] || MOCK_VITALS["PAT-2091"];
  }
};

// Fetch Attention Scores
export const fetchPatientAttention = async (patientId: string): Promise<AttentionData[]> => {
  try {
    const res = await fetch(`${API_BASE_URL}/patients/${patientId}/attention`);
    if (!res.ok) throw new Error("API Attention Error");
    return await res.json();
  } catch {
    const vitals = MOCK_VITALS[patientId] || MOCK_VITALS["PAT-2091"];
    const isHigh = patientId === "PAT-2091" || patientId === "PAT-1842" || patientId === "PAT-6218";
    return vitals.map(v => ({
      hour: v.hour,
      attentionScore: isHigh && v.hour >= 17 && v.hour <= 22 
        ? parseFloat((0.14 + (v.hour - 16) * 0.012).toFixed(3))
        : parseFloat((0.02 + Math.random() * 0.03).toFixed(3))
    }));
  }
};

// Fetch CUSUM Drift Scores
export const fetchDriftData = async (): Promise<DriftRecord[]> => {
  try {
    const res = await fetch(`${API_BASE_URL}/drift`);
    if (!res.ok) throw new Error("API Drift Error");
    return await res.json();
  } catch {
    return MOCK_DRIFT;
  }
};

// Fetch Model Comparison metrics
export const fetchModelComparison = async (): Promise<ModelMetrics[]> => {
  try {
    const res = await fetch(`${API_BASE_URL}/comparison`);
    if (!res.ok) throw new Error("API Comparison Error");
    return await res.json();
  } catch {
    return MOCK_COMPARISON;
  }
};

// Fetch Ablation metrics
export const fetchAblationData = async (): Promise<any> => {
  try {
    const res = await fetch(`${API_BASE_URL}/ablation`);
    if (!res.ok) throw new Error("API Ablation Error");
    return await res.json();
  } catch {
    return {
      fpdaf_no_cusum: { accuracy: 85.20, precision: 83.10, recall: 82.50, f1_score: 0.8280, auroc: 0.8710 },
      fpdaf_no_attention: { accuracy: 87.80, precision: 85.90, recall: 84.70, f1_score: 0.8529, auroc: 0.8940 },
      fpdaf_no_personalization: { accuracy: 83.10, precision: 80.50, recall: 79.80, f1_score: 0.8015, auroc: 0.8490 },
      full_fpdaf: { accuracy: 91.20, precision: 89.60, recall: 89.10, f1_score: 0.8935, auroc: 0.9340 }
    };
  }
};

// Fetch ICU stats
export const fetchStats = async (): Promise<ICUStats> => {
  try {
    const res = await fetch(`${API_BASE_URL}/stats`);
    if (!res.ok) throw new Error("API Stats Error");
    return await res.json();
  } catch {
    return MOCK_STATS;
  }
};

// Feature importance attribution matrix (static visual mapping)
export const getFeatureImportance = (): FeatureImportance[] => [
  { name: "Heart Rate (HR)", importance: 35, color: "#ef4444" },
  { name: "Systolic Blood Pressure (SBP)", importance: 28, color: "#f97316" },
  { name: "Oxygen Saturation (SpO₂)", importance: 22, color: "#3b82f6" },
  { name: "Body Temperature (Temp)", importance: 15, color: "#10b981" }
];

