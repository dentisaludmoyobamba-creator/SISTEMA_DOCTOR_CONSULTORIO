-- =====================================================================
-- || SCRIPT CONSOLIDADO - CONSULTORIO DENTI SALUD ||
-- =====================================================================
-- Este script contiene la creación inicial de la base de datos,
-- la inserción de datos, y todas las mejoras, nuevas tablas,
-- índices, triggers, funciones y vistas.
-- =====================================================================


-- =====================================================
-- 1. CREACIÓN DE LA BASE DE DATOS Y TABLAS PRINCIPALES
-- =====================================================

[cite_start]-- CREACIÓN DE LA BASE DE DATOS [cite: 1]
CREATE DATABASE CONSULTORIO_DENTI_SALUD;

[cite_start]-- Tabla de Roles de Usuario [cite: 1]
CREATE TABLE roles (
    id_rol SERIAL PRIMARY KEY,
    nombre_rol VARCHAR(50) UNIQUE NOT NULL,
    descripcion TEXT,
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

[cite_start]-- Tabla de Usuarios del Sistema [cite: 2]
CREATE TABLE usuarios (
    id_usuario SERIAL PRIMARY KEY,
    nombre_usuario VARCHAR(50) UNIQUE NOT NULL,
    contrasena_hash VARCHAR(255) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    id_rol INTEGER NOT NULL,
    activo BOOLEAN DEFAULT TRUE,
    ultimo_login TIMESTAMP WITH TIME ZONE,
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_rol) REFERENCES roles(id_rol)
);

[cite_start]-- Tabla de Pacientes [cite: 3]
CREATE TABLE pacientes (
    id_paciente SERIAL PRIMARY KEY,
    nombres VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    fecha_nacimiento DATE NOT NULL,
    genero CHAR(1),
    dni VARCHAR(15) UNIQUE,
    telefono VARCHAR(20),
    direccion VARCHAR(255),
    fecha_registro TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

[cite_start]-- Tabla de Especialidades Médicas [cite: 5]
CREATE TABLE especialidades (
    id_especialidad SERIAL PRIMARY KEY,
    nombre_especialidad VARCHAR(100) UNIQUE NOT NULL,
    descripcion TEXT
);

[cite_start]-- Tabla de Doctores [cite: 6]
CREATE TABLE doctores (
    id_doctor SERIAL PRIMARY KEY,
    nombres VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    dni VARCHAR(15) UNIQUE NOT NULL,
    colegiatura VARCHAR(20) UNIQUE NOT NULL,
    telefono VARCHAR(20),
    id_usuario INTEGER UNIQUE NOT NULL,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)
);

[cite_start]-- Tabla de Relación entre Doctores y Especialidades [cite: 7]
CREATE TABLE doctor_especialidad (
    id_doctor_especialidad SERIAL PRIMARY KEY,
    id_doctor INTEGER NOT NULL,
    id_especialidad INTEGER NOT NULL,
    UNIQUE (id_doctor, id_especialidad),
    FOREIGN KEY (id_doctor) REFERENCES doctores(id_doctor) ON DELETE CASCADE,
    FOREIGN KEY (id_especialidad) REFERENCES especialidades(id_especialidad) ON DELETE CASCADE
);

[cite_start]-- Tabla de Citas Médicas [cite: 8]
CREATE TABLE citas_medicas (
    id_cita SERIAL PRIMARY KEY,
    id_paciente INTEGER NOT NULL,
    id_doctor INTEGER NOT NULL,
    fecha_hora TIMESTAMP WITH TIME ZONE NOT NULL,
    motivo_consulta TEXT,
    estado VARCHAR(20) NOT NULL DEFAULT 'Programada',
    notas_recepcion TEXT,
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_paciente) REFERENCES pacientes(id_paciente),
    FOREIGN KEY (id_doctor) REFERENCES doctores(id_doctor)
);

[cite_start]-- Tabla de Tratamientos [cite: 9]
CREATE TABLE tratamientos (
    id_tratamiento SERIAL PRIMARY KEY,
    nombre_tratamiento VARCHAR(150) UNIQUE NOT NULL,
    descripcion TEXT,
    costo_base NUMERIC(10, 2) NOT NULL
);

[cite_start]-- Tabla de Historial Clínico [cite: 10]
CREATE TABLE historial_clinico (
    id_historial SERIAL PRIMARY KEY,
    id_cita INTEGER UNIQUE NOT NULL,
    id_paciente INTEGER NOT NULL,
    id_doctor INTEGER NOT NULL,
    diagnostico TEXT NOT NULL,
    observaciones TEXT,
    fecha_registro TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_cita) REFERENCES citas_medicas(id_cita),
    FOREIGN KEY (id_paciente) REFERENCES pacientes(id_paciente),
    FOREIGN KEY (id_doctor) REFERENCES doctores(id_doctor)
);

[cite_start]-- Tabla de Tratamientos en el Historial [cite: 11]
CREATE TABLE historial_tratamientos (
    id_historial_tratamiento SERIAL PRIMARY KEY,
    id_historial INTEGER NOT NULL,
    id_tratamiento INTEGER NOT NULL,
    costo_final NUMERIC(10, 2) NOT NULL,
    notas_tratamiento TEXT,
    FOREIGN KEY (id_historial) REFERENCES historial_clinico(id_historial) ON DELETE CASCADE,
    FOREIGN KEY (id_tratamiento) REFERENCES tratamientos(id_tratamiento)
);

[cite_start]-- Tabla de Productos e Inventario [cite: 12]
CREATE TABLE productos (
    id_producto SERIAL PRIMARY KEY,
    nombre_producto VARCHAR(150) NOT NULL,
    descripcion TEXT,
    stock INTEGER NOT NULL DEFAULT 0,
    proveedor VARCHAR(100),
    stock_minimo INTEGER NOT NULL DEFAULT 0,
    costo_unitario NUMERIC(10, 2)
);

