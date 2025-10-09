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

-- Pacientes de prueba con datos de filiación completos
INSERT INTO pacientes (nombres, apellidos, fecha_nacimiento, genero, dni, telefono, direccion, email, presupuesto, comentario, tarea, ultima_cita, proxima_cita, id_fuente_captacion, id_aseguradora, id_linea_negocio) VALUES
('Ana', 'López García', '1990-05-15', 'F', '12345678A', '555-1234', 'Calle Falsa 123', 'ana.lopez@email.com', 500.00, 'Paciente regular, muy puntual', 'Seguimiento de limpieza', '2024-12-15', '2025-01-15', 1, 1, 3),
('Juan', 'Martínez Pérez', '1985-11-20', 'M', '87654321B', '555-5678', 'Avenida Siempreviva 742', 'juan.martinez@email.com', 1200.00, 'Necesita tratamiento de ortodoncia', 'Evaluación de brackets', '2024-12-10', '2025-01-20', 3, 2, 1),
('Sofía', 'Rodríguez Castillo', '2001-08-30', 'F', '45678912C', '555-8765', 'Plaza Mayor 1', 'sofia.rodriguez@email.com', 800.00, 'Primera consulta exitosa', 'Radiografías panorámicas', '2024-12-20', '2025-01-25', 2, 1, 2),
('Miguel', 'García Torres', '1978-03-12', 'M', '98765432D', '555-9999', 'Calle Principal 456', 'miguel.garcia@email.com', 300.00, 'Paciente nuevo', 'Consulta inicial', NULL, '2025-01-30', 4, 3, 3),
('Laura', 'Fernández Ruiz', '1995-07-08', 'F', '54321678E', '555-1111', 'Avenida Central 789', 'laura.fernandez@email.com', 1500.00, 'Tratamiento de endodoncia completado', 'Control post-tratamiento', '2024-12-18', '2025-02-01', 3, 1, 4)
ON CONFLICT (dni) DO NOTHING;

-- Citas médicas de prueba (incluye semana actual para agenda)
INSERT INTO citas_medicas (id_paciente, id_doctor, fecha_hora, motivo_consulta, estado, notas_recepcion, duracion_minutos) VALUES
-- Citas de la semana actual
(1, 1, CURRENT_DATE + INTERVAL '0 days' + TIME '09:00', 'Limpieza dental programada', 'Programada', 'Cita de rutina', 60),
(2, 2, CURRENT_DATE + INTERVAL '0 days' + TIME '10:00', 'Consulta de ortodoncia', 'Confirmada', 'Revisar progreso de brackets', 60),
(3, 1, CURRENT_DATE + INTERVAL '1 days' + TIME '11:00', 'Control post-operatorio', 'Programada', 'Seguimiento después de cirugía', 60),
(4, 2, CURRENT_DATE + INTERVAL '1 days' + TIME '14:00', 'Primera consulta', 'Pendiente', 'Paciente nuevo, evaluación inicial', 90),
(5, 1, CURRENT_DATE + INTERVAL '2 days' + TIME '09:00', 'Endodoncia', 'Confirmada', 'Tratamiento de conducto', 120),
(1, 2, CURRENT_DATE + INTERVAL '2 days' + TIME '15:00', 'Seguimiento de ortodoncia', 'Programada', 'Ajuste de brackets', 60),
(2, 1, CURRENT_DATE + INTERVAL '3 days' + TIME '10:00', 'Extracción dental', 'Confirmada', 'Extracción de muela del juicio', 90),
(3, 2, CURRENT_DATE + INTERVAL '4 days' + TIME '16:00', 'Consulta estética', 'Programada', 'Evaluación para blanqueamiento', 60),
(4, 1, CURRENT_DATE + INTERVAL '5 days' + TIME '09:00', 'Revisión general', 'Programada', 'Chequeo anual', 60),
(5, 2, CURRENT_DATE + INTERVAL '5 days' + TIME '11:00', 'Urgencia dental', 'Pendiente', 'Dolor agudo en molar', 60),

