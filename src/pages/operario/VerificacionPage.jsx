import { useState, useEffect } from 'react';
import frizkyApi from '../../api/frizkyApi';

function VerificacionPage() {
  const [todosLosLotes, setTodosLosLotes] = useState([]);
  const [productos, setProductos] = useState([]);
  const [loteSeleccionado, setLoteSeleccionado] = useState(null);
  const [observaciones, setObservaciones] = useState('');
  const [cargando, setCargando] = useState(true);
  const [procesando, setProcesando] = useState(false);

  const cargarDatos = async () => {
    setCargando(true);
    try {
      const [resLotes, resProductos] = await Promise.all([
        frizkyApi.get('/Lotes'),
        frizkyApi.get('/Productos')
      ]);

      setProductos(resProductos.data);
      setTodosLosLotes(resLotes.data);
    } catch (error) {
      console.error("Error al cargar datos:", error);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const getProducto = (productoId) => {
    return productos.find(p => p.id === productoId);
  };

  const getNombreProducto = (productoId) => {
    const prod = getProducto(productoId);
    return prod ? `${prod.tipoPresentacion} - ${prod.sabor}` : 'Producto Desconocido';
  };

  // Contadores para las 3 tarjetas superiores
  const lotesPendientes = todosLosLotes.filter(l => l.estado === 'Pendiente');
  const cantidadVerificados = todosLosLotes.filter(
    l => l.estado === 'Aprobado' || l.estado === 'Empaquetado' || l.estado === 'Almacenado'
  ).length;
  const cantidadRechazados = todosLosLotes.filter(l => l.estado === 'Rechazado').length;

  const seleccionarLote = (lote) => {
    setLoteSeleccionado(lote);
    setObservaciones('');
  };

  const cambiarEstadoLote = async (nuevoEstado) => {
    if (!loteSeleccionado) return;
    setProcesando(true);

    try {
      // 1. Actualizamos el estado del lote (PUT)
      const loteActualizado = { ...loteSeleccionado, estado: nuevoEstado };
      await frizkyApi.put(`/Lotes/${loteSeleccionado.id}`, loteActualizado);

      // 2. Dejamos asentado el movimiento en el Registro de Actividad (POST)
      const textoObs = observaciones.trim()
        ? observaciones.trim()
        : `El operario verificó la muestra y determinó el estado: ${nuevoEstado}`;

      await frizkyApi.post('/RegistroActividad', {
        usuarioId: 1,
        loteId: loteSeleccionado.id,
        accion: `Control de Calidad: Lote ${nuevoEstado.toUpperCase()}`,
        observaciones: textoObs
      });

      // 3. Limpiamos el panel derecho y recargamos los datos
      setLoteSeleccionado(null);
      setObservaciones('');
      await cargarDatos();
    } catch (error) {
      console.error(`Error al marcar como ${nuevoEstado}:`, error);
      alert(`Hubo un error al intentar cambiar el estado del lote ${loteSeleccionado.codigoLote}`);
    } finally {
      setProcesando(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Encabezado */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Verificación de Productos</h1>
        <p className="text-gray-500 text-sm mt-1">Verifica la calidad de los lotes de helado antes de su almacenamiento.</p>
      </div>

      {/* 3 Tarjetas de Contadores Superiores */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-orange-200 p-6">
          <div className="flex items-center gap-2 text-orange-500 font-semibold text-sm mb-2">
            <span>⚠️</span> Pendientes
          </div>
          <p className="text-3xl font-bold text-gray-900">{lotesPendientes.length}</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-green-200 p-6">
          <div className="flex items-center gap-2 text-green-600 font-semibold text-sm mb-2">
            <span>✓</span> Verificados
          </div>
          <p className="text-3xl font-bold text-gray-900">{cantidadVerificados}</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-red-200 p-6">
          <div className="flex items-center gap-2 text-red-500 font-semibold text-sm mb-2">
            <span>✕</span> Rechazados
          </div>
          <p className="text-3xl font-bold text-gray-900">{cantidadRechazados}</p>
        </div>
      </div>

      {/* Layout Principal: Izquierda (Lista) - Derecha (Panel de Control) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* COLUMNA IZQUIERDA (2/3): Lotes a Verificar */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Lotes a Verificar</h2>

          {cargando ? (
            <div className="flex justify-center items-center py-12 gap-3 text-gray-500">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-pink-600"></div>
              Cargando lotes pendientes...
            </div>
          ) : lotesPendientes.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <span className="text-3xl block mb-2">✨</span>
              No hay lotes pendientes de verificación en este momento.
            </div>
          ) : (
            <div className="space-y-4">
              {lotesPendientes.map((lote) => {
                const prod = getProducto(lote.productoId);
                const estaSeleccionado = loteSeleccionado?.id === lote.id;

                return (
                  <div
                    key={lote.id}
                    className={`p-5 rounded-xl border transition flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                      estaSeleccionado
                        ? 'border-blue-500 bg-blue-50/30 ring-1 ring-blue-500'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2.5 mb-1">
                        <h3 className="font-bold text-gray-900 text-base">
                          {prod ? `Helado ${prod.sabor}` : getNombreProducto(lote.productoId)}
                        </h3>
                        <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-orange-100 text-orange-700">
                          {lote.estado}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        Categoría: {prod?.tipoPresentacion || 'General'} | Cantidad: <strong>{lote.cantidad} un.</strong>
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        Lote: {lote.codigoLote} · Vence: {new Date(lote.fechaVencimiento).toLocaleDateString('es-AR')}
                      </p>
                    </div>

                    <button
                      onClick={() => seleccionarLote(lote)}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-5 rounded-lg transition text-sm shrink-0"
                    >
                      Verificar
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* COLUMNA DERECHA (1/3): Panel de Control */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span>🔍</span> Panel de Control
          </h2>

          {!loteSeleccionado ? (
            <div className="border-2 border-dashed border-gray-200 rounded-xl p-10 text-center flex flex-col items-center justify-center min-h-[260px]">
              <span className="text-4xl mb-3">📦</span>
              <p className="text-sm text-gray-400 max-w-[200px]">
                Selecciona un lote de la lista para iniciar su inspección de calidad.
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              {/* Detalle del lote en inspección */}
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                    En Inspección
                  </span>
                  <button
                    onClick={() => setLoteSeleccionado(null)}
                    className="text-xs text-gray-400 hover:text-gray-600"
                  >
                    Cancelar ✕
                  </button>
                </div>
                <p className="font-bold text-gray-900 text-base">{loteSeleccionado.codigoLote}</p>
                <p className="text-sm text-gray-700">{getNombreProducto(loteSeleccionado.productoId)}</p>
                <p className="text-xs text-gray-500">
                  Cantidad: {loteSeleccionado.cantidad} uds. · Elab:{' '}
                  {new Date(loteSeleccionado.fechaElaboracion).toLocaleDateString('es-AR')}
                </p>
              </div>

              {/* Observaciones de calidad */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Observaciones de Calidad (Opcional)
                </label>
                <textarea
                  rows="3"
                  value={observaciones}
                  onChange={(e) => setObservaciones(e.target.value)}
                  placeholder="Ej: Temperatura óptima (-18°C), textura y sellado correctos..."
                  className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              {/* Botones de Decisión */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  onClick={() => cambiarEstadoLote('Rechazado')}
                  disabled={procesando}
                  className="bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 font-bold py-2.5 px-4 rounded-lg transition text-sm disabled:opacity-50"
                >
                  {procesando ? '...' : '✕ Rechazar'}
                </button>
                <button
                  onClick={() => cambiarEstadoLote('Aprobado')}
                  disabled={procesando}
                  className="bg-green-600 hover:bg-green-700 text-white font-bold py-2.5 px-4 rounded-lg transition text-sm shadow-sm disabled:opacity-50"
                >
                  {procesando ? '...' : '✓ Aprobar'}
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default VerificacionPage;