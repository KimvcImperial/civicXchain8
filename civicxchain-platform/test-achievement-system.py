#!/usr/bin/env python3
"""
Test script for the new achievement tracking system
"""

import asyncio
import aiohttp
import json
from datetime import datetime, timedelta

BASE_URL = "http://localhost:3001/api"

async def test_achievement_system():
    """Test the new achievement tracking and judge verification system"""
    
    print("🧪 Testing Achievement Tracking System")
    print("=" * 50)
    
    async with aiohttp.ClientSession() as session:
        
        # 1. Test creating a commitment with title
        print("\n1️⃣ Creating test commitment...")
        commitment_data = {
            "creator_address": "0x1234567890123456789012345678901234567890",
            "official_name": "Test Official",
            "official_role": "Environmental Minister",
            "description": "Reduce PM2.5 levels to below 25 μg/m³",
            "deadline": (datetime.now() + timedelta(days=30)).isoformat(),
            "target_value": 2500,  # 25.00 μg/m³
            "metric_type": "pm25",
            "data_source": "NASA Earth Data",
            "stake_amount": 0.01,
            "region": "Test City"
        }
        
        try:
            async with session.post(f"{BASE_URL}/create-commitment", json=commitment_data) as resp:
                if resp.status == 200:
                    result = await resp.json()
                    commitment_id = result.get("commitment_id")
                    print(f"✅ Commitment created with ID: {commitment_id}")
                else:
                    print(f"❌ Failed to create commitment: {resp.status}")
                    return
        except Exception as e:
            print(f"❌ Error creating commitment: {e}")
            return
        
        # 2. Test updating progress to achieve target
        print(f"\n2️⃣ Updating progress for commitment {commitment_id}...")
        try:
            async with session.post(f"{BASE_URL}/oracle/update-progress/{commitment_id}", 
                                  json={"actual_value": 2400}) as resp:  # 24.00 μg/m³ - meets target
                if resp.status == 200:
                    result = await resp.json()
                    print(f"✅ Progress updated: {result}")
                else:
                    print(f"❌ Failed to update progress: {resp.status}")
        except Exception as e:
            print(f"❌ Error updating progress: {e}")
        
        # 3. Test getting achievement summary
        print(f"\n3️⃣ Getting achievement summary for commitment {commitment_id}...")
        try:
            async with session.get(f"{BASE_URL}/achievement-summary/{commitment_id}") as resp:
                if resp.status == 200:
                    summary = await resp.json()
                    print(f"✅ Achievement Summary:")
                    print(f"   First Achieved: {summary.get('first_achieved_at')}")
                    print(f"   Achievement Count: {summary.get('achievement_count')}")
                    print(f"   Max Value Reached: {summary.get('max_value_reached')}")
                    print(f"   Eligible for Reward: {summary.get('eligible_for_reward')}")
                else:
                    print(f"❌ Failed to get achievement summary: {resp.status}")
        except Exception as e:
            print(f"❌ Error getting achievement summary: {e}")
        
        # 4. Test getting commitments for judging
        print(f"\n4️⃣ Getting commitments for judging...")
        try:
            async with session.get(f"{BASE_URL}/commitments-for-judging") as resp:
                if resp.status == 200:
                    commitments = await resp.json()
                    print(f"✅ Found {len(commitments)} commitments for judging")
                    for commitment in commitments:
                        print(f"   ID: {commitment['id']}, Eligible: {commitment.get('eligible_for_reward')}")
                else:
                    print(f"❌ Failed to get commitments for judging: {resp.status}")
        except Exception as e:
            print(f"❌ Error getting commitments for judging: {e}")
        
        # 5. Test judge verification
        print(f"\n5️⃣ Testing judge verification for commitment {commitment_id}...")
        judge_address = "0x9876543210987654321098765432109876543210"
        try:
            async with session.post(f"{BASE_URL}/judge/verify-reward/{commitment_id}", 
                                  json={"judge_address": judge_address}) as resp:
                if resp.status == 200:
                    result = await resp.json()
                    print(f"✅ Judge verification successful:")
                    print(f"   Judge: {result.get('judge_address')}")
                    print(f"   Verified At: {result.get('verified_at')}")
                    print(f"   Message: {result.get('message')}")
                else:
                    error_text = await resp.text()
                    print(f"❌ Judge verification failed: {resp.status} - {error_text}")
        except Exception as e:
            print(f"❌ Error in judge verification: {e}")
        
        # 6. Test final achievement summary after judge verification
        print(f"\n6️⃣ Final achievement summary after judge verification...")
        try:
            async with session.get(f"{BASE_URL}/achievement-summary/{commitment_id}") as resp:
                if resp.status == 200:
                    summary = await resp.json()
                    print(f"✅ Final Achievement Summary:")
                    print(f"   Judge Verified: {summary.get('judge_verified')}")
                    print(f"   Eligible for Reward: {summary.get('eligible_for_reward')}")
                    print(f"   Total Achievements: {len(summary.get('achievements', []))}")
                else:
                    print(f"❌ Failed to get final achievement summary: {resp.status}")
        except Exception as e:
            print(f"❌ Error getting final achievement summary: {e}")

if __name__ == "__main__":
    print("🚀 Starting Achievement System Test")
    print("Make sure the backend server is running on localhost:3001")
    print()
    
    try:
        asyncio.run(test_achievement_system())
        print("\n✅ Test completed!")
    except KeyboardInterrupt:
        print("\n⏹️ Test interrupted by user")
    except Exception as e:
        print(f"\n❌ Test failed with error: {e}")
