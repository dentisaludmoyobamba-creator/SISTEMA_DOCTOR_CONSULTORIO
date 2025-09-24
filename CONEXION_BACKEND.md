# Conexión del Frontend React con Backend FastAPI

Este documento explica cómo conectar tu aplicación React con el backend de FastAPI.

## 📋 Resumen de Cambios Realizados

### 1. Dependencias Instaladas
- **axios**: Para realizar peticiones HTTP al backend

### 2. Archivos Creados

#### Configuración
- `src/config/api.js` - Configuración de la API y endpoints
- `src/services/apiClient.js` - Cliente HTTP con interceptores

#### Servicios
- `src/services/authService.js` - Servicio de autenticación
- `src/services/doctorsService.js` - Servicio de doctores
- `src/services/patientsService.js` - Servicio de pacientes
- `src/services/appointmentsService.js` - Servicio de citas
- `src/services/transactionsService.js` - Servicio de transacciones
- `src/services/index.js` - Exportaciones centralizadas

#### Hooks
- `src/hooks/useAuth.js` - Hook personalizado para autenticación

#### Componentes Actualizados
- `src/components/Login.jsx` - Login conectado al backend
- `src/pages/AgendaBackend.jsx` - Ejemplo de página conectada al backend

## 🔧 Configuración del Backend

### Variables de Entorno
Crea un archivo `.env.local` en la raíz del proyecto:

```env
# Configuración del Backend FastAPI
REACT_APP_API_BASE_URL=http://127.0.0.1:8000
REACT_APP_API_VERSION=v1

# Configuración de desarrollo
REACT_APP_ENVIRONMENT=development
```

### Estructura de Endpoints Esperada en FastAPI

Tu backend de FastAPI debe tener los siguientes endpoints:

```
POST /api/v1/auth/login
POST /api/v1/auth/logout
POST /api/v1/auth/refresh
GET  /api/v1/auth/profile

GET  /api/v1/doctors
GET  /api/v1/doctors/{id}
POST /api/v1/doctors
PUT  /api/v1/doctors/{id}
DELETE /api/v1/doctors/{id}

GET  /api/v1/patients
GET  /api/v1/patients/{id}
POST /api/v1/patients
PUT  /api/v1/patients/{id}
DELETE /api/v1/patients/{id}

GET  /api/v1/appointments
GET  /api/v1/appointments/{id}
POST /api/v1/appointments
PUT  /api/v1/appointments/{id}
DELETE /api/v1/appointments/{id}
PATCH /api/v1/appointments/{id}/status

GET  /api/v1/transactions
GET  /api/v1/transactions/{id}
POST /api/v1/transactions
PUT  /api/v1/transactions/{id}
DELETE /api/v1/transactions/{id}
```

## 🚀 Cómo Usar los Servicios

### 1. Autenticación

```javascript
import { authService } from './services';

// Login
const response = await authService.login({
  username: 'usuario',
  password: 'contraseña'
});

// Logout
await authService.logout();

// Obtener perfil
const profile = await authService.getProfile();
```

### 2. Citas

```javascript
import { appointmentsService } from './services';

// Obtener todas las citas
const citas = await appointmentsService.getAppointments();

// Crear nueva cita
const nuevaCita = await appointmentsService.createAppointment({
  paciente: 'Juan Pérez',
  doctorId: 1,
  fecha: '2024-01-15',
  hora: '10:00',
  duracion: 60,
  motivo: 'Consulta general'
});

// Actualizar estado de cita
await appointmentsService.updateAppointmentStatus(1, 'confirmado');
```

### 3. Pacientes

```javascript
import { patientsService } from './services';

// Obtener todos los pacientes
const pacientes = await patientsService.getPatients();

// Buscar pacientes
const resultados = await patientsService.searchPatients('Juan');

// Crear nuevo paciente
const nuevoPaciente = await patientsService.createPatient({
  nombre: 'Juan',
  apellido: 'Pérez',
  documento: '12345678',
  telefono: '999-123-456',
  email: 'juan@email.com'
});
```

## 🔄 Migración de Componentes

### Antes (usando datos mock):
```javascript
import { citas } from '../data/mockData';

const [citas, setCitas] = useState(citas);
```

### Después (usando backend):
```javascript
import { appointmentsService } from '../services';

const [citas, setCitas] = useState([]);

useEffect(() => {
  const loadCitas = async () => {
    try {
      const data = await appointmentsService.getAppointments();
      setCitas(data);
    } catch (error) {
      console.error('Error cargando citas:', error);
    }
  };
  
  loadCitas();
}, []);
```

## 🛠️ Pasos para Completar la Migración

### 1. Configurar Variables de Entorno
```bash
# Crear archivo .env.local
echo "REACT_APP_API_BASE_URL=http://127.0.0.1:8000/" > .env.local
echo "REACT_APP_API_VERSION=v1" >> .env.local
```

### 2. Actualizar App.js para usar el hook de autenticación
```javascript
import { useAuth } from './hooks/useAuth';

function AppContent() {
  const { user, isAuthenticated, isLoading, login, logout } = useAuth();
  
  // ... resto del código
}
```

### 3. Migrar cada página gradualmente
- Comienza con `Agenda.jsx` → `AgendaBackend.jsx`
- Luego `Pacientes.jsx`
- Después `Caja.jsx`
- Y así sucesivamente

### 4. Manejo de Errores
Todos los servicios incluyen manejo de errores. Los errores comunes son:
- **401**: Token expirado o inválido
- **422**: Datos de entrada inválidos
- **Network Error**: Backend no disponible

## 🔐 Autenticación

El sistema maneja automáticamente:
- Almacenamiento del token JWT
- Envío del token en cada petición
- Redirección al login si el token expira
- Limpieza de datos al cerrar sesión

## 📝 Notas Importantes

1. **CORS**: Asegúrate de que tu backend FastAPI tenga configurado CORS para permitir peticiones desde `http://localhost:3000`

2. **Formato de Datos**: Los servicios esperan que el backend devuelva datos en formato JSON estándar

3. **Manejo de Estados**: Usa estados de carga y error para mejorar la experiencia del usuario

4. **Validación**: Implementa validación tanto en frontend como backend

## 🐛 Solución de Problemas

### Error de CORS
```python
# En tu FastAPI backend
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Error de Conexión
- Verifica que el backend esté ejecutándose en `http://localhost:8000`
- Revisa la consola del navegador para errores de red
- Confirma que las variables de entorno estén configuradas correctamente

### Token Expirado
El sistema maneja automáticamente los tokens expirados redirigiendo al login.

## 📞 Soporte

Si tienes problemas con la conexión:
1. Revisa la consola del navegador
2. Verifica que el backend esté ejecutándose
3. Confirma que los endpoints coincidan con la documentación
4. Revisa la configuración de CORS en el backend
