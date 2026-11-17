import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import frizkyApi from '../../api/frizkyApi';

function IngresoPage() {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [productos, setProductos] = useState([]);
  const [lotesHoy, setLotesHoy] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [mensaje, setMensaje] = useState({ tipo: '', texto: '' });
  const [enviando, setEnviando] = useState(false);

  // 1. Traer productos y lotes cargados hoy desde MySQL (usando hora local)
  const cargarDatos = async () => {
    try {
      const [resProductos, resLotes] = await Promise.all([
        frizkyApi.get('/Productos'),
        frizkyApi.get('/Lotes')
      ]);

      setProductos(resProductos.data);

      // Obtenemos la fecha de hoy en formato YYYY-MM-DD según la hora local
      const hoy = new Date();
      const anio = hoy.getFullYear();
      const mes = String(hoy.getMonth() + 1).padStart(2, '0');
      const dia = String(hoy.getDate()).padStart(2, '0');
      const hoyLocal = `${anio}-${mes}-${dia}`;

      const filtradosHoy = resLotes.data
        .filter(l => {
          if (!l.fechaElaboracion) return false;
          return l.fechaElaboracion.substring(0, 10) === hoyLocal;
        })
        .sort((a, b) => b.id - a.id);

      setLotesHoy(filtradosHoy);
    } catch (error) {
      console.error("Error al cargar datos:", error);
      setMensaje({ tipo: 'error', texto: 'No se pudieron cargar los datos de la base de datos.' });
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const getNombreProducto = (productoId) => {
    const prod = productos.find(p => p.id === productoId);
    return prod ? `${prod.tipoPresentacion} - ${prod.sabor}` : `Producto #${productoId}`;
  };

  // 2. Enviar el nuevo lote a C# sin desfase horario y actualizar la lista lateral
  const onSubmit = async (data) => {
    setEnviando(true);
    setMensaje({ tipo: '', texto: '' });

    try {
      const nuevoLote = {
        codigoLote: data.codigoLote,
        productoId: parseInt(data.productoId),
        cantidad: parseInt(data.cantidad),
        fechaElaboracion: `${data.fechaElaboracion}T00:00:00`,
        fechaVencimiento: `${data.fechaVencimiento}T00:00:00`,
        estado: "Pendiente"
      };

      const respuestaLote = await frizkyApi.post('/Lotes', nuevoLote);

      // Registramos también en la bitácora de actividad
      await frizkyApi.post('/RegistroActividad', {
        usuarioId: 1,
        loteId: respuestaLote.data?.id || 0,
        accion: 'Ingreso de Lote',
        observaciones: `Lote ${data.codigoLote} ingresado (${data.cantidad} uds.)`
      }).catch(() => {});

      setMensaje({ tipo: 'exito', texto: `¡Lote ${data.codigoLote} registrado correctamente y enviado a Verificación!` });
      reset();
      await cargarDatos();
    } catch (error) {
      console.error("Error al guardar el lote:", error);
      setMensaje({ tipo: 'error', texto: 'Hubo un error al registrar el lote. Verificá la conexión o que el código no esté duplicado.' });
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Ingreso de Lotes</h1>
        <p className="text-gray-500 text-sm mt-1">Registrá la nueva producción que sale de la planta para iniciar su trazabilidad.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* COLUMNA IZQUIERDA (2/3): Formulario de Ingreso */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
          <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
            <span>📦</span> Datos del Producto / Lote
          </h2>

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
                  placeholder="Ej: L-2026-001"
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
                  disabled={cargando}
                >
                  <option value="">{cargando ? 'Cargando productos...' : '-- Seleccionar Producto --'}</option>
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
                  placeholder="Unidades / Baldes"
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

        {/* COLUMNA DERECHA (1/3): Lotes Ingresados Hoy */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col justify-between min-h-[380px]">
          <div>
            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span>📋</span> Lotes Ingresados Hoy
            </h2>

            {cargando ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-pink-600"></div>
              </div>
            ) : lotesHoy.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <span className="text-4xl block mb-3">📋</span>
                <p className="text-sm">No hay lotes ingresados aún.</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[320px] overflow-y-auto pr-1">
                {lotesHoy.map((lote) => (
                  <div key={lote.id} className="p-3.5 rounded-lg border border-gray-100 bg-gray-50 flex justify-between items-center">
                    <div>
                      <p className="font-bold text-gray-900 text-sm">{lote.codigoLote}</p>
                      <p className="text-xs text-gray-500">{getNombreProducto(lote.productoId)}</p>
                      <span className="inline-block mt-1 text-[11px] font-semibold px-2 py-0.5 rounded bg-yellow-100 text-yellow-800">
                        {lote.estado}
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-pink-600 text-sm">{lote.cantidad} uds.</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="pt-4 mt-6 border-t border-gray-100 text-center">
            <p className="text-xs text-gray-500 font-medium">
              Total lotes cargados hoy: <strong className="text-gray-800">{lotesHoy.length}</strong>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}

export default IngresoPage;