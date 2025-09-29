# Guía de Implementación de Autenticación - Sistema Denti Salud

## 📋 Resumen de Implementación

Se han implementado exitosamente las funcionalidades de **Login** y **Mi Perfil** para el sistema de consultorio dental, incluyendo:

- ✅ Backend con Google Cloud Functions y PostgreSQL
- ✅ Frontend con React y autenticación JWT
- ✅ Componentes de Login y Perfil de Usuario
- ✅ Integración completa con el sistema existente

## 🚀 URLs de la API

**Endpoint base:** `https://usuarios-1090334808863.us-central1.run.app`

### Endpoints disponibles:

#### 1. Login de Usuario
- **URL:** `POST /usuarios?action=login`
- **Body:**
```json
{
  "username": "nombre_usuario_o_email",
  "password": "contraseña"
}
```
- **Respuesta exitosa:**
```json
{
  "success": true,
  "message": "Login exitoso",
  "token": "jwt_token_here",
  "user": {
    "id": 1,
    "username": "dr.gomez",
    "email": "c.gomez@consultorio.com",
    "role": "Doctor",
    "role_description": "Acceso a historias clínicas y agenda propia",
    "is_doctor": true,
    "doctor_info": {
      "id": 1,
      "nombres": "Carlos",
      "apellidos": "Gómez"
    }
  }
}
```

#### 2. Obtener Perfil
- **URL:** `GET /usuarios?action=profile`
- **Headers:** `Authorization: Bearer <token>`
- **Respuesta exitosa:**
```json
{
  "success": true,
  "user": {
    "id": 1,
    "username": "dr.gomez",
    "email": "c.gomez@consultorio.com",
    "role": "Doctor",
    "active": true,
    "last_login": "2024-09-29T10:30:00Z",
    "created_at": "2024-09-01T08:00:00Z",
    "is_doctor": true,
    "doctor_info": {
      "id": 1,
      "nombres": "Carlos",
      "apellidos": "Gómez",
      "dni": "11223344D",
      "colegiatura": "OD-1020",
      "telefono": "555-1122"
    }
  }
}
```

#### 3. Actualizar Perfil
- **URL:** `PUT /usuarios?action=profile`
- **Headers:** `Authorization: Bearer <token>`
- **Body (campos opcionales):**
```json
{
  "email": "nuevo_email@consultorio.com",
  "password": "nueva_contraseña",
  "doctor_nombres": "Carlos Alberto",
  "doctor_apellidos": "Gómez Pérez",
  "doctor_telefono": "555-9999"
}
```

## 🛠️ Estructura del Backend

### Archivos principales:
- `gcp_cloud_functions/usuarios.py` - Cloud Function principal

### Funcionalidades implementadas:
1. **Autenticación JWT** - Tokens seguros con expiración de 24 horas
2. **Hash de contraseñas** - SHA-256 para seguridad
3. **Validación de tokens** - Verificación automática de validez
4. **Manejo de errores** - Respuestas consistentes y descriptivas
5. **CORS** - Configurado para el frontend

### Seguridad implementada:
- ✅ Hash SHA-256 para contraseñas
- ✅ Tokens JWT con expiración
- ✅ Validación de autenticación en cada request
- ✅ Headers CORS configurados
- ✅ Validación de datos de entrada

## 🎨 Estructura del Frontend

### Archivos principales:
- `src/services/authService.js` - Servicio de autenticación
- `src/components/Login.jsx` - Componente de login actualizado
- `src/components/ProfileModal.jsx` - Modal de perfil actualizado
- `src/App.js` - Integración con sistema de rutas

### Funcionalidades del Frontend:
1. **Autenticación automática** - Verificación de sesión al cargar
2. **Protección de rutas** - Redirección automática si no está autenticado
3. **Manejo de estados** - Loading, error y success states
4. **Persistencia de sesión** - LocalStorage para tokens
5. **Actualización en tiempo real** - Sincronización de datos del usuario

## 🔐 Datos de Prueba

### Usuarios existentes en la base de datos:

#### 1. Administrador
- **Usuario:** `admin`
- **Email:** `admin@consultorio.com`
- **Contraseña:** `admin123` (hash: calculado automáticamente)
- **Rol:** Administrador

#### 2. Doctor Carlos Gómez
- **Usuario:** `dr.gomez`
- **Email:** `c.gomez@consultorio.com`
- **Contraseña:** `doctor123` (hash: calculado automáticamente)
- **Rol:** Doctor

#### 3. Doctora Mariela Ávila
- **Usuario:** `dra.avila`
- **Email:** `m.avila@consultorio.com`
- **Contraseña:** `doctor123` (hash: calculado automáticamente)
- **Rol:** Doctor

