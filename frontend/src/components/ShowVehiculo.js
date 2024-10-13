import axios from 'axios';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SearchVehiculo from './SearchProveedor.js';

const URI = 'http://localhost:8000/api/vehiculo/';

const CompShowVehiculo = () => {
    const [vehiculos, setVehiculos] = useState([]);
    const [filteredVehiculos, setFilteredVehiculos] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [vehiculosPerPage] = useState(4);
    const [sortOrder, setSortOrder] = useState('asc');
    const [sortField, setSortField] = useState('placa');

    useEffect(() => {
        getVehiculos();
    }, []);

    const getVehiculos = async () => {
        try {
            const res = await axios.get(URI);
            setVehiculos(res.data);
            setFilteredVehiculos(res.data);
        } catch (error) {
            console.error("Error al obtener los datos:", error);
        }
    };

    const deleteVehiculo = async (id) => {
        try {
            const isConfirmed = window.confirm('¿Estás seguro de que deseas eliminar este vehículo?');
            if (isConfirmed) {
                await axios.delete(`${URI}${id}`);
                getVehiculos();
            }
        } catch (error) {
            console.error("Error al eliminar el vehículo:", error);
        }
    };

    const handleSearch = (query) => {
        const filtered = vehiculos.filter(vehiculo =>
            vehiculo.placa.toLowerCase().includes(query.toLowerCase()) || 
            vehiculo.modelo.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredVehiculos(filtered);
        setCurrentPage(1);
    };

    const sortVehiculos = (field) => {
        const order = (sortField === field && sortOrder === 'asc') ? 'desc' : 'asc';
        const sortedVehiculos = [...filteredVehiculos].sort((a, b) => {
            if (a[field] < b[field]) return order === 'asc' ? -1 : 1;
            if (a[field] > b[field]) return order === 'asc' ? 1 : -1;
            return 0;
        });
        setFilteredVehiculos(sortedVehiculos);
        setSortField(field);
        setSortOrder(order);
    };

    const indexOfLastVehiculo = currentPage * vehiculosPerPage;
    const indexOfFirstVehiculo = indexOfLastVehiculo - vehiculosPerPage;
    const currentVehiculos = filteredVehiculos.slice(indexOfFirstVehiculo, indexOfLastVehiculo);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const totalPages = Math.ceil(filteredVehiculos.length / vehiculosPerPage);

    const renderSortArrow = (field) => {
        if (sortField === field) {
            return <span className="sort-arrow">{sortOrder === 'asc' ? '↑' : '↓'}</span>;
        }
        return '';
    };

    return (
        <div className='search-create-container'>
            <div className='vehiculo-management-header'>
                <h2 className='vehiculo-management-title'>Gestión de Vehículos</h2>
            </div>

            {/* Contenedor del buscador y el botón Crear Vehículo */}
            <div className='search-create-container'>
                <div className='search-container'>
                    <SearchVehiculo vehiculos={vehiculos} onSearch={handleSearch} />
                </div>
                <div className='create-btn-container'>
                    <Link to="/vehiculo/create" className='btn btn-primary'>
                        <i className="fa-solid fa-plus"></i>
                    </Link>
                </div>
            </div>

            {/* Contenedor de la tabla */}
            <div className="table-container">
                <table className='table'>
                    <thead>
                        <tr>
                            <th onClick={() => sortVehiculos('placa')}>Placa {renderSortArrow('placa')}</th>
                            <th onClick={() => sortVehiculos('modelo')}>Modelo {renderSortArrow('modelo')}</th>
                            <th onClick={() => sortVehiculos('estado')}>Estado {renderSortArrow('estado')}</th>
                            <th onClick={() => sortVehiculos('tipo_marca_id')}>Marca {renderSortArrow('tipo_marca_id')}</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentVehiculos.map((vehiculo) => (
                            <tr key={vehiculo.id}>
                                <td>{vehiculo.placa}</td>
                                <td>{vehiculo.modelo}</td>
                                <td>{vehiculo.estado}</td>
                                <td>{vehiculo.tipo_marca_id}</td>
                                <td className="actions">
                                    <Link to={`/vehiculo/edit/${vehiculo.id}`} className="btn btn-warning">
                                        <i className="fa-regular fa-pen-to-square"></i>
                                    </Link>
                                    <button onClick={() => deleteVehiculo(vehiculo.id)} className='btn btn-danger'>
                                        <i className="fa-regular fa-trash-can"></i>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Paginación */}
            <nav className='pagination-center'>
                <ul className='pagination'>
                    {[...Array(totalPages)].map((_, index) => (
                        <li key={index + 1} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                            <button onClick={() => paginate(index + 1)} className='page-link'>
                                {index + 1}
                            </button>
                        </li>
                    ))}
                </ul>
            </nav>
        </div>
    );
};

export default CompShowVehiculo;
