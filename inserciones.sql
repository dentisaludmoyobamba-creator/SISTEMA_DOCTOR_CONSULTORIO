-- =====================================================================
-- || ARCHIVO DE INSERCIONES COMPLETAS - CONSULTORIO DENTI SALUD ||
-- =====================================================================
-- Este archivo contiene datos de prueba completos para todas las tablas
-- del sistema de consultorio dental, permitiendo practicar con el proyecto
-- =====================================================================

-- =====================================================
-- 1. DATOS MAESTROS Y CATÁLOGOS
-- =====================================================

-- Roles del sistema
INSERT INTO roles (nombre_rol, descripcion) VALUES
('Administrador', 'Acceso total al sistema - gestión completa'),
('Doctor', 'Acceso a historias clínicas, agenda propia y pacientes'),
('Recepcionista', 'Gestión de citas, pagos y atención al cliente'),
('Asistente', 'Apoyo en consultas y procedimientos menores'),
('Contador', 'Gestión financiera y reportes contables');

-- Usuarios del sistema
INSERT INTO usuarios (nombre_usuario, contrasena_hash, email, id_rol, activo, ultimo_login) VALUES
('admin', '$2b$10$abcdefghijklmnopqrstuvwxyz123456', 'admin@dentisalud.com', 1, TRUE, '2024-09-29 08:30:00-05'),
('dr.carlos', '$2b$10$bcdefghijklmnopqrstuvwxyz234567', 'carlos.gomez@dentisalud.com', 2, TRUE, '2024-09-29 07:45:00-05'),
('dra.maria', '$2b$10$cdefghijklmnopqrstuvwxyz345678', 'maria.avila@dentisalud.com', 2, TRUE, '2024-09-29 08:00:00-05'),
('dr.luis', '$2b$10$defghijklmnopqrstuvwxyz456789', 'luis.torres@dentisalud.com', 2, TRUE, '2024-09-28 16:30:00-05'),
('recepcion1', '$2b$10$efghijklmnopqrstuvwxyz567890', 'recepcion@dentisalud.com', 3, TRUE, '2024-09-29 08:15:00-05'),
('asistente1', '$2b$10$fghijklmnopqrstuvwxyz678901', 'asistente@dentisalud.com', 4, TRUE, '2024-09-29 07:30:00-05'),
('contador1', '$2b$10$ghijklmnopqrstuvwxyz789012', 'contador@dentisalud.com', 5, TRUE, '2024-09-28 17:00:00-05'),
('recepcion2', '$2b$10$hijklmnopqrstuvwxyz890123', 'recepcion2@dentisalud.com', 3, TRUE, '2024-09-29 14:00:00-05');

-- Especialidades médicas
INSERT INTO especialidades (nombre_especialidad, descripcion) VALUES
('Odontología General', 'Tratamientos dentales básicos, preventivos y de mantenimiento'),
('Ortodoncia', 'Corrección de la posición de los dientes y estructuras maxilofaciales'),
('Endodoncia', 'Tratamiento de enfermedades de la pulpa dental y conductos radiculares'),
('Periodoncia', 'Tratamiento de enfermedades de las encías y tejidos de soporte dental'),
('Cirugía Oral', 'Procedimientos quirúrgicos en la cavidad oral y maxilofacial'),
('Odontopediatría', 'Odontología especializada en niños y adolescentes'),
('Prostodoncia', 'Rehabilitación oral con prótesis dentales'),
('Estética Dental', 'Tratamientos estéticos y cosméticos dentales');

-- Doctores
INSERT INTO doctores (nombres, apellidos, dni, colegiatura, telefono, id_usuario) VALUES
('Carlos Eduardo', 'Gómez Ruiz', '12345678', 'COP-1020', '942-123-456', 2),
('María Elena', 'Ávila Castillo', '23456789', 'COP-1035', '942-234-567', 3),
('Luis Alberto', 'Torres Mendoza', '34567890', 'COP-1042', '942-345-678', 4);

-- Especialidades de los doctores
INSERT INTO doctor_especialidad (id_doctor, id_especialidad) VALUES
(1, 1), (1, 3), (1, 5), -- Dr. Gómez: General, Endodoncia, Cirugía
(2, 1), (2, 2), (2, 8), -- Dra. Ávila: General, Ortodoncia, Estética
(3, 1), (3, 4), (3, 6); -- Dr. Torres: General, Periodoncia, Odontopediatría

-- Fuentes de captación
INSERT INTO fuente_captacion (nombre, estado) VALUES
('Facebook', '1'), ('Instagram', '1'), ('TikTok', '1'), ('Google Ads', '1'),
('Amigos/Familiares', '1'), ('Página Web', '1'), ('Volantes', '1'),
('Radio Local', '1'), ('Recomendación Médica', '1'), ('Campaña SMS', '1');

-- Aseguradoras
INSERT INTO aseguradora (nombre, estado) VALUES
('AUNA', '1'), ('Cardif', '1'), ('Chubb', '1'), ('Dinners Club', '1'),
('Rimac Seguros', '1'), ('La Positiva', '1'), ('Pacífico Seguros', '1'),
('Mapfre', '1'), ('Sin Seguro', '1'), ('EsSalud', '1');

-- Líneas de negocio
INSERT INTO linea_negocio (nombre, estado) VALUES
('Ortodoncia', '1'), ('Estética Dental', '1'), ('Rehabilitación Oral', '1'),
('Odontopediatría', '1'), ('Cirugía Oral', '1'), ('Periodoncia', '1'),
('Endodoncia', '1'), ('Prevención', '1'), ('Urgencias', '1'), ('Implantología', '1');

-- =====================================================
-- 2. PACIENTES CON DATOS COMPLETOS
-- =====================================================

