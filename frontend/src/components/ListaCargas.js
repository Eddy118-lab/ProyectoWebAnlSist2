import axios from 'axios';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSeleccion } from './SelectContext';  
import 'bootstrap/dist/css/bootstrap.min.css';

const URI_CARGA = 'http://localhost:8000/api/carga/';
const URI_ASIGNACION = 'http://localhost:8000/api/asignacion/';
const URI_TIPO_ESTADO = 'http://localhost:8000/api/tipo-estado/';
const URI_INVENTARIO = 'http://localhost:8000/api/inventario/';

const CompListaCarga = () => {
    const [cargas, setCargas] = useState([]);
    const [asignaciones, setAsignaciones] = useState([]);
    const [estados, setEstados] = useState([]);
    const [inventarios, setInventarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');
   
    const [isAscending, setIsAscending] = useState(true); // Estado para controlar el orden asc/desc
    const [showAgregarButton, setShowAgregarButton] = useState(false); // Estado para controlar la visibilidad del botón "Agregar"

    const navigate = useNavigate(); // Hook para la redirección

    const { selectedDates, setSelectedDates } = useSeleccion();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const resCargas = await axios.get(URI_CARGA);
                const resAsignaciones = await axios.get(URI_ASIGNACION);
                const resEstados = await axios.get(URI_TIPO_ESTADO);
                const resInventarios = await axios.get(URI_INVENTARIO);

                setCargas(resCargas.data);
                setAsignaciones(resAsignaciones.data);
                setEstados(resEstados.data);
                setInventarios(resInventarios.data);
            } catch (error) {
                console.error("Error al obtener los datos:", error);
                setErrorMessage("Error al obtener datos.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const filterCargas = (cargas) => {
        return cargas.filter(carga => {
            const asignacion = asignaciones.find(a => a.id === carga.asignacion_id);
            if (!asignacion) {
                return false;
            }
            const invalidStates = ['Entregada', 'Cancelada', 'Eliminada'];
            const estadoDescripcion = estados.find(e => e.id === asignacion.tipo_estado_id);
            return estadoDescripcion && !invalidStates.includes(estadoDescripcion.descripcion);
        });
    };

    const filteredCargas = filterCargas(cargas);

    const formatDate = (dateString) => {
        const [year, month, day] = dateString.split('-');
        return `${day}-${month}-${year}`;
    };

    const getInventarioName = (inventarioId) => {
        const inventario = inventarios.find(i => i.id === inventarioId);
        return inventario ? inventario.material.nombre : 'No disponible';
    };

    const getAsignacionInfo = (asignacionId) => {
        const asignacion = asignaciones.find(a => a.id === asignacionId);
        if (asignacion) {
            return `${formatDate(asignacion.fecha_asignacion)} - ${asignacion.vehiculo.placa}`;
        }
        return 'No disponible';
    };

    const groupCargasByFecha = () => {
        const grouped = {};
        filteredCargas.forEach(carga => {
            const asignacion = asignaciones.find(a => a.id === carga.asignacion_id);
            if (asignacion) {
                const fecha = formatDate(asignacion.fecha_asignacion);
                if (!grouped[fecha]) {
                    grouped[fecha] = [];
                }
                grouped[fecha].push(carga);
            }
        });
        return grouped;
    };

    const groupedCargas = groupCargasByFecha();

    const handleDateSelection = (fecha) => {
        if (selectedDates.includes(fecha)) {
            const newSelectedDates = selectedDates.filter(date => date !== fecha);
            setSelectedDates(newSelectedDates); // Desmarcar
            setShowAgregarButton(newSelectedDates.length > 0); // Si ya no hay fechas seleccionadas, ocultar el botón
        } else {
            const newSelectedDates = [...selectedDates, fecha];
            setSelectedDates(newSelectedDates); // Marcar
            setShowAgregarButton(true); // Mostrar el botón si hay al menos una fecha seleccionada
        }
    };

    const handleSelectAll = () => {
        if (selectedDates.length === Object.keys(groupedCargas).length) {
            setSelectedDates([]); // Desmarcar todos
            setShowAgregarButton(false); // Ocultar el botón
        } else {
            setSelectedDates(Object.keys(groupedCargas)); // Marcar todos
            setShowAgregarButton(true); // Mostrar el botón
        }
    };

    const handleSort = () => {
        setIsAscending(!isAscending);
    };

    const sortedDates = () => {
        const dates = Object.keys(groupedCargas);
        return dates.sort((a, b) => {
            const [dayA, monthA, yearA] = a.split('-');
            const [dayB, monthB, yearB] = b.split('-');
            const dateA = new Date(`${yearA}-${monthA}-${dayA}`);
            const dateB = new Date(`${yearB}-${monthB}-${dayB}`);

            return isAscending ? dateA - dateB : dateB - dateA;
        });
    };

    // Función para manejar el clic en el botón "Agregar"
    const handleAgregarClick = () => {
        // Convertir fechas seleccionadas al formato yyyy-mm-dd
        const formattedDates = selectedDates.map(date => {
            const [day, month, year] = date.split('-');
            return `${year}-${month}-${day}`;
        });

        // Navegamos al componente de facturación con las fechas seleccionadas como estado
        navigate('/ventas/gestion-ventas/detalles-ventas', { state: { selectedDates: formattedDates } });
    };

    return (
        <div className="container">
            <div className="row justify-content-center my-4">
                <h2 className="text-center display-6" style={{ color: '#343a40', fontWeight: 'bold', marginTop: '70px' }}>
                    Listado de Cargas
                </h2>
            </div>
            {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
            {loading ? (
                <div className="text-center">
                    <div className="spinner-border" role="status">
                        <span className="visually-hidden">Cargando...</span>
                    </div>
                </div>
            ) : (
                <div>
                    {/* Botón para cambiar el orden */}
                    <button className="btn btn-secondary my-3" onClick={handleSort}>
                        {isAscending ? 'Ordenar Descendente' : 'Ordenar Ascendente'}
                    </button>

                    {/* Checkbox para seleccionar todos */}
                    <div className="form-check mb-3">
                        <input 
                            type="checkbox" 
                            className="form-check-input" 
                            id="selectAll" 
                            checked={selectedDates.length === Object.keys(groupedCargas).length}
                            onChange={handleSelectAll}
                        />
                        <label className="form-check-label" htmlFor="selectAll">Seleccionar Todos</label>
                    </div>

                    {/* Renderización de las cargas agrupadas por fecha */}
                    {sortedDates().map(fecha => (
                        <div key={fecha}>
                            <div className="d-flex align-items-center my-3">
                                <div className="form-check me-2">
                                    <input 
                                        type="checkbox" 
                                        className="form-check-input" 
                                        id={`checkbox-${fecha}`} 
                                        checked={selectedDates.includes(fecha)} 
                                        onChange={() => handleDateSelection(fecha)} 
                                    />
                                </div>
                                <h6 className="mb-0">{selectedDates.includes(fecha) ? `Grupo Seleccionado: ${fecha}` : fecha}</h6>
                            </div>
                            <table className="table table-striped">
                                <thead className="table-dark">
                                    <tr>
                                        <th>ID</th>
                                        <th>Nombre</th>
                                        <th>Descripción</th>
                                        <th>Cantidad</th>
                                        <th>Precio Unitario</th>
                                        <th>Asignación</th>
                                        <th>Inventario</th>
                                        <th>Estado</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {groupedCargas[fecha].map(carga => {
                                        const asignacion = asignaciones.find(a => a.id === carga.asignacion_id);
                                        const estadoDescripcion = asignacion ? estados.find(e => e.id === asignacion.tipo_estado_id) : null;
                                        return (
                                            <tr key={carga.id}>
                                                <td>{carga.id}</td>
                                                <td>{carga.nombre}</td>
                                                <td>{carga.descripcion}</td>
                                                <td>{carga.cantidad}</td>
                                                <td>{carga.precio_unitario}</td>
                                                <td>{getAsignacionInfo(carga.asignacion_id)}</td>
                                                <td>{getInventarioName(carga.inventario_id)}</td>
                                                <td>{estadoDescripcion ? estadoDescripcion.descripcion : 'No asignado'}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    ))}

                    {/* Mostrar el botón "Agregar" solo si hay fechas seleccionadas */}
                    {showAgregarButton && (
                        <div className="text-center my-4">
                            <button className="btn btn-primary" onClick={handleAgregarClick}>
                                Agregar
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default CompListaCarga;
