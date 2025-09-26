import React, { useState } from 'react';
import { doctores, estadosCita } from '../data/mockData';
import AddUserModal from './AddUserModal';

const Sidebar = ({ 
  filtroDoctor, 
  setFiltroDoctor, 
  filtroEstado, 
  setFiltroEstado,
  onAddDoctor 
}) => {
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);

  const handleAddUser = () => {
    setIsAddUserModalOpen(true);
  };

  const handleSaveUser = async (userData) => {
    // Aquí iría la lógica para guardar el usuario
    console.log('Guardando usuario:', userData);
    // Simular guardado
    await new Promise(resolve => setTimeout(resolve, 1000));
  };
  
  return (
    <div className="w-80 bg-white border-l shadow-lg flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b bg-gradient-to-r from-[#4A3C7B] to-[#2D1B69]">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-white/20 rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-white">Todas las agendas</h2>
        </div>
        <p className="text-sm text-white/80 mt-1">Gestiona doctores y filtros</p>
      </div>

      {/* Filtros */}
      <div className="p-4 border-b bg-gray-50">
        <div className="space-y-4">
          {/* Filtro por estado */}
          <div>
            <label className="block text-sm font-semibold text-[#4A3C7B] mb-2">
              Estado
            </label>
            <select
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value)}
              className="w-full p-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-[#30B0B0] focus:border-[#30B0B0] transition-all duration-200 bg-white"
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
            <label className="block text-sm font-semibold text-[#4A3C7B] mb-2">
              Vista
            </label>
            <select
              className="w-full p-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-[#30B0B0] focus:border-[#30B0B0] transition-all duration-200 bg-white"
              defaultValue="semana"
            >
              <option value="semana">Por semana</option>
              <option value="dia">Por día</option>
              <option value="mes">Por mes</option>
            </select>
          </div>
        </div>
      </div>

      {/* Lista de usuarios */}
      <div className="flex-1 p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-semibold text-[#4A3C7B]">Usuarios</h3>
          <button
            onClick={handleAddUser}
            className="bg-gradient-to-r from-[#30B0B0] to-[#4A3C7B] text-white px-3 py-1 rounded-lg hover:from-[#4A3C7B] hover:to-[#2D1B69] transition-all duration-200 text-sm font-medium flex items-center shadow-sm"
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
            className={`flex items-center p-3 rounded-xl cursor-pointer transition-all duration-200 ${
              filtroDoctor === null 
                ? 'bg-gradient-to-r from-[#30B0B0]/20 to-[#4A3C7B]/20 border-2 border-[#30B0B0] shadow-sm' 
                : 'hover:bg-gray-50 border-2 border-transparent'
            }`}
          >
            <div className="w-4 h-4 rounded-full bg-gradient-to-r from-[#4A3C7B] to-[#2D1B69] mr-3 shadow-sm"></div>
            <div className="flex-1">
              <div className="text-sm font-semibold text-[#4A3C7B]">Todos los usuarios</div>
              <div className="text-xs text-gray-500">Ver todas las citas</div>
            </div>
            {filtroDoctor === null && (
              <svg className="w-4 h-4 text-[#30B0B0]" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            )}
          </div>

          {/* Lista de doctores individuales */}
          {doctores.map((doctor) => (
            <div
              key={doctor.id}
              onClick={() => setFiltroDoctor(doctor.id)}
              className={`flex items-center p-3 rounded-xl cursor-pointer transition-all duration-200 ${
                filtroDoctor === doctor.id 
                  ? 'bg-gradient-to-r from-[#30B0B0]/20 to-[#4A3C7B]/20 border-2 border-[#30B0B0] shadow-sm' 
                  : 'hover:bg-gray-50 border-2 border-transparent'
              }`}
            >
              <div className={`w-4 h-4 rounded-full ${doctor.color} mr-3 shadow-sm`}></div>
              <div className="flex-1">
                <div className="text-sm font-semibold text-[#4A3C7B]">{doctor.nombre}</div>
                <div className="text-xs text-gray-500">
                  {doctor.id === 1 ? 'Médico General' : 
                   doctor.id === 2 ? 'Área Especializada' : 'Especialista'}
                </div>
              </div>
              {filtroDoctor === doctor.id && (
                <svg className="w-4 h-4 text-[#30B0B0]" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Estadísticas rápidas */}
      <div className="p-4 border-t bg-gradient-to-br from-gray-50 to-white">
        <h4 className="text-sm font-semibold text-[#4A3C7B] mb-3">Resumen del día</h4>
        <div className="space-y-3">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">Total citas:</span>
            <span className="font-semibold text-[#4A3C7B] bg-[#4A3C7B]/10 px-2 py-1 rounded-full">8</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">Confirmadas:</span>
            <span className="font-semibold text-emerald-600 bg-emerald-100 px-2 py-1 rounded-full">6</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">Pendientes:</span>
            <span className="font-semibold text-amber-600 bg-amber-100 px-2 py-1 rounded-full">1</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">Canceladas:</span>
            <span className="font-semibold text-rose-600 bg-rose-100 px-2 py-1 rounded-full">1</span>
          </div>
        </div>
      </div>

      {/* Modal para agregar usuario */}
      <AddUserModal
        isOpen={isAddUserModalOpen}
        onClose={() => setIsAddUserModalOpen(false)}
        onSave={handleSaveUser}
      />
    </div>
  );
};

export default Sidebar;
