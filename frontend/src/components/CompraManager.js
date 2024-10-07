import React, { useEffect, useState } from 'react';
import axios from 'axios';

const CompraManager = () => {
  const [materiales, setMateriales] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [factura, setFactura] = useState({
    proveedor_id: '',
    monto: 0,
    fecha: new Date(),
  });
  const [detalles, setDetalles] = useState([]);
  const [pago, setPago] = useState({ monto: 0, fecha: new Date() });

  // Fetch materials and providers on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const materialsResponse = await axios.get('http://localhost:8000/api/material');
        const providersResponse = await axios.get('http://localhost:8000/api/proveedor');
        setMateriales(materialsResponse.data);
        setProveedores(providersResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  const handleFacturaChange = (e) => {
    const { name, value } = e.target;
    setFactura({ ...factura, [name]: value });
  };

  const handleDetailChange = (e) => {
    const { name, value } = e.target;
    setDetalles((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleAddDetail = () => {
    setDetalles([...detalles, { ...detalles }]);
    setDetalles({ cantidad: 0, precio_unitario: 0, inventario_id: '' }); // Reset detail input
  };

  const handlePagoChange = (e) => {
    const { name, value } = e.target;
    setPago({ ...pago, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Create the purchase
      const purchaseResponse = await axios.post('http://localhost:8000/api/compras', {
        factura,
        detalles,
        pago,
      });
      alert('Compra realizada con éxito: ' + purchaseResponse.data.id);
      // Reset form
      setFactura({ proveedor_id: '', monto: 0, fecha: new Date() });
      setDetalles([]);
      setPago({ monto: 0, fecha: new Date() });
    } catch (error) {
      console.error('Error creating purchase:', error);
    }
  };

  return (
    <div>
      <h2>Gestión de Compras</h2>
      <form onSubmit={handleSubmit}>
        <h3>Factura</h3>
        <div>
          <label>Proveedor:</label>
          <select name="proveedor_id" value={factura.proveedor_id} onChange={handleFacturaChange}>
            <option value="">Selecciona un proveedor</option>
            {proveedores.map((proveedor) => (
              <option key={proveedor.id} value={proveedor.id}>
                {proveedor.nombre}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Monto:</label>
          <input type="number" name="monto" value={factura.monto} onChange={handleFacturaChange} required />
        </div>
        <div>
          <label>Fecha:</label>
          <input type="date" name="fecha" value={factura.fecha.toISOString().split('T')[0]} onChange={handleFacturaChange} required />
        </div>

        <h3>Detalles de la Compra</h3>
        <div>
          <label>Material:</label>
          <select name="material_id" onChange={handleDetailChange}>
            <option value="">Selecciona un material</option>
            {materiales.map((material) => (
              <option key={material.id} value={material.id}>
                {material.nombre}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Cantidad:</label>
          <input type="number" name="cantidad" value={detalles.cantidad} onChange={handleDetailChange} required />
        </div>
        <div>
          <label>Precio Unitario:</label>
          <input type="number" name="precio_unitario" value={detalles.precio_unitario} onChange={handleDetailChange} required />
        </div>
        <button type="button" onClick={handleAddDetail}>Agregar Detalle</button>

        <h3>Pago</h3>
        <div>
          <label>Monto de Pago:</label>
          <input type="number" name="monto" value={pago.monto} onChange={handlePagoChange} required />
        </div>
        <div>
          <label>Fecha de Pago:</label>
          <input type="date" name="fecha" value={pago.fecha.toISOString().split('T')[0]} onChange={handlePagoChange} required />
        </div>

        <button type="submit">Realizar Compra</button>
      </form>
    </div>
  );
};

export default CompraManager;
