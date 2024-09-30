import './Estilos/MainContentInicio.css';
import camImage from './picture/cam.jpg';

function MainContentInicio() {
  return (
    <main>
      <section className="hero-section" style={{ backgroundImage: `url(${camImage})` }}>
        <div className="hero-content">
          <h1>Transportes Eben-Ezer</h1>
          <p>
            ¡Bienvenidos! En Transportes Eben-Ezer, somos líderes en servicios de transporte y logística,
            comprometidos con la excelencia, seguridad y puntualidad en cada envío.
          </p>
          <a href="/contacto" className="cta-button">Contáctanos</a>
        </div>
      </section>

      <section className="services-section">
        <h2>Nuestros Servicios</h2>
        <div className="services-grid">
          <div className="service-item">
            <i className="fas fa-truck-moving"></i> {/* Cambiado a camión de carga pesada */}
            <h3>Transporte Nacional</h3>
            <p>
              Ofrecemos transporte de carga a nivel nacional, con rutas estratégicas que aseguran rapidez y eficiencia.
            </p>
          </div>
          <div className="service-item">
            <i className="fas fa-boxes"></i> {/* Ícono representativo de productos */}
            <h3>Productos</h3>
            <p>
              Comercializamos materiales de construcción y suministros, asegurando su distribución eficiente y a tiempo.
            </p>
          </div>
          <div className="service-item">
          <i className="fa-solid fa-truck-fast"></i> {/* Ícono representativo de flota */}
            <h3>Flota</h3>
            <p>
              Disponemos de una amplia flota de vehículos especializados para el transporte de cargas pesadas y voluminosas.
            </p>
          </div>
        </div>
      </section>

      <section className="mission-section">
        <h2>Nuestra Misión</h2>
        <div className="mission-content">
          <p>
            Proveer servicios de transporte y suministro de materiales de construcción con eficiencia, 
            responsabilidad y calidad. Nuestro compromiso es crear un ambiente de trabajo armonioso donde cada 
            colaborador se sienta valorado y motivado para contribuir al éxito de la empresa, ofreciendo a nuestros 
            clientes soluciones confiables que superen sus expectativas.
          </p>
        </div>
      </section>

      <section className="mission-section">
        <h2>Nuestra Visión</h2>
        <div className="mission-content">
          <p>
          Ser la empresa líder en transporte de materiales de construcción en Guatemala, reconocida por
          nuestra puntualidad, calidad de servicio y compromiso con la satisfacción del cliente, expandiendo nuestra
          cobertura y mejorando continuamente nuestras operaciones para adaptarnos a las necesidades del mercado.
          </p>
        </div>
      </section>

      <section className="values-section">
        <h2>Valores que Nos Definen</h2>
        <div className="values-grid">
          <div className="values-item">
            <strong>Responsabilidad:</strong>
            <p>Cumplimos con nuestros compromisos y aseguramos que cada envío llegue a tiempo.</p>
          </div>
          <div className="values-item">
            <strong>Seguridad:</strong>
            <p>Cuidamos cada detalle para garantizar la protección de la carga en todo momento.</p>
          </div>
          <div className="values-item">
            <strong>Innovación:</strong>
            <p>Implementamos tecnología avanzada para optimizar rutas y tiempos de entrega.</p>
          </div>
          <div className="values-item">
            <strong>Calidad:</strong>
            <p>La satisfacción de nuestros clientes es nuestra prioridad número uno.</p>
          </div>
        </div>
      </section>
    </main>
  );
}

export default MainContentInicio;
