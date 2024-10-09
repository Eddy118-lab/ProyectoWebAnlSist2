import axios from 'axios';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './Styles/StyleProveedor.css'; // Importa el archivo CSS
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
    const pagosFactura = pagos.find((grupo) => grupo.factura && grupo.factura.id === parseInt(id));

    if (!pagosFactura) {
        return <p>No se encontró la agrupación</p>;
    }

    // Función para formatear la fecha a "dd-mm-yyyy"
    const formatFecha = (fecha) => {
        const parts = fecha.split('-'); // Suponiendo que la fecha está en formato YYYY-MM-DD
        return `${parts[2]}-${parts[1]}-${parts[0]}`; // Convertir a DD-MM-YYYY
    };

    return (
        <div className="container">
            <div className="row">
                <div className="col">
                    <h2 className="text-center">Pagos de Proveedores</h2>
    
                    {pagosFactura && (
                        <div key={pagosFactura.factura.id} className="mb-4">
                            <h3>Factura ID: {pagosFactura.factura.id} - Fecha: {formatFecha(pagosFactura.factura.fecha)} - Monto: Q.{pagosFactura.factura.monto}</h3>
    
                            <table className='table table-hover'>
                                <thead className='table-primary'>
                                    <tr>
                                        <th>ID Pago</th>
                                        <th>Fecha</th>
                                        <th>Monto</th>
                                        <th>Tipo de Pago</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {pagosFactura.pagos && pagosFactura.pagos.length > 0 ? (
                                        pagosFactura.pagos.map((pago) => (
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
                    )}
    
                    <div className='action-buttons'>
                        <button
                            className="btn btn-secondary"
                            onClick={() => navigate('/factura-proveedor/gestion-facturas-proveedores')}
                        >
                            Volver a Facturas
                        </button>
                        <button
                            className="btn btn-primary ms-2"
                            onClick={() => navigate('/factura-proveedor/tipo-pago-proveedor/gestion-tipos-pagos-proveedores')}
                        >
                            Gestionar Tipos de Pagos
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CompShowPagoProveedor;
