import React from 'react';
import { useNavigate } from 'react-router-dom';

const CompExitoVentas = () => {
  const navigate = useNavigate();

  // Función para regresar al catálogo
  const handleGoToCatalog = () => {
    navigate('/ventas/gestion-ventas/catalogo');
  };

  return (
    <div className="container mt-5 text-center">
      <h2 className='text-center display-6' style={{ marginTop: '22%', color: '#343a40', fontWeight: 'bold', paddingBottom: '10px' }}>¡Compra realizada con éxito!</h2>
      <p>La venta se ha sido procesada correctamente. Puede ver el detalle de su pago en la sección de "Mis ventas".</p>
      <div className="my-4">
        <button 
          onClick={handleGoToCatalog} 
          className="btn btn-success btn-lg"
        >
          Volver al Catálogo
        </button>
      </div>
    </div>
  );
};

export default CompExitoVentas;
