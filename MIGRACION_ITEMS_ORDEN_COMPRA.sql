-- =====================================================
-- MIGRACIÓN: TABLA DE ITEMS DE ÓRDENES DE COMPRA
-- =====================================================

-- Crear tabla para items de órdenes de compra
CREATE TABLE IF NOT EXISTS items_orden_compra (
    id_item SERIAL PRIMARY KEY,
    id_orden INTEGER NOT NULL,
    id_producto INTEGER NOT NULL,
    cantidad NUMERIC(10,2) NOT NULL,
    lote VARCHAR(50),
    precio_unitario NUMERIC(10,2) NOT NULL,
    subtotal NUMERIC(10,2) NOT NULL,
    fecha_vencimiento DATE,
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_orden) REFERENCES ordenes_compra(id_orden) ON DELETE CASCADE,
    FOREIGN KEY (id_producto) REFERENCES productos(id_producto)
);

-- Crear índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_items_orden ON items_orden_compra(id_orden);
CREATE INDEX IF NOT EXISTS idx_items_producto ON items_orden_compra(id_producto);
CREATE INDEX IF NOT EXISTS idx_items_lote ON items_orden_compra(lote);

-- Comentarios para documentación
COMMENT ON TABLE items_orden_compra IS 'Items individuales de cada orden de compra con detalles de lote y vencimiento';
COMMENT ON COLUMN items_orden_compra.cantidad IS 'Cantidad del producto en esta orden';
COMMENT ON COLUMN items_orden_compra.lote IS 'Número de lote del producto';
COMMENT ON COLUMN items_orden_compra.precio_unitario IS 'Precio de compra por unidad';
COMMENT ON COLUMN items_orden_compra.subtotal IS 'Subtotal = cantidad * precio_unitario';
COMMENT ON COLUMN items_orden_compra.fecha_vencimiento IS 'Fecha de vencimiento del lote (si aplica)';

-- =====================================================
-- INSTRUCCIONES:
-- =====================================================
-- 1. Ejecuta este script en tu base de datos PostgreSQL
-- 2. Redespliega el Cloud Function 'inventario'
-- 3. Ahora podrás agregar productos individuales a las
--    órdenes de compra con sus detalles de lote, precio
--    y fecha de vencimiento
-- =====================================================

