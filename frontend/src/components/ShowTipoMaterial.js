import axios from 'axios';
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const URI = 'http://localhost:8000/api/tipo-material'; // Reemplaza con la URL correcta de tu API

const CompShowTipoMaterial = () => {
    const [filteredTipos, setFilteredTipos] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [tiposPerPage] = useState(4);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate(); // Hook para navegación

    const [sortOrder, setSortOrder] = useState('asc');

    useEffect(() => {
        getTiposMaterial();
    }, []);

    const getTiposMaterial = async () => {
        setLoading(true);
        try {
            const res = await axios.get(URI);
            setFilteredTipos(res.data); // Solo usamos filteredTipos
        } catch (error) {
            setError('Error al obtener los datos');
            console.error('Error al obtener los datos:', error);
        } finally {
            setLoading(false);
        }
    };

    const deleteTipoMaterial = async (id) => {
        try {
            const isConfirmed = window.confirm('¿Estás seguro de que deseas eliminar este tipo de material?');
            if (isConfirmed) {
                await axios.delete(`${URI}/${id}`);
                getTiposMaterial();
            }
        } catch (error) {
            console.error('Error al eliminar el tipo de material:', error);
            setError('Error al eliminar el tipo de material');
        }
    };

    const sortTipos = (field) => {
        const sortedTipos = [...filteredTipos].sort((a, b) => {
            const aField = a[field]?.toLowerCase() || '';
            const bField = b[field]?.toLowerCase() || '';
            if (aField < bField) return sortOrder === 'asc' ? -1 : 1;
            if (aField > bField) return sortOrder === 'asc' ? 1 : -1;
            return 0;
        });
        setFilteredTipos(sortedTipos);
        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    };

    const getSortIcon = (field) => {
        return sortOrder === 'asc' ? '↑' : '↓';
    };

    const indexOfLastTipo = currentPage * tiposPerPage;
    const indexOfFirstTipo = indexOfLastTipo - tiposPerPage;
    const currentTipos = filteredTipos.slice(indexOfFirstTipo, indexOfLastTipo);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);
    const totalPages = Math.ceil(filteredTipos.length / tiposPerPage);

    return (
        <div className="container">
            <div className="row">
                <div className="col">
                    <div className="search-create-container">
                        <div className='user-management-header'>
                            <h2 className='user-management-title'>Gestión de Tipos de Material</h2>
                        </div>
                        <div className="search-create-wrapper">
                            <div className="create-btn-container">
                                <Link to="/material/tipo-material/create" className="btn btn-primary">
                                    <i className="fa-solid fa-plus"></i>
                                </Link>
                                {/* Botón para volver a la gestión de materiales */}
                                <button 
                                    className="btn btn-secondary ml-2"
                                    onClick={() => navigate('/material/gestion-materiales')}
                                >
                                    Gestión de Materiales
                                </button>
                            </div>
                        </div>
                    </div>

                    {loading && <p>Cargando...</p>}
                    {error && <p className='text-danger'>{error}</p>}

                    <table className='table table-hover'>
                        <thead className='table-primary'>
                            <tr>
                                <th onClick={() => sortTipos('descripcion')} style={{ cursor: 'pointer' }}>
                                    Descripción {getSortIcon('descripcion')}
                                </th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentTipos.length === 0 ? (
                                <tr>
                                    <td colSpan="2">No hay tipos de material disponibles</td>
                                </tr>
                            ) : (
                                currentTipos.map(tipo => (
                                    <tr key={tipo.id}>
                                        <td>{tipo.descripcion}</td>
                                        <td>
                                            <Link to={`/material/tipo-material/edit/${tipo.id}`} className='btn btn-warning btn-sm mr-2'>
                                                <i className="fa-regular fa-pen-to-square"></i>
                                            </Link>
                                            <button onClick={() => deleteTipoMaterial(tipo.id)} className='btn btn-danger btn-sm'>
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

export default CompShowTipoMaterial;
