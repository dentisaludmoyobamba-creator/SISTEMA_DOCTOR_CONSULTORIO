# 🔧 Solución del Problema: No se pueden guardar archivos

## 📝 Problema Identificado

El archivo **no se guardaba** desde `NuevoArchivoModal.jsx` porque:

1. ❌ **`handleSaveArchivo` NO llamaba al servicio real** - Solo guardaba en estado local
2. ❌ **No se cargaban archivos existentes** desde la API
3. ❌ **Faltaba integración con `archivosService`**

---

## ✅ Cambios Realizados

### 1. **Frontend: `src/components/HistoriaClinica.jsx`**

#### Importaciones agregadas:
```javascript
import archivosService from '../services/archivosService';
```

#### Nuevo estado para loading:
```javascript
const [loadingArchivos, setLoadingArchivos] = useState(false);
```

#### Nueva función `loadArchivos`:
```javascript
const loadArchivos = async () => {
  try {
    setLoadingArchivos(true);
    const result = await archivosService.listarArchivos(paciente.id);
    if (result.success) {
      const archivosFormateados = result.archivos.map(archivo => ({
        id: archivo.id,
        nombre: archivo.nombre,
        categoria: archivo.categoria,
        // ... otros campos
      }));
      setArchivos(archivosFormateados);
    }
  } catch (e) {
    console.error('Error al cargar archivos:', e);
  } finally {
    setLoadingArchivos(false);
  }
};
```

#### Función `handleSaveArchivo` ACTUALIZADA:
**Antes (❌ INCORRECTO):**
```javascript
const handleSaveArchivo = (archivoData) => {
  // Solo guardaba localmente
  setArchivos(prev => [...prev, nuevoArchivo]);
};
```

**Ahora (✅ CORRECTO):**
```javascript
const handleSaveArchivo = async (archivoData) => {
  try {
    // Subir archivo al servidor usando archivosService
    const result = await archivosService.subirArchivo(archivoData.archivo, {
      id_paciente: paciente.id,
      id_doctor: archivoData.doctor || null,
      categoria: archivoData.categoria,
      descripcion: archivoData.descripcion,
      notas: archivoData.notas,
      compartir_con_paciente: archivoData.compartirConPaciente
    });

    if (result.success) {
      setArchivos(prev => [...prev, nuevoArchivo]);
      alert(`Archivo "${archivoData.archivo.name}" subido exitosamente`);
    }
  } catch (error) {
    alert(`Error al subir archivo: ${error.message}`);
    throw error;
  }
};
```

#### useEffect actualizado:
```javascript
useEffect(() => {
  if (paciente?.id) {
    loadDatosPersonales();
    loadLookupOptions();
    loadNotasAlergias();
    loadArchivos(); // ← NUEVO
  }
}, [paciente?.id]);
```

---

### 2. **Backend: `gcp_cloud_functions/gestorarchivos.py`**

#### Manejo robusto de Cloud Storage:
```python
# Configuración Cloud Storage con manejo de errores
try:
    storage_client = storage.Client()
    BUCKET_NAME = "archivos_sistema_consultorio_moyobamba"
except Exception as e:
    print(f"Error al inicializar Cloud Storage: {e}")
    storage_client = None
```

#### Validación agregada:
```python
def subir_archivo(request):
    # Verificar que Cloud Storage esté disponible
    if not storage_client:
        return json_response({"error": "Servicio de almacenamiento no disponible"}, 500)
```

#### Logging mejorado:
```python
print(f"DEBUG - Subiendo archivo: {archivo.filename}, paciente: {id_paciente}, categoria: {categoria}")

# ... en catch:
import traceback
print(f"ERROR al subir archivo: {str(e)}")
print(f"Traceback: {traceback.format_exc()}")
```

---

## 🧪 Cómo Probar

### 1. **Verificar que el bucket existe en GCP:**
```bash
# En GCP Console, ir a:
Cloud Storage > Buckets > archivos_sistema_consultorio_moyobamba
```

### 2. **Probar desde la interfaz:**
1. Abrir Historia Clínica de un paciente
2. Ir a la sección "Archivos"
3. Click en "Nuevo Archivo"
4. Seleccionar:
   - Categoría (ej: Radiografía)
   - Archivo (imagen, PDF, etc.)
   - Descripción/Notas opcionales
5. Click "Subir Archivo"
6. Verificar mensaje de éxito

### 3. **Verificar en logs de GCP:**
```bash
# Ver logs de la Cloud Function
gcloud functions logs read gestorarchivos --limit 50
```

Buscar:
- `DEBUG - Subiendo archivo: ...`
- Mensajes de error (si hay)

### 4. **Verificar en base de datos:**
```sql
-- Ver archivos subidos
SELECT * FROM archivos_paciente WHERE id_paciente = [ID] ORDER BY fecha_subida DESC;

-- Ver categorías disponibles
SELECT * FROM categorias_archivo WHERE activa = true;
```

### 5. **Verificar en Cloud Storage:**
```bash
# Listar archivos del bucket
gsutil ls gs://archivos_sistema_consultorio_moyobamba/
```

---

## 🐛 Posibles Errores y Soluciones

### Error 1: "Token inválido o faltante"
**Causa:** No está autenticado  
**Solución:** Hacer logout y login nuevamente