[cite_start]-- Tabla de Facturas [cite: 13]
CREATE TABLE facturas (
    id_factura SERIAL PRIMARY KEY,
    id_cita INTEGER NOT NULL,
    id_paciente INTEGER NOT NULL,
    fecha_emision TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    monto_total NUMERIC(10, 2) NOT NULL,
    monto_pagado NUMERIC(10, 2) DEFAULT 0.00,
    estado_factura VARCHAR(20) NOT NULL DEFAULT 'Pendiente',
    FOREIGN KEY (id_cita) REFERENCES citas_medicas(id_cita),
    FOREIGN KEY (id_paciente) REFERENCES pacientes(id_paciente)
);

[cite_start]-- Tabla de Detalle de Facturas [cite: 14]
CREATE TABLE detalle_factura (
    id_detalle SERIAL PRIMARY KEY,
    id_factura INTEGER NOT NULL,
    id_tratamiento INTEGER,
    id_producto INTEGER,
    descripcion_item VARCHAR(255) NOT NULL,
    cantidad INTEGER NOT NULL DEFAULT 1,
    precio_unitario NUMERIC(10, 2) NOT NULL,
    subtotal NUMERIC(10, 2) NOT NULL,
    FOREIGN KEY (id_factura) REFERENCES facturas(id_factura) ON DELETE CASCADE,
    FOREIGN KEY (id_tratamiento) REFERENCES tratamientos(id_tratamiento),
    FOREIGN KEY (id_producto) REFERENCES productos(id_producto)
);

[cite_start]-- Tabla de Pagos [cite: 15]
CREATE TABLE pagos (
    id_pago SERIAL PRIMARY KEY,
    id_factura INTEGER NOT NULL,
    monto_pago NUMERIC(10, 2) NOT NULL,
    metodo_pago VARCHAR(50),
    fecha_pago TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    referencia_pago VARCHAR(100),
    FOREIGN KEY (id_factura) REFERENCES facturas(id_factura)
);

[cite_start]-- Tablas adicionales para segmentación de pacientes [cite: 33]
CREATE TABLE fuente_captacion (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50),
    estado CHAR(1) DEFAULT '1'
);

CREATE TABLE aseguradora (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50),
    estado CHAR(1) DEFAULT '1'
);

CREATE TABLE linea_negocio ( -- Corregido "estadi" por "estado"
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50),
    estado CHAR(1) DEFAULT '1'
);


-- =====================================================
-- 2. MODIFICACIONES Y MEJORAS A TABLAS EXISTENTES
-- =====================================================

[cite_start]-- Añadir campos de notas y alergias a pacientes [cite: 4]
ALTER TABLE pacientes
ADD COLUMN notas TEXT,
ADD COLUMN alergias TEXT;

[cite_start]-- Añadir nuevos campos a la tabla pacientes para CRM [cite: 39]
ALTER TABLE pacientes
ADD COLUMN email VARCHAR(100),
ADD COLUMN id_fuente_captacion INTEGER,
ADD COLUMN id_aseguradora INTEGER,
ADD COLUMN id_linea_negocio INTEGER,
ADD COLUMN presupuesto NUMERIC(10,2) DEFAULT 0,
ADD COLUMN proxima_cita DATE,
ADD COLUMN ultima_cita DATE,
ADD COLUMN tarea TEXT,
ADD COLUMN comentario TEXT,
ADD COLUMN estado_paciente VARCHAR(20) DEFAULT 'activo',
ADD COLUMN avatar VARCHAR(10),
ADD COLUMN etiqueta VARCHAR(20),
ADD COLUMN etiqueta_color VARCHAR(50),
ADD COLUMN foto_perfil_url VARCHAR(500);

-- Agregar las foreign keys correspondientes a la tabla pacientes
ALTER TABLE pacientes
[cite_start]ADD CONSTRAINT fk_paciente_fuente_captacion FOREIGN KEY (id_fuente_captacion) REFERENCES fuente_captacion(id); [cite: 40]
ALTER TABLE pacientes
[cite_start]ADD CONSTRAINT fk_paciente_aseguradora FOREIGN KEY (id_aseguradora) REFERENCES aseguradora(id); [cite: 41]
ALTER TABLE pacientes
[cite_start]ADD CONSTRAINT fk_paciente_linea_negocio FOREIGN KEY (id_linea_negocio) REFERENCES linea_negocio(id); [cite: 42]

[cite_start]-- Mejorar la tabla de citas médicas con campos adicionales [cite: 43]
ALTER TABLE citas_medicas
ADD COLUMN IF NOT EXISTS duracion_minutos INTEGER DEFAULT 60,
ADD COLUMN IF NOT EXISTS telefono_contacto VARCHAR(20),
ADD COLUMN IF NOT EXISTS email_contacto VARCHAR(100),
ADD COLUMN IF NOT EXISTS recordatorio_enviado BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS fecha_recordatorio TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS motivo_cancelacion TEXT,
ADD COLUMN IF NOT EXISTS fecha_cancelacion TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS id_usuario_cancelo INTEGER;

[cite_start]-- Agregar la foreign key para el usuario que cancela una cita [cite: 44]
ALTER TABLE citas_medicas
ADD CONSTRAINT fk_cita_usuario_cancelo FOREIGN KEY (id_usuario_cancelo) REFERENCES usuarios(id_usuario);


-- =====================================================
-- 3. CREACIÓN DE NUEVAS TABLAS
-- =====================================================

-- Tabla de etiquetas para pacientes (catálogo)
CREATE TABLE etiquetas_paciente (
    id_etiqueta SERIAL PRIMARY KEY,
    nombre VARCHAR(50) UNIQUE NOT NULL,
    color VARCHAR(50) NOT NULL,
    descripcion TEXT,
    activa BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de relación muchos-a-muchos entre pacientes y etiquetas
CREATE TABLE paciente_etiquetas (
    id_paciente_etiqueta SERIAL PRIMARY KEY,
    id_paciente INTEGER NOT NULL,
    id_etiqueta INTEGER NOT NULL,
    fecha_asignacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (id_paciente, id_etiqueta),
    FOREIGN KEY (id_paciente) REFERENCES pacientes(id_paciente) ON DELETE CASCADE,
    FOREIGN KEY (id_etiqueta) REFERENCES etiquetas_paciente(id_etiqueta) ON DELETE CASCADE
);

[cite_start]-- Tabla para horarios de los doctores [cite: 45]
CREATE TABLE horarios_doctor (
    id_horario SERIAL PRIMARY KEY,
    id_doctor INTEGER NOT NULL,
    dia_semana INTEGER NOT NULL, -- 1=Lunes, 7=Domingo
    hora_inicio TIME NOT NULL,
    hora_fin TIME NOT NULL,
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_doctor) REFERENCES doctores(id_doctor) ON DELETE CASCADE
);

