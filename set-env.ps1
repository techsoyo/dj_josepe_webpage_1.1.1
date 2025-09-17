# ===========================================
# DJ JOSEP - GESTIÓN DE ENTORNOS
# ===========================================
# Script para cambiar entre entornos de desarrollo y producción

param(
    [Parameter(Mandatory=$false)]
    [ValidateSet("dev", "prod", "help")]
    [string]$Environment = "help"
)

function Show-Help {
    Write-Host "🔧 Gestión de Entornos DJ Josepe" -ForegroundColor Cyan
    Write-Host "📋 Uso: .\set-env.ps1 [dev|prod]" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "🛠️  dev  - Configura entorno de desarrollo" -ForegroundColor Green
    Write-Host "🚀  prod - Configura entorno de producción" -ForegroundColor Blue
    Write-Host ""
    Write-Host "Ejemplos:" -ForegroundColor Yellow
    Write-Host "  .\set-env.ps1 dev   # Para desarrollo"
    Write-Host "  .\set-env.ps1 prod  # Para el DJ"
}

function Copy-EnvFile {
    param($Source, $Destination)
    
    if (Test-Path $Source) {
        Copy-Item $Source $Destination -Force
        Write-Host "✅ Copiado: $Source → $Destination" -ForegroundColor Green
    } else {
        Write-Host "❌ No se encontró: $Source" -ForegroundColor Red
    }
}

function Set-Environment {
    param($Env)
    
    $envName = if ($Env -eq "dev") { "DESARROLLO" } else { "PRODUCCIÓN" }
    Write-Host "🔄 Configurando entorno: $envName" -ForegroundColor Cyan
    Write-Host ""
    
    # Backend
    Write-Host "📁 Backend:" -ForegroundColor Yellow
    Copy-EnvFile "backend\.env.$Env" "backend\.env"
    
    # Frontend  
    Write-Host "📁 Frontend:" -ForegroundColor Yellow
    Copy-EnvFile "frontend\.env.$Env" "frontend\.env.local"
    
    Write-Host ""
    Write-Host "🎉 Entorno $envName configurado correctamente!" -ForegroundColor Green
    
    if ($Env -eq "dev") {
        Write-Host "💡 Para desarrollo: node start.js" -ForegroundColor Cyan
    } else {
        Write-Host "💡 Para el DJ: node start.js" -ForegroundColor Cyan
    }
}

# Ejecutar función principal
switch ($Environment) {
    "help" { Show-Help }
    "dev" { Set-Environment "dev" }
    "prod" { Set-Environment "prod" }
    default { Show-Help }
}