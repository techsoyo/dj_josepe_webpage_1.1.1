# Script para arrancar el frontend limpiamente
# Mata todos los procesos de Node.js, limpia cache y arranca el frontend

# Cambiar al directorio del frontend
$frontendDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $frontendDir

Write-Host "🔄 Limpiando procesos y cache del frontend..." -ForegroundColor Yellow

# Matar todos los procesos de Node.js
try {
  $nodeProcesses = Get-Process -Name node -ErrorAction SilentlyContinue
  if ($nodeProcesses) {
    Write-Host "⚠️  Deteniendo $($nodeProcesses.Count) procesos de Node.js..." -ForegroundColor Yellow
    Stop-Process -Name node -Force -ErrorAction SilentlyContinue
    Start-Sleep -Seconds 2
  }
  else {
    Write-Host "✅ No hay procesos de Node.js activos" -ForegroundColor Green
  }
}
catch {
  Write-Host "⚠️  Error al detener procesos: $($_.Exception.Message)" -ForegroundColor Red
}

# Limpiar cache de Next.js
if (Test-Path ".next") {
  Write-Host "🧹 Limpiando cache de Next.js..." -ForegroundColor Yellow
  Remove-Item .next -Recurse -Force -ErrorAction SilentlyContinue
  Start-Sleep -Seconds 1
}

# Verificar que el puerto 3000 esté libre
$port3000 = netstat -ano | Select-String ":3000"
if ($port3000) {
  Write-Host "⚠️  Puerto 3000 aún ocupado:" -ForegroundColor Red
  Write-Host $port3000 -ForegroundColor Red
    
  # Intentar matar el proceso específico
  $processId = ($port3000 -split '\s+')[-1]
  if ($processId -and $processId -match '^\d+$') {
    Write-Host "🔪 Matando proceso PID: $processId" -ForegroundColor Yellow
    try {
      Stop-Process -Id $processId -Force -ErrorAction Stop
      Start-Sleep -Seconds 2
    }
    catch {
      Write-Host "❌ No se pudo matar el proceso PID: $processId" -ForegroundColor Red
    }
  }
}

Write-Host "🚀 Iniciando frontend en modo desarrollo..." -ForegroundColor Green
Write-Host "📍 Directorio: $(Get-Location)" -ForegroundColor Cyan
Write-Host "🔗 URL: http://localhost:3000" -ForegroundColor Cyan
Write-Host ""
Write-Host "Para detener: Ctrl+C" -ForegroundColor Yellow
Write-Host "============================================" -ForegroundColor Magenta

# Arrancar el frontend
pnpm dev
