import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProductPage from './pages/ProductPage';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<ProductPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;