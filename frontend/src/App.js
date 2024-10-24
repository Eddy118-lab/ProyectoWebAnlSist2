import { useState, useEffect } from 'react';
import { BrowserRouter, Route, Routes, Navigate, useNavigate, useLocation } from 'react-router-dom';
import PrivateRoute from './components/privateroute.js';
import Footer from './components/Footer';
import Login from './components/Login.js';
import Header from './components/Header.js';
import MainContent from './components/MainContent.js';
import CompCreateUsuario from './components/CreateUsuario.js';
import CompEditUsuario from './components/EditUsuario.js';
import CompShowUsuario from './components/ShowUsuario.js';
import CompCreateCliente from './components/CreateCliente.js';
import CompEditCliente from './components/EditCliente.js';
import CompShowCliente from './components/ShowCliente.js';
import CompCreateTipoCliente from './components/CreateTipoCliente.js';
import CompEditTipoCliente from './components/EditTipoCliente.js';
import CompShowTipoCliente from './components/ShowTipoCliente.js';
import CompCreateConductor from './components/CreateConductor.js';
import CompEditConductor from './components/EditConductor.js';
import CompShowConductor from './components/ShowConductor.js';
import CompCreateProveedor from './components/CreateProveedor.js';
import CompEditProveedor from './components/EditProveedor.js';
import CompShowProveedor from './components/ShowProveedor.js';
import CompCreateTipoProveedor from './components/CreateTipoProveedor.js';
import CompEditTipoProveedor from './components/EditTipoProveedor.js';
import CompShowTipoProveedor from './components/ShowTipoProveedor.js';
import CompCreateMaterial from './components/CreateMaterial.js';
import CompEditMaterial from './components/EditMaterial.js';
import CompShowMaterial from './components/ShowMaterial.js';
import CompCreateDimension from './components/CreateDimension.js';
import CompEditDimension from './components/EditDimension.js';
import CompShowDimension from './components/ShowDimension.js';
import CompCreatePeso from './components/CreatePeso.js';
import CompEditPeso from './components/EditPeso.js';
import CompShowPeso from './components/ShowPeso.js';
import CompCreateTipoMaterial from './components/CreateTipoMaterial.js';
import CompEditTipoMaterial from './components/EditTipoMaterial.js';
import CompShowTipoMaterial from './components/ShowTipoMaterial.js';
import CompCreateInventario from './components/CreateInventario.js';
import CompShowInventario from './components/ShowInventario.js';
import CompShowFacturaProveedor from './components/ShowFacturaProveedor.js';
import CompShowDetallFactProveedor from './components/ShowDetallFactProveedor.js';
import CompShowPagoProveedor from './components/ShowPagoProveedor.js';
import CompCreateTipoPagoProveedor from './components/CreateTipoPagoProveedor.js';
import CompShowTipoPagoProveedor from './components/ShowTipoPagoProveedor.js';
import CompEditTipoPagoProveedor from './components/EditTipoPagoProveedor.js';
import CompListaMateriales from './components/ListaMateriales.js';
import CompDetalleMateriales from './components/DetalleMateriales.js';
import { DetallesProvider } from './components/DetallesContext';
import CompResumenMateriales from './components/ResumenMateriales.js';
import CompExito from './components/MensajeExito.js';
import CompCreateVehiculo from './components/CreateVehiculo.js';
import CompEditVehiculo from './components/EditVehiculo.js';
import CompShowVehiculo from './components/ShowVehiculo.js';
import CompCreateCombustible from './components/CreateCombustible.js';
import CompEditCombustible from './components/EditCombustible.js';
import CompShowCombustible from './components/ShowCombustible.js';
import CompCreateReparacion from './components/CreateReparacion.js';
import CompEditReparacion from './components/EditReparacion.js';
import CompShowReparacion from './components/ShowReparacion.js';
import CompCreateRuta from './components/CreateRuta.js';
import CompEditRuta from './components/EditRuta.js';
import CompShowRuta from './components/ShowRuta.js';
import CompCreateAsignacion from './components/CreateAsignacion.js';
import CompShowAsignacion from './components/ShowAsignacion.js';
import CompShowTipoEstado from './components/ShowTipoEstado.js';
import CompCreateTipoEstado from './components/CreateTipoEstado.js';
import CompEditTipoEstado from './components/EditTipoEstado.js';
import CompShowCarga from './components/ShowCarga.js';
import CompCreateCarga from './components/CreateCarga.js';
import CompShowFacturaCliente from './components/ShowFacturaCliente.js';
import CompShowDetallFactCliente from './components/ShowDetallFactCliente.js';
import CompShowPagoCliente from './components/ShowPagoCliente.js';
import CompShowTipoPagoCliente from './components/ShowTipoPagoCliente.js';
import CompEditTipoPagoCliente from './components/EditTipoPagoCliente.js';
import CompCreateTipoPagoCliente from './components/CreateTipoPagoCliente.js';
import CompListaCargas from './components/ListaCargas.js';
import CompDetalleCargasFacturacion from './components/DetalleCargas.js';
import { FacturaProvider } from './components/FacturaContext';
import { SeleccionProvider } from './components/SelectContext';
import CompResumenCargasFacturacion from './components/ResumenCargas.js';
import CompMuestraGraficas from './components/ShowGraficas.js';
import CompExitoVentas from './components/MensajeExitoVent.js';
import HeaderInicio from './inicio/HeaderInicio.js';
import FooterInicio from './inicio/FooterInicio.js';
import MainContentInicio from './inicio/MainContentInicio.js';
import SobreNosotros from './inicio/SobreNosotros.js';
import Productos from './inicio/Productos.js';
import Contacto from './inicio/Contacto.js';
import './App.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

