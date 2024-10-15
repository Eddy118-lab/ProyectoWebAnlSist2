import axios from 'axios';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'; // Asegúrate de tener Bootstrap importado

const URI = 'http://localhost:8000/api/vehiculo/';
const URI_MARCAS = 'http://localhost:8000/api/tipo-marca';

const CompEditVehiculo = () => {
    const { id } = useParams();
    const [placa, setPlaca] = useState('');
    const [modelo, setModelo] = useState('');
    const [tipoMarcaId, setTipoMarcaId] = useState('');
    const [marcas, setMarcas] = useState([]);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    // Cargar datos del vehículo
    useEffect(() => {
        const fetchVehiculoData = async () => {
            try {
                const response = await axios.get(`${URI}${id}`);
                const vehiculo = response.data;

                setPlaca(vehiculo.placa);
                setModelo(vehiculo.modelo);
                setTipoMarcaId(vehiculo.tipo_marca_id);
            } catch (error) {
                console.error("Error al obtener los datos del vehículo:", error);
                setErrorMessage("Error al cargar los datos del vehículo, por favor intenta nuevamente.");
            }
        };

        fetchVehiculoData();
    }, [id]);

    // Cargar marcas disponibles
    useEffect(() => {
        const getMarcas = async () => {
            try {
                const res = await axios.get(URI_MARCAS);
                setMarcas(res.data);
            } catch (error) {
                console.error("Error al obtener las marcas:", error);
            }
        };

        getMarcas();
    }, []);

    // Manejar la actualización de datos del vehículo
    const handleSubmit = async (e) => {
        e.preventDefault();

        const updatedVehiculo = {
            placa,
            modelo,
            tipo_marca_id: tipoMarcaId
        };

        try {
            const response = await axios.put(`${URI}${id}`, updatedVehiculo);
            setSuccessMessage("Vehículo actualizado con éxito!");
            setErrorMessage('');
            setTimeout(() => {
                navigate('/vehiculo/gestion-vehiculos');
            }, 2000);
        } catch (error) {
            console.error("Error al actualizar los datos del vehículo:", error);
            setErrorMessage("Error al actualizar el vehículo, por favor intenta nuevamente.");
        }
    };

    // Cancelar y volver
    const handleCancel = () => {
        navigate('/vehiculo/gestion-vehiculos');
    };

    return (
        <div className='container vh-100 d-flex justify-content-center align-items-center'>
            <div className="card" style={{ width: '100%', maxWidth: '800px' }}>
                <div className="card-header text-center">
                    <h2>Editar Vehículo</h2>
                </div>
                <div className="card-body">
                    {successMessage && <div className="alert alert-success">{successMessage}</div>}
                    {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

                    <form onSubmit={handleSubmit} className="row g-3">
                        <div className="col-md-6">
                            <div className="form-group">
                                <label>Placa</label>
                                <input
                                    type='text'
                                    className='form-control'
                                    value={placa}
                                    onChange={(e) => setPlaca(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Modelo</label>
                                <input
                                    type='text'
                                    className='form-control'
                                    value={modelo}
                                    onChange={(e) => setModelo(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="col-md-6">
                            <div className="form-group">
                                <label>Marca</label>
                                <select
                                    className='form-select'
                                    value={tipoMarcaId}
                                    onChange={(e) => setTipoMarcaId(e.target.value)}
                                    required
                                >
                                    <option value=''>Seleccione una marca</option>
                                    {marcas.map(marca => (
                                        <option key={marca.id} value={marca.id}>
                                            {marca.nombre}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="col-12">
                            <button type='submit' className='btn btn-primary me-2'>Actualizar</button>
                            <button type='button' className='btn btn-secondary' onClick={handleCancel}>Cancelar</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CompEditVehiculo;
