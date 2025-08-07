#!/bin/bash

echo "🚀 Starting CivicXChain Platform (Sepolia Testnet)..."

# Start backend
echo "🐍 Starting backend..."
cd backend && npm run dev &

# Start frontend
echo "📱 Starting frontend..."
cd frontend && npm run dev &

echo "✅ CivicXChain is running!"
echo "🌐 Frontend: http://localhost:3000"
echo "🔗 Backend API: http://localhost:8000"
echo ""
echo "📋 Your contracts are deployed on Sepolia:"
echo "   🏛️  Governance: 0xE16F89910DF3Bd0f1C06b667F85D2b68582BA4c4"
echo "   📊 Oracle: 0x660d07eE351eBB4BF55CFD9327c128459a7c2fBD"
echo ""
echo "Press Ctrl+C to stop all services"

# Wait for user to stop
wait
