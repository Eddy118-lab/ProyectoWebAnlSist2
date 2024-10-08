import axios from 'axios';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Styles/StyleProveedor.css'; // Importa el archivo CSS
import SearchProveedor from './SearchProveedor.js'; // Asegúrate de crear el componente de búsqueda si lo necesitas
import '@fortawesome/fontawesome-free/css/all.min.css';

const URI = 'http://localhost:8000/api/proveedor';

const CompShowProveedor = () => {
    const [proveedores, setProveedores] = useState([]);
    const [filteredProveedores, setFilteredProveedores] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [proveedoresPerPage] = useState(4);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [sortOrder, setSortOrder] = useState('asc');
    const [sortField, setSortField] = useState('nombre');

    useEffect(() => {
        getProveedores();
    }, []);

    const getProveedores = async () => {
        setLoading(true);
        try {
            const res = await axios.get(URI);
            setProveedores(res.data);
            setFilteredProveedores(res.data);
        } catch (error) {
            setError('Error al obtener los datos');
            console.error('Error al obtener los datos:', error);
        } finally {
            setLoading(false);
        }
    };

    const deleteProveedor = async (id) => {
        try {
            const isConfirmed = window.confirm('¿Estás seguro de que deseas eliminar este proveedor?');
            if (isConfirmed) {
                await axios.delete(`${URI}/${id}`);
                getProveedores();
            }
        } catch (error) {
            console.error('Error al eliminar el proveedor:', error);
            setError('Error al eliminar el proveedor');
        }
    };

    const handleSearch = (query) => {
        const filtered = proveedores.filter(proveedor =>
            proveedor.nombre.toLowerCase().includes(query.toLowerCase()) ||
            proveedor.email.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredProveedores(filtered);
        setCurrentPage(1);
    };

    const sortProveedores = (field) => {
        const sortedProveedores = [...filteredProveedores].sort((a, b) => {
            const aField = a[field]?.toLowerCase() || '';
            const bField = b[field]?.toLowerCase() || '';
            if (aField < bField) return sortOrder === 'asc' ? -1 : 1;
            if (aField > bField) return sortOrder === 'asc' ? 1 : -1;
            return 0;
        });
        setFilteredProveedores(sortedProveedores);
        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        setSortField(field);
    };

    const getSortIcon = (field) => {
        if (field !== sortField) return null;
        return sortOrder === 'asc' ? '↑' : '↓';
    };

    const indexOfLastProveedor = currentPage * proveedoresPerPage;
    const indexOfFirstProveedor = indexOfLastProveedor - proveedoresPerPage;
    const currentProveedores = filteredProveedores.slice(indexOfFirstProveedor, indexOfLastProveedor);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);
    const totalPages = Math.ceil(filteredProveedores.length / proveedoresPerPage);

    return (
        <div className="container">
            <div className="row">
                <div className="col">
                    <div className="search-create-container">
                        <div className='user-management-header'>
                            <h2 className='user-management-title-proveedor'>Gestión de Proveedores</h2>
                        </div>
                        <div className="search-create-wrapper">
                            <div className="search-container">
                                <SearchProveedor proveedores={proveedores} onSearch={handleSearch} />
                            </div>
                            <div className="create-btn-container">
                                <Link to="/proveedor/create" className="btn btn-primary">
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
                                <th onClick={() => sortProveedores('nombre')} style={{ cursor: 'pointer' }}>
                                    Nombre {getSortIcon('nombre')}
                                </th>
                                <th onClick={() => sortProveedores('email')} style={{ cursor: 'pointer' }}>
                                    Email {getSortIcon('email')}
                                </th>
                                <th onClick={() => sortProveedores('telefono')} style={{ cursor: 'pointer' }}>
                                    Teléfono {getSortIcon('telefono')}
                                </th>
                                <th onClick={() => sortProveedores('nit')} style={{ cursor: 'pointer' }}>
                                    NIT {getSortIcon('nit')}
                                </th>
                                <th onClick={() => sortProveedores('direccion')} style={{ cursor: 'pointer' }}>
                                    Dirección {getSortIcon('direccion')}
                                </th>
                                <th onClick={() => sortProveedores('tipoProveedor.descripcion')} style={{ cursor: 'pointer' }}>
                                    Tipo {getSortIcon('tipoProveedor.descripcion')}
                                </th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentProveedores.length === 0 ? (
                                <tr>
                                    <td colSpan="7">No hay proveedores disponibles</td>
                                </tr>
                            ) : (
                                currentProveedores.map(proveedor => (
                                    <tr key={proveedor.id}>
                                        <td>{proveedor.nombre}</td>
                                        <td>{proveedor.email}</td>
                                        <td>{proveedor.telefono}</td>
                                        <td>{proveedor.nit}</td>
                                        <td>{proveedor.direccion}</td>
                                        <td>{proveedor.tipoProveedor ? proveedor.tipoProveedor.descripcion : 'N/A'}</td>
                                        <td>
                                            <Link to={`/proveedor/edit/${proveedor.id}`} className='btn btn-warning btn-sm mr-2'>
                                                <i className="fa-regular fa-pen-to-square"></i>
                                            </Link>
                                            <button onClick={() => deleteProveedor(proveedor.id)} className='btn btn-danger btn-sm'>
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

export default CompShowProveedor;
