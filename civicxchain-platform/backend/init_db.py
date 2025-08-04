#!/usr/bin/env python3
"""
Database initialization script for CivicXChain platform.
Creates the SQLite database and required tables.
"""

import sqlite3
import os
from datetime import datetime

def init_database():
    """Initialize the database with required tables and sample data."""
    
    # Create database directory if it doesn't exist
    db_dir = "CivicXchain-Database"
    if not os.path.exists(db_dir):
        os.makedirs(db_dir)
    
    # Connect to database (creates file if it doesn't exist)
    db_path = os.path.join(db_dir, "ecochain_satellite.db")
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    try:
        # Create commitments table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS commitments (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                creator TEXT NOT NULL,
                title TEXT NOT NULL,
                description TEXT,
                category TEXT,
                target_value REAL,
                actual_value REAL DEFAULT 0,
                metric_type TEXT,
                latitude REAL,
                longitude REAL,
                deadline TEXT,
                status TEXT DEFAULT 'active',
                judge_verified INTEGER DEFAULT 0,
                reward_claimed INTEGER DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        
        # Create satellite_data table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS satellite_data (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                commitment_id INTEGER,
                data_type TEXT,
                value REAL,
                unit TEXT,
                source TEXT,
                verified BOOLEAN DEFAULT 0,
                timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (commitment_id) REFERENCES commitments (id)
            )
        """)

        # Create achievements table for tracking when targets are met
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS achievements (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                commitment_id INTEGER,
                first_achieved_at TIMESTAMP,
                last_achieved_at TIMESTAMP,
                achievement_count INTEGER DEFAULT 0,
                max_value_reached REAL,
                days_to_achievement REAL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (commitment_id) REFERENCES commitments (id)
            )
        """)
        
        # Database tables created - ready for real commitment data
        
        # Commit changes
        conn.commit()
        print(f"Database initialized successfully at {db_path}")
        print("Database ready for real commitment data")
        
    except Exception as e:
        print(f"Error initializing database: {e}")
        conn.rollback()
    finally:
        conn.close()

if __name__ == "__main__":
    init_database()
