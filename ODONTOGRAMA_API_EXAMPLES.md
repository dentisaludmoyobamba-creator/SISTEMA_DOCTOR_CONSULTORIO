# 🔌 API de Odontograma - Ejemplos de Uso

## 📍 URL Base
```
https://odontograma-287088589754.us-central1.run.app
```

## 🔑 Autenticación

Todas las peticiones requieren un token JWT en el header:
```
Authorization: Bearer {token}
```

---

## 📥 GET - Obtener Odontograma

### Endpoint
```
GET /?action=obtener&id_paciente={id}&tipo={tipo}
```

### Parámetros
- `id_paciente` (requerido): ID del paciente
- `tipo` (opcional): 'inicial' | 'evolucion' | 'alta' (default: 'inicial')

### Ejemplo con cURL
```bash
curl -X GET \
  'https://odontograma-287088589754.us-central1.run.app?action=obtener&id_paciente=123&tipo=inicial' \
  -H 'Authorization: Bearer eyJhbGc...'
```

### Respuesta Exitosa
```json
{
  "success": true,
  "existe": true,
  "odontograma": {
    "id": 1,
    "id_paciente": 123,
    "id_doctor": 5,
    "doctor": "Dr. Juan Pérez",
    "tipo": "inicial",
    "fecha_creacion": "2024-10-12T10:30:00Z",
    "fecha_modificacion": "2024-10-12T15:45:00Z",
    "observaciones": "Paciente con buena higiene oral"
  },
  "dientes": [
    {
      "numero": 11,
      "estado_general": "sano",
      "superficies": {
        "oclusal": "sano",
        "vestibular": "sano",
        "lingual": "sano",
        "mesial": "sano",
        "distal": "sano"
      },
      "tiene_caries": false,
      "tiene_obturacion": false,
      "tiene_corona": false,
      "necesita_extraccion": false,
      "codigo_tratamiento": null,
      "color_marcador": null,
      "notas": null,
      "fecha_registro": "2024-10-12T10:30:00Z"
    },
    {
      "numero": 16,
      "estado_general": "obturado",
      "superficies": {
        "oclusal": "obturado",
        "vestibular": "sano",
        "lingual": "sano",
        "mesial": "caries",
        "distal": "sano"
      },
      "tiene_caries": true,
      "tiene_obturacion": true,
      "tiene_corona": false,
      "necesita_extraccion": false,
      "codigo_tratamiento": "O",
      "color_marcador": "#10b981",
      "notas": "Obturación reciente, caries mesial pendiente",
      "fecha_registro": "2024-10-12T10:30:00Z"
    }
  ],
  "plan_tratamiento": [
    {
      "id": 1,
      "numero_diente": 16,
      "tratamiento": "Obturación mesial",
      "descripcion": "Tratamiento de caries mesial en molar superior derecho",
      "prioridad": "alta",
      "estado": "pendiente",
      "costo_estimado": 150.00,
      "fecha_planificado": "2024-10-20",
      "fecha_completado": null,
      "observaciones": "Programar para próxima semana",
      "fecha_creacion": "2024-10-12T10:30:00Z"
    }
  ]
}
```

### Respuesta si no existe
```json
{
  "success": true,
  "existe": false,
  "odontograma": null,
  "dientes": [],
  "plan_tratamiento": []
}
```

---

## 💾 POST - Guardar Odontograma Completo

### Endpoint
```
POST /?action=guardar
```

### Body (JSON)
```json
{
  "id_paciente": 123,
  "tipo": "inicial",
  "id_doctor": 5,
  "observaciones": "Primera evaluación. Paciente con buena higiene oral",
  "dientes": [
    {
      "numero": 11,
      "estado_general": "sano",
      "superficies": {
        "oclusal": "sano",
        "vestibular": "sano",
        "lingual": "sano",
        "mesial": "sano",
        "distal": "sano"
      },
      "tiene_caries": false,
      "tiene_obturacion": false,
      "tiene_corona": false,
      "necesita_extraccion": false,
      "codigo_tratamiento": null,
      "color_marcador": null,
      "notas": null
    },
    {
      "numero": 16,
      "estado_general": "obturado",
      "superficies": {
        "oclusal": "obturado",
        "vestibular": "sano",
        "lingual": "sano",
        "mesial": "caries",
        "distal": "sano"
      },
      "tiene_caries": true,
      "tiene_obturacion": true,
      "tiene_corona": false,
      "necesita_extraccion": false,
      "codigo_tratamiento": "O",
      "color_marcador": "#10b981",
      "notas": "Obturación previa, caries mesial nueva"
    }
  ]
}
```

