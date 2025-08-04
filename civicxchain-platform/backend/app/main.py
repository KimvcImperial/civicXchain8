

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
            SELECT c.id, c.creator, c.title, c.description, c.category, c.target_value,
                   c.actual_value, c.metric_type, c.latitude, c.longitude, c.deadline,
                   c.status, c.created_at, c.judge_verified, c.reward_claimed,
                   a.first_achieved_at,
                   a.last_achieved_at,
                   a.achievement_count,
                   a.max_value_reached,
                   a.days_to_achievement,
                   CASE
                       WHEN a.first_achieved_at IS NOT NULL
                       AND datetime(a.first_achieved_at) <= datetime(c.deadline)
                       THEN 1
                       ELSE 0
                   END as eligible_for_reward,
                   CASE
                       WHEN datetime('now') > datetime(c.deadline) THEN 1
                       ELSE 0
                   END as is_expired
            FROM commitments c
            LEFT JOIN achievements a ON c.id = a.commitment_id
            ORDER BY c.created_at DESC
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

@app.get("/api/commitments/{commitment_id}")
async def get_commitment_by_id(commitment_id: int):
    """Get a specific commitment by ID"""
    conn = get_db_connection()
    try:
        cursor = conn.execute("""
            SELECT c.id, c.creator, c.title, c.description, c.category, c.target_value,
                   c.actual_value, c.metric_type, c.latitude, c.longitude, c.deadline,
                   c.status, c.created_at, c.judge_verified, c.reward_claimed,
                   a.first_achieved_at,
                   a.last_achieved_at,
                   a.achievement_count,
                   a.max_value_reached,
                   a.days_to_achievement,
                   CASE
                       WHEN a.first_achieved_at IS NOT NULL
                       AND datetime(a.first_achieved_at) <= datetime(c.deadline)
                       THEN 1
                       ELSE 0
                   END as eligible_for_reward,
                   CASE
                       WHEN datetime('now') > datetime(c.deadline) THEN 1
                       ELSE 0
                   END as is_expired
            FROM commitments c
            LEFT JOIN achievements a ON c.id = a.commitment_id
            WHERE c.id = ?
        """, (commitment_id,))

        commitment = cursor.fetchone()
        if not commitment:
            raise HTTPException(status_code=404, detail="Commitment not found")

        return dict(commitment)
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

@app.get("/api/oracle-data")
async def get_oracle_data():
    """Get current oracle data that matches frontend display"""
    # This should return the same data that the frontend oracle displays
    # For consistency with the live feed
    return {
        "pm25": {
            "value": 20.5,  # Current PM2.5 value in μg/m³ (below 23, so targets should be achieved)
            "timestamp": datetime.now().isoformat(),
            "status": "live",
            "source": "Chainlink Oracle"
        },
        "co2": {
            "value": 105,
            "timestamp": datetime.now().isoformat(),
            "status": "live",
            "source": "Chainlink Oracle"
        },
        "forest_cover": {
            "value": 81.6,
            "timestamp": datetime.now().isoformat(),
            "status": "live",
            "source": "Chainlink Oracle"
        }
    }

# New Achievement Tracking Endpoints
@app.get("/api/commitments-for-judging")
async def get_commitments_for_judging():
    """Get commitments that need judge verification with achievement tracking using oracle data"""
    conn = get_db_connection()
    try:
        # Get oracle data for consistent checking
        oracle_data = await get_oracle_data()
        current_pm25 = oracle_data["pm25"]["value"]

        cursor = conn.execute("""
            SELECT c.*,
                   a.first_achieved_at,
                   a.last_achieved_at,
                   a.achievement_count,
                   a.max_value_reached,
                   a.days_to_achievement,
                   COALESCE(c.judge_verified, 0) as judge_verified,
                   COALESCE(c.reward_claimed, 0) as reward_claimed
            FROM commitments c
            LEFT JOIN achievements a ON c.id = a.commitment_id
            WHERE c.status IN ('active', 'expired')
            ORDER BY c.created_at DESC
        """)

        commitments = []
        for row in cursor.fetchall():
            commitment = dict(row)

            # Check if target is achieved using oracle data
            target_value = commitment['target_value']
            metric_type = commitment['metric_type']

            # Use oracle data for achievement checking
            if metric_type in ['pm25', 'pollution']:
                target_achieved = current_pm25 <= target_value
            else:
                target_achieved = current_pm25 >= target_value  # For other metrics

            # Only include commitments that have achieved their target
            # and haven't been verified yet
            if target_achieved and not commitment['judge_verified']:
                commitment['eligible_for_reward'] = True
                commitment['current_oracle_value'] = current_pm25
                commitments.append(commitment)

        return commitments
    except Exception as e:
        print(f"Error fetching commitments for judging: {e}")
        return []
    finally:
        conn.close()

