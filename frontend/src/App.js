import { useState, useEffect  } from 'react';
import { BrowserRouter, Route, Routes, Navigate, useNavigate  } from 'react-router-dom';
import Footer from './components/Footer';
import Login from './components/Login.js';
import Header from './components/Header.js';
import MainContent from './components/MainContent.js';
import CompCreateUsuario from './components/CreateUsuario.js';
import CompEditUsuario from './components/EditUsuario.js';
import CompShowUsuario from './components/ShowUsuario.js';
import CompCreateCliente from './components/CreateCliente.js';
import CompEditCliente  from './components/EditCliente.js';
import CompShowCliente  from './components/ShowCliente.js';
import CompCreateTipoCliente from './components/CreateTipoCliente.js';
import CompEditTipoCliente from './components/EditTipoCliente.js';
import CompShowTipoCliente from './components/ShowTipoCliente.js';
import CompCreateConductor  from './components/CreateConductor.js';
import CompEditConductor  from './components/EditConductor.js';
import CompShowConductor  from './components/ShowConductor.js';
import PrivateRoute from './components/privateroute.js'; 

import HeaderInicio from './inicio/HeaderInicio.js';
import FooterInicio from './inicio/FooterInicio.js';
import MainContentInicio from './inicio/MainContentInicio.js';
import SobreNosotros from './inicio/SobreNosotros.js';
import Productos from './inicio/Productos.js';
import Contacto from './inicio/Contacto.js';
import './App.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
/*import CompCreateConductor from './components';
import CompEditConductor  from './components';*/

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
            <Route path="/cliente/gestion-clientes" element={<PrivateRoute isAuthenticated={isAuthenticated}><CompShowCliente /></PrivateRoute>} />
            <Route path="/cliente/create" element={<PrivateRoute isAuthenticated={isAuthenticated}><CompCreateCliente /></PrivateRoute>} />
            <Route path="/cliente/edit/:id" element={<PrivateRoute isAuthenticated={isAuthenticated}><CompEditCliente /></PrivateRoute>} />
            <Route path="/cliente/tipo-cliente/gestion-tipos-clientes" element={<PrivateRoute isAuthenticated={isAuthenticated}><CompShowTipoCliente /></PrivateRoute>} />
            <Route path="/cliente/tipo-cliente/create" element={<PrivateRoute isAuthenticated={isAuthenticated}><CompCreateTipoCliente /></PrivateRoute>} />
            <Route path="/cliente/tipo-cliente/edit/:id" element={<PrivateRoute isAuthenticated={isAuthenticated}><CompEditTipoCliente /></PrivateRoute>} />
            <Route path="/conductor/gestion-conductores" element={<PrivateRoute isAuthenticated={isAuthenticated}><CompShowConductor /></PrivateRoute>} />
            <Route path="/conductor/create" element={<PrivateRoute isAuthenticated={isAuthenticated}><CompCreateConductor /></PrivateRoute>} />
            <Route path="/conductor/edit/:id" element={<PrivateRoute isAuthenticated={isAuthenticated}><CompEditConductor /></PrivateRoute>} />

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