[cite_start]-- Tabla para días no laborables (feriados, vacaciones) [cite: 46]
CREATE TABLE dias_no_laborables (
    id_dia_no_laborable SERIAL PRIMARY KEY,
    fecha DATE NOT NULL,
    motivo VARCHAR(100) NOT NULL,
    aplica_todos_doctores BOOLEAN DEFAULT TRUE,
    id_doctor INTEGER,
    activo BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (id_doctor) REFERENCES doctores(id_doctor) ON DELETE CASCADE
);

[cite_start]-- Tabla para el envío de recordatorios [cite: 47]
CREATE TABLE recordatorios (
    id_recordatorio SERIAL PRIMARY KEY,
    id_cita INTEGER NOT NULL,
    tipo_recordatorio VARCHAR(20) NOT NULL, -- 'email', 'sms', 'whatsapp'
    fecha_envio TIMESTAMP WITH TIME ZONE,
    estado VARCHAR(20) DEFAULT 'pendiente',
    mensaje TEXT,
    respuesta TEXT,
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_cita) REFERENCES citas_medicas(id_cita) ON DELETE CASCADE
);

[cite_start]-- Tabla para transacciones financieras (Módulo de Caja) [cite: 48, 49]
CREATE TABLE transacciones_financieras (
    id_transaccion SERIAL PRIMARY KEY,
    tipo_transaccion VARCHAR(20) NOT NULL, -- 'ingreso', 'egreso'
    id_doctor INTEGER,
    id_paciente INTEGER,
    concepto VARCHAR(255) NOT NULL,
    monto NUMERIC(10,2) NOT NULL,
    medio_pago VARCHAR(50),
    referencia_pago VARCHAR(100),
    fecha_transaccion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    id_usuario_registro INTEGER NOT NULL,
    comentario TEXT,
    estado VARCHAR(20) DEFAULT 'completado',
    FOREIGN KEY (id_doctor) REFERENCES doctores(id_doctor),
    FOREIGN KEY (id_paciente) REFERENCES pacientes(id_paciente),
    FOREIGN KEY (id_usuario_registro) REFERENCES usuarios(id_usuario)
);

[cite_start]-- Tabla para movimientos de inventario [cite: 50]
CREATE TABLE movimientos_inventario (
    id_movimiento SERIAL PRIMARY KEY,
    id_producto INTEGER NOT NULL,
    tipo_movimiento VARCHAR(20) NOT NULL, -- 'entrada', 'salida', 'ajuste'
    cantidad INTEGER NOT NULL,
    motivo VARCHAR(255),
    id_usuario INTEGER NOT NULL,
    fecha_movimiento TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    costo_unitario NUMERIC(10,2),
    proveedor VARCHAR(100),
    numero_factura VARCHAR(50),
    FOREIGN KEY (id_producto) REFERENCES productos(id_producto),
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)
);

-- Tabla para órdenes de compra (Inventario - Compras)
CREATE TABLE ordenes_compra (
    id_orden SERIAL PRIMARY KEY,
    nombre_interno VARCHAR(100) NOT NULL,
    proveedor VARCHAR(100),
    estado VARCHAR(50) NOT NULL DEFAULT 'Orden ingresada a almacén',
    monto_total NUMERIC(10,2) DEFAULT 0,
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    fecha_entrega TIMESTAMP WITH TIME ZONE,
    fecha_pago TIMESTAMP WITH TIME ZONE,
    nota_interna TEXT
);

-- Tabla para consumos de inventario (descuenta stock)
CREATE TABLE consumos (
    id_consumo SERIAL PRIMARY KEY,
    id_producto INTEGER NOT NULL,
    fuente VARCHAR(50),
    tipo VARCHAR(50),
    lote VARCHAR(50),
    cantidad NUMERIC(10,2) NOT NULL,
    almacen VARCHAR(50) NOT NULL DEFAULT 'Principal',
    paciente VARCHAR(150),
    servicio VARCHAR(150),
    comentario TEXT,
    estado VARCHAR(20) NOT NULL DEFAULT 'Confirmada',
    fecha_consumo TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_producto) REFERENCES productos(id_producto)
);

[cite_start]-- Tabla para campañas de marketing [cite: 51]
CREATE TABLE campanas_marketing (
    id_campana SERIAL PRIMARY KEY,
    nombre_campana VARCHAR(100) NOT NULL,
    descripcion TEXT,
    tipo_campana VARCHAR(50) NOT NULL,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE,
    presupuesto NUMERIC(10,2),
    estado VARCHAR(20) DEFAULT 'activa',
    id_usuario_creador INTEGER NOT NULL,
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario_creador) REFERENCES usuarios(id_usuario)
);

[cite_start]-- Tabla para segmentación de pacientes [cite: 52]
CREATE TABLE segmentaciones (
    id_segmentacion SERIAL PRIMARY KEY,
    nombre_segmentacion VARCHAR(100) NOT NULL,
    descripcion TEXT,
    criterios JSONB,
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    id_usuario_creador INTEGER NOT NULL,
    activa BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (id_usuario_creador) REFERENCES usuarios(id_usuario)
);

[cite_start]-- Tabla para automatizaciones [cite: 53]
CREATE TABLE automatizaciones (
    id_automatizacion SERIAL PRIMARY KEY,
    nombre_automatizacion VARCHAR(100) NOT NULL,
    descripcion TEXT,
    tipo_automatizacion VARCHAR(50) NOT NULL,
    condiciones JSONB,
    acciones JSONB,
    activa BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    id_usuario_creador INTEGER NOT NULL,
    FOREIGN KEY (id_usuario_creador) REFERENCES usuarios(id_usuario)
);

