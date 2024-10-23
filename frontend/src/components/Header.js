import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import logo from './pictures/logo.png';
import usuario from './pictures/usuario.png';
import 'bootstrap/dist/css/bootstrap.min.css';

function Header({ onLogout }) {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [userName, setUserName] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const userMenuRef = useRef(null);
  const navTimeoutRef = useRef(null);
  const userMenuTimeoutRef = useRef(null);

  useEffect(() => {
    const storedUserName = localStorage.getItem('userName');
    if (storedUserName) {
      setUserName(storedUserName);
    }
  }, []);

  // Define las rutas en las que se debe mostrar el menú
  const allowedRoutes = [
    '/usuario/gestion-usuarios',
    '/ventas/gestion-ventas/catalogo',
    '/cliente/gestion-clientes',
    '/factura-cliente/gestion-facturas-clientes',
    '/conductor/gestion-conductores',
    '/vehiculo/gestion-vehiculos',
    '/ruta/gestion-rutas',
    '/carga/gestion-cargas',
    '/asignacion/gestion-asignaciones',
    '/compra/gestion-compras/catalogo',
    '/proveedor/gestion-proveedores',
    '/factura-proveedor/gestion-facturas-proveedores',
    '/inventario/gestion-inventarios',
    '/material/gestion-materiales',
    '/grafica/muestra-graficas',
  ];

  const isInLogin = location.pathname === '/login';
  const isNavAllowed = allowedRoutes.includes(location.pathname); // Verifica si la ruta está permitida

  const handleMouseEnterNav = () => {
    if (navTimeoutRef.current) {
      clearTimeout(navTimeoutRef.current);
    }
    setIsNavOpen(true);
  };

  const handleMouseLeaveNav = () => {
    navTimeoutRef.current = setTimeout(() => {
      setIsNavOpen(false);
    }, 300);
  };

  const handleMouseEnterUserMenu = () => {
    if (userMenuTimeoutRef.current) {
      clearTimeout(userMenuTimeoutRef.current);
    }
    setIsUserMenuOpen(true);
  };

  const handleMouseLeaveUserMenu = () => {
    userMenuTimeoutRef.current = setTimeout(() => {
      setIsUserMenuOpen(false);
    }, 300);
  };

  return (
    <header className="d-flex justify-content-between align-items-center p-3 bg-primary text-white fixed-top" style={{ height: '80px', backgroundColor: '#8BC34A' }}>
      <div
        className="logo"
        onMouseEnter={handleMouseEnterNav}
        onMouseLeave={handleMouseLeaveNav}
        onClick={() => navigate('/Home')}
        style={{ cursor: 'pointer' }}
      >
        <img src={logo} alt="Logo" className="img-fluid" style={{ height: '70px' }} />
      </div>

      {!isInLogin && (
        <div className="user-menu" ref={userMenuRef} onMouseEnter={handleMouseEnterUserMenu} onMouseLeave={handleMouseLeaveUserMenu}>
          {userName && <span className="me-3">Hola, {userName}</span>}
          <img
            src={usuario}
            alt="Perfil de Usuario"
            className="profile-icon"
            onClick={handleMouseEnterUserMenu} // Mantener el menú abierto al hacer clic
            style={{ height: '30px', cursor: 'pointer' }}
          />
          {isUserMenuOpen && (
            <div className="position-absolute" style={{ top: '80px', right: 0 }}>
              <div className="bg-dark text-white p-2 rounded shadow">
                <button onClick={onLogout} className="btn btn-link text-white">Cerrar Sesión</button>
              </div>
            </div>
          )}
        </div>
      )}

      {isNavAllowed && isNavOpen && ( // Muestra el menú solo si la ruta está permitida
        <nav
          className="side-nav position-fixed overflow-auto"
          style={{
            top: '80px',
            left: 0,
            width: '200px',
            backgroundColor: '#333', // Fondo del menú
            zIndex: 1000,
            height: 'calc(100% - 80px)',
            paddingTop: '10px',
            maxHeight: 'calc(100% - 80px)',
            scrollbarWidth: 'none', // Para navegadores Firefox
            msOverflowStyle: 'none', // Para Internet Explorer y Edge
          }}
          onMouseEnter={handleMouseEnterNav}
          onMouseLeave={handleMouseLeaveNav}
        >
          <ul className="list-unstyled p-0 m-0 d-flex flex-column">
            {[
              { path: '/Home', label: 'Inicio' },
              { path: '/usuario/gestion-usuarios', label: 'Gestión de Usuarios' },
              { path: '/ventas/gestion-ventas/catalogo', label: 'Gestión de Ventas' },
              { path: '/cliente/gestion-clientes', label: 'Gestión de Clientes' },
              { path: '/factura-cliente/gestion-facturas-clientes', label: 'Gestión de Facturas a Clientes' },
              { path: '/conductor/gestion-conductores', label: 'Gestión de Conductores' },
              { path: '/vehiculo/gestion-vehiculos', label: 'Gestión de Vehículos' },
              { path: '/ruta/gestion-rutas', label: 'Gestión de Rutas' },
              { path: '/carga/gestion-cargas', label: 'Gestión de Cargas' },
              { path: '/asignacion/gestion-asignaciones', label: 'Gestión de Asignaciones' },
              { path: '/compra/gestion-compras/catalogo', label: 'Gestión de Compras' },
              { path: '/proveedor/gestion-proveedores', label: 'Gestión de Proveedores' },
              { path: '/factura-proveedor/gestion-facturas-proveedores', label: 'Gestión de Facturas de Proveedores' },
              { path: '/inventario/gestion-inventarios', label: 'Gestión de Inventario' },
              { path: '/material/gestion-materiales', label: 'Gestión de Materiales' },
              { path: '/grafica/muestra-graficas', label: 'Mustra de Graficas' }
            ].map(({ path, label }) => (
              <li
                key={path}
                className="text-white p-2 fw-bold"
                style={{ cursor: 'pointer', textDecoration: 'none' }}
                onClick={() => { navigate(path); setIsNavOpen(false); }}
                onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'}
                onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}
              >
                {label}
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}

export default Header;