-- Citas históricas
(1, 1, '2024-12-15 10:00:00-05', 'Limpieza dental y revisión general', 'Realizada', 'Paciente muy colaborativa, sin problemas', 60),
(2, 2, '2024-12-10 15:30:00-05', 'Consulta para ortodoncia', 'Realizada', 'Necesita radiografías para plan de tratamiento', 60),
(3, 2, '2024-12-20 12:00:00-05', 'Primera consulta de ortodoncia', 'Realizada', 'Paciente joven, muy motivada', 60),
(5, 1, '2024-12-18 14:00:00-05', 'Control post-endodoncia', 'Realizada', 'Tratamiento exitoso, paciente satisfecha', 60),
(1, 2, '2024-11-20 11:00:00-05', 'Consulta de emergencia', 'Cancelada', 'Paciente canceló por motivos personales', 60),

-- Citas futuras
(1, 1, CURRENT_DATE + INTERVAL '7 days' + TIME '10:00', 'Seguimiento de limpieza', 'Programada', 'Recordar traer radiografías', 60),
(2, 2, CURRENT_DATE + INTERVAL '14 days' + TIME '15:30', 'Evaluación de brackets', 'Programada', 'Revisar presupuesto de ortodoncia', 60),
(3, 2, CURRENT_DATE + INTERVAL '21 days' + TIME '12:00', 'Radiografías panorámicas', 'Programada', 'Preparar plan de tratamiento', 60),
(4, 1, CURRENT_DATE + INTERVAL '28 days' + TIME '09:00', 'Consulta de seguimiento', 'Programada', 'Evaluación de progreso', 60),
(5, 1, CURRENT_DATE + INTERVAL '35 days' + TIME '14:00', 'Control final', 'Programada', 'Última cita de seguimiento', 60)
ON CONFLICT DO NOTHING;

-- Fuentes de captación
INSERT INTO fuente_captacion (nombre) VALUES 
('Facebook'),
('Instagram'),
('Recomendación'),
('Google'),
('Otros')
ON CONFLICT (nombre) DO NOTHING;

-- Aseguradoras
INSERT INTO aseguradora (nombre) VALUES 
('Rimac'),
('Pacífico'),
('La Positiva'),
('Mapfre'),
('Otros')
ON CONFLICT (nombre) DO NOTHING;

-- Líneas de negocio
INSERT INTO linea_negocio (nombre) VALUES 
('Ortodoncia'),
('Estética'),
('General'),
('Endodoncia'),
('Cirugía')
ON CONFLICT (nombre) DO NOTHING;

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

-- Etiquetas de pacientes
INSERT INTO etiquetas_paciente (nombre, color, descripcion, activa) VALUES
('Nuevo', 'bg-blue-100 text-blue-800', 'Paciente nuevo en el sistema', true),
('VIP', 'bg-purple-100 text-purple-800', 'Paciente VIP con atención preferencial', true),
('Impuntual', 'bg-orange-100 text-orange-800', 'Paciente con historial de retrasos', true),
('Fidelizado', 'bg-green-100 text-green-800', 'Paciente con alta fidelidad al consultorio', true),
('Deudor', 'bg-red-100 text-red-800', 'Paciente con pagos pendientes', true),
('Referido', 'bg-teal-100 text-teal-800', 'Paciente que llegó por referencia', true),
('Prioritario', 'bg-yellow-100 text-yellow-800', 'Requiere atención prioritaria', true)
ON CONFLICT DO NOTHING;

-- Asignar etiquetas a pacientes de prueba
INSERT INTO paciente_etiquetas (id_paciente, id_etiqueta) VALUES
-- Juan Pérez: Nuevo, VIP
(1, 1), (1, 2),
-- María García: Fidelizado
(2, 4),
-- Carlos López: Impuntual
(3, 3),
-- Ana Martínez: VIP, Fidelizado
(4, 2), (4, 4)
ON CONFLICT DO NOTHING;

-- Productos de inventario
INSERT INTO productos (nombre_producto, descripcion, stock, proveedor, costo_unitario, stock_minimo) VALUES
('Guantes de Nitrilo (Caja 100u)', 'Guantes desechables talla M', 50, 'DentalPro', 10.00, 10),
('Anestesia Lidocaína 2%', 'Cartucho de anestesia local', 200, 'PharmaDent', 1.50, 20),
('Resina Compuesta A2', 'Material para empastes estéticos', 30, '3M Dental', 25.00, 5),
('Jeringas Desechables', 'Jeringas de 3ml para anestesia', 100, 'MedSupply', 0.50, 15),
('Algodón Estéril', 'Algodón para procedimientos', 500, 'DentalPro', 0.10, 50)
ON CONFLICT DO NOTHING;
