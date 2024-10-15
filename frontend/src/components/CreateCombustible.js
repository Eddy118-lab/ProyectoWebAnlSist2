import axios from 'axios';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'; // Asegúrate de tener Bootstrap importado

const URI_COMBUSTIBLE = 'http://localhost:8000/api/combustible/';
const URI_VEHICULO = 'http://localhost:8000/api/vehiculo/';

const CompCreateCombustible = () => {
    const { id } = useParams(); // Obtener el ID del vehículo de la URL
    const [fecha, setFecha] = useState('');
    const [cantidad, setCantidad] = useState('');
    const [costo, setCosto] = useState('');
    const [vehiculoId, setVehiculoId] = useState(id); // Inicializa con el ID del vehículo de la URL
    const [vehiculos, setVehiculos] = useState([]);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchVehiculos = async () => {
            try {
                const res = await axios.get(URI_VEHICULO);
                const filteredVehiculo = res.data.find(vehiculo => vehiculo.id.toString() === id); // Filtrar el vehículo por ID
                setVehiculos([filteredVehiculo]); // Solo almacenar el vehículo que coincide
            } catch (error) {
                console.error("Error al obtener los vehículos:", error);
                setErrorMessage("Error al obtener los vehículos.");
            }
        };

        fetchVehiculos();
    }, [id]); // Agregar id como dependencia

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newCombustible = {
            fecha,
            cantidad,
            costo,
            vehiculo_id: vehiculoId // Incluye la clave foránea
        };

        try {
            const response = await axios.post(URI_COMBUSTIBLE, newCombustible);
            if (response.status === 201) {
                setSuccessMessage("Combustible registrado con éxito!");
                setErrorMessage('');
                setTimeout(() => {
                    navigate(`/vehiculo/combustible/gestion-combustibles/${vehiculoId}`); // Navegar a la ruta con el ID del vehículo
                }, 2000);
            } else {
                setErrorMessage("Error al registrar el combustible.");
            }
        } catch (error) {
            console.error("Error al enviar datos:", error);
            setErrorMessage("Error al registrar el combustible.");
        }
    };

    const handleCancel = () => {
        navigate(`/vehiculo/combustible/gestion-combustibles/${vehiculoId}`); // Navegar a la ruta anterior
    };

    return (
        <div className='container vh-100 d-flex justify-content-center align-items-center'>
            <div className="card" style={{ width: '400%', maxWidth: '800px' }}>
                <div className="card-header text-center">
                    <h2>Registrar Combustible</h2>
                </div>
                <div className="card-body">
                    {successMessage && <div className="alert alert-success">{successMessage}</div>}
                    {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
                    
                    <form onSubmit={handleSubmit} className="row g-3">
                        <div className="col-md-6">
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
                            <div className="form-group">
                                <label>Cantidad (en Galones)</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    value={cantidad}
                                    onChange={(e) => setCantidad(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        
                        <div className="col-md-6">
                            <div className="form-group">
                                <label>Costo (Q)</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    className="form-control"
                                    value={costo}
                                    onChange={(e) => setCosto(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Vehículo</label>
                                <select
                                    className="form-select"
                                    value={vehiculoId}
                                    disabled // Deshabilitar el campo de selección
                                >
                                    <option value={vehiculoId}>
                                        {vehiculos.length > 0 ? vehiculos[0].placa : 'Cargando vehículo...'}
                                    </option>
                                </select>
                            </div>
                        </div>

                        <div className="col-12">
                            <button type="submit" className="btn btn-primary me-2">
                                Guardar
                            </button>
                            <button type="button" className="btn btn-secondary me-2" onClick={handleCancel}>
                                Cancelar
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CompCreateCombustible;
