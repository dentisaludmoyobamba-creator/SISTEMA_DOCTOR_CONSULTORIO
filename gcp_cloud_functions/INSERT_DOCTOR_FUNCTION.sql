-- =====================================================================
-- FUNCIÓN PARA INSERTAR DOCTOR EN LA TABLA DOCTORES
-- =====================================================================
-- Esta función debe ser agregada al backend usuarios.py
-- 
-- Propósito: Convertir un usuario con rol Doctor en un registro 
-- completo en la tabla doctores, permitiendo que pueda atender citas.
--
-- Nota: Los campos DNI y COLEGIATURA deben ser únicos y son requeridos.
-- Por ahora, se generarán valores temporales que el administrador
-- deberá actualizar manualmente en la base de datos.
-- =====================================================================

-- Script de ejemplo para insertar manualmente un doctor
-- Reemplaza los valores según corresponda:

INSERT INTO doctores (nombres, apellidos, dni, colegiatura, telefono, id_usuario)
VALUES (
    'NOMBRES_DEL_DOCTOR',           -- Nombres del doctor
    'APELLIDOS_DEL_DOCTOR',         -- Apellidos del doctor
    'TEMP_DNI_' || NEXTVAL('seq_temp_dni'),  -- DNI temporal (debe actualizarse)
    'TEMP_COL_' || NEXTVAL('seq_temp_col'),  -- Colegiatura temporal (debe actualizarse)
    'TELEFONO_DEL_DOCTOR',          -- Teléfono del doctor (opcional)
    ID_USUARIO_AQUI                 -- ID del usuario con rol Doctor
)
ON CONFLICT (id_usuario) DO NOTHING;  -- Evitar duplicados

-- Crear secuencias para DNI y colegiatura temporales (ejecutar solo una vez)
CREATE SEQUENCE IF NOT EXISTS seq_temp_dni START WITH 1000;
CREATE SEQUENCE IF NOT EXISTS seq_temp_col START WITH 1000;

-- =====================================================================
-- CONSULTA PARA VERIFICAR USUARIOS SIN PERFIL DE DOCTOR
-- =====================================================================
-- Esta consulta te mostrará todos los usuarios con rol de Doctor
-- que aún no tienen un registro en la tabla doctores

SELECT 
    u.id_usuario,
    u.nombre_usuario,
    u.email,
    r.nombre_rol,
    u.activo,
    CASE 
        WHEN d.id_doctor IS NULL THEN 'NO TIENE PERFIL DE DOCTOR'
        ELSE 'YA ES DOCTOR'
    END AS estado_doctor
FROM usuarios u
LEFT JOIN roles r ON u.id_rol = r.id_rol
LEFT JOIN doctores d ON u.id_usuario = d.id_usuario
WHERE r.nombre_rol = 'Doctor'
ORDER BY 
    CASE WHEN d.id_doctor IS NULL THEN 0 ELSE 1 END,
    u.nombre_usuario;

-- =====================================================================
-- PROCEDIMIENTO PARA REGISTRAR DOCTOR DESDE UN USUARIO
-- =====================================================================
-- Este procedimiento almacenado facilita la conversión de usuario a doctor

CREATE OR REPLACE FUNCTION registrar_doctor_desde_usuario(
    p_id_usuario INTEGER,
    p_nombres VARCHAR(100),
    p_apellidos VARCHAR(100),
    p_telefono VARCHAR(20) DEFAULT ''
)
RETURNS TABLE (
    success BOOLEAN,
    message TEXT,
    id_doctor INTEGER
) AS $$
DECLARE
    v_id_rol INTEGER;
    v_nombre_rol VARCHAR(50);
    v_doctor_existente INTEGER;
    v_nuevo_id_doctor INTEGER;
    v_dni_temp VARCHAR(15);
    v_colegiatura_temp VARCHAR(20);
