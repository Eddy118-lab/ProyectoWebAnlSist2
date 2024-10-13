import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Styles/StyleFacturaProveedor.css';

const URI_FACTURA_PROVEEDOR = 'http://localhost:8000/api/factura-proveedor/';

// Función para formatear la fecha de yyyy-mm-dd a dd-mm-yyyy
const formatDate = (dateString) => {
    const [year, month, day] = dateString.split('-');
    return `${day}-${month}-${year}`;
};

const ShowFacturaProveedor = () => {
    const [facturas, setFacturas] = useState([]);
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
                const response = await axios.get(URI_FACTURA_PROVEEDOR);
                setFacturas(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching facturas:', error);
                setError('Error al cargar los datos. Por favor, intenta de nuevo.');
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        const results = facturas.filter(factura =>
            factura.proveedor?.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            factura.fecha.includes(searchTerm) ||
            (factura.monto && factura.monto.toString().includes(searchTerm))
        );
        setFilteredFacturas(results);
    }, [searchTerm, facturas]);

    const totalPages = Math.ceil(filteredFacturas.length / pageSize);
    const offset = (currentPage - 1) * pageSize;
    const currentFacturas = filteredFacturas.slice(offset, offset + pageSize);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handlePrint = (factura) => {
        try {
            console.log('Preparando la impresión de la factura:', factura.id);

            const printWindow = window.open('', '_blank');
            if (!printWindow) {
                throw new Error('No se pudo abrir la ventana de impresión.');
            }

            const monto = typeof factura.monto === 'number'
                ? `Q.${factura.monto.toFixed(2)}`
                : factura.monto || 'Monto no disponible';

            printWindow.document.write(`
                <html>
                <head>
                    <title>Factura #${factura.id}</title>
                    <style>
                        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
                        h1 { text-align: center; color: #4a90e2; }
                        .factura-container {
                            width: 80%; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;
                            box-shadow: 0 0 10px rgba(0,0,0,0.1);
                        }
                        .factura-header {
                            text-align: center; margin-bottom: 20px;
                        }
                        .factura-info {
                            display: flex; justify-content: space-between; margin-bottom: 20px;
                        }
                        .factura-info div {
                            width: 48%;
                        }
                        .total {
                            text-align: right; font-weight: bold; margin-top: 20px;
                        }
                        footer {
                            text-align: center; margin-top: 30px; font-size: 0.9rem; color: #777;
                        }
                    </style>
                </head>
                <body>
                    <div class="factura-container">
                        <div class="factura-header">
                            <h1>Transportes Eben-Ezer</h1>
                            <h1>Factura #${factura.id}</h1>
                            <p>Fecha: ${formatDate(factura.fecha)}</p>
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
                        <div class="total">
                            Total: ${monto}
                        </div>
                        <footer>
                            <p>Gracias por su compra</p>
                            <p>Información de contacto: transportesebenezer876@gmail.com</p>
                        </footer>
                        <button onclick="window.print()" style="margin: 20px; padding: 10px 20px; font-size: 16px;">Imprimir Factura</button>
                    </div>
                </body>
                </html>
            `);

            printWindow.document.close();
            printWindow.focus();
        } catch (error) {
            alert('Error al preparar la impresión. Revisa la consola para más detalles.');
            console.error('Error en la impresión:', error);
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
                                <td>{formatDate(factura.fecha)}</td>
                                <td>Q.{typeof factura.monto === 'number' ? factura.monto.toFixed(2) : factura.monto}</td>
                                <td>{factura.proveedor?.nombre || 'Proveedor no disponible'}</td>
                                <td>
                                    <Link to={`/factura-proveedor/detalle-factura-proveedor/${factura.id}`} className='btn btn-warning btn-sm mr-2'>
                                        Detalle
                                    </Link>
                                    <Link to={`/factura-proveedor/pago-proveedor/${factura.id}`} className='btn btn-warning btn-sm'>
                                        Pago
                                    </Link>
                                    <button onClick={() => handlePrint(factura)} className="btn btn-primary btn-sm ml-2">
                                    <i className="fa-solid fa-print"></i>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <nav>
                <ul className="pagination">
                    {Array.from({ length: totalPages }, (_, index) => (
                        <li key={index} className={`page-item ${index + 1 === currentPage ? 'active' : ''}`}>
                            <button onClick={() => handlePageChange(index + 1)} className="page-link">
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