### Ejemplo con cURL
```bash
curl -X POST \
  'https://odontograma-287088589754.us-central1.run.app?action=guardar' \
  -H 'Authorization: Bearer eyJhbGc...' \
  -H 'Content-Type: application/json' \
  -d '{
    "id_paciente": 123,
    "tipo": "inicial",
    "id_doctor": 5,
    "observaciones": "Primera evaluación",
    "dientes": [...]
  }'
```

### Respuesta Exitosa
```json
{
  "success": true,
  "message": "Odontograma guardado exitosamente",
  "id_odontograma": 1
}
```

---

## 🦷 POST - Actualizar Diente Individual

### Endpoint
```
POST /?action=diente
```

### Body (JSON)
```json
{
  "id_paciente": 123,
  "tipo": "inicial",
  "numero_diente": 16,
  "estado_general": "obturado",
  "superficies": {
    "oclusal": "obturado",
    "vestibular": "sano",
    "lingual": "sano",
    "mesial": "caries",
    "distal": "sano"
  },
  "tiene_caries": true,
  "tiene_obturacion": true,
  "tiene_corona": false,
  "necesita_extraccion": false,
  "codigo_tratamiento": "O",
  "color_marcador": "#10b981",
  "notas": "Obturación oclusal, caries mesial detectada"
}
```

### Ejemplo con cURL
```bash
curl -X POST \
  'https://odontograma-287088589754.us-central1.run.app?action=diente' \
  -H 'Authorization: Bearer eyJhbGc...' \
  -H 'Content-Type: application/json' \
  -d '{
    "id_paciente": 123,
    "tipo": "inicial",
    "numero_diente": 16,
    "estado_general": "obturado",
    "superficies": {...}
  }'
```

### Respuesta Exitosa
```json
{
  "success": true,
  "message": "Diente 16 actualizado exitosamente"
}
```

---

## 📋 POST - Agregar Tratamiento al Plan

### Endpoint
```
POST /?action=plan
```

### Body (JSON)
```json
{
  "id_odontograma": 1,
  "numero_diente": 16,
  "tratamiento": "Obturación mesial",
  "descripcion": "Tratamiento de caries mesial en molar superior derecho",
  "prioridad": "alta",
  "estado": "pendiente",
  "costo_estimado": 150.00,
  "fecha_planificado": "2024-10-20",
  "observaciones": "Programar para próxima semana"
}
```

### Prioridades Válidas
- `baja`
- `media`
- `alta`
- `urgente`

### Estados Válidos
- `pendiente`
- `en_proceso`
- `completado`
- `cancelado`

### Ejemplo con cURL
```bash
curl -X POST \
  'https://odontograma-287088589754.us-central1.run.app?action=plan' \
  -H 'Authorization: Bearer eyJhbGc...' \
  -H 'Content-Type: application/json' \
  -d '{
    "id_odontograma": 1,
    "numero_diente": 16,
    "tratamiento": "Obturación mesial",
    "prioridad": "alta"
  }'
```

### Respuesta Exitosa
```json
{
  "success": true,
  "message": "Tratamiento agregado al plan exitosamente",
  "id_plan": 1
}
```

---

## ✏️ PUT - Actualizar Tratamiento del Plan

### Endpoint
```
PUT /?action=plan
```

### Body (JSON)
```json
{
  "id_plan": 1,
  "estado": "completado",
  "fecha_completado": "2024-10-15",
  "observaciones": "Tratamiento finalizado exitosamente"
}
```

### Campos Actualizables
- `tratamiento_planificado` → `tratamiento`
- `descripcion`
- `prioridad`
- `estado`
- `costo_estimado`
- `fecha_planificado`
- `fecha_completado`
- `observaciones`

