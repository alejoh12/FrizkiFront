import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProductPage from './pages/publico/ProductPage';
import IngresoPage from './pages/operario/IngresoPage';
import VerificacionPage from './pages/operario/VerificacionPage';
import EmpaquetadoPage from './pages/operario/EmpaquetadoPage';
import VerificacionEmpaquePage from './pages/operario/VerificacionEmpaquePage';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<ProductPage />} />
            <Route path="/ingreso" element={<IngresoPage />} />
            <Route path="/verificacion" element={<VerificacionPage />} />
            <Route path="/empaquetado" element={<EmpaquetadoPage />} />
            <Route path="/verificacion-empaque" element={<VerificacionEmpaquePage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;