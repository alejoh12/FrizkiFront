import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import frizkyApi from '../../api/frizkyApi';

const CATEGORIAS = [
  'Todas',
  'Balde 10L',
  'Vasito 120cc',
  'Palito de Agua',
  'Palitos de crema',
  'Torta helada',
  'Alfajores helados Frisky',
  'Conos Frisky Gold'
];

function ProductosAdminPage() {
  const [productos, setProductos] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('Todas');
  const [cargando, setCargando] = useState(true);

  // Estados para manejar la vista del formulario
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [productoEditando, setProductoEditando] = useState(null);
  const [procesando, setProcesando] = useState(false);

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();

  // 1. GET: Cargar catálogo
  const cargarProductos = async () => {
    setCargando(true);
    try {
      const respuesta = await frizkyApi.get('/Productos');
      setProductos(respuesta.data);
    } catch (error) {
      console.error("Error al cargar productos:", error);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarProductos();
  }, []);

  // Preparar formulario para CREAR
  const abrirNuevo = () => {
    setProductoEditando(null);
    reset({ tipoPresentacion: '', sabor: '', descripcion: '', precio: '', imagenUrl: '' });
    setMostrarFormulario(true);
  };

  // Preparar formulario para EDITAR
  const abrirEdicion = (producto) => {
    setProductoEditando(producto);
    setValue('tipoPresentacion', producto.tipoPresentacion);
    setValue('sabor', producto.sabor);
    setValue('descripcion', producto.descripcion);
    setValue('precio', producto.precio);
    setValue('imagenUrl', producto.imagenUrl);
    setMostrarFormulario(true);
  };

  // 2 & 3. POST / PUT: Guardar producto
  const onSubmit = async (data) => {
    setProcesando(true);
    try {
      const productoData = {
        ...data,
        precio: parseFloat(data.precio)
      };

      if (productoEditando) {
        productoData.id = productoEditando.id;
        await frizkyApi.put(`/Productos/${productoEditando.id}`, productoData);
      } else {
        await frizkyApi.post('/Productos', productoData);
      }

      await cargarProductos();
      setMostrarFormulario(false);
    } catch (error) {
      console.error("Error al guardar producto:", error);
      alert("Hubo un error al guardar el producto. Verificá que no estés duplicando Presentación + Sabor.");
    } finally {
      setProcesando(false);
    }
  };

  // 4. DELETE: Borrar producto
  const eliminarProducto = async (id, nombre) => {
    if (window.confirm(`¿Estás seguro de eliminar el producto "${nombre}"? Esta acción no se puede deshacer.`)) {
      try {
        await frizkyApi.delete(`/Productos/${id}`);
        await cargarProductos();
      } catch (error) {
        console.error("Error al eliminar:", error);
        alert("No se pudo eliminar. Puede que haya lotes asociados a este producto.");
      }
    }
  };

  // Filtrado por categoría
  const productosFiltrados = categoriaSeleccionada === 'Todas'
    ? productos
    : productos.filter(
        prod => prod.tipoPresentacion.toLowerCase() === categoriaSeleccionada.toLowerCase()
      );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Productos</h1>
          <p className="text-gray-500 text-sm mt-1">Administra el catálogo de productos de la fábrica</p>
        </div>
        {!mostrarFormulario && (
          <button
            onClick={abrirNuevo}
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2.5 px-6 rounded-lg transition shadow-sm self-start sm:self-auto"
          >
            + Nuevo Producto
          </button>
        )}
      </div>

      {/* Formulario (Creación y Edición) */}
      {mostrarFormulario ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8 mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-6 border-b pb-2">
            {productoEditando ? 'Editar Producto' : 'Crear Nuevo Producto'}
          </h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Presentación / Categoría *</label>
                <select
                  {...register("tipoPresentacion", { required: "Requerido" })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-purple-500 outline-none bg-white"
                >
                  <option value="">Seleccionar...</option>
                  {CATEGORIAS.filter(cat => cat !== 'Todas').map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                {errors.tipoPresentacion && <p className="text-red-500 text-xs mt-1">{errors.tipoPresentacion.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sabor / Nombre *</label>
                <input
                  type="text"
                  placeholder="Ej: Dulce de Leche Granizado"
                  {...register("sabor", { required: "Requerido" })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-purple-500 outline-none"
                />
                {errors.sabor && <p className="text-red-500 text-xs mt-1">{errors.sabor.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Precio Unitario ($) *</label>
                <input
                  type="number"
                  step="0.01"
                  {...register("precio", { required: "Requerido", min: 0 })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-purple-500 outline-none"
                />
                {errors.precio && <p className="text-red-500 text-xs mt-1">{errors.precio.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">URL Imagen (Opcional)</label>
                <input
                  type="text"
                  placeholder="https://ejemplo.com/foto.jpg"
                  {...register("imagenUrl")}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-purple-500 outline-none"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Descripción Breve</label>
                <textarea
                  rows="2"
                  {...register("descripcion")}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-purple-500 outline-none resize-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setMostrarFormulario(false)}
                className="px-5 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-lg transition"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={procesando}
                className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2.5 px-6 rounded-lg transition shadow-sm disabled:opacity-50"
              >
                {procesando ? 'Guardando...' : 'Guardar Producto'}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <>
          {/* Barra de Filtrado por Categoría (estilo mockup) */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 mb-6">
            <p className="text-xs font-bold text-gray-700 mb-3">Filtrar por Categoría</p>
            <div className="flex flex-wrap gap-2">
              {CATEGORIAS.map((cat) => {
                const activo = categoriaSeleccionada === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setCategoriaSeleccionada(cat)}
                    className={`px-4 py-1.5 rounded-full text-xs font-semibold transition border ${
                      activo
                        ? 'bg-purple-600 text-white border-purple-600 shadow-sm'
                        : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Listado en Tarjetas Horizontales (estilo mockup) */}
          {cargando ? (
            <div className="flex justify-center py-16">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-600"></div>
            </div>
          ) : productosFiltrados.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center text-gray-500">
              {productos.length === 0
                ? 'No hay productos registrados en el sistema.'
                : `No hay productos cargados en la categoría "${categoriaSeleccionada}".`}
            </div>
          ) : (
            <div className="space-y-4">
              {productosFiltrados.map((prod) => (
                <div
                  key={prod.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 hover:border-gray-300 transition p-5 flex items-center justify-between gap-4"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-bold text-gray-900">{prod.sabor}</h3>
                      <span className="text-xs text-gray-400 font-medium">#{prod.id}</span>
                    </div>
                    <p className="text-sm text-gray-500 mt-0.5">{prod.tipoPresentacion}</p>
                    {prod.descripcion && (
                      <p className="text-xs text-gray-400 mt-1 line-clamp-1">{prod.descripcion}</p>
                    )}
                    <p className="text-base font-bold text-purple-600 mt-2">
                      ${Number(prod.precio).toFixed(2)}
                    </p>
                  </div>

                  {/* Botones de Edición y Eliminación */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => abrirEdicion(prod)}
                      title="Editar producto"
                      className="p-2.5 rounded-lg border border-gray-200 text-orange-500 hover:bg-orange-50 hover:border-orange-200 transition"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => eliminarProducto(prod.id, `${prod.tipoPresentacion} - ${prod.sabor}`)}
                      title="Eliminar producto"
                      className="p-2.5 rounded-lg border border-gray-200 text-red-500 hover:bg-red-50 hover:border-red-200 transition"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default ProductosAdminPage;