### Ejemplo con cURL
```bash
curl -X PUT \
  'https://odontograma-287088589754.us-central1.run.app?action=plan' \
  -H 'Authorization: Bearer eyJhbGc...' \
  -H 'Content-Type: application/json' \
  -d '{
    "id_plan": 1,
    "estado": "completado"
  }'
```

### Respuesta Exitosa
```json
{
  "success": true,
  "message": "Tratamiento actualizado exitosamente"
}
```

---

## 🗑️ DELETE - Eliminar Tratamiento del Plan

### Endpoint
```
DELETE /?action=plan&id_plan={id}
```

### Parámetros
- `id_plan` (requerido): ID del tratamiento a eliminar

### Ejemplo con cURL
```bash
curl -X DELETE \
  'https://odontograma-287088589754.us-central1.run.app?action=plan&id_plan=1' \
  -H 'Authorization: Bearer eyJhbGc...'
```

### Respuesta Exitosa
```json
{
  "success": true,
  "message": "Tratamiento eliminado exitosamente"
}
```

---

## 📚 GET - Obtener Códigos Odontológicos

### Endpoint
```
GET /?action=codigos&categoria={categoria}
```

### Parámetros
- `categoria` (opcional): 'diagnostico' | 'tratamiento' | 'estado'

### Ejemplo con cURL
```bash
# Todos los códigos
curl -X GET \
  'https://odontograma-287088589754.us-central1.run.app?action=codigos' \
  -H 'Authorization: Bearer eyJhbGc...'

# Solo diagnósticos
curl -X GET \
  'https://odontograma-287088589754.us-central1.run.app?action=codigos&categoria=diagnostico' \
  -H 'Authorization: Bearer eyJhbGc...'
```

### Respuesta Exitosa
```json
{
  "success": true,
  "codigos": [
    {
      "codigo": "SANO",
      "nombre": "Sano",
      "descripcion": "Diente sano sin patología",
      "color": "#ffffff",
      "categoria": "diagnostico"
    },
    {
      "codigo": "C",
      "nombre": "Caries",
      "descripcion": "Caries dental",
      "color": "#ef4444",
      "categoria": "diagnostico"
    },
    {
      "codigo": "O",
      "nombre": "Obturación",
      "descripcion": "Obturación/Restauración",
      "color": "#10b981",
      "categoria": "tratamiento"
    }
  ]
}
```

---

## 📜 GET - Obtener Historial de Cambios

### Endpoint
```
GET /?action=historial&id_odontograma={id}
```

### Parámetros
- `id_odontograma` (requerido): ID del odontograma

### Ejemplo con cURL
```bash
curl -X GET \
  'https://odontograma-287088589754.us-central1.run.app?action=historial&id_odontograma=1' \
  -H 'Authorization: Bearer eyJhbGc...'
```

### Respuesta Exitosa
```json
{
  "success": true,
  "historial": [
    {
      "id": 5,
      "numero_diente": 16,
      "campo": "actualizacion_diente",
      "valor_anterior": null,
      "valor_nuevo": "{\"numero\":16,\"estado_general\":\"obturado\",...}",
      "fecha": "2024-10-12T15:45:00Z",
      "usuario": "juan.perez",
      "observaciones": null
    },
    {
      "id": 4,
      "numero_diente": 11,
      "campo": "actualizacion_diente",
      "valor_anterior": null,
      "valor_nuevo": "{\"numero\":11,\"estado_general\":\"sano\",...}",
      "fecha": "2024-10-12T10:30:00Z",
      "usuario": "juan.perez",
      "observaciones": null
    }
  ]
}
```

---

## ❌ Manejo de Errores

### Error 401 - No Autorizado
```json
{
  "error": "Token inválido o faltante"
}
```

### Error 400 - Datos Inválidos
```json
{
  "error": "id_paciente es requerido"
}
```

### Error 404 - No Encontrado
```json
{
  "error": "Cita no encontrada"
}
```

### Error 409 - Conflicto
```json
{
  "error": "El doctor no está disponible en ese horario"
}
```

### Error 500 - Error del Servidor
```json
{
  "error": "Error al obtener odontograma: [detalles]"
}
```

---

## 🧪 Testing con JavaScript

### Ejemplo de Uso con Fetch

