import React from 'react';
import { doctores, estadosCita } from '../data/mockData';

const Sidebar = ({ 
  filtroDoctor, 
  setFiltroDoctor, 
  filtroEstado, 
  setFiltroEstado,
  onAddDoctor 
}) => {
  
  return (
    <div className="w-80 bg-white border-l shadow-sm flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold text-gray-900">Todas las agendas</h2>
        <p className="text-sm text-gray-600 mt-1">Gestiona doctores y filtros</p>
      </div>

      {/* Filtros */}
      <div className="p-4 border-b">
        <div className="space-y-4">
          {/* Filtro por estado */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Estado
            </label>
            <select
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {estadosCita.map((estado) => (
                <option key={estado.value} value={estado.value}>
                  {estado.label}
                </option>
              ))}
            </select>
          </div>

          {/* Filtro por vista */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Vista
            </label>
            <select
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              defaultValue="semana"
            >
              <option value="semana">Por semana</option>
              <option value="dia">Por día</option>
              <option value="mes">Por mes</option>
            </select>
          </div>
        </div>
      </div>

      {/* Lista de doctores */}
      <div className="flex-1 p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-medium text-gray-900">Doctores</h3>
          <button
            onClick={onAddDoctor}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Agregar
          </button>
        </div>

        <div className="space-y-2">
          {/* Opción "Todos" */}
          <div
            onClick={() => setFiltroDoctor(null)}
            className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors ${
              filtroDoctor === null 
                ? 'bg-blue-50 border border-blue-200' 
                : 'hover:bg-gray-50'
            }`}
          >
            <div className="w-3 h-3 rounded-full bg-gray-400 mr-3"></div>
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-900">Todos los doctores</div>
              <div className="text-xs text-gray-500">Ver todas las citas</div>
            </div>
            {filtroDoctor === null && (
              <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            )}
          </div>

          {/* Lista de doctores individuales */}
          {doctores.map((doctor) => (
            <div
              key={doctor.id}
              onClick={() => setFiltroDoctor(doctor.id)}
              className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors ${
                filtroDoctor === doctor.id 
                  ? 'bg-blue-50 border border-blue-200' 
                  : 'hover:bg-gray-50'
              }`}
            >
              <div className={`w-3 h-3 rounded-full ${doctor.color} mr-3`}></div>
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-900">{doctor.nombre}</div>
                <div className="text-xs text-gray-500">
                  {doctor.id === 1 ? 'Médico General' : 
                   doctor.id === 2 ? 'Área Especializada' : 'Especialista'}
                </div>
              </div>
              {filtroDoctor === doctor.id && (
                <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Estadísticas rápidas */}
      <div className="p-4 border-t bg-gray-50">
        <h4 className="text-sm font-medium text-gray-900 mb-3">Resumen del día</h4>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Total citas:</span>
            <span className="font-medium">8</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Confirmadas:</span>
            <span className="font-medium text-green-600">6</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Pendientes:</span>
            <span className="font-medium text-yellow-600">1</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Canceladas:</span>
            <span className="font-medium text-red-600">1</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
