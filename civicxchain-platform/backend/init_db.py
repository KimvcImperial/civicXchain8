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
        
        # Insert sample commitments (Public Officials' Environmental Commitments)
        sample_commitments = [
            (
                "Mayor Sarah Johnson (Mayor)",
                "Reduce PM2.5 Air Pollution Below WHO Standards",
                "Commit to reducing PM2.5 levels to below 15 μg/m³ through enhanced public transport, industrial regulations, and green energy initiatives",
                "air_quality",
                15.0,
                22.5,
                "μg/m³",
                40.7128,
                -74.0060,
                "2024-12-31",
                "active"
            ),
            (
                "Governor Michael Chen (Governor)",
                "Achieve 80% Forest Cover in State Parks",
                "Increase forest coverage in state parks to 80% through reforestation programs and protection of existing forests",
                "forest_protection",
                80.0,
                65.0,
                "percentage",
                34.0522,
                -118.2437,
                "2025-06-30",
                "active"
            ),
            (
                "Dr. Elena Rodriguez (Environment Minister)",
                "Improve Water Quality Index to 90+",
                "Enhance water treatment facilities and reduce industrial pollution to achieve water quality index above 90",
                "water_management",
                90.0,
                75.0,
                "quality_index",
                41.8781,
                -87.6298,
                "2025-03-15",
                "active"
            )
        ]
        
        cursor.executemany("""
            INSERT INTO commitments (
                creator, title, description, category, target_value, 
                actual_value, metric_type, latitude, longitude, deadline, status
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, sample_commitments)
        
        # Insert sample satellite data (Environmental monitoring for official commitments)
        sample_satellite_data = [
            (1, "pm25_levels", 22.5, "μg/m³", "Sentinel-5P", 1),
            (1, "air_quality_index", 65, "AQI", "Ground Stations", 1),
            (2, "forest_cover", 65.0, "percentage", "Landsat-8", 1),
            (2, "deforestation_rate", -2.1, "percentage/year", "Sentinel-2", 1),
            (3, "water_quality_index", 75.0, "WQI", "Water Monitoring", 1),
            (3, "pollution_levels", 25.0, "mg/L", "Lab Analysis", 1)
        ]
        
        cursor.executemany("""
            INSERT INTO satellite_data (
                commitment_id, data_type, value, unit, source, verified
            ) VALUES (?, ?, ?, ?, ?, ?)
        """, sample_satellite_data)
        
        # Commit changes
        conn.commit()
        print(f"Database initialized successfully at {db_path}")
        print(f"Created {len(sample_commitments)} sample commitments")
        print(f"Created {len(sample_satellite_data)} sample satellite data entries")
        
    except Exception as e:
        print(f"Error initializing database: {e}")
        conn.rollback()
    finally:
        conn.close()

if __name__ == "__main__":
    init_database()
