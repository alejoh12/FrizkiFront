import { Link, useLocation } from 'react-router-dom';

function Navbar() {
  const location = useLocation();
  const currentPath = location.pathname;

  // Función auxiliar para resaltar el link activo
  const getLinkClass = (path) => {
    return currentPath === path
      ? "text-pink-600 font-bold border-b-2 border-pink-600 pb-1"
      : "hover:text-pink-600 transition text-gray-600 font-medium pb-1";
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <span className="text-2xl">🍦</span>
          <span className="font-bold text-xl text-pink-600">Frisky Helados</span>
          <span className="text-xs bg-purple-100 text-purple-700 font-semibold px-2.5 py-0.5 rounded-full hidden sm:block">
            Empaque & Almacenamiento
          </span>
        </div>

        {/* Enlaces de Navegación Centrales */}
        <nav className="hidden md:flex items-center space-x-6 text-sm">
          <Link to="/" className={getLinkClass('/')}>Catálogo</Link>
          <Link to="/ingreso" className={getLinkClass('/ingreso')}>Ingreso Lotes</Link>
          <Link to="/verificacion" className={getLinkClass('/verificacion')}>Verificación</Link>
          <Link to="/empaquetado" className={getLinkClass('/empaquetado')}>Empaquetado</Link>
          <Link to="/verificacion-empaque" className={getLinkClass('/verificacion-empaque')}>Verif. Final</Link>
        </nav>

        {/* Botón de Login a la derecha */}
        <div>
          <Link to="/login" className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg transition font-semibold text-sm shadow-sm">
            Acceso Roles
          </Link>
        </div>
      </div>
    </header>
  );
}

export default Navbar;