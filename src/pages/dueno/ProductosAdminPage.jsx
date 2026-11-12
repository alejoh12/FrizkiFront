import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import frizkyApi from '../../api/frizkyApi';

function ProductosAdminPage() {
  const [productos, setProductos] = useState([]);
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
        precio: parseFloat(data.precio) // Aseguramos que el precio sea número decimal para C#
      };

      if (productoEditando) {
        // Editar (PUT)
        productoData.id = productoEditando.id;
        await frizkyApi.put(`/Productos/${productoEditando.id}`, productoData);
      } else {
        // Crear Nuevo (POST)
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Administración de Productos</h1>
          <p className="text-gray-500 text-sm mt-1">Gestioná el catálogo, precios y presentaciones de Frizky.</p>
        </div>
        {!mostrarFormulario && (
          <button 
            onClick={abrirNuevo}
            className="bg-pink-600 hover:bg-pink-700 text-white font-bold py-2.5 px-6 rounded-lg transition shadow-sm"
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Presentación *</label>
                <select 
                  {...register("tipoPresentacion", { required: "Requerido" })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-pink-500 outline-none bg-white"
                >
                  <option value="">Seleccionar...</option>
                  <option value="Balde 10L">Balde 10L</option>
                  <option value="Vasito 120cc">Vasito 120cc</option>
                  <option value="Palito de Agua">Palito de Agua</option>
                  <option value="Palitos de crema">Palito de Crema</option>
                  <option value="Torta helada">Torta Helada</option>
                </select>
                {errors.tipoPresentacion && <p className="text-red-500 text-xs mt-1">{errors.tipoPresentacion.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sabor / Nombre *</label>
                <input 
                  type="text" 
                  placeholder="Ej: Dulce de Leche Granizado"
                  {...register("sabor", { required: "Requerido" })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-pink-500 outline-none"
                />
                {errors.sabor && <p className="text-red-500 text-xs mt-1">{errors.sabor.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Precio Unitario ($) *</label>
                <input 
                  type="number" 
                  step="0.01"
                  {...register("precio", { required: "Requerido", min: 0 })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-pink-500 outline-none"
                />
                {errors.precio && <p className="text-red-500 text-xs mt-1">{errors.precio.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">URL Imagen (Opcional)</label>
                <input 
                  type="text" 
                  placeholder="https://ejemplo.com/foto.jpg"
                  {...register("imagenUrl")}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-pink-500 outline-none"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Descripción Breve</label>
                <textarea 
                  rows="2"
                  {...register("descripcion")}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-pink-500 outline-none resize-none"
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
                className="bg-pink-600 hover:bg-pink-700 text-white font-bold py-2.5 px-6 rounded-lg transition shadow-sm disabled:opacity-50"
              >
                {procesando ? 'Guardando...' : 'Guardar Producto'}
              </button>
            </div>
          </form>
        </div>
      ) : (
        /* Tabla de Productos */
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Presentación</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Sabor</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Precio</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {cargando ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-gray-500">Cargando catálogo...</td>
                  </tr>
                ) : productos.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-gray-500">No hay productos registrados en el sistema.</td>
                  </tr>
                ) : (
                  productos.map((prod) => (
                    <tr key={prod.id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 text-sm text-gray-500">#{prod.id}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-gray-800">{prod.tipoPresentacion}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{prod.sabor}</td>
                      <td className="px-6 py-4 font-bold text-pink-600">${Number(prod.precio).toFixed(2)}</td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <button 
                          onClick={() => abrirEdicion(prod)}
                          className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-1.5 px-3 rounded text-sm transition"
                        >
                          Editar
                        </button>
                        <button 
                          onClick={() => eliminarProducto(prod.id, prod.sabor)}
                          className="bg-red-50 hover:bg-red-100 text-red-600 font-medium py-1.5 px-3 rounded text-sm transition"
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductosAdminPage;