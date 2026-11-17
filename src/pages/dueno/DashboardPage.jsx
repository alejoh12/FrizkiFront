import { useState, useEffect } from 'react';
import frizkyApi from '../../api/frizkyApi';
import { Link } from 'react-router-dom';

function DashboardPage() {
  const [metricas, setMetricas] = useState({ aprobados: 0, empaquetados: 0, rechazados: 0 });
  const [topProduccion, setTopProduccion] = useState([]);
  const [stockCritico, setStockCritico] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const [resProductos, resLotes] = await Promise.all([
          frizkyApi.get('/Productos'),
          frizkyApi.get('/Lotes')
        ]);
        
        const productos = resProductos.data;
        const lotes = resLotes.data;

        // 1. Métricas KPI Superiores
        const aprobados = lotes.filter(l => l.estado !== 'Pendiente' && l.estado !== 'Rechazado').length;
        const rechazados = lotes.filter(l => l.estado === 'Rechazado').length;
        const empaquetados = lotes
          .filter(l => l.estado === 'Empaquetado' || l.estado === 'Almacenado')
          .reduce((acc, lote) => acc + lote.cantidad, 0);

        setMetricas({ aprobados, empaquetados, rechazados });

        // 2. Gráfico "Top Producción del Día" (con detalle de lo que aún no ingresó a cámara)
        const produccionPorProducto = {};
        lotes.forEach(lote => {
          if (lote.estado !== 'Rechazado' && lote.estado !== 'Pendiente') {
            if (!produccionPorProducto[lote.productoId]) {
              produccionPorProducto[lote.productoId] = { total: 0, sinAlmacenar: 0, estadosPendientes: new Set() };
            }
            produccionPorProducto[lote.productoId].total += lote.cantidad;

            if (lote.estado !== 'Almacenado') {
              produccionPorProducto[lote.productoId].sinAlmacenar += lote.cantidad;
              produccionPorProducto[lote.productoId].estadosPendientes.add(lote.estado);
            }
          }
        });

        const top = Object.keys(produccionPorProducto).map(id => {
          const prod = productos.find(p => p.id === parseInt(id));
          const info = produccionPorProducto[id];
          return {
            nombre: prod ? `${prod.tipoPresentacion} - ${prod.sabor}` : 'Desconocido',
            cantidad: info.total,
            sinAlmacenar: info.sinAlmacenar,
            estados: Array.from(info.estadosPendientes).join(' / ')
          };
        }).sort((a, b) => b.cantidad - a.cantidad).slice(0, 4);
        
        setTopProduccion(top);

        // 3. Alertas de Stock Crítico
        const alertas = productos.map(prod => {
          const stockAlmacenado = lotes
            .filter(l => l.productoId === prod.id && l.estado === 'Almacenado')
            .reduce((acc, l) => acc + l.cantidad, 0);

          const stockEnProceso = lotes
            .filter(l => l.productoId === prod.id && (l.estado === 'Aprobado' || l.estado === 'Empaquetado'))
            .reduce((acc, l) => acc + l.cantidad, 0);

          return { ...prod, stockActual: stockAlmacenado, enProceso: stockEnProceso };
        }).filter(p => p.stockActual <= 10).slice(0, 3);
        
        setStockCritico(alertas);

      } catch (error) {
        console.error("Error al cargar dashboard:", error);
      } finally {
        setCargando(false);
      }
    };
    
    cargarDatos();
  }, []);

  const maxProduccion = topProduccion.length > 0 ? topProduccion[0].cantidad : 1;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard de Producción</h1>
        <p className="text-gray-500 text-sm mt-1">Resumen general y métricas en tiempo real de la fábrica.</p>
      </div>

      {cargando ? (
        <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div></div>
      ) : (
        <>
          {/* Tarjetas Resumen (KPIs) */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 relative">
              <h3 className="text-gray-500 text-sm font-medium mb-1">Lotes Aprobados</h3>
              <p className="text-4xl font-bold text-gray-900">{metricas.aprobados}</p>
              <span className="absolute top-6 right-6 text-xl">📦</span>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 relative">
              <h3 className="text-gray-500 text-sm font-medium mb-1">Volumen Empaquetado</h3>
              <p className="text-4xl font-bold text-gray-900">{metricas.empaquetados} <span className="text-lg text-gray-400 font-normal">uds</span></p>
              <span className="absolute top-6 right-6 text-xl">⚖️</span>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 relative">
              <h3 className="text-gray-500 text-sm font-medium mb-1">Lotes Rechazados</h3>
              <p className="text-4xl font-bold text-gray-900">{metricas.rechazados}</p>
              <span className="absolute top-6 right-6 text-red-300 text-xl">✕</span>
            </div>
            <div className="bg-red-50 p-6 rounded-xl shadow-sm border border-red-100 relative">
              <h3 className="text-red-700 text-sm font-bold mb-1">Alertas de Stock</h3>
              <p className="text-4xl font-bold text-red-700">{stockCritico.length}</p>
              <p className="text-xs text-red-600 mt-2 font-medium">Requieren producción</p>
              <span className="absolute top-6 right-6 text-red-500 text-xl">⚠️</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Top Producción */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2"><span>📈</span> Top Producción del Día</h2>
              <div className="space-y-6">
                {topProduccion.length === 0 ? <p className="text-gray-500 text-sm">No hay producción registrada.</p> : topProduccion.map((item, index) => (
                  <div key={index}>
                    <div className="flex flex-wrap justify-between items-center gap-2 text-sm mb-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-gray-700">{index + 1}. {item.nombre}</span>
                        {item.sinAlmacenar > 0 && (
                          <span className="bg-amber-100 text-amber-800 text-xs font-semibold px-2 py-0.5 rounded-full border border-amber-200">
                            ⏳ {item.sinAlmacenar} uds en {item.estados} (sin ingresar a cámara)
                          </span>
                        )}
                      </div>
                      <span className="font-bold text-gray-500">{item.cantidad} uds</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2.5">
                      <div 
                        className="bg-purple-500 h-2.5 rounded-full transition-all duration-500" 
                        style={{ width: `${(item.cantidad / maxProduccion) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Panel lateral: Alertas Stock */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between">
              <div>
                <h2 className="text-lg font-bold text-red-600 mb-6 flex items-center gap-2"><span>🚨</span> Stock Crítico en Cámara</h2>
                <div className="space-y-4">
                  {stockCritico.length === 0 ? <p className="text-gray-500 text-sm">No hay productos en estado crítico.</p> : stockCritico.map(item => (
                    <div key={item.id} className="bg-red-50 border border-red-100 rounded-lg p-4 flex justify-between items-center">
                      <div>
                        <p className="font-bold text-gray-900 text-sm">{item.tipoPresentacion} - {item.sabor}</p>
                        <p className="text-xs text-red-600 mt-1">
                          En cámara: <span className="font-bold">{item.stockActual} uds</span>
                          {item.enProceso > 0 && (
                            <span className="ml-2 text-amber-700 font-semibold">
                              ({item.enProceso} uds en planta sin almacenar)
                            </span>
                          )}
                        </p>
                      </div>
                      <span className="bg-red-200 text-red-800 text-xs font-bold px-2.5 py-1 rounded">Crítico</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-gray-100 text-center">
                <Link to="/inventario" className="text-purple-600 hover:text-purple-800 font-bold text-sm transition">
                  Ver Inventario Completo →
                </Link>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default DashboardPage;