import axios from 'axios';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Styles/StyleCliente.css';  // Importa el archivo CSS

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
        <div className='form-container'>
            <h2 className='form-title'>Crear Cliente</h2>
            
            {successMessage && <div className="alert alert-success">{successMessage}</div>}
            {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
            
            <form onSubmit={handleSubmit} className="form-grid">
                <div className="form-column">
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
                
                <div className="form-column">
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
                            className="form-control"
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

                {/* Botones en una fila separada */}
                <div className="form-buttons">
                    <button type="submit" className="btn btn-primary">
                        Guardar
                    </button>
                    <button type="button" className="btn btn-secondary" onClick={handleCancel}>
                        Cancelar
                    </button>
                    <button type="button" className="btn btn-info" onClick={handleManageTipoClientes}>
                        Gestionar Tipos de Cliente
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CompCreateCliente;
