#!/bin/bash

# EduBuddy Full-Stack Application Startup Script

echo "🎓 Starting EduBuddy..."

# Create uploads directory if it doesn't exist
mkdir -p uploads/cours uploads/td uploads/tp uploads/examens

# Start Flask backend
echo "📡 Starting Flask backend on port 5000..."
python3 app.py &
BACKEND_PID=$!

# Wait for backend to start
sleep 2

echo "✅ Backend started!"
echo ""
echo "🌐 EduBuddy is running!"
echo "   Frontend: http://localhost:5173 (or deployed URL)"
echo "   Backend API: http://localhost:5000"
echo ""
echo "Press Ctrl+C to stop"

# Wait for interrupt
trap "kill $BACKEND_PID; exit" INT
wait
