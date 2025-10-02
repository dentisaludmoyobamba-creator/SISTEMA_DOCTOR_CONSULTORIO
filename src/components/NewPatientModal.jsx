import React, { useEffect, useMemo, useState } from 'react';
import AddOptionModal from './AddOptionModal';

const initialSources = ['Facebook', 'amigos-familiares', 'Instagram', 'tik tok'];
const initialInsurers = ['AUNA', 'Cardif', 'Chubb', 'Dinners Coris gols', 'Dinner gold'];

const NewPatientModal = ({ isOpen, onClose, onCreate }) => {
  const [step] = useState(1); // Placeholder por si agregamos pasos luego
  const [documentType, setDocumentType] = useState('DNI');
  const [hasNoDocument, setHasNoDocument] = useState(false);
  const [phoneHasNo, setPhoneHasNo] = useState(false);
  const [gender, setGender] = useState('Hombre');
  const [sourceOptions, setSourceOptions] = useState(initialSources);
  const [insurerOptions, setInsurerOptions] = useState(initialInsurers);
  const [showAddSource, setShowAddSource] = useState(false);
  const [showAddInsurer, setShowAddInsurer] = useState(false);

  const [form, setForm] = useState({
    documento: '',
    nombres: '',
    apellidos: '',
    telefono: '',
    email: '',
    nacimiento: '',
    fuente: '',
    aseguradora: '',
    linea_negocio: '',
    etiquetas: [],
  });

  useEffect(() => {
    if (!isOpen) return;
    // Reset al abrir
    setDocumentType('DNI');
    setHasNoDocument(false);
    setPhoneHasNo(false);
    setGender('Hombre');
    setForm({
      documento: '',
      nombres: '',
      apellidos: '',
      telefono: '',
      email: '',
      nacimiento: '',
      fuente: '',
      aseguradora: '',
      linea_negocio: '',
      etiquetas: [],
    });
  }, [isOpen]);

  const canSubmit = useMemo(() => {
    const hasNames = form.nombres.trim() && form.apellidos.trim();
    const hasDoc = hasNoDocument || (!!form.documento.trim() && documentType);
    return hasNames && hasDoc;
  }, [form, hasNoDocument, documentType]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative mx-auto mt-6 mb-8 bg-white rounded-2xl shadow-xl w-[95%] max-w-5xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Crear nuevo paciente</h2>
          <button onClick={onClose} className="p-2 text-gray-500 hover:text-gray-700">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="px-4 sm:px-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Columna izquierda */}
            <div>
              <h3 className="text-gray-800 font-medium mb-3">Documentos obligatorios</h3>

              {/* Documento */}
              <label className="block text-sm text-gray-700 mb-1">Documento <span className="text-red-500">*</span></label>
              <div className="flex">
                <div className="w-36">
                  <div className="relative">
                    <select
                      value={documentType}
                      onChange={(e) => setDocumentType(e.target.value)}
                      className="w-full border border-gray-300 rounded-l-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
                    >
                      <option>DNI</option>
                      <option>CE</option>
                      <option>Pasaporte</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-gray-400">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
                <input
                  type="text"
                  value={form.documento}
                  onChange={(e) => setForm((f) => ({ ...f, documento: e.target.value }))}
                  className="flex-1 border border-l-0 border-gray-300 rounded-r-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <label className="mt-2 inline-flex items-center space-x-2 text-sm text-gray-600">
                <input type="checkbox" checked={hasNoDocument} onChange={(e) => setHasNoDocument(e.target.checked)} />
                <span>No tiene</span>
              </label>

              {/* Nombres */}
              <div className="mt-4">
                <label className="block text-sm text-gray-700 mb-1">Nombres <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={form.nombres}
                  onChange={(e) => setForm((f) => ({ ...f, nombres: e.target.value }))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              {/* Apellidos */}
              <div className="mt-4">
                <label className="block text-sm text-gray-700 mb-1">Apellidos <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={form.apellidos}
                  onChange={(e) => setForm((f) => ({ ...f, apellidos: e.target.value }))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              {/* Teléfono */}
              <div className="mt-4">
                <label className="block text-sm text-gray-700 mb-1">Teléfono <span className="text-red-500">*</span></label>
                <div className="flex">
                  <div className="w-28">
                    <select className="w-full border border-gray-300 rounded-l-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white">
                      <option>+51</option>
                      <option>+57</option>
                      <option>+54</option>
                    </select>
                  </div>
                  <input
                    type="tel"
                    value={form.telefono}
                    onChange={(e) => setForm((f) => ({ ...f, telefono: e.target.value }))}
                    className="flex-1 border border-l-0 border-gray-300 rounded-r-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <label className="mt-2 inline-flex items-center space-x-2 text-sm text-gray-600">
                  <input type="checkbox" checked={phoneHasNo} onChange={(e) => setPhoneHasNo(e.target.checked)} />
                  <span>No tiene</span>
                </label>
              </div>
            </div>

            {/* Columna derecha */}
            <div>
              <h3 className="text-gray-800 font-medium mb-3">Datos opcionales</h3>

              {/* Email */}
              <div>
                <label className="block text-sm text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              {/* Fecha nacimiento */}
              <div className="mt-4">
                <label className="block text-sm text-gray-700 mb-1">F. nacimiento</label>
                <input
                  type="date"
                  value={form.nacimiento}
                  onChange={(e) => setForm((f) => ({ ...f, nacimiento: e.target.value }))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              {/* Sexo */}
              <div className="mt-4">
                <label className="block text-sm text-gray-700 mb-1">Sexo</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
                >
                  <option>Hombre</option>
                  <option>Mujer</option>
                  <option>Otro</option>
                </select>
              </div>

              {/* Fuente de captación */}
              <div className="mt-4">
                <label className="block text-sm text-gray-700 mb-1">Fuente captación</label>
                <div className="relative">
                  <select
                    value={form.fuente}
                    onChange={(e) => {
                      if (e.target.value === '__add_new__') {
                        setShowAddSource(true);
                        return;
                      }
                      setForm((f) => ({ ...f, fuente: e.target.value }));
                    }}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
                  >
                    <option value="">Seleccione una opción</option>
                    {sourceOptions.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                    <option value="__add_new__">➕ Agregar nueva…</option>
                  </select>
                </div>
              </div>

              {/* Aseguradora */}
              <div className="mt-4">
                <label className="block text-sm text-gray-700 mb-1">Aseguradora</label>
                <div className="relative">
                  <select
                    value={form.aseguradora}
                    onChange={(e) => {
                      if (e.target.value === '__add_new__') {
                        setShowAddInsurer(true);
                        return;
                      }
                      setForm((f) => ({ ...f, aseguradora: e.target.value }));
                    }}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
                  >
                    <option value="">Seleccionar</option>
                    {insurerOptions.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                    <option value="__add_new__">➕ Agregar nueva…</option>
                  </select>
                </div>
              </div>

              {/* Línea de Negocio */}
              <div className="mt-4">
                <label className="block text-sm text-gray-700 mb-1">Línea de Negocio</label>
                <div className="relative">
                  <select
                    value={form.linea_negocio}
                    onChange={(e) => setForm((f) => ({ ...f, linea_negocio: e.target.value }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
                  >
                    <option value="">Seleccionar</option>
                    <option value="Ortodoncia">Ortodoncia</option>
                    <option value="Estética">Estética</option>
                    <option value="General">General</option>
                    <option value="Endodoncia">Endodoncia</option>
                    <option value="Cirugía">Cirugía</option>
                    <option value="Periodoncia">Periodoncia</option>
                    <option value="Prostodoncia">Prostodoncia</option>
                  </select>
                </div>
              </div>

              {/* Etiquetas (placeholder) */}
              <div className="mt-4">
                <label className="block text-sm text-gray-700 mb-1">Etiquetas</label>
                <button className="inline-flex items-center space-x-2 text-teal-700 hover:text-teal-800">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span>Etiquetas</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t flex items-center justify-end space-x-3">
          <button onClick={onClose} className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100">Cancelar</button>
          <div className="relative">
            <button
              disabled={!canSubmit}
              onClick={() => onCreate?.(form)}
              className={`px-5 py-2 rounded-md ${canSubmit ? 'bg-teal-600 hover:bg-teal-700 text-white' : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`}
            >
              Crear
            </button>
          </div>
        </div>
      </div>

      {/* Sub-modales */}
      <AddOptionModal
        title="Agregar fuente de captación"
        placeholder="Ej. Referido, Google, etc."
        isOpen={showAddSource}
        onClose={() => setShowAddSource(false)}
        onAdd={(val) => setSourceOptions((opts) => Array.from(new Set([...opts, val])))}
      />
      <AddOptionModal
        title="Agregar aseguradora"
        placeholder="Nombre de aseguradora"
        isOpen={showAddInsurer}
        onClose={() => setShowAddInsurer(false)}
        onAdd={(val) => setInsurerOptions((opts) => Array.from(new Set([...opts, val])))}
      />
    </div>
  );
};

export default NewPatientModal;


