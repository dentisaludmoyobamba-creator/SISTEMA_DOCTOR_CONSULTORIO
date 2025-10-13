# Script PowerShell para configurar el bucket de Cloud Storage con acceso público

$BUCKET_NAME = "archivos_sistema_consultorio_moyobamba"

Write-Host "🔧 Configurando bucket: $BUCKET_NAME" -ForegroundColor Cyan
Write-Host ""

# 1. Verificar que el bucket existe
Write-Host "1️⃣ Verificando existencia del bucket..." -ForegroundColor Yellow
try {
    gsutil ls -b "gs://$BUCKET_NAME" 2>&1 | Out-Null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "   ✅ El bucket existe" -ForegroundColor Green
    } else {
        Write-Host "   ⚠️  El bucket no existe. Creándolo..." -ForegroundColor Yellow
        gsutil mb -l us-central1 "gs://$BUCKET_NAME"
        Write-Host "   ✅ Bucket creado" -ForegroundColor Green
    }
} catch {
    Write-Host "   ❌ Error al verificar bucket: $_" -ForegroundColor Red
}
Write-Host ""

# 2. Dar permisos de lectura pública a todos los objetos
Write-Host "2️⃣ Configurando permisos públicos..." -ForegroundColor Yellow
gsutil iam ch allUsers:objectViewer "gs://$BUCKET_NAME"
Write-Host "   ✅ Permisos públicos configurados" -ForegroundColor Green
Write-Host ""

# 3. Configurar CORS para acceso desde el frontend
Write-Host "3️⃣ Configurando CORS..." -ForegroundColor Yellow

# Crear archivo temporal de configuración CORS
$corsContent = @'
[
  {
    "origin": ["*"],
    "method": ["GET", "POST", "PUT", "DELETE", "HEAD"],
    "responseHeader": ["Content-Type", "Authorization"],
    "maxAgeSeconds": 3600
  }
]
'@

$corsFile = "$env:TEMP\cors_config.json"
$corsContent | Out-File -FilePath $corsFile -Encoding UTF8

gsutil cors set $corsFile "gs://$BUCKET_NAME"
Write-Host "   ✅ CORS configurado" -ForegroundColor Green
Remove-Item $corsFile
Write-Host ""

# 4. Configurar lifecycle (opcional - eliminar archivos después de 1 año)
Write-Host "4️⃣ Configurando lifecycle (opcional)..." -ForegroundColor Yellow

$lifecycleContent = @'
{
  "lifecycle": {
    "rule": [
      {
        "action": {"type": "Delete"},
        "condition": {
          "age": 365,
          "matchesPrefix": ["paciente_"]
        }
      }
    ]
  }
}
'@

$lifecycleFile = "$env:TEMP\lifecycle_config.json"
$lifecycleContent | Out-File -FilePath $lifecycleFile -Encoding UTF8

gsutil lifecycle set $lifecycleFile "gs://$BUCKET_NAME"
Write-Host "   ✅ Lifecycle configurado (archivos se eliminarán después de 1 año)" -ForegroundColor Green
Remove-Item $lifecycleFile
Write-Host ""

# 5. Verificar configuración
Write-Host "5️⃣ Verificando configuración..." -ForegroundColor Yellow
Write-Host ""
Write-Host "   📋 Información del bucket:" -ForegroundColor Cyan
gsutil ls -L -b "gs://$BUCKET_NAME"
Write-Host ""
Write-Host "   📋 CORS configurado:" -ForegroundColor Cyan
gsutil cors get "gs://$BUCKET_NAME"
Write-Host ""

Write-Host "✅ ¡Configuración completada!" -ForegroundColor Green
Write-Host ""
Write-Host "📝 Notas importantes:" -ForegroundColor Cyan
Write-Host "   - Todos los archivos en este bucket son públicamente accesibles"
Write-Host "   - Los archivos se eliminarán automáticamente después de 1 año"
Write-Host "   - CORS está configurado para permitir acceso desde cualquier origen"
Write-Host ""
Write-Host "🔗 URL base de los archivos:" -ForegroundColor Cyan
Write-Host "   https://storage.googleapis.com/$BUCKET_NAME/[ruta-del-archivo]"
Write-Host ""

