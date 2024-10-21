import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const URI_FACTURA_CLIENTE = 'http://localhost:8000/api/factura-cliente/'; // Cambiar a la ruta de factura cliente

// Función para formatear la fecha de yyyy-mm-dd a dd-mm-yyyy
const formatDate = (dateString) => {
    const [year, month, day] = dateString.split('-');
    return `${day}-${month}-${year}`;
};

const CompShowFacturaCliente = () => {
    const [facturas, setFacturas] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(8);
    const [filteredFacturas, setFilteredFacturas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await axios.get(URI_FACTURA_CLIENTE); // Usar la ruta de cliente
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
            factura.cliente?.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) || // Cambiar proveedor por cliente
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

    if (loading) return <p>Cargando...</p>;
    if (error) return <p className="text-danger">{error}</p>;

    return (
        <div className="container mt-5">
            <h1 className="text-center display-6" style={{ marginTop: '90px', color: '#343a40', fontWeight: 'bold', paddingBottom: '10px' }}>Facturas de Clientes</h1>

            {/* Centrar el buscador */}
            <div className="d-flex justify-content-center mt-3 mb-4">
                <div className="search-container" style={{ width: '100%', maxWidth: '600px', maxHeight: '70px' }}>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Buscar por cliente, fecha o monto"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="table-container">
                <table className="table table-hover">
                    <thead className="table-dark">
                        <tr>
                            <th>ID</th>
                            <th>Fecha</th>
                            <th>Monto</th>
                            <th>Cliente</th> {/* Cambiar Proveedor a Cliente */}
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentFacturas.map(factura => (
                            <tr key={factura.id}>
                                <td>{factura.id}</td>
                                <td>{formatDate(factura.fecha)}</td>
                                <td>Q.{typeof factura.monto === 'number' ? factura.monto.toFixed(2) : factura.monto}</td>
                                <td>{factura.cliente?.nombre || 'Cliente no disponible'}</td> {/* Cambiar Proveedor a Cliente */}
                                <td>
                                    <Link to={`/factura-cliente/detalle-factura-cliente/${factura.id}`} className="btn btn-warning btn-sm mr-2">
                                        Detalle
                                    </Link>
                                    <Link to={`/factura-cliente/pago-cliente/${factura.id}`} className="btn btn-warning btn-sm">
                                        Pago
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <nav>
                <ul className="pagination justify-content-center" style={{ marginBottom: '10px' }}>
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

export default CompShowFacturaCliente;
