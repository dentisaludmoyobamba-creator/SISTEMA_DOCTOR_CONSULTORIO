-- =====================================================
-- SCRIPT RÁPIDO PARA CREAR TABLAS DE ODONTOGRAMA
-- =====================================================
-- Ejecuta este script en tu base de datos PostgreSQL
-- para agregar solo las tablas del odontograma

-- =====================================================
-- TABLAS PARA ODONTOGRAMA
-- =====================================================

-- Tabla principal de odontogramas
CREATE TABLE IF NOT EXISTS odontogramas (
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
CREATE TABLE IF NOT EXISTS odontograma_dientes (
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
CREATE TABLE IF NOT EXISTS odontograma_plan_tratamiento (
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
CREATE TABLE IF NOT EXISTS odontograma_historial (
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
CREATE TABLE IF NOT EXISTS codigos_odontologicos (
    id_codigo SERIAL PRIMARY KEY,
    codigo VARCHAR(10) UNIQUE NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    color_sugerido VARCHAR(7), -- Color hex
    categoria VARCHAR(30), -- 'diagnostico', 'tratamiento', 'estado'
    activo BOOLEAN DEFAULT TRUE
);

-- =====================================================
-- INSERTAR CÓDIGOS ODONTOLÓGICOS ESTÁNDAR
-- =====================================================

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
('IN', 'Incluido', 'Diente incluido/impactado', '#94a3b8', 'estado')
ON CONFLICT (codigo) DO NOTHING;

-- =====================================================
-- CREAR ÍNDICES PARA OPTIMIZAR RENDIMIENTO
-- =====================================================

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
-- VERIFICACIÓN
-- =====================================================

-- Verificar que las tablas se crearon correctamente
SELECT 
    'odontogramas' as tabla,
    COUNT(*) as registros
FROM odontogramas
UNION ALL
SELECT 
    'odontograma_dientes' as tabla,
    COUNT(*) as registros
FROM odontograma_dientes
UNION ALL
SELECT 
    'odontograma_plan_tratamiento' as tabla,
    COUNT(*) as registros
FROM odontograma_plan_tratamiento
UNION ALL
SELECT 
    'odontograma_historial' as tabla,
    COUNT(*) as registros
FROM odontograma_historial
UNION ALL
SELECT 
    'codigos_odontologicos' as tabla,
    COUNT(*) as registros
FROM codigos_odontologicos;

-- =====================================================
-- FIN DEL SCRIPT
-- =====================================================

-- Mensaje de confirmación
DO $$
BEGIN
    RAISE NOTICE '✅ Tablas de odontograma creadas exitosamente!';
    RAISE NOTICE '✅ 20 códigos odontológicos insertados';
    RAISE NOTICE '✅ Índices creados para optimización';
    RAISE NOTICE '';
    RAISE NOTICE '🦷 Sistema de odontograma listo para usar!';
END $$;

