import axios from 'axios';
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const URI = 'http://localhost:8000/api/tipo-estado';

const CompShowTipoEstado = () => {
    const [filteredTiposEstado, setFilteredTiposEstado] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [tiposEstadoPerPage] = useState(4);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState(''); // Estado para el término de búsqueda
    const navigate = useNavigate();

    const [sortOrder, setSortOrder] = useState('asc');
    const [sortField, setSortField] = useState('descripcion');

    useEffect(() => {
        getTiposEstado();
    }, []);

    const getTiposEstado = async () => {
        setLoading(true);
        try {
            const res = await axios.get(URI);
            setFilteredTiposEstado(res.data);
        } catch (error) {
            setError('Error al obtener los datos');
            console.error('Error al obtener los datos:', error);
        } finally {
            setLoading(false);
        }
    };

    const deleteTipoEstado = async (id) => {
        try {
            const isConfirmed = window.confirm('¿Estás seguro de que deseas eliminar este tipo de estado?');
            if (isConfirmed) {
                await axios.delete(`${URI}/${id}`);
                getTiposEstado();
            }
        } catch (error) {
            console.error('Error al eliminar el tipo de estado:', error);
            setError('Error al eliminar el tipo de estado');
        }
    };

    const sortTiposEstado = (field) => {
        const sortedTiposEstado = [...filteredTiposEstado].sort((a, b) => {
            const aField = a[field]?.toLowerCase() || '';
            const bField = b[field]?.toLowerCase() || '';
            if (aField < bField) return sortOrder === 'asc' ? -1 : 1;
            if (aField > bField) return sortOrder === 'asc' ? 1 : -1;
            return 0;
        });
        setFilteredTiposEstado(sortedTiposEstado);
        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        setSortField(field);
    };

    const getSortIcon = (field) => {
        if (field !== sortField) return null;
        return sortOrder === 'asc' ? '↑' : '↓';
    };

    const indexOfLastTipoEstado = currentPage * tiposEstadoPerPage;
    const indexOfFirstTipoEstado = indexOfLastTipoEstado - tiposEstadoPerPage;

    // Filtrar los tipos de estado según el término de búsqueda
    const filteredResults = filteredTiposEstado.filter(tipoEstado =>
        tipoEstado.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const currentTiposEstado = filteredResults.slice(indexOfFirstTipoEstado, indexOfLastTipoEstado);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);
    const totalPages = Math.ceil(filteredResults.length / tiposEstadoPerPage);

    return (
        <div className="container my-5">
            <h2 className="h2 text-center" style={{ marginBottom: '20px', marginTop: '90px' }}>Gestión de Tipos de Estado</h2>

            <div className="text-center mb-4">
                <Link to="/asignacion/tipo-estado/create" className="btn btn-primary me-2">
                    <i className="fa-solid fa-plus"></i> Agregar Tipo
                </Link>
                <Link to="/asignacion/gestion-asignaciones" className="btn btn-secondary">
                    Regresar
                </Link>
            </div>

            {/* Campo de búsqueda */}
            <div className="mb-4 text-center">
                <input
                    type="text"
                    className="form-control w-50 mx-auto"
                    placeholder="Buscar por descripción..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {loading && <p className="text-center text-muted">Cargando...</p>}
            {error && <p className="text-danger">{error}</p>}

            <table className="table table-hover mt-3">
                <thead className="table-dark">
                    <tr>
                        <th onClick={() => sortTiposEstado('id')} style={{ cursor: 'pointer' }}>
                            ID {getSortIcon('id')}
                        </th>
                        <th onClick={() => sortTiposEstado('descripcion')} style={{ cursor: 'pointer' }}>
                            Descripción {getSortIcon('descripcion')}
                        </th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {currentTiposEstado.length === 0 ? (
                        <tr>
                            <td colSpan="3" className="text-center text-muted">No hay tipos de estado disponibles</td>
                        </tr>
                    ) : (
                        currentTiposEstado.map(tipoEstado => (
                            <tr key={tipoEstado.id}>
                                <td>{tipoEstado.id}</td>
                                <td>{tipoEstado.descripcion}</td>
                                <td>
                                    <Link to={`/asignacion/tipo-estado/edit/${tipoEstado.id}`} className='btn btn-warning btn-sm me-2'>
                                        <i className="fa-regular fa-pen-to-square"></i> Editar
                                    </Link>
                                    <button onClick={() => deleteTipoEstado(tipoEstado.id)} className='btn btn-danger btn-sm'>
                                        <i className="fa-regular fa-trash-can"></i> Eliminar
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>

            {/* Paginación */}
            <nav>
                <ul className="pagination justify-content-center">
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

export default CompShowTipoEstado;
