import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Ruta para obtener las facturas
const FACTURA_ROUTE = 'http://localhost:8000/api/facturas-proveedor';
// Ruta para obtener los métodos de pago
const METODO_PAGO_ROUTE = 'http://localhost:8000/api/tipo-pago-proveedor';

const CompPagoMateriales = () => {
  const [facturas, setFacturas] = useState([]); // Almacenar las facturas
  const [pago, setPago] = useState({}); // Almacenar el pago
  const [tiposPago, setTiposPago] = useState([]); // Almacenar los métodos de pago
  const navigate = useNavigate();

  // Obtener las facturas
  useEffect(() => {
    const fetchFacturas = async () => {
      try {
        const response = await axios.get(FACTURA_ROUTE);
        setFacturas(response.data);
      } catch (error) {
        console.error('Error fetching facturas:', error);
      }
    };

    fetchFacturas();
  }, []);

  // Obtener los métodos de pago
  useEffect(() => {
    const fetchTiposPago = async () => {
      try {
        const response = await axios.get(METODO_PAGO_ROUTE);
        setTiposPago(response.data);
      } catch (error) {
        console.error('Error fetching métodos de pago:', error);
      }
    };

    fetchTiposPago();
  }, []);

  // Manejar el pago
  const handlePago = async (facturaId) => {
    try {
      const pagoResponse = await axios.post(`http://localhost:8000/api/pago-proveedor`, {
        fecha: new Date().toISOString().slice(0, 10),
        monto: pago.monto,
        factura_proveedor_id: facturaId,
        tipo_pago_id: pago.tipoPago,
      });
      const pagoId = pagoResponse.data.id; // Obtener el ID del pago recién creado

      // Redirigir al componente de confirmación
      navigate(`/compra/gestion-compras/confirmacion/${pagoId}`);
    } catch (error) {
      console.error('Error al procesar el pago:', error);
    }
  };

  return (
    <div>
      <h1>Pago</h1>
      <div>
        {facturas.map(factura => (
          <div key={factura.id}>
            <h2>Factura {factura.id}</h2>
            <p>Monto: {factura.monto}</p>
            <p>Proveedor: {factura.proveedor_id}</p>
            <form>
              <label>
                Monto:
                <input
                  type="number"
                  value={pago.monto}
                  onChange={(e) => setPago({ ...pago, monto: e.target.value })}
                />
              </label>
              <label>
                Método de pago:
                <select
                  value={pago.tipoPago}
                  onChange={(e) => setPago({ ...pago, tipoPago: e.target.value })}
                >
                  <option value="">Seleccione un método de pago</option>
                  {tiposPago.map(tipoPago => (
                    <option key={tipoPago.id} value={tipoPago.id}>{tipoPago.descripcion}</option>
                  ))}
                </select>
              </label>
              <button onClick={() => handlePago(factura.id)}>Pagar</button>
            </form>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CompPagoMateriales;