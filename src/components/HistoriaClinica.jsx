import React, { useState } from 'react';
import NuevoArchivoModal from './NuevoArchivoModal';
import NotaEvolucionModal from './NotaEvolucionModal';
import DienteSVG from './DienteSVG';

const HistoriaClinica = ({ paciente, onClose }) => {
  const [activeSection, setActiveSection] = useState('filiacion');
  const [activeTab, setActiveTab] = useState('datos-personales');
  const [isEditing, setIsEditing] = useState(false);
  const [isNuevoArchivoOpen, setIsNuevoArchivoOpen] = useState(false);
  const [archivos, setArchivos] = useState([]);
  const [isNotaEvolucionOpen, setIsNotaEvolucionOpen] = useState(false);
  const [notasEvolucion, setNotasEvolucion] = useState([]);
  const [activeOdontogramaTab, setActiveOdontogramaTab] = useState('inicial');

  const sections = [
    { id: 'filiacion', label: 'Filiación', icon: '👤' },
    { id: 'historia-clinica', label: 'Historia clínica', icon: '📄' },
    { id: 'odontograma', label: 'Odontograma', icon: '🦷' },
    { id: 'periodontograma', label: 'Periodontograma', icon: '🦷' },
    { id: 'ortodoncia', label: 'Ortodoncia', icon: '🦷' },
    { id: 'estado-cuenta', label: 'Estado de cuenta', icon: '💰' },
    { id: 'prescripciones', label: 'Prescripciones', icon: '📋' },
    { id: 'archivos', label: 'Archivos', icon: '📁' }
  ];

  const handleOpenHistoria = () => {
    setActiveSection('historia-clinica');
  };

  const handleSaveArchivo = (archivoData) => {
    const nuevoArchivo = {
      id: Date.now(),
      ...archivoData,
      fecha: new Date().toISOString(),
      paciente: paciente?.nombre + ' ' + paciente?.apellido
    };
    setArchivos(prev => [...prev, nuevoArchivo]);
  };

  const handleSaveNotaEvolucion = (notaData) => {
    const nuevaNota = {
      id: Date.now(),
      ...notaData,
      fecha: new Date().toISOString(),
      paciente: paciente?.nombre + ' ' + paciente?.apellido
    };
    setNotasEvolucion(prev => [...prev, nuevaNota]);
  };

  const getTipoDiente = (numero) => {
    const ultimoDigito = numero % 10;
    if (ultimoDigito === 1 || ultimoDigito === 2) return 'incisor';
    if (ultimoDigito === 3) return 'canino';
    if (ultimoDigito === 4 || ultimoDigito === 5) return 'premolar';
    return 'molar';
  };

  return (
    <div className="fixed inset-0 z-[200] bg-gray-50">
      {/* Header de 2 filas */}
      <div className="bg-slate-800 text-white">
        {/* Fila superior - Logo y usuario */}
        <div className="px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <div className="text-lg font-bold uppercase">DENTI SALUD</div>
              <div className="text-xs uppercase text-gray-300">ODONTOLOGÍA</div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                EC
              </div>
              <span className="text-sm">Eduardo Carmin</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
              </svg>
            </div>
          </div>
        </div>

        {/* Fila inferior - Navegación */}
        <div className="px-4 sm:px-6 py-2 flex items-center justify-between border-t border-slate-700">
          <div className="flex items-center space-x-2 sm:space-x-6 overflow-x-auto">
            <span className="text-sm text-gray-300 whitespace-nowrap">Agenda</span>
            <span className="text-sm text-white font-medium whitespace-nowrap">Pacientes</span>
            <span className="text-sm text-gray-300 whitespace-nowrap">Caja</span>
            <div className="flex items-center space-x-1 whitespace-nowrap">
              <span className="text-sm text-gray-300">Marketing</span>
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
              </svg>
            </div>
            <span className="text-sm text-gray-300 whitespace-nowrap hidden sm:inline">Productividad</span>
            <span className="text-sm text-gray-300 whitespace-nowrap hidden sm:inline">Inventario</span>
            <span className="text-sm text-gray-300 whitespace-nowrap hidden sm:inline">Laboratorio</span>
            <span className="text-sm text-gray-300 whitespace-nowrap hidden sm:inline">Chat</span>
            <span className="text-sm text-gray-300 whitespace-nowrap hidden sm:inline">Iconos</span>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-4">
            <svg className="w-5 h-5 text-gray-300 hidden sm:block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>
            <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/>
            </svg>
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar paciente"
                className="bg-slate-700 text-white placeholder-gray-300 px-4 py-2 rounded-md w-32 sm:w-64"
              />
              <svg className="absolute right-3 top-2.5 w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="flex" style={{ height: 'calc(100vh - 120px)' }}>
        {/* Sidebar izquierdo - Perfil del paciente */}
        <div className="w-80 bg-gradient-to-b from-blue-50 to-white border-r hidden lg:block">
          {/* Tarjeta del paciente */}
          <div className="p-6 border-b">
            <div className="flex flex-col items-center space-y-4">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-3xl text-white">
                {paciente?.avatar || '👤'}
              </div>
              <div className="text-center">
                <h2 className="text-xl font-bold text-gray-900">{paciente?.nombre} {paciente?.apellido}</h2>
                <p className="text-gray-600">22 años</p>
                <p className="text-sm text-gray-500">Creado el 22 sep 2025</p>
              </div>
              <div className="flex space-x-2">
                <button className="p-2 bg-white rounded-full shadow-sm hover:bg-gray-50">
                  <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                  </svg>
                </button>
                <button className="p-2 bg-white rounded-full shadow-sm hover:bg-gray-50">
                  <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                  </svg>
                </button>
                <button className="p-2 bg-white rounded-full shadow-sm hover:bg-gray-50">
                  <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Navegación de secciones */}
          <div className="p-4">
            <nav className="space-y-1">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                    activeSection === section.id
                      ? 'bg-blue-100 text-blue-700 border-l-4 border-blue-500'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span className="text-lg">{section.icon}</span>
                  <span className="font-medium">{section.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Contenido principal */}
        <div className="flex-1 flex flex-col">
          {/* Navegación móvil */}
          <div className="lg:hidden bg-white border-b p-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">{paciente?.nombre} {paciente?.apellido}</h2>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white">
                  {paciente?.avatar || '👤'}
                </div>
              </div>
            </div>
            <div className="mt-4">
              <select
                value={activeSection}
                onChange={(e) => setActiveSection(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {sections.map((section) => (
                  <option key={section.id} value={section.id}>
                    {section.icon} {section.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {/* Barra superior con etiquetas y notas */}
          <div className="bg-white border-b p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 space-y-2 sm:space-y-0">
              <div className="flex items-center space-x-2 sm:space-x-4">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-700">Etiquetas</span>
                  <div className="flex space-x-1">
                    <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                    </svg>
                    <svg className="w-4 h-4 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                    </svg>
                  </div>
                </div>
                <button className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm flex items-center space-x-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/>
                  </svg>
                  <span>Agregar</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Tarjeta de Etiquetas */}
              <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/>
                    </svg>
                    <span className="text-sm font-semibold text-gray-800">Etiquetas</span>
                  </div>
                  <button className="text-blue-600 text-sm flex items-center space-x-1 hover:text-blue-800">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/>
                    </svg>
                    <span>Agregar</span>
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  <div className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
                    <svg className="w-3 h-3 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                    </svg>
                    <span>VIP</span>
                    <button className="ml-1 text-yellow-600 hover:text-yellow-800">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              {/* Tarjeta de Notas */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 shadow-sm">
                <div className="flex items-center space-x-2 mb-3">
                  <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                  </svg>
                  <span className="text-sm font-semibold text-yellow-800">Notas</span>
                </div>
                <div className="bg-yellow-100 border border-yellow-300 rounded-md p-3">
                  <p className="text-sm text-yellow-800">bla bla bla</p>
                </div>
              </div>

              {/* Tarjeta de Alergias */}
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 shadow-sm relative">
                <div className="flex items-center space-x-2 mb-3">
                  <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"/>
                    </svg>
                  </div>
                  <span className="text-sm font-semibold text-red-800">Alergias</span>
                </div>
                <div className="bg-red-100 border border-red-300 rounded-md p-3">
                  <p className="text-sm text-red-800">polvo</p>
                </div>
                <button className="absolute -right-2 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center shadow-lg hover:bg-teal-600 transition-colors">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
                  </svg>
                </button>
              </div>
            </div>

            <div className="mt-4">
              <button className="text-blue-600 text-sm flex items-center space-x-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
                <span>Ver 'Barra de progreso'</span>
              </button>
            </div>
          </div>

          {/* Tabs de datos - Solo para Filiación */}
          {activeSection === 'filiacion' && (
            <div className="bg-white border-b">
              <div className="flex space-x-4 sm:space-x-8 px-4 sm:px-6 overflow-x-auto">
                <button
                  onClick={() => setActiveTab('datos-personales')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                    activeTab === 'datos-personales'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Datos Personales
                </button>
                <button
                  onClick={() => setActiveTab('datos-fiscales')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                    activeTab === 'datos-fiscales'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Datos Fiscales
                </button>
              </div>
            </div>
          )}

          {/* Formulario de datos personales */}
          {activeSection === 'filiacion' && activeTab === 'datos-personales' && (
            <div className="flex-1 bg-white p-4 sm:p-6 overflow-y-auto">
              <div className="flex justify-end mb-4">
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="flex items-center space-x-1 text-sm text-gray-600 hover:text-gray-800"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                  </svg>
                  <span>Editar campos</span>
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Columna izquierda */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nombres*</label>
                    <input
                      type="text"
                      value="Elias Jesus"
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Documento</label>
                    <div className="flex space-x-2">
                      <select className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        <option>DNI</option>
                      </select>
                      <input
                        type="text"
                        value="75403442"
                        disabled={!isEditing}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">F. nacimiento</label>
                    <div className="relative">
                      <input
                        type="text"
                        value="04/07/2003"
                        disabled={!isEditing}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                      />
                      <svg className="absolute right-3 top-2.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                      </svg>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">N° HC</label>
                    <input
                      type="text"
                      value="3"
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Sexo</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option>Hombre</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Grupo</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option>Seleccionar</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Última cita</label>
                    <input
                      type="text"
                      placeholder=""
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                    />
                  </div>
                </div>

                {/* Columna derecha */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Apellidos*</label>
                    <input
                      type="text"
                      value="Leandro"
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                    <div className="flex space-x-2">
                      <div className="flex items-center space-x-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-50">
                        <span className="text-sm">🇵🇪</span>
                        <span className="text-sm">+51</span>
                      </div>
                      <input
                        type="text"
                        value="956224010"
                        disabled={!isEditing}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      value="eliasjesuscarmin@gmail.com"
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nacionalidad</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option>Perú</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tel. Fijo</label>
                    <input
                      type="text"
                      placeholder=""
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
                    <button className="bg-blue-600 text-white px-3 py-2 rounded-md text-sm flex items-center space-x-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/>
                      </svg>
                      <span>Agregar</span>
                    </button>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Fuente captación</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option>Referido por paciente</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Aseguradora</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option>Seleccionar</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Línea de negocio</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option>Seleccionar</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ocupación</label>
                    <input
                      type="text"
                      placeholder=""
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Adicional</label>
                    <input
                      type="text"
                      placeholder=""
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Datos fiscales */}
          {activeSection === 'filiacion' && activeTab === 'datos-fiscales' && (
            <div className="flex-1 bg-white p-4 sm:p-6 overflow-y-auto">
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                  </svg>
                </div>
                <p className="text-gray-500 text-lg">Datos fiscales del paciente</p>
              </div>
            </div>
          )}

          {/* Sección de Archivos */}
          {activeSection === 'archivos' && (
            <div className="flex-1 bg-white p-4 sm:p-6 overflow-y-auto">
              {/* Header de archivos */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-teal-600">Archivos digitales</h2>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/>
                    </svg>
                    <span>Espacio usado: 0.0 MB de 20 GB</span>
                  </div>
                  <button
                    onClick={() => setIsNuevoArchivoOpen(true)}
                    className="bg-blue-100 text-blue-600 px-4 py-2 rounded-md hover:bg-blue-200 transition-colors flex items-center space-x-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
                    </svg>
                    <span>Subir archivo</span>
                  </button>
                </div>
              </div>

              {/* Área de archivos */}
              <div className="border border-blue-200 rounded-lg p-8 min-h-96">
                {archivos.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full py-12">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                      <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                      </svg>
                    </div>
                    <p className="text-gray-500 text-lg">No se encontró ningún archivo médico</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {archivos.map((archivo) => (
                      <div key={archivo.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-start space-x-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                            </svg>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-medium text-gray-900 truncate">{archivo.nombre}</h4>
                            <p className="text-xs text-gray-500 mt-1">{archivo.doctor}</p>
                            <p className="text-xs text-gray-400 mt-1">
                              {new Date(archivo.fecha).toLocaleDateString('es-ES')}
                            </p>
                            {archivo.descripcion && (
                              <p className="text-xs text-gray-600 mt-2 line-clamp-2">{archivo.descripcion}</p>
                            )}
                            {archivo.compartirConPaciente && (
                              <span className="inline-block mt-2 px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                                Compartido con paciente
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Sección de Odontograma */}
          {activeSection === 'odontograma' && (
            <div className="flex-1 bg-white p-4 sm:p-6 overflow-y-auto">
              {/* Header del odontograma */}
              <div className="mb-6">
                {/* Tabs */}
                <div className="flex space-x-8 border-b mb-4">
                  <button
                    onClick={() => setActiveOdontogramaTab('inicial')}
                    className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                      activeOdontogramaTab === 'inicial'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Odo. Inicial
                  </button>
                  <button
                    onClick={() => setActiveOdontogramaTab('evolucion')}
                    className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                      activeOdontogramaTab === 'evolucion'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Odo. Evolución
                  </button>
                  <button
                    onClick={() => setActiveOdontogramaTab('alta')}
                    className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                      activeOdontogramaTab === 'alta'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Odo. Alta
                  </button>
                </div>

                {/* Controles */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-6">
                    <button className="text-blue-600 text-sm flex items-center space-x-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                      </svg>
                      <span>Ver 'Barra de progreso'</span>
                    </button>
                    
                    {/* Leyenda */}
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                        <span className="text-sm text-gray-700">Mal estado</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                        <span className="text-sm text-gray-700">Buen estado</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <button className="bg-blue-100 text-blue-600 px-3 py-1 rounded-md text-sm flex items-center space-x-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                      </svg>
                      <span>Nuevo odontog.</span>
                    </button>
                    
                    <button className="bg-gray-100 text-gray-600 px-3 py-1 rounded-md text-sm flex items-center space-x-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16"/>
                      </svg>
                      <span>Marcado múltiple</span>
                    </button>
                    
                    <button className="bg-green-100 text-green-600 px-3 py-1 rounded-md text-sm flex items-center space-x-1">
                      <span>$</span>
                      <span>Crear presupuesto</span>
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              {/* Odontograma */}
              <div className="bg-white border border-gray-200 rounded-lg p-12">
                {/* Arcada Superior */}
                <div className="flex justify-center mb-8">
                  <div className="flex items-center space-x-2">
                    {/* Cuadrante Superior Derecho (18-11) */}
                    <div className="flex space-x-2">
                      {[18, 17, 16, 15, 14, 13, 12, 11].map(numero => (
                        <DienteSVG 
                          key={numero} 
                          numero={numero} 
                          tipo={getTipoDiente(numero)} 
                        />
                      ))}
                    </div>
                    
                    {/* Separador */}
                    <div className="w-8"></div>
                    
                    {/* Cuadrante Superior Izquierdo (21-28) */}
                    <div className="flex space-x-2">
                      {[21, 22, 23, 24, 25, 26, 27, 28].map(numero => (
                        <DienteSVG 
                          key={numero} 
                          numero={numero} 
                          tipo={getTipoDiente(numero)} 
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Arcada Inferior */}
                <div className="flex justify-center">
                  <div className="flex items-center space-x-2">
                    {/* Cuadrante Inferior Izquierdo (38-31) */}
                    <div className="flex space-x-2">
                      {[38, 37, 36, 35, 34, 33, 32, 31].map(numero => (
                        <DienteSVG 
                          key={numero} 
                          numero={numero} 
                          tipo={getTipoDiente(numero)} 
                        />
                      ))}
                    </div>
                    
                    {/* Separador */}
                    <div className="w-8"></div>
                    
                    {/* Cuadrante Inferior Derecho (41-48) */}
                    <div className="flex space-x-2">
                      {[48, 47, 46, 45, 44, 43, 42, 41].map(numero => (
                        <DienteSVG 
                          key={numero} 
                          numero={numero} 
                          tipo={getTipoDiente(numero)} 
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar derecho - Notas y presupuestos */}
        <div className="w-80 bg-white border-l hidden xl:block">
          {/* Notas de evolución */}
          <div className="p-6 border-b">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Notas de evolución</h3>
              <div className="flex space-x-2">
                <button 
                  onClick={() => setIsNotaEvolucionOpen(true)}
                  className="p-2 text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/>
                  </svg>
                </button>
                <button className="p-2 text-gray-400 hover:text-gray-600">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"/>
                  </svg>
                </button>
              </div>
            </div>
            {notasEvolucion.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No hay notas de evolución</p>
              </div>
            ) : (
              <div className="space-y-4 max-h-64 overflow-y-auto">
                {notasEvolucion.map((nota) => (
                  <div key={nota.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-900">{nota.doctor}</span>
                      <span className="text-xs text-gray-500">
                        {new Date(nota.fecha).toLocaleDateString('es-ES')}
                      </span>
                    </div>
                    {nota.evolucion && (
                      <div className="mb-2">
                        <p className="text-xs text-gray-600 font-medium mb-1">Evolución:</p>
                        <p className="text-sm text-gray-800">{nota.evolucion}</p>
                      </div>
                    )}
                    {nota.observacion && (
                      <div>
                        <p className="text-xs text-gray-600 font-medium mb-1">Observación:</p>
                        <p className="text-sm text-gray-800">{nota.observacion}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Presupuestos */}
          <div className="p-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
              </div>
              <p className="text-gray-600 text-sm">Este paciente aún no tiene presupuestos</p>
            </div>
          </div>
        </div>
      </div>

      {/* Botón de cerrar */}
      <button
        onClick={onClose}
        className="fixed top-4 right-4 z-[300] p-2 bg-white rounded-full shadow-lg hover:bg-gray-50"
      >
        <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
        </svg>
      </button>

      {/* Modal de nuevo archivo */}
      <NuevoArchivoModal
        isOpen={isNuevoArchivoOpen}
        onClose={() => setIsNuevoArchivoOpen(false)}
        onSave={handleSaveArchivo}
      />

      {/* Modal de nota de evolución */}
      <NotaEvolucionModal
        isOpen={isNotaEvolucionOpen}
        onClose={() => setIsNotaEvolucionOpen(false)}
        onSave={handleSaveNotaEvolucion}
      />
    </div>
  );
};

export default HistoriaClinica;
