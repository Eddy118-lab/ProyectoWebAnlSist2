import axios from 'axios';
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Styles/StyleGestion.css';

const URI = 'http://localhost:8000/api/peso'; // Reemplaza con la URL correcta de tu API

const CompShowPeso = () => {
    const [filteredPesos, setFilteredPesos] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pesosPerPage] = useState(4);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate(); // Hook para navegación

    const [sortOrder, setSortOrder] = useState('asc');

    useEffect(() => {
        getPesos();
    }, []);

    const getPesos = async () => {
        setLoading(true);
        try {
            const res = await axios.get(URI);
            setFilteredPesos(res.data); // Establecemos solo filteredPesos
        } catch (error) {
            setError('Error al obtener los datos');
            console.error('Error al obtener los datos:', error);
        } finally {
            setLoading(false);
        }
    };

    const deletePeso = async (id) => {
        try {
            const isConfirmed = window.confirm('¿Estás seguro de que deseas eliminar este peso?');
            if (isConfirmed) {
                await axios.delete(`${URI}/${id}`);
                getPesos();
            }
        } catch (error) {
            console.error('Error al eliminar el peso:', error);
            setError('Error al eliminar el peso');
        }
    };

    const sortPesos = (field) => {
        const sortedPesos = [...filteredPesos].sort((a, b) => {
            const aField = a[field]?.toLowerCase() || '';
            const bField = b[field]?.toLowerCase() || '';
            if (aField < bField) return sortOrder === 'asc' ? -1 : 1;
            if (aField > bField) return sortOrder === 'asc' ? 1 : -1;
            return 0;
        });
        setFilteredPesos(sortedPesos);
        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    };

    const getSortIcon = (field) => {
        return sortOrder === 'asc' ? '↑' : '↓';
    };

    const indexOfLastPeso = currentPage * pesosPerPage;
    const indexOfFirstPeso = indexOfLastPeso - pesosPerPage;
    const currentPesos = filteredPesos.slice(indexOfFirstPeso, indexOfLastPeso);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);
    const totalPages = Math.ceil(filteredPesos.length / pesosPerPage);

    return (
        <div className="container">
            <div className="row">
                <div className="col">
                    <div className="search-create-container">
                        <div className='user-management-header'>
                            <h2 className='user-management-title'>Gestión de Pesos</h2>
                        </div>
                        <div className="search-create-wrapper">
                        <div className="create-btn-container-showTC">
                                <Link to="/material/peso/create" className="btn btn-primary">
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
                                <th onClick={() => sortPesos('descripcion')} style={{ cursor: 'pointer' }}>
                                    Descripción {getSortIcon('descripcion')}
                                </th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentPesos.length === 0 ? (
                                <tr>
                                    <td colSpan="2">No hay pesos disponibles</td>
                                </tr>
                            ) : (
                                currentPesos.map(peso => (
                                    <tr key={peso.id}>
                                        <td>{peso.descripcion}</td>
                                        <td>
                                            <Link to={`/material/peso/edit/${peso.id}`} className='btn btn-warning btn-sm mr-2'>
                                                <i className="fa-regular fa-pen-to-square"></i>
                                            </Link>
                                            <button onClick={() => deletePeso(peso.id)} className='btn btn-danger btn-sm'>
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

export default CompShowPeso;
