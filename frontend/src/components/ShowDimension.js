import axios from 'axios';
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const URI = 'http://localhost:8000/api/dimension'; // Reemplaza con la URL correcta de tu API

const CompShowDimension = () => {
    const [filteredDimensiones, setFilteredDimensiones] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [dimensionesPerPage] = useState(4);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate(); // Hook para navegación

    const [sortOrder, setSortOrder] = useState('asc');

    useEffect(() => {
        getDimensiones();
    }, []);

    const getDimensiones = async () => {
        setLoading(true);
        try {
            const res = await axios.get(URI);
            setFilteredDimensiones(res.data); // Establecemos solo filteredDimensiones
        } catch (error) {
            setError('Error al obtener los datos');
            console.error('Error al obtener los datos:', error);
        } finally {
            setLoading(false);
        }
    };

    const deleteDimension = async (id) => {
        try {
            const isConfirmed = window.confirm('¿Estás seguro de que deseas eliminar esta dimensión?');
            if (isConfirmed) {
                await axios.delete(`${URI}/${id}`);
                getDimensiones();
            }
        } catch (error) {
            console.error('Error al eliminar la dimensión:', error);
            setError('Error al eliminar la dimensión');
        }
    };

    const sortDimensiones = (field) => {
        const sortedDimensiones = [...filteredDimensiones].sort((a, b) => {
            const aField = a[field]?.toLowerCase() || '';
            const bField = b[field]?.toLowerCase() || '';
            if (aField < bField) return sortOrder === 'asc' ? -1 : 1;
            if (aField > bField) return sortOrder === 'asc' ? 1 : -1;
            return 0;
        });
        setFilteredDimensiones(sortedDimensiones);
        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    };

    const getSortIcon = (field) => {
        if (field !== 'descripcion') return null; // Cambié 'sortField' a 'descripcion' aquí
        return sortOrder === 'asc' ? '↑' : '↓';
    };

    const indexOfLastDimension = currentPage * dimensionesPerPage;
    const indexOfFirstDimension = indexOfLastDimension - dimensionesPerPage;
    const currentDimensiones = filteredDimensiones.slice(indexOfFirstDimension, indexOfLastDimension);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);
    const totalPages = Math.ceil(filteredDimensiones.length / dimensionesPerPage);

    return (
        <div className="container">
            <div className="row">
                <div className="col">
                    <div className="search-create-container">
                        <div className='user-management-header'>
                            <h2 className='user-management-title'>Gestión de Dimensiones</h2>
                        </div>
                        <div className="search-create-wrapper">
                        <div className="create-btn-container-showTC">
                                <Link to="/material/dimension/create" className="btn btn-primary">
                                    <i className="fa-solid fa-plus"></i>
                                </Link>
                                </div>
                                <div className="create-btn-container-Regresar">
                                <Link to="/material/gestion-materiales" className="btn btn-secondary ml-2">
                                    Regresar
                                </Link>
                            </div>
                        </div>
                    </div>

                    {loading && <p>Cargando...</p>}
                    {error && <p className='text-danger'>{error}</p>}

                    <table className='table table-hover'>
                        <thead className='table-primary'>
                            <tr>
                                <th onClick={() => sortDimensiones('descripcion')} style={{ cursor: 'pointer' }}>
                                    Descripción {getSortIcon('descripcion')}
                                </th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentDimensiones.length === 0 ? (
                                <tr>
                                    <td colSpan="2">No hay dimensiones disponibles</td>
                                </tr>
                            ) : (
                                currentDimensiones.map(dimension => (
                                    <tr key={dimension.id}>
                                        <td>{dimension.descripcion}</td> {/* Cambiado a 'descripcion' */}
                                        <td>
                                            <Link to={`/material/dimension/edit/${dimension.id}`} className='btn btn-warning btn-sm mr-2'>
                                                <i className="fa-regular fa-pen-to-square"></i>
                                            </Link>
                                            <button onClick={() => deleteDimension(dimension.id)} className='btn btn-danger btn-sm'>
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

export default CompShowDimension;
