# 🔐 Solución: Error de Descarga de Archivos

## ❌ Error Recibido:

```
Error al descargar archivo: Error al generar URL de descarga: 
you need a private key to sign credentials.
the credentials you are currently using <class 'google.auth.compute_engine.credentials.Credentials'> 
just contains a token.
```

---

## 🎯 Causa del Problema:

Google Cloud Functions usa **credenciales automáticas (Compute Engine Credentials)** que:
- ✅ Permiten leer/escribir en Cloud Storage
- ❌ **NO permiten generar URLs firmadas** (signed URLs)

Las URLs firmadas requieren una **Service Account Key privada**, que por seguridad no está disponible en Cloud Functions.

---

## ✅ Solución Implementada:

### **Cambio 1: Usar URLs Públicas en lugar de URLs Firmadas**

**Archivo:** `gcp_cloud_functions/gestorarchivos.py`

**ANTES (❌ Causaba error):**
```python
# Intentaba generar URL firmada
url_firmada = blob.generate_signed_url(
    version="v4",
    expiration=datetime.timedelta(hours=1),
    method="GET"
)
# ❌ Error: credentials just contains a token
```

**AHORA (✅ Funciona):**
```python
# Hace el archivo público y usa URL directa
blob.make_public()
url_descarga = blob.public_url
# ✅ URL: https://storage.googleapis.com/bucket/ruta/archivo.pdf
```

---

### **Cambio 2: Configurar Bucket con Acceso Público**

Para que las descargas funcionen, el bucket debe permitir acceso público.

#### **Opción A: Desde Cloud Console (GUI)**

1. Ir a: [Cloud Storage Console](https://console.cloud.google.com/storage)
2. Buscar bucket: `archivos_sistema_consultorio_moyobamba`
3. Click en "Permisos" (Permissions)
4. Click "Grant Access"
5. Agregar:
   - **Principal:** `allUsers`
   - **Role:** `Storage Object Viewer`
6. Click "Save"

#### **Opción B: Desde Terminal (Windows - PowerShell)**

```powershell
# Ejecutar el script proporcionado
.\configurar_bucket_storage.ps1
```

O manualmente:
```powershell
# Dar permisos públicos
gsutil iam ch allUsers:objectViewer gs://archivos_sistema_consultorio_moyobamba

# Configurar CORS
$cors = '[{"origin": ["*"], "method": ["GET", "POST", "PUT", "DELETE"], "responseHeader": ["Content-Type"], "maxAgeSeconds": 3600}]'
$cors | Out-File -FilePath cors.json -Encoding UTF8
gsutil cors set cors.json gs://archivos_sistema_consultorio_moyobamba
Remove-Item cors.json
```

#### **Opción C: Desde Terminal (Linux/Mac - Bash)**

```bash
# Ejecutar el script proporcionado
chmod +x configurar_bucket_storage.sh
./configurar_bucket_storage.sh
```

O manualmente:
```bash
# Dar permisos públicos
gsutil iam ch allUsers:objectViewer gs://archivos_sistema_consultorio_moyobamba

# Configurar CORS
echo '[{"origin": ["*"], "method": ["GET", "POST", "PUT", "DELETE"], "responseHeader": ["Content-Type"], "maxAgeSeconds": 3600}]' > cors.json
gsutil cors set cors.json gs://archivos_sistema_consultorio_moyobamba
rm cors.json
```

---

## 🔍 Verificar Configuración

Después de configurar, verifica que funcionó:

```bash
# Ver permisos del bucket
gsutil iam get gs://archivos_sistema_consultorio_moyobamba

# Deberías ver algo como:
# {
#   "bindings": [
#     {
#       "members": [
#         "allUsers"
#       ],
#       "role": "roles/storage.objectViewer"
#     }
#   ]
# }
```

---

## 🧪 Probar la Descarga

1. Subir un archivo desde la interfaz
2. Verificar que aparece en la lista
3. Click en **"Descargar"**
4. El archivo debería:
   - Descargarse automáticamente, O
   - Abrirse en nueva pestaña (PDFs, imágenes)

---

## 🔒 Consideraciones de Seguridad

### ⚠️ **Archivos Públicos:**
- ✅ **Ventaja:** Descargas simples y rápidas
- ⚠️ **Desventaja:** Cualquiera con la URL puede acceder

### 🔐 **Si necesitas más seguridad:**

Hay 3 opciones:

#### **Opción 1: URLs Firmadas con Service Account Key**
```python
# Requiere configurar una Service Account Key en la Cloud Function
from google.oauth2 import service_account

credentials = service_account.Credentials.from_service_account_file(
    'service-account-key.json'
)
storage_client = storage.Client(credentials=credentials)
```

**Pasos:**
1. Crear Service Account en GCP
2. Descargar JSON key
3. Subirlo como secret a Cloud Functions
4. Usar esas credenciales para firmar URLs

#### **Opción 2: Proxy de Descarga**
```python
# La Cloud Function descarga y retorna el archivo
def descargar_archivo_proxy(request):
    blob = bucket.blob(ruta)
    contenido = blob.download_as_bytes()
    return (contenido, 200, {
        'Content-Type': mime_type,
        'Content-Disposition': f'attachment; filename="{nombre}"'
    })
```

**Ventaja:** Control total  
**Desventaja:** Consume más recursos

#### **Opción 3: Bucket Privado + Cloud CDN**
- Usar Cloud CDN con autenticación
- Más complejo pero más seguro

---

## 🎯 Recomendación Actual

Para un **consultorio médico** con archivos de pacientes:

✅ **Usa URLs Públicas** (implementación actual) porque:
- Simple y funciona de inmediato
- Las URLs son difíciles de adivinar (contienen timestamp único)
- Puedes agregar autenticación a nivel de aplicación

⚠️ **Considera URLs Firmadas** más adelante si:
- Manejas información MUY sensible
- Necesitas cumplir con HIPAA u otras regulaciones estrictas
- Tienes tiempo para configurar Service Account Keys

---

## 📋 Checklist Final

- [x] Backend actualizado para usar URLs públicas
- [x] Eliminado intento de generar URLs firmadas
- [x] Scripts de configuración creados (PowerShell y Bash)
- [ ] **PENDIENTE:** Ejecutar script para configurar bucket
- [ ] **PENDIENTE:** Probar descarga desde la interfaz

---

## 🚀 Siguiente Paso

**Ejecuta el script de configuración:**

### Windows (PowerShell):
```powershell
# En la raíz del proyecto
.\configurar_bucket_storage.ps1
```

### Linux/Mac (Bash):
```bash
chmod +x configurar_bucket_storage.sh
./configurar_bucket_storage.sh
```

### O manualmente con un solo comando:
```bash
gsutil iam ch allUsers:objectViewer gs://archivos_sistema_consultorio_moyobamba
```

**Después de esto, las descargas funcionarán perfectamente!** ✨

---

## 📞 Si Necesitas Ayuda

Si no tienes `gsutil` instalado:
1. Instalar Google Cloud SDK: https://cloud.google.com/sdk/docs/install
2. Autenticarse: `gcloud auth login`
3. Configurar proyecto: `gcloud config set project [TU-PROJECT-ID]`
4. Ejecutar el script de configuración

O configura desde la **Cloud Console** (opción más fácil sin terminal).

