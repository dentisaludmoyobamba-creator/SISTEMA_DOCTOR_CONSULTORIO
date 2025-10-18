import React, { useState } from 'react';

const DeleteTipoModal = ({
  isOpen,
  onClose,
  tipos,
  onDelete
}) => {
  const [deleting, setDeleting] = useState(null);

  if (!isOpen) return null;

  const handleDelete = async (tipoId) => {
    setDeleting(tipoId);
    const result = await onDelete(tipoId);
    setDeleting(null);
    
    if (result.success) {
      // El tipo se eliminó exitosamente
    } else {
      alert(`Error: ${result.error}`);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-xl w-[90%] max-w-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Eliminar tipo de producto</h3>
        
        {tipos.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No hay tipos disponibles</p>
        ) : (
          <div className="max-h-96 overflow-y-auto space-y-2">
            {tipos.map((tipo) => (
              <div
                key={tipo.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <span className="text-gray-700">{tipo.nombre}</span>
                <button
                  onClick={() => handleDelete(tipo.id)}
                  disabled={deleting === tipo.id}
                  className="px-3 py-1 rounded-md bg-red-500 text-white hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-sm"
                >
                  {deleting === tipo.id ? 'Eliminando...' : 'Eliminar'}
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteTipoModal;

