#!/bin/bash
echo "============================================"
echo "  AI Legal Assistant - Mac/Linux Setup"
echo "============================================"
echo ""

echo "[1/4] Setting up Backend..."
cd backend
python3 -m venv venv
source venv/bin/activate
python3 -m pip install --upgrade pip
pip install -r requirements.txt
cp .env.example .env
echo "Backend setup done!"
echo ""

echo "[2/4] Setting up Frontend..."
cd ../frontend
npm install
cp .env.local.example .env.local
echo "Frontend setup done!"
echo ""

echo "============================================"
echo "  SETUP COMPLETE!"
echo "============================================"
echo ""
echo "NEXT STEPS:"
echo "1. Edit backend/.env and add your GEMINI_API_KEY"
echo "2. Terminal 1: cd backend && source venv/bin/activate && uvicorn main:app --reload"
echo "3. Terminal 2: cd frontend && npm run dev"
echo "4. Open http://localhost:3000"
echo ""
