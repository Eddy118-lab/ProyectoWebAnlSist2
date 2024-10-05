import axios from 'axios';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Styles/StyleMaterial.css'; // Asegúrate de crear un archivo CSS para personalizar el estilo de las fichas
import '@fortawesome/fontawesome-free/css/all.min.css';

const URI = 'http://localhost:8000/api/material';
const URI_IMG = 'http://localhost:8000/uploadsMaterial/'; // Carpeta donde se guardan las imágenes

const CompShowMaterial = () => {
    const [materiales, setMateriales] = useState([]);
    const [loading, setLoading] = useState(true); 
    const [error, setError] = useState(null);

    useEffect(() => {
        getMateriales();
    }, []);

    const getMateriales = async () => {
        setLoading(true);
        try {
            const res = await axios.get(URI);
            setMateriales(res.data); // Aquí se establecen todos los materiales
        } catch (error) {
            setError('Error al obtener los datos de materiales');
            console.error("Error al obtener los datos:", error);
        } finally {
            setLoading(false);
        }
    };

    const deleteMaterial = async (id) => {
        try {
            const isConfirmed = window.confirm('¿Estás seguro de que deseas eliminar este material?');
            if (isConfirmed) {
                await axios.delete(`${URI}/${id}`);
                getMateriales(); // Vuelve a cargar los materiales después de la eliminación
            }
        } catch (error) {
            console.error("Error al eliminar el material:", error);
            setError('Error al eliminar el material');
        }
    };

    return (
        <div className="container">
            <div className="row">
                <div className="col">
                    <div className='material-management-header'>
                        <h2 className='material-management-title'>Gestión de Materiales</h2>
                    </div>
                    <div className="create-btn-container mb-3">
                        <Link to="/material/create" className="btn btn-primary">
                            <i className="fa-solid fa-plus"></i> Añadir Material
                        </Link>
                    </div>

                    {loading && <p>Cargando...</p>}
                    {error && <p className='text-danger'>{error}</p>}

                    <div className="row">
                        {materiales.length === 0 ? (
                            <p>No hay materiales disponibles</p>
                        ) : (
                            materiales.map(material => (
                                <div key={material.id} className="col-md-3 mb-4">
                                    <div className="card">
                                        <img 
                                            src={`${URI_IMG}${material.imagen_url}`} 
                                            alt={`Imagen de ${material.descripcion}`} 
                                            className="card-img-top" 
                                            style={{ height: '200px', objectFit: 'cover' }} 
                                        />
                                        <div className="card-body">
                                            <h5 className="card-title">{material.descripcion}</h5>
                                            <p className="card-text"><strong>Nombre:</strong> {material.nombre}</p>
                                            <p className="card-text"><strong>Proveedor:</strong> {material.proveedor?.nombre || 'No disponible'}</p>
                                            <p className="card-text"><strong>Dimensión:</strong> {material.dimension?.descripcion || 'No disponible'}</p>
                                            <p className="card-text"><strong>Peso:</strong> {material.peso?.descripcion || 'No disponible'}</p>
                                            <p className="card-text"><strong>Tipo Material:</strong> {material.tipoMaterial?.descripcion || 'No disponible'}</p>
                                            <div className="d-flex justify-content-between">
                                                <Link to={`/material/edit/${material.id}`} className='btn btn-warning btn-sm'>
                                                    <i className="fa-regular fa-pen-to-square"></i> Editar
                                                </Link>
                                                <button onClick={() => deleteMaterial(material.id)} className='btn btn-danger btn-sm'>
                                                    <i className="fa-regular fa-trash-can"></i> Eliminar
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CompShowMaterial;

