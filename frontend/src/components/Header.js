import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import logo from './pictures/logo.png';
import usuario from './pictures/usuario.png';
import './Styles/Header.css'; // Agrega los estilos del Header si los tienes

function Header({ onLogout }) {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [userName, setUserName] = useState(null); // Estado para el nombre del usuario
  const navigate = useNavigate();
  const location = useLocation();
  const userMenuRef = useRef(null);

  useEffect(() => {
    // Obtener el nombre del usuario del localStorage
    const storedUserName = localStorage.getItem('userName');
    if (storedUserName) {
      setUserName(storedUserName); // Actualiza el estado del nombre de usuario
    }
  }, []);

  const isInModule = [
    '/inventario/gestion-inventarios',
    '/ventas',
    '/proveedor/gestion-proveedores',
    '/conductor/gestion-conductores',
    '/vehiculo/gestion-vehiculos',
    '/usuario/gestion-usuarios',
    '/cliente/gestion-clientes',
    '/compra/gestion-compras/catalogo',
    '/material/gestion-materiales',
    '/factura-proveedor/gestion-facturas-proveedores'
  ].includes(location.pathname);

  useEffect(() => {
    if (isInModule) {
      document.body.classList.add('in-module');
    } else {
      document.body.classList.remove('in-module');
    }

    if (!isInModule) {
      setIsNavOpen(false);
    }
  }, [location.pathname, isInModule]);

  const handleNavItemClick = (path) => {
    navigate(path);
    setIsNavOpen(false);
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(prevState => !prevState);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Si está en la ruta de login, oculta el menú de usuario
  const isInLogin = location.pathname === '/login';

  return (
    <header className="App-header">
      <div
        className="logo"
        onMouseEnter={() => setIsNavOpen(true)}
        onMouseLeave={() => setIsNavOpen(false)}
      >
        <img src={logo} alt="Logo" className="App-logo" />
      </div>

      {!isInLogin && (
        <div className="user-menu" ref={userMenuRef}>
          {/* Mostrar el nombre del usuario si está disponible */}
          {userName && <span className="user-name">Hola, {userName}</span>}
          <img
            src={usuario}
            alt="Perfil de Usuario"
            className="profile-icon"
            onClick={toggleUserMenu}
          />
          {isUserMenuOpen && (
            <div className="user-dropdown-menu">
              <button onClick={onLogout} className="user-menu-item">Cerrar Sesión</button>
            </div>
          )}
        </div>
      )}

      <nav
        className={`side-nav ${isNavOpen ? 'open' : ''}`}
        onMouseEnter={() => setIsNavOpen(true)}
        onMouseLeave={() => setIsNavOpen(false)}
      >
        <ul>
          <li onClick={() => handleNavItemClick('/Home')}>Inicio</li>
          <li onClick={() => handleNavItemClick('/inventario/gestion-inventarios')}>Gestión de Inventario</li>
          <li onClick={() => handleNavItemClick('/ventas')}>Gestión de Ventas</li>
          <li onClick={() => handleNavItemClick('/proveedor/gestion-proveedores')}>Gestión de Proveedores</li>
          <li onClick={() => handleNavItemClick('/conductor/gestion-conductores')}>Gestión de Conductores</li>
          <li onClick={() => handleNavItemClick('/vehiculo/gestion-vehiculos')}>Gestión de Vehículos</li>
          <li onClick={() => handleNavItemClick('/usuario/gestion-usuarios')}>Gestión de Usuarios</li>
          <li onClick={() => handleNavItemClick('/cliente/gestion-clientes')}>Gestión de Clientes</li>
          <li onClick={() => handleNavItemClick('/compra/gestion-compras/catalogo')}>Gestión de Compras</li> {/* Nuevo módulo */}
          <li onClick={() => handleNavItemClick('/material/gestion-materiales')}>Gestión de Materiales</li>
          <li onClick={() => handleNavItemClick('/factura-proveedor/gestion-facturas-proveedores')}>Gestión de Facturas de Proveedores</li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;