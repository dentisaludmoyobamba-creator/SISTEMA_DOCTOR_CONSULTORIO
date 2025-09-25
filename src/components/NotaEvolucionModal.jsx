import React, { useState } from 'react';

const NotaEvolucionModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    doctor: 'Eduardo Carmin',
    evolucion: '',
    observacion: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = () => {
    if (formData.evolucion.trim() || formData.observacion.trim()) {
      onSave(formData);
      onClose();
      // Reset form
      setFormData({
        doctor: 'Eduardo Carmin',
        evolucion: '',
        observacion: ''
      });
    }
  };

  const handleCancel = () => {
    onClose();
    // Reset form
    setFormData({
      doctor: 'Eduardo Carmin',
      evolucion: '',
      observacion: ''
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[300] bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="px-6 py-4 border-b flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800">Agregar última nota de evolución</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <div className="px-6 py-4 space-y-6">
          {/* Doctor */}
          <div className="flex items-center space-x-4">
            <label className="w-20 text-sm font-medium text-gray-700">Doctor:</label>
            <select
              name="doctor"
              value={formData.doctor}
              onChange={handleInputChange}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="Eduardo Carmin">Eduardo Carmin</option>
            </select>
          </div>

          {/* Evolución */}
          <div className="flex items-start space-x-4">
            <label className="w-20 text-sm font-medium text-gray-700 mt-2">Evolución:</label>
            <textarea
              name="evolucion"
              value={formData.evolucion}
              onChange={handleInputChange}
              placeholder="Escribe la evolución del paciente..."
              rows={6}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Observación */}
          <div className="flex items-start space-x-4">
            <label className="w-20 text-sm font-medium text-gray-700 mt-2">Observación:</label>
            <textarea
              name="observacion"
              value={formData.observacion}
              onChange={handleInputChange}
              placeholder="Escribe observaciones adicionales..."
              rows={6}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t bg-gray-50 flex justify-end space-x-3">
          <button
            onClick={handleCancel}
            className="px-6 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={!formData.evolucion.trim() && !formData.observacion.trim()}
            className="px-6 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotaEvolucionModal;
