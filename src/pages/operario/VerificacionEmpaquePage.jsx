import { useState, useEffect } from 'react';
import frizkyApi from '../../api/frizkyApi';

function VerificacionEmpaquePage() {
  const [lotesEmpaquetados, setLotesEmpaquetados] = useState([]);
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [procesandoId, setProcesandoId] = useState(null);
  const [mensajeExito, setMensajeExito] = useState('');

  const cargarDatos = async () => {
    setCargando(true);
    try {
      const [resLotes, resProductos] = await Promise.all([
        frizkyApi.get('/Lotes'),
        frizkyApi.get('/Productos')
      ]);

      setProductos(resProductos.data);
      setLotesEmpaquetados(resLotes.data.filter(lote => lote.estado === 'Empaquetado'));
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

  const registrarAlmacenamiento = async (lote) => {
    setProcesandoId(lote.id);
    setMensajeExito('');

    try {
      // 1. Último PUT: El lote pasa a formar parte del inventario real
      const loteActualizado = { ...lote, estado: 'Almacenado' };
      await frizkyApi.put(`/Lotes/${lote.id}`, loteActualizado);

      // 2. Trazabilidad final del operario
      await frizkyApi.post('/RegistroActividad', {
        usuarioId: 1,
        loteId: lote.id,
        accion: 'Ingreso a Cámara de Frío',
        observaciones: `Temperatura verificada a -18°C. ${lote.cantidad} unidades almacenadas con éxito.`
      });

      setMensajeExito(`¡Lote ${lote.codigoLote} aprobado y almacenado en cámara de frío (-18°C)!`);
      await cargarDatos();
    } catch (error) {
      console.error("Error al almacenar:", error);
      alert(`Hubo un error al intentar ingresar el lote ${lote.codigoLote} a la cámara.`);
    } finally {
      setProcesandoId(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Encabezado */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Verificación de Empaquetado</h1>
        <p className="text-gray-500 text-sm mt-1">
          Control final de sellado y temperatura antes del almacenamiento en cámara.
        </p>
      </div>

      {/* Mensaje de confirmación */}
      {mensajeExito && (
        <div className="mb-6 p-4 rounded-xl bg-green-50 border border-green-200 text-green-700 text-sm font-medium">
          {mensajeExito}
        </div>
      )}

      {/* Contenedor Principal */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8">
        <h2 className="text-lg font-bold text-gray-900 mb-6">Lotes Listos para Almacenar</h2>

        {cargando ? (
          <div className="flex justify-center items-center py-12 gap-3 text-gray-500 font-medium">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-green-600"></div>
            Buscando lotes listos para almacenar...
          </div>
        ) : lotesEmpaquetados.length === 0 ? (
          <div className="text-center py-12 text-gray-500 border-2 border-dashed border-gray-100 rounded-xl">
            <span className="text-4xl block mb-3">❄️</span>
            <p className="font-medium text-gray-700">No hay lotes esperando ingreso a cámara</p>
            <p className="text-xs text-gray-400 mt-1">
              Los lotes aparecerán acá una vez que completen la etapa de Empaquetado.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {lotesEmpaquetados.map((lote) => {
              const prod = getProducto(lote.productoId);

              return (
                <div
                  key={lote.id}
                  className="p-5 rounded-xl border border-gray-200 hover:border-gray-300 transition bg-white flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="flex-grow">
                    <h3 className="font-bold text-gray-900 text-base mb-3">
                      {lote.codigoLote} - {prod ? `${prod.tipoPresentacion} ${prod.sabor}` : getNombreProducto(lote.productoId)}
                    </h3>

                    {/* Indicadores visuales estilo mockup */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl">
                      <div className="bg-blue-50/70 rounded-lg px-4 py-2.5">
                        <p className="text-xs font-medium text-blue-600 mb-0.5">Temp. Requerida</p>
                        <p className="text-sm font-bold text-blue-900 flex items-center gap-1.5">
                          <span>🌡️</span> -18°C
                        </p>
                      </div>

                      <div className="bg-purple-50/70 rounded-lg px-4 py-2.5">
                        <p className="text-xs font-medium text-purple-600 mb-0.5">Cantidad del Lote</p>
                        <p className="text-sm font-bold text-purple-900 flex items-center gap-1.5">
                          <span>📦</span> {lote.cantidad} unidades
                        </p>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => registrarAlmacenamiento(lote)}
                    disabled={procesandoId === lote.id}
                    className="bg-green-600 hover:bg-green-700 text-white font-bold py-2.5 px-6 rounded-lg transition text-sm shadow-sm disabled:opacity-50 shrink-0 flex items-center justify-center gap-2"
                  >
                    {procesandoId === lote.id ? 'Guardando...' : '✓ Aprobar y Almacenar'}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default VerificacionEmpaquePage;