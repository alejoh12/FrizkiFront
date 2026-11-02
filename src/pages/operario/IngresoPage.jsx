import { useState } from 'react';
import { useForm } from 'react-hook-form';

const PRODUCTOS_OPCIONES = [
  { id: 1, nombre: 'Helado de Frutilla', categoria: 'Palitos de agua' },
  { id: 2, nombre: 'Helado de Limón', categoria: 'Palitos de agua' },
  { id: 3, nombre: 'Dulce de Leche Granizado', categoria: 'Palitos de crema' },
  { id: 4, nombre: 'Balde Chocolate Marroquí 10L', categoria: 'Baldes' },
  { id: 5, nombre: 'Torta Helada Oreo', categoria: 'Torta helada' },
];

function IngresoPage() {
  const [lotesIngresados, setLotesIngresados] = useState([]);
  const [mensajeExito, setMensajeExito] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      cantidad: 1,
      fechaVencimiento: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0],
    },
  });

  const onSubmit = (data) => {
    const productoSeleccionado = PRODUCTOS_OPCIONES.find(
      (p) => p.id === parseInt(data.productoId)
    );

    const nuevoLote = {
      id: Date.now(),
      codigoLote: data.codigoLote,
      productoNombre: productoSeleccionado
        ? productoSeleccionado.nombre
        : 'Producto',
      categoria: productoSeleccionado
        ? productoSeleccionado.categoria
        : 'General',
      cantidad: parseInt(data.cantidad),
      fechaVencimiento: data.fechaVencimiento,
      fechaIngreso: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    setLotesIngresados([nuevoLote, ...lotesIngresados]);
    setMensajeExito(true);
    setTimeout(() => setMensajeExito(false), 3000);

    reset({
      productoId: '',
      codigoLote: '',
      cantidad: 1,
      fechaVencimiento: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0],
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Ingreso de Productos</h1>
        <p className="text-gray-500 text-sm mt-1">
          Registra la entrada de nuevos lotes de helado producidos en planta.
        </p>
      </div>

      {mensajeExito && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg flex items-center justify-between">
          <span>✓ Lote registrado correctamente en la lista de espera.</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Formulario principal */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <span>📦</span> Datos del Producto / Lote
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Selección de Producto */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Producto
              </label>
              <select
                {...register('productoId', {
                  required: 'Selecciona un producto',
                })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="">-- Seleccionar Producto --</option>
                {PRODUCTOS_OPCIONES.map((prod) => (
                  <option key={prod.id} value={prod.id}>
                    {prod.nombre} ({prod.categoria})
                  </option>
                ))}
              </select>
              {errors.productoId && (
                <span className="text-xs text-red-500 mt-1 block">
                  {errors.productoId.message}
                </span>
              )}
            </div>

            {/* Código de Lote */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Número de Lote
              </label>
              <input
                type="text"
                placeholder="Ej: L2026-001"
                {...register('codigoLote', {
                  required: 'El número de lote es obligatorio',
                  pattern: {
                    value: /^L\d{4}-\d{3,}$/i,
                    message: 'Formato sugerido: L2026-001',
                  },
                })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              {errors.codigoLote && (
                <span className="text-xs text-red-500 mt-1 block">
                  {errors.codigoLote.message}
                </span>
              )}
            </div>

            {/* Cantidad y Fecha Vencimiento */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cantidad (Unidades/Baldes)
                </label>
                <input
                  type="number"
                  min="1"
                  {...register('cantidad', {
                    required: 'Ingresa la cantidad',
                    min: { value: 1, message: 'La cantidad debe ser mayor a 0' },
                  })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                {errors.cantidad && (
                  <span className="text-xs text-red-500 mt-1 block">
                    {errors.cantidad.message}
                  </span>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha de Vencimiento
                </label>
                <input
                  type="date"
                  {...register('fechaVencimiento', {
                    required: 'Selecciona una fecha',
                  })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                {errors.fechaVencimiento && (
                  <span className="text-xs text-red-500 mt-1 block">
                    {errors.fechaVencimiento.message}
                  </span>
                )}
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-4 rounded-lg transition shadow-sm"
            >
              + Agregar Lote a la Lista
            </button>
          </form>
        </div>

        {/* Panel lateral: Lista de Ingresos Recientes */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <span>📋</span> Lotes Ingresados Hoy
            </h2>

            {lotesIngresados.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <span className="text-4xl block mb-2">📋</span>
                <p className="text-sm">No hay lotes ingresados aún.</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                {lotesIngresados.map((lote) => (
                  <div
                    key={lote.id}
                    className="p-3 bg-gray-50 rounded-lg border border-gray-200 text-sm flex justify-between items-start"
                  >
                    <div>
                      <span className="font-bold text-blue-600">{lote.codigoLote}</span>
                      <h4 className="font-semibold text-gray-800 mt-0.5">
                        {lote.productoNombre}
                      </h4>
                      <p className="text-xs text-gray-500">
                        {lote.cantidad} un. • Vence: {lote.fechaVencimiento}
                      </p>
                    </div>
                    <span className="text-xs bg-blue-100 text-blue-700 font-semibold px-2 py-0.5 rounded">
                      {lote.fechaIngreso}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-gray-100 text-xs text-gray-400 text-center">
            Total lotes cargados en sesión: {lotesIngresados.length}
          </div>
        </div>
      </div>
    </div>
  );
}

export default IngresoPage;