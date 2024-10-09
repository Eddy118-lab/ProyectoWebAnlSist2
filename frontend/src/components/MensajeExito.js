import React from 'react';
import { useNavigate } from 'react-router-dom';

const CompExito = () => {
  const navigate = useNavigate();

  // Función para regresar al catálogo
  const handleGoToCatalog = () => {
    navigate('/compra/gestion-compras/catalogo');
  };

  return (
    <div className="container">
      <h2>¡Compra realizada con éxito!</h2>
      <p>Su compra ha sido procesada correctamente. Puede ver el detalle de su pago en la sección de "Mis compras".</p>
      
      {/* Botón para regresar al catálogo */}
      <button onClick={handleGoToCatalog}>Volver al Catálogo</button>
    </div>
  );
};

export default CompExito;