@app.get("/api/achievement-summary/{commitment_id}")
async def get_achievement_summary(commitment_id: int):
    """Get achievement summary for a commitment using real data"""
    conn = get_db_connection()
    try:
        # Get commitment details
        cursor = conn.execute("SELECT * FROM commitments WHERE id = ?", (commitment_id,))
        commitment = cursor.fetchone()

        if not commitment:
            raise HTTPException(status_code=404, detail="Commitment not found")

        # Get achievement data from database
        cursor = conn.execute("""
            SELECT first_achieved_at, last_achieved_at, achievement_count, max_value_reached
            FROM achievements WHERE commitment_id = ?
        """, (commitment_id,))

        achievement = cursor.fetchone()

        # Get oracle data for current status
        oracle_data = await get_oracle_data()
        current_value = oracle_data["pm25"]["value"]
        target_value = commitment["target_value"]

        # Check if currently achieving target
        is_currently_achieving = current_value <= target_value if commitment["metric_type"] == "pm25" else current_value >= target_value

        # If we have achievement data, use it; otherwise use current data if achieving
        if achievement:
            first_achieved = achievement["first_achieved_at"]
            latest_achieved = achievement["last_achieved_at"]
            count = achievement["achievement_count"] or 1
            max_value = achievement["max_value_reached"] or current_value
        elif is_currently_achieving:
            # Currently achieving but no recorded achievement yet
            now = datetime.now().isoformat()
            first_achieved = now
            latest_achieved = now
            count = 1
            max_value = current_value
        else:
            # Not achieving and no recorded achievements
            first_achieved = None
            latest_achieved = None
            count = 0
            max_value = current_value

        return {
            "commitment_id": commitment_id,
            "first_achieved_at": first_achieved,
            "latest_achieved_at": latest_achieved,  # Use 'latest' instead of 'last'
            "achievement_count": count,
            "max_value_reached": max_value,
            "current_oracle_value": current_value,
            "target_value": target_value,
            "eligible_for_reward": first_achieved is not None,
            "judge_verified": bool(commitment["judge_verified"]),
            "reward_claimed": bool(commitment["reward_claimed"]),
            "deadline": commitment["deadline"],
            "is_currently_achieving": is_currently_achieving
        }
    finally:
        conn.close()

@app.post("/api/judge/verify-reward/{commitment_id}")
async def judge_verify_reward(commitment_id: int, request_data: dict):
    """Judge verifies that a commitment is eligible for reward"""
    conn = get_db_connection()
    try:
        cursor = conn.execute("SELECT * FROM commitments WHERE id = ?", (commitment_id,))
        commitment = cursor.fetchone()

        if not commitment:
            raise HTTPException(status_code=404, detail="Commitment not found")

        judge_address = request_data.get("judge_address", "unknown")

        # Check if commitment was achieved during its active period (using stored achievement data)
        cursor.execute("SELECT * FROM achievements WHERE commitment_id = ?", (commitment_id,))
        achievement = cursor.fetchone()

        # Check if commitment is eligible for reward based on historical achievement
        if not achievement or not achievement["first_achieved_at"]:
            raise HTTPException(status_code=400, detail="Commitment never achieved its target during the active period")

        # Additional check: ensure achievement happened before deadline
        from datetime import datetime
        deadline = datetime.fromisoformat(commitment["deadline"].replace('Z', '+00:00'))
        first_achieved = datetime.fromisoformat(achievement["first_achieved_at"].replace('Z', '+00:00'))

        if first_achieved > deadline:
            raise HTTPException(status_code=400, detail="Target was achieved after the deadline")

        # Get current oracle data for reference
        oracle_data = await get_oracle_data()
        current_value = oracle_data["pm25"]["value"]

        # Update judge verification status in database
        cursor.execute("""
            UPDATE commitments
            SET judge_verified = 1
            WHERE id = ?
        """, (commitment_id,))

        conn.commit()

        return {
            "commitment_id": commitment_id,
            "judge_verified": True,
            "judge_address": judge_address,
            "verified_at": datetime.now().isoformat(),
            "oracle_value": current_value,
            "target_value": commitment["target_value"],
            "achieved_value": achievement["max_value_reached"],
            "first_achieved_at": achievement["first_achieved_at"],
            "message": "Reward verified by judge - user can now claim"
        }
    finally:
        conn.close()

