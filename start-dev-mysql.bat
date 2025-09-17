@echo off
title DJ JOSEP - DESARROLLO (MySQL)
                                                   
echo.
echo  🚀 MODO DESARROLLO - MySQL Database (192.168.1.40)
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

echo 🔄 Configurando MySQL para desarrollo...
node setup-dev-mysql.js
if %errorlevel% neq 0 (
    echo ❌ ERROR: No se pudo configurar MySQL
    pause
    exit /b 1
)

echo 🔄 Configurando entorno desarrollo...
node set-env.js dev
cd frontend && node ../set-env.js dev && cd ..

echo ✅ Entorno configurado para DESARROLLO con MySQL

echo.
echo 🔄 Iniciando Backend (Puerto 4000)...
start /B cmd /c "cd backend && pnpm run dev"

echo ⏳ Esperando inicio del backend...
timeout /t 8 /nobreak >nul

echo 🔄 Iniciando Frontend (Puerto 3000)...
echo.
echo 📡 ACCESO DISPONIBLE:
echo    • Web: http://localhost:3000
echo    ÔÇó Admin: URL secreta /dj-josepe-aqui-mando-yo
echo    • MySQL: 192.168.1.40:3306
echo.
cd frontend && pnpm run dev

echo.
echo 🔄 Limpiando procesos al cerrar...
taskkill /f /im node.exe >nul 2>nul
pause