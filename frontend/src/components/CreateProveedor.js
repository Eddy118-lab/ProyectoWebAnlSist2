import axios from 'axios';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'; // Asegúrate de tener Bootstrap importado

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
        <div className='container vh-100 d-flex justify-content-center align-items-center'>
            <div className="card" style={{ width: '400%', maxWidth: '800px' }}>
                <div className="card-header text-center">
                    <h2>Crear Proveedor</h2>
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
                                <label>Tipo de Proveedor</label>
                                <select
                                    className="form-select"
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

                        <div className="col-12">
                            <button type="submit" className="btn btn-primary me-2">
                                Guardar
                            </button>
                            <button type="button" className="btn btn-secondary me-2" onClick={handleCancel}>
                                Cancelar
                            </button>
                            <button type="button" className="btn btn-info" onClick={handleManageTipoProveedores}>
                                Gestionar Tipos de Proveedores
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CompCreateProveedor;
