import React, { useState } from 'react';
import * as XLSX from 'xlsx';

const DownloadCitasModal = ({ isOpen, onClose, citasService }) => {
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleDownload = async () => {
    if (!fechaInicio || !fechaFin) {
      setError('Por favor selecciona ambas fechas');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Obtener citas del servicio
      const result = await citasService.getCitas({
        fecha_inicio: fechaInicio,
        fecha_fin: fechaFin
      });

      if (!result.success) {
        setError(result.error || 'Error al obtener citas');
        setLoading(false);
        return;
      }

      const citas = result.citas || [];

      if (citas.length === 0) {
        setError('No hay citas en el rango de fechas seleccionado');
        setLoading(false);
        return;
      }

      // Preparar datos para Excel
      const excelData = citas.map(cita => ({
        'ID': cita.id,
        'Paciente': cita.paciente,
        'Doctor': cita.doctor,
        'Fecha': cita.fecha,
        'Hora': cita.hora,
        'Duración (min)': cita.duracion,
        'Estado': cita.estado,
        'Teléfono': cita.telefono,
        'Motivo': cita.motivo,
        'Notas': cita.notas
      }));

      // Crear libro de Excel
      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(excelData);

      // Ajustar ancho de columnas
      const columnWidths = [
        { wch: 8 },  // ID
        { wch: 25 }, // Paciente
        { wch: 25 }, // Doctor
        { wch: 12 }, // Fecha
        { wch: 8 },  // Hora
        { wch: 15 }, // Duración
        { wch: 15 }, // Estado
        { wch: 15 }, // Teléfono
        { wch: 30 }, // Motivo
        { wch: 30 }  // Notas
      ];
      worksheet['!cols'] = columnWidths;

      XLSX.utils.book_append_sheet(workbook, worksheet, 'Citas');

      // Generar nombre de archivo
      const fileName = `historial_citas_${fechaInicio}_${fechaFin}.xlsx`;

      // Descargar archivo
      XLSX.writeFile(workbook, fileName);

      setLoading(false);
      onClose();
    } catch (e) {
      console.error('Error al generar Excel:', e);
      setError('Error al generar el archivo Excel');
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center">
            <svg className="w-6 h-6 mr-2 text-[#30B0B0]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Descargar Historial de Citas
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
        <div className="p-6">
          <p className="text-sm text-gray-600 mb-4">
            Selecciona el rango de fechas para descargar el historial de citas en formato Excel
          </p>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fecha Inicio
              </label>
              <input
                type="date"
                value={fechaInicio}
                onChange={(e) => setFechaInicio(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#30B0B0] focus:border-[#30B0B0]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fecha Fin
              </label>
              <input
                type="date"
                value={fechaFin}
                onChange={(e) => setFechaFin(e.target.value)}
                min={fechaInicio}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#30B0B0] focus:border-[#30B0B0]"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-3 p-6 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            onClick={handleDownload}
            disabled={loading}
            className="px-4 py-2 bg-gradient-to-r from-[#30B0B0] to-[#4A3C7B] text-white rounded-lg hover:from-[#4A3C7B] hover:to-[#2D1B69] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Descargando...
              </>
            ) : (
              <>
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Descargar Excel
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DownloadCitasModal;

