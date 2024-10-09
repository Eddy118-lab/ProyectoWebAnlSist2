import axios from 'axios'; 
import { useState, useEffect } from 'react';
import {useNavigate, useParams } from 'react-router-dom';
import './Styles/StyleProveedor.css'; // Importa el archivo CSS
import '@fortawesome/fontawesome-free/css/all.min.css';

const URI = 'http://localhost:8000/api/detalle-factura-proveedor'; // Cambia esto si es necesario
const URI_MATERIALES = 'http://localhost:8000/api/material';
const CompShowDetallFactProveedor = () => {
    const [detalles, setDetalles] = useState([]);
    const [materiales, setMateriales] = useState([]); 
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);   
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        getDetalles();
        getMateriales(); // Llamar a la función para obtener los materiales
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
    
    const getMateriales = async () => {
        try {
            const res = await axios.get(URI_MATERIALES);
            setMateriales(res.data); // Almacenar los materiales en el estado
        } catch (error) {
            setError('Error al obtener los materiales');
            console.error('Error al obtener los materiales:', error);
        }
    };

    if (loading) return <p>Cargando...</p>;
    if (error) return <p className='text-danger'>{error}</p>;

    const grupo = detalles.find((grupo) => grupo.factura.id === parseInt(id));

    if (!grupo) {
        return <p>No se encontró la agrupación</p>;
    }


    // Función para obtener el nombre del material a partir del ID
    const getMaterialName = (id) => {
        const material = materiales.find(material => material.id === id);
        return material ? material.nombre : 'Material no encontrado';
    };


    return (
        <div className="container">
            <div className="row">
                <div className="col">
                    <h2 className="text-center">Detalles de Factura de Proveedores</h2>
                    
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
                                           <td>{detalle.inventario ? getMaterialName(detalle.inventario.id) : 'No disponible'}</td> {/* Mostrar el nombre del material */}
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