INSERT INTO pacientes (nombres, apellidos, fecha_nacimiento, genero, dni, telefono, direccion, email, id_fuente_captacion, id_aseguradora, id_linea_negocio, presupuesto, estado_paciente, avatar, etiqueta, etiqueta_color, notas, alergias) VALUES
('Ana Lucía', 'López García', '1990-05-15', 'F', '12345678', '942-111-111', 'Jr. Lima 123, Moyobamba', 'ana.lopez@email.com', 1, 1, 2, 1200.00, 'activo', '👩', 'VIP', '#FFD700', 'Paciente muy puntual, prefiere citas matutinas', 'Alergia a la penicilina'),
('Juan Carlos', 'Martínez Pérez', '1985-11-20', 'M', '23456789', '942-222-222', 'Av. Grau 456, Moyobamba', 'juan.martinez@email.com', 2, 5, 1, 2500.00, 'activo', '👨', 'Regular', '#87CEEB', 'Trabaja en horario de oficina', 'Ninguna conocida'),
('Sofía Isabel', 'Rodríguez Castillo', '2001-08-30', 'F', '34567890', '942-333-333', 'Plaza Mayor 1, Moyobamba', 'sofia.rodriguez@email.com', 5, 9, 1, 1800.00, 'activo', '👧', 'Joven', '#FFB6C1', 'Estudiante universitaria', 'Alergia al látex'),
('Roberto', 'Silva Vásquez', '1975-03-12', 'M', '45678901', '942-444-444', 'Calle Real 789, Moyobamba', 'roberto.silva@email.com', 3, 2, 3, 3200.00, 'activo', '👨', 'Premium', '#DDA0DD', 'Empresario local, flexible con horarios', 'Ninguna'),
('Carmen Rosa', 'Flores Díaz', '1968-12-08', 'F', '56789012', '942-555-555', 'Jr. Bolívar 321, Moyobamba', 'carmen.flores@email.com', 4, 10, 4, 800.00, 'activo', '👩', 'Senior', '#F0E68C', 'Paciente de la tercera edad, necesita más tiempo', 'Diabetes, hipertensión'),
('Diego Alejandro', 'Ramírez Castro', '2010-07-22', 'M', '67890123', '942-666-666', 'Av. Circunvalación 654, Moyobamba', 'diego.ramirez@email.com', 6, 9, 4, 600.00, 'activo', '👦', 'Niño', '#98FB98', 'Paciente pediátrico, viene con mamá', 'Ninguna conocida'),
('Patricia', 'Mendoza Torres', '1992-09-14', 'F', '78901234', '942-777-777', 'Calle Amazonas 987, Moyobamba', 'patricia.mendoza@email.com', 1, 3, 2, 1500.00, 'activo', '👩', 'Regular', '#F4A460', 'Profesora, prefiere citas vespertinas', 'Alergia a anestésicos locales'),
('Miguel Ángel', 'Herrera Sánchez', '1980-01-25', 'M', '89012345', '942-888-888', 'Jr. San Martín 147, Moyobamba', 'miguel.herrera@email.com', 7, 4, 5, 2200.00, 'activo', '👨', 'Regular', '#DEB887', 'Comerciante, horario flexible', 'Ninguna'),
('Lucía Fernanda', 'Vargas Morales', '1995-04-18', 'F', '90123456', '942-999-999', 'Av. Tarapoto 258, Moyobamba', 'lucia.vargas@email.com', 2, 6, 6, 900.00, 'activo', '👩', 'Joven', '#F0F8FF', 'Enfermera, entiende procedimientos médicos', 'Ninguna conocida'),
('Fernando', 'Chávez Ruiz', '1963-06-30', 'M', '01234567', '942-000-000', 'Calle Progreso 369, Moyobamba', 'fernando.chavez@email.com', 8, 7, 7, 1100.00, 'activo', '👨', 'Senior', '#E6E6FA', 'Jubilado, muy puntual', 'Marcapasos'),
('Isabella', 'García López', '2005-11-03', 'F', '11234567', '942-111-222', 'Jr. Libertad 741, Moyobamba', 'isabella.garcia@email.com', 9, 9, 4, 750.00, 'activo', '👧', 'Adolescente', '#FFE4E1', 'Adolescente, viene con padres', 'Brackets metálicos'),
('Andrés', 'Moreno Jiménez', '1988-02-17', 'M', '22345678', '942-222-333', 'Av. Los Andes 852, Moyobamba', 'andres.moreno@email.com', 10, 8, 8, 500.00, 'activo', '👨', 'Nuevo', '#FFEFD5', 'Paciente nuevo, primera consulta', 'Ninguna conocida');

-- =====================================================
-- 3. TRATAMIENTOS COMPLETOS
-- =====================================================

INSERT INTO tratamientos (nombre_tratamiento, descripcion, costo_base) VALUES
('Consulta General', 'Evaluación odontológica general y diagnóstico', 40.00),
('Limpieza Dental', 'Profilaxis dental con eliminación de placa y sarro', 60.00),
('Empaste de Resina', 'Restauración dental con resina compuesta', 80.00),
('Empaste de Amalgama', 'Restauración dental con amalgama', 70.00),
('Extracción Simple', 'Extracción de diente visible sin complicaciones', 90.00),
('Extracción Quirúrgica', 'Extracción de diente con procedimiento quirúrgico', 150.00),
('Endodoncia Unirradicular', 'Tratamiento de conducto en diente de una raíz', 200.00),
('Endodoncia Multirradicular', 'Tratamiento de conducto en diente de múltiples raíces', 280.00),
('Corona de Porcelana', 'Corona dental de porcelana sobre metal', 350.00),
('Corona de Zirconio', 'Corona dental de zirconio completo', 450.00),
('Blanqueamiento Dental', 'Tratamiento estético para aclarar dientes', 250.00),
('Brackets Metálicos', 'Ortodoncia con brackets tradicionales', 1200.00),
('Brackets Estéticos', 'Ortodoncia con brackets de cerámica', 1500.00),
('Invisalign', 'Ortodoncia invisible con alineadores', 2500.00),
('Implante Dental', 'Implante de titanio con corona', 800.00),
('Prótesis Parcial', 'Prótesis dental parcial removible', 400.00),
('Prótesis Total', 'Prótesis dental completa', 600.00),
('Limpieza Profunda', 'Raspaje y alisado radicular por cuadrante', 120.00),
('Cirugía Periodontal', 'Cirugía de encías y tejidos periodontales', 300.00),
('Sellantes', 'Aplicación de sellantes en molares', 35.00),
('Fluorización', 'Aplicación tópica de flúor', 25.00),
('Radiografía Periapical', 'Radiografía dental individual', 15.00),
('Radiografía Panorámica', 'Radiografía panorámica completa', 45.00),
('Urgencia Dental', 'Atención de emergencia dental', 50.00),
('Carillas de Porcelana', 'Carillas estéticas de porcelana', 400.00);

-- =====================================================
-- 4. HORARIOS DE DOCTORES
-- =====================================================

INSERT INTO horarios_doctor (id_doctor, dia_semana, hora_inicio, hora_fin, activo) VALUES
-- Dr. Gómez (Lunes a Sábado)
(1, 1, '08:00', '17:00', TRUE), (1, 2, '08:00', '17:00', TRUE), (1, 3, '08:00', '17:00', TRUE),
(1, 4, '08:00', '17:00', TRUE), (1, 5, '08:00', '17:00', TRUE), (1, 6, '08:00', '13:00', TRUE),
-- Dra. Ávila (Lunes a Sábado)
(2, 1, '09:00', '18:00', TRUE), (2, 2, '09:00', '18:00', TRUE), (2, 3, '09:00', '18:00', TRUE),
(2, 4, '09:00', '18:00', TRUE), (2, 5, '09:00', '18:00', TRUE), (2, 6, '09:00', '14:00', TRUE),
-- Dr. Torres (Lunes a Viernes + sábados alternos)
(3, 1, '07:30', '16:30', TRUE), (3, 2, '07:30', '16:30', TRUE), (3, 3, '07:30', '16:30', TRUE),
(3, 4, '07:30', '16:30', TRUE), (3, 5, '07:30', '16:30', TRUE);

