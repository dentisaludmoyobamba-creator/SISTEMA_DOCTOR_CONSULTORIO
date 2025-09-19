import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ activeTab, onTabChange, user, onLogout }) => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const tabs = [
    { id: 'agenda', name: 'Agenda', active: true },
    { id: 'pacientes', name: 'Pacientes', active: false },
    { id: 'caja', name: 'Caja', active: false },
    { id: 'marketing', name: 'Marketing', active: false },
    { id: 'productividad', name: 'Productividad', active: false },
    { id: 'inventario', name: 'Inventario', active: false },
    { id: 'laboratorio', name: 'Laboratorio', active: false },
    { id: 'chat', name: 'Chat', active: false },
    { id: 'iconos', name: 'Iconos', active: false }
  ];

  const handleTabClick = (tabId) => {
    onTabChange(tabId);
    navigate(`/${tabId}`);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Buscando paciente:', searchTerm);
    // Aquí iría la lógica de búsqueda
  };

  return (
    <nav className="bg-slate-700 text-white shadow-lg fixed top-0 left-0 right-0 z-50">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-white">Doctocliq</h1>
          </div>

          {/* Pestañas de navegación */}
          <div className="hidden md:flex space-x-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  activeTab === tab.id
                    ? 'bg-slate-600 text-white'
                    : 'text-slate-300 hover:text-white hover:bg-slate-600'
                }`}
              >
                {tab.name}
              </button>
            ))}
          </div>

          {/* Lado derecho: búsqueda y usuario */}
          <div className="flex items-center space-x-4">
            {/* Buscador */}
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Buscar paciente"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-slate-600 text-white placeholder-slate-400 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-slate-500 w-64"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </form>

            {/* Notificaciones */}
            <button className="text-slate-400 hover:text-white p-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM10.5 3.5L9 2 7.5 3.5 6 2 4.5 3.5 3 2v18l1.5-1.5L6 20l1.5-1.5L9 20l1.5-1.5L12 20V2l-1.5 1.5z" />
              </svg>
            </button>

            {/* Menú de usuario */}
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center space-x-2 text-sm bg-slate-600 rounded-md px-3 py-2 hover:bg-slate-500 transition-colors"
              >
                <span>{user?.nombre || 'Usuario'}</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Dropdown del usuario */}
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                  <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Mi Perfil
                  </button>
                  <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Configuración
                  </button>
                  <div className="border-t border-gray-100"></div>
                  <button 
                    onClick={onLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Cerrar Sesión
                  </button>
                </div>
              )}
            </div>

            {/* Selector de consultorio */}
            <div className="flex items-center space-x-2 text-sm">
              <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="text-slate-300">{user?.consultorio || 'Denti Salud'}</span>
              <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Menú móvil */}
      <div className="md:hidden">
        <div className="px-2 pt-2 pb-3 space-y-1 bg-slate-800">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className={`block w-full text-left px-3 py-2 rounded-md text-sm font-medium ${
                activeTab === tab.id
                  ? 'bg-slate-600 text-white'
                  : 'text-slate-300 hover:text-white hover:bg-slate-600'
              }`}
            >
              {tab.name}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