BEGIN
    -- Verificar que el usuario existe y tiene rol de Doctor
    SELECT u.id_rol, r.nombre_rol INTO v_id_rol, v_nombre_rol
    FROM usuarios u
    LEFT JOIN roles r ON u.id_rol = r.id_rol
    WHERE u.id_usuario = p_id_usuario;
    
    IF v_id_rol IS NULL THEN
        RETURN QUERY SELECT FALSE, 'Usuario no encontrado'::TEXT, NULL::INTEGER;
        RETURN;
    END IF;
    
    IF v_nombre_rol != 'Doctor' THEN
        RETURN QUERY SELECT FALSE, 'El usuario no tiene rol de Doctor'::TEXT, NULL::INTEGER;
        RETURN;
    END IF;
    
    -- Verificar si ya existe un doctor para este usuario
    SELECT d.id_doctor INTO v_doctor_existente
    FROM doctores d
    WHERE d.id_usuario = p_id_usuario;
    
    IF v_doctor_existente IS NOT NULL THEN
        RETURN QUERY SELECT FALSE, 'Este usuario ya tiene un perfil de doctor registrado'::TEXT, v_doctor_existente;
        RETURN;
    END IF;
    
    -- Generar DNI y colegiatura temporales únicos (respetando límites de caracteres)
    -- DNI: máximo 15 caracteres
    v_dni_temp := 'TMP' || LPAD(p_id_usuario::TEXT, 4, '0') || RIGHT(EXTRACT(EPOCH FROM NOW())::BIGINT::TEXT, 6);
    -- Colegiatura: máximo 20 caracteres
    v_colegiatura_temp := 'COL' || LPAD(p_id_usuario::TEXT, 4, '0') || RIGHT(EXTRACT(EPOCH FROM NOW())::BIGINT::TEXT, 10);
    
    -- Insertar el nuevo doctor
    INSERT INTO doctores (nombres, apellidos, dni, colegiatura, telefono, id_usuario)
    VALUES (p_nombres, p_apellidos, v_dni_temp, v_colegiatura_temp, p_telefono, p_id_usuario)
    RETURNING id_doctor INTO v_nuevo_id_doctor;
    
    RETURN QUERY SELECT 
        TRUE, 
        'Doctor registrado exitosamente. IMPORTANTE: Debe actualizar el DNI (' || v_dni_temp || ') y la colegiatura (' || v_colegiatura_temp || ') en la base de datos.'::TEXT,
        v_nuevo_id_doctor;
END;
$$ LANGUAGE plpgsql;

-- =====================================================================
-- EJEMPLO DE USO DEL PROCEDIMIENTO
-- =====================================================================
-- Para registrar un doctor desde un usuario existente:

-- SELECT * FROM registrar_doctor_desde_usuario(
--     5,                              -- ID del usuario
--     'Juan Carlos',                  -- Nombres
--     'Pérez García',                 -- Apellidos
--     '+51 999 888 777'              -- Teléfono (opcional)
-- );

-- =====================================================================
-- CONSULTA PARA ACTUALIZAR DNI Y COLEGIATURA TEMPORAL
-- =====================================================================
-- Después de registrar un doctor, actualiza sus datos reales:

-- UPDATE doctores 
-- SET 
--     dni = '12345678',              -- DNI real del doctor
--     colegiatura = 'COP12345'       -- Colegiatura real del doctor
-- WHERE id_usuario = ID_USUARIO_AQUI
-- AND dni LIKE 'TMP%';

-- =====================================================================
-- CONSULTA PARA VER DOCTORES CON DATOS TEMPORALES
-- =====================================================================
-- Lista doctores que necesitan actualización de DNI/colegiatura:

SELECT 
    d.id_doctor,
    d.nombres,
    d.apellidos,
    d.dni,
    d.colegiatura,
    d.telefono,
    u.nombre_usuario,
    u.email,
    CASE 
        WHEN d.dni LIKE 'TMP%' THEN '⚠️ DNI TEMPORAL - REQUIERE ACTUALIZACIÓN'
        ELSE '✓ DNI OK'
    END AS estado_dni,
    CASE 
        WHEN d.colegiatura LIKE 'COL%' AND LENGTH(d.colegiatura) > 10 THEN '⚠️ COLEGIATURA TEMPORAL - REQUIERE ACTUALIZACIÓN'
        ELSE '✓ COLEGIATURA OK'
    END AS estado_colegiatura
FROM doctores d
INNER JOIN usuarios u ON d.id_usuario = u.id_usuario
WHERE d.dni LIKE 'TMP%' OR (d.colegiatura LIKE 'COL%' AND LENGTH(d.colegiatura) > 10)
ORDER BY d.id_doctor DESC;

