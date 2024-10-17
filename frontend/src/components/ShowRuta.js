import axios from 'axios';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

const URI = 'http://localhost:8000/api/ruta';

const CompShowRuta = () => {
    const [rutas, setRutas] = useState([]);
    const [filteredRutas, setFilteredRutas] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [rutasPerPage] = useState(5);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [sortOrder, setSortOrder] = useState('asc');
    const [sortField, setSortField] = useState('nombre');

    useEffect(() => {
        getRutas();
    }, []);

    const getRutas = async () => {
        setLoading(true);
        try {
            const res = await axios.get(URI);
            setRutas(res.data);
            setFilteredRutas(res.data);
        } catch (error) {
            setError('Error al obtener las rutas');
            console.error("Error al obtener las rutas:", error);
        } finally {
            setLoading(false);
        }
    };

    const deleteRuta = async (id) => {
        try {
            const isConfirmed = window.confirm('¿Estás seguro de que deseas eliminar esta ruta?');
            if (isConfirmed) {
                await axios.delete(`${URI}/${id}`);
                getRutas();
            }
        } catch (error) {
            console.error("Error al eliminar la ruta:", error);
            setError('Error al eliminar la ruta');
        }
    };

    const handleSearch = (query) => {
        const filtered = rutas.filter(ruta =>
            ruta.nombre.toLowerCase().includes(query.toLowerCase()) ||
            ruta.origen.toLowerCase().includes(query.toLowerCase()) ||
            ruta.destino.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredRutas(filtered);
        setCurrentPage(1);
    };

    const sortRutas = (field) => {
        const sortedRutas = [...filteredRutas].sort((a, b) => {
            const aField = a[field]?.toLowerCase() || '';
            const bField = b[field]?.toLowerCase() || '';
            if (aField < bField) return sortOrder === 'asc' ? -1 : 1;
            if (aField > bField) return sortOrder === 'asc' ? 1 : -1;
            return 0;
        });
        setFilteredRutas(sortedRutas);
        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        setSortField(field);
    };

    const getSortIcon = (field) => {
        if (field !== sortField) return null;
        return sortOrder === 'asc' ? '↑' : '↓';
    };

    const indexOfLastRuta = currentPage * rutasPerPage;
    const indexOfFirstRuta = indexOfLastRuta - rutasPerPage;
    const currentRutas = filteredRutas.slice(indexOfFirstRuta, indexOfLastRuta);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);
    const totalPages = Math.ceil(filteredRutas.length / rutasPerPage);

    return (
        <div className="container">
            <div className="row justify-content-center my-4">
                <h2 className="text-center display-6" style={{ color: '#343a40', fontWeight: 'bold', marginTop: '70px' }}>
                    Gestión de Rutas
                </h2>
            </div>

            {/* Mostrar errores o cargando */}
            {loading && <p>Cargando...</p>}
            {error && <p className='text-danger'>{error}</p>}

            <div className="row justify-content-between align-items-center mb-4">
                <div className="col-md-3 text-end">
                    <Link to="/ruta/create" className="btn btn-primary">
                        <i className="fa-solid fa-plus"></i>
                    </Link>
                </div>
            </div>

            {/* Tabla de rutas */}
            <div className="row">
                <div className="col">
                    <table className="table table-hover">
                        <thead className="table-dark">
                            <tr>
                                <th onClick={() => sortRutas('nombre')} style={{ cursor: 'pointer' }}>
                                    Nombre {getSortIcon('nombre')}
                                </th>
                                <th onClick={() => sortRutas('descripcion')} style={{ cursor: 'pointer' }}>
                                    Descripción {getSortIcon('descripcion')}
                                </th>
                                <th onClick={() => sortRutas('origen')} style={{ cursor: 'pointer' }}>
                                    Origen {getSortIcon('origen')}
                                </th>
                                <th onClick={() => sortRutas('destino')} style={{ cursor: 'pointer' }}>
                                    Destino {getSortIcon('destino')}
                                </th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentRutas.length === 0 ? (
                                <tr>
                                    <td colSpan="5">No hay rutas disponibles</td>
                                </tr>
                            ) : (
                                currentRutas.map(ruta => (
                                    <tr key={ruta.id}>
                                        <td>{ruta.nombre}</td>
                                        <td>{ruta.descripcion}</td> {/* Campo descripción agregado */}
                                        <td>{ruta.origen}</td>
                                        <td>{ruta.destino}</td>
                                        <td>
                                            <div className="d-flex gap-2">
                                                <Link to={`/ruta/edit/${ruta.id}`} className='btn btn-warning btn-sm'>
                                                    <i className="fa-regular fa-pen-to-square"></i> Editar
                                                </Link>
                                                <button onClick={() => deleteRuta(ruta.id)} className='btn btn-danger btn-sm'>
                                                    <i className="fa-regular fa-trash-can"></i> Eliminar
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

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
    );
};

export default CompShowRuta;