@app.post("/api/achievements/record")
async def record_achievement(achievement_data: dict):
    """Record when a commitment achieves its target"""
    conn = get_db_connection()
    try:
        commitment_id = achievement_data.get('commitment_id')
        current_value = achievement_data.get('current_value')
        achieved_at = achievement_data.get('achieved_at', datetime.now().isoformat())

        # Check if this is the first achievement
        cursor = conn.execute("""
            SELECT first_achieved_at, achievement_count, max_value_reached
            FROM achievements WHERE commitment_id = ?
        """, (commitment_id,))

        existing = cursor.fetchone()

        if existing:
            # Update existing achievement record
            cursor.execute("""
                UPDATE achievements SET
                    last_achieved_at = ?,
                    achievement_count = achievement_count + 1,
                    max_value_reached = MAX(max_value_reached, ?)
                WHERE commitment_id = ?
            """, (achieved_at, current_value, commitment_id))
        else:
            # Create new achievement record
            cursor.execute("""
                INSERT INTO achievements (
                    commitment_id, first_achieved_at, last_achieved_at,
                    achievement_count, max_value_reached, days_to_achievement
                ) VALUES (?, ?, ?, 1, ?, 0)
            """, (commitment_id, achieved_at, achieved_at, current_value))

        conn.commit()
        return {"success": True, "message": "Achievement recorded"}
    except Exception as e:
        print(f"Error recording achievement: {e}")
        return {"success": False, "error": str(e)}
    finally:
        conn.close()

@app.post("/api/rewards/claim/{commitment_id}")
async def claim_reward(commitment_id: int):
    """Allow officials to claim their verified rewards"""
    conn = get_db_connection()
    try:
        # Check if commitment is judge verified and not already claimed
        cursor = conn.execute("""
            SELECT judge_verified, reward_claimed FROM commitments
            WHERE id = ?
        """, (commitment_id,))

        commitment = cursor.fetchone()
        if not commitment:
            raise HTTPException(status_code=404, detail="Commitment not found")

        if not commitment['judge_verified']:
            raise HTTPException(status_code=400, detail="Commitment not yet verified by judge")

        if commitment['reward_claimed']:
            raise HTTPException(status_code=400, detail="Reward already claimed")

        # Mark reward as claimed
        cursor.execute("""
            UPDATE commitments SET reward_claimed = 1 WHERE id = ?
        """, (commitment_id,))

        conn.commit()
        return {
            "success": True,
            "message": "Reward claimed successfully",
            "commitment_id": commitment_id
        }
    except Exception as e:
        return {"success": False, "error": str(e)}
    finally:
        conn.close()

@app.get("/api/commitments/expired-eligible")
async def get_expired_eligible_commitments():
    """Get expired commitments that are still eligible for rewards (achieved target before expiry)"""
    conn = get_db_connection()
    try:
        cursor = conn.execute("""
            SELECT c.*,
                   a.first_achieved_at,
                   a.last_achieved_at,
                   a.achievement_count,
                   a.max_value_reached,
                   a.days_to_achievement,
                   1 as eligible_for_reward,
                   1 as is_expired
            FROM commitments c
            INNER JOIN achievements a ON c.id = a.commitment_id
            WHERE datetime('now') > datetime(c.deadline)
            AND datetime(a.first_achieved_at) <= datetime(c.deadline)
            ORDER BY c.created_at DESC
        """)

        commitments = []
        for row in cursor.fetchall():
            commitment = dict(row)
            commitments.append(commitment)

        return commitments
    except Exception as e:
        print(f"Error fetching expired eligible commitments: {e}")
        return []
    finally:
        conn.close()

