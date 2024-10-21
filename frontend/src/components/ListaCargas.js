import axios from 'axios';
import { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { Button } from 'react-bootstrap';

const URI_CARGA = 'http://localhost:8000/api/carga';
const URI_ASIGNACION = 'http://localhost:8000/api/asignacion';
const URI_INVENTARIO = 'http://localhost:8000/api/inventario';

const CompListaCargas = () => {
    const [cargas, setCargas] = useState([]);
    const [filteredCargas, setFilteredCargas] = useState([]);
    const [asignaciones, setAsignaciones] = useState([]);
    const [inventarios, setInventarios] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [cargasPerPage] = useState(5);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Cargar asignaciones e inventarios primero
    useEffect(() => {
        const fetchData = async () => {
            await getAsignaciones();
            await getInventarios();
        };
        fetchData();
    }, []);

    // Una vez asignaciones e inventarios estén listos, cargar las cargas
    useEffect(() => {
        if (asignaciones.length > 0 && inventarios.length > 0) {
            getCargas();
        }
    }, [asignaciones, inventarios]);

    const getCargas = async () => {
        setLoading(true);
        try {
            const res = await axios.get(URI_CARGA);
            console.log("Datos de cargas obtenidos:", res.data); // Verificar los datos de las cargas
            const filtered = filterCargas(res.data);
            setCargas(filtered);
            setFilteredCargas(filtered);
        } catch (error) {
            setError('Error al obtener los datos de cargas');
            console.error("Error al obtener los datos de cargas:", error);
        } finally {
            setLoading(false);
        }
    };

    const getAsignaciones = async () => {
        try {
            const res = await axios.get(URI_ASIGNACION);
            console.log("Datos de asignaciones obtenidos:", res.data); // Verificar los datos de asignaciones
            setAsignaciones(res.data);
        } catch (error) {
            console.error("Error al obtener los datos de asignaciones:", error);
        }
    };

    const getInventarios = async () => {
        try {
            const res = await axios.get(URI_INVENTARIO);
            console.log("Datos de inventarios obtenidos:", res.data); // Verificar los datos de inventarios
            setInventarios(res.data);
        } catch (error) {
            console.error("Error al obtener los datos de inventarios:", error);
        }
    };

    const filterCargas = (cargas) => {
        return cargas.filter(carga => {
            const asignacion = asignaciones.find(a => a.id === carga.asignacion_id);
            console.log(`Asignación para la carga ${carga.nombre}:`, asignacion); // Depuración
            if (!asignacion) {
                console.warn(`No se encontró la asignación para la carga con ID ${carga.asignacion_id}`);
                return false;
            }
            // Verifica si el estado de la asignación está entre los estados inválidos
            const invalidStates = ['Entregada', 'Cancelada', 'Eliminada'];
            const isValid = !invalidStates.includes(asignacion.estado);
            console.log(`Estado de la asignación (${asignacion.estado}) es válido:`, isValid);
            return isValid;
        });
    };
    

    // Obtener detalles de la asignación
    const getAsignacionDetails = (asignacionId) => {
        const asignacion = asignaciones.find(a => a.id === asignacionId);
        if (asignacion) {
            return `${formatDate(asignacion.fecha_asignacion)} - ${asignacion.vehiculo.placa}`;
        }
        return 'No disponible';
    };

    // Obtener el nombre del material
    const getInventarioName = (inventarioId) => {
        const inventario = inventarios.find(i => i.id === inventarioId);
        return inventario ? inventario.material.nombre : 'No disponible';
    };

    const formatDate = (dateString) => {
        const [year, month, day] = dateString.split('-');
        return `${day}-${month}-${year}`;
    };

    // Paginación
    const indexOfLastCarga = currentPage * cargasPerPage;
    const indexOfFirstCarga = indexOfLastCarga - cargasPerPage;
    const currentCargas = filteredCargas.slice(indexOfFirstCarga, indexOfLastCarga);
    const totalPages = Math.ceil(filteredCargas.length / cargasPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className="container">
            <div className="row justify-content-center my-4">
                <h2 className="text-center display-6" style={{ color: '#343a40', fontWeight: 'bold', marginTop: '70px' }}>
                    Listado de Cargas
                </h2>
            </div>

            {loading && <p>Cargando...</p>}
            {error && <p className='text-danger'>{error}</p>}

            <div className="row">
                <div className="col">
                    <Button className="btn btn-primary float-end mb-3">
                        <i className="fa fa-plus"></i> Agregar Carga
                    </Button>
                    <table className="table table-hover">
                        <thead className="table-dark">
                            <tr>
                                <th>Nombre</th>
                                <th>Descripción</th>
                                <th>Precio Unitario</th>
                                <th>Asignación</th>
                                <th>Inventario</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentCargas.length === 0 ? (
                                <tr>
                                    <td colSpan="6">No hay cargas disponibles</td>
                                </tr>
                            ) : (
                                currentCargas.map(carga => (
                                    <tr key={carga.id}>
                                        <td>{carga.nombre}</td>
                                        <td>{carga.descripcion}</td>
                                        <td>{carga.precio_unitario}</td>
                                        <td>{getAsignacionDetails(carga.asignacion_id)}</td>
                                        <td>{getInventarioName(carga.inventario_id)}</td>
                                        <td>
                                            <button className='btn btn-info btn-sm'>
                                                <i className="fa-regular fa-eye"></i>
                                            </button>
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

export default CompListaCargas;
