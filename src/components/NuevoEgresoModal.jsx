import React, { useState } from 'react';

const NuevoEgresoModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    tipo: 'otros',
    concepto: '',
    numeroFactura: '',
    medioPago: 'efectivo',
    moneda: 'S/',
    monto: '',
    comentario: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Limpiar error cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.concepto.trim()) {
      newErrors.concepto = 'Por favor ingrese un concepto';
    }
    if (!formData.monto || parseFloat(formData.monto) <= 0) {
      newErrors.monto = 'Por favor ingrese un monto válido';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await onSave(formData);
      setFormData({
        tipo: 'otros',
        concepto: '',
        numeroFactura: '',
        medioPago: 'efectivo',
        moneda: 'S/',
        monto: '',
        comentario: ''
      });
      setErrors({});
      onClose();
    } catch (error) {
      console.error('Error al crear egreso:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-auto">
        {/* Header */}
        <div className="p-6 border-b">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-[#4A3C7B]">NUEVO EGRESO</h2>
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
          {/* Tipo */}
          <div>
            <label className="block text-sm font-semibold text-[#4A3C7B] mb-2">
              Tipo:
            </label>
            <select
              name="tipo"
              value={formData.tipo}
              onChange={handleInputChange}
              className="w-full p-3 border-2 border-[#30B0B0] rounded-lg focus:ring-2 focus:ring-[#30B0B0] focus:border-[#30B0B0] transition-all duration-200"
            >
              <option value="otros">Otros</option>
              <option value="materiales">Materiales</option>
              <option value="equipos">Equipos</option>
              <option value="servicios">Servicios</option>
              <option value="gastos-operativos">Gastos Operativos</option>
            </select>
          </div>

          {/* Concepto */}
          <div>
            <label className="block text-sm font-semibold text-[#4A3C7B] mb-2">
              Concepto:
            </label>
            <input
              type="text"
              name="concepto"
              value={formData.concepto}
              onChange={handleInputChange}
              placeholder="Ingrese el concepto del egreso"
              className={`w-full p-3 border-2 ${errors.concepto ? 'border-red-500' : 'border-[#30B0B0]'} rounded-lg focus:ring-2 focus:ring-[#30B0B0] focus:border-[#30B0B0] transition-all duration-200`}
            />
            {errors.concepto && (
              <p className="text-red-500 text-sm mt-1">{errors.concepto}</p>
            )}
          </div>

          {/* N° Factura */}
          <div>
            <label className="block text-sm font-semibold text-[#4A3C7B] mb-2">
              N° Factura:
            </label>
            <input
              type="text"
              name="numeroFactura"
              value={formData.numeroFactura}
              onChange={handleInputChange}
              placeholder="Número de factura (opcional)"
              className="w-full p-3 border-2 border-[#30B0B0] rounded-lg focus:ring-2 focus:ring-[#30B0B0] focus:border-[#30B0B0] transition-all duration-200"
            />
          </div>

          {/* Medio de pago */}
          <div>
            <label className="block text-sm font-semibold text-[#4A3C7B] mb-2">
              Medio de pago:
            </label>
            <select
              name="medioPago"
              value={formData.medioPago}
              onChange={handleInputChange}
              className="w-full p-3 border-2 border-[#30B0B0] rounded-lg focus:ring-2 focus:ring-[#30B0B0] focus:border-[#30B0B0] transition-all duration-200"
            >
              <option value="efectivo">Efectivo</option>
              <option value="tarjeta">Tarjeta</option>
              <option value="transferencia">Transferencia</option>
              <option value="yape">Yape</option>
              <option value="plin">Plin</option>
            </select>
          </div>

          {/* Monto */}
          <div>
            <label className="block text-sm font-semibold text-[#4A3C7B] mb-2">
              Monto:
            </label>
            <div className="flex space-x-2">
              <select
                name="moneda"
                value={formData.moneda}
                onChange={handleInputChange}
                className="p-3 border-2 border-[#30B0B0] rounded-lg focus:ring-2 focus:ring-[#30B0B0] focus:border-[#30B0B0] transition-all duration-200 bg-[#30B0B0] text-white font-semibold"
              >
                <option value="S/">S/</option>
                <option value="US$">US$</option>
              </select>
              <input
                type="number"
                name="monto"
                value={formData.monto}
                onChange={handleInputChange}
                placeholder="00.00"
                step="0.01"
                min="0"
                className={`flex-1 p-3 border-2 ${errors.monto ? 'border-red-500' : 'border-[#30B0B0]'} rounded-lg focus:ring-2 focus:ring-[#30B0B0] focus:border-[#30B0B0] transition-all duration-200`}
              />
            </div>
            {errors.monto && (
              <p className="text-red-500 text-sm mt-1">{errors.monto}</p>
            )}
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
              placeholder="Escribe un comentario"
              rows={4}
              className="w-full p-3 border-2 border-[#30B0B0] rounded-lg focus:ring-2 focus:ring-[#30B0B0] focus:border-[#30B0B0] transition-all duration-200 resize-none"
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

export default NuevoEgresoModal;
