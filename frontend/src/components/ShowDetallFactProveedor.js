import axios from 'axios'; 
import { useState, useEffect } from 'react';
import {useNavigate } from 'react-router-dom';
import './Styles/StyleProveedor.css'; // Importa el archivo CSS
import '@fortawesome/fontawesome-free/css/all.min.css';

const URI = 'http://localhost:8000/api/detalle-factura-proveedor'; // Cambia esto si es necesario

const CompShowDetallFactProveedor = () => {
    const [detalles, setDetalles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        getDetalles();
    }, []);

    const getDetalles = async () => {
        setLoading(true);
        try {
            const res = await axios.get(URI);
            setDetalles(res.data);
        } catch (error) {
            setError('Error al obtener los datos');
            console.error('Error al obtener los datos:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <p>Cargando...</p>;
    if (error) return <p className='text-danger'>{error}</p>;

    return (
        <div className="container">
            <div className="row">
                <div className="col">
                    <h2 className="text-center">Detalles de Factura de Proveedores</h2>
                    
                    {detalles.length === 0 ? (
                        <p>No hay detalles disponibles</p>
                    ) : (
                        detalles.map((grupo) => (
                            <div key={grupo.factura.id} className="mb-4">
                                <h3>Factura ID: {grupo.factura.id} - Fecha: {grupo.factura.fecha} - Monto: {grupo.factura.monto}</h3>
                                {grupo.inventarios && grupo.inventarios.length > 0 && (
                                    <h4>Inventarios: {grupo.inventarios.map(inv => `ID: ${inv.id} (Precio: ${inv.precio_unitario})`).join(', ')}</h4>
                                )}
                                <table className='table table-hover'>
                                    <thead className='table-primary'>
                                        <tr>
                                            <th>ID Detalle</th>
                                            <th>Cantidad</th>
                                            <th>Precio Unitario</th>
                                            <th>Subtotal</th>
                                            <th>Descuento</th>
                                            <th>Total</th>
                                            <th>ID Inventario</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {grupo.detalles && grupo.detalles.length > 0 ? (
                                            grupo.detalles.map((detalle) => (
                                                <tr key={detalle.id}>
                                                    <td>{detalle.id}</td>
                                                    <td>{detalle.cantidad}</td>
                                                    <td>Q.{detalle.precio_unitario}</td>
                                                    <td>Q. {detalle.subtotal}</td>
                                                    <td>Q. {detalle.descuento}</td>
                                                    <td>Q. {detalle.total}</td>
                                                    <td>{detalle.inventario ? detalle.inventario.id : 'No disponible'}</td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="7" className="text-center">No hay detalles disponibles para esta factura</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        ))
                    )}

                    <button 
                        className="btn btn-secondary" 
                        onClick={() => navigate('/factura-proveedor/gestion-facturas-proveedores')}
                    >
                        Volver a Facturas
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CompShowDetallFactProveedor;