[cite_start]-- Tabla para chat interno [cite: 54]
CREATE TABLE mensajes_chat (
    id_mensaje SERIAL PRIMARY KEY,
    id_remitente INTEGER NOT NULL,
    id_destinatario INTEGER,
    id_grupo INTEGER,
    tipo_mensaje VARCHAR(20) DEFAULT 'texto',
    contenido TEXT NOT NULL,
    archivo_url VARCHAR(255),
    leido BOOLEAN DEFAULT FALSE,
    fecha_envio TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    fecha_lectura TIMESTAMP WITH TIME ZONE,
    FOREIGN KEY (id_remitente) REFERENCES usuarios(id_usuario),
    FOREIGN KEY (id_destinatario) REFERENCES usuarios(id_usuario)
);

[cite_start]-- Tabla de configuración del sistema [cite: 55]
CREATE TABLE configuracion_sistema (
    id_configuracion SERIAL PRIMARY KEY,
    clave VARCHAR(100) UNIQUE NOT NULL,
    valor TEXT,
    descripcion TEXT,
    tipo_dato VARCHAR(20) DEFAULT 'texto',
    fecha_actualizacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    id_usuario_actualizo INTEGER,
    FOREIGN KEY (id_usuario_actualizo) REFERENCES usuarios(id_usuario)
);

[cite_start]-- Tabla de logs de auditoría [cite: 56]
CREATE TABLE logs_auditoria (
    id_log SERIAL PRIMARY KEY,
    tabla_afectada VARCHAR(50) NOT NULL,
    id_registro INTEGER,
    accion VARCHAR(20) NOT NULL,
    datos_anteriores JSONB,
    datos_nuevos JSONB,
    id_usuario INTEGER,
    fecha_accion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    ip_address INET,
    user_agent TEXT,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)
);

-- =====================================================
-- TABLAS PARA GESTIÓN DE ARCHIVOS
-- =====================================================

-- Tabla de archivos del paciente
CREATE TABLE archivos_paciente (
    id_archivo SERIAL PRIMARY KEY,
    id_paciente INTEGER NOT NULL,
    id_doctor INTEGER,
    id_usuario_subida INTEGER NOT NULL,
    
    -- Información del archivo
    nombre_archivo VARCHAR(255) NOT NULL,
    nombre_original VARCHAR(255) NOT NULL,
    ruta_storage VARCHAR(500) NOT NULL, -- Ruta en Cloud Storage
    url_publica VARCHAR(500),
    
    -- Metadata
    tipo_archivo VARCHAR(10), -- pdf, jpg, png, doc, etc.
    tamano_bytes BIGINT,
    mime_type VARCHAR(100),
    
    -- Categorización
    categoria VARCHAR(50), -- 'radiografia', 'laboratorio', 'receta', 'consentimiento', 'informe', 'imagen', 'otro'
    descripcion TEXT,
    notas TEXT,
    
    -- Compartir
    compartir_con_paciente BOOLEAN DEFAULT FALSE,
    fecha_compartido TIMESTAMP WITH TIME ZONE,
    
    -- Control
    activo BOOLEAN DEFAULT TRUE,
    fecha_subida TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (id_paciente) REFERENCES pacientes(id_paciente) ON DELETE CASCADE,
    FOREIGN KEY (id_doctor) REFERENCES doctores(id_doctor),
    FOREIGN KEY (id_usuario_subida) REFERENCES usuarios(id_usuario)
);

-- Tabla de categorías de archivos (catálogo)
CREATE TABLE categorias_archivo (
    id_categoria SERIAL PRIMARY KEY,
    nombre VARCHAR(50) UNIQUE NOT NULL,
    descripcion TEXT,
    icono VARCHAR(50), -- Nombre del icono o emoji
    color VARCHAR(7), -- Color hex
    activa BOOLEAN DEFAULT TRUE
);

-- Insertar categorías predefinidas
INSERT INTO categorias_archivo (nombre, descripcion, icono, color) VALUES
('Radiografía', 'Radiografías dentales y panorámicas', '📷', '#3b82f6'),
('Laboratorio', 'Resultados de laboratorio y análisis', '🔬', '#10b981'),
('Receta', 'Recetas médicas y prescripciones', '💊', '#f59e0b'),
('Consentimiento', 'Consentimientos informados', '📝', '#8b5cf6'),
('Informe', 'Informes médicos y evaluaciones', '📋', '#06b6d4'),
('Imagen', 'Fotografías clínicas', '📸', '#ec4899'),
('Documento', 'Documentos generales', '📄', '#6b7280'),
('Otro', 'Otros archivos', '📎', '#9ca3af')
ON CONFLICT (nombre) DO NOTHING;

-- =====================================================
-- TABLAS PARA ODONTOGRAMA
-- =====================================================

-- Tabla principal de odontogramas
CREATE TABLE odontogramas (
    id_odontograma SERIAL PRIMARY KEY,
    id_paciente INTEGER NOT NULL,
    id_doctor INTEGER,
    tipo_odontograma VARCHAR(20) NOT NULL DEFAULT 'inicial', -- 'inicial', 'evolucion', 'alta'
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    observaciones TEXT,
    activo BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (id_paciente) REFERENCES pacientes(id_paciente) ON DELETE CASCADE,
    FOREIGN KEY (id_doctor) REFERENCES doctores(id_doctor)
);

