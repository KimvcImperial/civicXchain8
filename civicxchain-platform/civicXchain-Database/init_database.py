# File: civixChain-Database/init_database.py

import os
import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def create_database():
    """Create the database and tables"""
    try:
        # Connect to PostgreSQL server (not specific database)
        conn = psycopg2.connect(
            host="localhost",
            user=os.getenv("DB_USER", "postgres"),
            password=os.getenv("DB_PASSWORD")
        )
        conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
        cursor = conn.cursor()
        
        # Create database
        cursor.execute("CREATE DATABASE ecochain;")
        print("✅ Database 'ecochain' created successfully!")
        
        cursor.close()
        conn.close()
        
        # Now connect to the new database and create tables
        create_tables()
        
    except psycopg2.errors.DuplicateDatabase:
        print("📋 Database 'ecochain' already exists. Creating tables...")
        create_tables()
    except Exception as e:
        print(f"❌ Error creating database: {e}")

def create_tables():
    """Create tables from schema.sql"""
    try:
        # Connect to ecochain database
        conn = psycopg2.connect(os.getenv("DATABASE_URL"))
        cursor = conn.cursor()
        
        # Read and execute schema.sql
        with open('schema.sql', 'r') as file:
            schema_sql = file.read()
            cursor.execute(schema_sql)
        
        conn.commit()
        print("✅ Tables created successfully!")
        
        cursor.close()
        conn.close()
        
    except Exception as e:
        print(f"❌ Error creating tables: {e}")

if __name__ == "__main__":
    create_database()