-- =====================================================
-- 5. DÍAS NO LABORABLES
-- =====================================================

INSERT INTO dias_no_laborables (fecha, motivo, aplica_todos_doctores, id_doctor, activo) VALUES
('2024-01-01', 'Año Nuevo', TRUE, NULL, TRUE),
('2024-04-18', 'Jueves Santo', TRUE, NULL, TRUE),
('2024-04-19', 'Viernes Santo', TRUE, NULL, TRUE),
('2024-05-01', 'Día del Trabajador', TRUE, NULL, TRUE),
('2024-06-29', 'San Pedro y San Pablo', TRUE, NULL, TRUE),
('2024-07-28', 'Fiestas Patrias', TRUE, NULL, TRUE),
('2024-07-29', 'Fiestas Patrias', TRUE, NULL, TRUE),
('2024-08-30', 'Santa Rosa de Lima', TRUE, NULL, TRUE),
('2024-10-08', 'Combate de Angamos', TRUE, NULL, TRUE),
('2024-11-01', 'Todos los Santos', TRUE, NULL, TRUE),
('2024-12-08', 'Inmaculada Concepción', TRUE, NULL, TRUE),
('2024-12-25', 'Navidad', TRUE, NULL, TRUE),
('2024-12-24', 'Nochebuena (medio día)', TRUE, NULL, TRUE),
('2024-12-31', 'Fin de Año (medio día)', TRUE, NULL, TRUE),
-- Vacaciones específicas por doctor
('2024-10-15', 'Vacaciones Dr. Gómez', FALSE, 1, TRUE),
('2024-10-16', 'Vacaciones Dr. Gómez', FALSE, 1, TRUE),
('2024-11-20', 'Capacitación Dra. Ávila', FALSE, 2, TRUE);

-- =====================================================
-- 6. CITAS MÉDICAS VARIADAS
-- =====================================================

INSERT INTO citas_medicas (id_paciente, id_doctor, fecha_hora, motivo_consulta, estado, duracion_minutos, telefono_contacto, email_contacto, notas_recepcion) VALUES
-- Citas realizadas (pasadas)
(1, 1, '2024-09-01 09:00:00-05', 'Consulta general y limpieza', 'Realizada', 60, '942-111-111', 'ana.lopez@email.com', 'Primera consulta del año'),
(2, 2, '2024-09-02 10:30:00-05', 'Evaluación para ortodoncia', 'Realizada', 90, '942-222-222', 'juan.martinez@email.com', 'Interesado en brackets estéticos'),
(3, 3, '2024-09-03 14:00:00-05', 'Dolor en muela del juicio', 'Realizada', 45, '942-333-333', 'sofia.rodriguez@email.com', 'Urgencia, dolor intenso'),
(4, 1, '2024-09-05 08:30:00-05', 'Consulta para implante', 'Realizada', 60, '942-444-444', 'roberto.silva@email.com', 'Evaluación zona #36'),
(5, 2, '2024-09-06 16:00:00-05', 'Blanqueamiento dental', 'Realizada', 120, '942-555-555', 'carmen.flores@email.com', 'Tratamiento estético'),
(6, 3, '2024-09-07 11:00:00-05', 'Control odontopediátrico', 'Realizada', 30, '942-666-666', 'diego.ramirez@email.com', 'Paciente pediátrico, muy colaborador'),
(7, 1, '2024-09-09 15:30:00-05', 'Endodoncia #24', 'Realizada', 90, '942-777-777', 'patricia.mendoza@email.com', 'Primera sesión de endodoncia'),
(8, 2, '2024-09-10 09:15:00-05', 'Extracción muela del juicio', 'Realizada', 75, '942-888-888', 'miguel.herrera@email.com', 'Extracción quirúrgica'),
(9, 3, '2024-09-11 13:45:00-05', 'Limpieza y control periodontal', 'Realizada', 60, '942-999-999', 'lucia.vargas@email.com', 'Control trimestral'),
(10, 1, '2024-09-12 10:00:00-05', 'Corona de zirconio #15', 'Realizada', 90, '942-000-000', 'fernando.chavez@email.com', 'Toma de impresiones'),

-- Citas programadas (futuras)
(11, 2, '2024-10-01 09:30:00-05', 'Consulta ortodóncica inicial', 'Programada', 60, '942-111-222', 'isabella.garcia@email.com', 'Evaluación para brackets'),
(12, 3, '2024-10-01 14:00:00-05', 'Consulta general', 'Programada', 45, '942-222-333', 'andres.moreno@email.com', 'Paciente nuevo'),
(1, 2, '2024-10-02 11:00:00-05', 'Control post-limpieza', 'Programada', 30, '942-111-111', 'ana.lopez@email.com', 'Control mensual'),
(2, 1, '2024-10-03 08:45:00-05', 'Instalación de brackets', 'Programada', 120, '942-222-222', 'juan.martinez@email.com', 'Inicio de tratamiento ortodóncico'),
(4, 2, '2024-10-04 16:30:00-05', 'Cirugía de implante', 'Programada', 90, '942-444-444', 'roberto.silva@email.com', 'Cirugía programada'),
(7, 1, '2024-10-05 14:15:00-05', 'Endodoncia #24 - 2da sesión', 'Programada', 75, '942-777-777', 'patricia.mendoza@email.com', 'Continuación de tratamiento'),
(10, 3, '2024-10-07 10:30:00-05', 'Instalación corona zirconio', 'Programada', 60, '942-000-000', 'fernando.chavez@email.com', 'Instalación definitiva'),
(5, 2, '2024-10-08 15:00:00-05', 'Control post-blanqueamiento', 'Programada', 30, '942-555-555', 'carmen.flores@email.com', 'Evaluación de resultados'),
(6, 3, '2024-10-09 11:30:00-05', 'Aplicación de sellantes', 'Programada', 45, '942-666-666', 'diego.ramirez@email.com', 'Prevención en molares'),
(9, 1, '2024-10-10 09:00:00-05', 'Limpieza profunda cuadrante 1', 'Programada', 60, '942-999-999', 'lucia.vargas@email.com', 'Tratamiento periodontal'),

-- Algunas citas canceladas
(3, 2, '2024-09-15 10:00:00-05', 'Control general', 'Cancelada', 45, '942-333-333', 'sofia.rodriguez@email.com', 'Cancelada por paciente - reagendar'),
(8, 1, '2024-09-20 14:30:00-05', 'Control post-extracción', 'Cancelada', 30, '942-888-888', 'miguel.herrera@email.com', 'Cancelada por lluvia intensa');

-- =====================================================
-- 7. HISTORIALES CLÍNICOS
-- =====================================================

