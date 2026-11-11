import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProductPage from "./pages/publico/ProductPage";
import IngresoPage from "./pages/operario/IngresoPage";
import VerificacionPage from "./pages/operario/VerificacionPage";
import EmpaquetadoPage from "./pages/operario/EmpaquetadoPage";
import VerificacionEmpaquePage from "./pages/operario/VerificacionEmpaquePage";
import Login from "./pages/auth/Login";
import DashboardPage from "./pages/dueno/DashboardPage";
import InventarioPage from "./pages/dueno/InventarioPage";
import ProductosAdminPage from "./pages/dueno/ProductosAdminPage";
import ConfiguracionPage from "./pages/dueno/ConfiguracionPage";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<ProductPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/ingreso" element={<IngresoPage />} />
            <Route path="/verificacion" element={<VerificacionPage />} />
            <Route path="/empaquetado" element={<EmpaquetadoPage />} />
            <Route
              path="/verificacion-empaque"
              element={<VerificacionEmpaquePage />}
            />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/inventario" element={<InventarioPage />} />
            <Route path="/admin-productos" element={<ProductosAdminPage />} />
            <Route path="/configuracion" element={<ConfiguracionPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
