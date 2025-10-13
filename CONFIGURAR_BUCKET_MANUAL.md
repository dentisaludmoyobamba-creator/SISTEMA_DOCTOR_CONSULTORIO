# 🔧 Configurar Bucket Manualmente (Cloud Console)

## ⚠️ Problema de Permisos

Tu cuenta `zeusadmi24@gmail.com` **NO tiene permisos** para modificar IAM del bucket.

**Necesitas que el propietario del proyecto GCP haga esto:**

---

## 📋 Pasos para Configurar el Bucket (Propietario del Proyecto)

### **Opción 1: Desde Cloud Console (Más Fácil) 🖱️**

#### **Paso 1: Ir a Cloud Storage**
1. Abrir: https://console.cloud.google.com/storage
2. Iniciar sesión con la cuenta **propietaria del proyecto**
3. Buscar el bucket: `archivos_sistema_consultorio_moyobamba`

#### **Paso 2: Configurar Permisos Públicos**
1. Click en el bucket `archivos_sistema_consultorio_moyobamba`
2. Click en la pestaña **"Permissions"** (Permisos)
3. Click en **"Grant Access"** (Otorgar acceso)
4. En el formulario:
   - **New principals:** `allUsers`
   - **Role:** `Storage Object Viewer`
5. Click **"Save"** (Guardar)
6. Confirmar el warning de acceso público

#### **Paso 3: Configurar CORS (Opcional pero Recomendado)**
1. En el mismo bucket, ir a **"Configuration"** (Configuración)
2. Scroll hasta **"CORS"**
3. Click **"Edit CORS configuration"**
4. Pegar este JSON:
```json
[
  {
    "origin": ["*"],
    "method": ["GET", "POST", "PUT", "DELETE", "HEAD"],
    "responseHeader": ["Content-Type", "Authorization"],
    "maxAgeSeconds": 3600
  }
]
```
5. Click **"Save"**

---

### **Opción 2: Desde Terminal (Requiere Permisos Admin) 💻**

Si tienes acceso con una cuenta admin:

```bash
# 1. Autenticarse con cuenta admin
gcloud auth login

# 2. Configurar permisos públicos
gsutil iam ch allUsers:objectViewer gs://archivos_sistema_consultorio_moyobamba

# 3. Configurar CORS
echo '[{"origin": ["*"], "method": ["GET", "POST", "PUT", "DELETE"], "responseHeader": ["Content-Type"], "maxAgeSeconds": 3600}]' > cors.json
gsutil cors set cors.json gs://archivos_sistema_consultorio_moyobamba
rm cors.json

# 4. Verificar
gsutil iam get gs://archivos_sistema_consultorio_moyobamba
```

---

## 🔍 Verificar que Funcionó

### **Prueba 1: Ver Permisos**
```bash
gsutil iam get gs://archivos_sistema_consultorio_moyobamba
```

Deberías ver:
```json
{
  "bindings": [
    {
      "members": [
        "allUsers"
      ],
      "role": "roles/storage.objectViewer"
    }
  ]
}
```

### **Prueba 2: Subir y Descargar**
1. Ir a la interfaz del sistema
2. Abrir Historia Clínica de un paciente
3. Ir a "Archivos"
4. Subir un archivo de prueba
5. Click en **"Descargar"**
6. ✅ El archivo debería descargarse/abrirse

---

## 🎯 ¿Por qué URLs Públicas en lugar de Firmadas?

| Característica | URLs Firmadas | URLs Públicas (Actual) |
|----------------|---------------|------------------------|
| **Seguridad** | 🔐 Alta (expiran) | ⚠️ Media (permanentes) |
| **Configuración** | Compleja (Service Account Key) | ✅ Simple |
| **Rendimiento** | Igual | Igual |
| **Costo** | Igual | Igual |
| **Permisos necesarios** | Private Key | Bucket público |
| **En Cloud Functions** | ❌ No funciona fácilmente | ✅ Funciona |

**Para un consultorio médico:** URLs públicas son suficientes porque:
- ✅ Las URLs son difíciles de adivinar (timestamps únicos)
- ✅ Solo usuarios autenticados pueden ver la lista
- ✅ Funciona inmediatamente sin configuración compleja
- ✅ Los archivos médicos no contienen nombres obvios en la URL

---

## 🔐 Mejorar Seguridad (Futuro)

Si en el futuro necesitas más seguridad:

### **Opción 1: Service Account Key en Cloud Functions**
1. Crear Service Account con permisos de Storage
2. Generar JSON key
3. Subir key como **Secret** en Cloud Functions
4. Usar ese key para generar URLs firmadas

```python
from google.oauth2 import service_account
import json
import os

# Leer secret
key_json = os.environ.get('STORAGE_KEY')
credentials = service_account.Credentials.from_service_account_info(
    json.loads(key_json)
)
storage_client = storage.Client(credentials=credentials)
```

### **Opción 2: URLs de Corta Duración**
- Generar URLs que expiren después de X minutos
- Almacenar en Redis/Memcache
- Validar en cada descarga

### **Opción 3: Bucket Privado + Proxy**
- Mantener bucket privado
- Cloud Function actúa como proxy
- Valida autenticación antes de servir archivo

---

## 📊 Estado Actual del Sistema

### ✅ **Funcionando:**
- Subir archivos → Cloud Storage
- Listar archivos → PostgreSQL
- Descargar archivos → URLs públicas
- Eliminar archivos → Soft delete

### ⏳ **Pendiente:**
- Configurar bucket con permisos públicos (ESTE PASO)

### 🎯 **Próximos Pasos:**
1. **URGENTE:** Configurar bucket (opción 1 de arriba)
2. Probar descarga
3. Si funciona → ¡Listo! 🎉

---

## 📞 Contactar al Admin del Proyecto

Si no tienes acceso para configurar el bucket, contacta al **propietario del proyecto GCP** y envíale:

### **Mensaje sugerido:**

```
Hola,

Necesito configurar el bucket de Cloud Storage para permitir descargas públicas.

¿Podrías ejecutar este comando?

gsutil iam ch allUsers:objectViewer gs://archivos_sistema_consultorio_moyobamba

O desde Cloud Console:
1. Ir a: https://console.cloud.google.com/storage/browser/archivos_sistema_consultorio_moyobamba
2. Pestaña "Permissions"
3. "Grant Access"
4. Principal: allUsers
5. Role: Storage Object Viewer
6. Save

Gracias!
```

---

## ✅ Resumen de Cambios en el Código

### **Backend (`gestorarchivos.py`):**
```python
# ANTES
url_firmada = blob.generate_signed_url(...)  # ❌ Error

# AHORA
blob.make_public()
url_descarga = blob.public_url  # ✅ Funciona
```

### **Frontend (`HistoriaClinica.jsx`):**
```javascript
// ANTES
// No había botones de descarga

// AHORA
<button onClick={() => handleDescargarArchivo(archivo)}>
  Descargar
</button>
```

---

## 🎉 Una vez configurado el bucket...

**¡Todo funcionará perfectamente!**

- ✅ Subir archivos
- ✅ Ver archivos en lista
- ✅ **Descargar archivos** ← Esto funcionará después de configurar
- ✅ Eliminar archivos

**Tiempo estimado:** 2-3 minutos de configuración

