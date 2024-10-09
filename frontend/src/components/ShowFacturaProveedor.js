import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Styles/StyleFacturaProveedor.css';

const URI_FACTURA_PROVEEDOR = 'http://localhost:8000/api/factura-proveedor/';
const URI_DETALLE_FACTURA_PROVEEDOR = 'http://localhost:8000/api/detalle-factura-proveedor/';

const ShowFacturaProveedor = () => {
    const [facturas, setFacturas] = useState([]);
    const [detalles, setDetalles] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(10);
    const [filteredFacturas, setFilteredFacturas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                console.log('Iniciando obtención de datos...');
                const responseFacturas = await axios.get(URI_FACTURA_PROVEEDOR);
                console.log('Facturas obtenidas:', responseFacturas.data);
                setFacturas(responseFacturas.data);
                
                const responseDetalles = await axios.get(URI_DETALLE_FACTURA_PROVEEDOR);
                console.log('Detalles obtenidos:', responseDetalles.data);
                setDetalles(responseDetalles.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching facturas or detalles:', error);
                setError('Error al cargar los datos. Por favor, intenta de nuevo.');
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        console.log('Filtrando facturas...');
        const results = facturas.filter(factura =>
            factura.proveedor.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
            factura.fecha.includes(searchTerm) ||
            (factura.monto && factura.monto.toString().includes(searchTerm))
        );
        console.log('Facturas filtradas:', results);
        setFilteredFacturas(results);
    }, [searchTerm, facturas]);

    const totalPages = Math.ceil(filteredFacturas.length / pageSize);
    const offset = (currentPage - 1) * pageSize;
    const currentFacturas = filteredFacturas.slice(offset, offset + pageSize);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handlePrint = async (factura) => {
        try {
            console.log('Iniciando impresión para factura:', factura.id);
            
            if (!factura.id) {
                throw new Error('ID de factura no válido');
            }

            console.log('Intentando obtener detalles de la factura...');
            console.log('URL de la solicitud:', `${URI_DETALLE_FACTURA_PROVEEDOR}${factura.id}`);
            const responseDetalles = await axios.get(`${URI_DETALLE_FACTURA_PROVEEDOR}${factura.id}`);
            console.log('Respuesta de detalles:', responseDetalles);

            if (!responseDetalles.data) {
                throw new Error('No se recibieron datos de detalles de la factura');
            }

            console.log('Detalles obtenidos:', responseDetalles.data);
            const detallesFactura = responseDetalles.data;

            console.log('Abriendo ventana de impresión...');
            const printWindow = window.open('', '_blank');
            if (!printWindow) {
                throw new Error('No se pudo abrir la ventana de impresión. Por favor, permite las ventanas emergentes para este sitio.');
            }
    
            const monto = typeof factura.monto === 'number'
                ? `Q.${factura.monto.toFixed(2)}`
                : factura.monto;
    
            const detalleRows = detallesFactura.map(detalle => `
                <tr>
                    <td>${detalle.id}</td>
                    <td>${detalle.cantidad}</td>
                    <td>Q.${detalle.precio_unitario?.toFixed(2) || '0.00'}</td>
                    <td>Q.${detalle.subtotal?.toFixed(2) || '0.00'}</td>
                    <td>Q.${detalle.descuento?.toFixed(2) || '0.00'}</td>
                    <td>Q.${detalle.total?.toFixed(2) || '0.00'}</td>
                    <td>${detalle.inventario?.nombre || 'No disponible'}</td>
                </tr>
            `).join('');
    
            printWindow.document.write(`
                <html>
                <head>
                    <title>Factura #${factura.id}</title>
                    <style>
                        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
                        h1 { text-align: center; color: #4a90e2; }
                        .factura-container {
                            width: 80%;
                            margin: 0 auto;
                            border: 1px solid #ddd;
                            padding: 20px;
                            border-radius: 10px;
                            box-shadow: 0 0 10px rgba(0,0,0,0.1);
                        }
                        .factura-header {
                            text-align: center;
                            margin-bottom: 20px;
                        }
                        .factura-info {
                            display: flex;
                            justify-content: space-between;
                            margin-bottom: 20px;
                        }
                        .factura-info div {
                            width: 48%;
                        }
                        table {
                            width: 100%;
                            border-collapse: collapse;
                            margin-top: 20px;
                        }
                        th, td {
                            padding: 10px;
                            border: 1px solid #ddd;
                            text-align: left;
                        }
                        th {
                            background-color: #4a90e2;
                            color: white;
                        }
                        .total {
                            text-align: right;
                            font-weight: bold;
                            margin-top: 20px;
                        }
                        footer {
                            text-align: center;
                            margin-top: 30px;
                            font-size: 0.9rem;
                            color: #777;
                        }
                    </style>
                </head>
                <body>
                    <div class="factura-container">
                        <div class="factura-header">
                            <h1>Transportes Eben-Ezer</h1>
                            <h1>Factura #${factura.id}</h1>
                            <p>Fecha: ${new Date(factura.fecha).toLocaleDateString()}</p>
                        </div>
                        <div class="factura-info">
                            <div>
                                <h3>Proveedor:</h3>
                                <p>${factura.proveedor?.nombre || 'No disponible'}</p>
                            </div>
                            <div>
                                <h3>Monto:</h3>
                                <p>${monto}</p>
                            </div>
                        </div>
    
                        <h3>Detalles de la Factura:</h3>
                        <table>
                            <thead>
                                <tr>
                                    <th>ID Detalle</th>
                                    <th>Cantidad</th>
                                    <th>Precio Unitario</th>
                                    <th>Subtotal</th>
                                    <th>Descuento</th>
                                    <th>Total</th>
                                    <th>Inventario</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${detalleRows}
                            </tbody>
                        </table>
                        <div class="total">
                            Total: ${monto}
                        </div>
                        <footer>
                            <p>Gracias por su compra</p>
                            <p>Información de contacto: transportesebenezer876@gmail.com</p>
                        </footer>
                    </div>
                </body>
                </html>
            `);
    
            console.log('Contenido de la ventana de impresión generado');
            printWindow.document.close();
            printWindow.focus();
            console.log('Iniciando impresión...');
            printWindow.print();
            printWindow.onafterprint = function() {
                console.log('Impresión completada');
                printWindow.close();
            };
        } catch (error) {
            console.error('Error detallado en handlePrint:', error);
            console.error('Mensaje de error:', error.message);
            console.error('Stack trace:', error.stack);
            if (error.response) {
                console.error('Respuesta del servidor:', error.response.data);
                console.error('Estado HTTP:', error.response.status);
                console.error('URL de la solicitud:', error.config.url);
            }
            let errorMessage = 'Error al preparar la impresión. ';
            if (error.response && error.response.status === 404) {
                errorMessage += 'No se encontraron los detalles de la factura. ';
            }
            errorMessage += 'Por favor, revisa la consola para más detalles.';
            alert(errorMessage);
        }
    };  

    if (loading) return <p>Cargando...</p>;
    if (error) return <p className="text-danger">{error}</p>;

    return (
        <div className="container mt-5">
            <h1 className="facturas-title">Facturas de Proveedor</h1>

            <div className="search-create-wrapper">
                <div className="search-container">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Buscar por proveedor, fecha o monto"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="table-container">
                <table className="table table-hover">
                    <thead className="table-primary">
                        <tr>
                            <th>ID</th>
                            <th>Fecha</th>
                            <th>Monto</th>
                            <th>Proveedor</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentFacturas.map(factura => (
                            <tr key={factura.id}>
                                <td>{factura.id}</td>
                                <td>{new Date(factura.fecha).toLocaleDateString()}</td>
                                <td>Q.{typeof factura.monto === 'number' ? factura.monto.toFixed(2) : factura.monto}</td>
                                <td>{factura.proveedor.nombre}</td>
                                <td>
                                    <Link to={`/factura-proveedor/detalle-factura-proveedor/${factura.id}`} className='btn btn-warning btn-sm mr-2'>
                                        Detalle
                                    </Link>
                                    <Link to={`/factura-proveedor/pago-proveedor/${factura.id}`} className='btn btn-warning btn-sm mr-2'>
                                        Pago
                                    </Link>
                                    <button 
                                        onClick={() => handlePrint(factura)} 
                                        className='btn btn-primary btn-sm'>
                                        <i className="fa-solid fa-print"></i>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <nav aria-label="Page navigation">
                <ul className="pagination justify-content-center">
                    {[...Array(totalPages)].map((_, index) => (
                        <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                            <button className="page-link" onClick={() => handlePageChange(index + 1)}>
                                {index + 1}
                            </button>
                        </li>
                    ))}
                </ul>
            </nav>
        </div>
    );
};

export default ShowFacturaProveedor;