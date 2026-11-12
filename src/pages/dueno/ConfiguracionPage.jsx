import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import frizkyApi from '../../api/frizkyApi';

function ConfiguracionPage() {
  const [usuarios, setUsuarios] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarUsuarios = async () => {
      try {
        const respuesta = await frizkyApi.get('/Usuarios');
        setUsuarios(respuesta.data);
      } catch (error) {
        console.error("Error al cargar usuarios:", error);
      } finally {
        setCargando(false);
      }
    };

    cargarUsuarios();
  }, []);

  const eliminarUsuario = async (id, nombre) => {
    if (window.confirm(`¿Estás seguro de que querés dar de baja a "${nombre}"?`)) {
      try {
        await frizkyApi.delete(`/Usuarios/${id}`);
        // Actualizamos el estado local para no recargar la página entera
        setUsuarios(usuarios.filter(u => u.id !== id));
      } catch (error) {
        console.error("Error al eliminar usuario:", error);
        alert("No se pudo eliminar. Verificá que el usuario no tenga registros de actividad asociados.");
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* SECCIÓN 1: Información de la Planta */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8 mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <span>🏢</span> Información de la Planta
        </h2>
        
        <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={(e) => e.preventDefault()}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del Establecimiento</label>
            <input 
              type="text" 
              defaultValue="Planta Frisky Concepción"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-purple-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono de Contacto</label>
            <input 
              type="text" 
              defaultValue="+54 3865 123456"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-purple-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Administrativo</label>
            <input 
              type="email" 
              defaultValue="admin@friskyhelados.com"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-purple-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
            <input 
              type="text" 
              defaultValue="Parque Industrial, Concepción, Tucumán"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-purple-500 outline-none"
            />
          </div>
          <div className="md:col-span-2 flex justify-end mt-2">
            <button type="button" className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2.5 px-6 rounded-lg transition shadow-sm">
              Guardar Cambios
            </button>
          </div>
        </form>
      </div>

      {/* SECCIÓN 2: Gestión de Usuarios */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <span>👥</span> Gestión de Usuarios (Operarios)
            </h2>
            <p className="text-sm text-gray-500 mt-1">Administra el personal con acceso al sistema de empaque y verificación.</p>
          </div>
          
          {/* Botón hacia la bitácora que hicimos antes */}
          <Link to="/auditoria" className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2 px-4 rounded-lg transition text-sm flex items-center gap-2 border border-slate-200">
            <span>📋</span> Ver Log de Auditoría
          </Link>
        </div>

        <div className="mt-4 border-t border-gray-100">
          {cargando ? (
            <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div></div>
          ) : usuarios.length === 0 ? (
            <p className="text-center py-8 text-gray-500">No hay usuarios registrados en el sistema.</p>
          ) : (
            <div className="divide-y divide-gray-100">
              {usuarios.map(user => (
                <div key={user.id} className="py-4 flex justify-between items-center hover:bg-gray-50 px-2 rounded transition">
                  <div>
                    <h3 className="font-bold text-gray-900">{user.nombreUsuario}</h3>
                    <p className="text-xs text-gray-500">{user.rol} • Turno {user.turno || 'Normal'}</p>
                  </div>
                  <div className="space-x-2">
                    <button className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 font-medium py-1.5 px-3 rounded text-sm transition">
                      Editar
                    </button>
                    <button 
                      onClick={() => eliminarUsuario(user.id, user.nombreUsuario)}
                      className="bg-red-50 hover:bg-red-100 text-red-600 border border-red-100 font-medium py-1.5 px-3 rounded text-sm transition"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Botón para futuro alta de usuarios */}
        <div className="mt-6 pt-4 border-t border-gray-100 flex justify-center">
          <button className="text-purple-600 hover:text-purple-800 font-bold text-sm transition">
            + Añadir Nuevo Operario
          </button>
        </div>

      </div>
    </div>
  );
}

export default ConfiguracionPage;