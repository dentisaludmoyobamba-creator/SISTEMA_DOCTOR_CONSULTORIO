import React, { useEffect, useRef } from 'react';

const ContextMenu = ({ 
  isOpen, 
  position, 
  onClose, 
  onEditar, 
  onVerDetalles, 
  onImprimir, 
  onEliminar,
  transaction 
}) => {
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        onClose();
      }
    };

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
      // Prevenir scroll del body cuando el menú está abierto
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop invisible para capturar clicks */}
      <div 
        className="fixed inset-0 z-[9998]"
        onClick={onClose}
      />
      
      {/* Menú contextual */}
      <div
        ref={menuRef}
        className="fixed z-[9999] bg-white rounded-lg shadow-xl border border-gray-200 py-2 min-w-[200px]"
        style={{
          left: position.x,
          top: position.y,
          transform: 'translate(0, 0)'
        }}
      >
      {/* Header */}
      <div className="bg-gray-600 text-white px-4 py-2 rounded-t-lg flex items-center justify-between">
        <span className="text-sm font-medium">Hora</span>
        <div className="flex items-center space-x-2">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
          </svg>
          <span className="text-sm font-medium">{transaction?.hora}</span>
        </div>
      </div>

      {/* Menu Items */}
      <div className="py-1">
        <button
          onClick={onEditar}
          className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 flex items-center space-x-3 transition-colors"
        >
          <svg className="w-4 h-4 text-[#30B0B0]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          <span className="text-sm">Editar ingreso</span>
        </button>

        <button
          onClick={onVerDetalles}
          className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 flex items-center space-x-3 transition-colors"
        >
          <svg className="w-4 h-4 text-[#30B0B0]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          <span className="text-sm">Ver detalles</span>
        </button>

        <button
          onClick={onImprimir}
          className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 flex items-center space-x-3 transition-colors"
        >
          <svg className="w-4 h-4 text-[#30B0B0]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
          <span className="text-sm">Imprimir</span>
        </button>

        {/* Separator */}
        <div className="border-t border-gray-200 my-1"></div>

        <button
          onClick={onEliminar}
          className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 flex items-center space-x-3 transition-colors"
        >
          <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          <span className="text-sm">Eliminar</span>
        </button>
      </div>
    </div>
    </>
  );
};

export default ContextMenu;