### Error 2: "Servicio de almacenamiento no disponible"
**Causa:** Cloud Storage no inicializado  
**Solución:** 
1. Verificar credenciales de GCP en la Cloud Function
2. Verificar que el Service Account tenga permisos de `Storage Admin`

### Error 3: "id_paciente es requerido"
**Causa:** No se está pasando el ID del paciente  
**Solución:** Verificar que `paciente.id` exista en `HistoriaClinica.jsx`

### Error 4: Archivo se sube pero no aparece en la lista
**Causa:** `loadArchivos()` no se llama después de subir  
**Solución:** El código ya llama `setArchivos` después de subir exitosamente

### Error 5: "Permission denied" en Cloud Storage
**Causa:** Bucket privado o permisos insuficientes  
**Solución:**
```bash
# Dar permisos públicos (si es necesario)
gsutil iam ch allUsers:objectViewer gs://archivos_sistema_consultorio_moyobamba

# O configurar CORS:
gsutil cors set cors.json gs://archivos_sistema_consultorio_moyobamba
```

---

## 📊 Flujo Completo

```
1. Usuario abre Historia Clínica
   ↓
2. loadArchivos() obtiene archivos existentes del paciente
   ↓
3. Usuario click "Nuevo Archivo"
   ↓
4. NuevoArchivoModal.jsx se abre
   ↓
5. Usuario selecciona archivo y llena formulario
   ↓
6. Click "Subir Archivo"
   ↓
7. handleSaveArchivo() llama a archivosService.subirArchivo()
   ↓
8. archivosService envía FormData a API (gestorarchivos.py)
   ↓
9. Backend valida autenticación
   ↓
10. Backend sube archivo a Cloud Storage
   ↓
11. Backend registra metadata en PostgreSQL (tabla: archivos_paciente)
   ↓
12. Backend retorna { success: true, id_archivo, url_publica, ... }
   ↓
13. Frontend actualiza lista de archivos (setArchivos)
   ↓
14. Usuario ve mensaje de éxito ✅
```

---

## 🔍 Checklist de Verificación

- [x] `archivosService` importado en `HistoriaClinica.jsx`
- [x] `loadArchivos()` se llama en `useEffect`
- [x] `handleSaveArchivo()` llama a `archivosService.subirArchivo()`
- [x] Backend valida Cloud Storage está disponible
- [x] Backend tiene logging mejorado
- [x] Manejo de errores robusto en frontend y backend

---

## 📞 Siguiente Paso

Si sigue sin funcionar después de estos cambios, revisar en **orden**:

1. **Console del navegador** (F12) - Ver errores de JavaScript
2. **Network tab** - Ver request/response de la API
3. **Logs de GCP Cloud Functions** - Ver errores del backend
4. **Base de datos** - Ver si se creó el registro

---

## 🎯 Resultado Esperado

✅ Archivos se suben correctamente a Cloud Storage  
✅ Metadata se guarda en PostgreSQL  
✅ Archivos aparecen en la lista inmediatamente  
✅ Se puede descargar/ver archivos subidos  
✅ Botones de "Descargar" y "Eliminar" visibles en cada archivo  
✅ Descarga funciona mediante URL pública o firmada  

---

## 🆕 Actualización: Funcionalidad de Descarga

### **Nuevas Funciones Agregadas:**

#### 1. **`handleDescargarArchivo(archivo)`**
```javascript
const handleDescargarArchivo = async (archivo) => {
  try {
    await archivosService.descargarArchivo(archivo.id, archivo.nombre);
  } catch (error) {
    alert(`Error al descargar archivo: ${error.message}`);
  }
};
```

#### 2. **`handleEliminarArchivo(archivoId)`**
```javascript
const handleEliminarArchivo = async (archivoId) => {
  if (!window.confirm('¿Estás seguro de eliminar este archivo?')) {
    return;
  }
  
  const result = await archivosService.eliminarArchivo(archivoId);
  if (result.success) {
    setArchivos(prev => prev.filter(a => a.id !== archivoId));
    alert('Archivo eliminado exitosamente');
  }
};
```

### **Mejoras en la UI:**

✅ **Tarjetas de archivo mejoradas** con:
- Badge de categoría (color púrpura)
- Tamaño del archivo formateado
- Nombre del usuario que subió
- Fecha formatteda
- Indicador de "Compartido con paciente"

✅ **Botones de acción** en cada tarjeta:
- 🔵 **Descargar** - Descarga el archivo
- 🔴 **Eliminar** - Elimina el archivo (con confirmación)

### **Backend: Manejo Robusto de Descargas**

El backend ahora maneja dos métodos de descarga:

1. **URL Firmada (Preferido)**: 
   - Segura, expira en 1 hora
   - Requiere credenciales de Service Account

2. **URL Pública (Fallback)**:
   - Si las URL firmadas fallan
   - Los archivos se hacen públicos automáticamente
   - Acceso permanente

```python
try:
    # Intentar generar URL firmada
    url_descarga = blob.generate_signed_url(
        version="v4",
        expiration=datetime.timedelta(hours=1),
        method="GET"
    )
except Exception:
    # Fallback: usar URL pública
    blob.make_public()
    url_descarga = blob.public_url
```  

