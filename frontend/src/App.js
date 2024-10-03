import { useState, useEffect  } from 'react';
import { BrowserRouter, Route, Routes, Navigate, useNavigate, useLocation   } from 'react-router-dom';
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
import CompCreateProveedor from './components/CreateProveedor.js';
import CompEditProveedor from './components/EditProveedor.js';
import CompShowProveedor  from './components/ShowProveedor.js';
import CompCreateTipoProveedor from './components/CreateTipoProveedor.js';
import CompEditTipoProveedor from './components/EditTipoProveedor.js';
import CompShowTipoProveedor  from './components/ShowTipoProveedor.js';
import PrivateRoute from './components/privateroute.js'; 

import HeaderInicio from './inicio/HeaderInicio.js';
import FooterInicio from './inicio/FooterInicio.js';
import MainContentInicio from './inicio/MainContentInicio.js';
import SobreNosotros from './inicio/SobreNosotros.js';
import Productos from './inicio/Productos.js';
import Contacto from './inicio/Contacto.js';
import './App.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('authToken'));

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setIsAuthenticated(false);
    localStorage.removeItem('lastValidRoute'); // Borra la última ruta si cierra sesión
  };

  const RedirectToLastValidRoute = () => {
    const navigate = useNavigate();  // Mover dentro del BrowserRouter
    const lastValidRoute = localStorage.getItem('lastValidRoute') || '/Home';
    useEffect(() => {
      navigate(lastValidRoute);
    }, [navigate, lastValidRoute]);
    return null;
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

          {/* Rutas del sistema */}
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
          <Route path="/proveedor/gestion-proveedores" element={<PrivateRoute isAuthenticated={isAuthenticated}><CompShowProveedor /></PrivateRoute>} />
          <Route path="/proveedor/create" element={<PrivateRoute isAuthenticated={isAuthenticated}><CompCreateProveedor /></PrivateRoute>} />
          <Route path="/proveedor/edit/:id" element={<PrivateRoute isAuthenticated={isAuthenticated}><CompEditProveedor /></PrivateRoute>} />
          <Route path="/proveedor/tipo-proveedor/gestion-tipos-proveedores" element={<PrivateRoute isAuthenticated={isAuthenticated}><CompShowTipoProveedor /></PrivateRoute>} />
          <Route path="/proveedor/tipo-proveedor/create" element={<PrivateRoute isAuthenticated={isAuthenticated}><CompCreateTipoProveedor /></PrivateRoute>} />
          <Route path="/proveedor/tipo-proveedor/edit/:id" element={<PrivateRoute isAuthenticated={isAuthenticated}><CompEditTipoProveedor /></PrivateRoute>} />

          {/* Si la ruta no coincide, redirige a la última ruta válida */}
          <Route path="*" element={<RedirectToLastValidRoute />} />
        </Routes>
        </div>
        {isAuthenticated && <Footer onLogout={handleLogout} />}
      </BrowserRouter>
    </div>
  );
}

export default App;
