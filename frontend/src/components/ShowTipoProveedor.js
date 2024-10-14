import axios from 'axios';
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './Styles/StyleShowTipoProveedor.css'; // Importa el nuevo CSS
import './Styles/StyleShowTipoProveedor.css';

const URI = 'http://localhost:8000/api/tipo-proveedor';

const CompShowTipoProveedor = () => {
    const [filteredTiposProveedores, setFilteredTiposProveedores] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [tiposProveedoresPerPage] = useState(4);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const [sortOrder, setSortOrder] = useState('asc');
    const [sortField, setSortField] = useState('descripcion');

    useEffect(() => {
        getTiposProveedores();
    }, []);

    const getTiposProveedores = async () => {
        setLoading(true);
        try {
            const res = await axios.get(URI);
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
        <div className="container-ShowTipoProveedor">
            <div className="header-ShowTipoProveedor">
                <h2 className="title-ShowTipoProveedor">Gestión de Tipos de Proveedores</h2>
                <div className="buttons-ShowTipoProveedor">
                    <Link to="/proveedor/tipo-proveedor/create" className="btn btn-add-ShowTipoProveedor">
                        <i className="fa-solid fa-plus"></i> Agregar Tipo
                    </Link>
                    <Link to="/proveedor/gestion-proveedores" className="btn btn-back-ShowTipoProveedor">
                        Regresar
                    </Link>
                </div>
            </div>

            {loading && <p className="loading-text-ShowTipoProveedor">Cargando...</p>}
            {error && <p className="text-danger-ShowTipoProveedor">{error}</p>}

            <table className='table table-hover table-ShowTipoProveedor'>
                <thead className='table-header-ShowTipoProveedor'>
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
                            <td colSpan="2" className="no-data-text-ShowTipoProveedor">No hay tipos de proveedores disponibles</td>
                        </tr>
                    ) : (
                        currentTiposProveedores.map(tipoProveedor => (
                            <tr key={tipoProveedor.id}>
                                <td>{tipoProveedor.descripcion}</td>
                                <td>
                                    <Link to={`/proveedor/tipo-proveedor/edit/${tipoProveedor.id}`} className='btn btn-warning btn-sm btn-edit-ShowTipoProveedor'>
                                        <i className="fa-regular fa-pen-to-square"></i> Editar
                                    </Link>
                                    <button onClick={() => deleteTipoProveedor(tipoProveedor.id)} className='btn btn-danger btn-sm btn-delete-ShowTipoProveedor'>
                                        <i className="fa-regular fa-trash-can"></i> Eliminar
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>

            {/* Paginación */}
            <nav className='pagination-container-ShowTipoProveedor'>
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
    );
};

export default CompShowTipoProveedor;
