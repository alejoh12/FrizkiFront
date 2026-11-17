import { useState, useEffect } from 'react';
import frizkyApi from '../../api/frizkyApi';

function ConfiguracionPage() {
  const [usuarios, setUsuarios] = useState([]);
  const [registros, setRegistros] = useState([]);
  const [lotes, setLotes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [filtroAccion, setFiltroAccion] = useState('Todas');
  const [filtroUsuario, setFiltroUsuario] = useState('Todos');

  useEffect(() => {
    const cargarDatos = async () => {
      setCargando(true);
      try {
        const [resUsuarios, resRegistros, resLotes] = await Promise.all([
          frizkyApi.get('/Usuarios'),
          frizkyApi.get('/RegistroActividad'),
          frizkyApi.get('/Lotes')
        ]);

        setUsuarios(resUsuarios.data);
        const ordenados = [...resRegistros.data].sort(
          (a, b) => new Date(b.fechaHora) - new Date(a.fechaHora)
        );
        setRegistros(ordenados);
        setLotes(resLotes.data);
      } catch (error) {
        console.error("Error al cargar datos de configuración:", error);
      } finally {
        setCargando(false);
      }
    };

    cargarDatos();
  }, []);

  // FUNCIONAL (DELETE real a /Usuarios/{id})
  const eliminarUsuario = async (id, nombre) => {
    if (window.confirm(`¿Estás seguro de que querés dar de baja a "${nombre}"?`)) {
      try {
        await frizkyApi.delete(`/Usuarios/${id}`);
        setUsuarios(usuarios.filter(u => u.id !== id));
      } catch (error) {
        console.error("Error al eliminar usuario:", error);
        alert("No se pudo eliminar. Verificá que el usuario no tenga registros de actividad asociados.");
      }
    }
  };

  const getNombreUsuario = (usuarioId) => {
    const user = usuarios.find(u => u.id === usuarioId);
    return user ? (user.nombreUsuario || user.nombreCompleto) : `Operario #${usuarioId}`;
  };

  const getCodigoLote = (loteId) => {
    if (!loteId || loteId === 0) return 'Nuevo Lote';
    const lote = lotes.find(l => l.id === loteId);
    return lote ? lote.codigoLote : `Lote #${loteId}`;
  };

  const getEstiloAccion = (accion) => {
    const texto = accion.toLowerCase();
    if (texto.includes('cámara') || texto.includes('frío')) {
      return { badge: 'bg-cyan-100 text-cyan-800 border-cyan-200', dot: 'bg-cyan-500', icon: '❄️' };
    }
    if (texto.includes('empaque')) {
      return { badge: 'bg-purple-100 text-purple-800 border-purple-200', dot: 'bg-purple-500', icon: '📦' };
    }
    if (texto.includes('calidad') || texto.includes('aprobado')) {
      return { badge: 'bg-emerald-100 text-emerald-800 border-emerald-200', dot: 'bg-emerald-500', icon: '✅' };
    }
    if (texto.includes('rechazado')) {
      return { badge: 'bg-red-100 text-red-800 border-red-200', dot: 'bg-red-500', icon: '⚠️' };
    }
    return { badge: 'bg-amber-100 text-amber-800 border-amber-200', dot: 'bg-amber-500', icon: '📝' };
  };

  const formatearFecha = (fechaIso) => {
    if (!fechaIso) return '';
    const fecha = new Date(fechaIso);
    return fecha.toLocaleString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // FUNCIONAL (Filtrado en vivo de la bitácora)
  const registrosFiltrados = registros.filter(reg => {
    const accion = reg.accion.toLowerCase();

    let coincideAccion = true;
    if (filtroAccion === 'Ingreso') {
      coincideAccion = accion.includes('ingreso de lote');
    } else if (filtroAccion === 'Calidad') {
      coincideAccion = accion.includes('calidad');
    } else if (filtroAccion === 'Empaque') {
      coincideAccion = accion.includes('empaque');
    } else if (filtroAccion === 'Cámara') {
      coincideAccion = accion.includes('cámara') || accion.includes('frío');
    }

    const coincideUsuario =
      filtroUsuario === 'Todos' || reg.usuarioId === parseInt(filtroUsuario);

    return coincideAccion && coincideUsuario;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Encabezado Principal */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Configuración del Sistema</h1>
        <p className="text-gray-500 text-sm mt-1">
          Administra las opciones globales, el personal y la auditoría de la planta Frisky.
        </p>
      </div>

      {/* SECCIÓN 1: Bitácora de Auditoría y Trazabilidad (100% FUNCIONAL) */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8 mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <span>📋</span> Bitácora de Actividad en Planta
              </h2>
              <span className="bg-purple-100 text-purple-700 text-xs font-bold px-2.5 py-0.5 rounded-full">
                {registrosFiltrados.length} eventos
              </span>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Registro inmutable de movimientos, controles de calidad e ingresos a cámara de frío.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <select
              value={filtroUsuario}
              onChange={(e) => setFiltroUsuario(e.target.value)}
              className="border border-gray-200 bg-gray-50 text-gray-700 text-xs font-semibold rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-purple-500 outline-none cursor-pointer"
            >
              <option value="Todos">👤 Todos los empleados</option>
              {usuarios.map(u => (
                <option key={u.id} value={u.id}>
                  {u.nombreUsuario || u.nombreCompleto} ({u.rol})
                </option>
              ))}
            </select>

            <div className="flex flex-wrap items-center gap-1.5">
              {['Todas', 'Ingreso', 'Calidad', 'Empaque', 'Cámara'].map((filtro) => (
                <button
                  key={filtro}
                  type="button"
                  onClick={() => setFiltroAccion(filtro)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition border ${
                    filtroAccion === filtro
                      ? 'bg-purple-600 text-white border-purple-600'
                      : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  {filtro}
                </button>
              ))}
            </div>
          </div>
        </div>

        {cargando ? (
          <div className="flex justify-center py-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          </div>
        ) : registrosFiltrados.length === 0 ? (
          <div className="text-center py-10 border-2 border-dashed border-gray-100 rounded-xl text-gray-500 text-sm">
            No hay movimientos registrados para los filtros seleccionados.
          </div>
        ) : (
          <div className="relative pl-6 border-l-2 border-purple-100 space-y-4 max-h-96 overflow-y-auto pr-2">
            {registrosFiltrados.map((reg) => {
              const estilo = getEstiloAccion(reg.accion);
              return (
                <div key={reg.id} className="relative bg-gray-50/70 hover:bg-gray-50 rounded-xl p-4 border border-gray-100 transition">
                  <span
                    className={`absolute -left-[31px] top-5 w-3.5 h-3.5 rounded-full ring-4 ring-white ${estilo.dot}`}
                  ></span>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${estilo.badge}`}>
                        {estilo.icon} {reg.accion}
                      </span>
                      <span className="text-xs font-bold text-gray-700 bg-white px-2 py-0.5 rounded border border-gray-200">
                        {getCodigoLote(reg.loteId)}
                      </span>
                    </div>
                    <span className="text-xs text-gray-400 font-medium">
                      🕒 {formatearFecha(reg.fechaHora)}
                    </span>
                  </div>

                  {reg.observaciones && (
                    <p className="text-sm text-gray-700 mt-1">
                      “{reg.observaciones}”
                    </p>
                  )}

                  <p className="text-xs text-gray-500 mt-2">
                    Registrado por: <span className="font-semibold text-gray-700">{getNombreUsuario(reg.usuarioId)}</span>
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* SECCIÓN 2: Información de la Planta (Visual / Fuera de alcance MVP) */}
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
            {/* Botón puramente visual */}
            <button
              type="button"
              className="bg-purple-600 text-white font-bold py-2.5 px-6 rounded-lg shadow-sm cursor-default"
            >
              Guardar Cambios
            </button>
          </div>
        </form>
      </div>

      {/* SECCIÓN 3: Gestión de Usuarios (Listado y Eliminar reales; Editar y Agregar visuales) */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8 mb-8">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <span>👥</span> Gestión de Usuarios (Operarios)
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Administra el personal con acceso al sistema de empaque y verificación.
          </p>
        </div>

        {cargando ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          </div>
        ) : usuarios.length === 0 ? (
          <p className="text-center py-8 text-gray-500">No hay usuarios registrados en el sistema.</p>
        ) : (
          <div className="space-y-3">
            {usuarios.map(user => (
              <div
                key={user.id}
                className="p-4 rounded-xl border border-gray-200 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 bg-white"
              >
                <div>
                  <h3 className="font-bold text-gray-900">{user.nombreUsuario || user.nombreCompleto}</h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {user.rol} • Turno {user.turno || 'Todos'}
                  </p>
                </div>
                <div className="flex items-center gap-2 self-end sm:self-auto">
                  {/* Botón puramente visual */}
                  <button
                    type="button"
                    className="bg-white text-gray-700 border border-gray-200 font-medium py-1.5 px-3.5 rounded-lg text-sm cursor-default"
                  >
                    Editar
                  </button>
                  {/* Botón FUNCIONAL */}
                  <button
                    type="button"
                    // onClick={() => eliminarUsuario(user.id, user.nombreUsuario || user.nombreCompleto)}
                    className="bg-red-50 hover:bg-red-100 text-red-600 border border-red-100 font-medium py-1.5 px-3.5 rounded-lg text-sm transition"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Botón puramente visual */}
        <button
          type="button"
          className="mt-6 w-full bg-purple-600 text-white font-bold py-3 px-6 rounded-lg shadow-sm text-sm cursor-default"
        >
          + Agregar Nuevo Usuario
        </button>
      </div>

      {/* SECCIÓN 4: Parámetros de Producción y Notificaciones Automáticas (Visual / Fuera de alcance MVP) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8 flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
              <span>⚙️</span> Parámetros de Producción
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Temperatura Cámara de Frío (°C)
                </label>
                <input
                  type="number"
                  defaultValue={-18}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-purple-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Margen Tolerancia Rechazos (%)
                </label>
                <input
                  type="number"
                  defaultValue={2}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-purple-500 outline-none"
                />
              </div>
            </div>
          </div>
          {/* Botón puramente visual */}
          <button
            type="button"
            className="mt-6 w-full bg-purple-600 text-white font-bold py-2.5 px-6 rounded-lg shadow-sm text-sm cursor-default"
          >
            Guardar Parámetros
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
          <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
            <span>🔔</span> Notificaciones Automáticas
          </h2>
          <div className="space-y-3">
            <label className="flex items-center justify-between p-4 rounded-xl bg-gray-50 border border-gray-100">
              <span className="text-sm font-medium text-gray-700">Alerta de stock bajo</span>
              <input type="checkbox" defaultChecked className="h-4 w-4 accent-purple-600 rounded" />
            </label>
            <label className="flex items-center justify-between p-4 rounded-xl bg-gray-50 border border-gray-100">
              <span className="text-sm font-medium text-gray-700">Reporte diario de producción</span>
              <input type="checkbox" defaultChecked className="h-4 w-4 accent-purple-600 rounded" />
            </label>
            <label className="flex items-center justify-between p-4 rounded-xl bg-gray-50 border border-gray-100">
              <span className="text-sm font-medium text-gray-700">Aviso de productos próximos a vencer</span>
              <input type="checkbox" defaultChecked className="h-4 w-4 accent-purple-600 rounded" />
            </label>
          </div>
        </div>
      </div>

      {/* SECCIÓN 5: Zona de Peligro (Visual / Fuera de alcance MVP) */}
      <div className="bg-red-50/80 rounded-xl border border-red-200 p-6 md:p-8">
        <h2 className="text-base font-bold text-red-700 mb-4">Zona de Peligro</h2>
        <div className="space-y-3">
          {/* Botones puramente visuales */}
          <button
            type="button"
            className="w-full bg-white text-red-600 font-bold py-3 px-6 rounded-lg border border-red-200 text-sm cursor-default"
          >
            Restablecer Configuración de Fábrica
          </button>
          <button
            type="button"
            className="w-full bg-white text-red-600 font-bold py-3 px-6 rounded-lg border border-red-200 text-sm cursor-default"
          >
            Purgar Historial de Registro de Actividad
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfiguracionPage;