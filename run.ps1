# CodeDoctor AI - Startup Script

Write-Host "--- Starting CodeDoctor AI ---" -ForegroundColor Cyan

# 1. Start Backend
Write-Host "[1/2] Starting Backend (FastAPI)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; .\venv\Scripts\activate; python main.py"

# 2. Start Frontend
Write-Host "[2/2] Starting Frontend (Next.js)..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend; npm run dev"

Write-Host "Success: Both services are launching in separate windows!" -ForegroundColor White
Write-Host "Backend: http://localhost:8000"
Write-Host "Frontend: http://localhost:3000"

# Open browser after a short delay
Start-Sleep -Seconds 5
Start-Process "http://localhost:3000"
