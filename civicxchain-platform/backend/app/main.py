"""from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.apis.smart_contracts import router as contracts_router

app = FastAPI(title="CivicXChain Governance API")

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include contract routes
app.include_router(contracts_router)

@app.get("/")
async def root():
    return {"message": "CivicXChain Governance API is running!"}"""


"""from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.apis.smart_contracts import router as contracts_router
from app.apis.commitments import router as commitments_router  # Add this new router
from app.apis.environmental import router as environmental_router  # Add this new router

app = FastAPI(title="CivicXChain Governance API")

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include all routers
app.include_router(contracts_router)
app.include_router(commitments_router, prefix="/api")  # Add commitments API
app.include_router(environmental_router, prefix="/api")  # Add environmental API

@app.get("/")
async def root():
    return {"message": "CivicXChain Governance API is running!"}

@app.get("/api/health")
async def health_check():
    return {"status": "ok", "message": "CivicXChain API is healthy!"}"""

import sqlite3
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import json
from datetime import datetime

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],  # React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database connection function
def get_db_connection():
    conn = sqlite3.connect('CivicXchain-Database/ecochain_satellite.db')
    conn.row_factory = sqlite3.Row
    return conn

# Pydantic models
class Commitment(BaseModel):
    title: str
    description: str
    category: str
    deadline: str
    official_name: str
    official_role: str
    target_value: float
    current_value: float = 0.0
    reward_amount: float = 0.0
    penalty_amount: float = 0.0

class CommitmentUpdate(BaseModel):
    progress: int
    current_value: float

# API Routes
@app.get("/api/health")
async def health_check():
    return {"status": "ok", "timestamp": datetime.now().isoformat()}

@app.get("/api/commitments")
async def get_commitments():
    conn = get_db_connection()
    try:
        cursor = conn.execute("""
            SELECT id, creator, title, description, category, target_value, 
                   actual_value, metric_type, latitude, longitude, deadline, 
                   status, created_at
            FROM commitments 
            ORDER BY created_at DESC
        """)
        commitments = []
        for row in cursor.fetchall():
            commitment = dict(row)
            # Calculate progress percentage
            if commitment['target_value'] and commitment['target_value'] > 0:
                progress = min(100, (commitment['actual_value'] / commitment['target_value']) * 100)
            else:
                progress = 0
            commitment['progress'] = int(progress)
            commitments.append(commitment)
        return commitments
    finally:
        conn.close()

@app.post("/api/commitments")
async def create_commitment(commitment: Commitment):
    conn = get_db_connection()
    try:
        cursor = conn.execute("""
            INSERT INTO commitments (
                creator, title, description, category, target_value, 
                actual_value, metric_type, deadline, status
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            commitment.official_name,
            commitment.title,
            commitment.description,
            commitment.category,
            commitment.target_value,
            commitment.current_value,
            commitment.category,  # Using category as metric_type
            commitment.deadline,
            'active'
        ))
        conn.commit()
        commitment_id = cursor.lastrowid
        
        # Return the created commitment
        cursor = conn.execute("SELECT * FROM commitments WHERE id = ?", (commitment_id,))
        result = dict(cursor.fetchone())
        return result
    finally:
        conn.close()

@app.put("/api/commitments/{commitment_id}/progress")
async def update_commitment_progress(commitment_id: int, update: CommitmentUpdate):
    conn = get_db_connection()
    try:
        cursor = conn.execute("""
            UPDATE commitments 
            SET actual_value = ?, status = ?
            WHERE id = ?
        """, (
            update.current_value,
            'completed' if update.progress >= 100 else 'active',
            commitment_id
        ))
        conn.commit()
        
        if cursor.rowcount == 0:
            raise HTTPException(status_code=404, detail="Commitment not found")
        
        # Return updated commitment
        cursor = conn.execute("SELECT * FROM commitments WHERE id = ?", (commitment_id,))
        result = dict(cursor.fetchone())
        return result
    finally:
        conn.close()

@app.get("/api/environmental/{commitment_id}")
async def get_environmental_data(commitment_id: int):
    conn = get_db_connection()
    try:
        cursor = conn.execute("""
            SELECT * FROM satellite_data 
            WHERE commitment_id = ? 
            ORDER BY timestamp DESC
        """, (commitment_id,))
        data = [dict(row) for row in cursor.fetchall()]
        return data
    finally:
        conn.close()

@app.post("/api/environmental/fetch")
async def fetch_environmental_data(request: dict):
    commitment_id = request.get('commitmentId')
    data_type = request.get('dataType')
    
    # Simulate fetching real environmental data
    import random
    
    conn = get_db_connection()
    try:
        # Insert simulated environmental data
        cursor = conn.execute("""
            INSERT INTO satellite_data (
                commitment_id, data_type, value, unit, source, verified
            ) VALUES (?, ?, ?, ?, ?, ?)
        """, (
            commitment_id,
            data_type,
            random.uniform(10, 100),
            'μg/m³' if data_type == 'air_quality' else '%',
            'NASA Satellite',
            True
        ))
        conn.commit()
        
        # Return the inserted data
        cursor = conn.execute("""
            SELECT * FROM satellite_data WHERE id = ?
        """, (cursor.lastrowid,))
        result = dict(cursor.fetchone())
        return result
    finally:
        conn.close()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)