# Regenera la web, guarda los cambios en git y la sube al servidor.
#
#   .\publicar.ps1                      (mensaje de commit por defecto)
#   .\publicar.ps1 "Nueva publicación"  (con tu mensaje)
#
# Pide dos veces la frase de tu clave SSH: una para copiar y otra para desplegar.

param([string]$Mensaje = "Actualización de la web")

$ErrorActionPreference = "Stop"
$Servidor = "root@178.104.121.47"
$Paquete = Join-Path $env:TEMP "portafolio.tgz"

Set-Location $PSScriptRoot

node construir.js
if ($LASTEXITCODE -ne 0) { throw "construir.js ha fallado: no se sube nada." }

git add -A
git diff --cached --quiet
if ($LASTEXITCODE -ne 0) { git commit -m $Mensaje }

tar -czf $Paquete --exclude=.git .
scp $Paquete "${Servidor}:/tmp/portafolio.tgz"
if ($LASTEXITCODE -ne 0) { throw "No se ha podido copiar al servidor." }

ssh $Servidor "tar -xzf /tmp/portafolio.tgz -C /opt/apps/portafolio && rm /tmp/portafolio.tgz && cd /opt/apps/portafolio && docker compose -f docker-compose.server.yml up -d --build"
if ($LASTEXITCODE -ne 0) { throw "El despliegue en el servidor ha fallado." }

Remove-Item $Paquete
Write-Host "Publicada: https://luiscontacto03.com" -ForegroundColor Green
