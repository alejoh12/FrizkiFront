import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10">
          
          {/* COLUMNA IZQUIERDA (Marca, Legal y Redes - 5 columnas) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-2.5">
              <span className="text-2xl">
                <img
            src="/logo-frisky.png"
            alt="Logo Frisky Helados"
            className="w-10 h-10 object-contain group-hover:scale-110 transition"
          />
              </span>
              <span className="text-xl font-extrabold tracking-tight text-white">
                Frisky <span className="text-pink-500">Helados</span>
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-800 text-purple-300 border border-slate-700 px-2 py-0.5 rounded-full">
                Planta Industrial
              </span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              © {new Date().getFullYear()} Frisky Helados S.R.L. Todos los derechos reservados. Sistema integral de trazabilidad, control de calidad y gestión de cámara de frío.
            </p>

            {/* Íconos sociales puramente visuales */}
            <div className="flex items-center gap-3 pt-1 text-slate-400">
              <span className="w-8 h-8 rounded-lg bg-slate-800/80 border border-slate-700/80 flex items-center justify-center text-xs font-bold select-none">
                IG
              </span>
              <span className="w-8 h-8 rounded-lg bg-slate-800/80 border border-slate-700/80 flex items-center justify-center text-xs font-bold select-none">
                FB
              </span>
              <span className="w-8 h-8 rounded-lg bg-slate-800/80 border border-slate-700/80 flex items-center justify-center text-xs font-bold select-none">
                IN
              </span>
            </div>
          </div>

          {/* COLUMNA 2: PLANTA CONCEPCIÓN (Contacto real - 3 columnas) */}
          <div className="lg:col-span-3 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">
              Planta Central
            </h3>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li className="flex items-start gap-2">
                <span>📍</span>
                <span>Parque Industrial, Concepción, Tucumán, Argentina</span>
              </li>
              <li className="flex items-center gap-2">
                <span>📞</span>
                <span>+54 3865 123456</span>
              </li>
              <li className="flex items-center gap-2">
                <span>✉️</span>
                <span>admin@friskyhelados.com</span>
              </li>
              <li className="flex items-center gap-2">
                <span>❄️</span>
                <span>Cámara de Frío: -18 °C (24/7)</span>
              </li>
            </ul>
          </div>

          {/* COLUMNA 3: EMPRESA & SOPORTE (Links - 2 columnas) */}
          <div className="lg:col-span-2 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">
              Institucional
            </h3>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link
                  to="/nosotros"
                  className="text-slate-300 hover:text-pink-400 font-medium transition flex items-center gap-1.5"
                >
                  <span>Nosotros</span>
                </Link>
              </li>
              <li>
                {/* Link puramente visual, sin navegación */}
                <span className="text-slate-400 cursor-default select-none">
                  Ayuda
                </span>
              </li>
              <li>
                <span className="text-slate-400 cursor-default select-none">
                  Control de Calidad
                </span>
              </li>
              <li>
                <span className="text-slate-400 cursor-default select-none">
                  Política de Inocuidad
                </span>
              </li>
            </ul>
          </div>

          {/* COLUMNA 4: HORARIOS Y OPERACIÓN (2 columnas) */}
          <div className="lg:col-span-2 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">
              Operación
            </h3>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <span className="block text-slate-300 font-medium">Lunes a Viernes</span>
                07:00 a 22:00 hs (Turnos M/T)
              </li>
              <li>
                <span className="block text-slate-300 font-medium">Sábados</span>
                08:00 a 14:00 hs (Despacho)
              </li>
              <li className="pt-1">
                <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2.5 py-0.5 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  Sistema Operativo
                </span>
              </li>
            </ul>
          </div>

        </div>

        {/* Barra inferior de cierre */}
        <div className="mt-10 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
          <p>Hecho en Concepción, Tucumán • Trazabilidad Alimentaria Frizky v1.0</p>
          <div className="flex items-center gap-4 select-none">
            <span>Privacidad</span>
            <span>•</span>
            <span>Términos de Uso</span>
            <span>•</span>
            <span>Normas Bromatológicas</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;