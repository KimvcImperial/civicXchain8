from database_manager import DatabaseManager

def create_satellite_database():
    """Create database for satellite validation with automatic PostgreSQL/SQLite fallback"""

    # Use the database manager for safe connection
    db = DatabaseManager(prefer_postgres=True)

    if not db.connect():
        print("❌ Could not connect to any database!")
        return False

    conn = db.conn
    cursor = db.cursor
    
    # Create tables using the database manager (handles PostgreSQL/SQLite differences)
    if db.create_tables():
        print("✅ Satellite database tables created successfully!")
    else:
        print("❌ Failed to create satellite database tables!")
        db.close()
        return False

    # Add additional rewards table if needed (database manager handles core tables)
    try:
        if db.db_type == "postgresql":
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS rewards (
                    id SERIAL PRIMARY KEY,
                    commitment_id INTEGER REFERENCES commitments(id),
                    official_id TEXT,
                    reward_type TEXT,
                    amount DECIMAL,
                    claimed BOOLEAN DEFAULT FALSE,
                    claimed_at TIMESTAMP
                )
            ''')
        else:  # SQLite
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS rewards (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    commitment_id INTEGER,
                    official_id TEXT,
                    reward_type TEXT,
                    amount REAL,
                    claimed BOOLEAN DEFAULT FALSE,
                    claimed_at DATETIME,
                    FOREIGN KEY (commitment_id) REFERENCES commitments (id)
                )
            ''')

        conn.commit()
        print("✅ Additional rewards table created!")

    except Exception as e:
        print(f"⚠️ Could not create rewards table: {e}")
        # This is not critical, continue anyway
    
    # Insert sample commitments if table is empty (only if no existing data)
    try:
        cursor.execute("SELECT COUNT(*) FROM commitments")
        count_result = cursor.fetchone()
        commitment_count = count_result[0] if count_result else 0

        if commitment_count == 0:
            print("📝 Adding sample commitments...")
            sample_commitments = [
                ("Environmental Protection Agency", "Reduce PM2.5 Air Pollution",
                 "Target: Below 35 μg/m³ average in urban areas", "air_quality",
                 35.0, 42.5, "pm25", 40.7128, -74.0060, "2024-12-31"),

                ("Department of Forestry", "Increase Forest Coverage",
                 "Target: 25% forest coverage in designated region", "forest_cover",
                 25.0, 18.2, "percentage", 34.0522, -118.2437, "2024-10-15"),

                ("Water Management Authority", "Clean Water Access",
                 "Ensure 95% population has clean water access", "water_quality",
                 95.0, 87.3, "percentage", 41.8781, -87.6298, "2024-11-30"),

                ("Ministry of Health", "Malaria Prevention Program",
                 "Reduce malaria cases by 50% in affected regions", "disease_prevention",
                 50.0, 28.7, "percentage", 1.3521, 103.8198, "2024-09-30")
            ]

            # Use database-appropriate parameter placeholders
            placeholder = "%s" if db.db_type == "postgresql" else "?"
            placeholders = ", ".join([placeholder] * 10)

            for commitment in sample_commitments:
                cursor.execute(f"""
                    INSERT INTO commitments (
                        creator, title, description, category, target_value,
                        actual_value, metric_type, latitude, longitude, deadline
                    ) VALUES ({placeholders})
                """, commitment)

            print(f"✅ Added {len(sample_commitments)} sample commitments!")
        else:
            print(f"📊 Found {commitment_count} existing commitments, skipping sample data")

    except Exception as e:
        print(f"⚠️ Could not add sample data: {e}")

    # Commit and close
    try:
        conn.commit()
        print("✅ Database changes committed!")
    except Exception as e:
        print(f"⚠️ Commit failed: {e}")

    db.close()
    print("🎉 Satellite database setup complete!")

if __name__ == "__main__":
    create_satellite_database()