import './Estilos/contacto.css';

function Contacto() {
  return (
    <main>
      <h2>Contacto</h2>
      <p>¿Tienes preguntas? Contáctanos a través de nuestro correo electrónico: atencioncliente@eben-ezer.com o llámanos al (+502) 5604 9424.</p>
      
      <div className="contact-box">
        <h3>Datos Personales</h3>
        <form>
          <label>
            Nombre:
            <input type="text" name="nombre" placeholder="Ingresa tu nombre" required />
          </label>
          <label>
            Correo electrónico:
            <input type="email" name="email" placeholder="Ingresa tu correo" required />
          </label>
          <label>
            Teléfono:
            <input type="tel" name="telefono" placeholder="Ingresa tu teléfono" required />
          </label>
          <label>
            Mensaje:
            <textarea name="mensaje" placeholder="Escribe tu mensaje aquí..." required rows="4"></textarea>
          </label>
          <button type="submit">Enviar</button>
        </form>
      </div>
    </main>
  );
}

export default Contacto;
