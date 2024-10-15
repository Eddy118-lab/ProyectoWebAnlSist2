import axios from 'axios';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const URI = 'http://localhost:8000/api/material';
const URI_IMG = 'http://localhost:8000/uploadsMaterial/';

const CompShowMaterial = () => {
    const [materiales, setMateriales] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState(''); // Estado para el término de búsqueda
    const [currentPage, setCurrentPage] = useState(1); // Página actual
    const itemsPerPage = 8; // Cantidad de elementos por página

    useEffect(() => {
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

        getMateriales();
    }, []);

    // Estilos en línea para el efecto hover
    const cardStyle = {
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    };

    const hoverStyle = {
        transform: 'translateY(-10px)',
        boxShadow: '0 10px 20px rgba(0, 0, 0, 0.2)',
    };

    // Estilos para el texto dentro de las tarjetas
    const textStyle = {
        color: '#343a40', // Color del texto
        marginBottom: '10px',
    };

    const titleStyle = {
        ...textStyle,
        fontWeight: 'bold',
        fontSize: '1.25rem', // Tamaño del título
    };

    const subtitleStyle = {
        ...textStyle,
        fontSize: '0.9rem', // Tamaño del subtítulo
    };

    // Filtrar materiales según el término de búsqueda
    const filteredMateriales = materiales.filter(material =>
        material.nombre.toLowerCase().includes(searchTerm.toLowerCase()) || 
        material.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Calcular materiales a mostrar en la página actual
    const indexOfLastMaterial = currentPage * itemsPerPage;
    const indexOfFirstMaterial = indexOfLastMaterial - itemsPerPage;
    const currentMaterials = filteredMateriales.slice(indexOfFirstMaterial, indexOfLastMaterial);

    // Calcular número de páginas
    const totalPages = Math.ceil(filteredMateriales.length / itemsPerPage);

    return (
        <div className="container mt-4">
            <div className="text-center mb-4">
                <h2 className='text-center display-6' style={{ marginTop: '90px', color: '#343a40', fontWeight: 'bold', paddingBottom: '10px' }}>Gestión de Materiales</h2>
                
                {/* Campo de búsqueda centrado */}
                <div className="mb-4 d-flex justify-content-center">
                    <input 
                        type="text" 
                        placeholder="Buscar materiales..." 
                        className="form-control" 
                        style={{ maxWidth: '500px' }} 
                        value={searchTerm} 
                        onChange={e => setSearchTerm(e.target.value)} 
                    />
                </div>

                <Link to="/material/create" className="btn btn-primary">
                    <i className="fa-solid fa-plus"></i>
                </Link>
            </div>

            {loading && <p className="text-center">Cargando...</p>}
            {error && <p className="text-danger text-center">{error}</p>}

            <div className="row">
                {currentMaterials.length === 0 ? (
                    <p className="text-center">No hay materiales disponibles</p>
                ) : (
                    currentMaterials.map(material => (
                        <div key={material.id} className="col-md-3 mb-4">
                            <div 
                                className="card h-100 shadow-sm hover-effect" 
                                style={cardStyle} 
                                onMouseEnter={e => { e.currentTarget.style.transform = hoverStyle.transform; e.currentTarget.style.boxShadow = hoverStyle.boxShadow; }} 
                                onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }} 
                            >
                                <img 
                                    src={`${URI_IMG}${material.imagen_url}`} 
                                    alt={`Imagen de ${material.descripcion}`} 
                                    className="card-img-top custom-img" 
                                    style={{ width: '100%', height: '100px', objectFit: 'cover', margin: 'auto' }} 
                                />
                                <div className="card-body">
                                    <h5 className="card-title" style={titleStyle}>{material.descripcion}</h5>
                                    <p className="card-text" style={subtitleStyle}><strong>Nombre:</strong> {material.nombre}</p>
                                    <p className="card-text" style={subtitleStyle}><strong>Proveedor:</strong> {material.proveedor?.nombre || 'No disponible'}</p>
                                    <p className="card-text" style={subtitleStyle}><strong>Dimensión:</strong> {material.dimension?.descripcion || 'No disponible'}</p>
                                    <p className="card-text" style={subtitleStyle}><strong>Peso:</strong> {material.peso?.descripcion || 'No disponible'}</p>
                                    <p className="card-text" style={subtitleStyle}><strong>Tipo Material:</strong> {material.tipoMaterial?.descripcion || 'No disponible'}</p>
                                    <div className="text-center mt-auto">
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

            {/* Paginación */}
            <div className="d-flex justify-content-center mb-4">
                {Array.from({ length: totalPages }, (_, index) => (
                    <button 
                        key={index + 1} 
                        className={`btn ${currentPage === index + 1 ? 'btn-primary' : 'btn-light'} mx-1`} 
                        onClick={() => setCurrentPage(index + 1)}
                    >
                        {index + 1}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default CompShowMaterial;
