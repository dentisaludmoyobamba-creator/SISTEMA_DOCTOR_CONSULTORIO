import React, { useState, useRef, useEffect } from 'react';
import archivosService from '../services/archivosService';

const NuevoArchivoModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    doctor: '',
    categoria: 'Otro',
    nombre: '',
    compartirConPaciente: false,
    descripcion: '',
    notas: '',
    archivo: null
  });
  const [isDragOver, setIsDragOver] = useState(false);
  const [categorias, setCategorias] = useState([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  // Cargar categorías
  useEffect(() => {
    if (isOpen) {
      loadCategorias();
    }
  }, [isOpen]);

  const loadCategorias = async () => {
    try {
      const result = await archivosService.obtenerCategorias();
      if (result.success) {
        setCategorias(result.categorias);
      }
    } catch (error) {
      console.error('Error al cargar categorías:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFileSelect = (files) => {
    if (files && files.length > 0) {
      setFormData(prev => ({
        ...prev,
        archivo: files[0]
      }));
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    handleFileSelect(files);
  };

  const handleFileInputClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileInputChange = (e) => {
    handleFileSelect(e.target.files);
  };

  const handleSave = async () => {
    if (formData.archivo) {
      setUploading(true);
      try {
        await onSave(formData);
        onClose();
        // Reset form
        setFormData({
          doctor: '',
          categoria: 'Otro',
          nombre: '',
          compartirConPaciente: false,
          descripcion: '',
          notas: '',
          archivo: null
        });
      } catch (error) {
        console.error('Error al guardar:', error);
        alert('Error al subir el archivo');
      } finally {
        setUploading(false);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[300] bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="px-6 py-4 border-b flex items-center justify-between">
          <h2 className="text-xl font-bold text-blue-600 uppercase">NUEVO ARCHIVO</h2>
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
          {/* Categoría */}
          <div className="flex items-center space-x-4">
            <label className="w-24 text-sm font-medium text-gray-700">Categoría:<span className="text-red-500">*</span></label>
            <select
              name="categoria"
              value={formData.categoria}
              onChange={handleInputChange}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {categorias.map((cat) => (
                <option key={cat.nombre} value={cat.nombre}>
                  {cat.icono} {cat.nombre} - {cat.descripcion}
                </option>
              ))}
            </select>
          </div>

          {/* Nombre/Título (opcional ahora) */}
          <div className="flex items-center space-x-4">
            <label className="w-24 text-sm font-medium text-gray-700">Título:</label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleInputChange}
              placeholder="Título descriptivo (opcional)"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Compartir con paciente */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="compartirConPaciente"
              checked={formData.compartirConPaciente}
              onChange={handleInputChange}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label className="text-sm text-gray-700">Compartir este archivo con el paciente</label>
            <div className="w-4 h-4 bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-xs text-white">i</span>
            </div>
          </div>

          {/* Descripción */}
          <div className="flex items-start space-x-4">
            <label className="w-24 text-sm font-medium text-gray-700 mt-2">Descripción:</label>
            <textarea
              name="descripcion"
              value={formData.descripcion}
              onChange={handleInputChange}
              placeholder="Describe el contenido del archivo"
              rows={3}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Notas */}
          <div className="flex items-start space-x-4">
            <label className="w-24 text-sm font-medium text-gray-700 mt-2">Notas:</label>
            <textarea
              name="notas"
              value={formData.notas}
              onChange={handleInputChange}
              placeholder="Notas adicionales para uso interno"
              rows={2}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Archivo */}
          <div className="flex items-start space-x-4">
            <label className="w-24 text-sm font-medium text-gray-700 mt-2">Archivo<span className="text-red-500">*</span></label>
            <div className="flex-1">
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                  isDragOver 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={handleFileInputClick}
              >
                <div className="space-y-2">
                  <svg className="w-12 h-12 text-gray-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <p className="text-sm text-gray-600">
                    Arrastra y suelta uno o más archivos en esta zona o haz click aquí para seleccionarlos...
                  </p>
                </div>
              </div>
              
              {/* File info */}
              {formData.archivo && (
                <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-md">
                  <div className="flex items-center space-x-2">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-sm text-green-800 font-medium">{formData.archivo.name}</span>
                    <span className="text-xs text-green-600">
                      ({(formData.archivo.size / 1024 / 1024).toFixed(2)} MB)
                    </span>
                  </div>
                </div>
              )}

              {/* Instructions */}
              <div className="mt-4 space-y-1 text-xs text-gray-600">
                <p>Tamaño de la carga total y tamaño máximo por archivo: 500MB.</p>
                <p>Las imágenes/fotografías de alta resolución son comprimidas de manera automática y proporcional siendo el ancho igual a 1,200px para que al momento de visualizar el tiempo de carga sea más rápido.</p>
                <p>La resolución de 1,200px te permitirá ver aún una imagen en buena calidad en tu pantalla.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t bg-gray-50 flex justify-center space-x-4">
          <button
            onClick={onClose}
            disabled={uploading}
            className="bg-gray-200 text-gray-700 px-8 py-2 rounded-md hover:bg-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={!formData.archivo || uploading}
            className="bg-teal-500 text-white px-8 py-2 rounded-md hover:bg-teal-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
          >
            {uploading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Subiendo...</span>
              </>
            ) : (
              <span>Subir Archivo</span>
            )}
          </button>
        </div>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileInputChange}
          className="hidden"
          accept="*/*"
        />
      </div>
    </div>
  );
};

export default NuevoArchivoModal;
