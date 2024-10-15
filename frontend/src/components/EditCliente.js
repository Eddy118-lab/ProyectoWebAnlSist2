import axios from 'axios';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'; // Asegúrate de tener Bootstrap importado

const URI_CLIENTE = 'http://localhost:8000/api/cliente/';
const URI_TIPO_CLIENTE = 'http://localhost:8000/api/tipo-cliente/';

const CompEditCliente = () => {
    const { id } = useParams();  
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
            tipo_cliente_id: tipoClienteId 
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
        <div className='container vh-100 d-flex justify-content-center align-items-center'>
            <div className="card" style={{ width: '100%', maxWidth: '800px' }}>
                <div className="card-header text-center">
                    <h2>Editar Cliente</h2>
                </div>
                <div className="card-body">
                    {successMessage && <div className="alert alert-success">{successMessage}</div>}
                    {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
                    
                    <form onSubmit={handleSubmit} className="row g-3">
                        <div className="col-md-6">
                            <div className="form-group">
                                <label>Nombre</label>
                                <input
                                    type='text'
                                    className='form-control'
                                    value={nombre}
                                    onChange={(e) => setNombre(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Email</label>
                                <input
                                    type='email'
                                    className='form-control'
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Dirección</label>
                                <input
                                    type='text'
                                    className='form-control'
                                    value={direccion}
                                    onChange={(e) => setDireccion(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="col-md-6">
                            <div className="form-group">
                                <label>Teléfono</label>
                                <input
                                    type='text'
                                    className='form-control'
                                    value={telefono}
                                    onChange={(e) => setTelefono(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>NIT</label>
                                <input
                                    type='text'
                                    className='form-control'
                                    value={nit}
                                    onChange={(e) => setNit(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Tipo de Cliente</label>
                                <select
                                    className='form-select'
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

                        <div className="col-12">
                            <button type='submit' className='btn btn-primary me-2'>Actualizar</button>
                            <button type='button' className='btn btn-secondary' onClick={handleCancel}>Cancelar</button>
                            <button type='button' className='btn btn-info' onClick={handleManageTipoClientes}>
                                Gestionar Tipos de Cliente
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CompEditCliente;
