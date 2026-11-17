import { Link } from 'react-router-dom';

function NosotrosPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Hero / Encabezado */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 md:p-12 text-white shadow-sm mb-10">
        <span className="inline-block bg-white/20 text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-4">
          Sobre Nosotros
        </span>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4">
          El sabor artesanal de Tucumán, impulsado por tecnología
        </h1>
        <p className="text-purple-100 text-base md:text-lg max-w-3xl leading-relaxed">
          En <strong>Frisky Helados</strong> combinamos recetas tradicionales con un sistema integral de trazabilidad industrial para garantizar que cada lote llegue con la máxima calidad y frescura desde nuestra planta en Concepción hasta cada punto de venta.
        </p>
      </div>

      {/* Historia + Números clave */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span>📖</span> Nuestra Historia
          </h2>
          <div className="space-y-4 text-gray-600 text-sm md:text-base leading-relaxed">
            <p>
              Nacimos en el sur tucumano con un objetivo claro: elaborar helados cremosos, palitos y postres helados con materias primas seleccionadas y estándares estrictos de inocuidad alimentaria.
            </p>
            <p>
              Con el crecimiento de nuestra capacidad productiva en el Parque Industrial de Concepción, digitalizamos por completo nuestras líneas de elaboración, empaque y almacenamiento en cámara de frío a <strong>-18°C</strong>.
            </p>
            <p>
              Hoy cada lote producido cuenta con seguimiento en tiempo real desde su ingreso a planta hasta su aprobación final, asegurando transparencia total para nuestro equipo y nuestros clientes.
            </p>
          </div>
        </div>

        {/* Tarjeta de Datos Rápidos */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8 flex flex-col justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <span>🏭</span> Planta Frisky
            </h2>
            <div className="space-y-5">
              <div className="border-b border-gray-100 pb-4">
                <p className="text-2xl font-extrabold text-purple-600">-18 °C</p>
                <p className="text-xs text-gray-500 mt-0.5">Cadena de frío controlada en cámara</p>
              </div>
              <div className="border-b border-gray-100 pb-4">
                <p className="text-2xl font-extrabold text-pink-600">100%</p>
                <p className="text-xs text-gray-500 mt-0.5">Trazabilidad por lote y operario</p>
              </div>
              <div>
                <p className="text-2xl font-extrabold text-gray-900">Concepción</p>
                <p className="text-xs text-gray-500 mt-0.5">Parque Industrial, Tucumán, Argentina</p>
              </div>
            </div>
          </div>

          <Link
            to="/"
            className="mt-6 w-full text-center bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold py-2.5 px-4 rounded-lg text-sm transition"
          >
            Ver Catálogo de Productos →
          </Link>
        </div>
      </div>

      {/* Organización de la Fábrica */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <span>🤝</span> Organización de la Planta
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Así se estructura nuestro flujo operativo diario para asegurar la calidad de cada producto.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="p-5 rounded-xl bg-gray-50 border border-gray-100">
            <span className="text-2xl block mb-3">🧪</span>
            <h3 className="font-bold text-gray-900 text-base mb-1">1. Elaboración</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Mezclado, pasteurización y maduración de bases cremosas y frutales con ingredientes naturales.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-gray-50 border border-gray-100">
            <span className="text-2xl block mb-3">✅</span>
            <h3 className="font-bold text-gray-900 text-base mb-1">2. Control de Calidad</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Verificación sensorial, control de peso y aprobación lote por lote antes de liberar la producción.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-gray-50 border border-gray-100">
            <span className="text-2xl block mb-3">📦</span>
            <h3 className="font-bold text-gray-900 text-base mb-1">3. Línea de Empaque</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Envasado automático y etiquetado con código único de lote para seguimiento completo.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-gray-50 border border-gray-100">
            <span className="text-2xl block mb-3">❄️</span>
            <h3 className="font-bold text-gray-900 text-base mb-1">4. Cámara de Frío</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Almacenamiento inmediato bajo temperatura constante hasta su distribución comercial.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NosotrosPage;