import './Estilos/contacto.css';
import React, { useRef } from 'react';
import emailjs from '@emailjs/browser';

function Contacto() {
  const form = useRef();

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs
      .sendForm('service_8v9ewqi', 'template_kxunwqq', form.current, 'kiuDFZDlcbxrFAx2P')
      .then(
        () => {
          console.log('SUCCESS!');
        },
        (error) => {
          console.log('FAILED...', error.text);
        }
      );
  };

  return (
    <main>
      <h2>Contacto</h2>
      <p>
        ¿Tienes preguntas? Contáctanos a través de nuestro correo electrónico:
        transportesebenezer876@gmail.com o llámanos al (+502) 5604 9424.
      </p>

      <div className="contact-box">
        <h3>Datos Personales</h3>
        <form ref={form} onSubmit={sendEmail}>
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
