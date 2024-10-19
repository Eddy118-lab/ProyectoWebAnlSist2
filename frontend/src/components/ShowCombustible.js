import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const URI = 'http://localhost:8000/api/combustible';
const URI_VEHICULO = 'http://localhost:8000/api/vehiculo'; // URI para obtener vehículos

const CompShowCombustible = () => {
    const { id } = useParams(); // Obtener el ID del vehículo de la URL
    const [combustibles, setCombustibles] = useState([]);
    const [filteredCombustibles, setFilteredCombustibles] = useState([]); // Estado para los combustibles filtrados
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sortOrder, setSortOrder] = useState('asc');
    const [sortField, setSortField] = useState('fecha');
    const [vehiculoPlaca, setVehiculoPlaca] = useState(''); // Estado para almacenar la placa del vehículo
    const [searchTerm, setSearchTerm] = useState(''); // Estado para el término de búsqueda

    const getCombustiblesByVehiculoId = useCallback(async () => {
        setLoading(true);
        try {
            const res = await axios.get(URI); // Obtener todos los combustibles
            const filtered = res.data.filter(combustible => combustible.vehiculo_id.toString() === id); // Filtrar por vehiculo_id
            setCombustibles(filtered); // Actualizar el estado con los combustibles filtrados
            setFilteredCombustibles(filtered); // Inicialmente los combustibles filtrados son los mismos
        } catch (error) {
            setError('Error al obtener los datos');
            console.error('Error al obtener los datos:', error);
        } finally {
            setLoading(false);
        }
    }, [id]);

    const getVehiculoPlaca = useCallback(async () => {
        try {
            const res = await axios.get(`${URI_VEHICULO}/${id}`); // Obtener el vehículo por ID
            setVehiculoPlaca(res.data.placa); // Asignar la placa al estado
        } catch (error) {
            console.error('Error al obtener la placa del vehículo:', error);
            setError('Error al obtener la placa del vehículo');
        }
    }, [id]);

    useEffect(() => {
        getCombustiblesByVehiculoId();
        getVehiculoPlaca(); // Llamar para obtener la placa del vehículo
    }, [getCombustiblesByVehiculoId, getVehiculoPlaca]); // Agregar las funciones como dependencias

    const deleteCombustible = async (combustibleId) => {
        try {
            const isConfirmed = window.confirm('¿Estás seguro de que deseas eliminar este registro de combustible?');
            if (isConfirmed) {
                await axios.delete(`${URI}/${combustibleId}`);
                getCombustiblesByVehiculoId(); // Actualizar la lista después de eliminar
            }
        } catch (error) {
            console.error('Error al eliminar el registro de combustible:', error);
            setError('Error al eliminar el registro');
        }
    };

    const sortCombustibles = (field) => {
        const sortedCombustibles = [...filteredCombustibles].sort((a, b) => {
            const aField = a[field]?.toString().toLowerCase() || '';
            const bField = b[field]?.toString().toLowerCase() || '';
            if (aField < bField) return sortOrder === 'asc' ? -1 : 1;
            if (aField > bField) return sortOrder === 'asc' ? 1 : -1;
            return 0;
        });
        setFilteredCombustibles(sortedCombustibles);
        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        setSortField(field);
    };

    // Función para formatear la fecha
    const formatFecha = (fecha) => {
        const [year, month, day] = fecha.split('-');
        return `${day}-${month}-${year}`; // Formato dd-mm-yyyy
    };

    // Función para manejar la búsqueda
    const handleSearch = (e) => {
        const term = e.target.value.toLowerCase();
        setSearchTerm(term);
        const filtered = combustibles.filter(combustible => {
            return (
                combustible.fecha.toLowerCase().includes(term) ||
                combustible.cantidad.toString().includes(term) ||
                combustible.costo.toString().includes(term)
            );
        });
        setFilteredCombustibles(filtered);
    };

    return (
        <div className="container mt-5">
            <div className="row">
                <div className="col-lg-12">
                    <div className="mb-4">
                        <h2 className='text-center display-6' style={{ marginTop: '70px', color: '#343a40', fontWeight: 'bold', paddingBottom: '10px' }}>
                            Gestión de Combustibles
                        </h2>

                        {/* Campo de búsqueda centrado */}
                        <div className="text-center mb-3">
                            <input
                                type="text"
                                className="form-control w-50 mx-auto"
                                placeholder="Buscar por fecha, cantidad o costo..."
                                value={searchTerm}
                                onChange={handleSearch}
                            />
                        </div>

                        <Link to="/vehiculo/gestion-vehiculos" className="btn btn-secondary mb-3">
                            Regresar a Gestión de Vehículos
                        </Link>
                        <Link to={`/vehiculo/combustible/create/${id}`} className="btn btn-primary mb-3">
                            <i className="fa-solid fa-plus"></i>
                        </Link>
                    </div>
                    {loading && <p>Cargando...</p>}
                    {error && <p className="text-danger">{error}</p>}

                    <table className="table table-hover">
                        <thead className="table-dark">
                            <tr>
                                <th onClick={() => sortCombustibles('fecha')} style={{ cursor: 'pointer' }}>
                                    Fecha {sortField === 'fecha' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
                                </th>
                                <th onClick={() => sortCombustibles('cantidad')} style={{ cursor: 'pointer' }}>
                                    Cantidad {sortField === 'cantidad' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
                                </th>
                                <th onClick={() => sortCombustibles('costo')} style={{ cursor: 'pointer' }}>
                                    Costo {sortField === 'costo' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
                                </th>
                                <th>Placa Vehículo</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredCombustibles.length === 0 ? (
                                <tr>
                                    <td colSpan="5">No hay registros de combustibles disponibles para este vehículo.</td>
                                </tr>
                            ) : (
                                filteredCombustibles.map(combustible => (
                                    <tr key={combustible.id}>
                                        <td>{formatFecha(combustible.fecha)}</td> {/* Formatear la fecha aquí */}
                                        <td>{combustible.cantidad}</td>
                                        <td>{combustible.costo}</td>
                                        <td>{vehiculoPlaca || 'Placa no disponible'}</td>
                                        <td>
                                            <Link to={`/vehiculo/combustible/edit/${id}/${combustible.id}`} className="btn btn-warning btn-sm mr-2">
                                                <i className="fa-regular fa-pen-to-square"></i>
                                            </Link>
                                            <button onClick={() => deleteCombustible(combustible.id)} className="btn btn-danger btn-sm">
                                                <i className="fa-regular fa-trash-can"></i>
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default CompShowCombustible;
