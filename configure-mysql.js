#!/usr/bin/env node

/**
 * DJ JOSEP - CONFIGURADOR MYSQL PRODUCCIÓN
 * Configura automáticamente MySQL para producción
 */

import fs from 'fs';
import path from 'path';
import mysql from 'mysql2/promise';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuración por defecto
const CONFIG = {
    host: process.env.MYSQL_HOST || '192.168.1.40',
    port: process.env.MYSQL_PORT || 3306,
    user: process.env.MYSQL_USER || 'admin',
    password: process.env.MYSQL_PASSWORD || 'admin123',
    database: process.env.MYSQL_DB || 'josepe_DB'
};

console.log('🗄️  DJ JOSEP - CONFIGURADOR MYSQL');
console.log('===================================');

// Función para actualizar .env.prod con configuración MySQL
function updateEnvProd(config) {
    const envPath = path.join(__dirname, 'backend', '.env.prod');
    
    if (!fs.existsSync(envPath)) {
        console.error('❌ Archivo .env.prod no encontrado');
        process.exit(1);
    }

    let envContent = fs.readFileSync(envPath, 'utf8');
    
    // Crear nueva configuración MySQL
    const mysqlConfig = `# ===== BASE DE DATOS =====
# MySQL configuración para producción
DATABASE_URL="mysql://${config.user}:${config.password}@${config.host}:${config.port}/${config.database}"
DB_HOST=${config.host}
DB_PORT=${config.port}
DB_USER=${config.user}
DB_PASSWORD=${config.password}
DB_NAME=${config.database}
DB_CONNECTION_LIMIT=10`;

    // Reemplazar sección de base de datos
    const pattern = /# ===== BASE DE DATOS =====[\s\S]*?DB_CONNECTION_LIMIT=\d+/;
    envContent = envContent.replace(pattern, mysqlConfig);
    
    // Guardar archivo
    fs.writeFileSync(envPath, envContent);
    console.log('✅ Configuración MySQL actualizada en .env.prod');
}

// Función para verificar conexión MySQL
async function testMySQLConnection(config) {
    console.log('🔄 Verificando conexión MySQL...');
    
    try {
        const connection = await mysql.createConnection({
            host: config.host,
            port: config.port,
            user: config.user,
            password: config.password,
            database: config.database
        });
        
        console.log('✅ Conexión MySQL exitosa');
        await connection.end();
        return true;
    } catch (error) {
        console.error('❌ Error de conexión MySQL:', error.message);
        return false;
    }
}

// Función para verificar/crear tablas
async function verifyTables(config) {
    console.log('🔄 Verificando estructura de base de datos...');
    
    try {
        const connection = await mysql.createConnection({
            host: config.host,
            port: config.port,
            user: config.user,
            password: config.password,
            database: config.database
        });
        
        // Verificar tablas principales
        const tables = ['Analytics', 'ContactMessages', 'DJAuth', 'Events', 'Sets'];
        const existingTables = [];
        
        for (const table of tables) {
            const [rows] = await connection.execute(
                'SELECT TABLE_NAME FROM information_schema.TABLES WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ?',
                [config.database, table]
            );
            
            if (rows.length > 0) {
                existingTables.push(table);
            }
        }
        
        console.log('📋 Tablas encontradas:', existingTables.join(', '));
        
        if (existingTables.length === tables.length) {
            console.log('✅ Todas las tablas están presentes');
        } else {
            console.log('⚠️  Algunas tablas faltan. Ejecutar script SQL de creación.');
        }
        
        await connection.end();
        return existingTables.length === tables.length;
    } catch (error) {
        console.error('❌ Error verificando tablas:', error.message);
        return false;
    }
}

// Función principal
async function main() {
    // Leer argumentos de línea de comandos
    const args = process.argv.slice(2);
    const customConfig = { ...CONFIG };
    
    // Procesar argumentos
    args.forEach((arg, index) => {
        const [key, value] = arg.split('=');
        switch (key) {
            case '--host':
                customConfig.host = value;
                break;
            case '--port':
                customConfig.port = parseInt(value);
                break;
            case '--user':
                customConfig.user = value;
                break;
            case '--password':
                customConfig.password = value;
                break;
            case '--database':
                customConfig.database = value;
                break;
        }
    });
    
    console.log('📋 Configuración MySQL:');
    console.log(`   Host: ${customConfig.host}`);
    console.log(`   Puerto: ${customConfig.port}`);
    console.log(`   Usuario: ${customConfig.user}`);
    console.log(`   Base de datos: ${customConfig.database}`);
    console.log('');
    
    // Actualizar archivo .env.prod
    updateEnvProd(customConfig);
    
    // Verificar conexión
    const connected = await testMySQLConnection(customConfig);
    if (!connected) {
        console.log('');
        console.log('🔧 SOLUCIONES POSIBLES:');
        console.log('   • Verificar que MySQL esté ejecutándose');
        console.log('   • Verificar credenciales de acceso');
        console.log('   • Verificar conectividad de red');
        console.log('   • Verificar que la base de datos existe');
        process.exit(1);
    }
    
    // Verificar estructura de tablas
    const tablesOk = await verifyTables(customConfig);
    
    console.log('');
    console.log('🎉 CONFIGURACIÓN MYSQL COMPLETADA');
    console.log('================================');
    console.log('✅ Archivo .env.prod actualizado');
    console.log('✅ Conexión MySQL verificada');
    
    if (tablesOk) {
        console.log('✅ Estructura de base de datos correcta');
    } else {
        console.log('⚠️  Verificar estructura de base de datos');
    }
    
    console.log('');
    console.log('🚀 Listo para ejecutar en producción!');
}

// Ejecutar si es llamado directamente
if (import.meta.url === `file://${process.argv[1]}`) {
    main().catch(error => {
        console.error('❌ Error:', error.message);
        process.exit(1);
    });
}

export { updateEnvProd, testMySQLConnection, verifyTables };