import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const currentPath = location.pathname;

  // 1. Leemos qué rol está logueado
  const userRole = localStorage.getItem('rolFrisky');

  // 2. Definimos qué menús ve cada rol
  const enlacesOperario = [
    { path: '/', label: 'Catálogo' },
    { path: '/ingreso', label: 'Ingreso Lotes' },
    { path: '/verificacion', label: 'Verificación' },
    { path: '/empaquetado', label: 'Empaquetado' },
    { path: '/verificacion-empaque', label: 'Verif. Final' }
  ];

  const enlacesDueno = [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/admin-productos', label: 'Productos' },
    { path: '/inventario', label: 'Inventario' },
    { path: '/configuracion', label: 'Configuración' }, // <-- Nuevo enlace
    { path: '/', label: 'Catálogo Público' }
  ];

  const enlacesPublicos = [
    { path: '/', label: 'Catálogo' }
  ];

  // 3. Asignamos la lista correcta según el rol actual
  const enlacesAMostrar = userRole === 'Dueño' ? enlacesDueno :
                          userRole === 'Operario' ? enlacesOperario :
                          enlacesPublicos;

  const cerrarSesion = () => {
    localStorage.removeItem('rolFrisky');
    window.location.href = '/'; // Recargamos y volvemos al inicio
  };

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
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 cursor-pointer group">
          <span className="text-2xl group-hover:scale-110 transition">🍦</span>
          <span className="font-bold text-xl text-pink-600 group-hover:text-pink-700 transition">
            Frisky Helados
          </span>
          {userRole && (
            <span className="text-xs bg-purple-100 text-purple-700 font-semibold px-2.5 py-0.5 rounded-full hidden sm:block">
              {userRole}
            </span>
          )}
        </Link>

        {/* Navegación PC (Dinámica) */}
        <nav className="hidden lg:flex items-center space-x-6 text-sm">
          {enlacesAMostrar.map((enlace) => (
            <Link key={enlace.path} to={enlace.path} className={getLinkClass(enlace.path)}>
              {enlace.label}
            </Link>
          ))}
        </nav>

        {/* Botones de Sesión (PC y Hamburguesa Móvil) */}
        <div className="flex items-center gap-4">
          <div className="hidden lg:block">
            {!userRole ? (
              <Link to="/login" className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg transition font-semibold text-sm shadow-sm">
                Acceso Roles
              </Link>
            ) : (
              <button onClick={cerrarSesion} className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition font-semibold text-sm shadow-sm">
                Cerrar Sesión
              </button>
            )}
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 rounded-lg text-gray-600 hover:text-pink-600 hover:bg-gray-100 focus:outline-none transition"
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

      {/* Menú Desplegable Móvil (Dinámico) */}
      {isOpen && (
        <div className="lg:hidden bg-white border-b border-gray-200 px-4 pt-2 pb-4 space-y-2 shadow-lg">
          {enlacesAMostrar.map((enlace) => (
            <Link 
              key={enlace.path}
              to={enlace.path} 
              onClick={() => setIsOpen(false)} 
              className={`block ${getMobileLinkClass(enlace.path)}`}
            >
              {enlace.label}
            </Link>
          ))}
          <div className="pt-2 border-t border-gray-100">
            {!userRole ? (
              <Link to="/login" onClick={() => setIsOpen(false)} className="block text-center bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg font-semibold text-sm transition">
                Acceso Roles
              </Link>
            ) : (
              <button onClick={cerrarSesion} className="w-full text-center bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-semibold text-sm transition">
                Cerrar Sesión
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;