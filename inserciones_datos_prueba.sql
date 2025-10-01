-- =====================================================
-- DATOS DE PRUEBA PARA EL SISTEMA DE CONSULTORIO
-- =====================================================

-- Insertar datos básicos si no existen
INSERT INTO roles (nombre_rol, descripcion) VALUES
('Administrador', 'Acceso total al sistema'),
('Doctor', 'Acceso a historias clínicas y agenda propia'),
('Recepcionista', 'Acceso a la gestión de citas y pagos')
ON CONFLICT (nombre_rol) DO NOTHING;

-- Usuarios de prueba
INSERT INTO usuarios (nombre_usuario, contrasena_hash, email, id_rol) VALUES
('admin', 'hash_admin_pass', 'admin@consultorio.com', 1),
('dr.gomez', 'hash_doc1_pass', 'c.gomez@consultorio.com', 2),
('dra.avila', 'hash_doc2_pass', 'm.avila@consultorio.com', 2),
('recepcion1', 'hash_recep_pass', 'recepcion@consultorio.com', 3)
ON CONFLICT (nombre_usuario) DO NOTHING;

-- Especialidades
INSERT INTO especialidades (nombre_especialidad, descripcion) VALUES
('Odontología General', 'Tratamientos dentales básicos y preventivos.'),
('Ortodoncia', 'Corrección de la posición de los dientes y mandíbula.'),
('Endodoncia', 'Tratamiento de las enfermedades de la pulpa dental.'),
('Periodoncia', 'Tratamiento de las enfermedades de las encías.')
ON CONFLICT (nombre_especialidad) DO NOTHING;

-- Doctores
INSERT INTO doctores (nombres, apellidos, dni, colegiatura, telefono, id_usuario) VALUES
('Carlos', 'Gómez', '11223344D', 'OD-1020', '555-1122', 2),
('Mariela', 'Ávila', '55667788E', 'OD-1035', '555-3344', 3)
ON CONFLICT (dni) DO NOTHING;

-- Asignación de especialidades a doctores
INSERT INTO doctor_especialidad (id_doctor, id_especialidad) VALUES
(1, 1), -- Dr. Gómez es Odontólogo General
(1, 3), -- Dr. Gómez también es Endodoncista
(2, 1), -- Dra. Ávila es Odontóloga General
(2, 2)  -- Dra. Ávila también es Ortodoncista
ON CONFLICT (id_doctor, id_especialidad) DO NOTHING;

-- Pacientes de prueba
INSERT INTO pacientes (nombres, apellidos, fecha_nacimiento, genero, dni, telefono, direccion, email, presupuesto, comentario, tarea, ultima_cita, proxima_cita) VALUES
('Ana', 'López García', '1990-05-15', 'F', '12345678A', '555-1234', 'Calle Falsa 123', 'ana.lopez@email.com', 500.00, 'Paciente regular, muy puntual', 'Seguimiento de limpieza', '2024-12-15', '2025-01-15'),
('Juan', 'Martínez Pérez', '1985-11-20', 'M', '87654321B', '555-5678', 'Avenida Siempreviva 742', 'juan.martinez@email.com', 1200.00, 'Necesita tratamiento de ortodoncia', 'Evaluación de brackets', '2024-12-10', '2025-01-20'),
('Sofía', 'Rodríguez Castillo', '2001-08-30', 'F', '45678912C', '555-8765', 'Plaza Mayor 1', 'sofia.rodriguez@email.com', 800.00, 'Primera consulta exitosa', 'Radiografías panorámicas', '2024-12-20', '2025-01-25'),
('Miguel', 'García Torres', '1978-03-12', 'M', '98765432D', '555-9999', 'Calle Principal 456', 'miguel.garcia@email.com', 300.00, 'Paciente nuevo', 'Consulta inicial', NULL, '2025-01-30'),
('Laura', 'Fernández Ruiz', '1995-07-08', 'F', '54321678E', '555-1111', 'Avenida Central 789', 'laura.fernandez@email.com', 1500.00, 'Tratamiento de endodoncia completado', 'Control post-tratamiento', '2024-12-18', '2025-02-01')
ON CONFLICT (dni) DO NOTHING;

