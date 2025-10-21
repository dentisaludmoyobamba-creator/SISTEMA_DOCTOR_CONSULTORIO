import React, { useState, useEffect } from 'react';

const ServicioModal = ({ isOpen, onClose, onSave, servicio = null }) => {
  const [formData, setFormData] = useState({
    nombre_tratamiento: '',
    descripcion: '',
    costo_base: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (servicio) {
      setFormData({
        nombre_tratamiento: servicio.nombre || '',
        descripcion: servicio.descripcion || '',
        costo_base: servicio.costo_base || ''
      });
    } else {
      setFormData({
        nombre_tratamiento: '',
        descripcion: '',
        costo_base: ''
      });
    }
    setError('');
  }, [servicio, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validaciones
    if (!formData.nombre_tratamiento.trim()) {
      setError('El nombre del servicio es requerido');
      return;
    }

    if (!formData.costo_base || parseFloat(formData.costo_base) <= 0) {
      setError('El costo base debe ser mayor a 0');
      return;
    }

    setLoading(true);
    try {
      const dataToSend = {
        ...formData,
        costo_base: parseFloat(formData.costo_base)
      };

      if (servicio) {
        dataToSend.id_tratamiento = servicio.id;
      }

      await onSave(dataToSend);
      onClose();
    } catch (err) {
      setError(err.message || 'Error al guardar el servicio');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200]">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-gradient-to-r from-[#4A3C7B] to-[#2D1B69] text-white px-6 py-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold">
              {servicio ? 'Editar Servicio' : 'Nuevo Servicio'}
            </h3>
            <button 
              onClick={onClose}
              className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-300"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Contenido */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Nombre del servicio */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre del Servicio <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.nombre_tratamiento}
              onChange={(e) => setFormData({ ...formData, nombre_tratamiento: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#30B0B0] focus:border-[#30B0B0] transition-all duration-300"
              placeholder="Ej: Blanqueamiento dental"
              required
            />
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descripción
            </label>
            <textarea
              value={formData.descripcion}
              onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
              rows={4}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#30B0B0] focus:border-[#30B0B0] transition-all duration-300 resize-none"
              placeholder="Descripción del servicio (opcional)"
            />
          </div>

          {/* Costo base */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Costo Base (S/) <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">
                S/
              </span>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.costo_base}
                onChange={(e) => setFormData({ ...formData, costo_base: e.target.value })}
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#30B0B0] focus:border-[#30B0B0] transition-all duration-300"
                placeholder="0.00"
                required
              />
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Este es el precio base del servicio. Puede ser modificado en cada presupuesto.
            </p>
          </div>

          {/* Botones */}
          <div className="flex items-center space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-xl font-semibold transition-all duration-300"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-[#4A3C7B] to-[#2D1B69] hover:from-[#3A2C6B] hover:to-[#1D0B59] text-white rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Guardando...</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>{servicio ? 'Actualizar' : 'Guardar'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ServicioModal;

