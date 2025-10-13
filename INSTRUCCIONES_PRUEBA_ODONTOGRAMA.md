# 🦷 Instrucciones para Probar el Odontograma

## ✅ **CHECKLIST DE IMPLEMENTACIÓN**

### 📊 **PASO 1: Actualizar Base de Datos PostgreSQL**

Ejecuta el script SQL en tu base de datos de Neon:

**Opción A - Desde Neon Console:**
1. Ve a https://console.neon.tech
2. Selecciona tu proyecto
3. Ve a "SQL Editor"
4. Copia y ejecuta las secciones del archivo `BASE_DATOS` desde la línea 456 hasta 574:
   - Tablas de odontograma (líneas 456-573)
   - Índices (líneas 608-617)

**Opción B - Desde psql:**
```bash
psql "postgresql://neondb_owner:npg_qX6DcMlHk8vE@ep-plain-mountain-aelv7gf4-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require" -f BASE_DATOS
```

**Verificar que se crearon las tablas:**
```sql
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name LIKE 'odonto%';
```

Deberías ver:
- ✅ odontogramas
- ✅ odontograma_dientes
- ✅ odontograma_plan_tratamiento
- ✅ odontograma_historial
- ✅ codigos_odontologicos

---

### 🔌 **PASO 2: Desplegar Cloud Function (SI AÚN NO ESTÁ DESPLEGADA)**

Tu Cloud Function ya está en:
```
https://odontograma-1090334808863.us-central1.run.app
```

**Si necesitas redesplegarla con el nuevo código:**

```bash
cd gcp_cloud_functions

gcloud functions deploy odontograma \
  --gen2 \
  --runtime=python311 \
  --region=us-central1 \
  --source=. \
  --entry-point=hello_http \
  --trigger-http \
  --allow-unauthenticated
```

**Verificar que funciona:**
```bash
curl https://odontograma-1090334808863.us-central1.run.app?action=codigos \
  -H "Authorization: Bearer TU_TOKEN_JWT"
```

---

### 🎨 **PASO 3: Probar en el Frontend**

**1. Asegúrate de tener las dependencias instaladas:**
```bash
npm install
```

**2. Inicia el servidor de desarrollo:**
```bash
npm start
```

**3. Proceso de prueba:**

#### A. Login
1. Ve a http://localhost:3000
2. Inicia sesión con tus credenciales
3. Verifica que el token se guarde correctamente

#### B. Abrir Historia Clínica
1. Ve a la página de "Pacientes"
2. Haz clic en un paciente para abrir su historia clínica
3. Navega a la pestaña "🦷 Odontograma"

#### C. Probar el Odontograma

**Interacción básica:**
- ✅ **Click izquierdo en un diente** → Debería cambiar el color de la superficie
- ✅ **Click derecho en un diente** → Debería mostrar un menú contextual
- ✅ **Hover sobre un diente** → Debería mostrar tooltip con información
- ✅ **Click en "Guardar Odontograma"** → Debería guardar en la base de datos

**Funcionalidades a probar:**

1. **Marcar Superficies:**
   - Click en diferentes áreas del diente
   - Verifica que cada superficie cambia independientemente
   - Los colores deberían cambiar según el estado

2. **Estados Generales:**
   - Click derecho en un diente
   - Selecciona "Corona", "Implante", "Extraído", etc.
   - El diente completo debería cambiar

3. **Tipos de Odontograma:**
   - Prueba cambiar entre:
     - ✅ Odo. Inicial
     - ✅ Odo. Evolución  
     - ✅ Odo. Alta
   - Cada uno debería cargar/guardar por separado

4. **Plan de Tratamiento:**
   - Después de marcar dientes, haz clic en "Guardar Odontograma"
   - La tabla de plan de tratamiento debería actualizarse
   - Prueba cambiar el estado de un tratamiento
   - Prueba eliminar un tratamiento

5. **Observaciones:**
   - Escribe en los campos de texto:
     - Especificaciones
     - Diagnóstico
     - Observaciones
     - Plan de trabajo
   - Haz clic en "Guardar Odontograma"
   - Recarga y verifica que se guardaron

---

### 🔍 **PASO 4: Verificar en Base de Datos**

**Después de hacer cambios, verifica en PostgreSQL:**

```sql
-- Ver odontogramas creados
SELECT * FROM odontogramas 
WHERE id_paciente = TU_ID_PACIENTE
ORDER BY fecha_creacion DESC;

-- Ver dientes modificados
SELECT od.*, o.tipo_odontograma 
FROM odontograma_dientes od
JOIN odontogramas o ON od.id_odontograma = o.id_odontograma
WHERE o.id_paciente = TU_ID_PACIENTE
AND od.estado_general != 'sano';

-- Ver plan de tratamiento
SELECT * FROM odontograma_plan_tratamiento
WHERE id_odontograma IN (
  SELECT id_odontograma FROM odontogramas 
  WHERE id_paciente = TU_ID_PACIENTE
);

-- Ver historial de cambios
SELECT h.*, u.nombre_usuario
FROM odontograma_historial h
JOIN usuarios u ON h.id_usuario = u.id_usuario
WHERE h.id_odontograma IN (
  SELECT id_odontograma FROM odontogramas 
  WHERE id_paciente = TU_ID_PACIENTE
)
ORDER BY h.fecha_cambio DESC
LIMIT 20;
```

