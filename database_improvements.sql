-- =====================================================
-- MEJORAS PARA LA BASE DE DATOS DEL CONSULTORIO
-- =====================================================

-- 1. CORRECCIONES Y MEJORAS EN TABLAS EXISTENTES
-- =====================================================

-- Corregir error tipográfico en linea_negocio
ALTER TABLE linea_negocio RENAME COLUMN estadi TO estado;

-- Agregar campos faltantes a pacientes
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
ADD COLUMN etiqueta_color VARCHAR(50);

-- Agregar foreign keys para pacientes
ALTER TABLE pacientes 
ADD CONSTRAINT fk_paciente_fuente_captacion 
FOREIGN KEY (id_fuente_captacion) REFERENCES fuente_captacion(id);

ALTER TABLE pacientes 
ADD CONSTRAINT fk_paciente_aseguradora 
FOREIGN KEY (id_aseguradora) REFERENCES aseguradora(id);

ALTER TABLE pacientes 
ADD CONSTRAINT fk_paciente_linea_negocio 
FOREIGN KEY (id_linea_negocio) REFERENCES linea_negocio(id);

-- Mejorar tabla citas_medicas
ALTER TABLE citas_medicas 
ADD COLUMN duracion_minutos INTEGER DEFAULT 60,
ADD COLUMN telefono_contacto VARCHAR(20),
ADD COLUMN email_contacto VARCHAR(100),
ADD COLUMN recordatorio_enviado BOOLEAN DEFAULT FALSE,
ADD COLUMN fecha_recordatorio TIMESTAMP WITH TIME ZONE,
ADD COLUMN motivo_cancelacion TEXT,
ADD COLUMN fecha_cancelacion TIMESTAMP WITH TIME ZONE,
ADD COLUMN id_usuario_cancelo INTEGER;

-- Agregar foreign key para usuario que cancela
ALTER TABLE citas_medicas 
ADD CONSTRAINT fk_cita_usuario_cancelo 
FOREIGN KEY (id_usuario_cancelo) REFERENCES usuarios(id_usuario);

-- 2. NUEVAS TABLAS NECESARIAS
-- =====================================================

-- Tabla para horarios de doctores
CREATE TABLE horarios_doctor (
    id_horario SERIAL PRIMARY KEY,
    id_doctor INTEGER NOT NULL,
    dia_semana INTEGER NOT NULL, -- 1=Lunes, 2=Martes, etc.
    hora_inicio TIME NOT NULL,
    hora_fin TIME NOT NULL,
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_doctor) REFERENCES doctores(id_doctor) ON DELETE CASCADE
);

-- Tabla para días festivos/vacaciones
CREATE TABLE dias_no_laborables (
    id_dia_no_laborable SERIAL PRIMARY KEY,
    fecha DATE NOT NULL,
    motivo VARCHAR(100) NOT NULL,
    aplica_todos_doctores BOOLEAN DEFAULT TRUE,
    id_doctor INTEGER, -- Si es específico para un doctor
    activo BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (id_doctor) REFERENCES doctores(id_doctor) ON DELETE CASCADE
);

-- Tabla para recordatorios
CREATE TABLE recordatorios (
    id_recordatorio SERIAL PRIMARY KEY,
    id_cita INTEGER NOT NULL,
    tipo_recordatorio VARCHAR(20) NOT NULL, -- 'email', 'sms', 'whatsapp'
    fecha_envio TIMESTAMP WITH TIME ZONE,
    estado VARCHAR(20) DEFAULT 'pendiente', -- 'pendiente', 'enviado', 'fallido'
    mensaje TEXT,
    respuesta TEXT,
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_cita) REFERENCES citas_medicas(id_cita) ON DELETE CASCADE
);

