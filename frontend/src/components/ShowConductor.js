import axios from 'axios';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Styles/StyleConductor.css'; // Importa el archivo CSS
import SearchConductor from './SearchConductor.js';
import '@fortawesome/fontawesome-free/css/all.min.css';

const URI = 'http://localhost:8000/api/conductor';
const URI_IMG = 'http://localhost:8000/uploads/'; // Constante para la URL de las imágenes

const CompShowConductor = () => {
    const [conductores, setConductores] = useState([]);
    const [filteredConductores, setFilteredConductores] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [conductoresPerPage] = useState(4);
    const [loading, setLoading] = useState(true); 
    const [error, setError] = useState(null); 

    const [sortOrder, setSortOrder] = useState('asc'); 
    const [sortField, setSortField] = useState('primer_nom'); 

    useEffect(() => {
        getConductores();
    }, []);

    const getConductores = async () => {
        setLoading(true);
        try {
            const res = await axios.get(URI);
            setConductores(res.data);
            setFilteredConductores(res.data);
        } catch (error) {
            setError('Error al obtener los datos');
            console.error("Error al obtener los datos:", error);
        } finally {
            setLoading(false);
        }
    };

    const deleteConductor = async (id) => {
        try {
            const isConfirmed = window.confirm('¿Estás seguro de que deseas eliminar este conductor?');
            if (isConfirmed) {
                await axios.delete(`${URI}/${id}`);
                getConductores();
            }
        } catch (error) {
            console.error("Error al eliminar el conductor:", error);
            setError('Error al eliminar el conductor');
        }
    };

    const handleSearch = (query) => {
        const filtered = conductores.filter(conductor =>
            `${conductor.primer_nom} ${conductor.segundo_nombre} ${conductor.primer_apell} ${conductor.segundo_apell}`
                .toLowerCase().includes(query.toLowerCase()) ||
            conductor.email.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredConductores(filtered);
        setCurrentPage(1);
    };

    const sortConductores = (field) => {
        const sortedConductores = [...filteredConductores].sort((a, b) => {
            const aField = a[field]?.toLowerCase() || '';
            const bField = b[field]?.toLowerCase() || '';
            if (aField < bField) return sortOrder === 'asc' ? -1 : 1;
            if (aField > bField) return sortOrder === 'asc' ? 1 : -1;
            return 0;
        });
        setFilteredConductores(sortedConductores);
        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        setSortField(field);
    };

    const getSortIcon = (field) => {
        if (field !== sortField) return null;
        return sortOrder === 'asc' ? '↑' : '↓';
    };

    const indexOfLastConductor = currentPage * conductoresPerPage;
    const indexOfFirstConductor = indexOfLastConductor - conductoresPerPage;
    const currentConductores = filteredConductores.slice(indexOfFirstConductor, indexOfLastConductor);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);
    const totalPages = Math.ceil(filteredConductores.length / conductoresPerPage);

    return (
        <div className="container">
            <div className="row">
                <div className="col">
                    <div className="search-create-container">
                        <div className='user-management-header'>
                            <h2 className='user-management-title'>Gestión de Conductores</h2>
                        </div>
                        <div className="search-create-wrapper">
                            <div className="search-container">
                                <SearchConductor conductores={conductores} onSearch={handleSearch} />
                            </div>
                            <div className="create-btn-container">
                                <Link to="/conductor/create" className="btn btn-primary">
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
                                <th onClick={() => sortConductores('primer_nom')} style={{ cursor: 'pointer' }}>
                                    Primer Nombre {getSortIcon('primer_nom')}
                                </th>
                                <th onClick={() => sortConductores('segundo_nombre')} style={{ cursor: 'pointer' }}>
                                    Segundo Nombre {getSortIcon('segundo_nombre')}
                                </th>
                                <th onClick={() => sortConductores('primer_apell')} style={{ cursor: 'pointer' }}>
                                    Primer Apellido {getSortIcon('primer_apell')}
                                </th>
                                <th onClick={() => sortConductores('segundo_apell')} style={{ cursor: 'pointer' }}>
                                    Segundo Apellido {getSortIcon('segundo_apell')}
                                </th>
                                <th onClick={() => sortConductores('no_licencia')} style={{ cursor: 'pointer' }}>
                                    No. Licencia {getSortIcon('no_licencia')}
                                </th>
                                <th>Teléfono</th>
                                <th>Email</th>
                                <th>Fecha de Contratación</th>
                                <th>Imágenes</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentConductores.length === 0 ? (
                                <tr>
                                    <td colSpan="10">No hay conductores disponibles</td>
                                </tr>
                            ) : (
                                currentConductores.map(conductor => (
                                    <tr key={conductor.id}>
                                        <td>{conductor.primer_nom}</td>
                                        <td>{conductor.segundo_nombre}</td>
                                        <td>{conductor.primer_apell}</td>
                                        <td>{conductor.segundo_apell}</td>
                                        <td>{conductor.no_licencia}</td>
                                        <td>{conductor.telefono}</td>
                                        <td>{conductor.email}</td>
                                        <td>{new Date(conductor.fecha_contratacion).toLocaleDateString()}</td>
                                        <td>
                                            <img
                                                src={`${URI_IMG}${conductor.front_imagen_url}`}
                                                alt={`Licencia Frontal de ${conductor.primer_nom}`}
                                                className="image-thumbnail"
                                                style={{ width: '100px', height: 'auto' }} 
                                            />
                                            <img
                                                src={`${URI_IMG}${conductor.tras_imagen_url}`}
                                                alt={`Licencia Trasera de ${conductor.primer_nom}`}
                                                className="image-thumbnail"
                                                style={{ width: '100px', height: 'auto' }} 
                                            />
                                        </td>
                                        <td>
                                            <Link to={`/conductor/edit/${conductor.id}`} className='btn btn-warning btn-sm mr-2'>
                                                <i className="fa-regular fa-pen-to-square"></i>
                                            </Link>
                                            <button onClick={() => deleteConductor(conductor.id)} className='btn btn-danger btn-sm'>
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

export default CompShowConductor;
