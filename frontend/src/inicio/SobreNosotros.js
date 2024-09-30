import './Estilos/SobreNosotros.css';
import propi from './picture/propi.jpg';

function SobreNosotros() {
  return (
    <main className="about-us">
      <section className="about-intro">
        <h2>Sobre Nosotros</h2>
        <p>
          Transportes Eben-Ezer es una empresa dedicada a proporcionar servicios de transporte de carga a nivel nacional e internacional. 
          Nos enorgullece ofrecer soluciones de transporte confiables, eficientes y seguras, con un fuerte enfoque en la satisfacción del cliente.
        </p>
        <img src={propi} alt="Propietarios" className="about-image" />
      </section>

      <section className="our-history">
        <h3>Nuestra Historia</h3>
        <p>
          Fundada en 2005, Transportes Eben-Ezer ha crecido a lo largo de los años, comenzando como una pequeña empresa familiar 
          hasta convertirse en un líder en el sector del transporte. Desde nuestros humildes comienzos, nos hemos comprometido a ofrecer 
          servicios de la más alta calidad, expandiendo nuestra flota y nuestras capacidades para atender a clientes en todo el país y más allá.
        </p>
      </section>

      <section className="our-mission-vision">
        <div className="mission">
          <h3>Nuestra Misión</h3>
          <p>
            Nuestra misión es proporcionar servicios de transporte y logística con eficiencia, puntualidad y seguridad, garantizando que 
            cada carga llegue a su destino en perfecto estado. Nos esforzamos por superar las expectativas de nuestros clientes y 
            contribuir al crecimiento sostenible de sus negocios.
          </p>
        </div>
        <div className="vision">
          <h3>Nuestra Visión</h3>
          <p>
            Ser la empresa líder en transporte de carga en Guatemala, reconocida por nuestra calidad de servicio, innovación tecnológica 
            y compromiso con el desarrollo de soluciones logísticas que impulsen el éxito de nuestros clientes.
          </p>
        </div>
      </section>

      <section className="our-values">
        <h3>Valores que Nos Guían</h3>
        <ul>
          <li><strong>Compromiso:</strong> Nos dedicamos a cumplir con las expectativas de nuestros clientes y superar los desafíos diarios del transporte.</li>
          <li><strong>Integridad:</strong> Operamos con transparencia y honestidad en todas nuestras operaciones, ganándonos la confianza de nuestros socios y clientes.</li>
          <li><strong>Seguridad:</strong> La protección de la carga y la seguridad de nuestros conductores es una prioridad en cada envío.</li>
          <li><strong>Innovación:</strong> Utilizamos tecnología avanzada para optimizar nuestras rutas, tiempos de entrega y la eficiencia general de nuestras operaciones.</li>
          <li><strong>Sostenibilidad:</strong> Nos esforzamos por reducir nuestro impacto ambiental, implementando prácticas ecológicas y eficientes.</li>
        </ul>
      </section>
    </main>
  );
}

export default SobreNosotros;