-- Citas médicas de prueba
INSERT INTO citas_medicas (id_paciente, id_doctor, fecha_hora, motivo_consulta, estado, notas_recepcion) VALUES
(1, 1, '2024-12-15 10:00:00-05', 'Limpieza dental y revisión general', 'Realizada', 'Paciente muy colaborativa, sin problemas'),
(2, 2, '2024-12-10 15:30:00-05', 'Consulta para ortodoncia', 'Realizada', 'Necesita radiografías para plan de tratamiento'),
(3, 2, '2024-12-20 12:00:00-05', 'Primera consulta de ortodoncia', 'Realizada', 'Paciente joven, muy motivada'),
(1, 1, '2025-01-15 10:00:00-05', 'Seguimiento de limpieza', 'Programada', 'Recordar traer radiografías'),
(2, 2, '2025-01-20 15:30:00-05', 'Evaluación de brackets', 'Programada', 'Revisar presupuesto de ortodoncia'),
(3, 2, '2025-01-25 12:00:00-05', 'Radiografías panorámicas', 'Programada', 'Preparar plan de tratamiento'),
(4, 1, '2025-01-30 09:00:00-05', 'Consulta inicial', 'Programada', 'Paciente nuevo, primera vez'),
(5, 1, '2024-12-18 14:00:00-05', 'Control post-endodoncia', 'Realizada', 'Tratamiento exitoso, paciente satisfecha'),
(5, 1, '2025-02-01 14:00:00-05', 'Control final', 'Programada', 'Última cita de seguimiento'),
(1, 2, '2024-11-20 11:00:00-05', 'Consulta de emergencia', 'Cancelada', 'Paciente canceló por motivos personales')
ON CONFLICT DO NOTHING;

-- Tratamientos
INSERT INTO tratamientos (nombre_tratamiento, descripcion, costo_base) VALUES
('Limpieza Dental', 'Eliminación de placa y sarro.', 50.00),
('Empaste de Resina', 'Restauración de un diente afectado por caries.', 80.00),
('Extracción Simple', 'Extracción de un diente visible.', 70.00),
('Consulta de Ortodoncia', 'Evaluación para tratamiento de brackets.', 40.00),
('Blanqueamiento Dental', 'Tratamiento estético para aclarar el tono de los dientes.', 250.00),
('Endodoncia', 'Tratamiento de conducto radicular.', 300.00),
('Radiografía Panorámica', 'Radiografía completa de la boca.', 25.00)
ON CONFLICT (nombre_tratamiento) DO NOTHING;

-- Datos para tablas de segmentación
INSERT INTO linea_negocio (nombre) VALUES 
('Ortodoncia'), 
('Estética'), 
('Rehabilitación')
ON CONFLICT DO NOTHING;

INSERT INTO fuente_captacion (nombre) VALUES 
('Facebook'), 
('amigos-familiares'), 
('Instagram'), 
('tik tok')
ON CONFLICT DO NOTHING;

INSERT INTO aseguradora (nombre) VALUES 
('AUNA'), 
('Cardif'), 
('Chubb'), 
('Dinners Coris gols'), 
('Dinner gold')
ON CONFLICT DO NOTHING;

-- Datos de configuración del sistema
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
('timezone', 'America/Lima', 'Zona horaria del sistema', 'texto')
ON CONFLICT (clave) DO NOTHING;

-- Horarios de doctores
INSERT INTO horarios_doctor (id_doctor, dia_semana, hora_inicio, hora_fin) VALUES
(1, 1, '09:00', '18:00'), (1, 2, '09:00', '18:00'), (1, 3, '09:00', '18:00'),
(1, 4, '09:00', '18:00'), (1, 5, '09:00', '18:00'), (1, 6, '09:00', '14:00'),
(2, 1, '08:00', '17:00'), (2, 2, '08:00', '17:00'), (2, 3, '08:00', '17:00'),
(2, 4, '08:00', '17:00'), (2, 5, '08:00', '17:00'), (2, 6, '08:00', '13:00')
ON CONFLICT DO NOTHING;

-- Días no laborables
INSERT INTO dias_no_laborables (fecha, motivo, aplica_todos_doctores) VALUES
('2024-01-01', 'Año Nuevo', TRUE), 
('2024-05-01', 'Día del Trabajador', TRUE),
('2024-07-28', 'Fiestas Patrias', TRUE), 
('2024-07-29', 'Fiestas Patrias', TRUE),
('2024-12-25', 'Navidad', TRUE)
ON CONFLICT DO NOTHING;

-- Productos de inventario
INSERT INTO productos (nombre_producto, descripcion, stock, proveedor, costo_unitario, stock_minimo) VALUES
('Guantes de Nitrilo (Caja 100u)', 'Guantes desechables talla M', 50, 'DentalPro', 10.00, 10),
('Anestesia Lidocaína 2%', 'Cartucho de anestesia local', 200, 'PharmaDent', 1.50, 20),
('Resina Compuesta A2', 'Material para empastes estéticos', 30, '3M Dental', 25.00, 5),
('Jeringas Desechables', 'Jeringas de 3ml para anestesia', 100, 'MedSupply', 0.50, 15),
('Algodón Estéril', 'Algodón para procedimientos', 500, 'DentalPro', 0.10, 50)
ON CONFLICT DO NOTHING;
