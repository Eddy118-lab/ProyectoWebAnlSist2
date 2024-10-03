import axios from 'axios';
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Styles/StyleTipoProveedor.css'; // Importa el archivo CSS
import '@fortawesome/fontawesome-free/css/all.min.css';

const URI = 'http://localhost:8000/api/tipo-proveedor';

const CompShowTipoProveedor = () => {
    const [tiposProveedores, setTiposProveedores] = useState([]);
    const [filteredTiposProveedores, setFilteredTiposProveedores] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [tiposProveedoresPerPage] = useState(4);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate(); // Hook para navegación

    const [sortOrder, setSortOrder] = useState('asc');
    const [sortField, setSortField] = useState('descripcion');

    useEffect(() => {
        getTiposProveedores();
    }, []);

    const getTiposProveedores = async () => {
        setLoading(true);
        try {
            const res = await axios.get(URI);
            setTiposProveedores(res.data);
            setFilteredTiposProveedores(res.data);
        } catch (error) {
            setError('Error al obtener los datos');
            console.error('Error al obtener los datos:', error);
        } finally {
            setLoading(false);
        }
    };

    const deleteTipoProveedor = async (id) => {
        try {
            const isConfirmed = window.confirm('¿Estás seguro de que deseas eliminar este tipo de proveedor?');
            if (isConfirmed) {
                await axios.delete(`${URI}/${id}`);
                getTiposProveedores();
            }
        } catch (error) {
            console.error('Error al eliminar el tipo de proveedor:', error);
            setError('Error al eliminar el tipo de proveedor');
        }
    };

    const sortTiposProveedores = (field) => {
        const sortedTiposProveedores = [...filteredTiposProveedores].sort((a, b) => {
            const aField = a[field]?.toLowerCase() || '';
            const bField = b[field]?.toLowerCase() || '';
            if (aField < bField) return sortOrder === 'asc' ? -1 : 1;
            if (aField > bField) return sortOrder === 'asc' ? 1 : -1;
            return 0;
        });
        setFilteredTiposProveedores(sortedTiposProveedores);
        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        setSortField(field);
    };

    const getSortIcon = (field) => {
        if (field !== sortField) return null;
        return sortOrder === 'asc' ? '↑' : '↓';
    };

    const indexOfLastTipoProveedor = currentPage * tiposProveedoresPerPage;
    const indexOfFirstTipoProveedor = indexOfLastTipoProveedor - tiposProveedoresPerPage;
    const currentTiposProveedores = filteredTiposProveedores.slice(indexOfFirstTipoProveedor, indexOfLastTipoProveedor);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);
    const totalPages = Math.ceil(filteredTiposProveedores.length / tiposProveedoresPerPage);

    return (
        <div className="container">
            <div className="row">
                <div className="col">
                    <div className="search-create-container">
                        <div className='user-management-header'>
                            <h2 className='user-management-title'>Gestión de Tipos de Proveedores</h2>
                        </div>
                        <div className="search-create-wrapper">
                            <div className="create-btn-container">
                                <Link to="/tipo-proveedor/create" className="btn btn-primary">
                                    <i className="fa-solid fa-plus"></i>
                                </Link>
                                {/* Botón para volver a la gestión de proveedores */}
                                <button 
                                    className="btn btn-secondary ml-2"
                                    onClick={() => navigate('/proveedor/gestion-proveedores')}
                                >
                                    Gestión de Proveedores
                                </button>
                            </div>
                        </div>
                    </div>

                    {loading && <p>Cargando...</p>}
                    {error && <p className='text-danger'>{error}</p>}

                    <table className='table table-hover'>
                        <thead className='table-primary'>
                            <tr>
                                <th onClick={() => sortTiposProveedores('descripcion')} style={{ cursor: 'pointer' }}>
                                    Descripción {getSortIcon('descripcion')}
                                </th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentTiposProveedores.length === 0 ? (
                                <tr>
                                    <td colSpan="2">No hay tipos de proveedores disponibles</td>
                                </tr>
                            ) : (
                                currentTiposProveedores.map(tipoProveedor => (
                                    <tr key={tipoProveedor.id}>
                                        <td>{tipoProveedor.descripcion}</td>
                                        <td>
                                            <Link to={`/tipo-proveedor/edit/${tipoProveedor.id}`} className='btn btn-warning btn-sm mr-2'>
                                                <i className="fa-regular fa-pen-to-square"></i>
                                            </Link>
                                            <button onClick={() => deleteTipoProveedor(tipoProveedor.id)} className='btn btn-danger btn-sm'>
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

export default CompShowTipoProveedor;
