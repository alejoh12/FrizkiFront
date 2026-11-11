import { useState, useEffect } from 'react';
import frizkyApi from '../../api/frizkyApi';

const CATEGORIAS = ['Todas', 'Balde 10L', 'Vasito 120cc', 'Palito de Agua', 'Palitos de crema', 'Torta helada'];

function ProductosPage() {
  const [productos, setProductos] = useState([]);
  const [categoriaActiva, setCategoriaActiva] = useState('Todas');
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const obtenerProductos = async () => {
      try {
        const respuesta = await frizkyApi.get('/Productos');
        
        const productosMapeados = respuesta.data.map(p => ({
          id: p.id,
          nombre: p.sabor, 
          categoria: p.tipoPresentacion, 
          precio: p.precio,
          descripcion: p.descripcion,
          imagenUrl: p.imagenUrl,
          disponible: true 
        }));

        setProductos(productosMapeados);
        setCargando(false);
      } catch (error) {
        console.error("Error al conectar con la API de Frizky:", error);
        setCargando(false);
      }
    };

    obtenerProductos();
  }, []);

  const productosFiltrados = categoriaActiva === 'Todas' 
    ? productos 
    : productos.filter(p => p.categoria === categoriaActiva);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Catálogo de Productos</h1>
        <p className="text-gray-500 text-sm mt-1">Visualización de presentaciones y productos disponibles en la fábrica.</p>
      </div>

      {/* Filtros de Categoría */}
      <div className="flex flex-wrap gap-2 mb-8">
        {CATEGORIAS.map(cat => (
          <button
            key={cat}
            onClick={() => setCategoriaActiva(cat)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
              categoriaActiva === cat
                ? 'bg-pink-600 text-white shadow-sm'
                : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {cargando ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
        </div>
      ) : productosFiltrados.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <span className="text-4xl block mb-2">🍦</span>
          <p>No hay productos disponibles en esta categoría.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {productosFiltrados.map(prod => (
            <div key={prod.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition group flex flex-col justify-between">
              
              {/* Imagen y Badge */}
              <div className="h-48 bg-gray-100 relative overflow-hidden">
                <img 
                  src={prod.imagenUrl || 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=500&auto=format&fit=crop&q=60'} 
                  alt={prod.nombre}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
                <div className="absolute top-3 right-3">
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full shadow-sm bg-green-100 text-green-700 flex items-center gap-1">
                    ✓ Disponible
                  </span>
                </div>
              </div>

              {/* Información del Producto (Ajustada) */}
              <div className="p-5 flex flex-col flex-grow justify-between">
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">{prod.categoria}</p>
                  <h3 className="font-bold text-gray-800 text-lg leading-tight mb-2">{prod.nombre}</h3>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <span className="text-xl font-bold text-pink-600">${Number(prod.precio).toFixed(2)}</span>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ProductosPage;