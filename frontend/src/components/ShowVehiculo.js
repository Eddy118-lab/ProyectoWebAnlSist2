import axios from 'axios';
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const URI_VEHICULOS = 'http://localhost:8000/api/vehiculo/';
const URI_MARCAS = 'http://localhost:8000/api/tipo-marca/';

const CompShowVehiculo = () => {
    const [vehiculos, setVehiculos] = useState([]);
    const [filteredVehiculos, setFilteredVehiculos] = useState([]);
    const [marcas, setMarcas] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [vehiculosPerPage] = useState(4);
    const [sortOrder, setSortOrder] = useState('asc');
    const [sortField, setSortField] = useState('placa');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        getVehiculos();
        getMarcas();
    }, []);

    const getVehiculos = async () => {
        try {
            const res = await axios.get(URI_VEHICULOS);
            setVehiculos(res.data);
            setFilteredVehiculos(res.data);
            setLoading(false);
        } catch (error) {
            setError('Error al obtener los datos de vehículos.');
            setLoading(false);
        }
    };

    const getMarcas = async () => {
        try {
            const res = await axios.get(URI_MARCAS);
            setMarcas(res.data);
        } catch (error) {
            setError('Error al obtener las marcas.');
        }
    };

    const deleteVehiculo = async (id) => {
        try {
            const isConfirmed = window.confirm('¿Estás seguro de que deseas eliminar este vehículo?');
            if (isConfirmed) {
                await axios.delete(`${URI_VEHICULOS}${id}`);
                getVehiculos();
            }
        } catch (error) {
            console.error("Error al eliminar el vehículo:", error);
        }
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

    const renderSortIcon = (field) => {
        if (sortField === field) {
            return sortOrder === 'asc' ? '↑' : '↓';
        }
        return '';
    };

    const getMarcaNombre = (id) => {
        const marca = marcas.find(m => m.id === id);
        return marca ? marca.nombre : 'Desconocida';
    };

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchQuery(value);
        const filtered = vehiculos.filter(vehiculo =>
            vehiculo.placa.toLowerCase().includes(value.toLowerCase()) ||
            vehiculo.modelo.toLowerCase().includes(value.toLowerCase()) ||
            vehiculo.estado.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredVehiculos(filtered);
        setCurrentPage(1);
    };

    // Función para actualizar el estado del vehículo
    const updateVehiculoEstado = async (id, estadoActual) => {
        try {
            await axios.patch(`${URI_VEHICULOS}${id}/estado`);
            getVehiculos(); // Vuelve a obtener los vehículos para reflejar el cambio
        } catch (error) {
            console.error("Error al actualizar el estado del vehículo:", error);
        }
    };

    return (
        <div className="container mt-5">
            <div className="row">
                <div className="col-lg-12">
                    <div className="mb-4 text-center">
                        <h2 className='text-center display-6' style={{ marginTop: '70px', color: '#343a40', fontWeight: 'bold', paddingBottom: '10px' }}>
                            Gestión de Vehículos
                        </h2>

                        <div className="d-flex justify-content-center mb-3">
                            <input
                                type="text"
                                className="form-control"
                                style={{ maxWidth: '500px' }}
                                placeholder="Buscar por placa, modelo o estado..."
                                value={searchQuery}
                                onChange={handleSearchChange}
                            />
                        </div>

                        <Link to="/vehiculo/create" className="btn btn-primary mb-3">
                            <i className="fa-solid fa-plus"></i>
                        </Link>
                    </div>

                    {loading && <p>Cargando...</p>}
                    {error && <p className="text-danger">{error}</p>}

                    <table className="table table-hover">
                        <thead className="table-dark">
                            <tr>
                                <th onClick={() => sortVehiculos('placa')} style={{ cursor: 'pointer' }}>
                                    Placa {renderSortIcon('placa')}
                                </th>
                                <th onClick={() => sortVehiculos('modelo')} style={{ cursor: 'pointer' }}>
                                    Modelo {renderSortIcon('modelo')}
                                </th>
                                <th onClick={() => sortVehiculos('estado')} style={{ cursor: 'pointer' }}>
                                    Estado {renderSortIcon('estado')}
                                </th>
                                <th onClick={() => sortVehiculos('tipo_marca_id')} style={{ cursor: 'pointer' }}>
                                    Marca {renderSortIcon('tipo_marca_id')}
                                </th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentVehiculos.length === 0 ? (
                                <tr>
                                    <td colSpan="5">No hay registros de vehículos disponibles</td>
                                </tr>
                            ) : (
                                currentVehiculos.map(vehiculo => (
                                    <tr key={vehiculo.id}>
                                        <td>{vehiculo.placa}</td>
                                        <td>{vehiculo.modelo}</td>
                                        <td>
                                            <button 
                                                onClick={() => updateVehiculoEstado(vehiculo.id, vehiculo.estado)}
                                                className={`btn btn-sm ${vehiculo.estado.toLowerCase() === 'activo' ? 'btn-success' : 'btn-secondary'}`}
                                            >
                                                {vehiculo.estado === 'activo' ? 'Activo' : 'Inactivo'}
                                            </button>
                                        </td>
                                        <td>{getMarcaNombre(vehiculo.tipo_marca_id)}</td>
                                        <td>
                                            <Link 
                                                to={`/vehiculo/edit/${vehiculo.id}`} 
                                                className="btn btn-warning btn-sm mr-2" 
                                                tabIndex={vehiculo.estado.toLowerCase() === 'inactivo' ? -1 : 0} // Evitar la navegación del teclado
                                                aria-disabled={vehiculo.estado.toLowerCase() === 'inactivo'} // Añadir atributo de accesibilidad
                                                style={{ pointerEvents: vehiculo.estado.toLowerCase() === 'inactivo' ? 'none' : 'auto', opacity: vehiculo.estado.toLowerCase() === 'inactivo' ? 0.5 : 1 }} // Estilo visual
                                            >
                                                <i className="fa-regular fa-pen-to-square"></i>
                                            </Link>
                                            <button 
                                                onClick={() => deleteVehiculo(vehiculo.id)} 
                                                className="btn btn-danger btn-sm" 
                                                disabled={vehiculo.estado.toLowerCase() === 'inactivo'} // Deshabilitar si está inactivo
                                            >
                                                <i className="fa-regular fa-trash-can"></i>
                                            </button>
                                            <Link 
                                                to={`/vehiculo/combustible/gestion-combustibles/${vehiculo.id}`} 
                                                className="btn btn-secondary btn-sm ml-2" 
                                                tabIndex={vehiculo.estado.toLowerCase() === 'inactivo' ? -1 : 0} // Evitar la navegación del teclado
                                                aria-disabled={vehiculo.estado.toLowerCase() === 'inactivo'} // Añadir atributo de accesibilidad
                                                style={{ pointerEvents: vehiculo.estado.toLowerCase() === 'inactivo' ? 'none' : 'auto', opacity: vehiculo.estado.toLowerCase() === 'inactivo' ? 0.5 : 1 }} // Estilo visual
                                            >
                                                <i className="fa-solid fa-gas-pump"></i>
                                            </Link>
                                            <Link 
                                                to={`/vehiculo/reparacion/gestion-reparaciones/${vehiculo.id}`} 
                                                className="btn btn-dark btn-sm ml-2" 
                                                tabIndex={vehiculo.estado.toLowerCase() === 'inactivo' ? -1 : 0} // Evitar la navegación del teclado
                                                aria-disabled={vehiculo.estado.toLowerCase() === 'inactivo'} // Añadir atributo de accesibilidad
                                                style={{ pointerEvents: vehiculo.estado.toLowerCase() === 'inactivo' ? 'none' : 'auto', opacity: vehiculo.estado.toLowerCase() === 'inactivo' ? 0.5 : 1 }} // Estilo visual
                                            >
                                                <i className="fa-solid fa-wrench"></i>
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>

                    <nav>
                        <ul className="pagination">
                            {Array.from({ length: totalPages }, (_, index) => (
                                <li key={index} className={`page-item ${index + 1 === currentPage ? 'active' : ''}`}>
                                    <button className="page-link" onClick={() => paginate(index + 1)}>
                                        {index + 1}
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

export default CompShowVehiculo;
