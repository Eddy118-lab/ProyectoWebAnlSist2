import axios from 'axios';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';

const URI = 'http://localhost:8000/api/pago-proveedor'; // Cambia esto si es necesario

const CompShowPagoProveedor = () => {
    const [pagos, setPagos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        getPagos();
    }, []);

    const getPagos = async () => {
        setLoading(true);
        try {
            const res = await axios.get(URI);
            setPagos(res.data);
        } catch (error) {
            setError('Error al obtener los datos');
            console.error('Error al obtener los datos:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <p>Cargando...</p>;
    if (error) return <p className='text-danger'>{error}</p>;

    // Filtra los pagos por el ID de la factura
    const grupo = pagos.find((grupo) => grupo.factura.id === parseInt(id));

    if (!grupo) {
        return <p>No se encontró la agrupación para la factura ID: {id}</p>;
    }

    // Función para formatear la fecha a "dd-mm-yyyy"
    const formatFecha = (fecha) => {
        const parts = fecha.split('-'); // Suponiendo que la fecha está en formato YYYY-MM-DD
        return `${parts[2]}-${parts[1]}-${parts[0]}`; // Convertir a DD-MM-YYYY
    };

    return (
        <div className="container mt-5">
            <div className="row">
                <div className="col-12 col-md-10 offset-md-1">
                <h2 className='text-center display-6' style={{ marginTop: '70px', color: '#343a40', fontWeight: 'bold', paddingBottom: '10px' }}>Pagos de Proveedores</h2>

                    <div key={grupo.factura.id} className="mb-4">
                        <h3 className="text-center">
                            Factura ID: {grupo.factura.id} - Fecha: {formatFecha(grupo.factura.fecha)} - Monto: <span className="text-success">Q.{grupo.factura.monto}</span>
                        </h3>

                        <table className="table table-bordered table-hover mt-4">
                            <thead className="table-dark">
                                <tr>
                                    <th>ID Pago</th>
                                    <th>Fecha</th>
                                    <th>Monto</th>
                                    <th>Tipo de Pago</th>
                                </tr>
                            </thead>
                            <tbody>
                                {grupo.pagos && grupo.pagos.length > 0 ? (
                                    grupo.pagos.map((pago) => (
                                        <tr key={pago.id}>
                                            <td>{pago.id}</td>
                                            <td>{formatFecha(pago.fecha)}</td>
                                            <td>Q.{pago.monto}</td>
                                            <td>{pago.tipo_pago_proveedor ? pago.tipo_pago_proveedor.descripcion : 'No disponible'}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="text-center">No hay pagos disponibles para esta factura</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="d-flex justify-content-between mt-4">
                        <button
                            className="btn btn-secondary"
                            onClick={() => navigate('/factura-proveedor/gestion-facturas-proveedores')}
                        > Volver a Facturas
                        </button>
                        <button
                            className="btn btn-primary"
                            onClick={() => navigate('/factura-proveedor/tipo-pago-proveedor/gestion-tipos-pagos-proveedores')}
                        >Gestionar Tipos de Pagos
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CompShowPagoProveedor;