#### 4. Recepcionista
- **Usuario:** `recepcion1`
- **Email:** `recepcion@consultorio.com`
- **Contraseña:** `recep123` (hash: calculado automáticamente)
- **Rol:** Recepcionista

### ⚠️ Nota sobre contraseñas:
Las contraseñas en la base de datos necesitan ser actualizadas con el hash SHA-256. Ejecutar estos queries:

```sql
-- Actualizar contraseñas con hash SHA-256
UPDATE usuarios SET contrasena_hash = encode(sha256('admin123'::bytea), 'hex') WHERE nombre_usuario = 'admin';
UPDATE usuarios SET contrasena_hash = encode(sha256('doctor123'::bytea), 'hex') WHERE nombre_usuario = 'dr.gomez';
UPDATE usuarios SET contrasena_hash = encode(sha256('doctor123'::bytea), 'hex') WHERE nombre_usuario = 'dra.avila';
UPDATE usuarios SET contrasena_hash = encode(sha256('recep123'::bytea), 'hex') WHERE nombre_usuario = 'recepcion1';
```

## 🚀 Cómo usar la implementación

### 1. En el Backend (Google Cloud Functions):
```bash
# Las funciones ya están desplegadas en:
# https://usuarios-1090334808863.us-central1.run.app

# Para probar la API:
curl -X POST https://usuarios-1090334808863.us-central1.run.app?action=login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "admin123"}'
```

### 2. En el Frontend:
```javascript
// El servicio está listo para usar
import authService from '../services/authService';

// Login
const result = await authService.login('admin', 'admin123');
if (result.success) {
  console.log('Usuario autenticado:', result.user);
}

// Obtener perfil
const profile = await authService.getProfile();
if (profile.success) {
  console.log('Datos del perfil:', profile.user);
}

// Actualizar perfil
const update = await authService.updateProfile({
  email: 'nuevo_email@consultorio.com'
});
```

### 3. Flujo de autenticación completo:
1. Usuario ingresa credenciales en Login
2. Frontend llama a authService.login()
3. Backend valida credenciales y retorna JWT
4. Frontend almacena token y datos de usuario
5. Usuario es redirigido al dashboard
6. En cada carga de página, se verifica el token
7. Si el token es válido, se obtiene perfil actualizado
8. Si es inválido, se redirige al login

## 🔧 Configuración Adicional

### Variables de Entorno recomendadas:
Para producción, mover estas configuraciones a variables de entorno:

```python
# En usuarios.py - reemplazar valores hardcodeados
JWT_SECRET = os.environ.get('JWT_SECRET', 'dental_clinic_secret_key_2024')
PGHOST = os.environ.get('PGHOST', 'ep-plain-mountain-aelv7gf4-pooler.c-2.us-east-2.aws.neon.tech')
PGPASSWORD = os.environ.get('PGPASSWORD', 'npg_qX6DcMlHk8vE')
```

### Headers CORS adicionales (si es necesario):
```python
headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,PUT,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type,Authorization",
    "Access-Control-Max-Age": "86400"
}
```

## 📝 Ejemplos de Uso en el Frontend

### Verificar si el usuario está autenticado:
```javascript
if (authService.isAuthenticated()) {
  console.log('Usuario autenticado');
  const user = authService.getCurrentUser();
  console.log('Usuario actual:', user);
}
```

### Verificar rol del usuario:
```javascript
if (authService.hasRole('Doctor')) {
  console.log('El usuario es doctor');
}

if (authService.isDoctor()) {
  console.log('Acceso a funcionalidades de doctor');
}
```

### Logout del usuario:
```javascript
authService.logout();
// Esto limpia el token y los datos del localStorage
```

## 🐛 Resolución de Problemas

### Error común: "CORS policy"
**Solución:** Verificar que el header Authorization esté incluido en CORS:
```python
"Access-Control-Allow-Headers": "Content-Type,Authorization"
```

### Error: "Token inválido o expirado"
**Solución:** El token JWT expira en 24 horas. El usuario debe volver a hacer login.

### Error: "Credenciales inválidas"
**Solución:** Verificar que las contraseñas en la base de datos estén hasheadas correctamente.

### Error de conexión
**Solución:** Verificar que el endpoint de Cloud Functions esté disponible y que no haya problemas de red.

## 📞 Soporte

Para dudas o problemas con la implementación:
1. Verificar logs de Cloud Functions en Google Cloud Console
2. Revisar Network tab en DevTools del navegador
3. Comprobar que la base de datos PostgreSQL esté accesible

---

✅ **Implementación completada exitosamente**  
📅 **Fecha:** Septiembre 2024  
👨‍💻 **Sistema:** Denti Salud - Consultorio Odontológico