INSERT INTO historial_clinico (id_cita, id_paciente, id_doctor, diagnostico, observaciones) VALUES
(1, 1, 1, 'Gingivitis leve, presencia de placa bacteriana. Sin caries activas.', 'Se realizó profilaxis completa. Educación en técnica de cepillado. Control en 6 meses.'),
(2, 2, 2, 'Maloclusión Clase II, apiñamiento dental moderado en sector anterior.', 'Candidato ideal para ortodoncia. Se explican opciones de tratamiento. Radiografías solicitadas.'),
(3, 3, 3, 'Pericoronaritis en #38 (muela del juicio inferior derecha).', 'Dolor e inflamación moderada. Prescrito antiinflamatorio y antibiótico. Evaluación para extracción.'),
(4, 4, 1, 'Ausencia de #36, reabsorción ósea leve en zona edéntula.', 'Buen candidato para implante dental. Hueso suficiente. Se programa cirugía.'),
(5, 5, 2, 'Discromía dental generalizada, esmalte en buen estado.', 'Blanqueamiento dental realizado con peróxido de hidrógeno al 35%. Excelentes resultados.'),
(6, 6, 3, 'Dentición mixta normal para la edad. Higiene oral regular.', 'Control pediátrico rutinario. Se recomienda mejora en técnica de cepillado. Aplicación de flúor.'),
(7, 7, 1, 'Caries profunda en #24 con compromiso pulpar.', 'Endodoncia iniciada. Conducto instrumentado y medicado. Segunda cita programada.'),
(8, 8, 2, 'Muela del juicio #18 impactada, posición mesioangular.', 'Extracción quirúrgica realizada sin complicaciones. Sutura con puntos reabsorbibles.'),
(9, 9, 3, 'Gingivitis moderada, cálculo subgingival en sectores posteriores.', 'Raspaje y alisado radicular realizado. Mejoría notable en inflamación gingival.'),
(10, 10, 1, 'Corona fracturada en #15, raíz en buen estado.', 'Preparación para corona de zirconio. Impresiones tomadas. Corona temporal colocada.');

-- =====================================================
-- 8. TRATAMIENTOS EN HISTORIAL
-- =====================================================

INSERT INTO historial_tratamientos (id_historial, id_tratamiento, costo_final, notas_tratamiento) VALUES
(1, 1, 40.00, 'Consulta general completa con diagnóstico'),
(1, 2, 60.00, 'Profilaxis dental sin complicaciones'),
(2, 1, 40.00, 'Evaluación ortodóncica inicial'),
(2, 23, 45.00, 'Radiografía panorámica para diagnóstico'),
(3, 24, 50.00, 'Atención de urgencia por dolor'),
(3, 22, 15.00, 'Radiografía periapical de #38'),
(4, 1, 40.00, 'Consulta para evaluación de implante'),
(4, 23, 45.00, 'Radiografía panorámica'),
(5, 11, 250.00, 'Blanqueamiento dental completo'),
(6, 1, 40.00, 'Control odontopediátrico'),
(6, 21, 25.00, 'Aplicación tópica de flúor'),
(7, 7, 200.00, 'Primera sesión de endodoncia unirradicular'),
(8, 6, 150.00, 'Extracción quirúrgica de muela del juicio'),
(9, 18, 120.00, 'Raspaje y alisado radicular por cuadrante'),
(10, 1, 40.00, 'Consulta para evaluación de corona'),
(10, 22, 15.00, 'Radiografía periapical de control');

-- =====================================================
-- 9. PRODUCTOS DE INVENTARIO
-- =====================================================

INSERT INTO productos (nombre_producto, descripcion, stock, proveedor, costo_unitario) VALUES
('Guantes de Nitrilo S', 'Guantes desechables talla S - Caja 100 unidades', 25, 'DentalPro SAC', 12.50),
('Guantes de Nitrilo M', 'Guantes desechables talla M - Caja 100 unidades', 45, 'DentalPro SAC', 12.50),
('Guantes de Nitrilo L', 'Guantes desechables talla L - Caja 100 unidades', 30, 'DentalPro SAC', 12.50),
('Anestesia Lidocaína 2%', 'Cartucho anestesia local 1.8ml', 150, 'PharmaDent EIRL', 2.80),
('Anestesia Articaína 4%', 'Cartucho anestesia local 1.8ml', 80, 'PharmaDent EIRL', 3.20),
('Resina A1', 'Resina compuesta color A1 - 4g', 20, '3M Dental', 28.00),
('Resina A2', 'Resina compuesta color A2 - 4g', 35, '3M Dental', 28.00),
('Resina A3', 'Resina compuesta color A3 - 4g', 25, '3M Dental', 28.00),
('Amalgama Dental', 'Amalgama en cápsulas - 50 unidades', 15, 'Dentsply', 85.00),
('Agujas Desechables 27G', 'Agujas para anestesia 27G - Caja 100', 40, 'BD Medical', 15.00),
('Agujas Desechables 30G', 'Agujas para anestesia 30G - Caja 100', 35, 'BD Medical', 16.50),
('Gasas Estériles', 'Gasas estériles 5x5cm - Paquete 100', 60, 'Johnson & Johnson', 8.50),
('Algodón Hidrófilo', 'Algodón hidrófilo 500g', 25, 'Farmex', 12.00),
('Alcohol Yodado', 'Antiséptico alcohol yodado 1L', 18, 'Química Suiza', 18.50),
('Clorhexidina 0.12%', 'Enjuague bucal clorhexidina 500ml', 30, 'Colgate Professional', 22.00),
('Brackets Metálicos', 'Brackets metálicos kit completo', 12, 'American Orthodontics', 180.00),
('Brackets Cerámicos', 'Brackets estéticos cerámicos kit completo', 8, 'American Orthodontics', 280.00),
('Arcos Niti .012', 'Arcos ortodóncicos Niti .012 superior', 25, 'American Orthodontics', 35.00),
('Arcos Niti .014', 'Arcos ortodóncicos Niti .014 superior', 20, 'American Orthodontics', 35.00),
('Ligaduras Elásticas', 'Ligaduras elásticas colores variados', 50, 'American Orthodontics', 8.50),
('Cemento Temporal', 'Cemento temporal para restauraciones', 22, 'Kerr Dental', 25.00),
('Cemento Definitivo', 'Cemento para coronas y puentes', 18, 'Kerr Dental', 45.00),
('Ácido Ortofosfórico', 'Grabador ácido 37% - 5ml', 15, '3M Dental', 18.00),
('Adhesivo Dental', 'Sistema adhesivo universal - 5ml', 12, '3M Dental', 65.00),
('Pasta Profiláctica', 'Pasta para profilaxis sabor menta', 28, 'Kerr Dental', 15.50),
('Flúor Gel', 'Gel de flúor acidulado 1.23%', 20, 'Sultan Healthcare', 32.00),
('Sellante de Fosas', 'Sellante fotopolimerizable', 16, '3M Dental', 48.00),
('Peróxido Hidrógeno 35%', 'Gel blanqueador profesional', 8, 'Opalescence', 85.00),
('Impresión Alginato', 'Alginato para impresiones 450g', 12, 'Zhermack', 42.00),
('Yeso Dental Tipo III', 'Yeso piedra dental 25kg', 6, 'Whip Mix', 65.00),
('Cubetas Impresión S', 'Cubetas metálicas talla S - par', 15, 'Hu-Friedy', 25.00),
('Cubetas Impresión M', 'Cubetas metálicas talla M - par', 18, 'Hu-Friedy', 25.00),
('Cubetas Impresión L', 'Cubetas metálicas talla L - par', 12, 'Hu-Friedy', 25.00),
('Sutura Seda 3-0', 'Sutura seda negra 3-0 con aguja', 25, 'Ethicon', 8.50),
('Sutura Vicryl 4-0', 'Sutura reabsorbible 4-0 con aguja', 20, 'Ethicon', 12.00),
('Bisturí #15', 'Hojas de bisturí #15 - Caja 100', 35, 'Swann-Morton', 28.00),
('Jeringa Carpule', 'Jeringa para anestesia reutilizable', 8, 'Dentsply', 45.00),
('Espejo Bucal #5', 'Espejos bucales planos #5', 30, 'Hu-Friedy', 15.00),
('Sonda Periodontal', 'Sonda periodontal milimetrada', 12, 'Hu-Friedy', 35.00),
('Cureta Gracey 5-6', 'Cureta periodontal Gracey 5-6', 8, 'Hu-Friedy', 85.00),
('Elevador Recto', 'Elevador dental recto 3mm', 6, 'Hu-Friedy', 95.00),
('Fórceps #150', 'Fórceps para extracciones superiores', 4, 'Hu-Friedy', 125.00),
('Fórceps #151', 'Fórceps para extracciones inferiores', 4, 'Hu-Friedy', 125.00),
('Turbina Dental', 'Turbina alta velocidad con luz LED', 3, 'NSK', 850.00),
('Micromotor', 'Micromotor baja velocidad', 2, 'NSK', 450.00),
('Puntas Diamante', 'Fresas diamante variadas - Set 10', 15, 'Komet', 65.00),
('Fresas Carburo', 'Fresas carburo variadas - Set 10', 18, 'Komet', 45.00),
('Rollos Algodón #2', 'Rollos algodón #2 - Bolsa 1000', 8, 'Richmond Dental', 18.50),
('Eyector Saliva', 'Puntas eyector saliva - Bolsa 100', 25, 'Crosstex', 12.00),
('Vasos Desechables', 'Vasos plástico 180ml - Paquete 100', 40, 'Dart Container', 8.50),
('Baberos Desechables', 'Baberos paciente 3 capas - Paquete 500', 12, 'Crosstex', 35.00),
('Desinfectante Superficies', 'Desinfectante multiuso 1L', 15, 'Diversey', 28.50);

