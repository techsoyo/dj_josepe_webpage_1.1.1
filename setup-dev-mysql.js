#!/usr/bin/env node

/**
 * DJ JOSEP - CONFIGURADOR DESARROLLO CON MYSQL
 * Script simplificado para usar MySQL en desarrollo
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🗄️  DJ JOSEP - CONFIGURANDO MYSQL DESARROLLO');
console.log('============================================');

// Configuración MySQL para desarrollo
const mysqlConfig = {
    host: '192.168.1.40',
    port: 3306,
    user: 'admin',
    password: 'admin123',
    database: 'josepe_DB'
};

// Actualizar .env.dev para usar MySQL
function updateDevEnv() {
    const envPath = path.join(__dirname, 'backend', '.env.dev');
    
    if (!fs.existsSync(envPath)) {
        console.error('❌ Archivo .env.dev no encontrado');
        process.exit(1);
    }

    let envContent = fs.readFileSync(envPath, 'utf8');
    
    // Crear nueva configuración MySQL
    const newMysqlConfig = `# ===== BASE DE DATOS =====
# MySQL para desarrollo (consistencia con producción)
DATABASE_URL="mysql://${mysqlConfig.user}:${mysqlConfig.password}@${mysqlConfig.host}:${mysqlConfig.port}/${mysqlConfig.database}"
DB_HOST=${mysqlConfig.host}
DB_PORT=${mysqlConfig.port}
DB_USER=${mysqlConfig.user}
DB_PASSWORD=${mysqlConfig.password}
DB_NAME=${mysqlConfig.database}
DB_CONNECTION_LIMIT=10
# SQLite alternativa (comentada)
# DATABASE_URL="file:./src/db/database.sqlite"`;

    // Reemplazar sección de base de datos
    const pattern = /# ===== BASE DE DATOS =====[\s\S]*?# DATABASE_URL="file:\.\/src\/db\/database\.sqlite"/;
    envContent = envContent.replace(pattern, newMysqlConfig);
    
    // Guardar archivo
    fs.writeFileSync(envPath, envContent);
    console.log('✅ Configuración MySQL actualizada en .env.dev');
}

// Crear script de inicio para desarrollo con MySQL
function createDevStartScript() {
    const startScript = `@echo off
title DJ JOSEP - DESARROLLO (MySQL)
color 0B

echo.
echo  ████████▄     ▄█                ▄█  ▄██████▄     ▄████████    ▄████████    ▄███████▄ 
echo  ███   ▀███   ███               ███ ███    ███   ███    ███   ███    ███   ███    ███ 
echo  ███    ███   ███               ███ ███    ███   ███    █▀    ███    █▀    ███    ███ 
echo  ███    ███   ███               ███ ███    ███   ███         ▄███▄▄▄       ███    ███ 
echo  ███    ███   ███               ███ ███    ███ ▀███████████ ▀▀███▀▀▀     ▀█████████▀  
echo  ███    ███   ███               ███ ███    ███          ███   ███    █▄    ███        
echo  ███   ▄███   ███▌    ▄         ███ ███    ███    ▄█    ███   ███    ███   ███        
echo  ████████▀    █████▄▄██         █▀   ▀██████▀   ▄████████▀    ██████████  ▄████▀      
echo               ▀                                                                        
echo.
echo  🚀 MODO DESARROLLO - MySQL Database (${mysqlConfig.host})
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
echo    • MySQL: ${mysqlConfig.host}:${mysqlConfig.port}
echo.
cd frontend && pnpm run dev

echo.
echo 🔄 Limpiando procesos al cerrar...
taskkill /f /im node.exe >nul 2>nul
pause`;

    fs.writeFileSync('start-dev-mysql.bat', startScript);
    console.log('✅ Script de inicio creado: start-dev-mysql.bat');
}

// Función principal
function main() {
    console.log('📋 Configuración MySQL desarrollo:');
    console.log(`   Host: ${mysqlConfig.host}`);
    console.log(`   Puerto: ${mysqlConfig.port}`);
    console.log(`   Usuario: ${mysqlConfig.user}`);
    console.log(`   Base de datos: ${mysqlConfig.database}`);
    console.log('');
    
    // Actualizar configuración
    updateDevEnv();
    
    // Crear script de inicio
    createDevStartScript();
    
    console.log('');
    console.log('🎉 CONFIGURACIÓN DESARROLLO MYSQL COMPLETADA');
    console.log('===========================================');
    console.log('✅ .env.dev configurado para MySQL');
    console.log('✅ Script de inicio creado');
    console.log('');
    console.log('🚀 PARA INICIAR DESARROLLO:');
    console.log('• Ejecutar: .\\start-dev-mysql.bat');
    console.log('');
    console.log('⚠️  ASEGURATE DE QUE MYSQL ESTÉ ACCESIBLE EN:');
    console.log(`   ${mysqlConfig.host}:${mysqlConfig.port}`);
}

main();