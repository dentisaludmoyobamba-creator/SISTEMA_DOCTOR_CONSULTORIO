import React, { useState, useEffect } from 'react';

const AddOptionModal = ({
  title,
  placeholder = 'Nombre',
  isOpen,
  onClose,
  onAdd,
}) => {
  const [value, setValue] = useState('');

  useEffect(() => {
    if (isOpen) {
      setValue('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-xl w-[90%] max-w-sm p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">{title}</h3>
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
        <div className="mt-4 flex items-center justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100"
          >
            Cancelar
          </button>
          <button
            onClick={() => {
              if (!value.trim()) return;
              onAdd(value.trim());
              onClose();
            }}
            className="px-4 py-2 rounded-md bg-teal-600 text-white hover:bg-teal-700"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddOptionModal;


