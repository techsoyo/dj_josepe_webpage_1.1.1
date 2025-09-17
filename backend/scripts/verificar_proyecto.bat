@echo off
REM Script batch para ejecutar la verificación del proyecto
REM Este script maneja automáticamente los problemas de ExecutionPolicy

echo.
echo 🔍 VERIFICANDO PROYECTO DJ JOSEP BACKEND
echo ========================================

REM Verificar si PowerShell está disponible
powershell -Command "Get-Host" >nul 2>&1
if errorlevel 1 (
    echo ❌ ERROR: PowerShell no está disponible
    echo    Instala PowerShell o usa Windows 10/11
    pause
    exit /b 1
)

REM Ejecutar el script PowerShell con bypass de política
echo 📋 Ejecutando verificación...
echo.
powershell -ExecutionPolicy Bypass -File "%~dp0verificar-proyecto-fixed.ps1"

REM Pausa para ver los resultados
echo.
pause
