#!/usr/bin/env python3
"""
Dual Database Manager for CivicXChain Platform
Supports both PostgreSQL (production) and SQLite (development) seamlessly
"""

import os
import sys
from datetime import datetime
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class DatabaseManager:
    """Manages connections to both PostgreSQL and SQLite databases"""
    
    def __init__(self, prefer_postgres=True):
        self.prefer_postgres = prefer_postgres
        self.conn = None
        self.cursor = None
        self.db_type = None
        
    def connect(self):
        """Connect to database with automatic fallback"""
        if self.prefer_postgres:
            try:
                # Try PostgreSQL first
                import psycopg2
                database_url = os.getenv("DATABASE_URL")
                if database_url:
                    self.conn = psycopg2.connect(database_url)
                    self.cursor = self.conn.cursor()
                    self.db_type = "postgresql"
                    print("✅ Connected to PostgreSQL")
                    return True
                else:
                    print("⚠️ DATABASE_URL not found, falling back to SQLite")
            except Exception as e:
                print(f"⚠️ PostgreSQL connection failed: {e}")
                print("💡 Falling back to SQLite...")
        
        # Fallback to SQLite
        try:
            import sqlite3
            # Use the existing working SQLite database
            db_path = os.path.join('..', 'backend', 'CivicXchain-Database', 'ecochain_satellite.db')
            if not os.path.exists(db_path):
                # If not found, try current directory
                db_path = 'ecochain_satellite.db'
            
            self.conn = sqlite3.connect(db_path)
            self.conn.row_factory = sqlite3.Row  # For dict-like access
            self.cursor = self.conn.cursor()
            self.db_type = "sqlite"
            print(f"✅ Connected to SQLite: {db_path}")
            return True
        except Exception as e:
            print(f"❌ SQLite connection failed: {e}")
            return False
    
    def get_sql_syntax(self, query_type):
        """Get database-specific SQL syntax"""
        if self.db_type == "postgresql":
            syntax = {
                "autoincrement": "SERIAL PRIMARY KEY",
                "datetime": "TIMESTAMP DEFAULT NOW()",
                "boolean": "BOOLEAN DEFAULT FALSE",
                "text": "TEXT",
                "real": "DECIMAL",
                "integer": "INTEGER"
            }
        else:  # SQLite
            syntax = {
                "autoincrement": "INTEGER PRIMARY KEY AUTOINCREMENT",
                "datetime": "TIMESTAMP DEFAULT CURRENT_TIMESTAMP",
                "boolean": "BOOLEAN DEFAULT 0",
                "text": "TEXT",
                "real": "REAL",
                "integer": "INTEGER"
            }
        return syntax.get(query_type, query_type)
    
    def create_tables(self):
        """Create tables with database-specific syntax"""
        if not self.conn:
            print("❌ No database connection")
            return False
            
        try:
            # Create commitments table
            if self.db_type == "postgresql":
                self.cursor.execute("""
                    CREATE TABLE IF NOT EXISTS commitments (
                        id SERIAL PRIMARY KEY,
                        creator TEXT NOT NULL,
                        title TEXT NOT NULL,
                        description TEXT,
                        category TEXT,
                        target_value DECIMAL DEFAULT 0,
                        actual_value DECIMAL DEFAULT 0,
                        metric_type TEXT NOT NULL,
                        latitude DECIMAL,
                        longitude DECIMAL,
                        deadline TIMESTAMP NOT NULL,
                        status TEXT DEFAULT 'active',
                        judge_verified BOOLEAN DEFAULT FALSE,
                        reward_claimed BOOLEAN DEFAULT FALSE,
                        created_at TIMESTAMP DEFAULT NOW()
                    )
                """)
            else:  # SQLite
                self.cursor.execute("""
                    CREATE TABLE IF NOT EXISTS commitments (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        creator TEXT NOT NULL,
                        title TEXT NOT NULL,
                        description TEXT,
                        category TEXT,
                        target_value REAL DEFAULT 0,
                        actual_value REAL DEFAULT 0,
                        metric_type TEXT NOT NULL,
                        latitude REAL,
                        longitude REAL,
                        deadline TEXT NOT NULL,
                        status TEXT DEFAULT 'active',
                        judge_verified INTEGER DEFAULT 0,
                        reward_claimed INTEGER DEFAULT 0,
                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                    )
                """)
            
            # Create satellite_data table
            if self.db_type == "postgresql":
                self.cursor.execute("""
                    CREATE TABLE IF NOT EXISTS satellite_data (
                        id SERIAL PRIMARY KEY,
                        commitment_id INTEGER REFERENCES commitments(id),
                        data_type TEXT,
                        value DECIMAL,
                        unit TEXT,
                        source TEXT,
                        verified BOOLEAN DEFAULT FALSE,
                        timestamp TIMESTAMP DEFAULT NOW()
                    )
                """)
            else:  # SQLite
                self.cursor.execute("""
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
            
            # Create achievements table
            if self.db_type == "postgresql":
                self.cursor.execute("""
                    CREATE TABLE IF NOT EXISTS achievements (
                        id SERIAL PRIMARY KEY,
                        commitment_id INTEGER REFERENCES commitments(id),
                        first_achieved_at TIMESTAMP,
                        last_achieved_at TIMESTAMP,
                        achievement_count INTEGER DEFAULT 0,
                        max_value_reached DECIMAL,
                        days_to_achievement DECIMAL,
                        created_at TIMESTAMP DEFAULT NOW()
                    )
                """)
            else:  # SQLite
                self.cursor.execute("""
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
            
            self.conn.commit()
            print(f"✅ Tables created successfully in {self.db_type}")
            return True
            
        except Exception as e:
            print(f"❌ Error creating tables: {e}")
            self.conn.rollback()
            return False
    
    def close(self):
        """Close database connection"""
        if self.cursor:
            self.cursor.close()
        if self.conn:
            self.conn.close()
        print(f"🔒 {self.db_type} connection closed")

def main():
    """Test the database manager"""
    print("🚀 CivicXChain Database Manager")
    print("=" * 40)
    
    # Try PostgreSQL first, fallback to SQLite
    db = DatabaseManager(prefer_postgres=True)
    
    if db.connect():
        print(f"📊 Using {db.db_type.upper()} database")
        
        # Create tables
        if db.create_tables():
            print("✅ Database setup complete!")
        else:
            print("❌ Database setup failed!")
        
        db.close()
    else:
        print("❌ Could not connect to any database!")

if __name__ == "__main__":
    main()
