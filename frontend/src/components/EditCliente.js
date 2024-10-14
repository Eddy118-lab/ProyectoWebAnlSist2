import axios from 'axios';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './Styles/StyleEditCliente.css';

const URI_CLIENTE = 'http://localhost:8000/api/cliente/';
const URI_TIPO_CLIENTE = 'http://localhost:8000/api/tipo-cliente/';

const CompEditCliente = () => {
    const { id } = useParams();  // Obtener el ID del cliente de los parámetros de la URL
    const [nombre, setNombre] = useState('');
    const [direccion, setDireccion] = useState('');
    const [telefono, setTelefono] = useState('');
    const [email, setEmail] = useState('');
    const [nit, setNit] = useState('');
    const [tipoClienteId, setTipoClienteId] = useState('');
    const [tiposCliente, setTiposCliente] = useState([]);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCliente = async () => {
            try {
                const res = await axios.get(`${URI_CLIENTE}${id}`);
                const cliente = res.data;
                setNombre(cliente.nombre);
                setDireccion(cliente.direccion);
                setTelefono(cliente.telefono);
                setEmail(cliente.email);
                setNit(cliente.nit);
                setTipoClienteId(cliente.tipo_cliente_id);
            } catch (error) {
                console.error("Error al obtener el cliente:", error);
                setErrorMessage("Error al obtener el cliente.");
            }
        };

        const fetchTipoClientes = async () => {
            try {
                const res = await axios.get(URI_TIPO_CLIENTE);
                setTiposCliente(res.data);
            } catch (error) {
                console.error("Error al obtener tipos de clientes:", error);
                setErrorMessage("Error al obtener tipos de clientes.");
            }
        };

        fetchCliente();
        fetchTipoClientes();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const updatedCliente = {
            nombre,
            direccion,
            telefono,
            email,
            nit,
            tipo_cliente_id: tipoClienteId // Incluye la clave foránea
        };

        try {
            const response = await axios.put(`${URI_CLIENTE}${id}`, updatedCliente);
            if (response.status === 200) {
                setSuccessMessage("Cliente actualizado con éxito!");
                setErrorMessage('');
                setTimeout(() => {
                    navigate('/cliente/gestion-clientes');
                }, 2000);
            } else {
                setErrorMessage("Error al actualizar el cliente.");
            }
        } catch (error) {
            console.error("Error al enviar datos:", error);
            setErrorMessage("Error al actualizar el cliente.");
        }
    };

    const handleCancel = () => {
        navigate('/cliente/gestion-clientes');
    };

    const handleManageTipoClientes = () => {
        navigate('/cliente/tipo-cliente/gestion-tipos-clientes');
    };

    return (
        <div className='form-container-Edit-Cliente'>
            <h2 className='form-title-Edit-Cliente'>Editar Cliente</h2>
            
            {successMessage && <div className="alert alert-success-Edit-Cliente">{successMessage}</div>}
            {errorMessage && <div className="alert alert-danger-Edit-Cliente">{errorMessage}</div>}
            
            <form onSubmit={handleSubmit} className='form-grid-Edit-Cliente'>
                <div className='form-column-Edit-Cliente'>
                    <div className='form-group-Edit-Cliente'>
                        <label>Nombre</label>
                        <input
                            type='text'
                            className='form-control-Edit-Cliente'
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            required
                        />
                    </div>
                    <div className='form-group-Edit-Cliente'>
                        <label>Email</label>
                        <input
                            type='email'
                            className='form-control-Edit-Cliente'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className='form-group-Edit-Cliente'>
                        <label>Dirección</label>
                        <input
                            type='text'
                            className='form-control-Edit-Cliente'
                            value={direccion}
                            onChange={(e) => setDireccion(e.target.value)}
                            required
                        />
                    </div>
                </div>

                <div className='form-column-Edit-Cliente'>
                    <div className='form-group-Edit-Cliente'>
                        <label>Teléfono</label>
                        <input
                            type='text'
                            className='form-control-Edit-Cliente'
                            value={telefono}
                            onChange={(e) => setTelefono(e.target.value)}
                            required
                        />
                    </div>
                    <div className='form-group-Edit-Cliente'>
                        <label>NIT</label>
                        <input
                            type='text'
                            className='form-control-Edit-Cliente'
                            value={nit}
                            onChange={(e) => setNit(e.target.value)}
                            required
                        />
                    </div>
                    <div className='form-group-Edit-Cliente'>
                        <label>Tipo de Cliente</label>
                        <select
                            className='form-control-Edit-Cliente'
                            value={tipoClienteId}
                            onChange={(e) => setTipoClienteId(e.target.value)}
                            required
                        >
                            <option value="">Seleccione un tipo de cliente</option>
                            {tiposCliente.map(tipo => (
                                <option key={tipo.id} value={tipo.id}>
                                    {tipo.descripcion}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className='form-buttons-Edit-Cliente'>
                    <button type='submit' className='btn btn-primary-Edit-Cliente'>Actualizar</button>
                    <button type='button' className='btn btn-secondary-Edit-Cliente' onClick={handleCancel}>Cancelar</button>
                    <button type='button' className='btn btn-info-Edit-Cliente' onClick={handleManageTipoClientes}>
                        Gestionar Tipos de Cliente
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CompEditCliente;