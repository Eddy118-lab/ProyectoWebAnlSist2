import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Importar useNavigate para redirigir
import 'bootstrap/dist/css/bootstrap.min.css';

// Rutas para inventarios y materiales
const INVENTARIOS_ROUTE = `http://localhost:8000/api/inventario`;
const MATERIALS_ROUTE = `http://localhost:8000/api/material`;
const IMAGES_ROUTE = `http://localhost:8000/uploadsMaterial/`;

const CompListaMateriales = () => {
  const [inventarios, setInventarios] = useState([]);
  const [materiales, setMateriales] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState(''); // Estado para el término de búsqueda
  const itemsPerPage = 8;
  const navigate = useNavigate(); // Inicializar el hook useNavigate

  // Función para obtener los inventarios
  const fetchInventarios = async () => {
    try {
      const response = await axios.get(INVENTARIOS_ROUTE);
      setInventarios(response.data); // Suponiendo que la respuesta contiene una lista de inventarios
    } catch (error) {
      console.error('Error fetching inventarios:', error);
    }
  };

  // Cargar los inventarios cuando el componente se monta
  useEffect(() => {
    fetchInventarios();
  }, []);

  // Función para obtener el material asociado a un inventario
  const getMaterial = async (inventarioId) => {
    try {
      const response = await axios.get(`${MATERIALS_ROUTE}/${inventarioId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching material:', error);
      return null;
    }
  };

  // Función para cargar los materiales cuando se monta el componente
  useEffect(() => {
    const cargarMateriales = async () => {
      const materialesPromises = inventarios.map((inventario) => {
        return getMaterial(inventario.material_id);
      });
      const materiales = await Promise.all(materialesPromises);
      setMateriales(materiales.reduce((acc, material, index) => {
        acc[inventarios[index].id] = material;
        return acc;
      }, {}));
    };
    cargarMateriales();
  }, [inventarios]);

  // Función para manejar la redirección al segundo componente
  const handleAddMaterial = (inventarioId) => {
    navigate(`/compra/gestion-compras/detalle/${inventarioId}`); // Redirigir al segundo componente pasando el ID del inventario
  };

  // Función para cambiar de página
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Cálculo de los materiales a mostrar en la página actual
  const indexOfLastMaterial = currentPage * itemsPerPage;
  const indexOfFirstMaterial = indexOfLastMaterial - itemsPerPage;

  // Filtrar los materiales según el término de búsqueda
  const filteredInventarios = inventarios.filter(inventario =>
    materiales[inventario.id]?.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const currentMaterials = filteredInventarios.slice(indexOfFirstMaterial, indexOfLastMaterial);

  // Número total de páginas
  const totalPages = Math.ceil(filteredInventarios.length / itemsPerPage);

  return (
    <div className="container">
      <h1 className='text-center display-6' style={{ marginTop: '90px', color: '#343a40', fontWeight: 'bold', paddingBottom: '10px' }}>Listado de Materiales</h1>

      {/* Campo de búsqueda */}
      <div className="mb-4 text-center">
        <input
          type="text"
          className="form-control w-50 mx-auto"
          placeholder="Buscar materiales..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="row">
        {currentMaterials.map((inventario) => (
          <div key={inventario.id} className="col-md-3 mb-4"> {/* Cambiado a 4 cards por fila */}
            {materiales[inventario.id] && (
              <div className="card hover-card" style={{ transition: 'transform 0.2s', cursor: 'pointer' }}> {/* Clase para hover */}
                <img
                  src={`${IMAGES_ROUTE}${materiales[inventario.id].imagen_url}`}
                  alt={materiales[inventario.id].nombre}
                  className="card-img-top" // Clase de Bootstrap para la imagen
                  style={{ height: '200px', objectFit: 'cover' }} // Establecer tamaño y ajuste de imagen
                />
                <div className="card-body">
                  <h5 className="card-title">{materiales[inventario.id].nombre}</h5>
                  <p className="card-text"><strong>Inventario No:</strong> {inventario.id}</p>
                  <p className="card-text"><strong>Existencias: </strong> {inventario.cantidad} <strong>(metros)</strong></p>
                  <p className="card-text">{materiales[inventario.id].descripcion}</p>
                  <p className="card-text"><strong>Dimensión:</strong> {materiales[inventario.id].dimension?.descripcion || 'No disponible'}</p>
                  <p className="card-text"><strong>Peso:</strong> {materiales[inventario.id].peso?.descripcion || 'No disponible'}</p>
                  <p className="card-text"><strong>Tipo Material:</strong> {materiales[inventario.id].tipoMaterial?.descripcion || 'No disponible'}</p>
                  <p className="card-text"><strong>Proveedor:</strong> {materiales[inventario.id].proveedor?.nombre || 'No disponible'}</p>
                  <button 
                    className="btn btn-primary" // Clase de Bootstrap para botón
                    onClick={() => handleAddMaterial(inventario.id)}
                  >
                    Agregar
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Paginación */}
      <div className="d-flex justify-content-center my-4">
        {Array.from({ length: totalPages }, (_, index) => (
          <button 
            key={index + 1} 
            className={`btn btn-secondary mx-1 pagination-button ${currentPage === index + 1 ? 'active' : ''}`} 
            onClick={() => paginate(index + 1)}
            style={{ 
              transition: 'background-color 0.2s, transform 0.2s', 
              cursor: 'pointer' 
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fffff'} // Color de fondo en hover
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = ''} // Restablecer color
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CompListaMateriales;
