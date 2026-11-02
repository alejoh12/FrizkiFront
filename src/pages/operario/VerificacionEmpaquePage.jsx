import { useState } from 'react';

const LOTES_EMPAQUETADOS = [
  { id: 1, codigoLote: 'L2026-001', producto: 'Helado Chocolate', pesoEst: '2.5 kg', tempReq: '-18°C', estado: 'Pendiente' },
  { id: 4, codigoLote: 'L2026-005', producto: 'Balde Frutilla 1kg', pesoEst: '1.0 kg', tempReq: '-18°C', estado: 'Pendiente' }
];

function VerificacionEmpaquePage() {
  const [lotes, setLotes] = useState(LOTES_EMPAQUETADOS);

  const manejarVerificacion = (id) => {
    setLotes(lotes.filter(l => l.id !== id));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Verificación de Empaquetado</h1>
        <p className="text-gray-500 text-sm mt-1">
          Control final de sellado y temperatura antes del almacenamiento en cámara.
        </p>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Lotes Listos para Almacenar</h2>
        
        {lotes.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No hay empaques pendientes de verificación.</p>
        ) : (
          <div className="space-y-4">
            {lotes.map(lote => (
              <div key={lote.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50 flex flex-col md:flex-row justify-between items-start md:items-center">
                <div className="w-full md:w-2/3">
                  <h3 className="font-bold text-gray-900 mb-2">{lote.codigoLote} - {lote.producto}</h3>
                  <div className="flex gap-4">
                    <div className="bg-blue-50 text-blue-800 px-3 py-2 rounded text-sm w-1/2">
                      <span className="block text-xs text-blue-600 font-semibold mb-1">Temp. Requerida</span>
                      🌡️ {lote.tempReq}
                    </div>
                    <div className="bg-purple-50 text-purple-800 px-3 py-2 rounded text-sm w-1/2">
                      <span className="block text-xs text-purple-600 font-semibold mb-1">Peso Estimado</span>
                      ⚖️ {lote.pesoEst}
                    </div>
                  </div>
                </div>
                <div className="mt-4 md:mt-0 flex gap-2 w-full md:w-auto">
                  <button 
                    onClick={() => manejarVerificacion(lote.id)}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition w-full md:w-auto"
                  >
                    ✓ Aprobar y Almacenar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default VerificacionEmpaquePage;