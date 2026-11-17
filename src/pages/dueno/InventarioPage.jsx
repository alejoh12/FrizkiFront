import { useState, useEffect } from 'react';
import frizkyApi from '../../api/frizkyApi';

function InventarioPage() {
  const [inventario, setInventario] = useState([]);
  const [metricas, setMetricas] = useState({ critico: 0, bajo: 0, optimo: 0 });
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarInventario = async () => {
      try {
        // Traemos el catálogo y los lotes producidos
        const [resProductos, resLotes] = await Promise.all([
          frizkyApi.get('/Productos'),
          frizkyApi.get('/Lotes')
        ]);

        // Filtramos estrictamente los lotes que llegaron a la cámara de frío
        const lotesAlmacenados = resLotes.data.filter(l => l.estado === 'Almacenado');

        let critico = 0, bajo = 0, optimo = 0;

        const inventarioCalculado = resProductos.data.map(prod => {
          // Sumamos la cantidad de todos los lotes almacenados de este helado
          const stockActual = lotesAlmacenados
            .filter(l => l.productoId === prod.id)
            .reduce((acc, lote) => acc + lote.cantidad, 0);

          const stockMinimo = 20; // Umbral de seguridad del mockup

          let estadoStock = 'Óptimo';
          if (stockActual <= 10) {
            estadoStock = 'Crítico';
            critico++;
          } else if (stockActual < stockMinimo) {
            estadoStock = 'Bajo';
            bajo++;
          } else {
            optimo++;
          }

          return { ...prod, stockActual, stockMinimo, estadoStock };
        });

        // Ordenamos para que los que tienen menos stock salgan primero arriba
        inventarioCalculado.sort((a, b) => a.stockActual - b.stockActual);

        setInventario(inventarioCalculado);
        setMetricas({ critico, bajo, optimo });
      } catch (error) {
        console.error("Error al cargar inventario:", error);
      } finally {
        setCargando(false);
      }
    };

    cargarInventario();
  }, []);

  const getBadgeClass = (estado) => {
    if (estado === 'Crítico') return 'bg-red-100 text-red-700';
    if (estado === 'Bajo') return 'bg-yellow-100 text-yellow-700';
    return 'bg-green-100 text-green-700';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Control de Inventario</h1>
        <p className="text-gray-500 text-sm mt-1">Estado actual del stock de productos terminados en cámara de frío.</p>
      </div>

      {/* Tarjetas Superiores */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border-l-4 border-red-500 p-6">
          <div className="flex items-center text-red-600 font-bold mb-2">
            <span className="mr-2">⚠️</span> Stock Crítico
          </div>
          <p className="text-sm text-gray-500 mb-2">Requieren reposición urgente</p>
          <div className="text-3xl font-bold text-gray-900">{metricas.critico} <span className="text-lg font-normal text-gray-500">productos</span></div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border-l-4 border-yellow-400 p-6">
          <div className="flex items-center text-yellow-600 font-bold mb-2">
            <span className="mr-2">📦</span> Stock Bajo
          </div>
          <p className="text-sm text-gray-500 mb-2">Próximos a reposición</p>
          <div className="text-3xl font-bold text-gray-900">{metricas.bajo} <span className="text-lg font-normal text-gray-500">productos</span></div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border-l-4 border-green-500 p-6">
          <div className="flex items-center text-green-600 font-bold mb-2">
            <span className="mr-2">✓</span> Stock Óptimo
          </div>
          <p className="text-sm text-gray-500 mb-2">Niveles adecuados</p>
          <div className="text-3xl font-bold text-gray-900">{metricas.optimo} <span className="text-lg font-normal text-gray-500">productos</span></div>
        </div>
      </div>

      {/* Tabla de Stock */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden p-6">
        <h2 className="text-lg font-bold text-gray-800 mb-6">Inventario Completo</h2>
        {cargando ? (
          <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600"></div></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <tbody>
                {inventario.map(item => (
                  <tr key={item.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition">
                    <td className="py-4 px-4">
                      <p className="font-bold text-gray-900 text-lg">{item.sabor}</p>
                      <p className="text-sm text-gray-500">{item.tipoPresentacion}</p>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-1">Stock Actual</p>
                      <p className={`text-xl font-bold ${item.stockActual <= 10 ? 'text-red-600' : 'text-gray-900'}`}>{item.stockActual}</p>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-1">Stock Mínimo</p>
                      <p className="text-lg font-semibold text-gray-600">{item.stockMinimo}</p>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <span className={`px-4 py-1.5 rounded-full text-sm font-bold ${getBadgeClass(item.estadoStock)}`}>
                        {item.estadoStock}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default InventarioPage;