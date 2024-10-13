import axios from 'axios';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const URI = 'http://localhost:8000/api/vehiculo/';
const URI_MARCAS = 'http://localhost:8000/api/tipo-marca/';  // Ruta para obtener marcas

const CompCreateVehiculo = () => {
    const [placa, setPlaca] = useState('');
    const [modelo, setModelo] = useState('');
    const [estado, setEstado] = useState('');
    const [tipoMarcaId, setTipoMarcaId] = useState('');
    const [marcas, setMarcas] = useState([]); // Para cargar las marcas desde el API
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        getMarcas();  // Obtener marcas cuando el componente se monta
    }, []);

    const getMarcas = async () => {
        try {
            const res = await axios.get(URI_MARCAS);
            setMarcas(res.data);  // Suponiendo que el API devuelve un arreglo de objetos con id y descripcion
        } catch (error) {
            console.error("Error al obtener las marcas:", error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newVehiculo = {
            placa,
            modelo,
            estado,
            tipo_marca_id: tipoMarcaId  // Enviamos el ID de la marca seleccionada
        };

        try {
            await axios.post(URI, newVehiculo);
            setSuccessMessage("Vehículo creado con éxito!");
            setTimeout(() => {
                navigate('/vehiculo/gestion-vehiculos');  // Redirigir al módulo Gestión de Vehículos después de 2 segundos
            }, 2000);
        } catch (error) {
            console.error("Error al enviar los datos:", error);
        }
    };

    const handleCancel = () => {
        navigate('/vehiculo/gestion-vehiculos');  // Redirigir al módulo Gestión de Vehículos al cancelar
    };

    return (
        <div className='form-container'>
            <h2 className='form-title'>Crear Vehículo</h2>

            {successMessage && <div className="alert alert-success">{successMessage}</div>}

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

                <div className='form-buttons'>
                    <button type='submit' className='btn btn-primary'>Guardar</button>
                    <button type='button' className='btn btn-secondary' onClick={handleCancel}>Cancelar</button>
                </div>
            </form>
        </div>
    );
};

export default CompCreateVehiculo;
