-- =====================================================
-- MIGRACIÓN: AGREGAR COLUMNAS OCUPACIÓN Y ADICIONAL
-- =====================================================
-- Ejecuta este script cuando quieras habilitar los campos
-- de "Ocupación" y "Adicional" en la filiación del paciente
-- =====================================================

-- Agregar columna ocupacion
ALTER TABLE pacientes
ADD COLUMN IF NOT EXISTS ocupacion VARCHAR(100);

-- Agregar columna adicional
ALTER TABLE pacientes
ADD COLUMN IF NOT EXISTS adicional TEXT;

-- Agregar comentarios para documentación
COMMENT ON COLUMN pacientes.ocupacion IS 'Ocupación o profesión del paciente';
COMMENT ON COLUMN pacientes.adicional IS 'Información adicional del paciente';

-- =====================================================
-- INSTRUCCIONES:
-- =====================================================
-- 1. Ejecuta este script en tu base de datos PostgreSQL
-- 2. Redespliega el Cloud Function 'pacientes' 
-- 3. Los campos ocupación y adicional estarán disponibles
--    en Historia Clínica -> Filiación -> Datos Personales
-- =====================================================

