import React from 'react';

const IconPage = () => {
  const faviconPath = '/favicon.ico';
  const buildingImagePath = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDUwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxkZWZzPgo8bGluZWFyR3JhZGllbnQgaWQ9InNreSIgeDE9IjAlIiB5MT0iMCUiIHgyPSIwJSIgeTI9IjEwMCUiPgo8c3RvcCBvZmZzZXQ9IjAlIiBzdG9wLWNvbG9yPSIjODdDRUVCIi8+CjxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0iI0UwRjJGNyIvPgo8L2xpbmVhckdyYWRpZW50Pgo8L2RlZnM+CjxyZWN0IHdpZHRoPSI1MDAiIGhlaWdodD0iNDAwIiBmaWxsPSJ1cmwoI3NreSkiLz4KPCEtLSBCdWlsZGluZ3MgLS0+CjxyZWN0IHg9IjQwIiB5PSIxNTAiIHdpZHRoPSIxMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjNDc1NTY5Ii8+CjxyZWN0IHg9IjE2MCIgeT0iMTIwIiB3aWR0aD0iMTQwIiBoZWlnaHQ9IjIzMCIgZmlsbD0iIzYzNjQ3OCIvPgo8cmVjdCB4PSIzMjAiIHk9IjEwMCIgd2lkdGg9IjEyMCIgaGVpZ2h0PSIyNTAiIGZpbGw9IiM0NzU1NjkiLz4KPCEtLSBXaW5kb3dzIC0tPgo8cmVjdCB4PSI1MCIgeT0iMTcwIiB3aWR0aD0iMjAiIGhlaWdodD0iMzAiIGZpbGw9IiNmZmY3ZWQiLz4KPHJlY3QgeD0iNzUiIHk9IjE3MCIgd2lkdGg9IjIwIiBoZWlnaHQ9IjMwIiBmaWxsPSIjZmZmN2VkIi8+CjxyZWN0IHg9IjEwMCIgeT0iMTcwIiB3aWR0aD0iMjAiIGhlaWdodD0iMzAiIGZpbGw9IiNmZmY3ZWQiLz4KPHJlY3QgeD0iMTcwIiB5PSIxNDAiIHdpZHRoPSIyNSIgaGVpZ2h0PSI0MCIgZmlsbD0iI2ZmZjdlZCIvPgo8cmVjdCB4PSIyMDAiIHk9IjE0MCIgd2lkdGg9IjI1IiBoZWlnaHQ9IjQwIiBmaWxsPSIjZmZmN2VkIi8+CjxyZWN0IHg9IjIzMCIgeT0iMTQwIiB3aWR0aD0iMjUiIGhlaWdodD0iNDAiIGZpbGw9IiNmZmY3ZWQiLz4KPHJlY3QgeD0iMjYwIiB5PSIxNDAiIHdpZHRoPSIyNSIgaGVpZ2h0PSI0MCIgZmlsbD0iI2ZmZjdlZCIvPgo8cmVjdCB4PSIzMzAiIHk9IjEyMCIgd2lkdGg9IjMwIiBoZWlnaHQ9IjUwIiBmaWxsPSIjZmZmN2VkIi8+CjxyZWN0IHg9IjM4MCIgeT0iMTIwIiB3aWR0aD0iMzAiIGhlaWdodD0iNTAiIGZpbGw9IiNmZmY3ZWQiLz4KPCEtLSBTdW4gLS0+CjxjaXJjbGUgY3g9IjQwMCIgY3k9IjgwIiByPSI0MCIgZmlsbD0iI0ZGRDcwMCIvPgo8IS0tIEdyb3VuZCAtLT4KPHJlY3QgeD0iMCIgeT0iMzUwIiB3aWR0aD0iNTAwIiBoZWlnaHQ9IjUwIiBmaWxsPSIjM0Y3RTU1Ii8+CjwhLS0gUm9hZCAtLT4KPHJlY3QgeD0iMCIgeT0iMzYwIiB3aWR0aD0iNTAwIiBoZWlnaHQ9IjMwIiBmaWxsPSIjNzc3Ii8+CjwhLS0gQ2FycyAtLT4KPHJlY3QgeD0iMjAwIiB5PSIzNzAiIHdpZHRoPSI0MCIgaGVpZ2h0PSIyMCIgZmlsbD0iIzMzNzNkYyIvPgo8cmVjdCB4PSIyNTUiIHk9IjM3MCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjIwIiBmaWxsPSIjNzc3Ii8+CjxyZWN0IHg9IjMxMCIgeT0iMzcwIiB3aWR0aD0iNDAiIGhlaWdodD0iMjAiIGZpbGw9IiNEQzI2MjYiLz4KPHJlY3QgeD0iMzY1IiB5PSIzNzAiIHdpZHRoPSI0MCIgaGVpZ2h0PSIyMCIgZmlsbD0iIzMzNzNkYyIvPgo8L3N2Zz4=';

  return (
    <div className="flex h-screen bg-gray-50 pt-16">
      <div className="flex-1 flex flex-col">
        <div className="bg-white shadow-sm border-b px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Rutas de Imágenes - Sistema Doctocliq</h1>
        </div>

        <div className="flex-1 p-6 overflow-auto">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">🖼️ Imágenes y Rutas Disponibles</h2>

              <div className="space-y-6">
                {/* Favicon */}
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-2">1. Icono de Página (Favicon)</h3>
                  <div className="flex items-center space-x-4">
                    <img src={faviconPath} alt="Favicon" className="w-8 h-8" />
                    <div>
                      <p className="text-sm text-gray-600">
                        <strong>Ruta:</strong> <code className="bg-gray-100 px-2 py-1 rounded">/favicon.ico</code>
                      </p>
                      <p className="text-sm text-gray-600">
                        <strong>HTML:</strong> <code className="bg-gray-100 px-2 py-1 rounded">&lt;link rel="icon" href="%PUBLIC_URL%/favicon.ico" type="image/x-icon" /&gt;</code>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Imagen del edificio para login */}
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-2">2. Imagen de Edificio (Login)</h3>
                  <div className="flex items-start space-x-4">
                    <div className="w-32 h-24 bg-gray-200 rounded flex items-center justify-center overflow-hidden">
                      <img
                        src={buildingImagePath}
                        alt="Edificio Consultorio"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-600 mb-2">
                        <strong>Ruta:</strong> <code className="bg-gray-100 px-2 py-1 rounded">data:image/svg+xml;base64,[base64_data]</code>
                      </p>
                      <p className="text-sm text-gray-600">
                        <strong>Uso:</strong> Background del panel izquierdo en la página de login
                      </p>
                      <p className="text-sm text-gray-600">
                        <strong>Descripción:</strong> Ilustración SVG de edificios con cielo azul, sol y elementos urbanos
                      </p>
                    </div>
                  </div>
                </div>

                {/* Mapa para login */}
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-2">3. Mapa (Login)</h3>
                  <div className="flex items-center space-x-4">
                    <div className="w-48 h-20 bg-gray-700 rounded relative overflow-hidden">
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
                    <div>
                      <p className="text-sm text-gray-600">
                        <strong>Ruta:</strong> <code className="bg-gray-100 px-2 py-1 rounded">SVG inline en componente</code>
                      </p>
                      <p className="text-sm text-gray-600">
                        <strong>Uso:</strong> Mapa ilustrativo en la sección de ubicación del login
                      </p>
                      <p className="text-sm text-gray-600">
                        <strong>Descripción:</strong> Mapa SVG estilizado con ubicación de Moyobamba, Perú
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">📁 Archivos de Imágenes</h2>

              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <span className="font-medium">favicon.ico</span>
                  <code className="text-sm text-gray-600">/public/favicon.ico</code>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <span className="font-medium">favicon.ico</span>
                  <code className="text-sm text-gray-600">/public/favicon.ico (fallback)</code>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <span className="font-medium">index.html</span>
                  <code className="text-sm text-gray-600">/public/index.html (configuración)</code>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 rounded-lg p-6">
              <h2 className="text-lg font-semibold text-blue-900 mb-3">🔧 Solución del Problema de Navegación</h2>
              <div className="space-y-2 text-blue-800">
                <p><strong>Problema:</strong> No se podía navegar a las secciones de Pacientes y Caja</p>
                <p><strong>Solución:</strong> Se agregaron las importaciones faltantes en App.js:</p>
                <ul className="list-disc list-inside ml-4">
                  <li>import Marketing from './pages/Marketing'</li>
                  <li>import Productividad from './pages/Productividad'</li>
                  <li>import Inventario from './pages/Inventario'</li>
                  <li>import Laboratorio from './pages/Laboratorio'</li>
                  <li>import Chat from './pages/Chat'</li>
                </ul>
                <p><strong>Resultado:</strong> Ahora todas las rutas funcionan correctamente y se puede navegar entre todas las secciones.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IconPage;
