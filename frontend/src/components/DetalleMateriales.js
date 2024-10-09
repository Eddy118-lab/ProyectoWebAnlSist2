import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useDetalles } from '../components/DetallesContext.js'; // Import the context

// Ruta para obtener el precio unitario del inventario
const INVENTORY_ROUTE = 'http://localhost:8000/api/inventario';
const MATERIAL_ROUTE = 'http://localhost:8000/api/material'; // Ruta para obtener el proveedor del material

const CompDetalleMateriales = () => {
  const { id } = useParams(); // ID del material desde la URL
  const navigate = useNavigate(); // Para la navegación entre componentes
  const { detalles, setDetalles } = useDetalles(); // Access context data

  const [cantidad, setCantidad] = useState(detalles[id]?.cantidad || 0);
  const [precioUnitario, setPrecioUnitario] = useState(detalles[id]?.precioUnitario || 0);
  const [subtotal, setSubtotal] = useState(detalles[id]?.subtotal || 0);
  const [descuento, setDescuento] = useState(detalles[id]?.descuento || 0);
  const [total, setTotal] = useState(detalles[id]?.total || 0);
  const [inventarioId, setInventarioId] = useState(detalles[id]?.inventarioId || null);
  const [proveedorId, setProveedorId] = useState(detalles[id]?.proveedorId || null); // Estado para el ID del proveedor

  // Obtener el precio unitario desde el inventario y el ID del proveedor desde el material
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obtener datos del inventario
        const inventarioResponse = await axios.get(`${INVENTORY_ROUTE}/${id}`);
        const inventario = inventarioResponse.data;
        setPrecioUnitario(inventario.precio_unitario);
        setInventarioId(inventario.id);

        // Obtener datos del material (incluyendo proveedor_id)
        const materialResponse = await axios.get(`${MATERIAL_ROUTE}/${id}`);
        const material = materialResponse.data;
        setProveedorId(material.proveedor_id); // Guardar el ID del proveedor
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    if (!precioUnitario || !proveedorId) {
      fetchData();
    }
  }, [id, precioUnitario, proveedorId]);

  // Actualizar subtotal y total cuando cambian cantidad o descuento
  useEffect(() => {
    const newSubtotal = cantidad * precioUnitario;
    setSubtotal(newSubtotal);
    setTotal(newSubtotal - descuento);
  }, [cantidad, precioUnitario, descuento]);

  // Limitar el descuento entre 0 y el 5% del subtotal
  const handleDescuentoChange = (e) => {
    const value = parseFloat(e.target.value);
    if (value >= 0 && value <= 0.05 * subtotal) {
      setDescuento(value);
    }
  };

  // Guardar los datos en el contexto antes de navegar
  const handleSaveAndNavigate = (path) => {
    setDetalles((prevDetalles) => ({
      ...prevDetalles,
      [id]: {
        cantidad,
        precioUnitario,
        subtotal,
        descuento,
        total,
        inventarioId,
        proveedorId, // Guardar el ID del proveedor
      },
    }));
    navigate(path);
  };

  return (
    <div>
      <h1>Detalle del Material</h1>
      <p>ID del material seleccionado: {id}</p>
    
      <div>
        <label>Cantidad: </label>
        <input
          type="number"
          value={cantidad}
          min="1"
          onChange={(e) => setCantidad(parseInt(e.target.value))}
        />
      </div>

      <div>
        <label>Precio Unitario: </label>
        <input type="text" value={precioUnitario} disabled />
      </div>

      <div>
        <label>Subtotal: </label>
        <input type="text" value={subtotal} disabled />
      </div>

      <div>
        <label>Descuento: </label>
        <input
          type="number"
          value={descuento}
          min="0"
          max={0.05 * subtotal}
          onChange={handleDescuentoChange}
        />
        <p>(El descuento no puede ser mayor al 5% del subtotal)</p>
      </div>

      <div>
        <label>Total: </label>
        <input type="text" value={total} disabled />
      </div>

      <div>
        <label>Inventario ID: </label>
        <input type="text" value={inventarioId} disabled />
      </div>

      <div>
        <label>Proveedor ID: </label>
        <input type="text" value={proveedorId} disabled />
      </div>

      <button onClick={() => handleSaveAndNavigate('/compra/gestion-compras/catalogo')}>Regresar al Catálogo</button>
      <button onClick={() => handleSaveAndNavigate('/compra/gestion-compras/resumen')}>Pasar al Resumen</button>
    </div>
  );
};

export default CompDetalleMateriales;
