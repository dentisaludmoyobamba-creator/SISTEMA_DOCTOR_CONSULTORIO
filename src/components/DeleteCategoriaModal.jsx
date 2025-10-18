import React, { useState } from 'react';

const DeleteCategoriaModal = ({
  isOpen,
  onClose,
  categorias,
  onDelete
}) => {
  const [deleting, setDeleting] = useState(null);

  if (!isOpen) return null;

  const handleDelete = async (categoriaId) => {
    setDeleting(categoriaId);
    const result = await onDelete(categoriaId);
    setDeleting(null);
    
    if (result.success) {
      // La categoría se eliminó exitosamente
    } else {
      alert(`Error: ${result.error}`);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-xl w-[90%] max-w-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Eliminar categoría</h3>
        
        {categorias.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No hay categorías disponibles</p>
        ) : (
          <div className="max-h-96 overflow-y-auto space-y-2">
            {categorias.map((categoria) => (
              <div
                key={categoria.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <span className="text-gray-700">{categoria.nombre}</span>
                <button
                  onClick={() => handleDelete(categoria.id)}
                  disabled={deleting === categoria.id}
                  className="px-3 py-1 rounded-md bg-red-500 text-white hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-sm"
                >
                  {deleting === categoria.id ? 'Eliminando...' : 'Eliminar'}
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

export default DeleteCategoriaModal;

