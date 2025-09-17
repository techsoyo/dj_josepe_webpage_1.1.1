# ===========================================
# DJ JOSEP - SCRIPT COMPLETO DE PRODUCCIÓN
# ===========================================
# ✅ Script unificado para deployment completo en producción

param(
    [string]$MySQLHost = "192.168.1.40",
    [string]$MySQLUser = "admin", 
    [string]$MySQLPassword = "admin123",
    [string]$MySQLDatabase = "josepe_DB",
    [string]$MySQLPort = "3306",
    [switch]$SkipDatabase,
    [switch]$ForceReinstall
)

Write-Host "🚀 DJ JOSEP - DEPLOYMENT PRODUCCIÓN" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan

# Función para manejar errores
function Handle-Error {
    param([string]$Message)
    Write-Host "❌ ERROR: $Message" -ForegroundColor Red
    exit 1
}

# Función para ejecutar comandos con manejo de errores
function Execute-Command {
    param([string]$Command, [string]$Description)
    Write-Host "🔄 $Description..." -ForegroundColor Yellow
    try {
        Invoke-Expression $Command
        if ($LASTEXITCODE -ne 0) {
            Handle-Error "$Description falló"
        }
        Write-Host "✅ $Description completado" -ForegroundColor Green
    }
    catch {
        Handle-Error "$Description falló: $($_.Exception.Message)"
    }
}

# 1. VERIFICACIÓN DE PRERREQUISITOS
Write-Host "`n📋 VERIFICANDO PRERREQUISITOS..." -ForegroundColor Magenta

# Verificar Node.js
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js detectado: $nodeVersion" -ForegroundColor Green
}
catch {
    Handle-Error "Node.js no está instalado"
}

# Verificar pnpm
try {
    $pnpmVersion = pnpm --version
    Write-Host "✅ pnpm detectado: $pnpmVersion" -ForegroundColor Green
}
catch {
    Handle-Error "pnpm no está instalado"
}

# Verificar git
try {
    $gitVersion = git --version
    Write-Host "✅ Git detectado: $gitVersion" -ForegroundColor Green
}
catch {
    Handle-Error "Git no está instalado"
}

# 2. LIMPIEZA DE PROCESOS ACTIVOS
Write-Host "`n🧹 LIMPIANDO PROCESOS ACTIVOS..." -ForegroundColor Magenta

$nodeProcesses = Get-Process node -ErrorAction SilentlyContinue
if ($nodeProcesses) {
    Write-Host "🔄 Eliminando $($nodeProcesses.Count) procesos Node.js activos..." -ForegroundColor Yellow
    $nodeProcesses | Stop-Process -Force
    Start-Sleep -Seconds 2
    Write-Host "✅ Procesos Node.js eliminados" -ForegroundColor Green
} else {
    Write-Host "✅ No hay procesos Node.js activos" -ForegroundColor Green
}

# 3. CONFIGURACIÓN DE ENTORNO PRODUCCIÓN
Write-Host "`n⚙️ CONFIGURANDO ENTORNO DE PRODUCCIÓN..." -ForegroundColor Magenta

# Configurar backend para producción
Execute-Command "node set-env.js prod" "Configuración backend a producción"

# Configurar frontend para producción
Execute-Command "cd frontend && node ../set-env.js prod" "Configuración frontend a producción"

# 4. CONFIGURACIÓN DE BASE DE DATOS MYSQL
if (-not $SkipDatabase) {
    Write-Host "`n🗄️ CONFIGURANDO BASE DE DATOS MYSQL..." -ForegroundColor Magenta
    
    # Actualizar configuración de MySQL en .env.prod
    $mysqlConfig = @"
# ===== BASE DE DATOS =====
# MySQL configuración para producción
DATABASE_URL="mysql://$MySQLUser`:$MySQLPassword@$MySQLHost`:$MySQLPort/$MySQLDatabase"
DB_HOST=$MySQLHost
DB_PORT=$MySQLPort
DB_USER=$MySQLUser
DB_PASSWORD=$MySQLPassword
DB_NAME=$MySQLDatabase
DB_CONNECTION_LIMIT=10
"@

    # Leer archivo .env.prod actual
    $envContent = Get-Content "backend\.env.prod" -Raw
    
    # Reemplazar sección de base de datos
    $pattern = "# ===== BASE DE DATOS =====.*?DB_CONNECTION_LIMIT=\d+"
    $envContent = $envContent -replace $pattern, $mysqlConfig, "Singleline"
    
    # Guardar archivo actualizado
    Set-Content "backend\.env.prod" -Value $envContent -Encoding UTF8
    Write-Host "✅ Configuración MySQL actualizada" -ForegroundColor Green
    
    # Verificar conexión MySQL
    Write-Host "🔄 Verificando conexión MySQL..." -ForegroundColor Yellow
    $testConnection = @"
const mysql = require('mysql2/promise');
async function testConnection() {
    try {
        const connection = await mysql.createConnection({
            host: '$MySQLHost',
            port: $MySQLPort,
            user: '$MySQLUser',
            password: '$MySQLPassword',
            database: '$MySQLDatabase'
        });
        console.log('✅ Conexión MySQL exitosa');
        await connection.end();
        process.exit(0);
    } catch (error) {
        console.error('❌ Error MySQL:', error.message);
        process.exit(1);
    }
}
testConnection();
"@
    
    Set-Content "temp-mysql-test.js" -Value $testConnection
    try {
        node "temp-mysql-test.js"
        Remove-Item "temp-mysql-test.js" -Force
        Write-Host "✅ Conexión MySQL verificada" -ForegroundColor Green
    }
    catch {
        Remove-Item "temp-mysql-test.js" -Force -ErrorAction SilentlyContinue
        Handle-Error "No se pudo conectar a MySQL. Verificar credenciales y servidor."
    }
}

