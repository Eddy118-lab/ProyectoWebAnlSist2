import axios from 'axios';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'; // Asegúrate de tener Bootstrap importado

const URI_CLIENTE = 'http://localhost:8000/api/cliente/';
const URI_TIPO_CLIENTE = 'http://localhost:8000/api/tipo-cliente/';

const CompCreateCliente = () => {
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
        const fetchTipoClientes = async () => {
            try {
                const res = await axios.get(URI_TIPO_CLIENTE);
                setTiposCliente(res.data);
            } catch (error) {
                console.error("Error al obtener tipos de clientes:", error);
                setErrorMessage("Error al obtener tipos de clientes.");
            }
        };

        fetchTipoClientes();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newCliente = {
            nombre,
            direccion,
            telefono,
            email,
            nit,
            tipo_cliente_id: tipoClienteId // Incluye la clave foránea
        };

        try {
            const response = await axios.post(URI_CLIENTE, newCliente);
            if (response.status === 201) {
                setSuccessMessage("Cliente creado con éxito!");
                setErrorMessage('');
                setTimeout(() => {
                    navigate('/cliente/gestion-clientes');
                }, 2000);
            } else {
                setErrorMessage("Error al crear el cliente.");
            }
        } catch (error) {
            console.error("Error al enviar datos:", error);
            setErrorMessage("Error al crear el cliente.");
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
            <div className="card" style={{ maxWidth: '600px', width: '100%', maxHeight:'100%'}}>
                <div className="card-header text-center" >
                    <h2>Crear Cliente</h2>
                </div>
                <div className="card-body">
                    {successMessage && <div className="alert alert-success">{successMessage}</div>}
                    {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
                    
                    <form onSubmit={handleSubmit} className="row g-3">
                        <div className="col-md-6">
                            <div className="form-group">
                                <label>Nombre</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={nombre}
                                    onChange={(e) => setNombre(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Teléfono</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={telefono}
                                    onChange={(e) => setTelefono(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>NIT</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={nit}
                                    onChange={(e) => setNit(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        
                        <div className="col-md-6">
                            <div className="form-group">
                                <label>Email</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Dirección</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={direccion}
                                    onChange={(e) => setDireccion(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Tipo de Cliente</label>
                                <select
                                    className="form-select"
                                    value={tipoClienteId}
                                    onChange={(e) => setTipoClienteId(e.target.value)}
                                    required
                                >
                                    <option value="">Seleccione un tipo de cliente</option>
                                    {tiposCliente.map((tipo) => (
                                        <option key={tipo.id} value={tipo.id}>
                                            {tipo.descripcion}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="col-12">
                            <div className="d-flex justify-content-center">
                                <button type="submit" className="btn btn-primary me-2">
                                    Guardar
                                </button>
                                <button type="button" className="btn btn-secondary me-2" onClick={handleCancel}>
                                    Cancelar
                                </button>
                                <button type="button" className="btn btn-info" onClick={handleManageTipoClientes}>
                                    Gestionar Tipos de Cliente
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CompCreateCliente;