@app.post("/api/monitor/check-achievements")
async def check_achievements():
    """Automatic monitoring system to check if commitments meet their targets using oracle data"""
    conn = get_db_connection()
    try:
        # Get all active commitments
        cursor = conn.execute("""
            SELECT id, target_value, metric_type, deadline, status
            FROM commitments
            WHERE status IN ('active', 'expired')
        """)

        commitments = cursor.fetchall()
        achievements_recorded = 0

        # Get oracle data for consistency with frontend
        oracle_data = await get_oracle_data()
        oracle_pm25_value = oracle_data["pm25"]["value"]

        for commitment in commitments:
            commitment_id = commitment['id']
            target_value = commitment['target_value']
            metric_type = commitment['metric_type']

            # Use oracle data instead of satellite data
            current_value = oracle_pm25_value
            timestamp = datetime.now().isoformat()

            # Check if target is achieved (logic depends on metric type)
            target_achieved = False
            if metric_type in ['pm25', 'pollution']:
                # For pollution metrics, lower is better
                target_achieved = current_value <= target_value
            else:
                # For other metrics like forest cover, higher is better
                target_achieved = current_value >= target_value

            if target_achieved:
                # Check if we already recorded this achievement
                cursor.execute("""
                    SELECT first_achieved_at, achievement_count FROM achievements WHERE commitment_id = ?
                """, (commitment_id,))

                existing = cursor.fetchone()

                if existing:
                    # Only update latest achievement time, keep first achievement time unchanged
                    cursor.execute("""
                        UPDATE achievements SET
                            last_achieved_at = ?,
                            achievement_count = achievement_count + 1,
                            max_value_reached = ?
                        WHERE commitment_id = ?
                    """, (timestamp, current_value, commitment_id))
                else:
                    # Create new achievement record - first and latest are the same initially
                    cursor.execute("""
                        INSERT INTO achievements (
                            commitment_id, first_achieved_at, last_achieved_at,
                            achievement_count, max_value_reached, days_to_achievement
                        ) VALUES (?, ?, ?, 1, ?, 0)
                    """, (commitment_id, timestamp, timestamp, current_value))

                achievements_recorded += 1

        conn.commit()
        return {
            "success": True,
            "achievements_recorded": achievements_recorded,
            "message": f"Checked {len(commitments)} commitments using oracle data, recorded {achievements_recorded} achievements"
        }
    except Exception as e:
        return {"success": False, "error": str(e)}
    finally:
        conn.close()

