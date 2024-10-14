import axios from 'axios';
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';

const URI = 'http://localhost:8000/api/tipo-pago-proveedor'; // Cambia esto si es necesario

const CompShowTipoPagoProveedor = () => {
    const [tiposPago, setTiposPago] = useState([]); // Maneja una lista de tipos de pago
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        getTiposPago(); // Obtener todos los tipos de pago
    }, []);

    const getTiposPago = async () => {
        try {
            const res = await axios.get(URI);
            setTiposPago(res.data); // Almacena la lista de tipos de pago
        } catch (error) {
            setError('Error al obtener los tipos de pago');
            console.error('Error al obtener los tipos de pago:', error);
        } finally {
            setLoading(false);
        }
    };

    const deleteTipoPago = async (id) => {
        const isConfirmed = window.confirm('¿Estás seguro de que deseas eliminar este tipo de pago?');
        if (isConfirmed) {
            try {
                await axios.delete(`${URI}/${id}`);
                // Vuelve a cargar la lista después de eliminar
                getTiposPago();
            } catch (error) {
                console.error('Error al eliminar el tipo de pago:', error);
            }
        }
    };

    if (loading) return <p>Cargando...</p>;
    if (error) return <p className='text-danger'>{error}</p>;

    return (
        <div className='container'>
            <div className='header'>
                <h2 className='text-center'>Tipos de Pago de Proveedores</h2>
            </div>

            <div className='actions mb-3'>
                <Link to='/factura-proveedor/tipo-pago-proveedor/create' className='btn btn-primary'>
                    <i className="fa-solid fa-plus"></i> Crear Tipo de Pago
                </Link>
            </div>

            {tiposPago.length > 0 ? (
                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Descripción</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tiposPago.map(tipo => (
                            <tr key={tipo.id}>
                                <td>{tipo.id}</td>
                                <td>{tipo.descripcion}</td>
                                <td>
                                    <Link to={`/factura-proveedor/tipo-pago-proveedor/edit/${tipo.id}`} className='btn btn-warning btn-sm'>
                                        <i className="fa-regular fa-pen-to-square"></i> Editar
                                    </Link>
                                    <button onClick={() => deleteTipoPago(tipo.id)} className='btn btn-danger btn-sm ml-2'>
                                        <i className="fa-regular fa-trash-can"></i> Eliminar
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No se encontraron tipos de pago.</p>
            )}

            <div className='actions'>
                <button onClick={() => navigate('/factura-proveedor/gestion-facturas-proveedores')} className='btn btn-secondary'>
                    Volver
                </button>
            </div>
        </div>
    );
};

export default CompShowTipoPagoProveedor;

