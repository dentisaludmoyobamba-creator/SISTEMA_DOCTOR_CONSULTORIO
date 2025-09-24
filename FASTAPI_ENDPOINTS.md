# Endpoints FastAPI para el Sistema de Consultorio

## 📋 Estructura de Endpoints Requeridos

Basado en el análisis de tu base de datos PostgreSQL y las funcionalidades del frontend React, aquí están todos los endpoints que tu backend FastAPI debe implementar:

## 🔐 Autenticación

```
POST   /api/v1/auth/login
POST   /api/v1/auth/logout
POST   /api/v1/auth/refresh
GET    /api/v1/auth/profile
PUT    /api/v1/auth/profile
```

## 👥 Usuarios y Roles

```
GET    /api/v1/users
GET    /api/v1/users/{user_id}
POST   /api/v1/users
PUT    /api/v1/users/{user_id}
DELETE /api/v1/users/{user_id}
GET    /api/v1/roles
```

## 👨‍⚕️ Doctores

```
GET    /api/v1/doctors
GET    /api/v1/doctors/{doctor_id}
POST   /api/v1/doctors
PUT    /api/v1/doctors/{doctor_id}
DELETE /api/v1/doctors/{doctor_id}
GET    /api/v1/doctors/{doctor_id}/schedule
POST   /api/v1/doctors/{doctor_id}/schedule
PUT    /api/v1/doctors/{doctor_id}/schedule/{schedule_id}
DELETE /api/v1/doctors/{doctor_id}/schedule/{schedule_id}
GET    /api/v1/doctors/{doctor_id}/available-slots
GET    /api/v1/doctors/{doctor_id}/productivity
```

## 🏥 Pacientes

```
GET    /api/v1/patients
GET    /api/v1/patients/{patient_id}
POST   /api/v1/patients
PUT    /api/v1/patients/{patient_id}
DELETE /api/v1/patients/{patient_id}
GET    /api/v1/patients/search
GET    /api/v1/patients/{patient_id}/history
GET    /api/v1/patients/{patient_id}/appointments
GET    /api/v1/patients/segments
POST   /api/v1/patients/segments
```

## 📅 Citas Médicas

```
GET    /api/v1/appointments
GET    /api/v1/appointments/{appointment_id}
POST   /api/v1/appointments
PUT    /api/v1/appointments/{appointment_id}
DELETE /api/v1/appointments/{appointment_id}
PATCH  /api/v1/appointments/{appointment_id}/status
GET    /api/v1/appointments/date/{date}
GET    /api/v1/appointments/doctor/{doctor_id}
GET    /api/v1/appointments/patient/{patient_id}
GET    /api/v1/appointments/available-slots
POST   /api/v1/appointments/{appointment_id}/reminder
```

## 💰 Transacciones Financieras (Módulo Caja)

```
GET    /api/v1/transactions
GET    /api/v1/transactions/{transaction_id}
POST   /api/v1/transactions
PUT    /api/v1/transactions/{transaction_id}
DELETE /api/v1/transactions/{transaction_id}
GET    /api/v1/transactions/summary
GET    /api/v1/transactions/date/{date}
GET    /api/v1/transactions/date-range
GET    /api/v1/transactions/doctor/{doctor_id}
GET    /api/v1/transactions/type/{type}
GET    /api/v1/transactions/daily-report
GET    /api/v1/transactions/monthly-report
```

## 🧾 Facturación

```
GET    /api/v1/invoices
GET    /api/v1/invoices/{invoice_id}
POST   /api/v1/invoices
PUT    /api/v1/invoices/{invoice_id}
DELETE /api/v1/invoices/{invoice_id}
GET    /api/v1/invoices/{invoice_id}/payments
POST   /api/v1/invoices/{invoice_id}/payments
GET    /api/v1/invoices/patient/{patient_id}
GET    /api/v1/invoices/status/{status}
```

## 📦 Inventario

```
GET    /api/v1/products
GET    /api/v1/products/{product_id}
POST   /api/v1/products
PUT    /api/v1/products/{product_id}
DELETE /api/v1/products/{product_id}
GET    /api/v1/products/low-stock
GET    /api/v1/products/movements
POST   /api/v1/products/{product_id}/movements
GET    /api/v1/products/{product_id}/movements
GET    /api/v1/suppliers
POST   /api/v1/suppliers
```

## 🎯 Marketing y Campañas

```
GET    /api/v1/campaigns
GET    /api/v1/campaigns/{campaign_id}
POST   /api/v1/campaigns
PUT    /api/v1/campaigns/{campaign_id}
DELETE /api/v1/campaigns/{campaign_id}
GET    /api/v1/campaigns/{campaign_id}/results
POST   /api/v1/campaigns/{campaign_id}/send
```

## 📊 Segmentaciones

```
GET    /api/v1/segments
GET    /api/v1/segments/{segment_id}
POST   /api/v1/segments
PUT    /api/v1/segments/{segment_id}
DELETE /api/v1/segments/{segment_id}
GET    /api/v1/segments/{segment_id}/patients
POST   /api/v1/segments/{segment_id}/patients
```

## 🤖 Automatizaciones

