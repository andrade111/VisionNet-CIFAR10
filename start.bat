@echo off
title VisionNet-CIFAR10 - Fullstack Starter
echo ============================================================
echo        VisionNet-CIFAR10: Fullstack Inference Platform       
echo ============================================================

if not exist ".venv\Scripts\python.exe" (
    echo [!] Criando ambiente virtual Python...
    python -m venv .venv
    call .venv\Scripts\activate.bat
    pip install -r backend\requirements.txt
)

echo [+] Iniciando Backend FastAPI (http://localhost:8000)...
start "VisionNet Backend (FastAPI)" cmd /k "call .venv\Scripts\activate.bat && python backend\run.py"

timeout /t 2 /nobreak > nul

echo [+] Iniciando Frontend Vite (http://localhost:5173)...
start "VisionNet Frontend (React+Vite)" cmd /k "cd frontend && npm run dev"

echo ============================================================
echo Backend API:  http://localhost:8000
echo Frontend App: http://localhost:5173
echo ============================================================
pause
