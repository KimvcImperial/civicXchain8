"""import sqlite3
import json
from datetime import datetime, timedelta
import random

def create_satellite_database():
    """Create database for satellite validation"""
    
    # Connect to database (creates file if doesn't exist)
    conn = sqlite3.connect('ecochain_satellite.db')
    cursor = conn.cursor()
    
    # Create commitments table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS commitments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            creator TEXT NOT NULL,
            title TEXT NOT NULL,
            target_value REAL NOT NULL,
            actual_value REAL DEFAULT 0,
            metric_type TEXT NOT NULL,  -- 'forest_cover', 'pm25', 'water_quality'
            latitude REAL,
            longitude REAL,
            deadline DATETIME NOT NULL,
            status TEXT DEFAULT 'active',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Create satellite_data table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS satellite_data (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            commitment_id INTEGER,
            latitude REAL NOT NULL,
            longitude REAL NOT NULL,
            forest_cover_percentage REAL,
            pm25_level REAL,
            water_quality_score REAL,
            satellite_source TEXT NOT NULL,
            measurement_date DATETIME NOT NULL,
            is_validated BOOLEAN DEFAULT TRUE,
            FOREIGN KEY (commitment_id) REFERENCES commitments (id)
        )
    ''')
    
    conn.commit()
    print("✅ Database tables created!")
    
    # Add sample data
    add_sample_data(cursor)
    conn.commit()
    conn.close()
    
    print("🛰️ Satellite database ready!")

def add_sample_data(cursor):
    """Add realistic sample data"""
    
    # Sample commitment (Amazon forest protection)
    cursor.execute('''
        INSERT INTO commitments 
        (creator, title, target_value, metric_type, latitude, longitude, deadline)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    ''', (
        'Brazil Environment Minister',
        'Amazon Forest Protection',
        85.0,  # Target: 85% forest cover
        'forest_cover',
        -3.4653, -62.2159,  # Amazon coordinates
        '2024-12-31'
    ))
    
    commitment_id = cursor.lastrowid
    
    # Generate 12 months of satellite data
    base_date = datetime.now() - timedelta(days=365)
    for month in range(12):
        date = base_date + timedelta(days=month*30)
        
        # Simulate forest cover improving over time
        forest_cover = 78 + (month * 0.5) + random.uniform(-2, 2)
        
        cursor.execute('''
            INSERT INTO satellite_data 
            (commitment_id, latitude, longitude, forest_cover_percentage, 
             satellite_source, measurement_date)
            VALUES (?, ?, ?, ?, ?, ?)
        ''', (
            commitment_id, -3.4653, -62.2159, forest_cover,
            'NASA_MODIS', date
        ))
    
    print("📊 Sample data added!")

def check_validation():
    """Check if commitments are being met"""
    conn = sqlite3.connect('ecochain_satellite.db')
    cursor = conn.cursor()
    
    cursor.execute('''
        SELECT c.title, c.target_value, c.metric_type,
               AVG(sd.forest_cover_percentage) as avg_forest_cover,
               COUNT(sd.id) as data_points
        FROM commitments c
        LEFT JOIN satellite_data sd ON c.id = sd.commitment_id
        GROUP BY c.id
    ''')
    
    results = cursor.fetchall()
    
    print("\n🔍 Validation Results:")
    print("=" * 50)
    
    for row in results:
        title, target, metric, avg_value, points = row
        
        if avg_value:
            status = "✅ PASSING" if avg_value >= target else "❌ FAILING"
            print(f"{title}:")
            print(f"  Target: {target}% | Current: {avg_value:.1f}%")
            print(f"  Status: {status} | Data points: {points}")
        else:
            print(f"{title}: No satellite data available")
    
    conn.close()

if __name__ == "__main__":
    print("🚀 Creating Satellite Validation Database...")
    create_satellite_database()
    check_validation()"""




import sqlite3
from datetime import datetime, timedelta
import json
import random

def create_satellite_database():
    """Create database for satellite validation"""
    
    # Connect to database (creates file if doesn't exist)
    conn = sqlite3.connect('ecochain_satellite.db')
    cursor = conn.cursor()
    
    # Create commitments table (update existing)
    cursor.execute('''
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
            deadline DATETIME NOT NULL,
            status TEXT DEFAULT 'active',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Create satellite_data table (if not exists)
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS satellite_data (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            commitment_id INTEGER,
            data_type TEXT,
            value REAL,
            unit TEXT,
            source TEXT,
            verified BOOLEAN DEFAULT FALSE,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (commitment_id) REFERENCES commitments (id)
        )
    ''')
    
    # Create rewards table
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
    
    # Insert sample commitments if table is empty
    cursor.execute("SELECT COUNT(*) FROM commitments")
    if cursor.fetchone()[0] == 0:
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
        
        for commitment in sample_commitments:
            cursor.execute("""
                INSERT INTO commitments (
                    creator, title, description, category, target_value, 
                    actual_value, metric_type, latitude, longitude, deadline
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, commitment)
    
    conn.commit()
    conn.close()
    print("Database created and populated with sample data!")

if __name__ == "__main__":
    create_satellite_database()