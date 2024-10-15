import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { useDetalles } from '../components/DetallesContext.js'; // Importar el contexto

// Ruta para obtener el precio unitario del inventario
const INVENTORY_ROUTE = 'http://localhost:8000/api/inventario';
const MATERIAL_ROUTE = 'http://localhost:8000/api/material'; // Ruta para obtener el proveedor del material

const CompDetalleMateriales = () => {
  const { id } = useParams(); // ID del material desde la URL
  const navigate = useNavigate(); // Para la navegación entre componentes
  const { detalles, setDetalles } = useDetalles(); // Acceder a los datos del contexto

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
    <div className="container mt-5">
      <div className="card" style={{ maxWidth: '800px', margin: 'auto' }}>
        <div className="card-header text-center">
        <h5 className='text-center display-6' style={{ marginTop: '70px', color: '#343a40', fontWeight: 'bold', paddingBottom: '10px' }}>Detalle del Material</h5>
          <p className="text-muted">ID del material seleccionado: <strong>{id}</strong></p>
        </div>
        <div className="card-body">
          <div className="row">
            {/* Columna 1 */}
            <div className="col-md-6 mb-3">
              <label className="form-label">Cantidad:</label>
              <input
                type="number"
                className="form-control"
                value={cantidad}
                min="1"
                onChange={(e) => setCantidad(parseInt(e.target.value))}
              />
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label">Precio Unitario:</label>
              <input type="text" className="form-control" value={precioUnitario} disabled />
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label">Subtotal:</label>
              <input type="text" className="form-control" value={subtotal} disabled />
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label">Descuento:</label>
              <input
                type="number"
                className="form-control"
                value={descuento}
                min="0"
                max={0.05 * subtotal}
                onChange={handleDescuentoChange}
              />
              <p className="form-text text-muted">(El descuento no puede ser mayor al 5% del subtotal)</p>
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label">Total:</label>
              <input type="text" className="form-control" value={total} disabled />
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label">Inventario ID:</label>
              <input type="text" className="form-control" value={inventarioId} disabled />
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label">Proveedor ID:</label>
              <input type="text" className="form-control" value={proveedorId} disabled />
            </div>
          </div>

          <div className="text-center">
            <button className="btn btn-secondary mx-2" onClick={() => handleSaveAndNavigate('/compra/gestion-compras/catalogo')}>Regresar al Catálogo</button>
            <button className="btn btn-primary mx-2" onClick={() => handleSaveAndNavigate('/compra/gestion-compras/resumen')}>Pasar al Resumen</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompDetalleMateriales;
