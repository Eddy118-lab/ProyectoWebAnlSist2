import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ReactPaginate from 'react-paginate';
import './Styles/StyleFacturaProveedor.css';

const URI_FACTURA_PROVEEDOR = 'http://localhost:8000/api/factura-proveedor/';

const ShowFacturaProveedor = () => {
    const [facturas, setFacturas] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const [pageSize] = useState(10);
    const [filteredFacturas, setFilteredFacturas] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(URI_FACTURA_PROVEEDOR);
                setFacturas(response.data);
            } catch (error) {
                console.error('Error fetching facturas:', error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        const results = facturas.filter(factura =>
            factura.proveedor.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
            factura.fecha.includes(searchTerm) ||
            (factura.monto && factura.monto.toString().includes(searchTerm)) // Ensure monto is valid
        );
        setFilteredFacturas(results);
    }, [searchTerm, facturas]);

    const handlePageClick = ({ selected }) => {
        setCurrentPage(selected);
    };

    const offset = currentPage * pageSize;
    const currentFacturas = filteredFacturas.slice(offset, offset + pageSize);

    return (
        <div>
            <h1>Facturas de Proveedor</h1>

            <input
                type="text"
                placeholder="Buscar por proveedor, fecha o monto"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
            />

            <table>
                <thead>
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
                            <td>Q.{typeof factura.monto === 'number' ? factura.monto.toFixed(2) : factura.monto}</td> {/* Check type before calling toFixed */}
                            <td>{factura.proveedor.nombre}</td>
                            <td>
                                <Link to={`/factura-proveedor/detalle-factura-proveedor/${factura.id}`} className='btn btn-warning btn-sm mr-2'>
                                    Detalle
                                </Link>
                                <Link to={`/factura-proveedor/pago-proveedor/${factura.id}`} className='btn btn-warning btn-sm mr-2'>
                                    Pago
                                </Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <ReactPaginate
                previousLabel={'< Anterior'}
                nextLabel={'Siguiente >'}
                breakLabel={'...'}
                pageCount={Math.ceil(filteredFacturas.length / pageSize)}
                marginPagesDisplayed={2}
                pageRangeDisplayed={5}
                onPageChange={handlePageClick}
                containerClassName={'pagination'}
                activeClassName={'active'}
            />
        </div>
    );
};

export default ShowFacturaProveedor;
