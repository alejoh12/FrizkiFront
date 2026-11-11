function DashboardPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard de Producción</h1>
        <p className="text-gray-500 text-sm mt-1">
          Resumen de hoy - {new Date().toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
        </p>
      </div>

      {/* Tarjetas de Métricas Principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-sm font-medium text-gray-500 mb-1 flex items-center justify-between">
            Lotes Aprobados <span className="text-green-500 bg-green-50 p-1.5 rounded-lg">📦</span>
          </p>
          <p className="text-3xl font-bold text-gray-900">24</p>
          <p className="text-xs text-green-600 font-medium mt-2">↑ +12% vs ayer</p>
        </div>
        
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-sm font-medium text-gray-500 mb-1 flex items-center justify-between">
            Volumen Empaquetado <span className="text-blue-500 bg-blue-50 p-1.5 rounded-lg">⚖️</span>
          </p>
          <p className="text-3xl font-bold text-gray-900">1,250 kg</p>
          <p className="text-xs text-blue-600 font-medium mt-2">↑ +5% vs ayer</p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-sm font-medium text-gray-500 mb-1 flex items-center justify-between">
            Lotes Rechazados <span className="text-red-500 bg-red-50 p-1.5 rounded-lg">✕</span>
          </p>
          <p className="text-3xl font-bold text-gray-900">2</p>
          <p className="text-xs text-red-600 font-medium mt-2">Dentro del margen (1.5%)</p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-red-100 shadow-sm bg-red-50">
          <p className="text-sm font-medium text-red-800 mb-1 flex items-center justify-between">
            Alertas de Stock <span className="text-red-600">⚠️</span>
          </p>
          <p className="text-3xl font-bold text-red-900">7</p>
          <p className="text-xs text-red-700 font-medium mt-2">Requieren producción urgente</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Productos Fabricados */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <span>📈</span> Top Producción del Día
          </h2>
          <div className="space-y-4">
            {[
              { rank: 1, nombre: 'Baldes Chocolate 10L', cant: '150 uds', bar: 'w-full' },
              { rank: 2, nombre: 'Palitos de crema - Dulce de leche', cant: '120 uds', bar: 'w-4/5' },
              { rank: 3, nombre: 'Torta helada Oreo', cant: '85 uds', bar: 'w-3/5' },
              { rank: 4, nombre: 'Alfajores helados Frisky', cant: '60 uds', bar: 'w-2/5' }
            ].map(item => (
              <div key={item.rank}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-gray-700">{item.rank}. {item.nombre}</span>
                  <span className="text-gray-500 font-semibold">{item.cant}</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div className={`bg-purple-600 h-2 rounded-full ${item.bar}`}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Alertas Rápidas */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2 text-red-600">
            <span>🚨</span> Stock Crítico
          </h2>
          <div className="space-y-3">
            {[
              { nombre: 'Palitos de agua - Naranja', stock: 5 },
              { nombre: 'Torta helada Chocolate brownie', stock: 2 },
              { nombre: 'Palitos de crema - Frutilla', stock: 3 }
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-red-50 border border-red-100 rounded-lg">
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{item.nombre}</p>
                  <p className="text-xs text-red-600 mt-0.5">Stock actual: {item.stock} unidades</p>
                </div>
                <span className="bg-red-200 text-red-800 text-xs font-bold px-2 py-1 rounded">Crítico</span>
              </div>
            ))}
          </div>
          <button className="w-full mt-4 text-sm text-purple-600 font-semibold hover:text-purple-700 transition">
            Ver Inventario Completo →
          </button>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;