import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🍦</span>
          <span className="font-bold text-xl text-pink-600">Frisky Helados</span>
          <span className="text-xs bg-purple-100 text-purple-700 font-semibold px-2.5 py-0.5 rounded-full">
            Empaque & Almacenamiento
          </span>
        </div>
        <nav className="flex items-center space-x-6 text-sm font-medium text-gray-600">
          <Link to="/" className="hover:text-pink-600 transition">Catálogo</Link>
          <Link to="/ingreso" className="hover:text-pink-600 transition">Ingreso Lotes</Link>
          <Link to="/verificacion" className="hover:text-pink-600 transition">Verificación</Link>
          <Link to="/login" className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg transition font-semibold">
            Acceso Roles
          </Link>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;