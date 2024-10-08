import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Importar useNavigate para redirigir
import './Styles/ListaMaterial.css'; // Importar el archivo de estilo separado

// Rutas para materiales y imágenes
const MATERIALS_ROUTE = `http://localhost:8000/api/material`;
const IMAGES_ROUTE = `http://localhost:8000/uploadsMaterial/`;

const CompListaMateriales = () => {
  const [materials, setMaterials] = useState([]);
  const navigate = useNavigate(); // Inicializar el hook useNavigate

  // Función para obtener los materiales
  const fetchMaterials = async () => {
    try {
      const response = await axios.get(MATERIALS_ROUTE);
      setMaterials(response.data); // Suponiendo que la respuesta contiene una lista de materiales
    } catch (error) {
      console.error('Error fetching materials:', error);
    }
  };

  // Cargar los materiales cuando el componente se monta
  useEffect(() => {
    fetchMaterials();
  }, []);

  // Función para manejar la redirección al segundo componente
  const handleAddMaterial = (materialId) => {
    navigate(`/compra/gestion-compras/detalle/${materialId}`); // Redirigir al segundo componente pasando el ID del material
  };

  return (
    <div className="material-list-container">
      <h1>Listado de Materiales</h1>
      <div className="material-card-container">
        {materials.map((material) => (
          <div key={material.id} className="material-card">
            <img
              src={`${IMAGES_ROUTE}${material.imagen_url}`}
              alt={material.nombre}
              className="material-image"
            />
            <div className="material-card-content">
              <h2>{material.nombre}</h2>
              <p>{material.descripcion}</p>
              <p><strong>Dimensión:</strong> {material.dimension?.descripcion || 'No disponible'}</p>
              <p><strong>Peso:</strong> {material.peso?.descripcion || 'No disponible'}</p>
              <p><strong>Tipo Material:</strong> {material.tipoMaterial?.descripcion || 'No disponible'}</p>
              <p><strong>Proveedor:</strong> {material.proveedor?.nombre || 'No disponible'}</p>
              <button 
                className="material-add-button" 
                onClick={() => handleAddMaterial(material.id)}
              >
                Agregar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CompListaMateriales;
