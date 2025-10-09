import React, { useState, useEffect } from 'react';

const DeletedCitasModal = ({ isOpen, onClose, citasService }) => {
  const [deletedCitas, setDeletedCitas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      loadDeletedCitas();
    }
  }, [isOpen]);

  const loadDeletedCitas = async () => {
    setLoading(true);
    setError('');

    try {
      const result = await citasService.getDeletedCitas();

      if (result.success) {
        setDeletedCitas(result.citas || []);
      } else {
        setError(result.error || 'Error al cargar citas eliminadas');
      }
    } catch (e) {
      console.error('Error al cargar citas eliminadas:', e);
      setError('Error de conexión al cargar citas eliminadas');
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = async (citaId) => {
    if (window.confirm('¿Estás seguro de que quieres restaurar esta cita?')) {
      try {
        const result = await citasService.restoreCita(citaId);
        
        if (result.success) {
          // Recargar lista
          loadDeletedCitas();
        } else {
          alert(`Error al restaurar cita: ${result.error}`);
        }
      } catch (e) {
        alert('Error de conexión al restaurar cita');
      }
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '--';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    });
  };

  const formatTime = (timeString) => {
    if (!timeString) return '--';
    return timeString.substring(0, 5);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl mx-4 max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center">
            <svg className="w-6 h-6 mr-2 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Citas Eliminadas
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-auto p-6">
          {loading && (
            <div className="flex items-center justify-center py-12">
              <svg className="animate-spin h-8 w-8 text-[#4A3C7B]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className="ml-2 text-gray-600">Cargando citas eliminadas...</span>
            </div>
          )}

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {error}
            </div>
          )}

          {!loading && !error && deletedCitas.length === 0 && (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="mt-2 text-gray-500">No hay citas eliminadas</p>
            </div>
          )}

          {!loading && !error && deletedCitas.length > 0 && (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Paciente
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Doctor
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fecha
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Hora
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Motivo
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Eliminada por
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fecha Eliminación
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {deletedCitas.map((cita) => (
                    <tr key={cita.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{cita.paciente}</div>
                        <div className="text-sm text-gray-500">{cita.telefono}</div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{cita.doctor}</div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{formatDate(cita.fecha)}</div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{formatTime(cita.hora)}</div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-sm text-gray-900 max-w-xs truncate">{cita.motivo || '--'}</div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{cita.eliminado_por || 'Sistema'}</div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{formatDate(cita.fecha_eliminacion)}</div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleRestore(cita.id)}
                          className="text-[#30B0B0] hover:text-[#4A3C7B] flex items-center"
                        >
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                          Restaurar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center p-6 border-t bg-gray-50">
          <div className="text-sm text-gray-600">
            Total: {deletedCitas.length} cita{deletedCitas.length !== 1 ? 's' : ''} eliminada{deletedCitas.length !== 1 ? 's' : ''}
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gradient-to-r from-[#30B0B0] to-[#4A3C7B] text-white rounded-lg hover:from-[#4A3C7B] hover:to-[#2D1B69] transition-all duration-200"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeletedCitasModal;

