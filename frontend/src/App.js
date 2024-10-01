import { useState, useEffect  } from 'react';
import { BrowserRouter, Route, Routes, Navigate, useNavigate  } from 'react-router-dom';
import Footer from './components/Footer';
import Login from './components/Login.js';
import Header from './components/Header.js';
import MainContent from './components/MainContent.js';
import CompCreateUsuario from './components/CreateUsuario.js';
import CompEditUsuario from './components/EditUsuario.js';
import CompShowUsuario from './components/ShowUsuario.js';
import PrivateRoute from './components/privateroute.js'; 

import HeaderInicio from './inicio/HeaderInicio.js';
import FooterInicio from './inicio/FooterInicio.js';
import MainContentInicio from './inicio/MainContentInicio.js';
import SobreNosotros from './inicio/SobreNosotros.js';
import Productos from './inicio/Productos.js';
import Contacto from './inicio/Contacto.js';
import './App.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

function LogoutAndRedirect({ onLogout }) {
  const navigate = useNavigate();

  useEffect(() => {
    // Cerrar sesión
    onLogout();
    // Redirigir a /inicio después de cerrar sesión
    navigate('/inicio');
  }, [onLogout, navigate]);

  return null;
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('authToken'));

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setIsAuthenticated(false);
  };

  return (
    <div className="App">
      <BrowserRouter>
        {isAuthenticated && <Header onLogout={handleLogout} />}

        <div className="App-content">
          <Routes>
            <Route path="/inicio" element={
              <>
                <HeaderInicio />
                <MainContentInicio />
                <FooterInicio />
              </>
            } />
            
            <Route path="/nosotros" element={
              <>
                <HeaderInicio />
                <SobreNosotros />
                <FooterInicio />
              </>
            } />
            
            <Route path="/productos" element={
              <>
                <HeaderInicio />
                <Productos />
                <FooterInicio />
              </>
            } />
            
            <Route path="/contacto" element={
              <>
                <HeaderInicio />
                <Contacto />
                <FooterInicio />
              </>
            } />
            
            <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} />} />
            <Route path="/Home" element={isAuthenticated ? <MainContent /> : <Navigate to="/inicio" />} />
            
            {/* Rutas del sistemas*/}
            <Route path="/usuario/gestion-usuarios" element={<PrivateRoute isAuthenticated={isAuthenticated}><CompShowUsuario /></PrivateRoute>} />
            <Route path="/usuario/create" element={<PrivateRoute isAuthenticated={isAuthenticated}><CompCreateUsuario /></PrivateRoute>} />
            <Route path="/usuario/edit/:id" element={<PrivateRoute isAuthenticated={isAuthenticated}><CompEditUsuario /></PrivateRoute>} />
            
            {/* Si la ruta no coincide, cerrar sesión y redirigir a /inicio */}
            <Route path="*" element={<LogoutAndRedirect onLogout={handleLogout} />} />
          </Routes>
        </div>
        
        {/* Muestra el Footer del sistema solo si el usuario está autenticado */}
        {isAuthenticated && <Footer onLogout={handleLogout} />}
      </BrowserRouter>
    </div>
  );
}

export default App;
