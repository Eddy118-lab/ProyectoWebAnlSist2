import axios from 'axios';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'; // Asegúrate de tener Bootstrap importado

const URI_MATERIAL = 'http://localhost:8000/api/material/';
const URI_DIMENSION = 'http://localhost:8000/api/dimension/';
const URI_PESO = 'http://localhost:8000/api/peso/';
const URI_TIPO_MATERIAL = 'http://localhost:8000/api/tipo-material/';
const URI_PROVEEDOR = 'http://localhost:8000/api/proveedor/';

const CompCreateMaterial = () => {
    const [nombre, setNombre] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [imagen, setImagen] = useState(null);
    const [dimensionId, setDimensionId] = useState('');
    const [pesoId, setPesoId] = useState('');
    const [tipoMaterialId, setTipoMaterialId] = useState('');
    const [proveedorId, setProveedorId] = useState('');

    const [dimensiones, setDimensiones] = useState([]);
    const [pesos, setPesos] = useState([]);
    const [tiposMaterial, setTiposMaterial] = useState([]);
    const [proveedores, setProveedores] = useState([]);

    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [dimRes, pesoRes, tipoMatRes, provRes] = await Promise.all([
                    axios.get(URI_DIMENSION),
                    axios.get(URI_PESO),
                    axios.get(URI_TIPO_MATERIAL),
                    axios.get(URI_PROVEEDOR)
                ]);
                setDimensiones(dimRes.data);
                setPesos(pesoRes.data);
                setTiposMaterial(tipoMatRes.data);
                setProveedores(provRes.data);
            } catch (error) {
                setErrorMessage("Error al obtener los datos para las listas desplegables.");
                console.error("Error al obtener datos:", error);
            }
        };

        fetchData();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('nombre', nombre);
        formData.append('descripcion', descripcion);
        formData.append('imagen_url', imagen);
        formData.append('dimension_id', dimensionId);
        formData.append('peso_id', pesoId);
        formData.append('tipo_material_id', tipoMaterialId);
        formData.append('proveedor_id', proveedorId);

        try {
            const response = await axios.post(URI_MATERIAL, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            if (response.status === 201) {
                setSuccessMessage("Material creado con éxito!");
                setErrorMessage('');
                setTimeout(() => {
                    navigate('/material/gestion-materiales');
                }, 2000);
            } else {
                setErrorMessage("Error al crear el material.");
            }
        } catch (error) {
            console.error("Error al enviar datos:", error);
            setErrorMessage("Error al crear el material.");
        }
    };

    const handleCancel = () => {
        navigate('/material/gestion-materiales');
    };

    return (
        <div className='container'>
            {/* Box contenedor para el formulario */}
            <div className="border rounded p-4 shadow" style={{ backgroundColor: '#f8f9fa', marginTop: '140px' }}>
                <h2 className='text-center'>Crear Material</h2>
                
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
                            <label>Descripción</label>
                            <textarea
                                className="form-control"
                                value={descripcion}
                                onChange={(e) => setDescripcion(e.target.value)}
                                required
                            ></textarea>
                        </div>
                        <div className="form-group">
                            <label>Imagen</label>
                            <input
                                type="file"
                                className="form-control"
                                accept="image/*"
                                onChange={(e) => setImagen(e.target.files[0])}
                                required
                            />
                        </div>
                    </div>

                    <div className="col-md-6">
                        <div className="form-group">
                            <label>Dimensión</label>
                            <select
                                className="form-select"
                                value={dimensionId}
                                onChange={(e) => setDimensionId(e.target.value)}
                                required
                            >
                                <option value="">Seleccione una dimensión</option>
                                {dimensiones.map((dim) => (
                                    <option key={dim.id} value={dim.id}>
                                        {dim.descripcion}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Peso</label>
                            <select
                                className="form-select"
                                value={pesoId}
                                onChange={(e) => setPesoId(e.target.value)}
                                required
                            >
                                <option value="">Seleccione un peso</option>
                                {pesos.map((peso) => (
                                    <option key={peso.id} value={peso.id}>
                                        {peso.descripcion}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Tipo de Material</label>
                            <select
                                className="form-select"
                                value={tipoMaterialId}
                                onChange={(e) => setTipoMaterialId(e.target.value)}
                                required
                            >
                                <option value="">Seleccione un tipo de material</option>
                                {tiposMaterial.map((tipoMat) => (
                                    <option key={tipoMat.id} value={tipoMat.id}>
                                        {tipoMat.descripcion}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Proveedor</label>
                            <select
                                className="form-select"
                                value={proveedorId}
                                onChange={(e) => setProveedorId(e.target.value)}
                                required
                            >
                                <option value="">Seleccione un proveedor</option>
                                {proveedores.map((prov) => (
                                    <option key={prov.id} value={prov.id}>
                                        {prov.nombre}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Botones de gestión, centrados */}
                    <div className="col-12 text-center mb-3">
                        <button type="button" className="btn btn-info me-2" onClick={() => navigate('/material/dimension/gestion-dimensiones')}>
                            Gestionar Dimensiones
                        </button>
                        <button type="button" className="btn btn-info me-2" onClick={() => navigate('/material/peso/gestion-pesos')}>
                            Gestionar Pesos
                        </button>
                        <button type="button" className="btn btn-info me-2" onClick={() => navigate('/material/tipo-material/gestion-tipos-materiales')}>
                            Gestionar Tipos de Materiales
                        </button>
                        <button type="button" className="btn btn-info" onClick={() => navigate('/proveedor/gestion-proveedores')}>
                            Gestionar Proveedores
                        </button>
                    </div>

                    <div className="col-12 text-center">
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
    );
};

export default CompCreateMaterial;
