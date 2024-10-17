import axios from 'axios';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const URI_REPARACIONES = 'http://localhost:8000/api/reparacion/';
const URI_VEHICULOS = 'http://localhost:8000/api/vehiculo/';

const CompEditReparacion = () => {
    const { id } = useParams(); // Obtener el ID de la reparación
    const [fecha, setFecha] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [costo, setCosto] = useState('');
    const [vehiculoId, setVehiculoId] = useState('');
    const [vehiculos, setVehiculos] = useState([]); // Lista de vehículos
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    // Cargar los datos de la reparación y los vehículos
    useEffect(() => {
        const fetchReparacionData = async () => {
            try {
                // Obtener la reparación
                const response = await axios.get(`${URI_REPARACIONES}${id}`);
                const reparacion = response.data;

                if (!reparacion) {
                    throw new Error("Reparación no encontrada.");
                }

                // Configurar los datos de la reparación
                setFecha(new Date(reparacion.fecha).toISOString().split('T')[0]); // Formato yyyy-mm-dd
                setDescripcion(reparacion.descripcion);
                setCosto(reparacion.costo);
                setVehiculoId(reparacion.vehiculo_id); // Almacenar el ID del vehículo relacionado
            } catch (error) {
                setErrorMessage(error.response ? error.response.data.message : "Error al cargar los datos, por favor intenta nuevamente.");
            }
        };

        const fetchVehiculos = async () => {
            try {
                const vehiculoResponse = await axios.get(URI_VEHICULOS);
                setVehiculos(vehiculoResponse.data); // Almacenar la lista de vehículos
            } catch (error) {
                setErrorMessage("Error al obtener la lista de vehículos.");
            }
        };

        fetchReparacionData();
        fetchVehiculos();
    }, [id]);

    // Manejar la actualización de datos de la reparación
    const handleSubmit = async (e) => {
        e.preventDefault();

        const updatedReparacion = {
            fecha,
            descripcion,
            costo,
            vehiculo_id: vehiculoId // Asegurarse de pasar el ID correcto del vehículo seleccionado
        };

        try {
            const response = await axios.put(`${URI_REPARACIONES}${id}`, updatedReparacion);
            if (response.status === 200) {
                setSuccessMessage("Reparación actualizada con éxito!");
                setErrorMessage('');
                setTimeout(() => {
                    navigate(`/vehiculo/reparacion/gestion-reparaciones/${vehiculoId}`);
                }, 2000);
            } else {
                setErrorMessage("Error al actualizar la reparación.");
            }
        } catch (error) {
            setErrorMessage("Error al actualizar la reparación, por favor intenta nuevamente.");
        }
    };

    // Cancelar y volver
    const handleCancel = () => {
        navigate(`/vehiculo/reparacion/gestion-reparaciones/${vehiculoId}`);
    };

    return (
        <div className='container vh-100 d-flex justify-content-center align-items-center'>
            <div className="card" style={{ width: '100%', maxWidth: '800px' }}>
                <div className="card-header text-center">
                    <h2>Editar Reparación</h2>
                </div>
                <div className="card-body">
                    {successMessage && <div className="alert alert-success">{successMessage}</div>}
                    {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

                    <form onSubmit={handleSubmit} className="row g-3">
                        <div className="col-md-6">
                            <div className="form-group">
                                <label>Fecha</label>
                                <input
                                    type='date'
                                    className='form-control'
                                    value={fecha}
                                    onChange={(e) => setFecha(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Descripción</label>
                                <input
                                    type='text'
                                    className='form-control'
                                    value={descripcion}
                                    onChange={(e) => setDescripcion(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Costo</label>
                                <input
                                    type='number'
                                    className='form-control'
                                    value={costo}
                                    onChange={(e) => setCosto(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="col-md-6">
                            <div className="form-group">
                                <label>Vehículo</label>
                                <select
                                    className='form-select'
                                    value={vehiculoId}
                                    onChange={(e) => setVehiculoId(e.target.value)}
                                    required
                                >
                                    <option value="" disabled>Seleccione un vehículo</option>
                                    {vehiculos.map(vehiculo => (
                                        <option key={vehiculo.id} value={vehiculo.id}>
                                            {vehiculo.placa} - {vehiculo.modelo}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="col-12">
                            <button type='submit' className='btn btn-primary me-2'>Actualizar</button>
                            <button type='button' className='btn btn-secondary me-2' onClick={handleCancel}>Cancelar</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CompEditReparacion;
