import axios from 'axios';
import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';

const URI = 'http://localhost:8000/api/detalle-factura-cliente'; // Cambia esto si es necesario
const URI_CARGAS = 'http://localhost:8000/api/carga';

const CompShowDetallFactCliente = () => {
    const [detalles, setDetalles] = useState([]);
    const [cargas, setCargas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { id } = useParams();
    const printRef = useRef(); // Ref para el área que se imprimirá

    useEffect(() => {
        const fetchData = async () => {
            try {
                await Promise.all([getDetalles(), getCargas()]);
            } catch (err) {
                setError('Error al cargar los datos');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const getDetalles = async () => {
        try {
            const res = await axios.get(URI);
            setDetalles(res.data);
        } catch (error) {
            setError('Error al obtener los detalles');
            console.error('Error al obtener los detalles:', error);
        }
    };

    const getCargas = async () => {
        try {
            const res = await axios.get(URI_CARGAS);
            setCargas(res.data);
        } catch (error) {
            setError('Error al obtener las cargas');
            console.error('Error al obtener las cargas:', error);
        }
    };

    const formatCurrency = (amount) => {
        return amount.toLocaleString('es-GT', { style: 'currency', currency: 'GTQ' });
    };

    const formatDate = (dateString) => {
        const [year, month, day] = dateString.split('-');
        return `${day}-${month}-${year}`;
    };

    const handlePrint = () => {
        const printWindow = window.open('', '_blank');
        const grupo = detalles.find((grupo) => grupo.factura.id === parseInt(id));

        const facturaHeader = `Factura ID: ${grupo.factura.id} - Fecha: ${formatDate(grupo.factura.fecha)} - Monto: ${formatCurrency(grupo.factura.monto)}`;

        printWindow.document.write(`
            <html>
                <head>
                    <title>Impresión de Factura</title>
                    <style>
                        body {
                            font-family: Arial, sans-serif; 
                            background-color: #f4f4f4; 
                            margin: 20px; 
                            color: #333;
                        }
                        h2, h3, h4 {
                            text-align: center; 
                            color: #000000;
                        }
                        .container {
                            background-color: #fff; 
                            border-radius: 8px; 
                            padding: 20px; 
                            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
                            max-width: 800px; 
                            margin: auto;
                        }
                        table {
                            width: 100%; 
                            border-collapse: collapse; 
                            margin: 20px 0;
                        }
                        th, td {
                            border: 1px solid #ddd; 
                            padding: 12px; 
                            text-align: left; 
                        }
                        th {
                            background-color: #00B0F6;
                            color: black;
                        }
                        tr:nth-child(even) {
                            background-color: #f2f2f2;
                        }
                        .total {
                            font-weight: bold; 
                            font-size: 1.2em;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <h2>Detalles de Factura de Cliente</h2>
                        ${printRef.current.innerHTML}
                    </div>
                    <script>window.print();</script>
                </body>
            </html>
        `);
        printWindow.document.close();
    };

    if (loading) return <p>Cargando...</p>;
    if (error) return <p className='text-danger'>{error}</p>;

    const grupo = detalles.find((grupo) => grupo.factura.id === parseInt(id));

    if (!grupo) {
        return <p>No se encontró la agrupación</p>;
    }

    // Crear un objeto para un acceso más rápido a los nombres de cargas
    const cargaMap = cargas.reduce((acc, carga) => {
        acc[carga.id] = carga.descripcion;
        return acc;
    }, {});

    // Función para obtener el nombre de la carga a partir del ID
    const getCargaName = (id) => {
        return cargaMap[id] || 'Carga no encontrada';
    };

    return (
        <div className="container">
            <div className="row">
                <div className="col">
                    <h2 className='text-center display-6' style={{ marginTop: '110px', fontWeight: 'bold', paddingBottom: '10px' }}>Detalles de Factura de Clientes</h2>
                    
                    <div ref={printRef} className="mb-4" style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                        <h3>
                            Factura ID: {grupo.factura.id} - Fecha: {formatDate(grupo.factura.fecha)} - Monto: {formatCurrency(grupo.factura.monto)}
                        </h3>
                        {grupo.cargas && grupo.cargas.length > 0 && (
                            <h4>
                                Cargas: {grupo.cargas.map(carg => `ID: ${carg.id} (Nombre: ${carg.nombre})`).join(', ')}
                            </h4>
                        )}
                        <table className='table table-striped'>
                            <thead className='table-dark'>
                                <tr>
                                    <th>ID Detalle</th>
                                    <th>Cantidad</th>
                                    <th>Precio Unitario</th>
                                    <th>Subtotal</th>
                                    <th>Descuento</th>
                                    <th>Total</th>
                                    <th>Carga</th>
                                </tr>
                            </thead>
                            <tbody>
                                {grupo.detalles && grupo.detalles.length > 0 ? (
                                    grupo.detalles.map((detalle) => (
                                        <tr key={detalle.id}>
                                            <td>{detalle.id}</td>
                                            <td>{detalle.cantidad}</td>
                                            <td>{formatCurrency(detalle.precio_unitario)}</td>
                                            <td>{formatCurrency(detalle.subtotal)}</td>
                                            <td>{formatCurrency(detalle.descuento)}</td>
                                            <td>{formatCurrency(detalle.total)}</td>
                                            <td>{detalle.carga ? getCargaName(detalle.carga.id) : 'No disponible'}</td>
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

                    <div className="text-center">
                        <button 
                            className="btn btn-secondary mx-2" 
                            onClick={() => navigate('/factura-cliente/gestion-facturas-clientes')}
                        >
                            Volver a Facturas
                        </button>
                        <button 
                            className="btn btn-primary mx-2" 
                            onClick={handlePrint}
                        >
                            Imprimir Factura
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CompShowDetallFactCliente;
