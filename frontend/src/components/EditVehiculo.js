import axios from 'axios';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const URI = 'http://localhost:8000/api/vehiculo/';
const URI_MARCAS = 'http://localhost:8000/api/tipo-marca';  // Ruta para obtener marcas

const CompEditVehiculo = () => {
    const [placa, setPlaca] = useState('');
    const [modelo, setModelo] = useState('');
    const [estado, setEstado] = useState('');
    const [tipoMarcaId, setTipoMarcaId] = useState('');
    const [marcas, setMarcas] = useState([]); // Para cargar las marcas desde el API
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState(''); // Para mostrar mensajes de error
    const { id } = useParams();
    const navigate = useNavigate();

    // Cargar los datos actuales del vehículo cuando se monta el componente
    useEffect(() => {
        const fetchVehiculoData = async () => {
            try {
                const response = await axios.get(`${URI}${id}`);
                const vehiculo = response.data;

                setPlaca(vehiculo.placa);
                setModelo(vehiculo.modelo);
                setEstado(vehiculo.estado);
                setTipoMarcaId(vehiculo.tipo_marca_id); // Asignar el tipo de marca del vehículo
            } catch (error) {
                console.error("Error al obtener los datos del vehículo:", error);
                setErrorMessage("Error al cargar los datos del vehículo, por favor intenta nuevamente.");
            }
        };

        fetchVehiculoData();
    }, [id]);

    // Cargar las marcas disponibles al montar el componente
    useEffect(() => {
        const getMarcas = async () => {
            try {
                const res = await axios.get(URI_MARCAS);
                setMarcas(res.data);  // Suponiendo que el API devuelve un arreglo de objetos con id y descripcion
            } catch (error) {
                console.error("Error al obtener las marcas:", error);
            }
        };

        getMarcas();
    }, []);

    // Manejar la actualización de los datos del vehículo
    const handleSubmit = async (e) => {
        e.preventDefault();

        const updatedVehiculo = {
            placa,
            modelo,
            estado,
            tipo_marca_id: tipoMarcaId  // Enviamos el ID de la marca seleccionada
        };

        try {
            const response = await axios.put(`${URI}${id}`, updatedVehiculo);
            setSuccessMessage("Vehículo actualizado con éxito!");
            setErrorMessage(''); // Resetear mensaje de error
            setTimeout(() => {
                navigate('/vehiculo/gestion-vehiculos');  // Redirigir después de 2 segundos
            }, 2000);
        } catch (error) {
            console.error("Error al actualizar los datos del vehículo:", error.response ? error.response.data : error);
            setErrorMessage("Error al actualizar el vehículo, por favor intenta nuevamente."); // Guardar el mensaje de error
        }
    };

    // Cancelar y volver a la página de gestión de vehículos
    const handleCancel = () => {
        navigate('/vehiculo/gestion-vehiculos');
    };

    return (
        <div className='form-container'>
            <h2 className='form-title'>Editar Vehículo</h2>

            {successMessage && <div className="alert alert-success">{successMessage}</div>}
            {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

            <form onSubmit={handleSubmit} className="form-grid">
                <div className='form-group'>
                    <label>Placa</label>
                    <input
                        type='text'
                        value={placa}
                        onChange={(e) => setPlaca(e.target.value)}
                        required
                    />
                </div>

                <div className='form-group'>
                    <label>Modelo</label>
                    <input
                        type='text'
                        value={modelo}
                        onChange={(e) => setModelo(e.target.value)}
                        required
                    />
                </div>

                <div className='form-group'>
                    <label>Estado</label>
                    <select
                        value={estado}
                        onChange={(e) => setEstado(e.target.value)}
                        required
                    >
                        <option value=''>Seleccione un estado</option>
                        <option value='Activo'>Activo</option>
                        <option value='Inactivo'>Inactivo</option>
                    </select>
                </div>

                <div className='form-group'>
                    <label>Marca</label>
                    <select
                        value={tipoMarcaId}
                        onChange={(e) => setTipoMarcaId(e.target.value)}
                        required
                    >
                        <option value=''>Seleccione una marca</option>
                        {marcas.map(marca => (
                            <option key={marca.id} value={marca.id}>
                                {marca.nombre}  {/* Mostrar la descripción de la marca */}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-buttons">
                    <button type='submit' className='btn btn-primary'>Actualizar</button>
                    <button type='button' onClick={handleCancel} className='btn btn-secondary'>Cancelar</button>
                </div>
            </form>
        </div>
    );
};

export default CompEditVehiculo;
