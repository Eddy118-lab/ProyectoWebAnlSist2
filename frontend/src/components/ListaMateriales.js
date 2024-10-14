import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Importar useNavigate para redirigir
import './Styles/StyleListaMateriales.css';

// Rutas para inventarios y materiales
const INVENTARIOS_ROUTE = `http://localhost:8000/api/inventario`;
const MATERIALS_ROUTE = `http://localhost:8000/api/material`;
const IMAGES_ROUTE = `http://localhost:8000/uploadsMaterial/`;

const CompListaMateriales = () => {
  const [inventarios, setInventarios] = useState([]);
  const [materiales, setMateriales] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
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
  const currentMaterials = inventarios.slice(indexOfFirstMaterial, indexOfLastMaterial);

  // Número total de páginas
  const totalPages = Math.ceil(inventarios.length / itemsPerPage);

  return (
    <div className="material-list-container-Lista-Materiales">
      <h1>Listado de Materiales</h1>
      <div className="material-card-container-Lista-Materiales">
        {currentMaterials.map((inventario) => (
          <div key={inventario.id} className="material-card-Lista-Materiales">
            {materiales[inventario.id] && (
              <div>
                <img
                  src={`${IMAGES_ROUTE}${materiales[inventario.id].imagen_url}`}
                  alt={materiales[inventario.id].nombre}
                  className="material-image-Lista-Materiales"
                />
                <div className="material-card-content-Lista-Materiales">
                  <h2>{materiales[inventario.id].nombre}</h2>
                  <p><strong>Inventario No:</strong> {inventario.id}</p>
                  <p><strong>Existencias: </strong> {inventario.cantidad} <strong> (metros)</strong></p>
                  <p>{materiales[inventario.id].descripcion}</p>
                  <p><strong>Dimensión:</strong> {materiales[inventario.id].dimension?.descripcion || 'No disponible'}</p>
                  <p><strong>Peso:</strong> {materiales[inventario.id].peso?.descripcion || 'No disponible'}</p>
                  <p><strong>Tipo Material:</strong> {materiales[inventario.id].tipoMaterial?.descripcion || 'No disponible'}</p>
                  <p><strong>Proveedor:</strong> {materiales[inventario.id].proveedor?.nombre || 'No disponible'}</p>
                  <button 
                    className="material-add-button-Lista-Materiales" 
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
      <div className="pagination-Lista-Materiales">
        {Array.from({ length: totalPages }, (_, index) => (
          <button 
            key={index + 1} 
            className={`pagination-button-Lista-Materiales ${currentPage === index + 1 ? 'active' : ''}`} 
            onClick={() => paginate(index + 1)}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CompListaMateriales;