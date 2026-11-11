import { useState, useEffect } from 'react';
import frizkyApi from '../../api/frizkyApi';

function EmpaquetadoPage() {
  const [lotesAprobados, setLotesAprobados] = useState([]);
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
      // Solo mostramos los lotes que pasaron el Control de Calidad
      setLotesAprobados(resLotes.data.filter(lote => lote.estado === 'Aprobado'));
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

  const registrarEmpaque = async (lote) => {
    setProcesandoId(lote.id);
    try {
      // 1. Movemos el lote al siguiente estado en la cadena (PUT)
      const loteActualizado = { ...lote, estado: 'Empaquetado' };
      await frizkyApi.put(`/Lotes/${lote.id}`, loteActualizado);

      // 2. Generamos la trazabilidad inmutable de la acción (POST)
      await frizkyApi.post('/RegistroActividad', {
        usuarioId: 1, // Simulamos al operario ID 1 temporalmente
        loteId: lote.id,
        accion: 'Línea de Empaque',
        observaciones: `Se envasaron y etiquetaron correctamente las ${lote.cantidad} unidades.`
      });

      // 3. Recargamos la vista
      await cargarDatos();
    } catch (error) {
      console.error("Error al empaquetar:", error);
      alert(`Hubo un error al registrar el empaque del lote ${lote.codigoLote}`);
    } finally {
      setProcesandoId(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Línea de Empaquetado</h1>
        <p className="text-gray-500 text-sm mt-1">Registrá el envasado y etiquetado de los lotes aprobados.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-purple-50 border-b border-purple-100">
                <th className="px-6 py-4 text-xs font-semibold text-purple-700 uppercase tracking-wider">Código Lote</th>
                <th className="px-6 py-4 text-xs font-semibold text-purple-700 uppercase tracking-wider">Producto</th>
                <th className="px-6 py-4 text-xs font-semibold text-purple-700 uppercase tracking-wider">Cantidad a Envasar</th>
                <th className="px-6 py-4 text-xs font-semibold text-purple-700 uppercase tracking-wider text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {cargando ? (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center text-gray-500 font-medium">
                    <div className="flex justify-center items-center gap-3">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-purple-600"></div>
                      Buscando lotes aprobados...
                    </div>
                  </td>
                </tr>
              ) : lotesAprobados.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center text-gray-500">
                    <span className="text-3xl block mb-2">📦</span>
                    No hay lotes esperando ser empaquetados.
                  </td>
                </tr>
              ) : (
                lotesAprobados.map((lote) => (
                  <tr key={lote.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 font-bold text-gray-900">{lote.codigoLote}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{getNombreProducto(lote.productoId)}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-700">{lote.cantidad} uds.</td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => registrarEmpaque(lote)}
                        disabled={procesandoId === lote.id}
                        className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-5 rounded-lg transition text-sm disabled:opacity-50 disabled:cursor-not-allowed shadow-sm flex items-center gap-2 ml-auto"
                      >
                        {procesandoId === lote.id ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            Procesando...
                          </>
                        ) : (
                          'Confirmar Empaque →'
                        )}
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

export default EmpaquetadoPage;