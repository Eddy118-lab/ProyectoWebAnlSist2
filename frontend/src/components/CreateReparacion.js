import axios from 'axios';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'; // Asegúrate de tener Bootstrap importado

const URI_VEHICULO = 'http://localhost:8000/api/vehiculo/'; // Asegúrate de que este URI sea correcto
const URI_REPARACION = 'http://localhost:8000/api/reparacion/'; // URI para las reparaciones

const CompCreateReparacion = () => {
    const [fecha, setFecha] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [costo, setCosto] = useState('');
    const [vehiculoId, setVehiculoId] = useState('');
    const [vehiculos, setVehiculos] = useState([]); // Para cargar los vehículos desde el API
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        getVehiculos(); // Obtener vehículos cuando el componente se monta
    }, []);

    const getVehiculos = async () => {
        try {
            const res = await axios.get(URI_VEHICULO);
            setVehiculos(res.data); // Suponiendo que el API devuelve un arreglo de objetos con id y otros datos
        } catch (error) {
            console.error("Error al obtener los vehículos:", error);
            setErrorMessage("Error al obtener los vehículos.");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newReparacion = {
            fecha,
            descripcion,
            costo,
            vehiculo_id: vehiculoId // Enviamos el ID del vehículo seleccionado
        };

        try {
            await axios.post(URI_REPARACION, newReparacion);
            setSuccessMessage("Reparación creada con éxito!");
            setErrorMessage('');
            setTimeout(() => {
                navigate('/vehiculo/reparacion/gestion-reparaciones'); // Redirigir al módulo Gestión de Reparaciones después de 2 segundos
            }, 2000);
        } catch (error) {
            console.error("Error al enviar los datos:", error);
            setErrorMessage("Error al crear la reparación.");
        }
    };

    const handleCancel = () => {
        navigate('/vehiculo/reparacion/gestion-reparaciones'); // Redirigir al módulo Gestión de Reparaciones al cancelar
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
                                    onChange={(e) => setVehiculoId(e.target.value)}
                                    required
                                >
                                    <option value=''>Seleccione un vehículo</option>
                                    {vehiculos.map(vehiculo => (
                                        <option key={vehiculo.id} value={vehiculo.id}>
                                            {vehiculo.placa} {/* Mostrar la placa o cualquier otro campo que identifique el vehículo */}
                                        </option>
                                    ))}
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