-- Tabla de detalle de cada diente en el odontograma
CREATE TABLE odontograma_dientes (
    id_diente_registro SERIAL PRIMARY KEY,
    id_odontograma INTEGER NOT NULL,
    numero_diente INTEGER NOT NULL, -- Numeración FDI: 11-18, 21-28, 31-38, 41-48
    
    -- Estados generales del diente
    estado_general VARCHAR(30) DEFAULT 'sano', -- 'sano', 'ausente', 'implante', 'protesis', 'fracturado', 'endodoncia'
    
    -- Estados de superficies específicas (para molares, premolares)
    superficie_oclusal VARCHAR(30) DEFAULT 'sano',
    superficie_vestibular VARCHAR(30) DEFAULT 'sano',
    superficie_lingual VARCHAR(30) DEFAULT 'sano',
    superficie_mesial VARCHAR(30) DEFAULT 'sano',
    superficie_distal VARCHAR(30) DEFAULT 'sano',
    
    -- Información adicional
    tiene_caries BOOLEAN DEFAULT FALSE,
    tiene_obturacion BOOLEAN DEFAULT FALSE,
    tiene_corona BOOLEAN DEFAULT FALSE,
    necesita_extraccion BOOLEAN DEFAULT FALSE,
    
    -- Código de tratamiento y colores
    codigo_tratamiento VARCHAR(10), -- Códigos estándar: C=Caries, O=Obturación, X=Extracción, etc.
    color_marcador VARCHAR(7), -- Color hex para visualización
    
    -- Notas específicas del diente
    notas TEXT,
    
    fecha_registro TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (id_odontograma) REFERENCES odontogramas(id_odontograma) ON DELETE CASCADE,
    UNIQUE (id_odontograma, numero_diente)
);

-- Tabla de plan de tratamiento odontológico
CREATE TABLE odontograma_plan_tratamiento (
    id_plan SERIAL PRIMARY KEY,
    id_odontograma INTEGER NOT NULL,
    numero_diente INTEGER NOT NULL,
    tratamiento_planificado VARCHAR(100) NOT NULL,
    descripcion TEXT,
    prioridad VARCHAR(20) DEFAULT 'media', -- 'baja', 'media', 'alta', 'urgente'
    estado VARCHAR(20) DEFAULT 'pendiente', -- 'pendiente', 'en_proceso', 'completado', 'cancelado'
    costo_estimado NUMERIC(10, 2),
    fecha_planificado DATE,
    fecha_completado DATE,
    observaciones TEXT,
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_odontograma) REFERENCES odontogramas(id_odontograma) ON DELETE CASCADE
);

-- Tabla de historial de cambios en el odontograma (para auditoría)
CREATE TABLE odontograma_historial (
    id_historial SERIAL PRIMARY KEY,
    id_odontograma INTEGER NOT NULL,
    numero_diente INTEGER,
    campo_modificado VARCHAR(50),
    valor_anterior TEXT,
    valor_nuevo TEXT,
    id_usuario INTEGER,
    fecha_cambio TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    observaciones TEXT,
    FOREIGN KEY (id_odontograma) REFERENCES odontogramas(id_odontograma) ON DELETE CASCADE,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)
);

-- Tabla de códigos y símbolos odontológicos estándar
CREATE TABLE codigos_odontologicos (
    id_codigo SERIAL PRIMARY KEY,
    codigo VARCHAR(10) UNIQUE NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    color_sugerido VARCHAR(7), -- Color hex
    categoria VARCHAR(30), -- 'diagnostico', 'tratamiento', 'estado'
    activo BOOLEAN DEFAULT TRUE
);

-- Insertar códigos odontológicos estándar
INSERT INTO codigos_odontologicos (codigo, nombre, descripcion, color_sugerido, categoria) VALUES
('SANO', 'Sano', 'Diente sano sin patología', '#ffffff', 'diagnostico'),
('C', 'Caries', 'Caries dental', '#ef4444', 'diagnostico'),
('O', 'Obturación', 'Obturación/Restauración', '#10b981', 'tratamiento'),
('E', 'Endodoncia', 'Tratamiento de conducto', '#3b82f6', 'tratamiento'),
('CO', 'Corona', 'Corona protésica', '#f59e0b', 'tratamiento'),
('IM', 'Implante', 'Implante dental', '#8b5cf6', 'tratamiento'),
('X', 'Extracción', 'Diente extraído/ausente', '#6b7280', 'estado'),
('FR', 'Fractura', 'Fractura dental', '#dc2626', 'diagnostico'),
('PR', 'Prótesis', 'Prótesis fija o removible', '#ec4899', 'tratamiento'),
('SE', 'Sellante', 'Sellante de fosetas y fisuras', '#06b6d4', 'tratamiento'),
('CA', 'Caries Activa', 'Caries activa que requiere tratamiento inmediato', '#dc2626', 'diagnostico'),
('PI', 'Puente', 'Pilar de puente', '#f97316', 'tratamiento'),
('PP', 'Pulpitis', 'Inflamación pulpar', '#ef4444', 'diagnostico'),
('AB', 'Absceso', 'Absceso periapical', '#991b1b', 'diagnostico'),
('MO', 'Movilidad', 'Movilidad dental', '#fb923c', 'diagnostico'),
('DT', 'Diente Temporal', 'Diente de leche', '#a3e635', 'estado'),
('ER', 'Erosión', 'Erosión del esmalte', '#fbbf24', 'diagnostico'),
('FL', 'Fluorosis', 'Fluorosis dental', '#d1d5db', 'diagnostico'),
('RE', 'Recesión', 'Recesión gingival', '#fb7185', 'diagnostico'),
('IN', 'Incluido', 'Diente incluido/impactado', '#94a3b8', 'estado');


-- =====================================================
-- 5. ÍNDICES PARA MEJORAR EL RENDIMIENTO
-- =====================================================

[cite_start]CREATE INDEX idx_citas_fecha_hora ON citas_medicas(fecha_hora); [cite: 57]
[cite_start]CREATE INDEX idx_citas_doctor_fecha ON citas_medicas(id_doctor, fecha_hora); [cite: 57]
[cite_start]CREATE INDEX idx_citas_paciente ON citas_medicas(id_paciente); [cite: 58]
[cite_start]CREATE INDEX idx_citas_estado ON citas_medicas(estado); [cite: 58]
[cite_start]CREATE INDEX idx_pacientes_dni ON pacientes(dni); [cite: 58]
[cite_start]CREATE INDEX idx_pacientes_telefono ON pacientes(telefono); [cite: 59]
[cite_start]CREATE INDEX idx_pacientes_email ON pacientes(email); [cite: 59]
[cite_start]CREATE INDEX idx_pacientes_estado ON pacientes(estado_paciente); [cite: 59]
[cite_start]CREATE INDEX idx_transacciones_fecha ON transacciones_financieras(fecha_transaccion); [cite: 60]
[cite_start]CREATE INDEX idx_transacciones_tipo ON transacciones_financieras(tipo_transaccion); [cite: 60]
[cite_start]CREATE INDEX idx_transacciones_doctor ON transacciones_financieras(id_doctor); [cite: 60]
[cite_start]CREATE INDEX idx_productos_stock ON productos(stock); [cite: 61]
[cite_start]CREATE INDEX idx_productos_proveedor ON productos(proveedor); [cite: 61]
[cite_start]CREATE INDEX idx_movimientos_fecha ON movimientos_inventario(fecha_movimiento); [cite: 62]
[cite_start]CREATE INDEX idx_movimientos_producto ON movimientos_inventario(id_producto); [cite: 62]

