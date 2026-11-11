const INVENTARIO_MOCK = [
  { id: 1, nombre: 'Frutilla', cat: 'Palitos de agua', actual: 45, minimo: 20, estado: 'Óptimo' },
  { id: 2, nombre: 'Limón', cat: 'Palitos de agua', actual: 38, minimo: 20, estado: 'Óptimo' },
  { id: 3, nombre: 'Naranja', cat: 'Palitos de agua', actual: 5, minimo: 20, estado: 'Crítico' },
  { id: 4, nombre: 'Dulce de Leche', cat: 'Palitos de crema', actual: 22, minimo: 25, estado: 'Bajo' },
  { id: 5, nombre: 'Chocolate brownie', cat: 'Torta helada', actual: 2, minimo: 5, estado: 'Crítico' }
];

function InventarioPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Control de Inventario</h1>
        <p className="text-gray-500 text-sm mt-1">Monitoreo de stock de productos en cámara de frío.</p>
      </div>

      {/* Tarjetas de Resumen */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-4 rounded-xl border-l-4 border-red-500 shadow-sm">
          <p className="text-sm font-semibold text-red-600 flex items-center gap-2">⚠️ Stock Crítico</p>
          <p className="text-xs text-gray-500 mb-2">Requieren reposición urgente</p>
          <p className="text-4xl font-bold text-gray-900">2 <span className="text-lg font-normal text-gray-500">productos</span></p>
        </div>
        <div className="bg-white p-4 rounded-xl border-l-4 border-yellow-500 shadow-sm">
          <p className="text-sm font-semibold text-yellow-600 flex items-center gap-2">📦 Stock Bajo</p>
          <p className="text-xs text-gray-500 mb-2">Próximos a reposición</p>
          <p className="text-4xl font-bold text-gray-900">1 <span className="text-lg font-normal text-gray-500">producto</span></p>
        </div>
        <div className="bg-white p-4 rounded-xl border-l-4 border-green-500 shadow-sm">
          <p className="text-sm font-semibold text-green-600 flex items-center gap-2">✓ Stock Óptimo</p>
          <p className="text-xs text-gray-500 mb-2">Niveles adecuados</p>
          <p className="text-4xl font-bold text-gray-900">12 <span className="text-lg font-normal text-gray-500">productos</span></p>
        </div>
      </div>

      {/* Lista Completa */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800">Inventario Completo</h2>
          <p className="text-sm text-gray-500">Estado actual de todos los productos</p>
        </div>
        
        <div className="divide-y divide-gray-100">
          {INVENTARIO_MOCK.map(item => (
            <div key={item.id} className="p-4 sm:px-6 hover:bg-gray-50 transition flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h3 className="font-bold text-gray-900">{item.nombre}</h3>
                <p className="text-sm text-gray-500">{item.cat}</p>
              </div>
              
              <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end">
                <div className="text-center">
                  <p className="text-xs text-gray-400 font-medium">Stock Actual</p>
                  <p className={`font-bold text-lg ${item.actual <= item.minimo ? 'text-red-600' : 'text-gray-900'}`}>
                    {item.actual}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-400 font-medium">Stock Mínimo</p>
                  <p className="font-semibold text-gray-700">{item.minimo}</p>
                </div>
                
                <div className="w-24 text-right">
                  <span className={`inline-block px-3 py-1 text-xs font-bold rounded-full ${
                    item.estado === 'Crítico' ? 'bg-red-100 text-red-700' : 
                    item.estado === 'Bajo' ? 'bg-yellow-100 text-yellow-700' : 
                    'bg-green-100 text-green-700'
                  }`}>
                    {item.estado}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default InventarioPage;