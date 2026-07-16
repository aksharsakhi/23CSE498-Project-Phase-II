import os
import sys
import sqlite3
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Dict, Any

app = FastAPI(title="Clinical Warehouse CDSS API", version="2.0.0")

# Enable CORS for React dashboard requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DB_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "clinical_warehouse.db")

def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

# ----------------- API ENDPOINTS -----------------

@app.get("/api/patients")
def get_patients():
    if not os.path.exists(DB_PATH):
        raise HTTPException(status_code=500, detail="Database file not found. Initialize database first.")
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Query patients and join with their scores
    query = """
    SELECT p.id, p.age, p.gender, p.hospital, p.ward, p.admitted_at, p.status, p.risk_level, p.confidence,
           pr.centralized, pr.fedavg, pr.fedprox, pr.ditto, pr.fpdaf
    FROM patients p
    JOIN predictions pr ON p.id = pr.patient_id
    """
    try:
        cursor.execute(query)
        rows = cursor.fetchall()
    except Exception as e:
        conn.close()
        raise HTTPException(status_code=500, detail=f"Database query error: {str(e)}")
        
    patients_list = []
    for r in rows:
        patients_list.append({
          "id": r["id"],
          "age": r["age"],
          "gender": r["gender"],
          "hospital": r["hospital"],
          "ward": r["ward"],
          "admittedAt": r["admitted_at"],
          "status": r["status"],
          "riskLevel": r["risk_level"],
          "scores": {
            "centralized": r["centralized"],
            "fedavg": r["fedavg"],
            "fedprox": r["fedprox"],
            "ditto": r["ditto"],
            "fpdaf": r["fpdaf"]
          },
          "confidence": r["confidence"]
        })
        
    conn.close()
    return patients_list

@app.get("/api/patients/{pat_id}/vitals")
def get_vitals(pat_id: str):
    conn = get_db_connection()
    cursor = conn.cursor()
    
    query = """
    SELECT hour, heart_rate, blood_pressure, temperature, respiration, spo2
    FROM vitals
    WHERE patient_id = ?
    ORDER BY hour ASC
    """
    cursor.execute(query, (pat_id,))
    rows = cursor.fetchall()
    conn.close()
    
    if not rows:
        raise HTTPException(status_code=404, detail=f"Patient {pat_id} vitals not found")
        
    records = []
    for r in rows:
        records.append({
          "hour": r["hour"],
          "heartRate": r["heart_rate"],
          "bloodPressure": r["blood_pressure"],
          "temperature": r["temperature"],
          "respiration": r["respiration"],
          "spo2": r["spo2"]
        })
    return records

@app.get("/api/patients/{pat_id}/attention")
def get_attention(pat_id: str):
    conn = get_db_connection()
    cursor = conn.cursor()
    
    query = """
    SELECT hour, attention_score
    FROM attentions
    WHERE patient_id = ?
    ORDER BY hour ASC
    """
    cursor.execute(query, (pat_id,))
    rows = cursor.fetchall()
    conn.close()
    
    if not rows:
        raise HTTPException(status_code=404, detail=f"Patient {pat_id} attention score not found")
        
    return [{"hour": r["hour"], "attentionScore": r["attention_score"]} for r in rows]

@app.get("/api/drift")
def get_drift():
    conn = get_db_connection()
    cursor = conn.cursor()
    
    query = "SELECT round, client0, client1, client2 FROM drift_metrics ORDER BY round ASC"
    cursor.execute(query)
    rows = cursor.fetchall()
    conn.close()
    
    drift_records = []
    for r in rows:
        drift_records.append({
          "round": r["round"],
          "client0": r["client0"],
          "client1": r["client1"],
          "client2": r["client2"]
        })
    return drift_records

@app.get("/api/comparison")
def get_comparison():
    conn = get_db_connection()
    cursor = conn.cursor()
    
    query = """
    SELECT name, accuracy, precision, recall, f1, auroc, comm_cost, train_time, drift_adapt_time, color
    FROM model_comparison
    """
    cursor.execute(query)
    rows = cursor.fetchall()
    conn.close()
    
    formatted = []
    for r in rows:
        formatted.append({
          "name": r["name"],
          "accuracy": r["accuracy"],
          "precision": r["precision"],
          "recall": r["recall"],
          "f1": r["f1"],
          "auroc": r["auroc"],
          "commCost": r["comm_cost"],
          "trainTime": r["train_time"],
          "driftAdaptTime": r["drift_adapt_time"],
          "color": r["color"]
        })
    return formatted

@app.get("/api/ablation")
def get_ablation():
    conn = get_db_connection()
    cursor = conn.cursor()
    
    query = "SELECT config_name, accuracy, precision, recall, f1, auroc FROM ablation_metrics"
    cursor.execute(query)
    rows = cursor.fetchall()
    conn.close()
    
    formatted = {}
    config_keys = {
        "FPDAF w/o CUSUM": "fpdaf_no_cusum",
        "FPDAF w/o Attention": "fpdaf_no_attention",
        "FPDAF w/o Personalization": "fpdaf_no_personalization",
        "Full FPDAF (Proposed)": "full_fpdaf"
    }
    
    for r in rows:
        c_name = r["config_name"]
        if c_name in config_keys:
            key = config_keys[c_name]
            formatted[key] = {
              "accuracy": r["accuracy"],
              "precision": r["precision"],
              "recall": r["recall"],
              "f1_score": r["f1"],
              "auroc": r["auroc"]
            }
    return formatted
