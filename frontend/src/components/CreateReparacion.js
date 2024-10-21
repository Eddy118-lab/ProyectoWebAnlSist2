import axios from 'axios';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'; // Asegúrate de tener Bootstrap importado

const URI_VEHICULO = 'http://localhost:8000/api/vehiculo/'; // Asegúrate de que este URI sea correcto
const URI_REPARACION = 'http://localhost:8000/api/reparacion/'; // URI para las reparaciones

const CompCreateReparacion = () => {
    const { id } = useParams(); // Obtener el ID del vehículo de la URL
    const [fecha, setFecha] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [costo, setCosto] = useState('');
    const [vehiculoId] = useState(id); // Almacena solo el ID del vehículo
    const [vehiculo, setVehiculo] = useState(null); // Para almacenar el vehículo
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchVehiculo = async () => {
            try {
                const res = await axios.get(`${URI_VEHICULO}${id}`);
                setVehiculo(res.data); // Almacenar el vehículo completo
            } catch (error) {
                console.error("Error al obtener el vehículo:", error);
                setErrorMessage("Error al obtener el vehículo.");
            }
        };

        fetchVehiculo();
    }, [id]); // Agregar id como dependencia

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Verifica si el vehículo ya está activo
        if (vehiculo?.estado === 'Activo') {
            setErrorMessage("El vehículo ya está activo.");
            return;
        }

        // Primero, actualiza el estado del vehículo a "activo"
        try {
            await axios.patch(`${URI_VEHICULO}${id}/estado`, { estado: 'Activo' });
            setVehiculo({ ...vehiculo, estado: 'Activo' }); // Actualizar el estado localmente
        } catch (error) {
            console.error("Error al actualizar el estado del vehículo:", error);
            setErrorMessage("Error al actualizar el estado del vehículo.");
            return;
        }

        // Ahora, procede a crear la reparación
        const newReparacion = {
            fecha,
            descripcion,
            costo,
            vehiculo_id: vehiculoId // Enviamos el ID del vehículo seleccionado
        };

        try {
            const response = await axios.post(URI_REPARACION, newReparacion);
            if (response.status === 201) {
                setSuccessMessage("Reparación creada con éxito!");
                setErrorMessage('');
                setTimeout(() => {
                    navigate(`/vehiculo/reparacion/gestion-reparaciones/${vehiculoId}`); // Redirigir al módulo Gestión de Reparaciones después de 2 segundos
                }, 2000);
            } else {
                setErrorMessage("Error al crear la reparación.");
            }
        } catch (error) {
            console.error("Error al enviar los datos:", error);
            setErrorMessage("Error al crear la reparación.");
        }
    };

    const handleCancel = () => {
        navigate(`/vehiculo/reparacion/gestion-reparaciones/${vehiculoId}`); // Redirigir a la gestión del vehículo al cancelar
    };

    return (
        <div className='container vh-100 d-flex justify-content-center align-items-center'>
            <div className="card" style={{ maxWidth: '600px', width: '100%' }}>
                <div className="card-header text-center">
                    <h2>Crear Reparación</h2>
                </div>
                <div className="card-body">
                    {successMessage && <div className="alert alert-success">{successMessage}</div>}
                    {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
                    
                    <form onSubmit={handleSubmit} className="row g-3">
                        <div className="col-md-12">
                            <div className="form-group">
                                <label>Fecha</label>
                                <input
                                    type="date"
                                    className="form-control"
                                    value={fecha}
                                    onChange={(e) => setFecha(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        
                        <div className="col-md-12">
                            <div className="form-group">
                                <label>Descripción</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={descripcion}
                                    onChange={(e) => setDescripcion(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="col-md-12">
                            <div className="form-group">
                                <label>Costo</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    value={costo}
                                    onChange={(e) => setCosto(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="col-md-12">
                            <div className="form-group">
                                <label>Vehículo</label>
                                <select
                                    className="form-select"
                                    value={vehiculoId}
                                    disabled // Deshabilitar el campo de selección
                                >
                                    <option value={vehiculoId}>
                                        {vehiculo ? vehiculo.placa : 'Cargando vehículo...'}
                                    </option>
                                </select>
                            </div>
                        </div>

                        <div className="col-12">
                            <button type="submit" className="btn btn-primary me-2">
                                Guardar
                            </button>
                            <button type="button" className="btn btn-secondary" onClick={handleCancel}>
                                Cancelar
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CompCreateReparacion;
