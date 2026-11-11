import { useState, useEffect } from 'react';
import frizkyApi from '../../api/frizkyApi';

function VerificacionPage() {
  const [lotesPendientes, setLotesPendientes] = useState([]);
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [procesandoId, setProcesandoId] = useState(null);

  const cargarDatos = async () => {
    setCargando(true);
    try {
      // Pedimos los lotes y los productos en paralelo
      const [resLotes, resProductos] = await Promise.all([
        frizkyApi.get('/Lotes'),
        frizkyApi.get('/Productos')
      ]);
      
      setProductos(resProductos.data);
      // Filtramos estrictamente los que acaban de ingresar
      setLotesPendientes(resLotes.data.filter(lote => lote.estado === 'Pendiente'));
    } catch (error) {
      console.error("Error al cargar datos:", error);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  // Función auxiliar para cruzar el ID del producto con su nombre real
  const getNombreProducto = (productoId) => {
    const prod = productos.find(p => p.id === productoId);
    return prod ? `${prod.tipoPresentacion} - ${prod.sabor}` : 'Producto Desconocido';
  };

  const cambiarEstadoLote = async (lote, nuevoEstado) => {
    setProcesandoId(lote.id);
    try {
      // 1. Actualizamos el estado del lote (PUT)
      const loteActualizado = { ...lote, estado: nuevoEstado };
      await frizkyApi.put(`/Lotes/${lote.id}`, loteActualizado);

      // 2. Dejamos asentado el movimiento en el Registro de Actividad (POST)
      await frizkyApi.post('/RegistroActividad', {
        usuarioId: 1, // Simulamos al operario ID 1
        loteId: lote.id,
        accion: `Control de Calidad: Lote ${nuevoEstado.toUpperCase()}`,
        observaciones: `El operario verificó la muestra y determinó el estado: ${nuevoEstado}`
      });

      // 3. Recargamos la tabla para que el lote desaparezca de esta vista
      await cargarDatos();
    } catch (error) {
      console.error(`Error al marcar como ${nuevoEstado}:`, error);
      alert(`Hubo un error al intentar cambiar el estado del lote ${lote.codigoLote}`);
    } finally {
      setProcesandoId(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Control de Calidad</h1>
        <p className="text-gray-500 text-sm mt-1">Verificá los lotes ingresados antes de pasarlos a la línea de empaquetado.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Código Lote</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Producto</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Cantidad</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Elaboración</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider text-right">Acciones de Calidad</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {cargando ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-500 font-medium">
                    <div className="flex justify-center items-center gap-3">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-pink-600"></div>
                      Cargando lotes pendientes...
                    </div>
                  </td>
                </tr>
              ) : lotesPendientes.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                    <span className="text-3xl block mb-2">✨</span>
                    No hay lotes pendientes de verificación en este momento.
                  </td>
                </tr>
              ) : (
                lotesPendientes.map((lote) => (
                  <tr key={lote.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 font-bold text-gray-900">{lote.codigoLote}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{getNombreProducto(lote.productoId)}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-700">{lote.cantidad} uds.</td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(lote.fechaElaboracion).toLocaleDateString('es-AR')}
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button 
                        onClick={() => cambiarEstadoLote(lote, 'Aprobado')}
                        disabled={procesandoId === lote.id}
                        className="bg-green-50 hover:bg-green-100 text-green-700 border border-green-200 font-semibold py-1.5 px-4 rounded-lg transition text-sm disabled:opacity-50"
                      >
                        {procesandoId === lote.id ? '...' : '✓ Aprobar'}
                      </button>
                      <button 
                        onClick={() => cambiarEstadoLote(lote, 'Rechazado')}
                        disabled={procesandoId === lote.id}
                        className="bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 font-semibold py-1.5 px-4 rounded-lg transition text-sm disabled:opacity-50"
                      >
                        {procesandoId === lote.id ? '...' : '✕ Rechazar'}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default VerificacionPage;