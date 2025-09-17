@echo off
title DJ JOSEP - PRODUCCION
                                                                        
echo.
echo  🚀 MODO PRODUCCION - MySQL Database
echo  ====================================
echo.

REM Verificar Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ ERROR: Node.js no está instalado
    pause
    exit /b 1
)

REM Verificar pnpm
where pnpm >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ ERROR: pnpm no está instalado
    pause
    exit /b 1
)

echo 🔄 Eliminando procesos Node.js activos...
taskkill /f /im node.exe >nul 2>nul
timeout /t 2 /nobreak >nul

echo 🔄 Configurando entorno de producción...
node set-env.js prod
if %errorlevel% neq 0 (
    echo ❌ ERROR: No se pudo configurar el entorno
    pause
    exit /b 1
)

cd frontend
node ../set-env.js prod
if %errorlevel% neq 0 (
    echo ❌ ERROR: No se pudo configurar frontend
    pause
    exit /b 1
)
cd ..

echo ✅ Entorno configurado para PRODUCCIÓN

echo.
echo 🔄 Iniciando Backend (Puerto 4000)...
start /B cmd /c "cd backend && pnpm start"

echo ⏳ Esperando inicio del backend...
timeout /t 5 /nobreak >nul

echo 🔄 Iniciando Frontend (Puerto 3000)...
echo.
echo 📡 ACCESO DISPONIBLE:
echo    • Web: http://localhost:3000
echo    • Admin: URL secreta /dj-josepe-aqui-mando-yo
echo.
cd frontend && pnpm start

echo.
echo 🔄 Limpiando procesos al cerrar...
taskkill /f /im node.exe >nul 2>nul
pause