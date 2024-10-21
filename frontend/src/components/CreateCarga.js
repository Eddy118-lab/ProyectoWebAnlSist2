import axios from 'axios';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const URI_CARGA = 'http://localhost:8000/api/carga';
const URI_VEHICULOS = 'http://localhost:8000/api/vehiculo'; // Ruta para obtener vehículos
const URI_INVENTARIOS = 'http://localhost:8000/api/inventario'; // Ruta para obtener inventarios
const URI_ASIGNACIONES = 'http://localhost:8000/api/asignacion'; // Ruta para obtener asignaciones

const CompCreateCarga = () => {
    const [nombre, setNombre] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [precioUnitario, setPrecioUnitario] = useState('');
    const [asignacionId, setAsignacionId] = useState('');
    const [inventarioId, setInventarioId] = useState('');
    const [vehiculos, setVehiculos] = useState([]);
    const [inventarios, setInventarios] = useState([]);
    const [asignaciones, setAsignaciones] = useState([]);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [duplicateErrorMessage, setDuplicateErrorMessage] = useState(''); // Mensaje de advertencia por duplicados
    const navigate = useNavigate();

    useEffect(() => {
        const fetchVehiculos = async () => {
            try {
                const response = await axios.get(URI_VEHICULOS);
                setVehiculos(response.data);
            } catch (error) {
                console.error("Error al obtener vehículos:", error);
            }
        };

        const fetchInventarios = async () => {
            try {
                const response = await axios.get(URI_INVENTARIOS);
                setInventarios(response.data);
            } catch (error) {
                console.error("Error al obtener inventarios:", error);
            }
        };

        const fetchAsignaciones = async () => {
            try {
                const response = await axios.get(URI_ASIGNACIONES);
                const asignacionesFiltradas = response.data.filter(asignacion => {
                    const estadoExcluidoIds = [1, 3, 5]; // IDs de estados a excluir
                    return !estadoExcluidoIds.includes(asignacion.tipo_estado_id);
                });
                setAsignaciones(asignacionesFiltradas);
            } catch (error) {
                console.error("Error al obtener asignaciones:", error);
            }
        };

        fetchVehiculos();
        fetchInventarios();
        fetchAsignaciones();
    }, []);

    // Función para verificar si ya existe una carga para la asignación seleccionada
    const checkDuplicateCarga = async (asignacionId) => {
        try {
            const response = await axios.get(`${URI_CARGA}?asignacion_id=${asignacionId}`);
            return response.data.length > 0; // Retorna true si hay registros duplicados
        } catch (error) {
            console.error("Error al verificar duplicados:", error);
            return false;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setDuplicateErrorMessage(''); // Resetear el mensaje de duplicados

        // Verificar si ya existe una carga para la asignación seleccionada
        const isDuplicate = await checkDuplicateCarga(asignacionId);
        if (isDuplicate) {
            setDuplicateErrorMessage("No se puede duplicar registros para esta asignación.");
            return; // No continuar con la creación si hay duplicados
        }

        const newCarga = {
            nombre,
            descripcion,
            precio_unitario: precioUnitario,
            asignacion_id: asignacionId,
            inventario_id: inventarioId
        };

        try {
            const response = await axios.post(URI_CARGA, newCarga);
            if (response.status === 201) {
                setSuccessMessage("Carga creada con éxito!");
                setErrorMessage('');
                setTimeout(() => {
                    navigate('/carga/gestion-cargas'); 
                }, 2000);
            } else {
                setErrorMessage("Error al crear la carga.");
            }
        } catch (error) {
            console.error("Error al enviar datos:", error);
            setErrorMessage("Error al crear la carga.");
        }
    };

    const handleCancel = () => {
        navigate('/carga/gestion-cargas'); 
    };

    return (
        <div className='container vh-100 d-flex justify-content-center align-items-center'>
            <div className="card" style={{ maxWidth: '600px', width: '100%', maxHeight: '100%' }}>
                <div className="card-header text-center">
                    <h2>Crear Carga</h2>
                </div>
                <div className="card-body">
                    {successMessage && <div className="alert alert-success">{successMessage}</div>}
                    {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
                    {duplicateErrorMessage && <div className="alert alert-warning">{duplicateErrorMessage}</div>} {/* Mensaje de advertencia por duplicados */}
                    
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
                                <input
                                    type="text"
                                    className="form-control"
                                    value={descripcion}
                                    onChange={(e) => setDescripcion(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Precio Unitario</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    value={precioUnitario}
                                    onChange={(e) => setPrecioUnitario(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        
                        <div className="col-md-6">
                            <div className="form-group">
                                <label>Asignación</label>
                                <select
                                    className="form-control"
                                    value={asignacionId}
                                    onChange={(e) => setAsignacionId(e.target.value)}
                                    required
                                >
                                    <option value="">Seleccione una asignación</option>
                                    {asignaciones.map(asignacion => (
                                        <option key={asignacion.id} value={asignacion.id}>
                                            {asignacion.fecha_asignacion} - {vehiculos.find(v => v.id === asignacion.vehiculo_id)?.placa}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Inventario</label>
                                <select
                                    className="form-control"
                                    value={inventarioId}
                                    onChange={(e) => setInventarioId(e.target.value)}
                                    required
                                >
                                    <option value="">Seleccione un material</option>
                                    {inventarios.map(inventario => (
                                        <option key={inventario.id} value={inventario.id}>
                                            {inventario.material.nombre} - {inventario.precio_unitario}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="col-12">
                            <div className="d-flex justify-content-center">
                                <button type="submit" className="btn btn-primary me-2">
                                    Guardar
                                </button>
                                <button type="button" className="btn btn-secondary me-2" onClick={handleCancel}>
                                    Cancelar
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CompCreateCarga;