function SaveLastValidRoute() {
  const location = useLocation();
  useEffect(() => {
    localStorage.setItem('lastValidRoute', location.pathname);
  }, [location]);

  return null;
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true); // Estado de carga

  // Verificación del token cuando la app se carga
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
    setLoading(false); // Ya se ha completado la verificación de autenticación
  }, []);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    localStorage.setItem('authToken', 'your_token_value'); // Guarda el token en localStorage
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setIsAuthenticated(false);
    localStorage.removeItem('lastValidRoute'); // Borra la última ruta si se cierra sesión
  };

  const RedirectToLastValidRoute = () => {
    const navigate = useNavigate();
    const lastValidRoute = localStorage.getItem('lastValidRoute') || '/inicio'; // Obtener la última ruta válida o /inicio
    const protectedRoutes = [
      "/Home",

      // Rutas de Usuario
      "/usuario/gestion-usuarios",
      "/usuario/create",
      "/usuario/edit/:id",

      // Rutas de Cliente
      "/cliente/gestion-clientes",
      "/cliente/create",
      "/cliente/edit/:id",
      "/cliente/tipo-cliente/gestion-tipos-clientes",
      "/cliente/tipo-cliente/create",
      "/cliente/tipo-cliente/edit/:id",

      // Rutas de Conductor
      "/conductor/gestion-conductores",
      "/conductor/create",
      "/conductor/edit/:id",

      // Rutas de Proveedor
      "/proveedor/gestion-proveedores",
      "/proveedor/create",
      "/proveedor/edit/:id",
      "/proveedor/tipo-proveedor/gestion-tipos-proveedores",
      "/proveedor/tipo-proveedor/create",
      "/proveedor/tipo-proveedor/edit/:id",

      // Rutas de Material
      "/material/gestion-materiales",
      "/material/create",
      "/material/edit/:id",
      "/material/dimension/gestion-dimensiones",
      "/material/dimension/create",
      "/material/dimension/edit/:id",
      "/material/peso/gestion-pesos",
      "/material/peso/create",
      "/material/peso/edit/:id",
      "/material/tipo-material/gestion-tipos-materiales",
      "/material/tipo-material/create",
      "/material/tipo-material/edit/:id",

      // Rutas de Inventario
      "/inventario/gestion-inventarios",
      "/inventario/create",

      // Rutas de Factura Proveedor
      "/factura-proveedor/gestion-facturas-proveedores",
      "/factura-proveedor/detalle-factura-proveedor/:id",
      "/factura-proveedor/pago-proveedor/:id",
      "/factura-proveedor/tipo-pago-proveedor/gestion-tipos-pagos-proveedores",
      "/factura-proveedor/tipo-pago-proveedor/create",
      "/factura-proveedor/tipo-pago-proveedor/edit/:id",

      // Rutas de Compras
      "/compra/gestion-compras/catalogo",
      "/compra/gestion-compras/detalle/:id",
      "/compra/gestion-compras/resumen",
      "/compra/gestion-compras/exito",

      // Rutas de Vehículo
      "/vehiculo/gestion-vehiculos",
      "/vehiculo/create",
      "/vehiculo/edit/:id",
      "/vehiculo/combustible/gestion-combustibles/:id",
      "/vehiculo/combustible/create/:id",
      "/vehiculo/combustible/edit/:id/:id",
      "/vehiculo/reparacion/gestion-reparaciones/:id",
      "/vehiculo/reparacion/create/:id",
      "/vehiculo/reparacion/edit/:id/:id",

      // Rutas de Ruta
      "/ruta/gestion-rutas",
      "/ruta/create",
      "/ruta/edit/:id",

      // Rutas de Asignacion
      "/asignacion/gestion-asignaciones",
      "/asignacion/create",
      "/asignacion/tipo-estado/gestion-tipos-estados",
      "/asignacion/tipo-estado/create",
      "/asignacion/tipo-estado/edit/:id",

      // Rutas de Carga
      "/carga/gestion-cargas",
      "/carga/create",

      // Rutas de Factura Cliente
      "/factura-cliente/gestion-facturas-clientes",
      "/factura-cliente/detalle-factura-cliente/:id",
      "/factura-cliente/pago-cliente/:id",
      "/factura-cliente/tipo-pago-cliente/gestion-tipos-pagos-clientes",
      "/factura-cliente/tipo-pago-cliente/create",
      "/factura-cliente/tipo-pago-cliente/edit/:id",

      // Rutas de Ventas
      "/ventas/gestion-ventas/catalogo",
      "/ventas/gestion-ventas/detalles-ventas",
      "/ventas/gestion-ventas/resumen-ventas",
      "/ventas/gestion-ventas/exito",

      // Rutas de Graficas
      "/grafica/muestra-graficas"
    ];

    useEffect(() => {
      // Verifica si la última ruta válida está dentro de las rutas protegidas
      if (!protectedRoutes.includes(lastValidRoute)) {
        // Si no es una ruta protegida, redirige a inicio
        navigate('/inicio');
      } else {
        // Si es una ruta protegida, redirige a la última ruta válida
        navigate(lastValidRoute);
      }
    }, [navigate, lastValidRoute]);

    return null;
  };


  if (loading) {
    return <div className="loading-message">Cargando...</div>;
  }

  return (
    <div className="App">
      <SeleccionProvider> 
      <FacturaProvider>
      <DetallesProvider>
        <BrowserRouter>
          {isAuthenticated && <Header onLogout={handleLogout} />}
          <div className="App-content">
          <div className="d-flex flex-column min-vh-100"> 
            <SaveLastValidRoute />
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
              <Route path="/material/gestion-materiales" element={<PrivateRoute isAuthenticated={isAuthenticated}><CompShowMaterial /></PrivateRoute>} />
              <Route path="/material/create" element={<PrivateRoute isAuthenticated={isAuthenticated}><CompCreateMaterial /></PrivateRoute>} />
              <Route path="/material/edit/:id" element={<PrivateRoute isAuthenticated={isAuthenticated}><CompEditMaterial /></PrivateRoute>} />
              <Route path="/material/dimension/gestion-dimensiones" element={<PrivateRoute isAuthenticated={isAuthenticated}><CompShowDimension /></PrivateRoute>} />
              <Route path="/material/dimension/create" element={<PrivateRoute isAuthenticated={isAuthenticated}><CompCreateDimension /></PrivateRoute>} />
              <Route path="/material/dimension/edit/:id" element={<PrivateRoute isAuthenticated={isAuthenticated}><CompEditDimension /></PrivateRoute>} />
              <Route path="/material/peso/gestion-pesos" element={<PrivateRoute isAuthenticated={isAuthenticated}><CompShowPeso /></PrivateRoute>} />
              <Route path="/material/peso/create" element={<PrivateRoute isAuthenticated={isAuthenticated}><CompCreatePeso /></PrivateRoute>} />
              <Route path="/material/peso/edit/:id" element={<PrivateRoute isAuthenticated={isAuthenticated}><CompEditPeso /></PrivateRoute>} />
              <Route path="/material/tipo-material/gestion-tipos-materiales" element={<PrivateRoute isAuthenticated={isAuthenticated}><CompShowTipoMaterial /></PrivateRoute>} />
              <Route path="/material/tipo-material/create" element={<PrivateRoute isAuthenticated={isAuthenticated}><CompCreateTipoMaterial /></PrivateRoute>} />
              <Route path="/material/tipo-material/edit/:id" element={<PrivateRoute isAuthenticated={isAuthenticated}><CompEditTipoMaterial /></PrivateRoute>} />
              <Route path="/inventario/gestion-inventarios" element={<PrivateRoute isAuthenticated={isAuthenticated}><CompShowInventario /></PrivateRoute>} />
              <Route path="/inventario/create" element={<PrivateRoute isAuthenticated={isAuthenticated}><CompCreateInventario /></PrivateRoute>} />
              <Route path="/factura-proveedor/gestion-facturas-proveedores" element={<PrivateRoute isAuthenticated={isAuthenticated}><CompShowFacturaProveedor /></PrivateRoute>} />
              <Route path="/factura-proveedor/detalle-factura-proveedor/:id" element={<PrivateRoute isAuthenticated={isAuthenticated}><CompShowDetallFactProveedor /></PrivateRoute>} />
              <Route path="/factura-proveedor/pago-proveedor/:id" element={<PrivateRoute isAuthenticated={isAuthenticated}><CompShowPagoProveedor /></PrivateRoute>} />
              <Route path="/factura-proveedor/tipo-pago-proveedor/gestion-tipos-pagos-proveedores" element={<PrivateRoute isAuthenticated={isAuthenticated}><CompShowTipoPagoProveedor /></PrivateRoute>} />
              <Route path="/factura-proveedor/tipo-pago-proveedor/create" element={<PrivateRoute isAuthenticated={isAuthenticated}><CompCreateTipoPagoProveedor /></PrivateRoute>} />
              <Route path="/factura-proveedor/tipo-pago-proveedor/edit/:id" element={<PrivateRoute isAuthenticated={isAuthenticated}><CompEditTipoPagoProveedor /></PrivateRoute>} />
              <Route path="/compra/gestion-compras/catalogo" element={<PrivateRoute isAuthenticated={isAuthenticated}><CompListaMateriales /></PrivateRoute>} />
              <Route path="/compra/gestion-compras/detalle/:id" element={<PrivateRoute isAuthenticated={isAuthenticated}><CompDetalleMateriales /></PrivateRoute>} />
              <Route path="/compra/gestion-compras/resumen" element={<PrivateRoute isAuthenticated={isAuthenticated}><CompResumenMateriales /></PrivateRoute>} />
              <Route path="/compra/gestion-compras/exito" element={<PrivateRoute isAuthenticated={isAuthenticated}><CompExito /></PrivateRoute>} />
              <Route path="/vehiculo/gestion-vehiculos" element={<PrivateRoute isAuthenticated={isAuthenticated}><CompShowVehiculo /></PrivateRoute>} />
              <Route path="/vehiculo/create" element={<PrivateRoute isAuthenticated={isAuthenticated}><CompCreateVehiculo /></PrivateRoute>} />
              <Route path="/vehiculo/edit/:id" element={<PrivateRoute isAuthenticated={isAuthenticated}><CompEditVehiculo /></PrivateRoute>} />
              <Route path="/vehiculo/combustible/gestion-combustibles/:id" element={<PrivateRoute isAuthenticated={isAuthenticated}><CompShowCombustible /></PrivateRoute>} />
              <Route path="/vehiculo/combustible/create/:id" element={<PrivateRoute isAuthenticated={isAuthenticated}><CompCreateCombustible /></PrivateRoute>} />
              <Route path="/vehiculo/combustible/edit/:id/:id" element={<PrivateRoute isAuthenticated={isAuthenticated}><CompEditCombustible /></PrivateRoute>} />
              <Route path="/vehiculo/reparacion/gestion-reparaciones/:id" element={<PrivateRoute isAuthenticated={isAuthenticated}><CompShowReparacion /></PrivateRoute>} />
              <Route path="/vehiculo/reparacion/create/:id" element={<PrivateRoute isAuthenticated={isAuthenticated}><CompCreateReparacion /></PrivateRoute>} />
              <Route path="/vehiculo/reparacion/edit/:id/:id" element={<PrivateRoute isAuthenticated={isAuthenticated}><CompEditReparacion /></PrivateRoute>} />
              <Route path="/ruta/gestion-rutas" element={<PrivateRoute isAuthenticated={isAuthenticated}><CompShowRuta /></PrivateRoute>} />
              <Route path="/ruta/create" element={<PrivateRoute isAuthenticated={isAuthenticated}><CompCreateRuta /></PrivateRoute>} />
              <Route path="/ruta/edit/:id" element={<PrivateRoute isAuthenticated={isAuthenticated}><CompEditRuta /></PrivateRoute>} />
              <Route path="/asignacion/gestion-asignaciones" element={<PrivateRoute isAuthenticated={isAuthenticated}><CompShowAsignacion /></PrivateRoute>} />
              <Route path="/asignacion/create" element={<PrivateRoute isAuthenticated={isAuthenticated}><CompCreateAsignacion /></PrivateRoute>} />
              <Route path="/asignacion/tipo-estado/gestion-tipos-estados" element={<PrivateRoute isAuthenticated={isAuthenticated}><CompShowTipoEstado /></PrivateRoute>} />
              <Route path="/asignacion/tipo-estado/create" element={<PrivateRoute isAuthenticated={isAuthenticated}><CompCreateTipoEstado /></PrivateRoute>} />
              <Route path="/asignacion/tipo-estado/edit/:id" element={<PrivateRoute isAuthenticated={isAuthenticated}><CompEditTipoEstado /></PrivateRoute>} />
              <Route path="/carga/gestion-cargas" element={<PrivateRoute isAuthenticated={isAuthenticated}><CompShowCarga /></PrivateRoute>} />
              <Route path="/carga/create" element={<PrivateRoute isAuthenticated={isAuthenticated}><CompCreateCarga /></PrivateRoute>} />
              <Route path="/factura-cliente/gestion-facturas-clientes" element={<PrivateRoute isAuthenticated={isAuthenticated}><CompShowFacturaCliente /></PrivateRoute>} />
              <Route path="/factura-cliente/detalle-factura-cliente/:id" element={<PrivateRoute isAuthenticated={isAuthenticated}><CompShowDetallFactCliente /></PrivateRoute>} />
              <Route path="/factura-cliente/pago-cliente/:id" element={<PrivateRoute isAuthenticated={isAuthenticated}><CompShowPagoCliente /></PrivateRoute>} />
              <Route path="/factura-cliente/tipo-pago-cliente/gestion-tipos-pagos-clientes" element={<PrivateRoute isAuthenticated={isAuthenticated}><CompShowTipoPagoCliente /></PrivateRoute>} />
              <Route path="/factura-cliente/tipo-pago-cliente/edit/:id" element={<PrivateRoute isAuthenticated={isAuthenticated}><CompEditTipoPagoCliente /></PrivateRoute>} />
              <Route path="/factura-cliente/tipo-pago-cliente/create" element={<PrivateRoute isAuthenticated={isAuthenticated}><CompCreateTipoPagoCliente /></PrivateRoute>} />
              <Route path="/ventas/gestion-ventas/catalogo" element={<PrivateRoute isAuthenticated={isAuthenticated}><CompListaCargas /></PrivateRoute>} />
              <Route path="/ventas/gestion-ventas/detalles-ventas" element={<PrivateRoute isAuthenticated={isAuthenticated}><CompDetalleCargasFacturacion /></PrivateRoute>} />
              <Route path="/ventas/gestion-ventas/resumen-ventas" element={<PrivateRoute isAuthenticated={isAuthenticated}><CompResumenCargasFacturacion /></PrivateRoute>} />
              <Route path="/ventas/gestion-ventas/exito" element={<PrivateRoute isAuthenticated={isAuthenticated}><CompExitoVentas /></PrivateRoute>} />
              <Route path="/grafica/muestra-graficas" element={<PrivateRoute isAuthenticated={isAuthenticated}><CompMuestraGraficas /></PrivateRoute>} />
              {/* Si la ruta no coincide, redirige a la última ruta válida */}
              <Route path="*" element={<RedirectToLastValidRoute />} />
            </Routes>
          </div>
          {isAuthenticated && <Footer onLogout={handleLogout} />}
          </div>
        </BrowserRouter>
      </DetallesProvider>
      </FacturaProvider>
      </SeleccionProvider>
    </div>
  );
}

export default App;
