import axios from 'axios';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Styles/StyleInventario.css';  // Archivo de estilos

// URIs para las claves foráneas
const URI_INVENTARIO = 'http://localhost:8000/api/inventario/';
const URI_MATERIAL = 'http://localhost:8000/api/material/';

const CompCreateInventario = () => {
    // Estados de los campos del formulario
    const [cantidad, setCantidad] = useState('');
    const [precioUnitario, setPrecioUnitario] = useState('');
    const [fechaIngreso, setFechaIngreso] = useState('');
    const [stockMin, setStockMin] = useState('');
    const [stockMax, setStockMax] = useState('');
    const [materialId, setMaterialId] = useState('');
    const [materiales, setMateriales] = useState([]);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    // Efecto para cargar los materiales desde la API
    useEffect(() => {
        const fetchMateriales = async () => {
            try {
                const res = await axios.get(URI_MATERIAL);
                setMateriales(res.data);
            } catch (error) {
                console.error("Error al obtener materiales:", error);
                setErrorMessage("Error al obtener materiales.");
            }
        };

        fetchMateriales();
    }, []);

    // Función para verificar si el material ya tiene un inventario registrado
    const checkMaterialExists = async (materialId) => {
        try {
            const res = await axios.get(URI_INVENTARIO);
            return res.data.some(inventario => inventario.material_id === parseInt(materialId));
        } catch (error) {
            console.error("Error al verificar material:", error);
            setErrorMessage("Error al verificar el material.");
            return false;
        }
    };

    // Manejo del envío del formulario
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Verifica si el material ya tiene un inventario registrado
        const materialExists = await checkMaterialExists(materialId);

        if (materialExists) {
            setErrorMessage("Ya existe un inventario registrado para este material.");
            return;
        }

        const newInventario = {
            cantidad,
            precio_unitario: precioUnitario,
            fecha_ingreso: fechaIngreso,
            stock_min: stockMin,
            stock_max: stockMax,
            material_id: materialId // Incluye la clave foránea de material
        };

        try {
            const response = await axios.post(URI_INVENTARIO, newInventario);
            if (response.status === 201) {
                setSuccessMessage("Inventario creado con éxito!");
                setErrorMessage('');
                setTimeout(() => {
                    navigate('/inventario/gestion-inventarios');
                }, 2000);
            } else {
                setErrorMessage("Error al crear el inventario.");
            }
        } catch (error) {
            console.error("Error al enviar datos:", error);
            setErrorMessage("Error al crear el inventario.");
        }
    };

    const handleCancel = () => {
        navigate('/inventario/gestion-inventarios');
    };

    const handleManageMateriales = () => {
        navigate('/material/gestion-materiales');
    };

    return (
        <div className='form-container'>
            <h2 className='form-title'>Crear Inventario</h2>
            
            {successMessage && <div className="alert alert-success">{successMessage}</div>}
            {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
            
            <form onSubmit={handleSubmit} className="form-grid">
                <div className="form-column">
                    <div className="form-group">
                        <label>Cantidad</label>
                        <input
                            type="number"
                            className="form-control"
                            value={cantidad}
                            onChange={(e) => setCantidad(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Precio Unitario</label>
                        <input
                            type="number"
                            step="0.01"
                            className="form-control"
                            value={precioUnitario}
                            onChange={(e) => setPrecioUnitario(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Fecha de Ingreso</label>
                        <input
                            type="date"
                            className="form-control"
                            value={fechaIngreso}
                            onChange={(e) => setFechaIngreso(e.target.value)}
                            required
                        />
                    </div>
                </div>
                
                <div className="form-column">
                    <div className="form-group">
                        <label>Stock Mínimo</label>
                        <input
                            type="number"
                            className="form-control"
                            value={stockMin}
                            onChange={(e) => setStockMin(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Stock Máximo</label>
                        <input
                            type="number"
                            className="form-control"
                            value={stockMax}
                            onChange={(e) => setStockMax(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Material</label>
                        <select
                            className="form-control"
                            value={materialId}
                            onChange={(e) => setMaterialId(e.target.value)}
                            required
                        >
                            <option value="">Seleccione un material</option>
                            {materiales.map((material) => (
                                <option key={material.id} value={material.id}>
                                    {material.nombre}
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
                    <button type="button" className="btn btn-info" onClick={handleManageMateriales}>
                        Gestionar Materiales
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CompCreateInventario;
