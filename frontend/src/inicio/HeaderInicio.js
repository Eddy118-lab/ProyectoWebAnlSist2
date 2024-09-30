import { Link } from 'react-router-dom';
import './Estilos/HeaderInicio.css';

function HeaderInicio() {
  return (
    <header>
      <nav>
        <ul>
          <li><Link to="/">Inicio</Link></li>
          <li><Link to="/nosotros">Sobre Nosotros</Link></li>
          <li><Link to="/productos">Productos</Link></li>
          <li><Link to="/contacto">Contacto</Link></li>
          <li><Link to="/login">Iniciar Sesión</Link></li>
        </ul>
      </nav>
    </header>
  );
}

export default HeaderInicio;
