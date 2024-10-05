import axios from 'axios';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './Styles/StyleMaterial.css'; // Asegúrate de tener un archivo de estilo si es necesario

const URI_MATERIAL = 'http://localhost:8000/api/material/';
const URI_IMG = 'http://localhost:8000/uploadsMaterial/'; // Constante para la URL de las imágenes
const URI_DIMENSION = 'http://localhost:8000/api/dimension/';
const URI_PESO = 'http://localhost:8000/api/peso/';
const URI_TIPO_MATERIAL = 'http://localhost:8000/api/tipo-material/';
const URI_PROVEEDOR = 'http://localhost:8000/api/proveedor/';

const EditMaterial = () => {
    const { id } = useParams();  // Obtener el ID del material de los parámetros de la URL
    const [nombre, setNombre] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [dimension_id, setDimensionId] = useState('');
    const [peso_id, setPesoId] = useState('');
    const [tipo_material_id, setTipoMaterialId] = useState('');
    const [proveedor_id, setProveedorId] = useState('');
    const [imagen, setImagen] = useState(null);
    const [currentImage, setCurrentImage] = useState('');
    const [dimensions, setDimensions] = useState([]);
    const [weights, setWeights] = useState([]);
    const [materialTypes, setMaterialTypes] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchMaterial = async () => {
            try {
                const res = await axios.get(`${URI_MATERIAL}${id}`);
                const material = res.data;
                setNombre(material.nombre);
                setDescripcion(material.descripcion);
                setDimensionId(material.dimension_id);
                setPesoId(material.peso_id);
                setTipoMaterialId(material.tipo_material_id);
                setProveedorId(material.proveedor_id);
                setCurrentImage(material.imagen_url); // URL de la imagen actual
            } catch (error) {
                console.error("Error al obtener el material:", error);
                setErrorMessage("Error al obtener el material.");
            }
        };

        const fetchData = async () => {
            try {
                const [dimensionsRes, weightsRes, typesRes, suppliersRes] = await Promise.all([
                    axios.get(URI_DIMENSION),
                    axios.get(URI_PESO),
                    axios.get(URI_TIPO_MATERIAL),
                    axios.get(URI_PROVEEDOR)
                ]);
                setDimensions(dimensionsRes.data);
                setWeights(weightsRes.data);
                setMaterialTypes(typesRes.data);
                setSuppliers(suppliersRes.data);
            } catch (error) {
                console.error("Error al obtener los datos:", error);
                setErrorMessage("Error al obtener datos de selección.");
            }
        };

        fetchMaterial();
        fetchData();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Creamos un objeto FormData para manejar archivos
        const formData = new FormData();
        formData.append('nombre', nombre);
        formData.append('descripcion', descripcion);
        formData.append('dimension_id', dimension_id);
        formData.append('peso_id', peso_id);
        formData.append('tipo_material_id', tipo_material_id);
        formData.append('proveedor_id', proveedor_id);

        // Si se actualiza la imagen, agregarla al FormData
        if (imagen) {
            formData.append('imagen_url', imagen);
        }

        try {
            const response = await axios.put(`${URI_MATERIAL}${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.status === 200) {
                setSuccessMessage("Material actualizado con éxito!");
                setErrorMessage('');
                setTimeout(() => {
                    navigate('/material/gestion-materiales');
                }, 2000);
            } else {
                setErrorMessage("Error al actualizar el material.");
            }
        } catch (error) {
            console.error("Error al enviar datos:", error);
            setErrorMessage("Error al actualizar el material.");
        }
    };

    const handleCancel = () => {
        navigate('/material/gestion-materiales');
    };

    return (
        <div className='form-container'>
            <h2 className='form-title'>Editar Material</h2>
            
            {successMessage && <div className="alert alert-success">{successMessage}</div>}
            {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
            
            <form onSubmit={handleSubmit} className='form-grid'>
                <div className='form-column'>
                    <div className='form-group'>
                        <label>Nombre</label>
                        <input
                            type='text'
                            className='form-control'
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            required
                        />
                    </div>
                    <div className='form-group'>
                        <label>Descripción</label>
                        <textarea
                            className='form-control'
                            value={descripcion}
                            onChange={(e) => setDescripcion(e.target.value)}
                            required
                        />
                    </div>
                    <div className='form-group'>
                        <label>Dimensión</label>
                        <select 
                            className='form-control' 
                            value={dimension_id} 
                            onChange={(e) => setDimensionId(e.target.value)} 
                            required
                        >
                            <option value="">Seleccione una dimensión</option>
                            {dimensions.map(dim => (
                                <option key={dim.id} value={dim.id}>{dim.descripcion}</option>
                            ))}
                        </select>
                    </div>
                    <div className='form-group'>
                        <label>Peso</label>
                        <select 
                            className='form-control' 
                            value={peso_id} 
                            onChange={(e) => setPesoId(e.target.value)} 
                            required
                        >
                            <option value="">Seleccione un peso</option>
                            {weights.map(weight => (
                                <option key={weight.id} value={weight.id}>{weight.descripcion}</option>
                            ))}
                        </select>
                    </div>
                    <div className='form-group'>
                        <label>Tipo de Material</label>
                        <select 
                            className='form-control' 
                            value={tipo_material_id} 
                            onChange={(e) => setTipoMaterialId(e.target.value)} 
                            required
                        >
                            <option value="">Seleccione un tipo de material</option>
                            {materialTypes.map(type => (
                                <option key={type.id} value={type.id}>{type.descripcion}</option>
                            ))}
                        </select>
                    </div>
                    <div className='form-group'>
                        <label>Proveedor</label>
                        <select 
                            className='form-control' 
                            value={proveedor_id} 
                            onChange={(e) => setProveedorId(e.target.value)} 
                            required
                        >
                            <option value="">Seleccione un proveedor</option>
                            {suppliers.map(supplier => (
                                <option key={supplier.id} value={supplier.id}>{supplier.nombre}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className='form-column'>
                    <div className='form-group'>
                        <label>Imagen Actual</label>
                        {currentImage && (
                            <img 
                                src={`${URI_IMG}${currentImage}`} 
                                alt="Imagen Actual" 
                                className="thumbnail" 
                            />
                        )}
                    </div>
                    <div className='form-group'>
                        <label>Imagen (Nueva)</label>
                        <input
                            type='file'
                            className='form-control'
                            onChange={(e) => setImagen(e.target.files[0])}
                            accept="image/*"
                        />
                    </div>
                </div>

                <div className='form-buttons'>
                    {/* Botones de acción */}
                    <button type="submit" className="btn btn-primary">
                        Guardar
                    </button>
                    <button type="button" className="btn btn-secondary" onClick={handleCancel}>
                        Cancelar
                    </button>
                    <button type="button" className="btn btn-info" onClick={() => navigate('/material/dimension/gestion-dimensiones')}>
                        Gestionar Dimensiones
                    </button>
                    <button type="button" className="btn btn-info" onClick={() => navigate('/material/peso/gestion-pesos')}>
                        Gestionar Pesos
                    </button>
                    <button type="button" className="btn btn-info" onClick={() => navigate('/material/tipo-material/gestion-tipos-materiales')}>
                        Gestionar Tipos de Materiales
                    </button>
                    <button type="button" className="btn btn-info" onClick={() => navigate('/proveedor/gestion-proveedores')}>
                        Gestionar Proveedores
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditMaterial;
