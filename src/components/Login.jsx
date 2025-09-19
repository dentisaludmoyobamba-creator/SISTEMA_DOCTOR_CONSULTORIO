import React, { useState } from 'react';

const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    usuario: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simular carga de login
    setTimeout(() => {
      if (formData.usuario && formData.password) {
        onLogin({
          nombre: 'Eduardo Carmin',
          usuario: formData.usuario,
          consultorio: 'Denti Salud'
        });
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex">
      {/* Panel Izquierdo - Información */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-slate-700 to-slate-900 relative overflow-hidden">
        {/* Imagen de fondo del edificio */}
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDUwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxkZWZzPgo8bGluZWFyR3JhZGllbnQgaWQ9InNreSIgeDE9IjAlIiB5MT0iMCUiIHgyPSIwJSIgeTI9IjEwMCUiPgo8c3RvcCBvZmZzZXQ9IjAlIiBzdG9wLWNvbG9yPSIjODdDRUVCIi8+CjxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0iI0UwRjJGNyIvPgo8L2xpbmVhckdyYWRpZW50Pgo8L2RlZnM+CjxyZWN0IHdpZHRoPSI1MDAiIGhlaWdodD0iNDAwIiBmaWxsPSJ1cmwoI3NreSkiLz4KPCEtLSBCdWlsZGluZ3MgLS0+CjxyZWN0IHg9IjQwIiB5PSIxNTAiIHdpZHRoPSIxMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjNDc1NTY5Ii8+CjxyZWN0IHg9IjE2MCIgeT0iMTIwIiB3aWR0aD0iMTQwIiBoZWlnaHQ9IjIzMCIgZmlsbD0iIzYzNjQ3OCIvPgo8cmVjdCB4PSIzMjAiIHk9IjEwMCIgd2lkdGg9IjEyMCIgaGVpZ2h0PSIyNTAiIGZpbGw9IiM0NzU1NjkiLz4KPCEtLSBXaW5kb3dzIC0tPgo8cmVjdCB4PSI1MCIgeT0iMTcwIiB3aWR0aD0iMjAiIGhlaWdodD0iMzAiIGZpbGw9IiNmZmY3ZWQiLz4KPHJlY3QgeD0iNzUiIHk9IjE3MCIgd2lkdGg9IjIwIiBoZWlnaHQ9IjMwIiBmaWxsPSIjZmZmN2VkIi8+CjxyZWN0IHg9IjEwMCIgeT0iMTcwIiB3aWR0aD0iMjAiIGhlaWdodD0iMzAiIGZpbGw9IiNmZmY3ZWQiLz4KPHJlY3QgeD0iMTcwIiB5PSIxNDAiIHdpZHRoPSIyNSIgaGVpZ2h0PSI0MCIgZmlsbD0iI2ZmZjdlZCIvPgo8cmVjdCB4PSIyMDAiIHk9IjE0MCIgd2lkdGg9IjI1IiBoZWlnaHQ9IjQwIiBmaWxsPSIjZmZmN2VkIi8+CjxyZWN0IHg9IjIzMCIgeT0iMTQwIiB3aWR0aD0iMjUiIGhlaWdodD0iNDAiIGZpbGw9IiNmZmY3ZWQiLz4KPHJlY3QgeD0iMjYwIiB5PSIxNDAiIHdpZHRoPSIyNSIgaGVpZ2h0PSI0MCIgZmlsbD0iI2ZmZjdlZCIvPgo8cmVjdCB4PSIzMzAiIHk9IjEyMCIgd2lkdGg9IjMwIiBoZWlnaHQ9IjUwIiBmaWxsPSIjZmZmN2VkIi8+CjxyZWN0IHg9IjM4MCIgeT0iMTIwIiB3aWR0aD0iMzAiIGhlaWdodD0iNTAiIGZpbGw9IiNmZmY3ZWQiLz4KPCEtLSBTdW4gLS0+CjxjaXJjbGUgY3g9IjQwMCIgY3k9IjgwIiByPSI0MCIgZmlsbD0iI0ZGRDcwMCIvPgo8IS0tIEdyb3VuZCAtLT4KPHJlY3QgeD0iMCIgeT0iMzUwIiB3aWR0aD0iNTAwIiBoZWlnaHQ9IjUwIiBmaWxsPSIjM0Y3RTU1Ii8+CjwhLS0gUm9hZCAtLT4KPHJlY3QgeD0iMCIgeT0iMzYwIiB3aWR0aD0iNTAwIiBoZWlnaHQ9IjMwIiBmaWxsPSIjNzc3Ii8+CjwhLS0gQ2FycyAtLT4KPHJlY3QgeD0iMjAwIiB5PSIzNzAiIHdpZHRoPSI0MCIgaGVpZ2h0PSIyMCIgZmlsbD0iIzMzNzNkYyIvPgo8cmVjdCB4PSIyNTUiIHk9IjM3MCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjIwIiBmaWxsPSIjNzc3Ii8+CjxyZWN0IHg9IjMxMCIgeT0iMzcwIiB3aWR0aD0iNDAiIGhlaWdodD0iMjAiIGZpbGw9IiNEQzI2MjYiLz4KPHJlY3QgeD0iMzY1IiB5PSIzNzAiIHdpZHRoPSI0MCIgaGVpZ2h0PSIyMCIgZmlsbD0iIzMzNzNkYyIvPgo8L3N2Zz4=')`
          }}
        >
        </div>
        
        {/* Contenido del panel izquierdo */}
        <div className="relative z-10 flex flex-col justify-center p-12 text-white">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4">Doctocliq</h1>
            <p className="text-xl text-gray-200 mb-6">
              Sistema integral de gestión médica
            </p>
            <p className="text-gray-300 leading-relaxed">
              Gestiona tu consultorio de manera eficiente con nuestro sistema completo 
              que incluye agenda, pacientes, facturación y más.
            </p>
          </div>

          {/* Mini mapa/ubicación */}
          <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-4">
            <div className="flex items-center mb-3">
              <svg className="w-5 h-5 text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="font-semibold">Denti Salud</span>
            </div>
            <p className="text-sm text-gray-300">
              Jr. Lima 123, Moyobamba<br/>
              San Martín, Perú
            </p>
            <div className="mt-3 h-20 bg-gray-700 bg-opacity-50 rounded relative overflow-hidden">
              <svg className="w-full h-full" viewBox="0 0 200 80" fill="none">
                <rect width="200" height="80" fill="#374151"/>
                <rect x="20" y="10" width="160" height="60" fill="#4B5563" rx="2"/>
                <rect x="30" y="20" width="140" height="40" fill="#6B7280" rx="1"/>
                <circle cx="50" cy="35" r="3" fill="#3B82F6"/>
                <circle cx="100" cy="40" r="4" fill="#EF4444"/>
                <circle cx="150" cy="30" r="2" fill="#10B981"/>
                <rect x="40" y="45" width="30" height="3" fill="#9CA3AF" rx="1"/>
                <rect x="80" y="50" width="25" height="2" fill="#9CA3AF" rx="1"/>
                <rect x="130" y="45" width="20" height="2" fill="#9CA3AF" rx="1"/>
                <text x="100" y="75" textAnchor="middle" fill="#9CA3AF" fontSize="6">Moyobamba, Perú</text>
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Panel Derecho - Formulario de Login */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Logo para móviles */}
          <div className="lg:hidden text-center mb-8">
            <h1 className="text-3xl font-bold text-slate-700 mb-2">Doctocliq</h1>
            <p className="text-gray-600">Sistema de gestión médica</p>
          </div>

          {/* Formulario */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Iniciar Sesión</h2>
              <p className="text-gray-600">Accede a tu cuenta del consultorio</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Campo Usuario */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Usuario
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="usuario"
                    value={formData.usuario}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Ingresa tu usuario"
                    required
                  />
                  <svg className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              </div>

              {/* Campo Contraseña */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contraseña
                </label>
                <div className="relative">
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Ingresa tu contraseña"
                    required
                  />
                  <svg className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
              </div>

              {/* Recordar sesión */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="remember"
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="remember" className="ml-2 text-sm text-gray-600">
                    Recordar sesión
                  </label>
                </div>
                <button type="button" className="text-sm text-blue-600 hover:text-blue-800">
                  ¿Olvidaste tu contraseña?
                </button>
              </div>

              {/* Botón de login */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Ingresando...
                  </div>
                ) : (
                  'Iniciar Sesión'
                )}
              </button>
            </form>

            {/* Información adicional */}
            <div className="mt-6 text-center">
              <p className="text-xs text-gray-500">
                © 2024 Doctocliq. Sistema para Consultorio Moyobamba
              </p>
            </div>
          </div>

          {/* Información de contacto */}
          <div className="mt-6 text-center text-sm text-gray-600">
            <p>¿Necesitas ayuda? Contacta al administrador</p>
            <p className="font-medium text-blue-600">soporte@doctocliq.com</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