# 5. INSTALACIÓN DE DEPENDENCIAS
Write-Host "`n📦 INSTALANDO DEPENDENCIAS..." -ForegroundColor Magenta

if ($ForceReinstall) {
    Write-Host "🔄 Limpiando node_modules existentes..." -ForegroundColor Yellow
    Remove-Item "node_modules" -Recurse -Force -ErrorAction SilentlyContinue
    Remove-Item "backend\node_modules" -Recurse -Force -ErrorAction SilentlyContinue
    Remove-Item "frontend\node_modules" -Recurse -Force -ErrorAction SilentlyContinue
    Remove-Item "pnpm-lock.yaml" -Force -ErrorAction SilentlyContinue
    Remove-Item "backend\package-lock.json" -Force -ErrorAction SilentlyContinue
    Remove-Item "frontend\pnpm-lock.yaml" -Force -ErrorAction SilentlyContinue
}

# Instalar dependencias root
Execute-Command "pnpm install" "Instalación dependencias raíz"

# Instalar dependencias backend
Execute-Command "cd backend && pnpm install" "Instalación dependencias backend"

# Instalar dependencias frontend
Execute-Command "cd frontend && pnpm install" "Instalación dependencias frontend"

# 6. BUILD DE PRODUCCIÓN
Write-Host "`n🏗️ CONSTRUYENDO APLICACIÓN PARA PRODUCCIÓN..." -ForegroundColor Magenta

# Build del frontend
Execute-Command "cd frontend && pnpm run build" "Build frontend para producción"

# 7. VERIFICACIÓN FINAL
Write-Host "`n🔍 VERIFICACIÓN FINAL..." -ForegroundColor Magenta

# Verificar archivos de build
if (Test-Path "frontend\.next") {
    Write-Host "✅ Build frontend generado correctamente" -ForegroundColor Green
} else {
    Handle-Error "Build frontend no se generó correctamente"
}

# Verificar configuración de entornos
if ((Test-Path "backend\.env.prod") -and (Test-Path "frontend\.env.prod")) {
    Write-Host "✅ Archivos de configuración presentes" -ForegroundColor Green
} else {
    Handle-Error "Archivos de configuración faltantes"
}

# 8. SCRIPT DE INICIO PRODUCCIÓN
Write-Host "`n🎯 CREANDO SCRIPT DE INICIO PRODUCCIÓN..." -ForegroundColor Magenta

$startScript = @"
@echo off
echo 🚀 DJ JOSEP - INICIANDO PRODUCCION
echo ==================================

echo 🔄 Configurando entorno de produccion...
node set-env.js prod
cd frontend && node ../set-env.js prod && cd ..

echo 🔄 Iniciando backend...
start /B cmd /c "cd backend && pnpm start"

echo ⏳ Esperando backend (5 segundos)...
timeout /t 5 /nobreak > nul

echo 🔄 Iniciando frontend...
cd frontend && pnpm start

pause
"@

Set-Content "start-production.bat" -Value $startScript -Encoding UTF8
Write-Host "✅ Script de inicio creado: start-production.bat" -ForegroundColor Green

# 9. RESUMEN FINAL
Write-Host "`n🎉 DEPLOYMENT COMPLETADO EXITOSAMENTE!" -ForegroundColor Green
Write-Host "======================================" -ForegroundColor Green
Write-Host ""
Write-Host "📋 CONFIGURACIÓN FINAL:" -ForegroundColor Cyan
Write-Host "• Entorno: PRODUCCIÓN" -ForegroundColor White
Write-Host "• Base de datos: MySQL ($MySQLHost:$MySQLPort)" -ForegroundColor White
Write-Host "• Frontend: Construido y optimizado" -ForegroundColor White
Write-Host "• Backend: Configurado para producción" -ForegroundColor White
Write-Host ""
Write-Host "🚀 PARA INICIAR EN PRODUCCIÓN:" -ForegroundColor Cyan
Write-Host "• Ejecutar: .\start-production.bat" -ForegroundColor Yellow
Write-Host "• O manualmente:" -ForegroundColor Yellow
Write-Host "  - Backend: cd backend && pnpm start" -ForegroundColor Gray
Write-Host "  - Frontend: cd frontend && pnpm start" -ForegroundColor Gray
Write-Host ""
Write-Host "📡 ACCESO ADMIN:" -ForegroundColor Cyan
Write-Host "• URL secreta: /dj-josepe-aqui-mando-yo" -ForegroundColor Yellow
Write-Host "• Ingresar contraseña en el campo único" -ForegroundColor Yellow
Write-Host ""
Write-Host "🔧 PARA VOLVER A DESARROLLO:" -ForegroundColor Cyan
Write-Host "• Ejecutar: node set-env.js dev" -ForegroundColor Yellow