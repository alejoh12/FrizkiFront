import { useState } from 'react';

const LOTES_APROBADOS = [
  { id: 1, codigoLote: 'L2026-001', producto: 'Helado Chocolate', presentacion: 'Palitos de crema', cantidad: 50, estado: 'Pendiente' },
  { id: 2, codigoLote: 'L2026-003', producto: 'Torta Oreo', presentacion: 'Torta helada', cantidad: 10, estado: 'Pendiente' },
  { id: 3, codigoLote: 'L2026-004', producto: 'Balde Chocolate 10L', presentacion: 'Baldes', cantidad: 25, estado: 'Pendiente' }
];

function EmpaquetadoPage() {
  const [lotes, setLotes] = useState(LOTES_APROBADOS);
  const [loteActivo, setLoteActivo] = useState(null);

  const pendientes = lotes.filter(l => l.estado === 'Pendiente');
  const empaquetados = lotes.filter(l => l.estado === 'Empaquetado');

  const manejarEmpaque = (id, nuevoEstado) => {
    setLotes(lotes.map(l => l.id === id ? { ...l, estado: nuevoEstado } : l));
    setLoteActivo(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Empaquetado de Lotes</h1>
        <p className="text-gray-500 text-sm mt-1">
          Registra el envasado de los lotes aprobados por control de calidad.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-4 rounded-xl border border-orange-200 shadow-sm flex flex-col">
          <span className="text-orange-500 font-semibold text-sm">⚠️ Pendientes de Empaque</span>
          <span className="text-4xl font-bold text-gray-800 mt-2">{pendientes.length}</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-green-200 shadow-sm flex flex-col">
          <span className="text-green-600 font-semibold text-sm">✓ Empaquetados Hoy</span>
          <span className="text-4xl font-bold text-gray-800 mt-2">{empaquetados.length}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Cola de Empaquetado</h2>
          {pendientes.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No hay lotes para empaquetar.</p>
          ) : (
            <div className="space-y-4">
              {pendientes.map(lote => (
                <div key={lote.id} className="border border-red-100 bg-red-50 rounded-lg p-4 flex justify-between items-center">
                  <div>
                    <h3 className="font-bold text-gray-900">{lote.codigoLote} <span className="text-xs bg-red-200 text-red-800 px-2 py-0.5 rounded ml-2">Urgente</span></h3>
                    <p className="text-sm text-gray-700 mt-1">{lote.producto}</p>
                    <p className="text-xs text-gray-500 mt-1">Presentación: {lote.presentacion} | Unidades: {lote.cantidad}</p>
                  </div>
                  <button 
                    onClick={() => setLoteActivo(lote)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition"
                  >
                    Iniciar
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm h-fit">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Panel de Envasado</h2>
          {!loteActivo ? (
            <div className="text-center py-12 text-gray-400 border-2 border-dashed border-gray-200 rounded-lg">
              <span className="text-4xl block mb-2">📦</span>
              <p className="text-sm">Selecciona un lote para iniciar el proceso.</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                <p className="text-lg font-bold text-gray-900">{loteActivo.codigoLote}</p>
                <p className="text-sm text-gray-700">{loteActivo.producto}</p>
                <p className="text-sm font-medium mt-2">A envasar: {loteActivo.cantidad} {loteActivo.presentacion}</p>
              </div>
              <button 
                onClick={() => manejarEmpaque(loteActivo.id, 'Empaquetado')}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition"
              >
                ✓ Finalizar Empaque
              </button>
              <button 
                onClick={() => setLoteActivo(null)}
                className="w-full text-gray-500 hover:text-gray-700 text-sm font-medium py-2"
              >
                Cancelar
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default EmpaquetadoPage;