# VisionNet-CIFAR10 - Script de Inicialização Rápida Fullstack (Windows PowerShell)

Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "       VisionNet-CIFAR10: Fullstack Inference Platform       " -ForegroundColor White
Write-Host "============================================================" -ForegroundColor Cyan

# 1. Verificar ambiente virtual Python
$VENV_PATH = Join-Path $PSScriptRoot ".venv\Scripts\python.exe"
if (-not (Test-Path $VENV_PATH)) {
    Write-Host "[!] Ambiente virtual Python (.venv) não encontrado." -ForegroundColor Yellow
    Write-Host "Criando ambiente virtual e instalando dependências do backend..." -ForegroundColor Yellow
    python -m venv .venv
    & .venv\Scripts\pip install -r backend/requirements.txt
}

# 2. Iniciar API FastAPI Backend em nova janela
Write-Host "[+] Iniciando servidor Backend (FastAPI em http://localhost:8000)..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-ExecutionPolicy Bypass", "-Command", "cd '$PSScriptRoot'; .venv\Scripts\Activate.ps1; python backend/run.py"

Start-Sleep -Seconds 2

# 3. Iniciar Frontend Vite em nova janela
Write-Host "[+] Iniciando interface Frontend (Vite em http://localhost:5173)..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\frontend'; npm run dev"

Write-Host "------------------------------------------------------------" -ForegroundColor Cyan
Write-Host "Backend API:  http://localhost:8000 (Swagger: /docs)" -ForegroundColor Yellow
Write-Host "Frontend App: http://localhost:5173" -ForegroundColor Yellow
Write-Host "============================================================" -ForegroundColor Cyan
