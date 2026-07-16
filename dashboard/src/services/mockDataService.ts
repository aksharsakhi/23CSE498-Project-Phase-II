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

// Generate realistic mock ICU patients
export const mockPatients: Patient[] = [
  {
    id: "PAT-2091",
    age: 68,
    gender: "Male",
    hospital: "Hospital A (Age < 60 Split)",
    ward: "ICU Bed 12",
    admittedAt: "2026-07-15 14:30",
    status: "Critical",
    riskLevel: "High",
    scores: { centralized: 0.76, fedavg: 0.70, fedprox: 0.79, ditto: 0.84, fpdaf: 0.88 },
    confidence: 94
  },
  {
    id: "PAT-4082",
    age: 42,
    gender: "Female",
    hospital: "Hospital B (Age >= 60 Split)",
    ward: "ICU Bed 04",
    admittedAt: "2026-07-16 01:15",
    status: "Stable",
    riskLevel: "Low",
    scores: { centralized: 0.12, fedavg: 0.15, fedprox: 0.10, ditto: 0.08, fpdaf: 0.05 },
    confidence: 98
  },
  {
    id: "PAT-1109",
    age: 72,
    gender: "Female",
    hospital: "Hospital C (General Clinic)",
    ward: "ICU Bed 08",
    admittedAt: "2026-07-15 22:00",
    status: "Critical",
    riskLevel: "High",
    scores: { centralized: 0.81, fedavg: 0.74, fedprox: 0.80, ditto: 0.85, fpdaf: 0.91 },
    confidence: 96
  },
  {
    id: "PAT-8821",
    age: 55,
    gender: "Male",
    hospital: "Hospital A (Age < 60 Split)",
    ward: "ICU Bed 19",
    admittedAt: "2026-07-16 03:40",
    status: "Stable",
    riskLevel: "Medium",
    scores: { centralized: 0.45, fedavg: 0.38, fedprox: 0.42, ditto: 0.51, fpdaf: 0.54 },
    confidence: 89
  },
  {
    id: "PAT-3345",
    age: 63,
    gender: "Male",
    hospital: "Hospital B (Age >= 60 Split)",
    ward: "ICU Bed 11",
    admittedAt: "2026-07-15 11:20",
    status: "Stable",
    riskLevel: "Low",
    scores: { centralized: 0.18, fedavg: 0.22, fedprox: 0.16, ditto: 0.14, fpdaf: 0.11 },
    confidence: 97
  },
  {
    id: "PAT-9912",
    age: 79,
    gender: "Female",
    hospital: "Hospital C (General Clinic)",
    ward: "ICU Bed 15",
    admittedAt: "2026-07-15 08:00",
    status: "Critical",
    riskLevel: "High",
    scores: { centralized: 0.85, fedavg: 0.77, fedprox: 0.83, ditto: 0.89, fpdaf: 0.94 },
    confidence: 95
  }
];

// Generate 24h vitals log with deteriorating vital signs for sepsis patients
export const getPatientVitals = (patientId: string): VitalSignRecord[] => {
  const isHighRisk = patientId === "PAT-2091" || patientId === "PAT-1109" || patientId === "PAT-9912";
  
  const records: VitalSignRecord[] = [];
  for (let h = 1; h <= 24; h++) {
    let hr = 75 + Math.sin(h / 3) * 5 + Math.random() * 3;
    let sbp = 120 + Math.cos(h / 4) * 8 + Math.random() * 4;
    let temp = 37.0 + Math.sin(h / 6) * 0.3 + Math.random() * 0.1;
    let resp = 16 + Math.sin(h / 3) * 2 + Math.random() * 1;
    let spo2 = 98 - Math.random() * 1;
    
    // Simulate septic shock progression in late hours (hours 15-24)
    if (isHighRisk && h > 15) {
      const severity = (h - 15) / 9; // scales 0 to 1
      hr += severity * 35; // Tachycardia (Heart Rate > 110)
      sbp -= severity * 35; // Hypotension (Blood Pressure drops < 90)
      temp += severity * 2.1; // High fever (Temp > 39.1)
      resp += severity * 10; // Tachypnea (Respiration > 26)
      spo2 -= severity * 6; // Hypoxia (Oxygen saturation drops < 92%)
    }
    
    records.push({
      hour: h,
      heartRate: Math.round(hr),
      bloodPressure: Math.round(sbp),
      temperature: parseFloat(temp.toFixed(1)),
      respiration: Math.round(resp),
      spo2: Math.round(spo2)
    });
  }
  return records;
};

