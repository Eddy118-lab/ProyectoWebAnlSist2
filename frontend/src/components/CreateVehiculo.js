import axios from 'axios';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'; // Asegúrate de tener Bootstrap importado

const URI_VEHICULO = 'http://localhost:8000/api/vehiculo/';
const URI_MARCAS = 'http://localhost:8000/api/tipo-marca/';

const CompCreateVehiculo = () => {
    const [placa, setPlaca] = useState('');
    const [modelo, setModelo] = useState('');
    const [estado, setEstado] = useState('');
    const [tipoMarcaId, setTipoMarcaId] = useState('');
    const [marcas, setMarcas] = useState([]); // Para cargar las marcas desde el API
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        getMarcas(); // Obtener marcas cuando el componente se monta
    }, []);

    const getMarcas = async () => {
        try {
            const res = await axios.get(URI_MARCAS);
            setMarcas(res.data); // Suponiendo que el API devuelve un arreglo de objetos con id y descripcion
        } catch (error) {
            console.error("Error al obtener las marcas:", error);
            setErrorMessage("Error al obtener las marcas.");
        }
    };

    const checkPlacaExists = async (placa) => {
        try {
            const res = await axios.get(`${URI_VEHICULO}?placa=${placa}`);
            return res.data.length > 0; // Verifica si existe algún vehículo con la misma placa
        } catch (error) {
            console.error("Error al verificar la placa:", error);
            setErrorMessage("Error al verificar la placa, por favor intenta nuevamente.");
            return false;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Verificar si la placa ya existe
        const placaExists = await checkPlacaExists(placa);
        if (placaExists) {
            setErrorMessage("La placa ya está registrada. Por favor ingresa una placa diferente.");
            return; // Salir de la función si la placa ya existe
        }

        const newVehiculo = {
            placa,
            modelo,
            estado,
            tipo_marca_id: tipoMarcaId // Enviamos el ID de la marca seleccionada
        };

        try {
            await axios.post(URI_VEHICULO, newVehiculo);
            setSuccessMessage("Vehículo creado con éxito!");
            setErrorMessage('');
            setTimeout(() => {
                navigate('/vehiculo/gestion-vehiculos'); // Redirigir al módulo Gestión de Vehículos después de 2 segundos
            }, 2000);
        } catch (error) {
            console.error("Error al enviar los datos:", error);
            setErrorMessage("Error al crear el vehículo.");
        }
    };

    const handleCancel = () => {
        navigate('/vehiculo/gestion-vehiculos'); // Redirigir al módulo Gestión de Vehículos al cancelar
    };

    return (
        <div className='container vh-100 d-flex justify-content-center align-items-center'>
            <div className="card" style={{ maxWidth: '600px', width: '100%' }}>
                <div className="card-header text-center">
                    <h2>Crear Vehículo</h2>
                </div>
                <div className="card-body">
                    {successMessage && <div className="alert alert-success">{successMessage}</div>}
                    {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
                    
                    <form onSubmit={handleSubmit} className="row g-3">
                        <div className="col-md-6">
                            <div className="form-group">
                                <label>Placa</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={placa}
                                    onChange={(e) => setPlaca(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Modelo</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={modelo}
                                    onChange={(e) => setModelo(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Estado</label>
                                <select
                                    className="form-select"
                                    value={estado}
                                    onChange={(e) => setEstado(e.target.value)}
                                    required
                                >
                                    <option value=''>Seleccione un estado</option>
                                    <option value='Activo'>Activo</option>
                                    <option value='Inactivo'>Inactivo</option>
                                </select>
                            </div>
                        </div>

                        <div className="col-md-6">
                            <div className="form-group">
                                <label>Marca</label>
                                <select
                                    className="form-select"
                                    value={tipoMarcaId}
                                    onChange={(e) => setTipoMarcaId(e.target.value)}
                                    required
                                >
                                    <option value=''>Seleccione una marca</option>
                                    {marcas.map(marca => (
                                        <option key={marca.id} value={marca.id}>
                                            {marca.nombre} {/* Mostrar la descripción de la marca */}
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

export default CompCreateVehiculo;
