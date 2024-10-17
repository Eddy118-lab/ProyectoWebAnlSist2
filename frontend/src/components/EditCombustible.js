import axios from 'axios';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const URI_COMBUSTIBLE = 'http://localhost:8000/api/combustible/';
const URI_VEHICULO = 'http://localhost:8000/api/vehiculo';

const CompEditCombustible = () => {
    const { id } = useParams();  // Obtener el ID del combustible de los parámetros de la URL
    const [fecha, setFecha] = useState('');
    const [cantidad, setCantidad] = useState('');
    const [costo, setCosto] = useState('');
    const [vehiculoId, setVehiculoId] = useState('');
    const [vehiculos, setVehiculos] = useState([]);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    // Cargar datos de combustible y vehículos
    useEffect(() => {
        const fetchCombustible = async () => {
            try {
                const res = await axios.get(`${URI_COMBUSTIBLE}${id}`);
                const combustible = res.data;
                
                setFecha(new Date(combustible.fecha).toISOString().split('T')[0]); // Formato yyyy-mm-dd
                setCantidad(combustible.cantidad);
                setCosto(combustible.costo);
                setVehiculoId(combustible.vehiculo_id);
            } catch (error) {
                setErrorMessage("Error al obtener el combustible.");
            }
        };

        const fetchVehiculos = async () => {
            try {
                const res = await axios.get(URI_VEHICULO);
                setVehiculos(res.data);
            } catch (error) {
                setErrorMessage("Error al obtener los vehículos.");
            }
        };

        fetchCombustible();
        fetchVehiculos();
    }, [id]);

    // Manejar la actualización de combustible
    const handleSubmit = async (e) => {
        e.preventDefault();

        const updatedCombustible = {
            fecha,
            cantidad,
            costo,
            vehiculo_id: vehiculoId
        };

        try {
            const response = await axios.put(`${URI_COMBUSTIBLE}${id}`, updatedCombustible);
            if (response.status === 200) {
                setSuccessMessage("Combustible actualizado con éxito!");
                setErrorMessage('');
                setTimeout(() => navigate(`/vehiculo/combustible/gestion-combustibles/${vehiculoId}`), 2000);
            } else {
                setErrorMessage("Error al actualizar el combustible.");
            }
        } catch (error) {
            setErrorMessage("Error al actualizar el combustible.");
        }
    };

    // Cancelar y volver
    const handleCancel = () => {
        navigate(`/vehiculo/combustible/gestion-combustibles/${vehiculoId}`);
    };

    return (
        <div className='container vh-100 d-flex justify-content-center align-items-center'>
            <div className="card" style={{ width: '100%', maxWidth: '800px' }}>
                <div className="card-header text-center">
                    <h2>Editar Combustible</h2>
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
                                <label>Cantidad</label>
                                <input
                                    type='number'
                                    className='form-control'
                                    value={cantidad}
                                    onChange={(e) => setCantidad(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="col-md-6">
                            <div className="form-group">
                                <label>Costo</label>
                                <input
                                    type='number'
                                    step="0.01"
                                    className='form-control'
                                    value={costo}
                                    onChange={(e) => setCosto(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Vehículo</label>
                                <select
                                    className='form-select'
                                    value={vehiculoId}
                                    onChange={(e) => setVehiculoId(e.target.value)}
                                    disabled // Deshabilitado para evitar cambios de vehículo
                                >
                                    {vehiculos.map(vehiculo => (
                                        <option key={vehiculo.id} value={vehiculo.id}>
                                            {vehiculo.placa}
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

export default CompEditCombustible;
