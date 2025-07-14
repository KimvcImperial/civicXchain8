

import sqlite3
import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import json
from datetime import datetime

app = FastAPI(title="CivicXChain Governance API")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000", "*"],  # Allow all origins for development
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=["*"],
)

# Database connection function
def get_db_connection():
    # Get the directory where this script is located
    current_dir = os.path.dirname(os.path.abspath(__file__))
    # Go up one level to the backend directory
    backend_dir = os.path.dirname(current_dir)
    # Construct the database path
    db_path = os.path.join(backend_dir, 'CivicXchain-Database', 'ecochain_satellite.db')

    if not os.path.exists(db_path):
        raise HTTPException(status_code=500, detail=f"Database not found at {db_path}")

    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row
    return conn

# Pydantic models
class Commitment(BaseModel):
    title: str
    description: str
    category: str
    deadline: str
    creator: str  # Public official's name
    target_value: float
    current_value: float = 0.0
    metric_type: str = "units"  # Environmental metric (PM2.5, CO2, etc.)

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
        # Return in the format expected by frontend
        return {"commitments": commitments}
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
            commitment.creator,
            commitment.title,
            commitment.description,
            commitment.category,
            commitment.target_value,
            commitment.current_value,
            commitment.metric_type,
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

# Additional endpoints expected by frontend
@app.get("/api/environmental-data")
async def get_environmental_data():
    """Get general environmental data"""
    import random
    return {
        "location": "Global",
        "pm25": random.uniform(10, 50),
        "co2": random.uniform(400, 450),
        "forest_cover": random.uniform(60, 80),
        "water_quality": random.uniform(70, 90),
        "timestamp": datetime.now().isoformat(),
        "source": "Environmental Monitoring Network"
    }

@app.get("/api/satellite-data")
async def get_satellite_data(commitmentId: str = "general"):
    """Get satellite data for a specific commitment or general data"""
    import random
    return {
        "commitmentId": commitmentId,
        "location": "Global Environmental Monitoring",
        "forest_cover_percentage": random.uniform(60, 85),
        "carbon_levels": random.uniform(400, 450),
        "water_quality_index": random.uniform(70, 95),
        "air_quality_index": random.uniform(20, 80),
        "deforestation_alerts": random.randint(0, 5),
        "change_detected": random.choice([True, False]),
        "confidence_score": random.uniform(85, 98),
        "last_updated": datetime.now().isoformat(),
        "timestamp": datetime.now().isoformat(),
        "source": "NASA Landsat-8"
    }

@app.get("/api/forest-cover")
async def get_forest_cover(lat: float, lon: float):
    """Get forest cover data for specific coordinates"""
    import random
    return {
        "forest_cover": random.uniform(60, 85),
        "coordinates": {"lat": lat, "lon": lon},
        "timestamp": datetime.now().isoformat()
    }

@app.get("/api/water-quality")
async def get_water_quality(region: str):
    """Get water quality data for a specific region"""
    import random
    return {
        "quality_index": random.uniform(70, 95),
        "region": region,
        "timestamp": datetime.now().isoformat()
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
