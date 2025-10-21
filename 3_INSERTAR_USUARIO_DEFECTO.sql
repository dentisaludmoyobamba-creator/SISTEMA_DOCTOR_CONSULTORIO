-- =====================================================
-- SCRIPT PARA INSERTAR USUARIO POR DEFECTO
-- =====================================================

-- Insertar rol por defecto
INSERT INTO roles (id_rol, nombre_rol, descripcion) 
VALUES (1, 'Administrador', 'Administrador del sistema')
ON CONFLICT (id_rol) DO UPDATE SET 
    nombre_rol = EXCLUDED.nombre_rol,
    descripcion = EXCLUDED.descripcion;

-- Insertar usuario por defecto
INSERT INTO usuarios (id_usuario, nombre_usuario, contrasena_hash, email, id_rol, activo) 
VALUES (1, 'admin', 'admin123', 'admin@consultorio.com', 1, true)
ON CONFLICT (id_usuario) DO UPDATE SET 
    nombre_usuario = EXCLUDED.nombre_usuario,
    contrasena_hash = EXCLUDED.contrasena_hash,
    email = EXCLUDED.email,
    id_rol = EXCLUDED.id_rol,
    activo = EXCLUDED.activo;

-- Verificar que el usuario fue creado
SELECT 'Usuario creado:' as mensaje, id_usuario, nombre_usuario, email, id_rol, activo 
FROM usuarios 
WHERE id_usuario = 1;

-- Mostrar todos los usuarios disponibles
SELECT 'Todos los usuarios:' as mensaje, id_usuario, nombre_usuario, email, id_rol, activo 
FROM usuarios 
ORDER BY id_usuario;
