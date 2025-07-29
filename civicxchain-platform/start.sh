#!/bin/bash

echo "🚀 Starting CivicXChain Platform..."

# Start frontend
echo "📱 Starting frontend..."
cd frontend && npm run dev &

echo "✅ CivicXChain is running!"
echo "🌐 Frontend: http://localhost:3000"
echo ""
echo "📋 Your contracts are deployed on Sepolia:"
echo "   🏛️  Governance: 0x5651E7F2E503dEB45E2D527bB383E2CDc68A1C78"
echo "   📊 Oracle: 0xfc6dA5DE0C9EB29b2161A1628D054D8740f887FC"
echo ""
echo "Press Ctrl+C to stop all services"

# Wait for user to stop
wait