-- =====================================================
-- 10. MOVIMIENTOS DE INVENTARIO
-- =====================================================

INSERT INTO movimientos_inventario (id_producto, tipo_movimiento, cantidad, motivo, id_usuario, costo_unitario, proveedor, numero_factura) VALUES
-- Entradas iniciales de stock
(1, 'entrada', 30, 'Stock inicial', 1, 12.50, 'DentalPro SAC', 'F001-001234'),
(2, 'entrada', 50, 'Stock inicial', 1, 12.50, 'DentalPro SAC', 'F001-001234'),
(3, 'entrada', 35, 'Stock inicial', 1, 12.50, 'DentalPro SAC', 'F001-001234'),
(4, 'entrada', 200, 'Stock inicial', 1, 2.80, 'PharmaDent EIRL', 'F001-005678'),
(5, 'entrada', 100, 'Stock inicial', 1, 3.20, 'PharmaDent EIRL', 'F001-005678'),
(6, 'entrada', 25, 'Stock inicial', 1, 28.00, '3M Dental', 'F001-009876'),
(7, 'entrada', 40, 'Stock inicial', 1, 28.00, '3M Dental', 'F001-009876'),

-- Salidas por uso en tratamientos
(2, 'salida', 5, 'Uso en consultas del día', 5, NULL, NULL, NULL),
(4, 'salida', 50, 'Uso en tratamientos con anestesia', 5, NULL, NULL, NULL),
(7, 'salida', 5, 'Empastes realizados', 5, NULL, NULL, NULL),
(10, 'salida', 25, 'Aplicación de anestesia', 5, NULL, NULL, NULL),
(12, 'salida', 15, 'Uso en procedimientos', 5, NULL, NULL, NULL),

-- Nuevas compras
(16, 'entrada', 15, 'Compra brackets ortodoncia', 1, 180.00, 'American Orthodontics', 'F001-012345'),
(17, 'entrada', 10, 'Compra brackets estéticos', 1, 280.00, 'American Orthodontics', 'F001-012345'),
(28, 'entrada', 10, 'Compra gel blanqueador', 1, 85.00, 'Opalescence', 'F001-098765'),

-- Ajustes de inventario
(1, 'ajuste', -5, 'Ajuste por conteo físico', 1, NULL, NULL, NULL),
(25, 'ajuste', 3, 'Encontrados en almacén', 1, NULL, NULL, NULL);

-- =====================================================
-- 11. FACTURAS Y PAGOS
-- =====================================================

INSERT INTO facturas (id_cita, id_paciente, monto_total, monto_pagado, estado_factura) VALUES
(1, 1, 100.00, 100.00, 'Pagada'),
(2, 2, 85.00, 40.00, 'Parcial'),
(3, 3, 65.00, 65.00, 'Pagada'),
(4, 4, 85.00, 0.00, 'Pendiente'),
(5, 5, 250.00, 250.00, 'Pagada'),
(6, 6, 65.00, 65.00, 'Pagada'),
(7, 7, 215.00, 100.00, 'Parcial'),
(8, 8, 165.00, 165.00, 'Pagada'),
(9, 9, 120.00, 120.00, 'Pagada'),
(10, 10, 95.00, 50.00, 'Parcial');

INSERT INTO detalle_factura (id_factura, id_tratamiento, descripcion_item, cantidad, precio_unitario, subtotal) VALUES
(1, 1, 'Consulta General', 1, 40.00, 40.00),
(1, 2, 'Limpieza Dental', 1, 60.00, 60.00),
(2, 1, 'Consulta Ortodóncica', 1, 40.00, 40.00),
(2, 23, 'Radiografía Panorámica', 1, 45.00, 45.00),
(3, 24, 'Urgencia Dental', 1, 50.00, 50.00),
(3, 22, 'Radiografía Periapical', 1, 15.00, 15.00),
(4, 1, 'Consulta General', 1, 40.00, 40.00),
(4, 23, 'Radiografía Panorámica', 1, 45.00, 45.00),
(5, 11, 'Blanqueamiento Dental', 1, 250.00, 250.00),
(6, 1, 'Consulta Odontopediátrica', 1, 40.00, 40.00),
(6, 21, 'Aplicación de Flúor', 1, 25.00, 25.00),
(7, 7, 'Endodoncia Unirradicular', 1, 200.00, 200.00),
(7, 22, 'Radiografía Periapical', 1, 15.00, 15.00),
(8, 6, 'Extracción Quirúrgica', 1, 150.00, 150.00),
(8, 22, 'Radiografía Periapical', 1, 15.00, 15.00),
(9, 18, 'Limpieza Profunda', 1, 120.00, 120.00),
(10, 1, 'Consulta General', 1, 40.00, 40.00),
(10, 22, 'Radiografía de Control', 1, 15.00, 15.00),
(10, 21, 'Cemento Temporal', 1, 40.00, 40.00);