[cite_start]-- Índices adicionales para compras y consumos [cite: 123]
CREATE INDEX IF NOT EXISTS idx_ordenes_fecha_creacion ON ordenes_compra(fecha_creacion);
CREATE INDEX IF NOT EXISTS idx_ordenes_estado ON ordenes_compra(estado);
CREATE INDEX IF NOT EXISTS idx_consumos_fecha ON consumos(fecha_consumo);
CREATE INDEX IF NOT EXISTS idx_consumos_producto ON consumos(id_producto);
CREATE INDEX IF NOT EXISTS idx_consumos_estado ON consumos(estado);

-- Índices para etiquetas de pacientes
CREATE INDEX IF NOT EXISTS idx_paciente_etiquetas_paciente ON paciente_etiquetas(id_paciente);
CREATE INDEX IF NOT EXISTS idx_paciente_etiquetas_etiqueta ON paciente_etiquetas(id_etiqueta);
CREATE INDEX IF NOT EXISTS idx_etiquetas_activa ON etiquetas_paciente(activa);

-- Índices para archivos
CREATE INDEX IF NOT EXISTS idx_archivos_paciente ON archivos_paciente(id_paciente);
CREATE INDEX IF NOT EXISTS idx_archivos_doctor ON archivos_paciente(id_doctor);
CREATE INDEX IF NOT EXISTS idx_archivos_usuario ON archivos_paciente(id_usuario_subida);
CREATE INDEX IF NOT EXISTS idx_archivos_categoria ON archivos_paciente(categoria);
CREATE INDEX IF NOT EXISTS idx_archivos_fecha ON archivos_paciente(fecha_subida);
CREATE INDEX IF NOT EXISTS idx_archivos_activo ON archivos_paciente(activo);

-- Índices para odontogramas
CREATE INDEX IF NOT EXISTS idx_odontogramas_paciente ON odontogramas(id_paciente);
CREATE INDEX IF NOT EXISTS idx_odontogramas_tipo ON odontogramas(tipo_odontograma);
CREATE INDEX IF NOT EXISTS idx_odontogramas_activo ON odontogramas(activo);
CREATE INDEX IF NOT EXISTS idx_odontograma_dientes_odontograma ON odontograma_dientes(id_odontograma);
CREATE INDEX IF NOT EXISTS idx_odontograma_dientes_numero ON odontograma_dientes(numero_diente);
CREATE INDEX IF NOT EXISTS idx_odontograma_plan_odontograma ON odontograma_plan_tratamiento(id_odontograma);
CREATE INDEX IF NOT EXISTS idx_odontograma_plan_estado ON odontograma_plan_tratamiento(estado);
CREATE INDEX IF NOT EXISTS idx_odontograma_historial_odontograma ON odontograma_historial(id_odontograma);
CREATE INDEX IF NOT EXISTS idx_codigos_odontologicos_categoria ON codigos_odontologicos(categoria);


-- =====================================================
-- 6. FUNCIONES Y TRIGGERS PARA AUTOMATIZACIÓN
-- =====================================================

[cite_start]-- Función para actualizar el stock de productos automáticamente [cite: 63, 64, 65, 66, 67, 68, 69, 70, 71]
CREATE OR REPLACE FUNCTION actualizar_stock_producto()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        IF NEW.tipo_movimiento = 'entrada' THEN
            UPDATE productos SET stock = stock + NEW.cantidad WHERE id_producto = NEW.id_producto;
        ELSIF NEW.tipo_movimiento = 'salida' THEN
            UPDATE productos SET stock = stock - NEW.cantidad WHERE id_producto = NEW.id_producto;
        END IF;
    ELSIF TG_OP = 'UPDATE' THEN
        -- Revertir movimiento anterior
        IF OLD.tipo_movimiento = 'entrada' THEN
            UPDATE productos SET stock = stock - OLD.cantidad WHERE id_producto = OLD.id_producto;
        ELSIF OLD.tipo_movimiento = 'salida' THEN
            UPDATE productos SET stock = stock + OLD.cantidad WHERE id_producto = OLD.id_producto;
        END IF;
        -- Aplicar nuevo movimiento
        IF NEW.tipo_movimiento = 'entrada' THEN
            UPDATE productos SET stock = stock + NEW.cantidad WHERE id_producto = NEW.id_producto;
        ELSIF NEW.tipo_movimiento = 'salida' THEN
            UPDATE productos SET stock = stock - NEW.cantidad WHERE id_producto = NEW.id_producto;
        END IF;
    ELSIF TG_OP = 'DELETE' THEN
        -- Revertir movimiento
        IF OLD.tipo_movimiento = 'entrada' THEN
            UPDATE productos SET stock = stock - OLD.cantidad WHERE id_producto = OLD.id_producto;
        ELSIF OLD.tipo_movimiento = 'salida' THEN
            UPDATE productos SET stock = stock + OLD.cantidad WHERE id_producto = OLD.id_producto;
        END IF;
    END IF;
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

[cite_start]-- Trigger para ejecutar la actualización de stock [cite: 72]
CREATE TRIGGER trigger_actualizar_stock
    AFTER INSERT OR UPDATE OR DELETE ON movimientos_inventario
    FOR EACH ROW EXECUTE FUNCTION actualizar_stock_producto();

