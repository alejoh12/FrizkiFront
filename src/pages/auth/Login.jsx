import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ROLES = [
  { 
    id: 'Operario', 
    desc: 'Acceso para personal operativo', 
    icon: '⚙️', 
    btnColor: 'bg-blue-600 hover:bg-blue-700', 
    lightBg: 'bg-blue-50', 
    textColor: 'text-blue-600' 
  },
  { 
    id: 'Dueño', 
    desc: 'Acceso administrativo completo', 
    icon: '🏪', 
    btnColor: 'bg-purple-600 hover:bg-purple-700', 
    lightBg: 'bg-purple-50', 
    textColor: 'text-purple-600' 
  },
  { 
    id: 'Cliente', 
    desc: 'Acceso para realizar pedidos', 
    icon: '👥', 
    btnColor: 'bg-pink-600 hover:bg-pink-700', 
    lightBg: 'bg-pink-50', 
    textColor: 'text-pink-600' 
  }
];

function Login() {
  const [rolSeleccionado, setRolSeleccionado] = useState(null);
  const navigate = useNavigate();

  const manejarLogin = (e) => {
    e.preventDefault();
    
    // Guardamos el rol en la memoria del navegador
    localStorage.setItem('rolFrisky', rolSeleccionado.id);

    // Redireccionamos recargando la página para que el Navbar lea el nuevo rol
    if (rolSeleccionado.id === 'Operario') {
      window.location.href = '/ingreso';
    } else if (rolSeleccionado.id === 'Dueño') {
      window.location.href = '/dashboard';
    } else {
      window.location.href = '/';
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center bg-slate-50 p-4">
      
      {/* Encabezado fijo */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-3xl mx-auto shadow-sm mb-3">
          🍦
        </div>
        <h1 className="text-2xl font-bold text-pink-600">Frisky Helados</h1>
      </div>

      {/* VISTA 1: Selección de Rol */}
      {!rolSeleccionado ? (
        <div className="w-full max-w-4xl">
          <p className="text-gray-500 text-center mb-8">Selecciona tu tipo de acceso</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {ROLES.map((rol) => (
              <div key={rol.id} className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center text-center transition hover:shadow-md">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl mb-4 ${rol.lightBg} ${rol.textColor}`}>
                  {rol.icon}
                </div>
                <h2 className="text-xl font-bold text-gray-800 mb-2">{rol.id}</h2>
                <p className="text-sm text-gray-500 mb-8 flex-grow">{rol.desc}</p>
                <button 
                  onClick={() => setRolSeleccionado(rol)}
                  className={`w-full text-white font-semibold py-2.5 rounded-lg transition ${rol.btnColor}`}
                >
                  Ingresar
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* VISTA 2: Formulario de Login */
        <div className="w-full max-w-md">
          <button 
            onClick={() => setRolSeleccionado(null)}
            className="text-sm text-gray-500 hover:text-gray-800 mb-4 flex items-center gap-1 transition"
          >
            ← Volver
          </button>
          
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
            <div className="text-center mb-6">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl mx-auto mb-3 ${rolSeleccionado.lightBg} ${rolSeleccionado.textColor}`}>
                {rolSeleccionado.icon}
              </div>
              <h2 className="text-xl font-bold text-gray-800">Acceso {rolSeleccionado.id}</h2>
              <p className="text-sm text-gray-500 mt-1">Ingresa tus credenciales para continuar</p>
            </div>

            <form onSubmit={manejarLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Usuario</label>
                <input 
                  type="text" 
                  placeholder="Ingresa tu usuario" 
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
                <input 
                  type="password" 
                  placeholder="Ingresa tu contraseña" 
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
              
              <button 
                type="submit" 
                className={`w-full text-white font-bold py-3 rounded-lg transition mt-2 ${rolSeleccionado.btnColor}`}
              >
                Iniciar Sesión
              </button>
            </form>

            {/* Caja de credenciales de prueba */}
            <div className={`mt-6 p-4 rounded-lg border text-sm ${rolSeleccionado.lightBg} border-opacity-50`}>
              <p className={`font-semibold mb-1 ${rolSeleccionado.textColor}`}>Credenciales de prueba:</p>
              <p className="text-gray-700">Usuario: <strong>{rolSeleccionado.id.toLowerCase()}</strong></p>
              <p className="text-gray-700">Contraseña: <strong>1234</strong></p>
            </div>
          </div>
          
          <p className="text-center text-xs text-gray-400 mt-6">
            ¿Olvidaste tu contraseña? Contacta al administrador
          </p>
        </div>
      )}
    </div>
  );
}

export default Login;