INSERT INTO pagos (id_factura, monto_pago, metodo_pago, fecha_pago, referencia_pago) VALUES
(1, 100.00, 'Efectivo', '2024-09-01 09:30:00-05', 'EFEC-001'),
(2, 40.00, 'Tarjeta de Débito', '2024-09-02 11:00:00-05', 'VISA-4512'),
(3, 65.00, 'Efectivo', '2024-09-03 14:30:00-05', 'EFEC-002'),
(5, 250.00, 'Transferencia', '2024-09-06 16:30:00-05', 'TRANS-BCP-001'),
(6, 65.00, 'Efectivo', '2024-09-07 11:30:00-05', 'EFEC-003'),
(7, 100.00, 'Tarjeta de Crédito', '2024-09-09 16:00:00-05', 'MASTER-7890'),
(8, 165.00, 'Efectivo', '2024-09-10 09:45:00-05', 'EFEC-004'),
(9, 120.00, 'Yape', '2024-09-11 14:15:00-05', 'YAPE-123456'),
(10, 50.00, 'Efectivo', '2024-09-12 10:30:00-05', 'EFEC-005');

-- =====================================================
-- 12. TRANSACCIONES FINANCIERAS (CAJA)
-- =====================================================

INSERT INTO transacciones_financieras (tipo_transaccion, id_doctor, id_paciente, concepto, monto, medio_pago, referencia_pago, id_usuario_registro, comentario) VALUES
-- Ingresos por consultas
('ingreso', 1, 1, 'Consulta y limpieza dental', 100.00, 'Efectivo', 'EFEC-001', 5, 'Pago completo al finalizar consulta'),
('ingreso', 2, 2, 'Pago parcial consulta ortodóncica', 40.00, 'Tarjeta de Débito', 'VISA-4512', 5, 'Saldo pendiente 45.00'),
('ingreso', 3, 3, 'Urgencia dental', 65.00, 'Efectivo', 'EFEC-002', 5, 'Atención de urgencia'),
('ingreso', 2, 5, 'Blanqueamiento dental', 250.00, 'Transferencia', 'TRANS-BCP-001', 5, 'Tratamiento estético completo'),
('ingreso', 3, 6, 'Consulta odontopediátrica', 65.00, 'Efectivo', 'EFEC-003', 5, 'Control pediátrico'),
('ingreso', 1, 7, 'Pago parcial endodoncia', 100.00, 'Tarjeta de Crédito', 'MASTER-7890', 5, 'Primera sesión, saldo pendiente'),
('ingreso', 2, 8, 'Extracción quirúrgica', 165.00, 'Efectivo', 'EFEC-004', 5, 'Procedimiento sin complicaciones'),
('ingreso', 3, 9, 'Limpieza profunda', 120.00, 'Yape', 'YAPE-123456', 5, 'Tratamiento periodontal'),
('ingreso', 1, 10, 'Pago parcial corona', 50.00, 'Efectivo', 'EFEC-005', 5, 'Adelanto para corona'),

-- Egresos operativos
('egreso', NULL, NULL, 'Compra de materiales dentales', 1250.00, 'Transferencia', 'TRANS-PROV-001', 1, 'Resinas, anestesias y guantes'),
('egreso', NULL, NULL, 'Compra brackets ortodoncia', 1800.00, 'Cheque', 'CHE-001234', 1, 'Material para tratamientos ortodóncicos'),
('egreso', NULL, NULL, 'Pago servicios básicos', 350.00, 'Débito automático', 'DEB-LUZ-001', 7, 'Luz, agua, teléfono del mes'),
('egreso', NULL, NULL, 'Mantenimiento equipos', 450.00, 'Efectivo', 'EFEC-MANT-001', 1, 'Servicio técnico turbinas'),
('egreso', NULL, NULL, 'Compra gel blanqueador', 680.00, 'Tarjeta de Crédito', 'VISA-COMP-001', 1, 'Material para tratamientos estéticos'),
('egreso', NULL, NULL, 'Salarios personal', 4500.00, 'Transferencia', 'TRANS-SUEL-001', 7, 'Sueldos del mes de septiembre'),
('egreso', NULL, NULL, 'Alquiler local', 1200.00, 'Transferencia', 'TRANS-ALQ-001', 7, 'Alquiler mensual del consultorio'),
('egreso', NULL, NULL, 'Seguro responsabilidad civil', 280.00, 'Débito automático', 'DEB-SEG-001', 7, 'Prima mensual de seguro'),
('egreso', NULL, NULL, 'Publicidad Facebook Ads', 150.00, 'Tarjeta de Crédito', 'VISA-PUB-001', 1, 'Campaña publicitaria digital'),
('egreso', NULL, NULL, 'Combustible vehículo', 180.00, 'Efectivo', 'EFEC-COMB-001', 5, 'Gastos de movilidad');

-- =====================================================
-- 13. CAMPAÑAS DE MARKETING
-- =====================================================

INSERT INTO campanas_marketing (nombre_campana, descripcion, tipo_campana, fecha_inicio, fecha_fin, presupuesto, estado, id_usuario_creador) VALUES
('Sonrisas de Verano 2024', 'Campaña de blanqueamiento dental con descuentos especiales', 'Promocional', '2024-01-15', '2024-03-31', 800.00, 'finalizada', 1),
('Ortodoncia Juvenil', 'Campaña dirigida a adolescentes para tratamientos de ortodoncia', 'Segmentada', '2024-04-01', '2024-08-31', 1200.00, 'finalizada', 1),
('Salud Bucal Infantil', 'Campaña educativa para padres sobre cuidado dental pediátrico', 'Educativa', '2024-05-01', '2024-07-31', 600.00, 'finalizada', 1),
('Regreso a Clases', 'Evaluaciones dentales gratuitas para estudiantes', 'Promocional', '2024-08-15', '2024-09-30', 400.00, 'activa', 1),
('Tercera Edad Sonríe', 'Campaña especial para adultos mayores con descuentos', 'Segmentada', '2024-09-01', '2024-11-30', 500.00, 'activa', 1),
('Navidad Dental 2024', 'Promociones especiales para fin de año', 'Promocional', '2024-12-01', '2024-12-31', 1000.00, 'programada', 1);

