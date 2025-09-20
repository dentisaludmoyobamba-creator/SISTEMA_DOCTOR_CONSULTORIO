# Denti Salud - Sistema Odontológico

Aplicación web moderna para la gestión de consultorios odontológicos. Sistema completo desarrollado con React y TailwindCSS.!!

## 🚀 Características Principales

### ✅ Implementado
- **Sistema de Autenticación**: Login seguro con persistencia de sesión
- **Agenda Médica Interactiva**: Vista semanal con calendario por horas
- **Gestión de Citas**: Crear, editar, eliminar y ver detalles de citas
- **Filtros Avanzados**: Por doctor, estado de cita y vista temporal
- **Panel de Doctores**: Gestión visual de profesionales con códigos de color
- **Gestión de Pacientes**: Lista completa con búsqueda, filtros y etiquetas
- **Sistema de Caja**: Control de ingresos, egresos y balance financiero
- **Interfaz Responsiva**: Diseño adaptativo para desktop y móvil
- **Modales Interactivos**: Formularios para creación y edición de citas

### 🔄 En Desarrollo
- Marketing y Campañas
- Productividad y Reportes
- Inventario Médico
- Laboratorio
- Chat Interno

## 🛠️ Tecnologías Utilizadas

- **React 18**: Framework de JavaScript
- **TailwindCSS 3**: Framework de CSS utilitario
- **React Router DOM**: Navegación SPA
- **Datos Mock**: Simulación de backend para desarrollo

## 📁 Estructura del Proyecto

```
src/
├── components/          # Componentes reutilizables
│   ├── Navbar.jsx      # Barra de navegación principal
│   ├── Sidebar.jsx     # Panel lateral con filtros
│   ├── CalendarGrid.jsx # Rejilla del calendario
│   ├── AppointmentCard.jsx # Tarjeta de cita
│   ├── AppointmentModal.jsx # Modal crear/editar cita
│   └── DetailsModal.jsx # Modal detalles de cita
├── pages/              # Páginas principales
│   ├── Agenda.jsx      # Vista principal de agenda
│   ├── Pacientes.jsx   # Gestión completa de pacientes
│   ├── Caja.jsx        # Sistema de caja e ingresos/egresos
│   ├── Marketing.jsx   # Módulo de marketing (placeholder)
│   ├── Productividad.jsx # Reportes de productividad (placeholder)
│   ├── Inventario.jsx  # Control de inventario (placeholder)
│   ├── Laboratorio.jsx # Gestión de laboratorio (placeholder)
│   └── Chat.jsx        # Sistema de chat (placeholder)
├── data/               # Datos de prueba
│   └── mockData.js     # Datos mock para desarrollo
├── App.js              # Componente raíz
├── index.js            # Punto de entrada
└── index.css           # Estilos globales
```

## 🚀 Instalación y Uso

1. **Instalar dependencias:**
   ```bash
   npm install
   ```

2. **Ejecutar en modo desarrollo:**
   ```bash
   npm run dev
   ```

3. **Construir para producción:**
   ```bash
   npm run build
   ```

## 📋 Funcionalidades de la Agenda

### Vista de Calendario
- **Semana Completa**: Lunes a Sábado, 9:00 AM - 8:00 PM
- **Bloques por Hora**: Cada hora representa un slot disponible
- **Citas Visuales**: Tarjetas con códigos de color por doctor

### Gestión de Citas
- **Crear Nueva**: Click en slot vacío o botón "Nueva Cita"
- **Editar Existente**: Click en botón editar de la cita
- **Ver Detalles**: Click en la cita para ver información completa
- **Eliminar**: Confirmación antes de eliminar citas

### Filtros y Organización
- **Por Doctor**: Ver citas de un doctor específico
- **Por Estado**: Filtrar por confirmado, pendiente, cancelado
- **Vista Temporal**: Cambiar entre semana, día, mes (próximamente)

## 🎨 Diseño y UX

### Paleta de Colores
- **Primario**: Azul (#3B82F6) - Eduardo Carmin
- **Secundario**: Rojo (#EF4444) - Especialistas
- **Éxito**: Verde (#10B981) - Estados confirmados
- **Advertencia**: Amarillo (#F59E0B) - Estados pendientes
- **Error**: Rojo (#EF4444) - Estados cancelados

### Componentes Reutilizables
- Tarjetas con sombras suaves
- Botones con estados hover/focus
- Modales con animaciones
- Formularios con validación visual
- Iconos SVG integrados

## 📱 Responsividad

- **Desktop**: Experiencia completa con sidebar
- **Tablet**: Vista adaptada con navegación colapsable
- **Móvil**: Scroll horizontal para calendario, navegación en pestañas

## 🔐 **Acceso al Sistema**

**Credenciales de Login:**
- **Usuario:** Cualquier texto (ej: admin, doctor, etc.)
- **Contraseña:** Cualquier texto (ej: 123, password, etc.)

El sistema acepta cualquier combinación de usuario y contraseña para acceder. Los datos se guardan en localStorage para mantener la sesión activa.

## 🔮 Próximas Funcionalidades

1. **Backend Integration**: Conexión con API REST
2. **Autenticación Avanzada**: Roles y permisos específicos
3. **Notificaciones**: Sistema de alertas en tiempo real
4. **Reportes**: Dashboard con métricas y estadísticas
5. **Exportación**: PDF de citas y reportes
6. **Calendario Múltiple**: Vista de múltiples doctores simultáneamente

## 👥 Contribución

Este proyecto está en desarrollo activo. Las contribuciones son bienvenidas siguiendo las mejores prácticas de React y TailwindCSS.

---

**Denti Salud - Sistema Odontológico**  
*Sistema moderno de gestión para consultorios odontológicos*
