import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import frizkyApi from '../../api/frizkyApi';

function IngresoPage() {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [productos, setProductos] = useState([]);
  const [cargandoProductos, setCargandoProductos] = useState(true);
  const [mensaje, setMensaje] = useState({ tipo: '', texto: '' });
  const [enviando, setEnviando] = useState(false);

  // 1. Traer los productos reales de la BD para el <select>
  useEffect(() => {
    const obtenerProductos = async () => {
      try {
        const respuesta = await frizkyApi.get('/Productos');
        setProductos(respuesta.data);
        setCargandoProductos(false);
      } catch (error) {
        console.error("Error al cargar productos:", error);
        setMensaje({ tipo: 'error', texto: 'No se pudieron cargar los productos de la base de datos.' });
        setCargandoProductos(false);
      }
    };
    obtenerProductos();
  }, []);

  // 2. Enviar el nuevo lote a C#
  const onSubmit = async (data) => {
    setEnviando(true);
    setMensaje({ tipo: '', texto: '' });

    try {
      // Armamos el objeto exactamente como lo espera tu API en C#
      const nuevoLote = {
        codigoLote: data.codigoLote,
        productoId: parseInt(data.productoId), // C# lo espera como número
        cantidad: parseInt(data.cantidad),
        fechaElaboracion: new Date(data.fechaElaboracion).toISOString(),
        fechaVencimiento: new Date(data.fechaVencimiento).toISOString(),
        estado: "Pendiente" // Estado inicial por defecto
      };

      await frizkyApi.post('/Lotes', nuevoLote);
      
      setMensaje({ tipo: 'exito', texto: `¡Lote ${data.codigoLote} registrado correctamente y enviado a Verificación!` });
      reset(); // Limpiamos el formulario
    } catch (error) {
      console.error("Error al guardar el lote:", error);
      setMensaje({ tipo: 'error', texto: 'Hubo un error al registrar el lote. Verificá la conexión.' });
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Ingreso de Lotes</h1>
        <p className="text-gray-500 text-sm mt-1">Registrá la nueva producción que sale de la planta para iniciar su trazabilidad.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
        {mensaje.texto && (
          <div className={`mb-6 p-4 rounded-lg font-medium text-sm ${mensaje.tipo === 'exito' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
            {mensaje.texto}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Código del Lote */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Código del Lote *</label>
              <input 
                type="text" 
                placeholder="Ej: L-001"
                {...register("codigoLote", { required: "El código es obligatorio" })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-pink-500 focus:outline-none"
              />
              {errors.codigoLote && <p className="text-red-500 text-xs mt-1">{errors.codigoLote.message}</p>}
            </div>

            {/* Selector de Producto Dinámico */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Producto Fabricado *</label>
              <select 
                {...register("productoId", { required: "Seleccioná un producto" })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-pink-500 focus:outline-none bg-white"
                disabled={cargandoProductos}
              >
                <option value="">{cargandoProductos ? 'Cargando productos...' : 'Seleccioná un producto...'}</option>
                {productos.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.tipoPresentacion} - {p.sabor}
                  </option>
                ))}
              </select>
              {errors.productoId && <p className="text-red-500 text-xs mt-1">{errors.productoId.message}</p>}
            </div>

            {/* Cantidad */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cantidad Producida *</label>
              <input 
                type="number" 
                min="1"
                placeholder="Unidades"
                {...register("cantidad", { 
                  required: "La cantidad es obligatoria",
                  min: { value: 1, message: "Debe ser mayor a 0" }
                })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-pink-500 focus:outline-none"
              />
              {errors.cantidad && <p className="text-red-500 text-xs mt-1">{errors.cantidad.message}</p>}
            </div>

            {/* Fechas */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Elaboración *</label>
                <input 
                  type="date" 
                  {...register("fechaElaboracion", { required: "Requerida" })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-pink-500 focus:outline-none"
                />
                {errors.fechaElaboracion && <p className="text-red-500 text-xs mt-1">{errors.fechaElaboracion.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Vencimiento *</label>
                <input 
                  type="date" 
                  {...register("fechaVencimiento", { required: "Requerida" })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-pink-500 focus:outline-none"
                />
                {errors.fechaVencimiento && <p className="text-red-500 text-xs mt-1">{errors.fechaVencimiento.message}</p>}
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100 flex justify-end">
            <button 
              type="submit" 
              disabled={enviando}
              className="bg-pink-600 hover:bg-pink-700 text-white font-bold py-2.5 px-6 rounded-lg transition shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {enviando ? 'Guardando...' : 'Registrar Lote'} 
              {!enviando && <span>→</span>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default IngresoPage;