[cite_start]-- Función para actualizar el monto pagado y estado de las facturas [cite: 73, 74, 75, 76, 77, 78, 79, 80]
CREATE OR REPLACE FUNCTION actualizar_monto_pagado_factura()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE facturas SET monto_pagado = monto_pagado + NEW.monto_pago WHERE id_factura = NEW.id_factura;
    ELSIF TG_OP = 'UPDATE' THEN
        UPDATE facturas SET monto_pagado = monto_pagado - OLD.monto_pago + NEW.monto_pago WHERE id_factura = NEW.id_factura;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE facturas SET monto_pagado = monto_pagado - OLD.monto_pago WHERE id_factura = OLD.id_factura;
    END IF;

    -- Actualizar estado de la factura
    UPDATE facturas
    SET estado_factura = CASE
        WHEN monto_pagado >= monto_total THEN 'Pagada'
        WHEN monto_pagado > 0 AND monto_pagado < monto_total THEN 'Parcial'
        ELSE 'Pendiente'
    END
    WHERE id_factura = COALESCE(NEW.id_factura, OLD.id_factura);

    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

[cite_start]-- Trigger para ejecutar la actualización de montos en facturas [cite: 80]
CREATE TRIGGER trigger_actualizar_monto_pagado
    AFTER INSERT OR UPDATE OR DELETE ON pagos
    FOR EACH ROW EXECUTE FUNCTION actualizar_monto_pagado_factura();


-- =====================================================
-- 7. PROCEDIMIENTOS ALMACENADOS (FUNCIONES)
-- =====================================================

[cite_start]-- Obtener estadísticas generales del consultorio [cite: 88, 89, 90, 91, 92]
CREATE OR REPLACE FUNCTION obtener_estadisticas_consultorio(
    fecha_inicio DATE DEFAULT CURRENT_DATE - INTERVAL '30 days',
    fecha_fin DATE DEFAULT CURRENT_DATE
)
RETURNS TABLE (
    total_citas BIGINT, citas_realizadas BIGINT, citas_canceladas BIGINT,
    total_ingresos NUMERIC, total_egresos NUMERIC,
    pacientes_nuevos BIGINT, productos_bajo_stock BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        (SELECT COUNT(*) FROM citas_medicas WHERE fecha_hora::date BETWEEN fecha_inicio AND fecha_fin) as total_citas,
        (SELECT COUNT(*) FROM citas_medicas WHERE fecha_hora::date BETWEEN fecha_inicio AND fecha_fin AND estado = 'Realizada') as citas_realizadas,
        (SELECT COUNT(*) FROM citas_medicas WHERE fecha_hora::date BETWEEN fecha_inicio AND fecha_fin AND estado = 'Cancelada') as citas_canceladas,
        (SELECT COALESCE(SUM(monto), 0) FROM transacciones_financieras WHERE fecha_transaccion::date BETWEEN fecha_inicio AND fecha_fin AND tipo_transaccion = 'ingreso') as total_ingresos,
        (SELECT COALESCE(SUM(monto), 0) FROM transacciones_financieras WHERE fecha_transaccion::date BETWEEN fecha_inicio AND fecha_fin AND tipo_transaccion = 'egreso') as total_egresos,
        (SELECT COUNT(*) FROM pacientes WHERE fecha_registro::date BETWEEN fecha_inicio AND fecha_fin) as pacientes_nuevos,
        (SELECT COUNT(*) FROM productos WHERE stock < 10) as productos_bajo_stock;
END;
$$ LANGUAGE plpgsql;

[cite_start]-- Obtener horarios disponibles de un doctor para una fecha específica [cite: 92, 93, 94, 95, 96, 97, 98, 99, 100]
CREATE OR REPLACE FUNCTION obtener_horarios_disponibles(
    p_id_doctor INTEGER, p_fecha DATE, p_duracion_minutos INTEGER DEFAULT 60
)
RETURNS TABLE (hora_inicio TIME, hora_fin TIME) AS $$
DECLARE
    horario_record RECORD;
    hora_actual TIME;
    hora_fin_jornada TIME;
    intervalo_cita INTERVAL;
BEGIN
    intervalo_cita := (p_duracion_minutos || ' minutes')::INTERVAL;
    
    SELECT hd.hora_inicio, hd.hora_fin INTO horario_record
    FROM horarios_doctor hd
    WHERE hd.id_doctor = p_id_doctor
      AND hd.dia_semana = EXTRACT(ISODOW FROM p_fecha) -- Lunes=1, Domingo=7
      AND hd.activo = TRUE;

    IF NOT FOUND THEN
        RETURN;
    END IF;

    hora_actual := horario_record.hora_inicio;
    hora_fin_jornada := horario_record.hora_fin;

    WHILE hora_actual + intervalo_cita <= hora_fin_jornada LOOP
        -- Verificar si el slot está ocupado por otra cita
        IF NOT EXISTS (
            SELECT 1
            FROM citas_medicas c
            WHERE c.id_doctor = p_id_doctor
              AND c.fecha_hora::date = p_fecha
              AND c.estado NOT IN ('Cancelada')
              AND (c.fecha_hora::time, (c.fecha_hora + (c.duracion_minutos || ' minutes')::interval)::time)
                  OVERLAPS (hora_actual, (hora_actual + intervalo_cita)::time)
        ) THEN
            hora_inicio := hora_actual;
            hora_fin := (hora_actual + intervalo_cita);
            RETURN NEXT;
        END IF;
        hora_actual := hora_actual + '30 minutes'::INTERVAL; -- Avanzar en intervalos de 30 min para buscar slots
    END LOOP;
END;
$$ LANGUAGE plpgsql;


[cite_start]-- Generar reporte de productividad para un doctor [cite: 101, 102, 103]
CREATE OR REPLACE FUNCTION generar_reporte_productividad(
    p_id_doctor INTEGER, fecha_inicio DATE, fecha_fin DATE
)
RETURNS TABLE (
    fecha DATE, total_citas BIGINT, citas_realizadas BIGINT,
    ingresos_dia NUMERIC, tiempo_total_minutos BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        c.fecha_hora::date as fecha,
        COUNT(*) as total_citas,
        COUNT(CASE WHEN c.estado = 'Realizada' THEN 1 END) as citas_realizadas,
        COALESCE(SUM(f.monto_total), 0) as ingresos_dia,
        COALESCE(SUM(c.duracion_minutos), 0) as tiempo_total_minutos
    FROM citas_medicas c
    LEFT JOIN facturas f ON c.id_cita = f.id_cita
    WHERE c.id_doctor = p_id_doctor
    AND c.fecha_hora::date BETWEEN fecha_inicio AND fecha_fin
    GROUP BY c.fecha_hora::date
    ORDER BY c.fecha_hora::date;
END;
$$ LANGUAGE plpgsql;


-- =====================================================
-- 8. VISTAS ÚTILES
-- =====================================================

[cite_start]-- Vista para un resumen completo de pacientes [cite: 108, 109]
CREATE OR REPLACE VIEW vista_resumen_pacientes AS
SELECT
    p.id_paciente, p.nombres, p.apellidos, p.dni, p.telefono, p.email,
    p.estado_paciente, fc.nombre as fuente_captacion, a.nombre as aseguradora,
    ln.nombre as linea_negocio, p.presupuesto, p.ultima_cita, p.proxima_cita,
    COUNT(c.id_cita) as total_citas,
    COUNT(CASE WHEN c.estado = 'Realizada' THEN 1 END) as citas_realizadas
FROM pacientes p
LEFT JOIN fuente_captacion fc ON p.id_fuente_captacion = fc.id
LEFT JOIN aseguradora a ON p.id_aseguradora = a.id
LEFT JOIN linea_negocio ln ON p.id_linea_negocio = ln.id
LEFT JOIN citas_medicas c ON p.id_paciente = c.id_paciente
GROUP BY p.id_paciente, fc.nombre, a.nombre, ln.nombre;

[cite_start]-- Vista para un resumen financiero diario [cite: 110]
CREATE OR REPLACE VIEW vista_resumen_financiero AS
SELECT
    DATE_TRUNC('day', fecha_transaccion)::date as fecha,
    tipo_transaccion,
    COUNT(*) as cantidad_transacciones,
    SUM(monto) as total_monto,
    AVG(monto) as promedio_monto
FROM transacciones_financieras
GROUP BY DATE_TRUNC('day', fecha_transaccion), tipo_transaccion
ORDER BY fecha DESC;

[cite_start]-- Vista para inventario con alertas de stock [cite: 111, 112]
CREATE OR REPLACE VIEW vista_inventario_alertas AS
SELECT
    p.id_producto, p.nombre_producto, p.stock, p.costo_unitario, p.proveedor,
    CASE
        WHEN p.stock = 0 THEN 'Sin Stock'
        WHEN p.stock < 10 THEN 'Stock Bajo'
        ELSE 'Stock Normal'
    END as estado_stock,
    (SELECT COALESCE(SUM(mi.cantidad), 0)
     FROM movimientos_inventario mi
     WHERE mi.id_producto = p.id_producto
       AND mi.fecha_movimiento >= CURRENT_DATE - INTERVAL '30 days'
       AND mi.tipo_movimiento = 'salida'
    ) as salidas_mes
FROM productos p
GROUP BY p.id_producto;


-- =====================================================
-- 9. TABLAS ADICIONALES PARA HISTORIA CLÍNICA
-- =====================================================

-- Tabla de Datos Fiscales del Paciente
CREATE TABLE IF NOT EXISTS datos_fiscales_paciente (
    id_dato_fiscal SERIAL PRIMARY KEY,
    id_paciente INTEGER NOT NULL,
    razon_social VARCHAR(200) NOT NULL,
    numero_fiscal VARCHAR(50) NOT NULL,
    direccion VARCHAR(255),
    departamento VARCHAR(100),
    provincia VARCHAR(100),
    distrito VARCHAR(100),
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_paciente) REFERENCES pacientes(id_paciente) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_datos_fiscales_paciente ON datos_fiscales_paciente(id_paciente);

-- Tabla de Familiares del Paciente
CREATE TABLE IF NOT EXISTS familiares_paciente (
    id_familiar SERIAL PRIMARY KEY,
    id_paciente INTEGER NOT NULL,
    nombre_completo VARCHAR(200) NOT NULL,
    documento VARCHAR(50),
    telefono VARCHAR(20),
    email VARCHAR(100),
    es_apoderado BOOLEAN DEFAULT FALSE,
    parentesco VARCHAR(50),
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_paciente) REFERENCES pacientes(id_paciente) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_familiares_paciente ON familiares_paciente(id_paciente);

-- =====================================================
-- 10. COMENTARIOS Y DOCUMENTACIÓN
-- =====================================================

[cite_start]COMMENT ON TABLE horarios_doctor IS 'Horarios de trabajo de cada doctor por día de la semana'; [cite: 113]
[cite_start]COMMENT ON TABLE dias_no_laborables IS 'Días festivos y vacaciones que afectan la disponibilidad'; [cite: 114]
[cite_start]COMMENT ON TABLE recordatorios IS 'Sistema de recordatorios automáticos para citas'; [cite: 115]
[cite_start]COMMENT ON TABLE transacciones_financieras IS 'Registro de todas las transacciones financieras del consultorio'; [cite: 116]
[cite_start]COMMENT ON TABLE movimientos_inventario IS 'Movimientos de entrada y salida de productos del inventario'; [cite: 117]
[cite_start]COMMENT ON TABLE campanas_marketing IS 'Campañas de marketing y promociones'; [cite: 118]
[cite_start]COMMENT ON TABLE segmentaciones IS 'Segmentaciones de pacientes para marketing dirigido'; [cite: 119]
[cite_start]COMMENT ON TABLE automatizaciones IS 'Reglas de automatización para procesos del consultorio'; [cite: 120]
[cite_start]COMMENT ON TABLE mensajes_chat IS 'Sistema de chat interno del consultorio'; [cite: 121]
[cite_start]COMMENT ON TABLE configuracion_sistema IS 'Configuración general del sistema'; [cite: 121]
[cite_start]COMMENT ON TABLE logs_auditoria IS 'Log de auditoría para todas las operaciones importantes'; [cite: 122]


-- =====================================================
-- FIN DEL SCRIPT CONSOLIDADO
-- =====================================================