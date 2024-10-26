import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { FacturaContext } from '../components/FacturaContext';
import 'bootstrap/dist/css/bootstrap.min.css';

// Endpoints
const URI_CARGA = 'http://localhost:8000/api/carga/';
const URI_INVENTARIO = 'http://localhost:8000/api/inventario/';
const URI_VEHICULO = 'http://localhost:8000/api/vehiculo/';
const URI_TIPO_ESTADO = 'http://localhost:8000/api/tipo-estado/';

const CompDetalleCargasFacturacion = () => {
    const [cargas, setCargas] = useState([]); // Todas las cargas filtradas
    const [inventarios, setInventarios] = useState([]); // Lista de inventarios
    const [vehiculos, setVehiculos] = useState([]); // Lista de vehículos
    const [tiposEstado, setTiposEstado] = useState([]); // Lista de tipos de estado

    const location = useLocation(); // Obtenemos el estado desde useLocation
    const selectedDates = location.state?.selectedDates || []; // Fechas seleccionadas
    const navigate = useNavigate(); // Para la navegación

    const { facturaDetalle, setFacturaDetalle } = useContext(FacturaContext); // Obtener valores del contexto

    // Guardar el estado en localStorage cada vez que cambia
    useEffect(() => {
        localStorage.setItem('facturaDetalle', JSON.stringify(facturaDetalle));
    }, [facturaDetalle]);

    // Recuperar datos de localStorage al cargar el componente
    useEffect(() => {
        const storedDetalle = JSON.parse(localStorage.getItem('facturaDetalle'));
        if (storedDetalle) {
            setFacturaDetalle(storedDetalle);
        }
    }, [setFacturaDetalle]);

    const convertirFecha = (fecha) => {
        const [dia, mes, anio] = fecha.split('-'); // Separar la fecha en día, mes y año
        return `${anio}-${mes}-${dia}`; // Retornar la fecha en el nuevo formato
    };

    // Fetch inicial de los datos
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [resCargas, resInventarios, resVehiculos, resTiposEstado] = await Promise.all([
                    axios.get(URI_CARGA),
                    axios.get(URI_INVENTARIO),
                    axios.get(URI_VEHICULO),
                    axios.get(URI_TIPO_ESTADO),
                ]);

                // Obtén el ID del estado "Entregado"
                const estadoEntregado = resTiposEstado.data.find(estado => estado.descripcion === "Entregada")?.id;

                // Filtrar cargas basadas en las fechas seleccionadas y excluyendo las que tienen estado "Entregado"
                const filteredCargas = resCargas.data.filter(carga => {
                    const asignacion = carga.asignacion || {};
                    const fechaAsignacion = asignacion.fecha_asignacion || '';
                    return (
                        selectedDates.includes(fechaAsignacion) &&
                        asignacion.tipo_estado_id !== estadoEntregado
                    );
                });

                setCargas(filteredCargas);
                setInventarios(resInventarios.data);
                setVehiculos(resVehiculos.data);
                setTiposEstado(resTiposEstado.data);

            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchData();
    }, [selectedDates]); // Dependemos de las fechas seleccionadas

    // Función para calcular subtotal, descuento y total
    const calcularTotales = (detalle) => {
        const subtotal = detalle.cantidad * detalle.precio_unitario;
        const descuento = Math.min(detalle.descuento, subtotal * 0.05); // Descuento limitado al 5%
        const total = subtotal - descuento;
        return { subtotal, descuento, total };
    };

    // Manejar cambios en la cantidad, precio unitario y descuento
    const handleDetalleChange = (index, field, value) => {
        const updatedDetalle = [...facturaDetalle];
        updatedDetalle[index][field] = value;
        const { subtotal, descuento, total } = calcularTotales(updatedDetalle[index]);
        updatedDetalle[index].subtotal = subtotal;
        updatedDetalle[index].descuento = descuento;
        updatedDetalle[index].total = total;
        setFacturaDetalle(updatedDetalle);
    };

    // Agregar los registros seleccionados de carga al detalle de la factura
    const agregarCargaAFactura = (carga) => {
        const cargaExistente = facturaDetalle.find(detalle => detalle.carga_id === carga.id);
        if (cargaExistente) {
            alert("Esta carga ya fue añadida a la factura.");
            return;
        }

        const nuevoDetalle = {
            carga_id: carga.id,
            titulo: carga.titulo || 'No disponible',
            cantidad: carga.cantidad || 0,
            precio_unitario: carga.precio_unitario || 0,
            subtotal: 0,
            descuento: 0,
            total: 0,
            inventario_id: carga.inventario_id,
            asignacion_id: carga.asignacion_id,
        };

        const { subtotal, descuento, total } = calcularTotales(nuevoDetalle);
        nuevoDetalle.subtotal = subtotal;
        nuevoDetalle.descuento = descuento;
        nuevoDetalle.total = total;

        setFacturaDetalle([...facturaDetalle, nuevoDetalle]);
    };

    // Eliminar un registro de la factura
    const eliminarRegistro = (index) => {
        const updatedDetalle = facturaDetalle.filter((_, i) => i !== index);
        setFacturaDetalle(updatedDetalle);
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center mb-4">
                <h2 className="container mt-5 text-center display-6 text-dark font-weight-bold">Detalle de Cargas para Facturación</h2>
            </div>

            {selectedDates.length > 0 && (
                <div className="row justify-content-center mb-4">
                    <p className="text-dark">Fechas seleccionadas: {selectedDates.join(', ')}</p>
                </div>
            )}

            <h3 className="text-dark">Cargas Disponibles</h3>
            <table className="table table-striped table-hover">
                <thead className="table-dark">
                    <tr>
                        <th>Carga ID</th>
                        <th>Titulo</th>
                        <th>Cantidad</th>
                        <th>Precio Unitario</th>
                        <th>Inventario ID</th>
                        <th>Inventario</th>
                        <th>Asignacion ID</th>
                        <th>Asignación Fecha</th>
                        <th>Vehículo (Placa)</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {cargas.map(carga => (
                        <tr key={carga.id}>
                            <td>{carga.id}</td>
                            <td>{carga.titulo || 'No disponible'}</td>
                            <td>{carga.cantidad || 'No disponible'}</td>
                            <td>{carga.precio_unitario || 'No disponible'}</td>
                            <td>{carga.inventario_id || 'No disponible'}</td>
                            <td>{inventarios.find(i => i.id === carga.inventario_id)?.material?.nombre || 'No disponible'}</td>
                            <td>{carga.asignacion_id || 'No disponible'}</td>
                            <td>{carga.asignacion ? convertirFecha(carga.asignacion.fecha_asignacion) : 'No asignada'}</td>
                            <td>{vehiculos.find(vp => vp.id === carga.asignacion?.vehiculo_id)?.placa || 'No disponible'}</td>
                            <td>{tiposEstado.find(e => e.id === carga.asignacion?.tipo_estado_id)?.descripcion || 'No disponible'}</td>
                            <td>
                                <button className="btn btn-primary" onClick={() => agregarCargaAFactura(carga)}>
                                    Agregar
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <h3 className="text-dark">Detalle de la Factura</h3>
            <table className="table table-striped table-hover">
                <thead className="table-dark">
                    <tr>
                        <th>Titulo</th>
                        <th>Cantidad</th>
                        <th>Precio Unitario</th>
                        <th>Subtotal</th>
                        <th>Descuento</th>
                        <th>Total</th>
                        <th>Asignacion</th>
                        <th>Inventario</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {facturaDetalle.map((detalle, index) => (
                        <tr key={index}>
                            <td>{detalle.titulo}</td>
                            <td>{detalle.cantidad}</td>
                            <td>{detalle.precio_unitario}</td>
                            <td>{detalle.subtotal}</td>
                            <td>
                                <input
                                    type="number"
                                    value={detalle.descuento}
                                    onChange={(e) => handleDetalleChange(index, 'descuento', Number(e.target.value))}
                                    className="form-control"
                                />
                            </td>
                            <td>{detalle.total}</td>
                            <td>{detalle.asignacion_id}</td>
                            <td>{detalle.inventario_id}</td>
                            <td>
                                <button className="btn btn-danger" onClick={() => eliminarRegistro(index)}>
                                    Eliminar
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="row mb-4">
                <div className="col text-start">
                    <button onClick={() => navigate('/ventas/gestion-ventas/catalogo')} className="btn btn-secondary">
                        Regresar
                    </button>
                </div>
                <div className="col text-end">
                    <button onClick={() => navigate('/ventas/gestion-ventas/resumen-ventas')} className="btn btn-primary">
                        Siguiente
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CompDetalleCargasFacturacion;