-- Tabla para transacciones financieras (para el módulo Caja)
CREATE TABLE transacciones_financieras (
    id_transaccion SERIAL PRIMARY KEY,
    tipo_transaccion VARCHAR(20) NOT NULL, -- 'ingreso', 'egreso'
    id_doctor INTEGER,
    id_paciente INTEGER,
    concepto VARCHAR(255) NOT NULL,
    monto NUMERIC(10,2) NOT NULL,
    medio_pago VARCHAR(50), -- 'efectivo', 'tarjeta', 'transferencia'
    referencia_pago VARCHAR(100),
    fecha_transaccion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    id_usuario_registro INTEGER NOT NULL,
    comentario TEXT,
    estado VARCHAR(20) DEFAULT 'completado', -- 'completado', 'cancelado'
    FOREIGN KEY (id_doctor) REFERENCES doctores(id_doctor),
    FOREIGN KEY (id_paciente) REFERENCES pacientes(id_paciente),
    FOREIGN KEY (id_usuario_registro) REFERENCES usuarios(id_usuario)
);

-- Tabla para inventario (movimientos de stock)
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

-- Tabla para campañas de marketing
CREATE TABLE campanas_marketing (
    id_campana SERIAL PRIMARY KEY,
    nombre_campana VARCHAR(100) NOT NULL,
    descripcion TEXT,
    tipo_campana VARCHAR(50) NOT NULL, -- 'email', 'sms', 'whatsapp', 'redes_sociales'
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE,
    presupuesto NUMERIC(10,2),
    estado VARCHAR(20) DEFAULT 'activa', -- 'activa', 'pausada', 'finalizada'
    id_usuario_creador INTEGER NOT NULL,
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario_creador) REFERENCES usuarios(id_usuario)
);

-- Tabla para segmentaciones de pacientes
CREATE TABLE segmentaciones (
    id_segmentacion SERIAL PRIMARY KEY,
    nombre_segmentacion VARCHAR(100) NOT NULL,
    descripcion TEXT,
    criterios JSONB, -- Criterios de segmentación en formato JSON
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    id_usuario_creador INTEGER NOT NULL,
    activa BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (id_usuario_creador) REFERENCES usuarios(id_usuario)
);

-- Tabla para automatizaciones
CREATE TABLE automatizaciones (
    id_automatizacion SERIAL PRIMARY KEY,
    nombre_automatizacion VARCHAR(100) NOT NULL,
    descripcion TEXT,
    tipo_automatizacion VARCHAR(50) NOT NULL, -- 'recordatorio', 'seguimiento', 'marketing'
    condiciones JSONB, -- Condiciones en formato JSON
    acciones JSONB, -- Acciones a ejecutar en formato JSON
    activa BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    id_usuario_creador INTEGER NOT NULL,
    FOREIGN KEY (id_usuario_creador) REFERENCES usuarios(id_usuario)
);

-- Tabla para chat/mensajes
CREATE TABLE mensajes_chat (
    id_mensaje SERIAL PRIMARY KEY,
    id_remitente INTEGER NOT NULL,
    id_destinatario INTEGER,
    id_grupo INTEGER, -- Para chats grupales
    tipo_mensaje VARCHAR(20) DEFAULT 'texto', -- 'texto', 'imagen', 'archivo'
    contenido TEXT NOT NULL,
    archivo_url VARCHAR(255),
    leido BOOLEAN DEFAULT FALSE,
    fecha_envio TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    fecha_lectura TIMESTAMP WITH TIME ZONE,
    FOREIGN KEY (id_remitente) REFERENCES usuarios(id_usuario),
    FOREIGN KEY (id_destinatario) REFERENCES usuarios(id_usuario)
);

-- Tabla para configuración del sistema
CREATE TABLE configuracion_sistema (
    id_configuracion SERIAL PRIMARY KEY,
    clave VARCHAR(100) UNIQUE NOT NULL,
    valor TEXT,
    descripcion TEXT,
    tipo_dato VARCHAR(20) DEFAULT 'texto', -- 'texto', 'numero', 'booleano', 'json'
    fecha_actualizacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    id_usuario_actualizo INTEGER,
    FOREIGN KEY (id_usuario_actualizo) REFERENCES usuarios(id_usuario)
);

