@echo off
echo ============================================
echo   AI Legal Assistant - Windows Setup
echo ============================================
echo.

echo [1/4] Setting up Backend...
cd backend
python -m venv venv
call venv\Scripts\activate
python -m pip install --upgrade pip
pip install -r requirements.txt
copy .env.example .env
echo.
echo Backend setup done!
echo.

echo [2/4] Setting up Frontend...
cd ..\frontend
npm install
copy .env.local.example .env.local
echo.
echo Frontend setup done!
echo.

echo ============================================
echo   SETUP COMPLETE!
echo ============================================
echo.
echo NEXT STEPS:
echo 1. Edit backend\.env and add your GEMINI_API_KEY
echo 2. Run start_backend.bat in one terminal
echo 3. Run start_frontend.bat in another terminal
echo 4. Open http://localhost:3000
echo.
pause
