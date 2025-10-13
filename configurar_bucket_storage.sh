#!/bin/bash

# Script para configurar el bucket de Cloud Storage con acceso público

BUCKET_NAME="archivos_sistema_consultorio_moyobamba"

echo "🔧 Configurando bucket: $BUCKET_NAME"
echo ""

# 1. Verificar que el bucket existe
echo "1️⃣ Verificando existencia del bucket..."
if gsutil ls -b gs://$BUCKET_NAME > /dev/null 2>&1; then
    echo "   ✅ El bucket existe"
else
    echo "   ⚠️  El bucket no existe. Creándolo..."
    gsutil mb -l us-central1 gs://$BUCKET_NAME
    echo "   ✅ Bucket creado"
fi
echo ""

# 2. Dar permisos de lectura pública a todos los objetos
echo "2️⃣ Configurando permisos públicos..."
gsutil iam ch allUsers:objectViewer gs://$BUCKET_NAME
echo "   ✅ Permisos públicos configurados"
echo ""

# 3. Configurar CORS para acceso desde el frontend
echo "3️⃣ Configurando CORS..."

# Crear archivo temporal de configuración CORS
cat > /tmp/cors.json << 'EOF'
[
  {
    "origin": ["*"],
    "method": ["GET", "POST", "PUT", "DELETE", "HEAD"],
    "responseHeader": ["Content-Type", "Authorization"],
    "maxAgeSeconds": 3600
  }
]
EOF

gsutil cors set /tmp/cors.json gs://$BUCKET_NAME
echo "   ✅ CORS configurado"
echo ""

# 4. Configurar lifecycle (opcional - eliminar archivos después de 1 año)
echo "4️⃣ Configurando lifecycle (opcional)..."

cat > /tmp/lifecycle.json << 'EOF'
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
EOF

gsutil lifecycle set /tmp/lifecycle.json gs://$BUCKET_NAME
echo "   ✅ Lifecycle configurado (archivos se eliminarán después de 1 año)"
echo ""

# 5. Verificar configuración
echo "5️⃣ Verificando configuración..."
echo ""
echo "   📋 Información del bucket:"
gsutil ls -L -b gs://$BUCKET_NAME | grep -E "Location|Storage class|Public access"
echo ""
echo "   📋 CORS configurado:"
gsutil cors get gs://$BUCKET_NAME
echo ""

echo "✅ ¡Configuración completada!"
echo ""
echo "📝 Notas importantes:"
echo "   - Todos los archivos en este bucket son públicamente accesibles"
echo "   - Los archivos se eliminarán automáticamente después de 1 año"
echo "   - CORS está configurado para permitir acceso desde cualquier origen"
echo ""
echo "🔗 URL base de los archivos:"
echo "   https://storage.googleapis.com/$BUCKET_NAME/[ruta-del-archivo]"
echo ""