```
GET    /api/v1/automations
GET    /api/v1/automations/{automation_id}
POST   /api/v1/automations
PUT    /api/v1/automations/{automation_id}
DELETE /api/v1/automations/{automation_id}
POST   /api/v1/automations/{automation_id}/execute
GET    /api/v1/automations/{automation_id}/logs
```

## 💬 Chat

```
GET    /api/v1/chat/conversations
GET    /api/v1/chat/conversations/{conversation_id}
POST   /api/v1/chat/conversations
GET    /api/v1/chat/conversations/{conversation_id}/messages
POST   /api/v1/chat/conversations/{conversation_id}/messages
PUT    /api/v1/chat/messages/{message_id}/read
```

## 🎂 Cumpleaños

```
GET    /api/v1/birthdays/today
GET    /api/v1/birthdays/this-month
GET    /api/v1/birthdays/upcoming
POST   /api/v1/birthdays/{patient_id}/greeting
```

## 📈 Reportes y Estadísticas

```
GET    /api/v1/reports/dashboard
GET    /api/v1/reports/productivity
GET    /api/v1/reports/financial
GET    /api/v1/reports/patients
GET    /api/v1/reports/appointments
GET    /api/v1/reports/inventory
GET    /api/v1/statistics/clinic
GET    /api/v1/statistics/doctor/{doctor_id}
```

## ⚙️ Configuración

```
GET    /api/v1/config
PUT    /api/v1/config
GET    /api/v1/config/{key}
PUT    /api/v1/config/{key}
GET    /api/v1/specialties
POST   /api/v1/specialties
GET    /api/v1/treatments
POST   /api/v1/treatments
GET    /api/v1/sources
POST   /api/v1/sources
GET    /api/v1/insurers
POST   /api/v1/insurers
GET    /api/v1/business-lines
POST   /api/v1/business-lines
```

## 📋 Ejemplos de Estructura de Datos

### Login Request/Response
```json
// POST /api/v1/auth/login
{
  "username": "dr.gomez",
  "password": "password123"
}

// Response
{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "token_type": "bearer",
  "expires_in": 3600,
  "user": {
    "id": 1,
    "username": "dr.gomez",
    "email": "c.gomez@consultorio.com",
    "role": "Doctor",
    "full_name": "Carlos Gómez"
  }
}
```

### Paciente
```json
{
  "id": 1,
  "nombres": "Ana",
  "apellidos": "López García",
  "dni": "12345678A",
  "telefono": "555-1234",
  "email": "ana@email.com",
  "fecha_nacimiento": "1990-05-15",
  "genero": "F",
  "direccion": "Calle Falsa 123",
  "estado_paciente": "activo",
  "fuente_captacion": "Facebook",
  "aseguradora": "AUNA",
  "linea_negocio": "Ortodoncia",
  "presupuesto": 500.00,
  "ultima_cita": "2024-01-15",
  "proxima_cita": "2024-02-15",
  "total_citas": 5,
  "citas_realizadas": 4
}
```

### Cita Médica
```json
{
  "id": 1,
  "paciente": {
    "id": 1,
    "nombres": "Ana",
    "apellidos": "López García",
    "telefono": "555-1234"
  },
  "doctor": {
    "id": 1,
    "nombres": "Carlos",
    "apellidos": "Gómez"
  },
  "fecha_hora": "2024-01-15T10:00:00Z",
  "duracion_minutos": 60,
  "motivo_consulta": "Revisión y limpieza anual",
  "estado": "Programada",
  "telefono_contacto": "555-1234",
  "email_contacto": "ana@email.com",
  "recordatorio_enviado": false
}
```

### Transacción Financiera
```json
{
  "id": 1,
  "tipo_transaccion": "ingreso",
  "doctor": {
    "id": 1,
    "nombres": "Carlos",
    "apellidos": "Gómez"
  },
  "paciente": {
    "id": 1,
    "nombres": "Ana",
    "apellidos": "López García"
  },
  "concepto": "Consulta general",
  "monto": 80.00,
  "medio_pago": "Efectivo",
  "fecha_transaccion": "2024-01-15T10:30:00Z",
  "comentario": "Pago completo",
  "estado": "completado"
}
```

## 🔧 Configuración CORS

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## 📝 Notas Importantes

1. **Autenticación**: Usar JWT tokens con expiración
2. **Validación**: Implementar validación de datos con Pydantic
3. **Paginación**: Implementar paginación para listas largas
4. **Filtros**: Permitir filtros por fecha, doctor, estado, etc.
5. **Búsqueda**: Implementar búsqueda en pacientes y citas
6. **Logs**: Registrar todas las operaciones importantes
7. **Errores**: Manejar errores de forma consistente
8. **Documentación**: Usar FastAPI docs automáticos

## 🚀 Orden de Implementación Sugerido

1. **Autenticación** - Base para todo el sistema
2. **Usuarios y Doctores** - Gestión de personal
3. **Pacientes** - Gestión de pacientes
4. **Citas Médicas** - Funcionalidad principal
5. **Transacciones** - Módulo de caja
6. **Inventario** - Gestión de productos
7. **Reportes** - Estadísticas y análisis
8. **Marketing** - Campañas y segmentaciones
9. **Chat** - Comunicación interna
10. **Configuración** - Ajustes del sistema
