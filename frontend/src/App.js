import { useState, useEffect  } from 'react';
import { BrowserRouter, Route, Routes, Navigate, useNavigate  } from 'react-router-dom';
import Footer from './components/Footer';
import Login from './components/Login.js';
import Header from './components/Header.js';
import MainContent from './components/MainContent.js';

import HeaderInicio from './inicio/HeaderInicio.js';
import FooterInicio from './inicio/FooterInicio.js';
import MainContentInicio from './inicio/MainContentInicio.js';
import SobreNosotros from './inicio/SobreNosotros.js';
import Productos from './inicio/Productos.js';
import Contacto from './inicio/Contacto.js';
import './App.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

{/*import PrivateRoute from './ebenezer/privateroute';
import CompShowUsuario from './ebenezer/ShowUsuario';
import CompCreateUsuario from './ebenezer/CreateUsuario';
import CompEditUsuario from './ebenezer/EditUsuario';
import CompShowCliente from './ebenezer/ShowCliente';
import CompCreateCliente from './ebenezer/CreateCliente.js';
import CompEditCliente from './ebenezer/EditCliente';*/}

{/*import CompShowProveedor from './ebenezer/ShowProveedor';
import CompCreateProveedor from './ebenezer/CreateProveedor';
import CompEditProveedor from './ebenezer/EditProveedor';
import CompShowMaterial from './ebenezer/ShowMaterial';  
import CompCreateMaterial from './ebenezer/CreateMaterial';
import CompEditMaterial from './ebenezer/EditMaterial';
import CompShowFacturaProveedor from './ebenezer/ShowFacturaProveedor';
import CompCreateFacturaProveedor from './ebenezer/CreateFacturaProveedor';
import CompEditFacturaProveedor from './ebenezer/EditFacturaProveedor';
import CompShowDetalleFacturaProveedor from './ebenezer/ShowDetalleFacturaProveedor';
import CompShowPagoProveedor from './ebenezer/ShowPagoProveedor';
import CompShowColaborador from './ebenezer/ShowColaborador.js';
import CompCreateColaborador from './ebenezer/CreateColaborador.js';
import CompEditColaborador from './ebenezer/EditColaborador.js';
import FlujoCompra from './ebenezer/FlujoCompra';  // Importa el nuevo componente de compras*/}


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