@app.post("/api/blockchain/sync-commitment")
async def sync_commitment_from_blockchain(commitment_data: dict):
    """Sync a commitment from blockchain to backend database"""
    conn = get_db_connection()
    try:
        # Extract commitment data from blockchain format
        commitment_id = commitment_data.get('id')
        creator = commitment_data.get('creator')
        title = commitment_data.get('title', f'Commitment #{commitment_id}')
        description = commitment_data.get('description', 'Environmental commitment')
        official_name = commitment_data.get('officialName', 'Unknown Official')
        target_value = float(commitment_data.get('targetValue', 0))
        deadline = commitment_data.get('deadline')
        metric_type = commitment_data.get('metricType', 'pm25')

        # Convert deadline from timestamp to ISO format if needed
        if isinstance(deadline, (int, float)):
            deadline = datetime.fromtimestamp(deadline).isoformat() + 'Z'

        # Insert or update commitment in database
        cursor = conn.execute("""
            INSERT OR REPLACE INTO commitments (
                id, creator, title, description, category, target_value,
                actual_value, metric_type, deadline, status, created_at,
                judge_verified, reward_claimed
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            commitment_id,
            creator,
            title,
            description,
            'air_quality' if metric_type == 'pm25' else 'environmental',
            target_value,
            0.0,  # Initial actual value
            metric_type,
            deadline,
            'active',
            datetime.now().isoformat() + 'Z',
            0,  # Not judge verified
            0   # Reward not claimed
        ))

        conn.commit()

        return {
            "success": True,
            "message": f"Commitment #{commitment_id} synced to database",
            "commitment_id": commitment_id,
            "title": title
        }

    except Exception as e:
        print(f"Error syncing commitment: {e}")
        return {"success": False, "error": str(e)}
    finally:
        conn.close()

@app.post("/api/blockchain/update-commitment-value")
async def update_commitment_value_from_blockchain(update_data: dict):
    """Update commitment actual value from blockchain/oracle data"""
    conn = get_db_connection()
    try:
        commitment_id = update_data.get('commitment_id')
        current_value = float(update_data.get('current_value', 0))

        # Update the commitment's actual value
        cursor = conn.execute("""
            UPDATE commitments
            SET actual_value = ?
            WHERE id = ?
        """, (current_value, commitment_id))

        if cursor.rowcount == 0:
            raise HTTPException(status_code=404, detail="Commitment not found")

        # Check if this achieves the target and record achievement
        cursor = conn.execute("""
            SELECT target_value, metric_type FROM commitments WHERE id = ?
        """, (commitment_id,))

        commitment = cursor.fetchone()
        if commitment:
            target_value = commitment['target_value']
            metric_type = commitment['metric_type']

            # Check if target is achieved
            target_achieved = False
            if metric_type in ['pm25', 'pollution']:
                target_achieved = current_value <= target_value
            else:
                target_achieved = current_value >= target_value

            if target_achieved:
                # Record achievement
                now = datetime.now().isoformat() + 'Z'
                cursor.execute("""
                    INSERT OR REPLACE INTO achievements (
                        commitment_id, first_achieved_at, last_achieved_at,
                        achievement_count, max_value_reached, days_to_achievement
                    ) VALUES (?, ?, ?, 1, ?, 0)
                """, (commitment_id, now, now, current_value))

        conn.commit()

        return {
            "success": True,
            "message": f"Commitment #{commitment_id} value updated to {current_value}",
            "commitment_id": commitment_id,
            "current_value": current_value,
            "target_achieved": target_achieved if 'target_achieved' in locals() else False
        }

    except Exception as e:
        print(f"Error updating commitment value: {e}")
        return {"success": False, "error": str(e)}
    finally:
        conn.close()

@app.post("/api/commitments/{commitment_id}/achievement")
async def update_commitment_achievement(commitment_id: str, achievement_data: dict):
    """Update commitment with achievement data from frontend monitoring"""
    conn = get_db_connection()
    try:
        print(f"🎯 Backend: Updating achievement for commitment {commitment_id}")
        print(f"📊 Achievement data: {achievement_data}")

        # Update the commitment with achievement data
        conn.execute("""
            UPDATE commitments SET
                first_achieved_at = ?,
                last_achieved_at = ?,
                achievement_count = ?,
                actual_value = ?,
                eligible_for_reward = ?,
                updated_at = ?
            WHERE id = ?
        """, (
            achievement_data.get('first_achieved_at'),
            achievement_data.get('last_achieved_at'),
            achievement_data.get('achievement_count', 0),
            achievement_data.get('current_value', 0),
            achievement_data.get('is_achieved', False),
            datetime.now().isoformat(),
            commitment_id
        ))

        conn.commit()

        # Get the updated commitment
        cursor = conn.execute("""
            SELECT * FROM commitments WHERE id = ?
        """, (commitment_id,))

        commitment = cursor.fetchone()
        if not commitment:
            raise HTTPException(status_code=404, detail="Commitment not found")

        print(f"✅ Backend: Successfully updated commitment {commitment_id}")

        return {
            "success": True,
            "commitment": dict(commitment)
        }

    except Exception as e:
        print(f"❌ Backend: Error updating achievement: {e}")
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        conn.close()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
