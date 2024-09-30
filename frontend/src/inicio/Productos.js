import './Estilos/Producto.css';

function Productos() {
    return (
      <main className="productos-container">
        <h2>Nuestros Productos y Servicios</h2>
        <p>
          En Transportes Eben-Ezer, ofrecemos una amplia variedad de servicios de transporte diseñados para satisfacer las diversas necesidades de nuestros clientes. Nuestro compromiso es proporcionar soluciones de transporte eficientes y seguras. A continuación, se detallan nuestros servicios principales:
        </p>
        
        <section className="services-list">
          <h3>Servicios Destacados</h3>
          <ul>
            <li>
              <strong>Transporte de Carga General:</strong> Nos encargamos del transporte de cargas de todo tipo, asegurando una entrega puntual y segura.
            </li>
            <li>
              <strong>Logística para Cargas Grandes:</strong> Especializados en manejar cargas voluminosas, ofrecemos soluciones personalizadas para cada cliente.
            </li>
            <li>
              <strong>Transporte de Materiales Peligrosos:</strong> Contamos con vehículos y personal capacitado para el manejo seguro de materiales peligrosos, cumpliendo con todas las regulaciones necesarias.
            </li>
            <li>
              <strong>Servicios de Almacenamiento:</strong> Ofrecemos servicios de almacenamiento seguro y controlado para su mercancía, asegurando que esté protegida y accesible.
            </li>
            <li>
              <strong>Transporte Internacional:</strong> Facilitamos el transporte de mercancías a nivel internacional, gestionando todas las aduanas y logística necesaria.
            </li>
          </ul>
        </section>

        <section className="why-choose-us">
          <h3>¿Por Qué Elegirnos?</h3>
          <p>
            Elegir Transportes Eben-Ezer significa optar por un servicio de calidad y confianza. Nuestros años de experiencia en la industria nos han permitido construir relaciones sólidas con nuestros clientes y desarrollar una sólida reputación por nuestra atención al detalle y compromiso con la seguridad.
          </p>
        </section>
      </main>
    );
}

export default Productos;