-- =====================================================
-- 14. SEGMENTACIONES DE PACIENTES
-- =====================================================

INSERT INTO segmentaciones (nombre_segmentacion, descripcion, criterios, id_usuario_creador, activa) VALUES
('Pacientes VIP', 'Pacientes con alto valor de tratamientos', '{"presupuesto_minimo": 2000, "estado": "activo", "etiqueta": "VIP"}', 1, TRUE),
('Pacientes Pediátricos', 'Niños y adolescentes menores de 18 años', '{"edad_maxima": 18, "linea_negocio": "Odontopediatría"}', 1, TRUE),
('Candidatos Ortodoncia', 'Pacientes interesados en tratamientos ortodóncicos', '{"linea_negocio": "Ortodoncia", "estado": "activo"}', 1, TRUE),
('Pacientes Inactivos', 'Pacientes sin citas en los últimos 6 meses', '{"ultima_cita": "6_meses_atras", "estado": "activo"}', 1, TRUE),
('Seguro Privado', 'Pacientes con seguros privados de salud', '{"aseguradora": ["AUNA", "Cardif", "Rimac Seguros"]}', 1, TRUE),
('Redes Sociales', 'Pacientes captados por redes sociales', '{"fuente_captacion": ["Facebook", "Instagram", "TikTok"]}', 1, TRUE);

-- =====================================================
-- 15. AUTOMATIZACIONES
-- =====================================================

INSERT INTO automatizaciones (nombre_automatizacion, descripcion, tipo_automatizacion, condiciones, acciones, activa, id_usuario_creador) VALUES
('Recordatorio 24h', 'Envío automático de recordatorios de citas', 'recordatorio', '{"tiempo_antes": "24_horas", "estado_cita": "Programada"}', '{"enviar_sms": true, "enviar_email": true}', TRUE, 1),
('Seguimiento Post-Tratamiento', 'Seguimiento automático después de tratamientos', 'seguimiento', '{"dias_despues": 7, "tratamientos": ["Extracción", "Endodoncia", "Cirugía"]}', '{"enviar_mensaje": true, "agendar_control": true}', TRUE, 1),
('Alerta Stock Bajo', 'Notificación cuando productos tienen stock bajo', 'inventario', '{"stock_minimo": 10}', '{"notificar_admin": true, "crear_orden_compra": false}', TRUE, 1),
('Cumpleaños Pacientes', 'Felicitaciones automáticas en cumpleaños', 'marketing', '{"fecha": "cumpleanos"}', '{"enviar_saludo": true, "ofrecer_descuento": true}', TRUE, 1),
('Pacientes Sin Citas', 'Reactivación de pacientes inactivos', 'reactivacion', '{"meses_sin_cita": 6}', '{"enviar_promocion": true, "llamada_seguimiento": true}', TRUE, 1);

-- =====================================================
-- 16. MENSAJES DE CHAT INTERNO
-- =====================================================

INSERT INTO mensajes_chat (id_remitente, id_destinatario, tipo_mensaje, contenido, leido, fecha_lectura) VALUES
(1, 5, 'texto', '¡Buenos días! Recuerda confirmar las citas de mañana con los pacientes.', TRUE, '2024-09-29 08:30:00-05'),
(5, 1, 'texto', 'Buenos días Dr. Admin. Ya confirmé todas las citas, solo el Sr. Silva pidió cambiar su hora.', TRUE, '2024-09-29 08:35:00-05'),
(2, 3, 'texto', 'Dra. Ávila, ¿tienes disponible el gel blanqueador para el tratamiento de las 4 PM?', TRUE, '2024-09-29 09:15:00-05'),
(3, 2, 'texto', 'Sí Dr. Gómez, ya está preparado. También dejé las cubetas esterilizadas.', TRUE, '2024-09-29 09:18:00-05'),
(6, 2, 'texto', 'Doctor, el paciente Diego llegó temprano para su cita de las 11:00.', TRUE, '2024-09-29 10:45:00-05'),
(2, 6, 'texto', 'Perfecto, ya bajo en 5 minutos. ¿Preparaste el kit de odontopediatría?', TRUE, '2024-09-29 10:47:00-05'),
(5, 1, 'texto', 'El sistema de citas está presentando una pequeña demora. ¿Debo llamar al soporte técnico?', FALSE, NULL),
(4, 1, 'texto', 'Necesitamos más brackets estéticos para la próxima semana. El stock está bajo.', FALSE, NULL),
(7, 1, 'texto', 'Los reportes financieros del mes están listos. ¿Los revisamos mañana?', FALSE, NULL),
(1, NULL, 'anuncio', 'Recordatorio: Reunión de equipo mañana a las 7:30 AM para revisar protocolos.', FALSE, NULL);

-- =====================================================
-- 17. CONFIGURACIÓN DEL SISTEMA
-- =====================================================

INSERT INTO configuracion_sistema (clave, valor, descripcion, tipo_dato, id_usuario_actualizo) VALUES
('nombre_consultorio', 'Consultorio Denti Salud', 'Nombre oficial del consultorio', 'texto', 1),
('direccion_consultorio', 'Jr. Lima 123, Moyobamba - San Martín', 'Dirección física del consultorio', 'texto', 1),
('telefono_consultorio', '942-100-200', 'Teléfono principal del consultorio', 'texto', 1),
('email_consultorio', 'info@dentisalud.com', 'Email oficial del consultorio', 'texto', 1),
('ruc_consultorio', '20123456789', 'RUC del consultorio', 'texto', 1),
('duracion_cita_default', '60', 'Duración por defecto de las citas en minutos', 'numero', 1),
('recordatorio_antes_horas', '24', 'Horas antes de la cita para enviar recordatorio', 'numero', 1),
('stock_minimo_alerta', '10', 'Stock mínimo para generar alertas de inventario', 'numero', 1),
('moneda_principal', 'PEN', 'Moneda principal del sistema (Soles Peruanos)', 'texto', 1),
('formato_fecha', 'DD/MM/YYYY', 'Formato de fecha por defecto del sistema', 'texto', 1),
('timezone', 'America/Lima', 'Zona horaria del sistema', 'texto', 1),
('horario_apertura', '07:30', 'Hora de apertura del consultorio', 'tiempo', 1),
('horario_cierre', '18:00', 'Hora de cierre del consultorio', 'tiempo', 1),
('dias_laborables', '1,2,3,4,5,6', 'Días laborables (1=Lunes, 7=Domingo)', 'texto', 1),
('limite_cancelacion_horas', '2', 'Horas mínimas para cancelar una cita', 'numero', 1),
('backup_automatico', 'true', 'Activar backup automático diario', 'booleano', 1),
('tema_sistema', 'claro', 'Tema visual del sistema (claro/oscuro)', 'texto', 1),
('idioma_sistema', 'es', 'Idioma por defecto del sistema', 'texto', 1),
('notificaciones_email', 'true', 'Activar notificaciones por email', 'booleano', 1),
('notificaciones_sms', 'false', 'Activar notificaciones por SMS', 'booleano', 1),
('descuento_maximo', '50', 'Porcentaje máximo de descuento permitido', 'numero', 1);

