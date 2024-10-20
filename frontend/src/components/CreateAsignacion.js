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
    const [fechaAsignacion, setFechaAsignacion] = useState(''); // Nuevo campo

    const [conductores, setConductores] = useState([]);
    const [vehiculos, setVehiculos] = useState([]);
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
                setVehiculos(resVehiculos.data);
                setRutas(resRutas.data);
                setEstados(resEstados.data);
            } catch (error) {
                console.error("Error al obtener los datos:", error);
                setErrorMessage("Error al obtener datos.");
            }
        };

        fetchData();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newAsignacion = {
            fecha_asignacion: fechaAsignacion, // Se agrega la fecha
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
                                    {conductores.map((conductor) => (
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
                                    {vehiculos.map((vehiculo) => (
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
                                            {estado.id} {estado.descripcion}
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
                                />
                            </div>
                        </div>

                        <div className="col-12">
                            <div className="d-flex justify-content-center">
                                <button type="submit" className="btn btn-primary me-2">
                                    Guardar
                                </button>
                                <button type="button" className="btn btn-secondary me-2" onClick={handleCancel}>
                                    Cancelar
                                </button>
                                <button type="button" className="btn btn-info me-2" onClick={() => navigate('/asignacion/tipo-estado/gestion-tipos-estados')}>
                                    Gestión de Estados
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