```javascript
// Obtener odontograma
const obtenerOdontograma = async (idPaciente, tipo = 'inicial') => {
  const token = localStorage.getItem('token');
  
  try {
    const response = await fetch(
      `https://odontograma-287088589754.us-central1.run.app?action=obtener&id_paciente=${idPaciente}&tipo=${tipo}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Error al obtener odontograma');
    }
    
    return data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

// Guardar odontograma
const guardarOdontograma = async (odontogramaData) => {
  const token = localStorage.getItem('token');
  
  try {
    const response = await fetch(
      'https://odontograma-287088589754.us-central1.run.app?action=guardar',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(odontogramaData)
      }
    );
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Error al guardar odontograma');
    }
    
    return data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

// Actualizar diente
const actualizarDiente = async (dienteData) => {
  const token = localStorage.getItem('token');
  
  try {
    const response = await fetch(
      'https://odontograma-287088589754.us-central1.run.app?action=diente',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(dienteData)
      }
    );
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Error al actualizar diente');
    }
    
    return data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};
```

---

## 📊 Casos de Uso Comunes

### 1. Crear Odontograma Inicial
```javascript
const crearOdontogramaInicial = async (idPaciente, idDoctor) => {
  // Crear estructura de 32 dientes sanos
  const dientes = [];
  
  // Cuadrantes superiores: 18-11, 21-28
  for (let i = 18; i >= 11; i--) dientes.push(crearDienteSano(i));
  for (let i = 21; i <= 28; i++) dientes.push(crearDienteSano(i));
  
  // Cuadrantes inferiores: 38-31, 41-48
  for (let i = 38; i >= 31; i--) dientes.push(crearDienteSano(i));
  for (let i = 41; i <= 48; i++) dientes.push(crearDienteSano(i));
  
  const odontograma = {
    id_paciente: idPaciente,
    tipo: 'inicial',
    id_doctor: idDoctor,
    observaciones: 'Primera evaluación',
    dientes: dientes
  };
  
  return await guardarOdontograma(odontograma);
};

const crearDienteSano = (numero) => ({
  numero: numero,
  estado_general: 'sano',
  superficies: {
    oclusal: 'sano',
    vestibular: 'sano',
    lingual: 'sano',
    mesial: 'sano',
    distal: 'sano'
  },
  tiene_caries: false,
  tiene_obturacion: false,
  tiene_corona: false,
  necesita_extraccion: false
});
```

### 2. Marcar Diente con Caries
```javascript
const marcarCaries = async (idPaciente, numeroDiente, superficieAfectada) => {
  await actualizarDiente({
    id_paciente: idPaciente,
    tipo: 'inicial',
    numero_diente: numeroDiente,
    estado_general: 'caries',
    superficies: {
      oclusal: superficieAfectada === 'oclusal' ? 'caries' : 'sano',
      vestibular: superficieAfectada === 'vestibular' ? 'caries' : 'sano',
      lingual: superficieAfectada === 'lingual' ? 'caries' : 'sano',
      mesial: superficieAfectada === 'mesial' ? 'caries' : 'sano',
      distal: superficieAfectada === 'distal' ? 'caries' : 'sano'
    },
    tiene_caries: true,
    codigo_tratamiento: 'C',
    color_marcador: '#ef4444',
    notas: `Caries detectada en superficie ${superficieAfectada}`
  });
};
```

### 3. Agregar Tratamiento de Urgencia
```javascript
const agregarTratamientoUrgente = async (idOdontograma, numeroDiente, tratamiento) => {
  await fetch(
    'https://odontograma-287088589754.us-central1.run.app?action=plan',
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id_odontograma: idOdontograma,
        numero_diente: numeroDiente,
        tratamiento: tratamiento,
        prioridad: 'urgente',
        estado: 'pendiente',
        fecha_planificado: new Date().toISOString().split('T')[0]
      })
    }
  );
};
```

---

## 🔗 Enlaces Útiles

- [Documentación Principal](ODONTOGRAMA_README.md)
- [Schema de Base de Datos](BASE_DATOS)
- [Código Frontend](src/services/odontogramaService.js)
- [Código Backend](gcp_cloud_functions/odontograma.py)

---

*Última actualización: Octubre 2025*