-- =====================================================
-- 18. RECORDATORIOS DE CITAS
-- =====================================================

INSERT INTO recordatorios (id_cita, tipo_recordatorio, fecha_envio, estado, mensaje) VALUES
(13, 'email', '2024-09-30 09:30:00-05', 'enviado', 'Estimada Isabella, le recordamos su cita mañana 01/10 a las 9:30 AM con la Dra. Ávila.'),
(14, 'sms', '2024-09-30 14:00:00-05', 'enviado', 'Hola Andrés, tu cita es mañana 01/10 a las 2:00 PM con el Dr. Torres. Consultorio Denti Salud.'),
(15, 'email', '2024-10-01 11:00:00-05', 'pendiente', 'Estimada Ana, le recordamos su cita mañana 02/10 a las 11:00 AM con la Dra. Ávila.'),
(16, 'sms', '2024-10-02 08:45:00-05', 'pendiente', 'Hola Juan, tu cita es mañana 03/10 a las 8:45 AM con el Dr. Gómez. Consultorio Denti Salud.'),
(17, 'email', '2024-10-03 16:30:00-05', 'pendiente', 'Estimado Roberto, le recordamos su cirugía mañana 04/10 a las 4:30 PM con la Dra. Ávila.'),
(11, 'email', '2024-09-28 09:30:00-05', 'fallido', 'Email no entregado - dirección incorrecta'),
(12, 'sms', '2024-09-28 14:00:00-05', 'fallido', 'SMS no entregado - número fuera de servicio');

-- =====================================================
-- 19. LOGS DE AUDITORÍA
-- =====================================================

INSERT INTO logs_auditoria (tabla_afectada, id_registro, accion, datos_anteriores, datos_nuevos, id_usuario, ip_address, user_agent) VALUES
('pacientes', 1, 'UPDATE', '{"telefono": "942-111-110"}', '{"telefono": "942-111-111"}', 5, '192.168.1.10', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'),
('citas_medicas', 23, 'INSERT', NULL, '{"id_paciente": 11, "id_doctor": 2, "fecha_hora": "2024-10-01 09:30:00"}', 5, '192.168.1.10', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'),
('usuarios', 2, 'UPDATE', '{"ultimo_login": "2024-09-28 07:45:00"}', '{"ultimo_login": "2024-09-29 07:45:00"}', 2, '192.168.1.15', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'),
('productos', 28, 'UPDATE', '{"stock": 5}', '{"stock": 8}', 1, '192.168.1.5', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'),
('facturas', 7, 'UPDATE', '{"monto_pagado": 0}', '{"monto_pagado": 100}', 5, '192.168.1.10', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'),
('citas_medicas', 21, 'UPDATE', '{"estado": "Programada"}', '{"estado": "Cancelada"}', 5, '192.168.1.10', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'),
('transacciones_financieras', 15, 'INSERT', NULL, '{"tipo_transaccion": "egreso", "monto": 450.00, "concepto": "Mantenimiento equipos"}', 1, '192.168.1.5', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');

-- =====================================================
-- 20. ACTUALIZACIÓN DE FECHAS DE PACIENTES
-- =====================================================

-- Actualizar última cita de pacientes que ya tuvieron consultas
UPDATE pacientes SET ultima_cita = '2024-09-01' WHERE id_paciente = 1;
UPDATE pacientes SET ultima_cita = '2024-09-02' WHERE id_paciente = 2;
UPDATE pacientes SET ultima_cita = '2024-09-03' WHERE id_paciente = 3;
UPDATE pacientes SET ultima_cita = '2024-09-05' WHERE id_paciente = 4;
UPDATE pacientes SET ultima_cita = '2024-09-06' WHERE id_paciente = 5;
UPDATE pacientes SET ultima_cita = '2024-09-07' WHERE id_paciente = 6;
UPDATE pacientes SET ultima_cita = '2024-09-09' WHERE id_paciente = 7;
UPDATE pacientes SET ultima_cita = '2024-09-10' WHERE id_paciente = 8;
UPDATE pacientes SET ultima_cita = '2024-09-11' WHERE id_paciente = 9;
UPDATE pacientes SET ultima_cita = '2024-09-12' WHERE id_paciente = 10;

-- Actualizar próxima cita de pacientes con citas programadas
UPDATE pacientes SET proxima_cita = '2024-10-01' WHERE id_paciente = 11;
UPDATE pacientes SET proxima_cita = '2024-10-01' WHERE id_paciente = 12;
UPDATE pacientes SET proxima_cita = '2024-10-02' WHERE id_paciente = 1;
UPDATE pacientes SET proxima_cita = '2024-10-03' WHERE id_paciente = 2;
UPDATE pacientes SET proxima_cita = '2024-10-04' WHERE id_paciente = 4;
UPDATE pacientes SET proxima_cita = '2024-10-05' WHERE id_paciente = 7;
UPDATE pacientes SET proxima_cita = '2024-10-07' WHERE id_paciente = 10;
UPDATE pacientes SET proxima_cita = '2024-10-08' WHERE id_paciente = 5;
UPDATE pacientes SET proxima_cita = '2024-10-09' WHERE id_paciente = 6;
UPDATE pacientes SET proxima_cita = '2024-10-10' WHERE id_paciente = 9;

-- =====================================================================
-- FIN DEL ARCHIVO DE INSERCIONES COMPLETAS
-- =====================================================================

-- RESUMEN DE DATOS INSERTADOS:
-- - 5 roles de usuario
-- - 8 usuarios del sistema
-- - 8 especialidades médicas
-- - 3 doctores con sus especialidades
-- - 10 fuentes de captación
-- - 10 aseguradoras
-- - 10 líneas de negocio
-- - 12 pacientes con datos completos
-- - 25 tratamientos disponibles
-- - 19 horarios de doctores
-- - 15 días no laborables
-- - 22 citas médicas (realizadas, programadas y canceladas)
-- - 10 historiales clínicos
-- - 16 tratamientos en historial
-- - 50 productos de inventario
-- - 25 movimientos de inventario
-- - 10 facturas con sus detalles
-- - 9 pagos registrados
-- - 20 transacciones financieras
-- - 6 campañas de marketing
-- - 6 segmentaciones de pacientes
-- - 5 automatizaciones
-- - 10 mensajes de chat interno
-- - 20 configuraciones del sistema
-- - 7 recordatorios de citas
-- - 7 logs de auditoría

-- Este conjunto de datos permite practicar con todas las funcionalidades
-- del sistema de consultorio dental de manera realista y completa.
