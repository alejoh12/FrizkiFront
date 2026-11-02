import { useState } from 'react';

const LOTES_MOCK = [
  { id: 1, codigoLote: 'L2026-001', producto: 'Helado Chocolate', categoria: 'Palitos de crema', cantidad: 50, vencimiento: '30/12/2026', estado: 'Pendiente' },
  { id: 2, codigoLote: 'L2026-002', producto: 'Helado Frutilla', categoria: 'Palitos de agua', cantidad: 40, vencimiento: '29/11/2026', estado: 'Pendiente' },
  { id: 3, codigoLote: 'L2026-003', producto: 'Torta Oreo', categoria: 'Torta helada', cantidad: 10, vencimiento: '14/10/2026', estado: 'Pendiente' },
  { id: 4, codigoLote: 'L2026-004', producto: 'Balde Chocolate 10L', categoria: 'Baldes', cantidad: 25, vencimiento: '30/01/2027', estado: 'Pendiente' }
];

function VerificacionPage() {
  const [lotes, setLotes] = useState(LOTES_MOCK);
  const [loteActivo, setLoteActivo] = useState(null);

  const pendientes = lotes.filter(l => l.estado === 'Pendiente');
  const verificados = lotes.filter(l => l.estado === 'Aprobado');
  const rechazados = lotes.filter(l => l.estado === 'Rechazado');

  const manejarVerificacion = (nuevoEstado) => {
    if (!loteActivo) return;
    setLotes(lotes.map(l => l.id === loteActivo.id ? { ...l, estado: nuevoEstado } : l));
    setLoteActivo(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Verificación de Productos</h1>
        <p className="text-gray-500 text-sm mt-1">
          Verifica la calidad de los lotes de helado antes de su almacenamiento.
        </p>
      </div>

      {/* Tarjetas de Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-4 rounded-xl border border-orange-200 shadow-sm flex flex-col">
          <span className="text-orange-500 font-semibold text-sm flex items-center gap-2">
            ⚠️ Pendientes
          </span>
          <span className="text-4xl font-bold text-gray-800 mt-2">{pendientes.length}</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-green-200 shadow-sm flex flex-col">
          <span className="text-green-600 font-semibold text-sm flex items-center gap-2">
            ✓ Verificados
          </span>
          <span className="text-4xl font-bold text-gray-800 mt-2">{verificados.length}</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-red-200 shadow-sm flex flex-col">
          <span className="text-red-500 font-semibold text-sm flex items-center gap-2">
            ✕ Rechazados
          </span>
          <span className="text-4xl font-bold text-gray-800 mt-2">{rechazados.length}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Lista de Lotes Pendientes */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Lotes a Verificar</h2>
          
          {pendientes.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No hay lotes pendientes de verificación.</p>
          ) : (
            <div className="space-y-4">
              {pendientes.map(lote => (
                <div key={lote.id} className="border border-gray-100 rounded-lg p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center bg-gray-50 hover:bg-white transition">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-gray-800">{lote.producto}</h3>
                      <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded font-medium">Pendiente</span>
                    </div>
                    <p className="text-sm text-gray-500">
                      Categoría: {lote.categoria} | Cantidad: {lote.cantidad} un.
                    </p>
                    <p className="text-xs text-gray-400 mt-1">Lote: {lote.codigoLote} - Vence: {lote.vencimiento}</p>
                  </div>
                  <button 
                    onClick={() => setLoteActivo(lote)}
                    className="mt-3 sm:mt-0 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition"
                  >
                    Verificar
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Panel de Acción Lateral */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm h-fit">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <span>🔍</span> Panel de Control
          </h2>

          {!loteActivo ? (
            <div className="text-center py-12 text-gray-400 border-2 border-dashed border-gray-200 rounded-lg">
              <span className="text-4xl block mb-2">📦</span>
              <p className="text-sm">Selecciona un lote de la lista para iniciar su inspección de calidad.</p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                <p className="text-xs text-blue-600 font-bold uppercase tracking-wider mb-1">Inspeccionando</p>
                <p className="text-lg font-bold text-gray-900">{loteActivo.codigoLote}</p>
                <p className="text-sm text-gray-700">{loteActivo.producto}</p>
                <p className="text-sm text-gray-600 mt-2 font-medium">Volumen: {loteActivo.cantidad} unidades</p>
              </div>

              <div className="space-y-3">
                <button 
                  onClick={() => manejarVerificacion('Aprobado')}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition"
                >
                  ✓ Aprobar Lote
                </button>
                <button 
                  onClick={() => manejarVerificacion('Rechazado')}
                  className="w-full bg-red-100 hover:bg-red-200 text-red-700 font-bold py-3 px-4 rounded-lg transition"
                >
                  ✕ Rechazar Lote
                </button>
                <button 
                  onClick={() => setLoteActivo(null)}
                  className="w-full text-gray-500 hover:text-gray-700 text-sm font-medium py-2 mt-2"
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default VerificacionPage;