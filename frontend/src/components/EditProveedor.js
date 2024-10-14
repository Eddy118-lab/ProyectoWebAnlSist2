import axios from 'axios';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './Styles/StyleEditProveedor.css';

const URI_PROVEEDOR = 'http://localhost:8000/api/proveedor/';
const URI_TIPO_PROVEEDOR = 'http://localhost:8000/api/tipo-proveedor/';

const CompEditProveedor = () => {
    const { id } = useParams();  // Obtener el ID del proveedor de los parámetros de la URL
    const [nombre, setNombre] = useState('');
    const [direccion, setDireccion] = useState('');
    const [telefono, setTelefono] = useState('');
    const [email, setEmail] = useState('');
    const [nit, setNit] = useState('');
    const [tipoProveedorId, setTipoProveedorId] = useState('');
    const [tiposProveedor, setTiposProveedor] = useState([]);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    // Función para obtener el proveedor y los tipos de proveedores
    useEffect(() => {
        const fetchProveedor = async () => {
            try {
                const res = await axios.get(`${URI_PROVEEDOR}${id}`);
                const proveedor = res.data;
                setNombre(proveedor.nombre);
                setDireccion(proveedor.direccion);
                setTelefono(proveedor.telefono);
                setEmail(proveedor.email);
                setNit(proveedor.nit);
                setTipoProveedorId(proveedor.tipo_proveedor_id);
            } catch (error) {
                console.error("Error al obtener el proveedor:", error);
                setErrorMessage("Error al obtener el proveedor.");
            }
        };

        const fetchTipoProveedores = async () => {
            try {
                const res = await axios.get(URI_TIPO_PROVEEDOR);
                setTiposProveedor(res.data);
            } catch (error) {
                console.error("Error al obtener tipos de proveedores:", error);
                setErrorMessage("Error al obtener tipos de proveedores.");
            }
        };

        fetchProveedor();
        fetchTipoProveedores();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const updatedProveedor = {
            nombre,
            direccion,
            telefono,
            email,
            nit,
            tipo_proveedor_id: tipoProveedorId // Incluye la clave foránea
        };

        try {
            const response = await axios.put(`${URI_PROVEEDOR}${id}`, updatedProveedor);
            if (response.status === 200) {
                setSuccessMessage("Proveedor actualizado con éxito!");
                setErrorMessage('');
                setTimeout(() => {
                    navigate('/proveedor/gestion-proveedores');
                }, 2000);
            } else {
                setErrorMessage("Error al actualizar el proveedor.");
            }
        } catch (error) {
            console.error("Error al enviar datos:", error);
            setErrorMessage("Error al actualizar el proveedor.");
        }
    };

    const handleCancel = () => {
        navigate('/proveedor/gestion-proveedores');
    };

    const handleManageTipoProveedores = () => {
        navigate('/proveedor/tipo-proveedor/gestion-tipos-proveedores');
    };

    return (
        <div className='form-container-Edit-Proveedor'>
            <h2 className='form-title-Edit-Proveedor'>Editar Proveedor</h2>
            
            {successMessage && <div className="alert alert-success-Edit-Proveedor">{successMessage}</div>}
            {errorMessage && <div className="alert alert-danger-Edit-Proveedor">{errorMessage}</div>}
            
            <form onSubmit={handleSubmit} className='form-grid-Edit-Proveedor'>
                <div className='form-column-Edit-Proveedor'>
                    <div className='form-group-Edit-Proveedor'>
                        <label>Nombre</label>
                        <input
                            type='text'
                            className='form-control-Edit-Proveedor'
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            required
                        />
                    </div>
                    <div className='form-group-Edit-Proveedor'>
                        <label>Email</label>
                        <input
                            type='email'
                            className='form-control-Edit-Proveedor'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className='form-group-Edit-Proveedor'>
                        <label>Dirección</label>
                        <input
                            type='text'
                            className='form-control-Edit-Proveedor'
                            value={direccion}
                            onChange={(e) => setDireccion(e.target.value)}
                            required
                        />
                    </div>
                </div>

                <div className='form-column-Edit-Proveedor'>
                    <div className='form-group-Edit-Proveedor'>
                        <label>Teléfono</label>
                        <input
                            type='text'
                            className='form-control-Edit-Proveedor'
                            value={telefono}
                            onChange={(e) => setTelefono(e.target.value)}
                            required
                        />
                    </div>
                    <div className='form-group-Edit-Proveedor'>
                        <label>NIT</label>
                        <input
                            type='text'
                            className='form-control-Edit-Proveedor'
                            value={nit}
                            onChange={(e) => setNit(e.target.value)}
                            required
                        />
                    </div>
                    <div className='form-group-Edit-Proveedor'>
                        <label>Tipo de Proveedor</label>
                        <select
                            className='form-control-Edit-Proveedor'
                            value={tipoProveedorId}
                            onChange={(e) => setTipoProveedorId(e.target.value)}
                            required
                        >
                            <option value="">Seleccione un tipo de proveedor</option>
                            {tiposProveedor.map(tipo => (
                                <option key={tipo.id} value={tipo.id}>
                                    {tipo.descripcion}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className='form-buttons-Edit-Proveedor'>
                    <button type='submit' className='btn btn-primary-Edit-Proveedor'>Actualizar</button>
                    <button type='button' className='btn btn-secondary-Edit-Proveedor' onClick={handleCancel}>Cancelar</button>
                    <button type='button' className='btn btn-info-Edit-Proveedor' onClick={handleManageTipoProveedores}>
                        Gestionar Tipos de Proveedor
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CompEditProveedor;