// Generate temporal attention profile matching our FPDAF model outputs
export const getAttentionTimeline = (patientId: string): AttentionData[] => {
  const isHighRisk = patientId === "PAT-2091" || patientId === "PAT-1109" || patientId === "PAT-9912";
  const data: AttentionData[] = [];
  for (let h = 1; h <= 24; h++) {
    let score = 0.02 + Math.random() * 0.01;
    if (isHighRisk && h >= 16 && h <= 22) {
      score += 0.08 + Math.sin((h - 16) / 2) * 0.04 + Math.random() * 0.02;
    }
    data.push({ hour: h, attentionScore: parseFloat(score.toFixed(4)) });
  }
  return data;
};

// Feature importance attribution matrix
export const getFeatureImportance = (): FeatureImportance[] => [
  { name: "Heart Rate (HR)", importance: 35, color: "#ef4444" },
  { name: "Systolic Blood Pressure (SBP)", importance: 28, color: "#f97316" },
  { name: "Oxygen Saturation (SpO₂)", importance: 22, color: "#3b82f6" },
  { name: "Body Temperature (Temp)", importance: 15, color: "#10b981" }
];

// Running CUSUM log rounds from FPDAF train log outputs
export const mockCusumData: DriftRecord[] = [
  { round: 1, client0: 0.75, client1: 0.82, client2: 0.79 },
  { round: 2, client0: 1.51, client1: 1.64, client2: 1.58 },
  { round: 3, client0: 2.26, client1: 2.45, client2: 2.37 },
  { round: 4, client0: 3.19, client1: 3.54, client2: 3.51 }, // DRIFT TRIGGER! Reset CUSUM
  { round: 5, client0: 0.81, client1: 0.90, client2: 0.85 }, // Selective adaptation running
  { round: 6, client0: 1.58, client1: 1.88, client2: 1.95 },
  { round: 7, client0: 3.25, client1: 3.83, client2: 3.95 }, // DRIFT TRIGGER! Reset CUSUM
  { round: 8, client0: 0.85, client1: 0.92, client2: 0.88 },
  { round: 9, client0: 1.55, client1: 1.76, client2: 3.46 }, // Client 2 drift trigger
  { round: 10, client0: 4.09, client1: 4.55, client2: 0.90 } // Client 0,1 drift triggers
];

// 5-way model comparison metrics from evaluate reports
export const modelComparisonMetrics: ModelMetrics[] = [
  {
    name: "Centralized Baseline",
    accuracy: 75.09,
    precision: 7.14,
    recall: 72.17,
    f1: 0.1300,
    auroc: 0.8058,
    commCost: "0 MB (N/A)",
    trainTime: "1h 45m",
    driftAdaptTime: "N/A",
    color: "#64748b"
  },
  {
    name: "FedAvg",
    accuracy: 75.94,
    precision: 6.94,
    recall: 67.19,
    f1: 0.1259,
    auroc: 0.7844,
    commCost: "1.24 GB",
    trainTime: "2h 10m",
    driftAdaptTime: "N/A",
    color: "#e67e22"
  },
  {
    name: "FedProx",
    accuracy: 83.85,
    precision: 9.36,
    recall: 60.64,
    f1: 0.1622,
    auroc: 0.8033,
    commCost: "1.24 GB",
    trainTime: "2h 35m",
    driftAdaptTime: "N/A",
    color: "#3498db"
  },
  {
    name: "Ditto (Personalized)",
    accuracy: 82.45,
    precision: 8.98,
    recall: 63.58,
    f1: 0.1574,
    auroc: 0.7989,
    commCost: "2.48 GB",
    trainTime: "4h 20m",
    driftAdaptTime: "25m",
    color: "#2ecc71"
  },
  {
    name: "FPDAF (Proposed Framework)",
    accuracy: 83.51,
    precision: 8.51,
    recall: 55.33,
    f1: 0.1475,
    auroc: 0.7603,
    commCost: "1.52 GB (CSSP Saved 38%)",
    trainTime: "3h 05m (CSSP Speedup)",
    driftAdaptTime: "6m (Head-Only)",
    color: "#e74c3c"
  }
];
