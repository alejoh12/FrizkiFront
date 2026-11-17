import { useState, useEffect } from 'react';
import frizkyApi from '../../api/frizkyApi';

function EmpaquetadoPage() {
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

  // Lotes aprobados esperando empaque
  const lotesAprobados = todosLosLotes.filter(lote => lote.estado === 'Aprobado');

  // Contador de empaquetados (Empaquetado o ya Almacenado)
  const cantidadEmpaquetados = todosLosLotes.filter(
    lote => lote.estado === 'Empaquetado' || lote.estado === 'Almacenado'
  ).length;

  const seleccionarLote = (lote) => {
    setLoteSeleccionado(lote);
    setObservaciones('');
  };

  const registrarEmpaque = async () => {
    if (!loteSeleccionado) return;
    setProcesando(true);

    try {
      // 1. Movemos el lote al siguiente estado en la cadena (PUT)
      const loteActualizado = { ...loteSeleccionado, estado: 'Empaquetado' };
      await frizkyApi.put(`/Lotes/${loteSeleccionado.id}`, loteActualizado);

      // 2. Generamos la trazabilidad inmutable de la acción (POST)
      const textoObs = observaciones.trim()
        ? observaciones.trim()
        : `Se envasaron y etiquetaron correctamente las ${loteSeleccionado.cantidad} unidades.`;

      await frizkyApi.post('/RegistroActividad', {
        usuarioId: 1,
        loteId: loteSeleccionado.id,
        accion: 'Línea de Empaque',
        observaciones: textoObs
      });

      // 3. Limpiamos el panel y recargamos la vista
      setLoteSeleccionado(null);
      setObservaciones('');
      await cargarDatos();
    } catch (error) {
      console.error("Error al empaquetar:", error);
      alert(`Hubo un error al registrar el empaque del lote ${loteSeleccionado.codigoLote}`);
    } finally {
      setProcesando(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Encabezado */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Empaquetado de Lotes</h1>
        <p className="text-gray-500 text-sm mt-1">Registra el envasado de los lotes aprobados por control de calidad.</p>
      </div>

      {/* 2 Tarjetas Superiores */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-orange-200 p-6">
          <div className="flex items-center gap-2 text-orange-500 font-semibold text-sm mb-2">
            <span>⚠️</span> Pendientes de Empaque
          </div>
          <p className="text-3xl font-bold text-gray-900">{lotesAprobados.length}</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-green-200 p-6">
          <div className="flex items-center gap-2 text-green-600 font-semibold text-sm mb-2">
            <span>✓</span> Empaquetados
          </div>
          <p className="text-3xl font-bold text-gray-900">{cantidadEmpaquetados}</p>
        </div>
      </div>

      {/* Layout Principal: Izquierda (Cola) - Derecha (Panel de Envasado) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* COLUMNA IZQUIERDA (2/3): Cola de Empaquetado */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Cola de Empaquetado</h2>

          {cargando ? (
            <div className="flex justify-center items-center py-12 gap-3 text-gray-500">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-purple-600"></div>
              Buscando lotes aprobados...
            </div>
          ) : lotesAprobados.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <span className="text-3xl block mb-2">📦</span>
              No hay lotes esperando ser empaquetados.
            </div>
          ) : (
            <div className="space-y-4">
              {lotesAprobados.map((lote) => {
                const prod = getProducto(lote.productoId);
                const estaSeleccionado = loteSeleccionado?.id === lote.id;

                return (
                  <div
                    key={lote.id}
                    className={`p-5 rounded-xl border transition flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                      estaSeleccionado
                        ? 'border-blue-500 bg-blue-50/40 ring-1 ring-blue-500'
                        : 'border-red-100 bg-red-50/30 hover:border-red-200'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2.5 mb-1">
                        <h3 className="font-bold text-gray-900 text-base">{lote.codigoLote}</h3>
                        <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-red-100 text-red-700">
                          Urgente
                        </span>
                      </div>
                      <p className="text-sm font-medium text-gray-800">
                        {prod ? `Helado ${prod.sabor}` : getNombreProducto(lote.productoId)}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Presentación: {prod?.tipoPresentacion || 'General'} | Unidades: <strong>{lote.cantidad}</strong>
                      </p>
                    </div>

                    <button
                      onClick={() => seleccionarLote(lote)}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition text-sm shrink-0"
                    >
                      Iniciar
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* COLUMNA DERECHA (1/3): Panel de Envasado */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Panel de Envasado</h2>

          {!loteSeleccionado ? (
            <div className="border-2 border-dashed border-gray-200 rounded-xl p-10 text-center flex flex-col items-center justify-center min-h-[260px]">
              <span className="text-4xl mb-3">📦</span>
              <p className="text-sm text-gray-400">
                Selecciona un lote para iniciar el proceso.
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              {/* Detalle del lote en envasado */}
              <div className="bg-purple-50/50 p-4 rounded-xl border border-purple-100 space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold uppercase tracking-wider text-purple-600">
                    En Línea de Empaque
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
                  Total a envasar: <strong>{loteSeleccionado.cantidad} unidades</strong>
                </p>
              </div>

              {/* Observaciones de envasado */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notas de Envasado / Etiquetado (Opcional)
                </label>
                <textarea
                  rows="3"
                  value={observaciones}
                  onChange={(e) => setObservaciones(e.target.value)}
                  placeholder="Ej: Etiquetado de lote y fecha de vencimiento verificado..."
                  className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
                />
              </div>

              {/* Botón de Confirmación */}
              <button
                onClick={registrarEmpaque}
                disabled={procesando}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-lg transition text-sm shadow-sm disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {procesando ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Procesando...
                  </>
                ) : (
                  'Confirmar Empaque →'
                )}
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default EmpaquetadoPage;