-- Tabla para logs de auditoría
CREATE TABLE logs_auditoria (
    id_log SERIAL PRIMARY KEY,
    tabla_afectada VARCHAR(50) NOT NULL,
    id_registro INTEGER,
    accion VARCHAR(20) NOT NULL, -- 'INSERT', 'UPDATE', 'DELETE'
    datos_anteriores JSONB,
    datos_nuevos JSONB,
    id_usuario INTEGER,
    fecha_accion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    ip_address INET,
    user_agent TEXT,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)
);

-- 3. ÍNDICES PARA MEJORAR RENDIMIENTO
-- =====================================================

-- Índices para citas_medicas
CREATE INDEX idx_citas_fecha_hora ON citas_medicas(fecha_hora);
CREATE INDEX idx_citas_doctor_fecha ON citas_medicas(id_doctor, fecha_hora);
CREATE INDEX idx_citas_paciente ON citas_medicas(id_paciente);
CREATE INDEX idx_citas_estado ON citas_medicas(estado);

-- Índices para pacientes
CREATE INDEX idx_pacientes_dni ON pacientes(dni);
CREATE INDEX idx_pacientes_telefono ON pacientes(telefono);
CREATE INDEX idx_pacientes_email ON pacientes(email);
CREATE INDEX idx_pacientes_estado ON pacientes(estado_paciente);

-- Índices para transacciones financieras
CREATE INDEX idx_transacciones_fecha ON transacciones_financieras(fecha_transaccion);
CREATE INDEX idx_transacciones_tipo ON transacciones_financieras(tipo_transaccion);
CREATE INDEX idx_transacciones_doctor ON transacciones_financieras(id_doctor);

-- Índices para productos
CREATE INDEX idx_productos_stock ON productos(stock);
CREATE INDEX idx_productos_proveedor ON productos(proveedor);

-- Índices para movimientos de inventario
CREATE INDEX idx_movimientos_fecha ON movimientos_inventario(fecha_movimiento);
CREATE INDEX idx_movimientos_producto ON movimientos_inventario(id_producto);

-- 4. TRIGGERS PARA AUTOMATIZACIÓN
-- =====================================================

-- Función para actualizar stock automáticamente
CREATE OR REPLACE FUNCTION actualizar_stock_producto()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        IF NEW.tipo_movimiento = 'entrada' THEN
            UPDATE productos SET stock = stock + NEW.cantidad 
            WHERE id_producto = NEW.id_producto;
        ELSIF NEW.tipo_movimiento = 'salida' THEN
            UPDATE productos SET stock = stock - NEW.cantidad 
            WHERE id_producto = NEW.id_producto;
        END IF;
    ELSIF TG_OP = 'UPDATE' THEN
        -- Revertir movimiento anterior
        IF OLD.tipo_movimiento = 'entrada' THEN
            UPDATE productos SET stock = stock - OLD.cantidad 
            WHERE id_producto = OLD.id_producto;
        ELSIF OLD.tipo_movimiento = 'salida' THEN
            UPDATE productos SET stock = stock + OLD.cantidad 
            WHERE id_producto = OLD.id_producto;
        END IF;
        
        -- Aplicar nuevo movimiento
        IF NEW.tipo_movimiento = 'entrada' THEN
            UPDATE productos SET stock = stock + NEW.cantidad 
            WHERE id_producto = NEW.id_producto;
        ELSIF NEW.tipo_movimiento = 'salida' THEN
            UPDATE productos SET stock = stock - NEW.cantidad 
            WHERE id_producto = NEW.id_producto;
        END IF;
    ELSIF TG_OP = 'DELETE' THEN
        -- Revertir movimiento
        IF OLD.tipo_movimiento = 'entrada' THEN
            UPDATE productos SET stock = stock - OLD.cantidad 
            WHERE id_producto = OLD.id_producto;
        ELSIF OLD.tipo_movimiento = 'salida' THEN
            UPDATE productos SET stock = stock + OLD.cantidad 
            WHERE id_producto = OLD.id_producto;
        END IF;
    END IF;
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Trigger para actualizar stock
CREATE TRIGGER trigger_actualizar_stock
    AFTER INSERT OR UPDATE OR DELETE ON movimientos_inventario
    FOR EACH ROW EXECUTE FUNCTION actualizar_stock_producto();

