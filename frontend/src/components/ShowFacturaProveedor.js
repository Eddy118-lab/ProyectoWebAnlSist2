import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

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
