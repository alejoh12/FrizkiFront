import { useState } from 'react';

const PRODUCTOS_MOCK = [
  { id: 1, nombre: 'Frutilla', categoria: 'Palitos de agua', precio: 1.50, disponible: true },
  { id: 2, nombre: 'Limón', categoria: 'Palitos de agua', precio: 1.50, disponible: true },
  { id: 3, nombre: 'Naranja', categoria: 'Palitos de agua', precio: 1.50, disponible: false },
  { id: 4, nombre: 'Dulce de leche', categoria: 'Palitos de crema', precio: 2.00, disponible: true },
  { id: 5, nombre: 'Chocolate', categoria: 'Palitos de crema', precio: 2.00, disponible: true }
];

const CATEGORIAS = ['Todas', 'Palitos de agua', 'Palitos de crema', 'Torta helada', 'Baldes', 'Alfajores helados Frisky', 'Conos Frisky Gold'];

function ProductosAdminPage() {
  const [productos, setProductos] = useState(PRODUCTOS_MOCK);
  const [categoriaActiva, setCategoriaActiva] = useState('Todas');

  const productosFiltrados = categoriaActiva === 'Todas' 
    ? productos 
    : productos.filter(p => p.categoria === categoriaActiva);

  const toggleDisponibilidad = (id) => {
    setProductos(productos.map(p => p.id === id ? { ...p, disponible: !p.disponible } : p));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Productos</h1>
          <p className="text-gray-500 text-sm mt-1">Administra el catálogo de productos de la fábrica</p>
        </div>
        <button className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2.5 px-5 rounded-lg transition shadow-sm flex items-center gap-2 w-fit">
          <span>+</span> Nuevo Producto
        </button>
      </div>

      {/* Panel de Filtros */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm mb-6">
        <p className="text-sm font-semibold text-gray-700 mb-3">Filtrar por Categoría</p>
        <div className="flex flex-wrap gap-2">
          {CATEGORIAS.map(cat => (
            <button
              key={cat}
              onClick={() => setCategoriaActiva(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
                categoriaActiva === cat
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Lista de Productos */}
      <div className="space-y-3">
        {productosFiltrados.map(prod => (
          <div key={prod.id} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:shadow-md transition">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h3 className="font-bold text-lg text-gray-900">{prod.nombre}</h3>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 ${prod.disponible ? 'text-green-700 bg-green-50' : 'text-red-700 bg-red-50'}`}>
                  {prod.disponible ? '✓ Disponible' : '✕ No disponible'}
                </span>
              </div>
              <p className="text-sm text-gray-500">{prod.categoria}</p>
              <p className="text-xl font-bold text-purple-600 mt-2">${prod.precio.toFixed(2)}</p>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button 
                onClick={() => toggleDisponibilidad(prod.id)}
                className={`flex-grow sm:flex-grow-0 px-4 py-2 rounded-lg text-sm font-semibold border transition ${
                  prod.disponible 
                    ? 'border-green-200 text-green-700 hover:bg-green-50' 
                    : 'border-red-200 text-red-700 hover:bg-red-50'
                }`}
              >
                Marcar {prod.disponible ? 'No Disponible' : 'Disponible'}
              </button>
              <button className="p-2 border border-blue-200 text-blue-600 rounded-lg hover:bg-blue-50 transition" title="Editar">
                ✏️
              </button>
              <button className="p-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition" title="Eliminar">
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductosAdminPage;