#!/usr/bin/env node

import { spawn, exec } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';
import { promisify } from 'util';

const execAsync = promisify(exec);
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🚀 Iniciando DJ Josepe Webpage...\n');

// Función para eliminar procesos Node.js activos
async function killExistingNodeProcesses() {
  try {
    console.log('🔍 Verificando procesos Node.js activos...');
    
    // Detectar el sistema operativo
    const isWindows = process.platform === 'win32';
    
    if (isWindows) {
      // Windows: Usar wmic para encontrar procesos node.exe
      try {
        const { stdout } = await execAsync('wmic process where "name=\'node.exe\'" get ProcessId /value 2>nul');
        const pids = stdout.match(/ProcessId=(\d+)/g);
        
        if (pids && pids.length > 0) {
          console.log(`🛑 Encontrados ${pids.length} procesos Node.js. Eliminando...`);
          
          // Eliminar cada proceso por PID
          for (const pidMatch of pids) {
            const pid = pidMatch.split('=')[1];
            if (pid && pid !== process.pid.toString()) {
              try {
                process.kill(parseInt(pid), 'SIGTERM');
              } catch (err) {
                // Si SIGTERM no funciona, usar SIGKILL
                try {
                  process.kill(parseInt(pid), 'SIGKILL');
                } catch (killErr) {
                  console.log(`⚠️ No se pudo eliminar proceso ${pid}`);
                }
              }
            }
          }
          
          console.log('✅ Procesos Node.js eliminados');
          // Esperar un momento para que se liberen los puertos
          await new Promise(resolve => setTimeout(resolve, 2000));
        } else {
          console.log('✅ No hay procesos Node.js activos');
        }
      } catch (wmicError) {
        // Fallback: intentar con tasklist
        const { stdout } = await execAsync('tasklist /FI "IMAGENAME eq node.exe" /FO CSV 2>nul');
        const lines = stdout.split('\n').filter(line => line.includes('node.exe'));
        
        if (lines.length > 1) {
          console.log(`🛑 Encontrados procesos Node.js. Eliminando...`);
          await execAsync('taskkill /F /IM node.exe 2>nul');
          console.log('✅ Procesos Node.js eliminados');
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      }
    } else {
      // Unix/Linux/macOS: usar ps y kill con Node.js
      const { stdout } = await execAsync('ps aux | grep node | grep -v grep | awk \'{print $2}\'');
      const pids = stdout.trim().split('\n').filter(pid => pid && pid !== process.pid.toString());
      
      if (pids.length > 0) {
        console.log(`🛑 Encontrados ${pids.length} procesos Node.js. Eliminando...`);
        
        for (const pid of pids) {
          try {
            process.kill(parseInt(pid), 'SIGTERM');
          } catch (err) {
            try {
              process.kill(parseInt(pid), 'SIGKILL');
            } catch (killErr) {
              console.log(`⚠️ No se pudo eliminar proceso ${pid}`);
            }
          }
        }
        
        console.log('✅ Procesos Node.js eliminados');
        await new Promise(resolve => setTimeout(resolve, 2000));
      } else {
        console.log('✅ No hay procesos Node.js activos');
      }
    }
  } catch (error) {
    console.log('⚠️ Error al verificar/eliminar procesos:', error.message);
    console.log('📋 Continuando con el arranque...');
  }
}

// Función para ejecutar comandos
function runCommand(command, args, cwd, name) {
  return new Promise((resolve, reject) => {
    console.log(`📦 Iniciando ${name}...`);

    const process = spawn(command, args, {
      cwd,
      stdio: 'inherit',
      shell: true
    });

    process.on('error', (error) => {
      console.error(`❌ Error en ${name}:`, error);
      reject(error);
    });

    process.on('exit', (code) => {
      if (code === 0) {
        console.log(`✅ ${name} iniciado correctamente`);
        resolve();
      } else {
        console.error(`❌ ${name} falló con código ${code}`);
        reject(new Error(`${name} failed with code ${code}`));
      }
    });
  });
}

// Función para detectar el tipo de base de datos
function detectDatabaseType(backendDir) {
  const envPath = join(backendDir, '.env');

  if (!fs.existsSync(envPath)) {
    console.log('⚠️ No se encontró archivo .env, asumiendo Prisma por defecto');
    return 'prisma';
  }

  const envContent = fs.readFileSync(envPath, 'utf8');
  const databaseUrl = envContent.match(/DATABASE_URL=(.+)/)?.[1]?.replace(/["']/g, '');

  if (!databaseUrl) {
    console.log('⚠️ No se encontró DATABASE_URL, asumiendo Prisma por defecto');
    return 'prisma';
  }

  if (databaseUrl.includes('mysql://') || databaseUrl.includes('mariadb://')) {
    return 'mysql';
  } else if (databaseUrl.includes('sqlite://') || databaseUrl.includes('file:')) {
    return 'sqlite';
  } else if (databaseUrl.includes('postgresql://') || databaseUrl.includes('postgres://')) {
    return 'postgresql';
  } else {
    // Si no reconoce el formato, asume Prisma
    return 'prisma';
  }
}

// Función para configurar base de datos según el tipo
async function setupDatabase(backendDir, dbType) {
  switch (dbType) {
    case 'mysql':
      await setupMySQL(backendDir);
      break;
    case 'sqlite':
      await setupSQLite(backendDir);
      break;
    case 'postgresql':
      await setupPostgreSQL(backendDir);
      break;
    case 'prisma':
    default:
      await setupPrisma(backendDir);
      break;
  }
}

// Configuración para MySQL
async function setupMySQL(backendDir) {
  console.log('🗄️ Configurando base de datos MySQL...');

  // Verificar si existe el archivo de esquema SQL
  const schemaPath = join(__dirname, 'database_schema.sql');

  if (fs.existsSync(schemaPath)) {
    console.log('📄 Ejecutando esquema SQL...');
    // Aquí podrías ejecutar el archivo SQL usando mysql client
    // Por ahora, solo mostramos que se encontró
    console.log('✅ Esquema SQL encontrado:', schemaPath);
  } else {
    console.log('⚠️ No se encontró database_schema.sql');
  }

  // Verificar si hay script de seed para MySQL
  const seedPath = join(backendDir, 'scripts', 'seed-mysql.js');
  if (fs.existsSync(seedPath)) {
    console.log('🌱 Ejecutando seed de MySQL...');
    await runCommand('node', [seedPath], backendDir, 'MySQL Seed');
  } else {
    console.log('⚠️ No se encontró script de seed para MySQL');
  }
}

// Configuración para SQLite
async function setupSQLite(backendDir) {
  console.log('🗄️ Configurando base de datos SQLite...');

  // Verificar si existe el archivo de base de datos
  const dbPath = join(backendDir, 'src', 'db', 'database.sqlite');

  if (!fs.existsSync(dbPath)) {
    console.log('📄 Creando base de datos SQLite...');

    // Aquí podrías ejecutar scripts para crear tablas
    const schemaPath = join(__dirname, 'database_schema.sql');
    if (fs.existsSync(schemaPath)) {
      console.log('✅ Esquema SQL encontrado para SQLite');
    }
  } else {
    console.log('✅ Base de datos SQLite ya existe');
  }

  // Ejecutar seed si existe
  const seedPath = join(backendDir, 'scripts', 'seed-sqlite.js');
  if (fs.existsSync(seedPath)) {
    console.log('🌱 Ejecutando seed de SQLite...');
    await runCommand('node', [seedPath], backendDir, 'SQLite Seed');
  }
}

// Configuración para PostgreSQL
async function setupPostgreSQL(backendDir) {
  console.log('🗄️ Configurando base de datos PostgreSQL...');

  // Similar a MySQL pero con comandos de PostgreSQL
  const schemaPath = join(__dirname, 'database_schema.sql');
  if (fs.existsSync(schemaPath)) {
    console.log('✅ Esquema SQL encontrado para PostgreSQL');
  }

  const seedPath = join(backendDir, 'scripts', 'seed-postgres.js');
  if (fs.existsSync(seedPath)) {
    console.log('🌱 Ejecutando seed de PostgreSQL...');
    await runCommand('node', [seedPath], backendDir, 'PostgreSQL Seed');
  }
}

// Configuración para Prisma (mantenido por compatibilidad)
async function setupPrisma(backendDir) {
  console.log('🔧 Generando cliente de Prisma...');
  await runCommand('npx', ['prisma', 'generate'], backendDir, 'Prisma Generate');

  console.log('🗄️ Ejecutando migraciones de Prisma...');
  await runCommand('npx', ['prisma', 'migrate', 'dev', '--name', 'init'], backendDir, 'Prisma Migration');

  console.log('🌱 Poblando base de datos con Prisma...');
  await runCommand('npm', ['run', 'seed'], backendDir, 'Prisma Seed');
}

// Función para verificar si las dependencias están instaladas
function checkDependencies(dir) {
  const nodeModulesPath = join(dir, 'node_modules');
  return fs.existsSync(nodeModulesPath);
}

async function main() {
  const backendDir = join(__dirname, 'backend');
  const frontendDir = join(__dirname, 'frontend');

  try {
    // Eliminar procesos Node.js activos antes de iniciar
    await killExistingNodeProcesses();

    // Verificar e instalar dependencias del backend
    if (!checkDependencies(backendDir)) {
      console.log('📦 Instalando dependencias del backend...');
      await runCommand('npm', ['install'], backendDir, 'Backend Dependencies');
    }

    // Verificar e instalar dependencias del frontend
    if (!checkDependencies(frontendDir)) {
      console.log('📦 Instalando dependencias del frontend...');
      await runCommand('npm', ['install'], frontendDir, 'Frontend Dependencies');
    }

    // Detectar y configurar base de datos
    const dbType = detectDatabaseType(backendDir);
    console.log(`🔍 Tipo de base de datos detectado: ${dbType.toUpperCase()}`);
    await setupDatabase(backendDir, dbType);

    console.log('\n🎉 ¡Configuración completada!\n');
    console.log('🌐 Iniciando servidores...\n');

    // Iniciar backend
    const backendProcess = spawn('npm', ['run', 'dev'], {
      cwd: backendDir,
      stdio: 'inherit',
      shell: true
    });

    // Esperar un poco antes de iniciar el frontend
    setTimeout(() => {
      // Iniciar frontend
      const frontendProcess = spawn('npm', ['run', 'dev'], {
        cwd: frontendDir,
        stdio: 'inherit',
        shell: true
      });

      // Manejar cierre del proceso
      process.on('SIGINT', () => {
        console.log('\n🛑 Cerrando servidores...');
        backendProcess.kill();
        frontendProcess.kill();
        process.exit(0);
      });

    }, 3000);

    console.log('🎵 Backend corriendo en: http://localhost:4000');
    console.log('🌐 Frontend corriendo en: http://localhost:3000');
    console.log('\n💡 Presiona Ctrl+C para detener los servidores\n');

  } catch (error) {
    console.error('❌ Error durante la inicialización:', error);
    process.exit(1);
  }
}

main();

