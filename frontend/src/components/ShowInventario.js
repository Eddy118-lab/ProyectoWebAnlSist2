import axios from 'axios';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Styles/StyleInventario.css'; // Archivo de estilos
import '@fortawesome/fontawesome-free/css/all.min.css'; // Iconos de FontAwesome
import SearchInventario from './SearchInventario.js'; // Asegúrate de crear el componente de búsqueda si lo necesitas

const URI = 'http://localhost:8000/api/inventario';

const CompShowInventario = () => {
    // Estados
    const [inventarios, setInventarios] = useState([]);
    const [filteredInventarios, setFilteredInventarios] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [inventariosPerPage] = useState(4);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sortOrder, setSortOrder] = useState('asc');
    const [sortField, setSortField] = useState('cantidad');

    // Efecto para cargar los inventarios
    useEffect(() => {
        getInventarios();
    }, []);

    // Función para obtener los inventarios desde la API
    const getInventarios = async () => {
        setLoading(true); // Indica que los datos están cargando
        setError(null); // Reinicia el estado de error antes de la solicitud
        try {
            const response = await axios.get(URI);
            setInventarios(response.data); // Almacena los datos en el estado
            setFilteredInventarios(response.data); // Inicializa los inventarios filtrados
        } catch (err) {
            setError('Error al obtener los inventarios');
            console.error('Error al obtener los inventarios:', err);
        } finally {
            setLoading(false); // Finaliza el estado de carga
        }
    };

    // Función para manejar la búsqueda
    const handleSearch = (query) => {
        const filtered = inventarios.filter(inventario =>
            inventario.material?.nombre.toLowerCase().includes(query.toLowerCase()) || // Asumiendo que material tiene un campo nombre
            inventario.precio_unitario.toString().includes(query) ||
            inventario.cantidad.toString().includes(query)
        );
        setFilteredInventarios(filtered);
        setCurrentPage(1);
    };

    const formatDate = (dateString) => {
        const [year, month, day] = dateString.split('-');
        return `${day}/${month}/${year}`;
    };

    // Función para ordenar los inventarios
    const sortInventarios = (field) => {
        const sortedInventarios = [...filteredInventarios].sort((a, b) => {
            const aField = a[field] || 0; // Default to 0 for numbers
            const bField = b[field] || 0; // Default to 0 for numbers
            if (aField < bField) return sortOrder === 'asc' ? -1 : 1;
            if (aField > bField) return sortOrder === 'asc' ? 1 : -1;
            return 0;
        });
        setFilteredInventarios(sortedInventarios);
        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        setSortField(field);
    };

    const getSortIcon = (field) => {
        if (field !== sortField) return null;
        return sortOrder === 'asc' ? '↑' : '↓';
    };

    // Paginación
    const indexOfLastInventario = currentPage * inventariosPerPage;
    const indexOfFirstInventario = indexOfLastInventario - inventariosPerPage;
    const currentInventarios = filteredInventarios.slice(indexOfFirstInventario, indexOfLastInventario);
    const totalPages = Math.ceil(filteredInventarios.length / inventariosPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className="container mt-5">
            <div className="row">
                <div className="col">
                    <div className="search-create-container">
                        <div className='user-management-header'>
                            <h2 className='user-management-title-cliente'>Gestión de Inventario</h2>
                        </div>
                        <div className="search-create-wrapper">
                            <div className="search-container">
                                <SearchInventario onSearch={handleSearch} />
                            </div>
                            <div className="create-btn-container">
                                <Link to="/inventario/create" className="btn btn-primary">
                                    <i className="fa-solid fa-plus"></i>
                                </Link>
                            </div>
                        </div>
                    </div>

                    {loading ? (
                        <p>Cargando inventarios...</p>
                    ) : error ? (
                        <p className="text-danger">{error}</p>
                    ) : (
                        <div className="table-container">
                            <table className="table table-hover">
                                <thead className="table-primary">
                                    <tr>
                                        <th onClick={() => sortInventarios('cantidad')} style={{ cursor: 'pointer' }}>
                                            Cantidad {getSortIcon('cantidad')}
                                        </th>
                                        <th onClick={() => sortInventarios('precio_unitario')} style={{ cursor: 'pointer' }}>
                                            Precio Unitario {getSortIcon('precio_unitario')}
                                        </th>
                                        <th onClick={() => sortInventarios('fecha_ingreso')} style={{ cursor: 'pointer' }}>
                                            Fecha Ingreso {getSortIcon('fecha_ingreso')}
                                        </th>
                                        <th onClick={() => sortInventarios('stock_min')} style={{ cursor: 'pointer' }}>
                                            Stock Mínimo {getSortIcon('stock_min')}
                                        </th>
                                        <th onClick={() => sortInventarios('stock_max')} style={{ cursor: 'pointer' }}>
                                            Stock Máximo {getSortIcon('stock_max')}
                                        </th>
                                        <th onClick={() => sortInventarios('material.nombre')} style={{ cursor: 'pointer' }}>
                                            Material {getSortIcon('material.nombre')}
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentInventarios.length === 0 ? (
                                        <tr>
                                            <td colSpan="6" className="text-center">No hay inventarios disponibles</td>
                                        </tr>
                                    ) : (
                                        currentInventarios.map((inventario) => (
                                            <tr key={inventario.id}>
                                                <td>{inventario.cantidad}</td>
                                                <td>Q.{inventario.precio_unitario}</td>
                                                <td>{formatDate(inventario.fecha_ingreso)}</td>
                                                <td>{inventario.stock_min}</td>
                                                <td>{inventario.stock_max}</td>
                                                <td>{inventario.material ? inventario.material.nombre : 'N/A'}</td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Paginación */}
                    <nav className="d-flex justify-content-center">
                        <ul className="pagination">
                            {[...Array(totalPages).keys()].map(number => (
                                <li key={number + 1} className={`page-item ${number + 1 === currentPage ? 'active' : ''}`}>
                                    <button onClick={() => paginate(number + 1)} className="page-link">
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

export default CompShowInventario;
