import axios from 'axios';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';

const URI = 'http://localhost:8000/api/material';
const URI_IMG = 'http://localhost:8000/uploadsMaterial/';

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
            setMateriales(res.data);
        } catch (error) {
            setError('Error al obtener los datos de materiales');
            console.error("Error al obtener los datos:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <div className="material-management-header text-center">
                <h2 className="material-management-title">Gestión de Materiales</h2>
                <div className="create-btn-container my-3">
                    <Link to="/material/create" className="btn btn-primary">
                        <i className="fa-solid fa-plus"></i>
                    </Link>
                </div>
            </div>

            {loading && <p>Cargando...</p>}
            {error && <p className="text-danger">{error}</p>}

            <div className="material-container">
                {materiales.length === 0 ? (
                    <p>No hay materiales disponibles</p>
                ) : (
                    materiales.map(material => (
                        <div key={material.id} className="material-card">
                            <div className="card">
                                <img 
                                    src={`${URI_IMG}${material.imagen_url}`} 
                                    alt={`Imagen de ${material.descripcion}`} 
                                    className="card-img-top" 
                                />
                                <div className="card-body">
                                    <h5 className="card-title">{material.descripcion}</h5>
                                    <p className="card-text"><strong>Nombre:</strong> {material.nombre}</p>
                                    <p className="card-text"><strong>Proveedor:</strong> {material.proveedor?.nombre || 'No disponible'}</p>
                                    <p className="card-text"><strong>Dimensión:</strong> {material.dimension?.descripcion || 'No disponible'}</p>
                                    <p className="card-text"><strong>Peso:</strong> {material.peso?.descripcion || 'No disponible'}</p>
                                    <p className="card-text"><strong>Tipo Material:</strong> {material.tipoMaterial?.descripcion || 'No disponible'}</p>
                                    <div className="d-flex justify-content-between">
                                        <Link to={`/material/edit/${material.id}`} className="btn btn-warning btn-sm">
                                            <i className="fa-regular fa-pen-to-square"></i> Editar
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default CompShowMaterial;
