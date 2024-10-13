import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useDetalles } from '../components/DetallesContext'; // Importar el contexto de detalles

// Ruta para la inserción de la factura
const FACTURA_ROUTE = 'http://localhost:8000/api/factura-proveedor';
// Ruta para la inserción de los detalles de la factura
const DETALLE_FACTURA_ROUTE = 'http://localhost:8000/api/detalle-factura-proveedor';
// Ruta para actualizar el inventario
const INVENTARIO_ROUTE = 'http://localhost:8000/api/inventario';
// Ruta para obtener los materiales
const MATERIAL_ROUTE = 'http://localhost:8000/api/material';
// Ruta para insertar el pago
const PAGO_ROUTE = 'http://localhost:8000/api/pago-proveedor';

const CompResumenMateriales = () => {
  const { detalles, setDetalles } = useDetalles(); // Obtener los detalles del contexto
  const [totalCompra, setTotalCompra] = useState(0);
  const [materiales, setMateriales] = useState({}); // Para almacenar los nombres de los materiales y sus proveedores
  const [proveedores, setProveedores] = useState({}); // Para almacenar los proveedores y sus facturas
  const [tiposPago, setTiposPago] = useState([]); // Almacenar tipos de pago
  const [tipoPagoSeleccionado, setTipoPagoSeleccionado] = useState(''); // Estado para el tipo de pago seleccionado
  const navigate = useNavigate();

  // Función para obtener la fecha local en formato yyyy-mm-dd
  const getLocalDate = () => {
    const date = new Date();
    date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
    return date.toISOString().slice(0, 10);
  };

  // Calcular el total de la compra sumando todos los totales de los detalles
  useEffect(() => {
    const total = Object.values(detalles).reduce((acc, detalle) => acc + detalle.total, 0);
    setTotalCompra(total);
  }, [detalles]);

  // Obtener información de los materiales, incluyendo el ID del proveedor desde la tabla de materiales
  useEffect(() => {
    const fetchMaterialInfo = async () => {
      try {
        const materialIds = Array.from(new Set(Object.values(detalles).map(detalle => detalle.inventarioId)));
        const promises = materialIds.map(id => axios.get(`${MATERIAL_ROUTE}/${id}`));
        const responses = await Promise.all(promises);
        const materialInfo = responses.reduce((acc, response) => {
          acc[response.data.id] = {
            nombre: response.data.nombre,
            proveedorId: response.data.proveedor_id, // Obtener ID del proveedor desde la tabla de material
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
        setTiposPago(response.data); // Almacenar los tipos de pago
      } catch (error) {
        console.error('Error fetching tipos de pago:', error);
      }
    };

    fetchTiposPago();
  }, []);

  // Manejar la cancelación de la compra
  const handleCancel = () => {
    setDetalles({}); // Limpiar los detalles
    navigate('/compra/gestion-compras/catalogo'); // Regresar al catálogo
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
          fecha: getLocalDate(), // Usar fecha local
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
            cantidad: cantidadActual + detalle.cantidad, // Sumar la cantidad nueva a la existente
            fecha_ingreso: getLocalDate(), // Actualizar la fecha de ingreso
          });
        });

        await Promise.all(detallesPromises);

        // Insertar el pago
        await axios.post(PAGO_ROUTE, {
          fecha: getLocalDate(), // Usar fecha local
          monto: totalProveedor,
          tipo_pago_id: tipoPagoSeleccionado, // Relacionar con el ID del tipo de pago seleccionado
          factura_proveedor_id: facturaId, // Relacionar con el ID de la factura
        });
      });

      await Promise.all(facturasPromises);

      // Redirigir al componente de éxito
      setDetalles({}); // Limpiar los detalles después de la compra
      navigate(`/compra/gestion-compras/exito`);
    } catch (error) {
      console.error('Error al procesar la compra:', error);
    }
  };

  return (
    <div>
      <h1>Resumen de la Compra</h1>
      <div>
        {Object.keys(proveedores).map(proveedorId => (
          <div key={proveedorId}>
            <h2>Proveedor: {proveedorId}</h2>
            {proveedores[proveedorId].map(detalle => (
              <div key={detalle.inventarioId}>
                <p>Material: {materiales[detalle.inventarioId]?.nombre || 'Cargando...'}</p> {/* Mostrar el nombre del material */}
                <p>Cantidad: {detalle.cantidad}</p>
                <p>Subtotal: {detalle.subtotal}</p>
                <p>Descuento: {detalle.descuento}</p>
                <p>Total: {detalle.total}</p>
                <hr />
              </div>
            ))}
          </div>
        ))}
        <h2>Total de la Compra: {totalCompra}</h2>
      </div>

      {/* Menú desplegable de tipos de pago */}
      <label>
        Tipo de Pago:
        <select
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
      </label>

      <button onClick={handleAccept}>Aceptar Compra</button>
      <button onClick={handleCancel}>Cancelar Compra</button>
    </div>
  );
};

export default CompResumenMateriales;