-- Función para actualizar monto pagado en facturas
CREATE OR REPLACE FUNCTION actualizar_monto_pagado_factura()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE facturas 
        SET monto_pagado = monto_pagado + NEW.monto_pago
        WHERE id_factura = NEW.id_factura;
        
        -- Actualizar estado de factura si está completamente pagada
        UPDATE facturas 
        SET estado_factura = 'Pagada'
        WHERE id_factura = NEW.id_factura 
        AND monto_pagado >= monto_total;
        
    ELSIF TG_OP = 'UPDATE' THEN
        -- Revertir pago anterior
        UPDATE facturas 
        SET monto_pagado = monto_pagado - OLD.monto_pago
        WHERE id_factura = OLD.id_factura;
        
        -- Aplicar nuevo pago
        UPDATE facturas 
        SET monto_pagado = monto_pagado + NEW.monto_pago
        WHERE id_factura = NEW.id_factura;
        
        -- Actualizar estado de factura
        UPDATE facturas 
        SET estado_factura = CASE 
            WHEN monto_pagado >= monto_total THEN 'Pagada'
            WHEN monto_pagado > 0 THEN 'Parcial'
            ELSE 'Pendiente'
        END
        WHERE id_factura = NEW.id_factura;
        
    ELSIF TG_OP = 'DELETE' THEN
        -- Revertir pago
        UPDATE facturas 
        SET monto_pagado = monto_pagado - OLD.monto_pago
        WHERE id_factura = OLD.id_factura;
        
        -- Actualizar estado de factura
        UPDATE facturas 
        SET estado_factura = CASE 
            WHEN monto_pagado >= monto_total THEN 'Pagada'
            WHEN monto_pagado > 0 THEN 'Parcial'
            ELSE 'Pendiente'
        END
        WHERE id_factura = OLD.id_factura;
    END IF;
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Trigger para actualizar monto pagado
CREATE TRIGGER trigger_actualizar_monto_pagado
    AFTER INSERT OR UPDATE OR DELETE ON pagos
    FOR EACH ROW EXECUTE FUNCTION actualizar_monto_pagado_factura();

-- Función para log de auditoría
CREATE OR REPLACE FUNCTION log_auditoria()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        INSERT INTO logs_auditoria (tabla_afectada, id_registro, accion, datos_nuevos, id_usuario)
        VALUES (TG_TABLE_NAME, NEW.id, 'INSERT', to_jsonb(NEW), current_setting('app.current_user_id', true)::integer);
        RETURN NEW;
    ELSIF TG_OP = 'UPDATE' THEN
        INSERT INTO logs_auditoria (tabla_afectada, id_registro, accion, datos_anteriores, datos_nuevos, id_usuario)
        VALUES (TG_TABLE_NAME, NEW.id, 'UPDATE', to_jsonb(OLD), to_jsonb(NEW), current_setting('app.current_user_id', true)::integer);
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        INSERT INTO logs_auditoria (tabla_afectada, id_registro, accion, datos_anteriores, id_usuario)
        VALUES (TG_TABLE_NAME, OLD.id, 'DELETE', to_jsonb(OLD), current_setting('app.current_user_id', true)::integer);
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Triggers de auditoría para tablas importantes
CREATE TRIGGER trigger_auditoria_pacientes
    AFTER INSERT OR UPDATE OR DELETE ON pacientes
    FOR EACH ROW EXECUTE FUNCTION log_auditoria();

CREATE TRIGGER trigger_auditoria_citas
    AFTER INSERT OR UPDATE OR DELETE ON citas_medicas
    FOR EACH ROW EXECUTE FUNCTION log_auditoria();

CREATE TRIGGER trigger_auditoria_facturas
    AFTER INSERT OR UPDATE OR DELETE ON facturas
    FOR EACH ROW EXECUTE FUNCTION log_auditoria();

-- 5. PROCEDIMIENTOS ALMACENADOS
-- =====================================================

-- Procedimiento para obtener estadísticas del consultorio
CREATE OR REPLACE FUNCTION obtener_estadisticas_consultorio(
    fecha_inicio DATE DEFAULT CURRENT_DATE - INTERVAL '30 days',
    fecha_fin DATE DEFAULT CURRENT_DATE
)
RETURNS TABLE (
    total_citas BIGINT,
    citas_realizadas BIGINT,
    citas_canceladas BIGINT,
    total_ingresos NUMERIC,
    total_egresos NUMERIC,
    pacientes_nuevos BIGINT,
    productos_bajo_stock BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        (SELECT COUNT(*) FROM citas_medicas 
         WHERE fecha_hora::date BETWEEN fecha_inicio AND fecha_fin) as total_citas,
        
        (SELECT COUNT(*) FROM citas_medicas 
         WHERE fecha_hora::date BETWEEN fecha_inicio AND fecha_fin 
         AND estado = 'Realizada') as citas_realizadas,
        
        (SELECT COUNT(*) FROM citas_medicas 
         WHERE fecha_hora::date BETWEEN fecha_inicio AND fecha_fin 
         AND estado = 'Cancelada') as citas_canceladas,
        
        (SELECT COALESCE(SUM(monto), 0) FROM transacciones_financieras 
         WHERE fecha_transaccion::date BETWEEN fecha_inicio AND fecha_fin 
         AND tipo_transaccion = 'ingreso') as total_ingresos,
        
        (SELECT COALESCE(SUM(monto), 0) FROM transacciones_financieras 
         WHERE fecha_transaccion::date BETWEEN fecha_inicio AND fecha_fin 
         AND tipo_transaccion = 'egreso') as total_egresos,
        
        (SELECT COUNT(*) FROM pacientes 
         WHERE fecha_registro::date BETWEEN fecha_inicio AND fecha_fin) as pacientes_nuevos,
        
        (SELECT COUNT(*) FROM productos 
         WHERE stock < 10) as productos_bajo_stock;
END;
$$ LANGUAGE plpgsql;

-- Procedimiento para obtener horarios disponibles de un doctor
CREATE OR REPLACE FUNCTION obtener_horarios_disponibles(
    p_id_doctor INTEGER,
    p_fecha DATE,
    p_duracion_minutos INTEGER DEFAULT 60
)
RETURNS TABLE (
    hora_inicio TIME,
    hora_fin TIME,
    disponible BOOLEAN
) AS $$
DECLARE
    horario_record RECORD;
    cita_record RECORD;
    hora_actual TIME;
    hora_fin_horario TIME;
    disponible BOOLEAN;
BEGIN
    -- Obtener horario del doctor para el día de la semana
    SELECT hd.hora_inicio, hd.hora_fin INTO horario_record
    FROM horarios_doctor hd
    WHERE hd.id_doctor = p_id_doctor
    AND hd.dia_semana = EXTRACT(DOW FROM p_fecha)
    AND hd.activo = TRUE;
    
    IF NOT FOUND THEN
        RETURN; -- No hay horario para este día
    END IF;
    
    hora_actual := horario_record.hora_inicio;
    hora_fin_horario := horario_record.hora_fin;
    
    WHILE hora_actual + (p_duracion_minutos || ' minutes')::INTERVAL <= hora_fin_horario LOOP
        disponible := TRUE;
        
        -- Verificar si hay cita en este horario
        SELECT 1 INTO cita_record
        FROM citas_medicas c
        WHERE c.id_doctor = p_id_doctor
        AND c.fecha_hora::date = p_fecha
        AND c.fecha_hora::time = hora_actual
        AND c.estado NOT IN ('Cancelada', 'No Asistió');
        
        IF FOUND THEN
            disponible := FALSE;
        END IF;
        
        RETURN QUERY SELECT 
            hora_actual,
            hora_actual + (p_duracion_minutos || ' minutes')::INTERVAL::TIME,
            disponible;
        
        hora_actual := hora_actual + '30 minutes'::INTERVAL;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Procedimiento para generar reporte de productividad
CREATE OR REPLACE FUNCTION generar_reporte_productividad(
    p_id_doctor INTEGER,
    fecha_inicio DATE,
    fecha_fin DATE
)
RETURNS TABLE (
    fecha DATE,
    total_citas BIGINT,
    citas_realizadas BIGINT,
    ingresos_dia NUMERIC,
    tiempo_total_minutos BIGINT
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

-- 6. DATOS INICIALES ADICIONALES
-- =====================================================

-- Insertar configuración inicial del sistema
INSERT INTO configuracion_sistema (clave, valor, descripcion, tipo_dato) VALUES
('nombre_consultorio', 'Denti Salud', 'Nombre del consultorio', 'texto'),
('direccion_consultorio', 'Jr. Lima 123, Moyobamba', 'Dirección del consultorio', 'texto'),
('telefono_consultorio', '999-123-456', 'Teléfono del consultorio', 'texto'),
('email_consultorio', 'info@dentisalud.com', 'Email del consultorio', 'texto'),
('duracion_cita_default', '60', 'Duración por defecto de las citas en minutos', 'numero'),
('recordatorio_antes_horas', '24', 'Horas antes de la cita para enviar recordatorio', 'numero'),
('stock_minimo_alerta', '10', 'Stock mínimo para alertas de inventario', 'numero'),
('moneda_principal', 'PEN', 'Moneda principal del sistema', 'texto'),
('formato_fecha', 'DD/MM/YYYY', 'Formato de fecha por defecto', 'texto'),
('timezone', 'America/Lima', 'Zona horaria del sistema', 'texto');

-- Insertar horarios por defecto para doctores
INSERT INTO horarios_doctor (id_doctor, dia_semana, hora_inicio, hora_fin) VALUES
(1, 1, '09:00', '18:00'), -- Dr. Gómez - Lunes
(1, 2, '09:00', '18:00'), -- Dr. Gómez - Martes
(1, 3, '09:00', '18:00'), -- Dr. Gómez - Miércoles
(1, 4, '09:00', '18:00'), -- Dr. Gómez - Jueves
(1, 5, '09:00', '18:00'), -- Dr. Gómez - Viernes
(1, 6, '09:00', '14:00'), -- Dr. Gómez - Sábado
(2, 1, '08:00', '17:00'), -- Dra. Ávila - Lunes
(2, 2, '08:00', '17:00'), -- Dra. Ávila - Martes
(2, 3, '08:00', '17:00'), -- Dra. Ávila - Miércoles
(2, 4, '08:00', '17:00'), -- Dra. Ávila - Jueves
(2, 5, '08:00', '17:00'), -- Dra. Ávila - Viernes
(2, 6, '08:00', '13:00'); -- Dra. Ávila - Sábado

-- Insertar algunos días no laborables
INSERT INTO dias_no_laborables (fecha, motivo, aplica_todos_doctores) VALUES
('2024-01-01', 'Año Nuevo', TRUE),
('2024-05-01', 'Día del Trabajador', TRUE),
('2024-07-28', 'Fiestas Patrias', TRUE),
('2024-07-29', 'Fiestas Patrias', TRUE),
('2024-12-25', 'Navidad', TRUE);

-- 7. VISTAS ÚTILES
-- =====================================================

-- Vista para resumen de pacientes
CREATE VIEW vista_resumen_pacientes AS
SELECT 
    p.id_paciente,
    p.nombres,
    p.apellidos,
    p.dni,
    p.telefono,
    p.email,
    p.estado_paciente,
    fc.nombre as fuente_captacion,
    a.nombre as aseguradora,
    ln.nombre as linea_negocio,
    p.presupuesto,
    p.ultima_cita,
    p.proxima_cita,
    COUNT(c.id_cita) as total_citas,
    COUNT(CASE WHEN c.estado = 'Realizada' THEN 1 END) as citas_realizadas
FROM pacientes p
LEFT JOIN fuente_captacion fc ON p.id_fuente_captacion = fc.id
LEFT JOIN aseguradora a ON p.id_aseguradora = a.id
LEFT JOIN linea_negocio ln ON p.id_linea_negocio = ln.id
LEFT JOIN citas_medicas c ON p.id_paciente = c.id_paciente
GROUP BY p.id_paciente, p.nombres, p.apellidos, p.dni, p.telefono, p.email, 
         p.estado_paciente, fc.nombre, a.nombre, ln.nombre, p.presupuesto, 
         p.ultima_cita, p.proxima_cita;

-- Vista para resumen financiero
CREATE VIEW vista_resumen_financiero AS
SELECT 
    DATE_TRUNC('day', fecha_transaccion) as fecha,
    tipo_transaccion,
    COUNT(*) as cantidad_transacciones,
    SUM(monto) as total_monto,
    AVG(monto) as promedio_monto
FROM transacciones_financieras
GROUP BY DATE_TRUNC('day', fecha_transaccion), tipo_transaccion
ORDER BY fecha DESC;

-- Vista para inventario con alertas
CREATE VIEW vista_inventario_alertas AS
SELECT 
    p.id_producto,
    p.nombre_producto,
    p.stock,
    p.costo_unitario,
    p.proveedor,
    CASE 
        WHEN p.stock = 0 THEN 'Sin Stock'
        WHEN p.stock < 10 THEN 'Stock Bajo'
        ELSE 'Stock Normal'
    END as estado_stock,
    COALESCE(SUM(mi.cantidad), 0) as movimientos_mes
FROM productos p
LEFT JOIN movimientos_inventario mi ON p.id_producto = mi.id_producto 
    AND mi.fecha_movimiento >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY p.id_producto, p.nombre_producto, p.stock, p.costo_unitario, p.proveedor;

-- 8. COMENTARIOS Y DOCUMENTACIÓN
-- =====================================================

COMMENT ON TABLE horarios_doctor IS 'Horarios de trabajo de cada doctor por día de la semana';
COMMENT ON TABLE dias_no_laborables IS 'Días festivos y vacaciones que afectan la disponibilidad';
COMMENT ON TABLE recordatorios IS 'Sistema de recordatorios automáticos para citas';
COMMENT ON TABLE transacciones_financieras IS 'Registro de todas las transacciones financieras del consultorio';
COMMENT ON TABLE movimientos_inventario IS 'Movimientos de entrada y salida de productos del inventario';
COMMENT ON TABLE campanas_marketing IS 'Campañas de marketing y promociones';
COMMENT ON TABLE segmentaciones IS 'Segmentaciones de pacientes para marketing dirigido';
COMMENT ON TABLE automatizaciones IS 'Reglas de automatización para procesos del consultorio';
COMMENT ON TABLE mensajes_chat IS 'Sistema de chat interno del consultorio';
COMMENT ON TABLE configuracion_sistema IS 'Configuración general del sistema';
COMMENT ON TABLE logs_auditoria IS 'Log de auditoría para todas las operaciones importantes';

-- =====================================================
-- FIN DE LAS MEJORAS
-- =====================================================
