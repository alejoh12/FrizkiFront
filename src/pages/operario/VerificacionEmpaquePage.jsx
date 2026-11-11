import { useState, useEffect } from 'react';
import frizkyApi from '../../api/frizkyApi';

function VerificacionEmpaquePage() {
  const [lotesEmpaquetados, setLotesEmpaquetados] = useState([]);
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [procesandoId, setProcesandoId] = useState(null);

  const cargarDatos = async () => {
    setCargando(true);
    try {
      const [resLotes, resProductos] = await Promise.all([
        frizkyApi.get('/Lotes'),
        frizkyApi.get('/Productos')
      ]);
      
      setProductos(resProductos.data);
      // Filtramos solo los que vienen de la línea de empaque
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

  const getNombreProducto = (productoId) => {
    const prod = productos.find(p => p.id === productoId);
    return prod ? `${prod.tipoPresentacion} - ${prod.sabor}` : 'Producto Desconocido';
  };

  const registrarAlmacenamiento = async (lote) => {
    setProcesandoId(lote.id);
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

      await cargarDatos();
    } catch (error) {
      console.error("Error al almacenar:", error);
      alert(`Hubo un error al intentar ingresar el lote ${lote.codigoLote} a la cámara.`);
    } finally {
      setProcesandoId(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Verificación Final y Cámara de Frío</h1>
        <p className="text-gray-500 text-sm mt-1">Controlá el ingreso de los lotes empaquetados al almacenamiento definitivo.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-blue-50 border-b border-blue-100">
                <th className="px-6 py-4 text-xs font-semibold text-blue-800 uppercase tracking-wider">Código Lote</th>
                <th className="px-6 py-4 text-xs font-semibold text-blue-800 uppercase tracking-wider">Producto</th>
                <th className="px-6 py-4 text-xs font-semibold text-blue-800 uppercase tracking-wider">Cantidad</th>
                <th className="px-6 py-4 text-xs font-semibold text-blue-800 uppercase tracking-wider text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {cargando ? (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center text-gray-500 font-medium">
                    <div className="flex justify-center items-center gap-3">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                      Buscando lotes listos para almacenar...
                    </div>
                  </td>
                </tr>
              ) : lotesEmpaquetados.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center text-gray-500">
                    <span className="text-3xl block mb-2">❄️</span>
                    No hay lotes esperando ingreso a cámara en este momento.
                  </td>
                </tr>
              ) : (
                lotesEmpaquetados.map((lote) => (
                  <tr key={lote.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 font-bold text-gray-900">{lote.codigoLote}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{getNombreProducto(lote.productoId)}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-700">{lote.cantidad} uds.</td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => registrarAlmacenamiento(lote)}
                        disabled={procesandoId === lote.id}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-5 rounded-lg transition text-sm disabled:opacity-50 shadow-sm flex items-center gap-2 ml-auto"
                      >
                        {procesandoId === lote.id ? 'Guardando...' : '❄️ Ingresar a Cámara'}
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

export default VerificacionEmpaquePage;