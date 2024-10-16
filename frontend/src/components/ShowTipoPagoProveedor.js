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
        <div className="container mt-5">
            <div className="d-flex flex-column align-items-center mb-4">
            <h2 className='text-center display-6' style={{ marginTop: '70px', color: '#343a40', fontWeight: 'bold', paddingBottom: '10px' }}>
                    Tipos de Pago de Proveedores
                </h2>
                <div className="align-self-end mb-3">
                    <Link to='/factura-proveedor/tipo-pago-proveedor/create' className='btn btn-primary'>
                        <i className="fa-solid fa-plus"></i> Crear Tipo de Pago
                    </Link>
                </div>
            </div>

            {tiposPago.length > 0 ? (
                <table className="table table-bordered table-hover">
                    <thead className="table-dark">
                        <tr>
                            <th>ID</th>
                            <th>Descripción</th>
                            <th className="text-center">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tiposPago.map(tipo => (
                            <tr key={tipo.id}>
                                <td>{tipo.id}</td>
                                <td>{tipo.descripcion}</td>
                                <td className="text-center">
                                    <Link to={`/factura-proveedor/tipo-pago-proveedor/edit/${tipo.id}`} className='btn btn-warning btn-sm me-2'>
                                        <i className="fa-regular fa-pen-to-square"></i> Editar
                                    </Link>
                                    <button onClick={() => deleteTipoPago(tipo.id)} className='btn btn-danger btn-sm'>
                                        <i className="fa-regular fa-trash-can"></i> Eliminar
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p className="text-center">No se encontraron tipos de pago.</p>
            )}

            <div className="mt-4">
                <button onClick={() => navigate('/factura-proveedor/gestion-facturas-proveedores')} className="btn btn-secondary">
                    <i className="fas fa-arrow-left"></i> Volver
                </button>
            </div>
        </div>
    );
};

export default CompShowTipoPagoProveedor;
