# 🚀 Guía de Despliegue - Vercel + Render

Esta guía te ayudará a desplegar tu aplicación React en Vercel y conectarla con tu backend FastAPI en Render.

## 📋 Prerequisitos

- ✅ Backend FastAPI funcionando localmente
- ✅ Frontend React funcionando localmente
- ✅ Cuentas en Vercel y Render

## 🔧 Configuración del Backend (Render)

### 1. Preparar el Backend para Render

Asegúrate de que tu `main.py` tenga la configuración de CORS correcta:

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",  # Para desarrollo local
        "https://tu-app-frontend.vercel.app",  # URL de tu app en Vercel
        "https://*.vercel.app",  # Para permitir cualquier subdominio de Vercel
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allow_headers=["*"],
)
```

### 2. Desplegar en Render

1. **Conecta tu repositorio** en Render
2. **Configura el servicio** como "Web Service"
3. **Establece el comando de build**: `pip install -r requirements.txt`
4. **Establece el comando de start**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
5. **Configura variables de entorno** si es necesario

### 3. Obtener la URL de Render

Una vez desplegado, Render te dará una URL como:
`https://tu-app-name.onrender.com`

**¡Guarda esta URL!** La necesitarás para configurar el frontend.

## 🎨 Configuración del Frontend (Vercel)

### 1. Actualizar la configuración

En `src/config/environments.js`, actualiza la URL de producción:

```javascript
production: {
  API_BASE_URL: 'https://tu-app-name.onrender.com', // ← Tu URL de Render
  API_VERSION: 'v1',
  DEBUG: false
}
```

### 2. Desplegar en Vercel

#### Opción A: Desde el Dashboard de Vercel

1. **Conecta tu repositorio** de GitHub
2. **Configura las variables de entorno**:
   - `REACT_APP_API_BASE_URL` = `https://tu-app-name.onrender.com`
   - `REACT_APP_API_VERSION` = `v1`
   - `REACT_APP_ENVIRONMENT` = `production`

#### Opción B: Usando Vercel CLI

```bash
# Instalar Vercel CLI
npm i -g vercel

# Login en Vercel
vercel login

# Desplegar
vercel --prod
```

### 3. Configurar Variables de Entorno en Vercel

En el dashboard de Vercel:
1. Ve a tu proyecto
2. **Settings** → **Environment Variables**
3. Agrega:

| Variable | Valor | Entorno |
|----------|-------|---------|
| `REACT_APP_API_BASE_URL` | `https://tu-app-name.onrender.com` | Production |
| `REACT_APP_API_VERSION` | `v1` | Production |
| `REACT_APP_ENVIRONMENT` | `production` | Production |

## 🔄 Actualizar CORS en Render

Una vez que tengas la URL de Vercel, actualiza el CORS en tu backend:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",  # Desarrollo local
        "https://tu-app-frontend.vercel.app",  # ← Tu URL de Vercel
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allow_headers=["*"],
)
```

## ✅ Verificación

### 1. Probar el Backend

```bash
curl https://tu-app-name.onrender.com/api/v1/auth/login \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"username": "dr.gomez", "password": "hash_doc1_pass"}'
```

### 2. Probar el Frontend

1. Abre tu app en Vercel
2. Intenta hacer login
3. Revisa la consola del navegador (F12) para ver los logs
4. Verifica que las peticiones vayan a la URL de Render

## 🐛 Solución de Problemas

### Error de CORS
- Verifica que la URL de Vercel esté en `allow_origins`
- Asegúrate de que el backend esté desplegado y funcionando

### Error de Conexión
- Verifica que la URL de Render sea correcta
- Revisa que las variables de entorno estén configuradas
- Comprueba los logs de Render y Vercel

### Error 401/403
- Verifica que los endpoints coincidan
- Revisa que la autenticación esté funcionando

## 📝 Notas Importantes

1. **Render puede tardar en iniciar**: El primer request puede ser lento
2. **HTTPS obligatorio**: Render y Vercel usan HTTPS por defecto
3. **Variables de entorno**: Nunca hardcodees URLs en el código
4. **Logs**: Usa los logs de ambas plataformas para debugging

## 🎉 ¡Listo!

Una vez completado este proceso, tu aplicación debería funcionar perfectamente en producción con:
- ✅ Frontend en Vercel
- ✅ Backend en Render
- ✅ Comunicación exitosa entre ambos
