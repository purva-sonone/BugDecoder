@echo off
title CodeDoctor AI Launcher
echo ==========================================
echo       STARTING CODEDOCTOR AI 
echo ==========================================

echo.
echo [1/2] Launching Backend (FastAPI)...
start "CodeDoctor Backend" powershell -NoExit -Command "cd backend; .\venv\Scripts\activate; python main.py"

echo [2/2] Launching Frontend (Next.js)...
start "CodeDoctor Frontend" powershell -NoExit -Command "cd frontend; npm run dev"

echo.
echo Waiting for services to warm up...
timeout /t 5 /nobreak > nul

echo Opening Browser...
start http://localhost:3000

echo.
echo ALL SERVICES LAUNCHED!
echo.
pause