---

### 🐛 **SOLUCIÓN DE PROBLEMAS**

#### **Error: "Token inválido o faltante"**
**Solución:**
1. Verifica que iniciaste sesión correctamente
2. Abre DevTools (F12) → Console
3. Ejecuta: `localStorage.getItem('token')`
4. Debe devolver un token JWT válido

#### **Error: "Error al obtener odontograma"**
**Solución:**
1. Verifica que las tablas existen en la BD
2. Verifica que la API está desplegada
3. Revisa la consola del navegador (F12)
4. Revisa los logs de Cloud Functions

#### **Los dientes no cambian de color**
**Solución:**
1. Verifica en la consola del navegador si hay errores
2. Asegúrate de que `handleDienteUpdate` se está llamando
3. Verifica que el token es válido

#### **No aparece el botón "Guardar Odontograma"**
**Solución:**
1. Verifica que estás en la pestaña "Odontograma"
2. Recarga la página (F5)
3. Limpia la caché del navegador

---

### 📊 **DATOS DE PRUEBA**

Si quieres crear un odontograma de prueba rápidamente:

**Escenario 1: Paciente con caries múltiples**
- Diente 16: Caries oclusal (click en superficie superior)
- Diente 26: Caries mesial (click en lado izquierdo)
- Diente 36: Caries distal y oclusal
- Marca como "alta prioridad" en el plan

**Escenario 2: Paciente con restauraciones**
- Click derecho en diente 15 → Seleccionar "Obturado"
- Click derecho en diente 25 → Seleccionar "Obturado"
- Click derecho en diente 46 → Seleccionar "Corona"

**Escenario 3: Extracciones**
- Click derecho en diente 18 → Seleccionar "Extraído"
- Click derecho en diente 28 → Seleccionar "Ausente"
- Click derecho en diente 38 → Seleccionar "Implante"

---

### 🎯 **CASOS DE USO REALES**

#### **Caso 1: Primera Consulta (Odontograma Inicial)**
1. Paciente nuevo llega por primera vez
2. Abrir historia clínica → Odontograma → "Odo. Inicial"
3. Hacer evaluación completa de 32 dientes
4. Marcar hallazgos (caries, obturaciones existentes, etc.)
5. Agregar notas en "Observaciones"
6. Guardar

#### **Caso 2: Consulta de Seguimiento (Odontograma Evolución)**
1. Paciente regresa para seguimiento
2. Abrir historia clínica → Odontograma → "Odo. Evolución"
3. Revisar tratamientos completados
4. Actualizar estados en el plan de tratamiento
5. Marcar nuevos hallazgos si existen
6. Guardar

#### **Caso 3: Alta del Paciente (Odontograma Alta)**
1. Paciente completa todos los tratamientos
2. Abrir historia clínica → Odontograma → "Odo. Alta"
3. Documentar estado final de todos los dientes
4. Agregar recomendaciones en "Plan de trabajo"
5. Guardar

---

### 📱 **PRUEBA EN DIFERENTES NAVEGADORES**

Prueba en:
- ✅ Chrome/Edge (recomendado)
- ✅ Firefox
- ✅ Safari (si tienes Mac)

---

### 🎉 **RESULTADO ESPERADO**

Después de todas las pruebas deberías poder:

✅ Ver odontograma interactivo con 32 dientes
✅ Cambiar estados de superficies con clicks
✅ Usar menú contextual para estados generales
✅ Ver tooltips con información
✅ Guardar cambios que persisten en la BD
✅ Ver plan de tratamiento actualizado
✅ Cambiar entre tipos de odontograma (inicial/evolución/alta)
✅ Ver historial de cambios en la BD

---

### 📸 **CAPTURAS DE PANTALLA**

Toma capturas de:
1. Odontograma con dientes marcados
2. Plan de tratamiento con varios tratamientos
3. Menú contextual abierto
4. Datos guardados en PostgreSQL

---

### 🆘 **SOPORTE**

Si encuentras algún problema:

1. **Revisa la consola del navegador** (F12 → Console)
2. **Revisa los logs de Cloud Functions** en GCP
3. **Verifica la conexión a la BD** ejecutando queries simples
4. **Revisa el token JWT** que sea válido y no haya expirado

---

### 📞 **CONTACTO**

Si todo funciona correctamente, ¡felicidades! 🎉

Si necesitas ayuda, revisa:
- `ODONTOGRAMA_README.md` - Documentación completa
- `ODONTOGRAMA_API_EXAMPLES.md` - Ejemplos de API
- Logs de Cloud Functions en GCP Console

---

## 🚀 **¡A PROBAR!**

¡Todo está listo! Sigue los pasos y disfruta de tu nuevo odontograma espectacular.

**Orden recomendado:**
1. ✅ Base de datos (5 minutos)
2. ✅ Verificar API (2 minutos)
3. ✅ Probar frontend (15 minutos)
4. ✅ Verificar resultados en BD (5 minutos)

**Tiempo total estimado: ~30 minutos**

---

*¡Éxito con las pruebas! 🦷✨*

