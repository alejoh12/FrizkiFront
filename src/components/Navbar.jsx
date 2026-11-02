import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const currentPath = location.pathname;

  const getLinkClass = (path) => {
    return currentPath === path
      ? "text-pink-600 font-bold border-b-2 border-pink-600 pb-1"
      : "hover:text-pink-600 transition text-gray-600 font-medium pb-1";
  };

  const getMobileLinkClass = (path) => {
    return currentPath === path
      ? "text-pink-600 font-bold bg-pink-50 px-3 py-2 rounded-lg"
      : "text-gray-600 hover:text-pink-600 hover:bg-gray-50 px-3 py-2 rounded-lg transition";
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Logo / Título (Te lleva a la raíz "/") */}
        <Link to="/" className="flex items-center gap-3 cursor-pointer group">
          <span className="text-2xl group-hover:scale-110 transition">🍦</span>
          <span className="font-bold text-xl text-pink-600 group-hover:text-pink-700 transition">
            Frisky Helados
          </span>
          <span className="text-xs bg-purple-100 text-purple-700 font-semibold px-2.5 py-0.5 rounded-full hidden sm:block">
            Empaque & Almacenamiento
          </span>
        </Link>

        {/* Enlaces de Navegación Centrales (Solo para pantallas grandes 'lg' en adelante) */}
        <nav className="hidden lg:flex items-center space-x-6 text-sm">
          <Link to="/" className={getLinkClass('/')}>Catálogo</Link>
          <Link to="/ingreso" className={getLinkClass('/ingreso')}>Ingreso Lotes</Link>
          <Link to="/verificacion" className={getLinkClass('/verificacion')}>Verificación</Link>
          <Link to="/empaquetado" className={getLinkClass('/empaquetado')}>Empaquetado</Link>
          <Link to="/verificacion-empaque" className={getLinkClass('/verificacion-empaque')}>Verif. Final</Link>
        </nav>

        {/* Botón de Login (Desktop) y Botón Hamburguesa (Móvil y Tablet) */}
        <div className="flex items-center gap-4">
          <div className="hidden lg:block">
            <Link to="/login" className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg transition font-semibold text-sm shadow-sm">
              Acceso Roles
            </Link>
          </div>

          {/* Botón Hamburguesa para pantallas menores a escritorio */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 rounded-lg text-gray-600 hover:text-pink-600 hover:bg-gray-100 focus:outline-none transition"
            aria-label="Abrir menú"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Menú Desplegable para Móvil y Tablet (Se muestra cuando isOpen es true) */}
      {isOpen && (
        <div className="lg:hidden bg-white border-b border-gray-200 px-4 pt-2 pb-4 space-y-2 shadow-lg">
          <Link 
            to="/" 
            onClick={() => setIsOpen(false)} 
            className={`block ${getMobileLinkClass('/')}`}
          >
            Catálogo
          </Link>
          <Link 
            to="/ingreso" 
            onClick={() => setIsOpen(false)} 
            className={`block ${getMobileLinkClass('/ingreso')}`}
          >
            Ingreso Lotes
          </Link>
          <Link 
            to="/verificacion" 
            onClick={() => setIsOpen(false)} 
            className={`block ${getMobileLinkClass('/verificacion')}`}
          >
            Verificación
          </Link>
          <Link 
            to="/empaquetado" 
            onClick={() =>isesOpen(false) || setIsOpen(false)} 
            className={`block ${getMobileLinkClass('/empaquetado')}`}
          >
            Empaquetado
          </Link>
          <Link 
            to="/verificacion-empaque" 
            onClick={() => setIsOpen(false)} 
            className={`block ${getMobileLinkClass('/verificacion-empaque')}`}
          >
            Verif. Final
          </Link>
          <div className="pt-2 border-t border-gray-100">
            <Link 
              to="/login" 
              onClick={() => setIsOpen(false)} 
              className="block text-center bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg font-semibold text-sm transition"
            >
              Acceso Roles
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;