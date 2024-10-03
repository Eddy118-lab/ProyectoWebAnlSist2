import axios from 'axios';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Styles/StyleProveedor.css';  // Importa el archivo CSS

const URI_PROVEEDOR = 'http://localhost:8000/api/proveedor/';
const URI_TIPO_PROVEEDOR = 'http://localhost:8000/api/tipo-proveedor/';

const CompCreateProveedor = () => {
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

    useEffect(() => {
        const fetchTipoProveedores = async () => {
            try {
                const res = await axios.get(URI_TIPO_PROVEEDOR);
                setTiposProveedor(res.data);
            } catch (error) {
                console.error("Error al obtener tipos de proveedores:", error);
                setErrorMessage("Error al obtener tipos de proveedores.");
            }
        };

        fetchTipoProveedores();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newProveedor = {
            nombre,
            direccion,
            telefono,
            email,
            nit,
            tipo_proveedor_id: tipoProveedorId // Incluye la clave foránea
        };

        try {
            const response = await axios.post(URI_PROVEEDOR, newProveedor);
            if (response.status === 201) {
                setSuccessMessage("Proveedor creado con éxito!");
                setErrorMessage('');
                setTimeout(() => {
                    navigate('/proveedor/gestion-proveedores');
                }, 2000);
            } else {
                setErrorMessage("Error al crear el proveedor.");
            }
        } catch (error) {
            console.error("Error al enviar datos:", error);
            setErrorMessage("Error al crear el proveedor.");
        }
    };

    const handleCancel = () => {
        navigate('/proveedor/gestion-proveedores');
    };

    const handleManageTipoProveedores = () => {
        navigate('/proveedor/tipo-proveedor/gestion-tipos-proveedores');
    };

    return (
        <div className='form-container'>
            <h2 className='form-title'>Crear Proveedor</h2>
            
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
                        <label>Tipo de Proveedor</label>
                        <select
                            className="form-control"
                            value={tipoProveedorId}
                            onChange={(e) => setTipoProveedorId(e.target.value)}
                            required
                        >
                            <option value="">Seleccione un tipo de proveedor</option>
                            {tiposProveedor.map((tipo) => (
                                <option key={tipo.id} value={tipo.id}>
                                    {tipo.descripcion}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="form-buttons">
                    <button type="submit" className="btn btn-primary">
                        Guardar
                    </button>
                    <button type="button" className="btn btn-secondary" onClick={handleCancel}>
                        Cancelar
                    </button>
                    <button type="button" className="btn btn-info" onClick={handleManageTipoProveedores}>
                        Gestionar Tipos de Proveedores
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CompCreateProveedor;
