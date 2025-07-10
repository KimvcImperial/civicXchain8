import sqlite3
from datetime import datetime, timedelta

def run_validation_checks():
    """Run various validation checks"""
    
    conn = sqlite3.connect('ecochain_satellite.db')
    cursor = conn.cursor()
    
    print("🛰️ SATELLITE VALIDATION SYSTEM")
    print("=" * 40)
    
    # Check 1: Current status of all commitments
    print("\n1️⃣ Current Commitment Status:")
    cursor.execute('''
        SELECT c.creator, c.title, c.target_value, 
               AVG(sd.forest_cover_percentage) as current_value,
               CASE 
                   WHEN AVG(sd.forest_cover_percentage) >= c.target_value 
                   THEN 'MEETING TARGET' 
                   ELSE 'BELOW TARGET' 
               END as status
        FROM commitments c
        LEFT JOIN satellite_data sd ON c.id = sd.commitment_id
        WHERE sd.measurement_date >= date('now', '-30 days')
        GROUP BY c.id
    ''')
    
    for row in cursor.fetchall():
        creator, title, target, current, status = row
        print(f"  {creator}: {title}")
        print(f"    Target: {target}% | Current: {current:.1f}%")
        print(f"    Status: {status}")
    
    # Check 2: Trend analysis
    print("\n2️⃣ 6-Month Trend Analysis:")
    cursor.execute('''
        SELECT strftime('%Y-%m', sd.measurement_date) as month,
               AVG(sd.forest_cover_percentage) as avg_cover
        FROM satellite_data sd
        WHERE sd.measurement_date >= date('now', '-6 months')
        GROUP BY month
        ORDER BY month
    ''')
    
    trend_data = cursor.fetchall()
    for month, avg_cover in trend_data:
        print(f"  {month}: {avg_cover:.1f}% forest cover")
    
    # Check 3: Data quality assessment
    print("\n3️⃣ Data Quality Assessment:")
    cursor.execute('''
        SELECT satellite_source, 
               COUNT(*) as total_readings,
               AVG(is_validated) * 100 as validation_rate
        FROM satellite_data
        GROUP BY satellite_source
    ''')
    
    for source, total, validation_rate in cursor.fetchall():
        print(f"  {source}: {total} readings, {validation_rate:.0f}% validated")
    
    conn.close()

def simulate_real_time_check():
    """Simulate what happens when new satellite data comes in"""
    
    print("\n🔴 SIMULATING REAL-TIME SATELLITE DATA...")
    
    conn = sqlite3.connect('ecochain_satellite.db')
    cursor = conn.cursor()
    
    # Add new "satellite reading"
    new_reading = 82.5  # New forest cover percentage
    cursor.execute('''
        INSERT INTO satellite_data 
        (commitment_id, latitude, longitude, forest_cover_percentage, 
         satellite_source, measurement_date)
        VALUES (1, -3.4653, -62.2159, ?, 'NASA_MODIS', ?)
    ''', (new_reading, datetime.now()))
    
    # Check if this affects validation
    cursor.execute('''
        SELECT c.title, c.target_value, AVG(sd.forest_cover_percentage) as current_avg
        FROM commitments c
        JOIN satellite_data sd ON c.id = sd.commitment_id
        WHERE c.id = 1
        GROUP BY c.id
    ''')
    
    title, target, current_avg = cursor.fetchone()
    
    print(f"📡 New reading: {new_reading}% forest cover")
    print(f"📊 Updated average: {current_avg:.1f}%")
    
    if current_avg >= target:
        print("✅ COMMITMENT STILL ON TRACK!")
    else:
        print("⚠️ COMMITMENT FALLING BEHIND!")
    
    conn.commit()
    conn.close()

if __name__ == "__main__":
    run_validation_checks()
    simulate_real_time_check()