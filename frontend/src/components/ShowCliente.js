import axios from 'axios';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Styles/StyleCliente.css';  // Importa el archivo CSS
import SearchCliente from './SearchCliente.js';
import '@fortawesome/fontawesome-free/css/all.min.css';


const URI = 'http://localhost:8000/api/cliente';

const CompShowCliente = () => {
    const [clientes, setClientes] = useState([]);
    const [filteredClientes, setFilteredClientes] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [clientesPerPage] = useState(4);
    const [loading, setLoading] = useState(true); 
    const [error, setError] = useState(null); 

    const [sortOrder, setSortOrder] = useState('asc'); 
    const [sortField, setSortField] = useState('nombre'); 

    useEffect(() => {
        getClientes();
    }, []);

    const getClientes = async () => {
        setLoading(true);
        try {
            const res = await axios.get(URI);
            setClientes(res.data);
            setFilteredClientes(res.data);
        } catch (error) {
            setError('Error al obtener los datos');
            console.error("Error al obtener los datos:", error);
        } finally {
            setLoading(false);
        }
    };

    const deleteCliente = async (id) => {
        try {
            const isConfirmed = window.confirm('¿Estás seguro de que deseas eliminar este cliente?');
            if (isConfirmed) {
                await axios.delete(`${URI}/${id}`);
                getClientes();
            }
        } catch (error) {
            console.error("Error al eliminar el cliente:", error);
            setError('Error al eliminar el cliente');
        }
    };

    const handleSearch = (query) => {
        const filtered = clientes.filter(cliente =>
            cliente.nombre.toLowerCase().includes(query.toLowerCase()) ||
            cliente.email.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredClientes(filtered);
        setCurrentPage(1);
    };

    const sortClientes = (field) => {
        const sortedClientes = [...filteredClientes].sort((a, b) => {
            const aField = a[field]?.toLowerCase() || '';
            const bField = b[field]?.toLowerCase() || '';
            if (aField < bField) return sortOrder === 'asc' ? -1 : 1;
            if (aField > bField) return sortOrder === 'asc' ? 1 : -1;
            return 0;
        });
        setFilteredClientes(sortedClientes);
        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        setSortField(field);
    };

    const getSortIcon = (field) => {
        if (field !== sortField) return null;
        return sortOrder === 'asc' ? '↑' : '↓';
    };

    const indexOfLastCliente = currentPage * clientesPerPage;
    const indexOfFirstCliente = indexOfLastCliente - clientesPerPage;
    const currentClientes = filteredClientes.slice(indexOfFirstCliente, indexOfLastCliente);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);
    const totalPages = Math.ceil(filteredClientes.length / clientesPerPage);

    return (
        <div className="container">
    <div className="row">
        <div className="col">
            <div className="search-create-container">
                        {/* Mensaje de Gestión de Usuario */}
                        <div className='user-management-header'>
                        <h2 className='user-management-title'>Gestión de Clientes</h2>
                        </div>
                <div className="search-create-wrapper">
                    <div className="search-container">
                        <SearchCliente clientes={clientes} onSearch={handleSearch} />
                    </div>
                    <div className="create-btn-container">
                        <Link to="/cliente/create" className="btn btn-primary">
                            <i className="fa-solid fa-plus"></i>
                        </Link>
                    </div>
                </div>
            </div>

            {loading && <p>Cargando...</p>}
            {error && <p className='text-danger'>{error}</p>}

            <table className='table table-hover'>
                <thead className='table-primary'>
                    <tr>
                        <th onClick={() => sortClientes('nombre')} style={{ cursor: 'pointer' }}>
                            Nombre {getSortIcon('nombre')}
                        </th>
                        <th onClick={() => sortClientes('email')} style={{ cursor: 'pointer' }}>
                            Email {getSortIcon('email')}
                        </th>
                        <th onClick={() => sortClientes('telefono')} style={{ cursor: 'pointer' }}>
                            Teléfono {getSortIcon('telefono')}
                        </th>
                        <th onClick={() => sortClientes('nit')} style={{ cursor: 'pointer' }}>
                            NIT {getSortIcon('nit')}
                        </th>
                        <th onClick={() => sortClientes('direccion')} style={{ cursor: 'pointer' }}>
                            Dirección {getSortIcon('direccion')}
                        </th>
                        <th onClick={() => sortClientes('tipoCliente.descripcion')} style={{ cursor: 'pointer' }}>
                            Tipo {getSortIcon('tipoCliente.descripcion')}
                        </th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {currentClientes.length === 0 ? (
                        <tr>
                            <td colSpan="7">No hay clientes disponibles</td>
                        </tr>
                    ) : (
                        currentClientes.map(cliente => (
                            <tr key={cliente.id}>                                      
                                <td>{cliente.nombre}</td>
                                <td>{cliente.email}</td>
                                <td>{cliente.telefono}</td>
                                <td>{cliente.nit}</td>
                                <td>{cliente.direccion}</td>
                                <td>{cliente.tipoCliente ? cliente.tipoCliente.descripcion : 'N/A'}</td>
                                <td>
                                    <Link to={`/cliente/edit/${cliente.id}`} className='btn btn-warning btn-sm mr-2'>
                                        <i className="fa-regular fa-pen-to-square"></i>
                                    </Link>
                                    <button onClick={() => deleteCliente(cliente.id)} className='btn btn-danger btn-sm'>
                                        <i className="fa-regular fa-trash-can"></i>
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>

            {/* Paginación */}
            <nav className='d-flex justify-content-center'>
                <ul className='pagination'>
                    {[...Array(totalPages).keys()].map(number => (
                        <li key={number + 1} className={`page-item ${number + 1 === currentPage ? 'active' : ''}`}>
                            <button onClick={() => paginate(number + 1)} className='page-link'>
                                {number + 1}
                            </button>
                        </li>
                    ))}
                </ul>
            </nav>
        </div>
    </div>
</div>

    );
};

export default CompShowCliente;
