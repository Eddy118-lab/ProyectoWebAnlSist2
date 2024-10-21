import axios from 'axios';
import { useState, useEffect, useCallback } from 'react';
import { Link, useParams } from 'react-router-dom';

const URI_REPARACIONES = 'http://localhost:8000/api/reparacion/';
const URI_VEHICULOS = 'http://localhost:8000/api/vehiculo';

const CompShowReparacion = () => {
    const { id: vehiculo_id } = useParams(); // Obtener el ID del vehículo de la URL
    const [reparaciones, setReparaciones] = useState([]);
    const [filteredReparaciones, setFilteredReparaciones] = useState([]); // Estado para las reparaciones filtradas
    const [vehiculo, setVehiculo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState(''); // Estado para el término de búsqueda

    const getReparacionesByVehiculoId = useCallback(async () => {
        setLoading(true);
        try {
            const res = await axios.get(URI_REPARACIONES);
            const filteredReparaciones = res.data.filter(reparacion => reparacion.vehiculo_id.toString() === vehiculo_id);
            setReparaciones(filteredReparaciones);
            setFilteredReparaciones(filteredReparaciones); // Inicialmente los reparaciones filtradas son los mismos
        } catch (error) {
            setError('Error al obtener las reparaciones.');
            console.error('Error al obtener las reparaciones:', error);
        } finally {
            setLoading(false);
        }
    }, [vehiculo_id]);

    const getVehiculoData = useCallback(async () => {
        try {
            const res = await axios.get(`${URI_VEHICULOS}/${vehiculo_id}`);
            setVehiculo(res.data);
        } catch (error) {
            setError('Error al obtener los datos del vehículo.');
            console.error('Error al obtener los datos del vehículo:', error);
        }
    }, [vehiculo_id]);

    useEffect(() => {
        getReparacionesByVehiculoId();
        getVehiculoData();
    }, [getReparacionesByVehiculoId, getVehiculoData]);

    const deleteReparacion = async (reparacionId) => {
        try {
            const isConfirmed = window.confirm('¿Estás seguro de que deseas eliminar esta reparación?');
            if (isConfirmed) {
                await axios.delete(`${URI_REPARACIONES}${reparacionId}`);
                getReparacionesByVehiculoId(); // Actualizar la lista después de eliminar
            }
        } catch (error) {
            console.error('Error al eliminar la reparación:', error);
            setError('Error al eliminar la reparación.');
        }
    };

    // Función para formatear la fecha
    const formatFecha = (fecha) => {
        const [year, month, day] = fecha.split('-');
        return `${day}-${month}-${year}`;
    };

    // Función para manejar la búsqueda
    const handleSearch = (e) => {
        const term = e.target.value.toLowerCase();
        setSearchTerm(term);
        const filtered = reparaciones.filter(reparacion => {
            return (
                reparacion.descripcion.toLowerCase().includes(term) ||
                reparacion.costo.toString().includes(term) ||
                formatFecha(reparacion.fecha).includes(term) // Formatear fecha para búsqueda
            );
        });
        setFilteredReparaciones(filtered);
    };

    return (
        <div className="container mt-5">
            <div className="row">
                <div className="col-lg-12">
                    <h2 className="text-center display-6" style={{ marginTop: '90px', color: '#343a40', fontWeight: 'bold', paddingBottom: '10px' }}>
                        Gestión de Reparaciones
                    </h2>

                    {/* Campo de búsqueda centrado */}
                    <div className="text-center mb-3">
                        <input
                            type="text"
                            className="form-control w-50 mx-auto"
                            placeholder="Buscar por descripción, costo o fecha..."
                            value={searchTerm}
                            onChange={handleSearch}
                        />
                    </div>

                    <Link to="/vehiculo/gestion-vehiculos" className="btn btn-secondary mb-3">
                        Regresar a Gestión de Vehículos
                    </Link>
                    <Link to={`/vehiculo/reparacion/create/${vehiculo_id}`} className="btn btn-primary mb-3">
                        <i className="fa-solid fa-plus"></i>
                    </Link>
                    {loading && <p>Cargando...</p>}
                    {error && <p className="text-danger">{error}</p>}
                    <table className="table table-hover">
                        <thead className="table-dark">
                            <tr>
                                <th>Descripción</th>
                                <th>Costo</th>
                                <th>Fecha</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredReparaciones.length === 0 ? (
                                <tr>
                                    <td colSpan="4">No hay reparaciones registradas.</td>
                                </tr>
                            ) : (
                                filteredReparaciones.map((reparacion) => (
                                    <tr key={reparacion.id}>
                                        <td>{reparacion.descripcion}</td>
                                        <td>{reparacion.costo}</td>
                                        <td>{formatFecha(reparacion.fecha)}</td> {/* Formatear la fecha aquí */}
                                        <td>
                                            {vehiculo ? (
                                                <>
                                                    <Link
                                                        to={`/vehiculo/reparacion/edit/${vehiculo.id}/${reparacion.id}`}
                                                        className="btn btn-warning btn-sm mr-2"
                                                    >
                                                        <i className="fa-regular fa-pen-to-square"></i>
                                                    </Link>
                                                    <button
                                                        onClick={() => deleteReparacion(reparacion.id)}
                                                        className="btn btn-danger btn-sm"
                                                    >
                                                        <i className="fa-regular fa-trash-can"></i>
                                                    </button>
                                                </>
                                            ) : (
                                                <span>Cargando vehículo...</span>
                                            )}
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

export default CompShowReparacion;
