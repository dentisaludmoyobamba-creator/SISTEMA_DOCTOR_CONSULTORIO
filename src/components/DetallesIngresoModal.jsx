import React, { useState } from 'react';

const DetallesIngresoModal = ({ isOpen, onClose, transaction, onSave }) => {
  const [formData, setFormData] = useState({
    creadoPor: transaction?.doctor || 'Eduardo Carmin',
    cantidad: 1,
    servicioProducto: transaction?.concepto || '',
    precioUnitario: transaction?.monto || 0,
    paciente: transaction?.paciente || '',
    medioPago: transaction?.medioPago || '',
    comprobante: 'boleta',
    montoTotal: transaction?.monto || 0,
    otroDescuento: 0,
    comentario: transaction?.comentario || ''
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error('Error al guardar:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-auto">
        {/* Header */}
        <div className="p-6 border-b">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-[#4A3C7B]">DATOS DE LOS INGRESOS</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Creado por */}
          <div className="flex items-center space-x-4">
            <label className="text-sm font-semibold text-[#4A3C7B] min-w-[100px]">
              Creado por:
            </label>
            <span className="text-gray-700 font-medium">{formData.creadoPor}</span>
          </div>

          {/* Tabla de servicios/productos */}
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-gradient-to-r from-[#4A3C7B] to-[#2D1B69] text-white">
              <div className="grid grid-cols-3 gap-4 p-4">
                <div className="text-center font-semibold">Cantidad</div>
                <div className="text-center font-semibold">Servicio/Producto</div>
                <div className="text-center font-semibold">Precio unitario</div>
              </div>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-3 gap-4 items-center">
                <input
                  type="number"
                  name="cantidad"
                  value={formData.cantidad}
                  onChange={handleInputChange}
                  min="1"
                  className="p-2 border border-gray-300 rounded text-center"
                />
                <input
                  type="text"
                  name="servicioProducto"
                  value={formData.servicioProducto}
                  onChange={handleInputChange}
                  className="p-2 border border-gray-300 rounded"
                />
                <input
                  type="number"
                  name="precioUnitario"
                  value={formData.precioUnitario}
                  onChange={handleInputChange}
                  step="0.01"
                  min="0"
                  className="p-2 border border-gray-300 rounded"
                />
              </div>
            </div>
          </div>

          {/* Información detallada */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-[#4A3C7B]">Paciente:</label>
              <input
                type="text"
                name="paciente"
                value={formData.paciente}
                onChange={handleInputChange}
                className="p-2 border border-gray-300 rounded w-48"
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-[#4A3C7B]">Medio de pago:</label>
              <select
                name="medioPago"
                value={formData.medioPago}
                onChange={handleInputChange}
                className="p-2 border border-gray-300 rounded w-48"
              >
                <option value="efectivo">Efectivo</option>
                <option value="tarjeta">Tarjeta</option>
                <option value="transferencia">Transferencia</option>
                <option value="yape">Yape</option>
                <option value="plin">Plin</option>
              </select>
            </div>

            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-[#4A3C7B]">Comprobante:</label>
              <select
                name="comprobante"
                value={formData.comprobante}
                onChange={handleInputChange}
                className="p-2 border border-gray-300 rounded w-48"
              >
                <option value="boleta">Boleta</option>
                <option value="factura">Factura</option>
                <option value="recibo">Recibo</option>
                <option value="otro">Otro</option>
              </select>
            </div>

            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-[#4A3C7B]">Monto total:</label>
              <input
                type="number"
                name="montoTotal"
                value={formData.montoTotal}
                onChange={handleInputChange}
                step="0.01"
                min="0"
                className="p-2 border border-gray-300 rounded w-48"
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-[#4A3C7B]">Otro descuento:</label>
              <input
                type="number"
                name="otroDescuento"
                value={formData.otroDescuento}
                onChange={handleInputChange}
                step="0.01"
                min="0"
                className="p-2 border border-gray-300 rounded w-48"
              />
            </div>
          </div>

          {/* Comentario */}
          <div>
            <label className="block text-sm font-semibold text-[#4A3C7B] mb-2">
              Comentario:
            </label>
            <textarea
              name="comentario"
              value={formData.comentario}
              onChange={handleInputChange}
              rows={3}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#30B0B0] focus:border-[#30B0B0] transition-all duration-200 resize-none"
            />
          </div>

          {/* Botón Guardar */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#30B0B0] text-white py-3 px-6 rounded-lg hover:bg-[#2A9A9A] transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DetallesIngresoModal;
