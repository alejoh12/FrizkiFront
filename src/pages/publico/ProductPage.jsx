import { useState } from 'react';
import ProductCard from '../../components/ProductCard';

const PRODUCTOS_MOCK = [
  {
    id: 1,
    nombre: 'Frutilla',
    tipoPresentacion: 'Palitos de agua',
    precio: 1.50,
    disponible: true,
    imagenUrl: 'https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=500&auto=format&fit=crop&q=60'
  },
  {
    id: 2,
    nombre: 'Limón',
    tipoPresentacion: 'Palitos de agua',
    precio: 1.50,
    disponible: true,
    imagenUrl: 'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=500&auto=format&fit=crop&q=60'
  },
  {
    id: 3,
    nombre: 'Naranja',
    tipoPresentacion: 'Palitos de agua',
    precio: 1.50,
    disponible: false,
    imagenUrl: 'https://images.unsplash.com/photo-1534706936160-d5ee67737249?w=500&auto=format&fit=crop&q=60'
  },
  {
    id: 4,
    nombre: 'Dulce de Leche Granizado',
    tipoPresentacion: 'Palitos de crema',
    precio: 2.00,
    disponible: true,
    imagenUrl: 'https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=500&auto=format&fit=crop&q=60'
  },
  {
    id: 5,
    nombre: 'Chocolate Marroquí 10L',
    tipoPresentacion: 'Baldes',
    precio: 15.00,
    disponible: true,
    imagenUrl: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=500&auto=format&fit=crop&q=60'
  },
  {
    id: 6,
    nombre: 'Torta Helada Oreo',
    tipoPresentacion: 'Torta helada',
    precio: 25.00,
    disponible: true,
    imagenUrl: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&auto=format&fit=crop&q=60'
  }
];

const CATEGORIAS = ['Todas', 'Palitos de agua', 'Palitos de crema', 'Baldes', 'Torta helada'];

function ProductPage() {
  const [categoriaActiva, setCategoriaActiva] = useState('Todas');

  const productosFiltrados = categoriaActiva === 'Todas'
    ? PRODUCTOS_MOCK
    : PRODUCTOS_MOCK.filter(p => p.tipoPresentacion === categoriaActiva);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Catálogo de Productos</h1>
        <p className="text-gray-500 text-sm mt-1">
          Visualización de presentaciones y productos disponibles en la fábrica.
        </p>
      </div>

      {/* Botones de Filtro por Categoría */}
      <div className="flex flex-wrap gap-2 mb-8 border-b border-gray-200 pb-4">
        {CATEGORIAS.map(cat => (
          <button
            key={cat}
            onClick={() => setCategoriaActiva(cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition ${
              categoriaActiva === cat
                ? 'bg-pink-600 text-white shadow-sm'
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Rejilla de Tarjetas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {productosFiltrados.map(prod => (
          <ProductCard key={prod.id} producto={prod} />
        ))}
      </div>
    </div>
  );
}

export default ProductPage;