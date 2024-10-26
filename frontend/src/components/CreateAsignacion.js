import axios from 'axios';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const URI_ASIGNACION = 'http://localhost:8000/api/asignacion/';
const URI_CONDUCTOR = 'http://localhost:8000/api/conductor/';
const URI_VEHICULO = 'http://localhost:8000/api/vehiculo/';
const URI_RUTA = 'http://localhost:8000/api/ruta/';
const URI_TIPO_ESTADO = 'http://localhost:8000/api/tipo-estado/';

const CompCreateAsignacion = () => {
    const [conductorId, setConductorId] = useState('');
    const [vehiculoId, setVehiculoId] = useState('');
    const [rutaId, setRutaId] = useState('');
    const [estadoId, setEstadoId] = useState('');
    const [fechaAsignacion, setFechaAsignacion] = useState('');

    const [conductores, setConductores] = useState([]);
    const [vehiculos, setVehiculos] = useState([]);
    const [vehiculosDisponibles, setVehiculosDisponibles] = useState([]);
    const [conductoresDisponibles, setConductoresDisponibles] = useState([]);
    const [rutas, setRutas] = useState([]);
    const [estados, setEstados] = useState([]);

    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const resConductores = await axios.get(URI_CONDUCTOR);
                const resVehiculos = await axios.get(URI_VEHICULO);
                const resRutas = await axios.get(URI_RUTA);
                const resEstados = await axios.get(URI_TIPO_ESTADO);

                setConductores(resConductores.data);

                // Filtrar solo vehículos con estado "Activo"
                const vehiculosActivos = resVehiculos.data.filter(vehiculo => vehiculo.estado === "Activo");
                setVehiculos(vehiculosActivos);

                setRutas(resRutas.data);
                
                // Filtrar estados para incluir solo "Procesada"
                const estadosFiltrados = resEstados.data.filter(estado => 
                    estado.descripcion === "Procesada"
                );
                setEstados(estadosFiltrados);
            } catch (error) {
                console.error("Error al obtener los datos:", error);
                setErrorMessage("Error al obtener datos.");
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        const fetchDisponibles = async () => {
            if (fechaAsignacion) {
                try {
                    // Preguntar al usuario si se habilita doble turno
                    const habilitarDobleTurno = window.confirm("¿Hay doble turno para esta fecha?");
                    
                    // Obtener todas las asignaciones para la fecha seleccionada
                    const resAsignaciones = await axios.get(`${URI_ASIGNACION}?fecha_asignacion=${fechaAsignacion}`);
                    const asignaciones = resAsignaciones.data;
    
                    // Filtrar las asignaciones en función de si se habilita doble turno
                    const asignacionesFiltradas = asignaciones.filter(a => {
                        if (habilitarDobleTurno) {
                            // Permitir solo aquellos que están "Entregada" para el doble turno
                            return a.estado === 'Entregada';
                        }
                        // Sin doble turno, incluir solo asignaciones que aún no están procesadas
                        return a.estado !== 'Entregada';
                    });
    
                    // Identificar vehículos y conductores que ya están asignados y procesados (si hay doble turno)
                    const vehiculosAsignados = asignacionesFiltradas.map(a => a.vehiculo_id);
                    const conductoresAsignados = asignacionesFiltradas.map(a => a.conductor_id);
    
                    // Filtrar vehículos y conductores según la lógica de doble turno y asignaciones previas
                    const vehiculosDisponibles = vehiculos.filter(v => {
                        if (habilitarDobleTurno) {
                            // Solo permitir vehículos no asignados o ya procesados una vez en el día
                            return !vehiculosAsignados.includes(v.id) || asignaciones.some(a => a.vehiculo_id === v.id && a.estado === 'Entregada');
                        }
                        return !vehiculosAsignados.includes(v.id);
                    });
    
                    const conductoresDisponibles = conductores.filter(c => {
                        if (habilitarDobleTurno) {
                            // Solo permitir conductores no asignados o ya procesados una vez en el día
                            return !conductoresAsignados.includes(c.id) || asignaciones.some(a => a.conductor_id === c.id && a.estado === 'Entregada');
                        }
                        return !conductoresAsignados.includes(c.id);
                    });
    
                    // Actualizar el estado con los vehículos y conductores disponibles
                    setVehiculosDisponibles(vehiculosDisponibles);
                    setConductoresDisponibles(conductoresDisponibles);
    
                } catch (error) {
                    console.error("Error al filtrar vehículos y conductores:", error);
                    setErrorMessage("Error al filtrar vehículos y conductores.");
                }
            } else {
                setVehiculosDisponibles(vehiculos);
                setConductoresDisponibles(conductores);
            }
        };
    
        fetchDisponibles();
    }, [fechaAsignacion, vehiculos, conductores]);
    
    

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newAsignacion = {
            fecha_asignacion: fechaAsignacion,
            conductor_id: conductorId,
            vehiculo_id: vehiculoId,
            ruta_id: rutaId,
            tipo_estado_id: estadoId,
        };

        try {
            const response = await axios.post(URI_ASIGNACION, newAsignacion);
            if (response.status === 201) {
                setSuccessMessage("Asignación creada con éxito!");
                setErrorMessage('');
                setTimeout(() => {
                    navigate('/asignacion/gestion-asignaciones');
                }, 2000);
            } else {
                setErrorMessage("Error al crear la asignación.");
            }
        } catch (error) {
            console.error("Error al enviar datos:", error);
            setErrorMessage("Error al crear la asignación.");
        }
    };

    const handleCancel = () => {
        navigate('/asignacion/gestion-asignaciones');
    };

    // Calcular fechas min y max
    const today = new Date();
    const maxDate = today.toISOString().split('T')[0];
    const minDate = new Date(today);
    minDate.setDate(today.getDate() - 7); // 7 días atrás
    const minDateString = minDate.toISOString().split('T')[0];

    return (
        <div className='container vh-100 d-flex justify-content-center align-items-center'>
            <div className="card" style={{ maxWidth: '600px', width: '100%', maxHeight: '100%' }}>
                <div className="card-header text-center">
                    <h2>Crear Asignación</h2>
                </div>
                <div className="card-body">
                    {successMessage && <div className="alert alert-success">{successMessage}</div>}
                    {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
                    
                    <form onSubmit={handleSubmit} className="row g-3">
                        <div className="col-md-6">
                            <div className="form-group">
                                <label>Conductor</label>
                                <select
                                    className="form-select"
                                    value={conductorId}
                                    onChange={(e) => setConductorId(e.target.value)}
                                    required
                                >
                                    <option value="">Seleccione un conductor</option>
                                    {conductoresDisponibles.map((conductor) => (
                                        <option key={conductor.id} value={conductor.id}>
                                            {conductor.primer_nom} {conductor.primer_apell}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Vehículo</label>
                                <select
                                    className="form-select"
                                    value={vehiculoId}
                                    onChange={(e) => setVehiculoId(e.target.value)}
                                    required
                                >
                                    <option value="">Seleccione un vehículo</option>
                                    {vehiculosDisponibles.map((vehiculo) => (
                                        <option key={vehiculo.id} value={vehiculo.id}>
                                            {vehiculo.placa}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        
                        <div className="col-md-6">
                            <div className="form-group">
                                <label>Ruta</label>
                                <select
                                    className="form-select"
                                    value={rutaId}
                                    onChange={(e) => setRutaId(e.target.value)}
                                    required
                                >
                                    <option value="">Seleccione una ruta</option>
                                    {rutas.map((ruta) => (
                                        <option key={ruta.id} value={ruta.id}>
                                            {ruta.nombre}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Estado</label>
                                <select
                                    className="form-select"
                                    value={estadoId}
                                    onChange={(e) => setEstadoId(e.target.value)}
                                    required
                                >
                                    <option value="">Seleccione un estado</option>
                                    {estados.map((estado) => (
                                        <option key={estado.id} value={estado.id}>
                                            {estado.descripcion}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="col-md-6">
                            <div className="form-group">
                                <label>Fecha de Asignación</label>
                                <input
                                    type="date"
                                    className="form-control"
                                    value={fechaAsignacion}
                                    onChange={(e) => setFechaAsignacion(e.target.value)}
                                    required
                                    min={minDateString}
                                    max={maxDate}
                                />
                            </div>
                        </div>

                        <div className="col-12">
                            <div className="d-flex justify-content-center">
                                <button type="submit" className="btn btn-primary me-2">
                                    Guardar
                                </button>
                                <button type="button" className="btn btn-secondary" onClick={handleCancel}>
                                    Cancelar
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CompCreateAsignacion;
