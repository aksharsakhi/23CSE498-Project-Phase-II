# FPDAF: Explainable Federated Learning for Healthcare Time-Series Forecasting

## 23CSE498 — Project Phase II | Amrita Vishwa Vidyapeetham

### 🏥 Project Overview

This repository implements the **Federated Personalized Drift-Aware Attention Framework (FPDAF)**, a decentralized architecture for **early ICU risk prediction** (Sepsis & Deterioration) using the [PhysioNet Computing in Cardiology Challenge 2019](https://physionet.org/content/challenge-2019/) dataset.

The framework addresses three critical clinical challenges:
1. **The Privacy Gap** — Federated Learning enables multi-hospital training without sharing raw patient data (HIPAA/DPDPA compliant).
2. **The Accuracy Gap** — Personalized local heads adapt to hospital-specific demographics while sharing global intelligence.
3. **The Trust Gap** — Explainable AI (XAI) via attention weights and SHAP values provides interpretable clinical alerts.

---

## 📂 Repository Structure

```
23CSE498-Project-Phase-II/
│
├── datasets/
│   ├── raw/                    # Original PhysioNet 2019 data (training_setA & training_setB)
│   └── processed/              # Preprocessed tensors & sliding windows
│
├── notebooks/                  # Jupyter notebooks for EDA & experiments
├── preprocessing/              # Data cleaning, imputation, normalization pipelines
├── models/                     # Model architectures (LSTM, Attention, Personalized Heads)
├── federated/                  # FedAvg, FedPer, aggregation & client simulation logic
├── explainability/             # SHAP, Attention visualization, XAI modules
├── evaluation/                 # Metrics, AUC-ROC, confusion matrices, benchmarks
├── results/                    # Generated plots, tables, evaluation outputs
│
├── config.py                   # Centralized hyperparameters & path configuration
├── requirements.txt            # Python dependencies
├── README.md                   # This file
└── .gitignore                  # Git ignore rules
```

---

## 📊 Dataset

**Source:** [PhysioNet Computing in Cardiology Challenge 2019](https://physionet.org/content/challenge-2019/)

| Set | Hospital | Patients | Format |
|:---|:---|:---|:---|
| `training_setA` | Hospital System A | ~20,000 | `.psv` (pipe-separated) |
| `training_setB` | Hospital System B | ~20,000 | `.psv` (pipe-separated) |

Each `.psv` file represents one ICU patient stay with **40 clinical features** recorded hourly, including:
- **Vital Signs:** HR, O2Sat, Temp, SBP, MAP, DBP, Resp, EtCO2
- **Laboratory Values:** BaseExcess, HCO3, FiO2, pH, PaCO2, SaO2, AST, BUN, etc.
- **Demographics:** Age, Gender, Unit1, Unit2, HospAdmTime
- **Target:** `SepsisLabel` (0 = No Sepsis, 1 = Sepsis)

> ⚠️ **Note:** The raw dataset is stored in `datasets/raw/` and excluded from Git via `.gitignore` due to size constraints.

---

## 🚀 Key Innovation Pillars

- **Attention-Aware FedAvg** — Weighted aggregation prioritizing higher-confidence hospital models.
- **CUSUM Drift Detection** — Statistical monitoring as an automated neural trigger for model recalibration.
- **FedPer Personalization** — Hospital-specific classification heads preserving local demographic patterns.
- **Explainable Alerts** — Attention heatmaps + SHAP values for clinician-interpretable risk predictions.

---

## 🛠 Setup

```bash
# Clone the repository
git clone https://github.com/<your-username>/23CSE498-Project-Phase-II.git
cd 23CSE498-Project-Phase-II

# Create virtual environment
python -m venv venv
venv\Scripts\activate    # Windows

# Install dependencies
pip install -r requirements.txt

# Place PhysioNet dataset in datasets/raw/
# datasets/raw/training_setA/*.psv
# datasets/raw/training_setB/*.psv
```

---

## 👥 Team 28

| Name | Roll Number |
|:---|:---|
| SHEELA AKSHAR SAKHI | CB.SC.U4CSE23547 |
| HASINI REDDY M | CB.SC.U4CSE23529 |
| KOUSIK SARMA LAKKARAJU | CB.SC.U4CSE23761 |
| HASWITHA K | CB.SC.U4CSE23363 |
| V. CHAKRAVARTHY | CB.SC.U4CSE23753 |

### 🎓 Guides
**DR. G R RAMYA & DR. VANDHANA S**
*Department of Computer Science and Engineering, Amrita School of Computing*

---

## 🌍 SDG Mapping

- **Primary (SDG 3):** Good Health and Well-being
- **Secondary (SDG 9 & 16):** Industry Innovation & Peace, Justice and Strong Institutions
