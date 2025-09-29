import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import ProfileModal from './ProfileModal';

const Navbar = ({ activeTab, onTabChange, user, onLogout }) => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMarketingMenuOpen, setIsMarketingMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isQuickMenuOpen, setIsQuickMenuOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const marketingMenuRef = useRef(null);
  const userMenuRef = useRef(null);
  const quickMenuRef = useRef(null);
  const settingsRef = useRef(null);

  // Cerrar dropdowns al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (marketingMenuRef.current && !marketingMenuRef.current.contains(event.target)) {
        setIsMarketingMenuOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
      if (quickMenuRef.current && !quickMenuRef.current.contains(event.target)) {
        setIsQuickMenuOpen(false);
      }
      if (settingsRef.current && !settingsRef.current.contains(event.target)) {
        setIsSettingsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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
    setIsMarketingMenuOpen(false); // Cerrar dropdown de marketing
    setIsMobileMenuOpen(false); // Cerrar menú móvil
  };

  const handleMarketingMenuClick = () => {
    setIsMarketingMenuOpen(!isMarketingMenuOpen);
    setIsUserMenuOpen(false); // Cerrar menú de usuario si está abierto
  };

  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Buscando paciente:', searchTerm);
    // Aquí iría la lógica de búsqueda
  };

  return (
    <nav className="text-white shadow-xl fixed top-0 left-0 right-0 z-50">
      {/* Fila superior (más oscura): Marca y Usuario */}
      <div className="bg-gradient-to-r from-[#4A3C7B] to-[#2D1B69]">
        <div className="px-2 sm:px-4 lg:px-6">
          <div className="flex justify-between items-center h-14 sm:h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
            {/* Botón hamburguesa para móvil */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-1 text-white/80 hover:text-white transition-colors duration-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-white rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg">
              <svg className="w-3 h-3 sm:w-5 sm:h-5 text-[#4A3C7B]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            </div>
            <div className="hidden sm:block flex-shrink-0">
              <h1 className="text-lg sm:text-xl font-bold text-white">DENTI SALUD</h1>
              <p className="text-xs text-[#30B0B0] font-medium">ODONTOLOGÍA</p>
            </div>
            <div className="sm:hidden flex-shrink-0">
              <h1 className="text-sm font-bold text-white">DENTI SALUD</h1>
            </div>
          </div>
            {/* Usuario */}
            <div className="flex items-center space-x-3">
              {/* Menú de usuario */}
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 text-sm bg-white/20 backdrop-blur-sm rounded-lg px-3 py-2 hover:bg-white/30 transition-all duration-200 border border-white/20"
                >
                  <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user?.nombre || 'Usuario')}&background=30B0B0&color=fff`}
                       alt="avatar" className="w-6 h-6 rounded-full hidden sm:block" />
                  <span className="hidden sm:inline font-medium">{user?.nombre || 'Usuario'}</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded-md shadow-lg py-1 z-50">
                    <button 
                      onClick={() => {
                        setIsProfileModalOpen(true);
                        setIsUserMenuOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                    >
                      Mi Perfil
                    </button>
                    <button className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100">Configuración</button>
                    <div className="border-t" />
                    <button onClick={onLogout} className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100">Cerrar Sesión</button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fila inferior (más clara): Tabs e iconos + buscador */}
      <div className="bg-gradient-to-r from-[#2D1B69] to-[#1A0F3D]">
        <div className="px-2 sm:px-4 lg:px-6">
          <div className="flex items-center justify-between h-12">
            {/* Pestañas de navegación */}
            <div className="hidden md:flex space-x-1">
            {tabs.slice(0, 3).map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-[#30B0B0] text-white shadow-lg'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                {tab.name}
              </button>
            ))}
            
            {/* Dropdown de Marketing */}
            <div className="relative" ref={marketingMenuRef}>
              <button
                onClick={handleMarketingMenuClick}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-1 ${
                  activeTab.startsWith('marketing') || activeTab.startsWith('segmentaciones') || 
                  activeTab.startsWith('cumpleanos') || activeTab.startsWith('automatizaciones') ||
                  activeTab.startsWith('campanas') || activeTab.startsWith('embudo') || activeTab.startsWith('soyla')
                    ? 'bg-[#30B0B0] text-white shadow-lg'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                <span>Marketing</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isMarketingMenuOpen && (
                <div className="absolute top-full left-0 mt-1 w-56 bg-white rounded-md shadow-lg py-2 z-50">
                  <button
                    onClick={() => handleTabClick('segmentaciones')}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-3"
                  >
                    <div className="w-6 h-6 flex items-center justify-center">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <span>Segmentaciones</span>
                  </button>

                  <button
                    onClick={() => handleTabClick('cumpleanos')}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-3"
                  >
                    <div className="w-6 h-6 flex items-center justify-center">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
                      </svg>
                    </div>
                    <span>Cumpleaños</span>
                  </button>

                  <button
                    onClick={() => handleTabClick('automatizaciones')}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-3"
                  >
                    <div className="w-6 h-6 flex items-center justify-center">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <span>Automatizaciones</span>
                  </button>

                  <button
                    onClick={() => handleTabClick('campanas')}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-3"
                  >
                    <div className="w-6 h-6 flex items-center justify-center">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                      </svg>
                    </div>
                    <span>Campañas</span>
                  </button>

                  <button
                    onClick={() => handleTabClick('embudo-ventas')}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-3"
                  >
                    <div className="w-6 h-6 flex items-center justify-center">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 13l-7 7-7-7m14-6l-7 7-7-7" />
                      </svg>
                    </div>
                    <span>Embudo de ventas</span>
                  </button>

                  <button
                    onClick={() => handleTabClick('soyla-ia')}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-3"
                  >
                    <div className="w-6 h-6 flex items-center justify-center">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span>Soyla IA</span>
                      <span className="px-2 py-1 bg-blue-100 text-blue-600 text-xs rounded-full">PRONTO</span>
                    </div>
                  </button>
                </div>
              )}
            </div>

            {/* Pestañas restantes */}
            {tabs.slice(4).map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-[#30B0B0] text-white shadow-lg'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                {tab.name}
              </button>
            ))}
          </div>

            {/* Acciones y buscador */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              {/* Engranaje */}
              <div className="relative" ref={settingsRef}>
                <button onClick={() => setIsSettingsOpen(!isSettingsOpen)} className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </button>
                {isSettingsOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white text-gray-800 rounded-md shadow-lg py-2 z-50">
                    <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100">Etiquetas</button>
                    <button 
                      onClick={() => { setIsSettingsOpen(false); handleTabClick('configuracion'); }}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                    >
                      Servicios
                    </button>
                    <button 
                      onClick={() => { setIsSettingsOpen(false); handleTabClick('usuarios'); }}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                    >
                      Usuarios
                    </button>
                    <div className="border-t my-1" />
                    <button 
                      onClick={() => { setIsSettingsOpen(false); handleTabClick('configuracion'); }}
                      className="w-full text-left px-4 py-2 text-sm text-teal-700 hover:bg-teal-50"
                    >
                      Ir a configuración
                    </button>
                  </div>
                )}
              </div>

              {/* Botón suma - Acciones rápidas */}
              <div className="relative" ref={quickMenuRef}>
                <button onClick={() => setIsQuickMenuOpen(!isQuickMenuOpen)} className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </button>
                {isQuickMenuOpen && (
                  <div className="absolute right-0 mt-2 bg-white text-gray-800 rounded-xl shadow-xl p-3 z-50 w-80">
                    <div className="grid grid-cols-2 gap-2">
                      <button className="border border-teal-200 rounded-xl p-3 hover:bg-teal-50 text-teal-700">
                        <div className="flex items-center justify-center mb-2">
                          <svg className="w-6 h-6 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 14l2 2 4-4m-2-7a2 2 0 012 2v2h-6V7a2 2 0 012-2zM7 11a2 2 0 012-2h6a2 2 0 012 2v7H7v-7z" /></svg>
                        </div>
                        <div className="text-center text-sm">Crear presupuesto</div>
                      </button>
                      <button className="border border-teal-200 rounded-xl p-3 hover:bg-teal-50 text-teal-700">
                        <div className="flex items-center justify-center mb-2">
                          <svg className="w-6 h-6 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </div>
                        <div className="text-center text-sm">Generar link de pago</div>
                      </button>
                      <button onClick={() => { setIsQuickMenuOpen(false); handleTabClick('pacientes'); }} className="border border-teal-200 rounded-xl p-3 hover:bg-teal-50 text-teal-700">
                        <div className="flex items-center justify-center mb-2">
                          <svg className="w-6 h-6 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A7 7 0 1118.879 4.196 7 7 0 015.12 17.804zM15 11h3m-6 0H6" /></svg>
                        </div>
                        <div className="text-center text-sm">Nuevo paciente</div>
                      </button>
                      <button onClick={() => { setIsQuickMenuOpen(false); handleTabClick('agenda'); }} className="border border-teal-200 rounded-xl p-3 hover:bg-teal-50 text-teal-700">
                        <div className="flex items-center justify-center mb-2">
                          <svg className="w-6 h-6 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                        </div>
                        <div className="text-center text-sm">Agendar cita</div>
                      </button>
                      <button onClick={() => { setIsQuickMenuOpen(false); handleTabClick('campanas'); }} className="border border-teal-200 rounded-xl p-3 hover:bg-teal-50 text-teal-700 col-span-2">
                        <div className="flex items-center justify-center mb-2">
                          <svg className="w-6 h-6 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        </div>
                        <div className="text-center text-sm">Crear campaña</div>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Buscador */}
              <form onSubmit={handleSearch} className="relative hidden sm:block">
                <input
                  type="text"
                  placeholder="Buscar paciente"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-white/20 backdrop-blur-sm text-white placeholder-white/60 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#30B0B0] focus:bg-white/30 border border-white/20 w-48 lg:w-64 transition-all duration-200"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white/80 hover:text-white transition-colors duration-200"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Menú móvil - Solo visible cuando está abierto */}
      {isMobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-1 pb-2 space-y-1 bg-gradient-to-b from-[#2D1B69] to-[#1A0F3D] max-h-64 overflow-y-auto">
            {/* Solo mostrar las pestañas más importantes en móvil */}
            {tabs.slice(0, 4).map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={`block w-full text-left px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-[#30B0B0] text-white shadow-lg'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                {tab.name}
              </button>
            ))}
            
            {/* Dropdown compacto de Marketing en móvil */}
            <div className="border-t border-white/20 pt-1">
              <div className="text-xs text-[#30B0B0] px-3 py-1 font-medium">Marketing</div>
              <button
                onClick={() => handleTabClick('embudo-ventas')}
                className="block w-full text-left px-6 py-1.5 rounded-lg text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 transition-all duration-200"
              >
                Embudo de ventas
              </button>
              <button
                onClick={() => handleTabClick('cumpleanos')}
                className="block w-full text-left px-6 py-1.5 rounded-lg text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 transition-all duration-200"
              >
                Cumpleaños
              </button>
              <button
                onClick={() => handleTabClick('segmentaciones')}
                className="block w-full text-left px-6 py-1.5 rounded-lg text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 transition-all duration-200"
              >
                Segmentaciones
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Perfil */}
      <ProfileModal 
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        user={user}
      />
    </nav>
  );
};

export default Navbar;
