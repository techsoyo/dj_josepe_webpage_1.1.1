# Script para limpiar y corregir errores de Next.js

# 1. LIMPIAR ARCHIVOS DE BUILD DE NEXT.JS
Write-Host "🧹 Limpiando archivos de build de Next.js..." -ForegroundColor Yellow
$frontendPath = "frontend"

if (Test-Path "$frontendPath\.next") {
  Remove-Item -Recurse -Force "$frontendPath\.next"
  Write-Host "✅ Carpeta .next eliminada" -ForegroundColor Green
}

if (Test-Path "$frontendPath\node_modules\.cache") {
  Remove-Item -Recurse -Force "$frontendPath\node_modules\.cache"
  Write-Host "✅ Cache de node_modules eliminado" -ForegroundColor Green
}

# 2. REINSTALAR DEPENDENCIAS DEL FRONTEND
Write-Host "📦 Reinstalando dependencias del frontend..." -ForegroundColor Yellow
Set-Location $frontendPath
npm cache clean --force
Remove-Item -Recurse -Force "node_modules" -ErrorAction SilentlyContinue
Remove-Item "package-lock.json" -ErrorAction SilentlyContinue
npm install
Set-Location ..

Write-Host "✅ Dependencias reinstaladas" -ForegroundColor Green

# 3. CREAR/ACTUALIZAR package.json DEL FRONTEND
Write-Host "📝 Configurando package.json del frontend..." -ForegroundColor Yellow
$packageJsonPath = "$frontendPath\package.json"

if (Test-Path $packageJsonPath) {
  $packageJson = Get-Content $packageJsonPath -Raw | ConvertFrom-Json
    
  # Agregar type: "module" si no existe
  if (-not $packageJson.type) {
    $packageJson | Add-Member -Type NoteProperty -Name "type" -Value "module" -Force
    $packageJson | ConvertTo-Json -Depth 10 | Set-Content $packageJsonPath
    Write-Host "✅ Agregado 'type': 'module' al package.json" -ForegroundColor Green
  }
}

Write-Host "🎉 Script completado. Intenta iniciar los servidores nuevamente." -ForegroundColor Green