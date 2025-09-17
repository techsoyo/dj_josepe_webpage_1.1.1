#!/usr/bin/env node

import { copyFile, access } from 'fs/promises';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const environments = {
  dev: 'development',
  prod: 'production'
};

async function copyEnvFile(source, destination) {
  try {
    await access(source);
    await copyFile(source, destination);
    console.log(`✅ Copiado: ${source} → ${destination}`);
  } catch (error) {
    console.error(`❌ Error copiando ${source}:`, error.message);
  }
}

async function setEnvironment(env) {
  if (!environments[env]) {
    console.error('❌ Entorno no válido. Usa: dev o prod');
    console.log('💡 Uso: node set-env.js [dev|prod]');
    process.exit(1);
  }

  console.log(`🔄 Configurando entorno: ${environments[env].toUpperCase()}\n`);

  const backendDir = join(__dirname, 'backend');
  const frontendDir = join(__dirname, 'frontend');

  // Backend
  console.log('📁 Backend:');
  await copyEnvFile(
    join(backendDir, `.env.${env}`),
    join(backendDir, '.env')
  );

  // Frontend
  console.log('📁 Frontend:');
  await copyEnvFile(
    join(frontendDir, `.env.${env}`),
    join(frontendDir, '.env.local')
  );

  console.log(`\n🎉 Entorno ${environments[env].toUpperCase()} configurado correctamente!`);
  
  if (env === 'dev') {
    console.log('💡 Para desarrollo: node start.js');
  } else {
    console.log('💡 Para producción: node start.js');
  }
}

const env = process.argv[2];
if (!env) {
  console.log('🔧 Gestión de Entornos DJ Josepe');
  console.log('📋 Uso: node set-env.js [dev|prod]');
  console.log('');
  console.log('🛠️  dev  - Configura entorno de desarrollo');
  console.log('🚀  prod - Configura entorno de producción');
  process.exit(0);
}

setEnvironment(env);