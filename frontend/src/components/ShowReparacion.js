import axios from 'axios';
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const URI_REPARACIONES = 'http://localhost:8000/api/reparacion/';
const URI_VEHICULOS = 'http://localhost:8000/api/vehiculo/'; 

const CompShowReparacion = () => {
    const [reparaciones, setReparaciones] = useState([]);
    const [vehiculos, setVehiculos] = useState([]); // Para almacenar la lista de vehículos
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const resReparaciones = await axios.get(URI_REPARACIONES);
                const resVehiculos = await axios.get(URI_VEHICULOS);
                setReparaciones(resReparaciones.data);
                setVehiculos(resVehiculos.data); // Guardar vehículos en el estado
                setLoading(false);
            } catch (error) {
                setError('Error al obtener los datos de reparaciones o vehículos.');
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const deleteReparacion = async (id) => {
        try {
            const isConfirmed = window.confirm('¿Estás seguro de que deseas eliminar esta reparación?');
            if (isConfirmed) {
                await axios.delete(`${URI_REPARACIONES}${id}`);
                setReparaciones(reparaciones.filter(reparacion => reparacion.id !== id)); // Actualizar el estado después de eliminar
            }
        } catch (error) {
            console.error("Error al eliminar la reparación:", error);
        }
    };

    // Función para obtener la placa del vehículo según su ID
    const getPlacaById = (id) => {
        const vehiculo = vehiculos.find(v => v.id === id);
        return vehiculo ? vehiculo.placa : 'Desconocido'; // Retorna 'Desconocido' si no se encuentra el vehículo
    };

    return (
        <div className="container mt-5">
            <div className="row">
                <div className="col-lg-12">
                    <div className="mb-4">
                    <h2 className='text-center display-6' style={{ marginTop: '70px', color: '#343a40', fontWeight: 'bold', paddingBottom: '10px' }}>Gestión de Reparaciones</h2>
                        {/* Botón para regresar */}
                        <Link to="/vehiculo/gestion-vehiculos" className="btn btn-secondary mb-3">
                            Regresar a Gestión de Vehículos
                        </Link>
                        <Link to="/vehiculo/reparacion/create" className="btn btn-primary mb-3">
                            <i className="fa-solid fa-plus"></i>
                        </Link>
                    </div>
                    {loading && <p>Cargando...</p>}
                    {error && <p className="text-danger">{error}</p>}

                    <table className="table table-hover">
                        <thead className="table-dark">
                            <tr>
                                <th>Fecha</th>
                                <th>Descripción</th>
                                <th>Costo</th>
                                <th>Vehículo</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reparaciones.length === 0 ? (
                                <tr>
                                    <td colSpan="5">No hay registros de reparaciones disponibles</td>
                                </tr>
                            ) : (
                                reparaciones.map(reparacion => (
                                    <tr key={reparacion.id}>
                                        <td>{new Date(reparacion.fecha).toLocaleDateString('es-ES')}</td>
                                        <td>{reparacion.descripcion}</td>
                                        <td>{reparacion.costo}</td>
                                        <td>{getPlacaById(reparacion.vehiculo_id)}</td> {/* Mostrar la placa asociada */}
                                        <td>
                                            <Link to={`/vehiculo/reparacion/edit/${reparacion.id}`} className="btn btn-warning btn-sm mr-2">
                                                <i className="fa-regular fa-pen-to-square"></i>
                                            </Link>
                                            <button onClick={() => deleteReparacion(reparacion.id)} className="btn btn-danger btn-sm">
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

export default CompShowReparacion;
