-- =====================================================
-- SCRIPT PARA INSERTAR USUARIO POR DEFECTO
-- =====================================================

-- Insertar rol por defecto si no existe
INSERT INTO roles (id_rol, nombre_rol, descripcion) 
VALUES (1, 'Administrador', 'Administrador del sistema')
ON CONFLICT (id_rol) DO NOTHING;

-- Insertar usuario por defecto si no existe
INSERT INTO usuarios (id_usuario, nombre_usuario, contrasena_hash, email, id_rol, activo) 
VALUES (1, 'admin', 'admin123', 'admin@consultorio.com', 1, true)
ON CONFLICT (id_usuario) DO NOTHING;

-- Verificar que el usuario fue creado
SELECT id_usuario, nombre_usuario, email, id_rol, activo 
FROM usuarios 
WHERE id_usuario = 1;

-- Mostrar todos los usuarios disponibles
SELECT id_usuario, nombre_usuario, email, id_rol, activo 
FROM usuarios 
ORDER BY id_usuario;