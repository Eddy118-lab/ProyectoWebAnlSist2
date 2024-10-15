import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useDetalles } from '../components/DetallesContext'; // Importar el contexto de detalles

// Rutas para las API
const FACTURA_ROUTE = 'http://localhost:8000/api/factura-proveedor';
const DETALLE_FACTURA_ROUTE = 'http://localhost:8000/api/detalle-factura-proveedor';
const INVENTARIO_ROUTE = 'http://localhost:8000/api/inventario';
const MATERIAL_ROUTE = 'http://localhost:8000/api/material';
const PAGO_ROUTE = 'http://localhost:8000/api/pago-proveedor';

const CompResumenMateriales = () => {
  const { detalles, setDetalles } = useDetalles(); // Obtener los detalles del contexto
  const [totalCompra, setTotalCompra] = useState(0);
  const [materiales, setMateriales] = useState({});
  const [proveedores, setProveedores] = useState({});
  const [tiposPago, setTiposPago] = useState([]);
  const [tipoPagoSeleccionado, setTipoPagoSeleccionado] = useState('');
  const navigate = useNavigate();

  // Función para obtener la fecha local en formato yyyy-mm-dd
  const getLocalDate = () => {
    const date = new Date();
    date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
    return date.toISOString().slice(0, 10);
  };

  // Calcular el total de la compra
  useEffect(() => {
    const total = Object.values(detalles).reduce((acc, detalle) => acc + detalle.total, 0);
    setTotalCompra(total);
  }, [detalles]);

  // Obtener información de los materiales
  useEffect(() => {
    const fetchMaterialInfo = async () => {
      try {
        const materialIds = Array.from(new Set(Object.values(detalles).map(detalle => detalle.inventarioId)));
        const promises = materialIds.map(id => axios.get(`${MATERIAL_ROUTE}/${id}`));
        const responses = await Promise.all(promises);
        const materialInfo = responses.reduce((acc, response) => {
          acc[response.data.id] = {
            nombre: response.data.nombre,
            proveedorId: response.data.proveedor_id,
          };
          return acc;
        }, {});
        setMateriales(materialInfo);
      } catch (error) {
        console.error('Error fetching material info:', error);
      }
    };

    fetchMaterialInfo();
  }, [detalles]);

  // Agrupar los detalles por proveedor
  useEffect(() => {
    const detallesPorProveedor = {};
    Object.values(detalles).forEach(detalle => {
      const proveedorId = materiales[detalle.inventarioId]?.proveedorId;
      if (!detallesPorProveedor[proveedorId]) {
        detallesPorProveedor[proveedorId] = [];
      }
      detallesPorProveedor[proveedorId].push(detalle);
    });
    setProveedores(detallesPorProveedor);
  }, [detalles, materiales]);

  // Obtener los tipos de pago
  useEffect(() => {
    const fetchTiposPago = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/tipo-pago-proveedor');
        setTiposPago(response.data);
      } catch (error) {
        console.error('Error fetching tipos de pago:', error);
      }
    };

    fetchTiposPago();
  }, []);

  // Manejar la cancelación de la compra
  const handleCancel = () => {
    setDetalles({});
    navigate('/compra/gestion-compras/catalogo');
  };

  // Manejar la aceptación de la compra
  const handleAccept = async () => {
    try {
      if (!tipoPagoSeleccionado) {
        alert('Debe seleccionar un tipo de pago.');
        return;
      }

      // Crear facturas para cada proveedor
      const facturasPromises = Object.keys(proveedores).map(async proveedorId => {
        const detallesProveedor = proveedores[proveedorId];
        const totalProveedor = detallesProveedor.reduce((acc, detalle) => acc + detalle.total, 0);
        const facturaResponse = await axios.post(FACTURA_ROUTE, {
          fecha: getLocalDate(),
          monto: totalProveedor,
          proveedor_id: proveedorId,
        });
        const facturaId = facturaResponse.data.id;

        // Insertar los detalles asociados a la factura
        const detallesPromises = detallesProveedor.map(async detalle => {
          await axios.post(DETALLE_FACTURA_ROUTE, {
            cantidad: detalle.cantidad,
            precio_unitario: detalle.precioUnitario,
            subtotal: detalle.subtotal,
            descuento: detalle.descuento,
            total: detalle.total,
            factura_proveedor_id: facturaId,
            inventario_id: detalle.inventarioId,
          });

          // Actualizar el inventario
          const inventarioResponse = await axios.get(`${INVENTARIO_ROUTE}/${detalle.inventarioId}`);
          const cantidadActual = inventarioResponse.data.cantidad;

          await axios.put(`${INVENTARIO_ROUTE}/${detalle.inventarioId}`, {
            cantidad: cantidadActual + detalle.cantidad,
            fecha_ingreso: getLocalDate(),
          });
        });

        await Promise.all(detallesPromises);

        // Insertar el pago
        await axios.post(PAGO_ROUTE, {
          fecha: getLocalDate(),
          monto: totalProveedor,
          tipo_pago_id: tipoPagoSeleccionado,
          factura_proveedor_id: facturaId,
        });
      });

      await Promise.all(facturasPromises);

      // Redirigir al componente de éxito
      setDetalles({});
      navigate(`/compra/gestion-compras/exito`);
    } catch (error) {
      console.error('Error al procesar la compra:', error);
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center display-6" style={{ marginTop: '90px', color: '#343a40', fontWeight: 'bold', paddingBottom: '10px' }}>Resumen de la Compra</h1>
      <div className="row">
        {Object.keys(proveedores).map(proveedorId => (
          <div key={proveedorId} className="col-md-6 mb-4">
            <div className="card shadow-sm border-primary">
              <div className="card-body">
                <h2 className="h5 text-primary">Proveedor: {proveedorId}</h2>
                {proveedores[proveedorId].map(detalle => (
                  <div key={detalle.inventarioId} className="border p-3 rounded mb-2 bg-light">
                    <p><strong>Material:</strong> {materiales[detalle.inventarioId]?.nombre || 'Cargando...'}</p>
                    <p><strong>Cantidad:</strong> {detalle.cantidad}</p>
                    <p><strong>Subtotal:</strong> Q.{detalle.subtotal.toFixed(2)}</p>
                    <p><strong>Descuento:</strong> Q.{detalle.descuento.toFixed(2)}</p>
                    <p><strong>Total:</strong> <span className="text-success">Q.{detalle.total.toFixed(2)}</span></p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
      <h2 className="h5 text-primary">Total de la Compra: <span className="text-success">Q.{totalCompra.toFixed(2)}</span></h2>
      
      {/* Menú desplegable de tipos de pago */}
      <div className="mb-4">
        <label htmlFor="tipoPago" className="form-label">Tipo de Pago:</label>
        <select
          id="tipoPago"
          className="form-select"
          value={tipoPagoSeleccionado}
          onChange={(e) => setTipoPagoSeleccionado(e.target.value)}
          required
        >
          <option value="">Seleccione un método de pago</option>
          {tiposPago.map((tipoPago) => (
            <option key={tipoPago.id} value={tipoPago.id}>
              {tipoPago.descripcion}
            </option>
          ))}
        </select>
      </div>

      <div className="text-center">
        <button className="btn btn-success mx-2" onClick={handleAccept}>Aceptar Compra</button>
        <button className="btn btn-secondary mx-2" onClick={handleCancel}>Cancelar Compra</button>
      </div>
    </div>
  );
};

export default CompResumenMateriales;
