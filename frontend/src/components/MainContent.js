import { Link } from 'react-router-dom';
import usuario2 from './pictures/user.png';
import ventas from './pictures/sales.png';
import cliente from './pictures/clients.png';
import FactClient from './pictures/billingcustomers.png';
import personal from './pictures/staff.png';
import camion from './pictures/truck.png';
import ruta from './pictures/route.png';
import carga from './pictures/loadings.png';
import asignacion from './pictures/assignments.png';
import compra from './pictures/buys.png';
import proveedores from './pictures/suppliers.png';
import FactProv from './pictures/supplierbilling.png';
import materiales from './pictures/materials.png';
import inventario from './pictures/inventory.png';
import './Styles/MainContent.css';

function MainContent() {
  return (
    <main className="App-main">
      <h2 className="text-primary text-center mb-4" style={{ fontWeight: 'bold', fontSize: '2.5rem' }}>
        Bienvenido a la plataforma
      </h2>
      <p className="text-center mb-4" style={{ fontSize: '1.2rem', color: '#555' }}>
        Aquí encontrarás todos los módulos disponibles.
      </p>

      <div className="module-buttons">
        <div className="module-card">
          <Link to="/usuario/gestion-usuarios" className="btn-module">
            <img src={usuario2} alt="Gestión de Usuarios" />
            <h3>Gestión de Usuarios</h3>
          </Link>
        </div>
        <div className="module-card">
          <Link to="/ventas/gestion-ventas/catalogo" className="btn-module">
            <img src={ventas} alt="Gestión de Ventas" />
            <h3>Gestión de Ventas</h3>
          </Link>
        </div>
        <div className="module-card">
          <Link to="/cliente/gestion-clientes" className="btn-module">
            <img src={cliente} alt="Gestión de Clientes" />
            <h3>Gestión de Clientes</h3>
          </Link>
        </div>
        <div className="module-card">
          <Link to="/factura-cliente/gestion-facturas-clientes" className="btn-module">
            <img src={FactClient} alt="Gestión de Facturas a Clientes" />
            <h3>Gestión de Facturas a Clientes</h3>
          </Link>
        </div>
        <div className="module-card">
          <Link to="/conductor/gestion-conductores" className="btn-module">
            <img src={personal} alt="Gestión de Personal" />
            <h3>Gestión de Conductores</h3>
          </Link>
        </div>
        <div className="module-card">
          <Link to="/vehiculo/gestion-vehiculos" className="btn-module">
            <img src={camion} alt="Gestión de Vehículos" />
            <h3>Gestión de Vehículos</h3>
          </Link>
        </div>
        <div className="module-card">
          <Link to="/ruta/gestion-rutas" className="btn-module">
            <img src={ruta} alt="Gestión de Rutas" />
            <h3>Gestión de Rutas</h3>
          </Link>
        </div>
        <div className="module-card">
          <Link to="/carga/gestion-cargas" className="btn-module">
            <img src={carga} alt="Gestión de Cargas" />
            <h3>Gestión de Cargas</h3>
          </Link>
        </div>
        <div className="module-card">
          <Link to="/asignacion/gestion-asignaciones" className="btn-module">
            <img src={asignacion} alt="Gestión de Asignaciones" />
            <h3>Gestión de Asignaciones</h3>
          </Link>
        </div>
        <div className="module-card">
          <Link to="/compra/gestion-compras/catalogo" className="btn-module">
            <img src={compra} alt="Gestión de Compras" />
            <h3>Gestión de Compras</h3>
          </Link>
        </div>
        <div className="module-card">
          <Link to="/proveedor/gestion-proveedores" className="btn-module">
            <img src={proveedores} alt="Gestión de Proveedores" />
            <h3>Gestión de Proveedores</h3>
          </Link>
        </div>
        <div className="module-card">
          <Link to="/factura-proveedor/gestion-facturas-proveedores" className="btn-module">
            <img src={FactProv} alt="Gestión de Facturas de Proveedores" />
            <h3>Gestión de Facturas de Proveedores</h3>
          </Link>
        </div>
        <div className="module-card">
          <Link to="/inventario/gestion-inventarios" className="btn-module">
            <img src={inventario} alt="Gestión de Inventario" />
            <h3>Gestión de Inventario</h3>
          </Link>
        </div>
        <div className="module-card">
          <Link to="/material/gestion-materiales" className="btn-module">
            <img src={materiales} alt="Gestión de Materiales" />
            <h3>Gestión de Materiales</h3>
          </Link>
        </div>
      </div>
    </main>
  );
}

export default MainContent;