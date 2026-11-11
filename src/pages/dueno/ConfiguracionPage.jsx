import { useState } from 'react';

const USUARIOS_MOCK = [
  { id: 1, nombre: 'Juan Pérez', rol: 'Dueño', turno: 'Todos' },
  { id: 2, nombre: 'María González', rol: 'Operario', turno: 'Mañana' },
  { id: 3, nombre: 'Carlos Rodríguez', rol: 'Operario', turno: 'Tarde' }
];

function ConfiguracionPage() {
  const [usuarios, setUsuarios] = useState(USUARIOS_MOCK);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Configuración del Sistema</h1>
        <p className="text-gray-500 text-sm mt-1">Administra las opciones globales y los accesos de la planta Frisky.</p>
      </div>

      <div className="space-y-6">
        {/* Información de la Planta */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <span className="text-purple-600">🏢</span> Información de la Planta
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del Establecimiento</label>
              <input type="text" defaultValue="Planta Frisky Concepción" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-purple-500 focus:border-purple-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono de Contacto</label>
              <input type="text" defaultValue="+54 3865 123456" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-purple-500 focus:border-purple-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Administrativo</label>
              <input type="email" defaultValue="admin@friskyhelados.com" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-purple-500 focus:border-purple-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
              <input type="text" defaultValue="Parque Industrial, Concepción, Tucumán" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-purple-500 focus:border-purple-500" />
            </div>
          </div>
          <div className="flex justify-end">
            <button className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition text-sm">
              Guardar Cambios
            </button>
          </div>
        </div>

        {/* Gestión de Usuarios */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <span className="text-purple-600">👥</span> Gestión de Usuarios (Operarios)
          </h2>
          <p className="text-sm text-gray-500 mb-4">Administra el personal con acceso al sistema de empaque y verificación.</p>
          
          <div className="border border-gray-100 rounded-lg overflow-hidden mb-4">
            {usuarios.map((user, index) => (
              <div key={user.id} className={`flex items-center justify-between p-4 ${index !== usuarios.length - 1 ? 'border-b border-gray-100' : ''}`}>
                <div>
                  <p className="font-bold text-gray-900">{user.nombre}</p>
                  <p className="text-sm text-gray-500">{user.rol} • Turno {user.turno}</p>
                </div>
                <div className="flex gap-2">
                  <button className="text-sm font-medium text-gray-600 hover:text-purple-600 bg-gray-50 hover:bg-purple-50 border border-gray-200 px-3 py-1.5 rounded transition">
                    Editar
                  </button>
                  <button className="text-sm font-medium text-red-600 hover:text-red-700 bg-red-50 border border-red-100 px-3 py-1.5 rounded transition">
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2.5 rounded-lg transition text-sm">
            + Agregar Nuevo Usuario
          </button>
        </div>

        {/* Parámetros de Producción y Notificaciones */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <span className="text-purple-600">⚙️</span> Parámetros de Producción
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Temperatura Cámara de Frío (°C)</label>
                <input type="number" defaultValue="-18" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-purple-500 focus:border-purple-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Margen Tolerancia Rechazos (%)</label>
                <input type="number" defaultValue="2" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-purple-500 focus:border-purple-500" />
              </div>
            </div>
            <button className="mt-4 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition text-sm w-full">
              Guardar Parámetros
            </button>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <span className="text-purple-600">🔔</span> Notificaciones Automáticas
            </h2>
            <div className="space-y-3">
              <label className="flex items-center justify-between p-3 border border-gray-100 rounded-lg bg-gray-50 cursor-pointer">
                <span className="text-sm font-medium text-gray-700">Alerta de stock bajo</span>
                <input type="checkbox" defaultChecked className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500" />
              </label>
              <label className="flex items-center justify-between p-3 border border-gray-100 rounded-lg bg-gray-50 cursor-pointer">
                <span className="text-sm font-medium text-gray-700">Reporte diario de producción</span>
                <input type="checkbox" defaultChecked className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500" />
              </label>
              <label className="flex items-center justify-between p-3 border border-gray-100 rounded-lg bg-gray-50 cursor-pointer">
                <span className="text-sm font-medium text-gray-700">Aviso de productos próximos a vencer</span>
                <input type="checkbox" defaultChecked className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500" />
              </label>
            </div>
          </div>
        </div>

        {/* Zona de Peligro */}
        <div className="bg-red-50 p-6 rounded-xl border border-red-200 shadow-sm">
          <h2 className="text-lg font-semibold text-red-800 mb-4">Zona de Peligro</h2>
          <div className="space-y-3">
            <button className="w-full bg-white border border-red-300 text-red-700 hover:bg-red-100 font-bold py-2.5 rounded-lg transition text-sm">
              Restablecer Configuración de Fábrica
            </button>
            <button className="w-full bg-white border border-red-300 text-red-700 hover:bg-red-100 font-bold py-2.5 rounded-lg transition text-sm">
              Purgar Historial de Registro de Actividad
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ConfiguracionPage;