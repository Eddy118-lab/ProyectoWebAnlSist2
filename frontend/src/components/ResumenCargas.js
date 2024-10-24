import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';  // Necesario para la navegación
import axios from 'axios';
import { FacturaContext } from '../components/FacturaContext';
import { useSeleccion } from '../components/SelectContext'; // Importar el contexto de selección
import 'bootstrap/dist/css/bootstrap.min.css';

// Endpoints
const URI_CLIENTES = 'http://localhost:8000/api/cliente/';
const URI_FACTURA_CLIENTE = 'http://localhost:8000/api/factura-cliente/';
const URI_DETALLE_FACTURA = 'http://localhost:8000/api/detalle-factura-cliente/';
const URI_PAGO_CLIENTE = 'http://localhost:8000/api/pago-cliente'
const URI_INVENTARIO = 'http://localhost:8000/api/inventario/';
const URI_TIPO_PAGO_CLIENTE = 'http://localhost:8000/api/tipo-pago-cliente/';
const URI_ASIGNACION = 'http://localhost:8000/api/asignacion/';
const URI_TIPO_ESTADO = 'http://localhost:8000/api/tipo-estado/';


const CompResumenCargasFacturacion = () => {
    const [clientes, setClientes] = useState([]); // Lista de clientes
    const [tipoPagos, setTipoPagos] = useState([]); // Tipos de pago disponibles
    const [tipoEstados, setTipoEstados] = useState([]); // Tipos de estado disponibles
    const [montoTotal, setMontoTotal] = useState(0); // Monto total de la factura
    const [clienteId, setClienteId] = useState(null); // ID del cliente seleccionado
    const [tipoPagoId, setTipoPagoId] = useState(null); // ID del tipo de pago seleccionado
    const [tipoEstadoId, setTipoEstadoId] = useState(null);
    const { facturaDetalle, setFacturaDetalle } = useContext(FacturaContext); // Obtener detalles de la factura
    const { setSelectedDates } = useSeleccion(); // Acceder al contexto de selección de fechas
    const navigate = useNavigate();  // Hook de navegación de react-router-dom

    // Fetch inicial de tipos de pago y clientes
    useEffect(() => {
        const fetchData = async () => {
            try {
                //obtener tipos de estado
                const tipoEstadoResponse = await axios.get(URI_TIPO_ESTADO);
                setTipoEstados(tipoEstadoResponse.data);

                // Obtener tipos de pago
                const tipoPagosResponse = await axios.get(URI_TIPO_PAGO_CLIENTE);
                setTipoPagos(tipoPagosResponse.data);

                // Obtener clientes
                const clientesResponse = await axios.get(URI_CLIENTES);
                setClientes(clientesResponse.data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);

    // Calcular monto total
    useEffect(() => {
        const total = facturaDetalle.reduce((acc, detalle) => acc + detalle.total, 0);
        setMontoTotal(total);
    }, [facturaDetalle]);

    // Función para manejar el envío del formulario
    const manejarEnvio = async (e) => {
        e.preventDefault();

        // Condiciones según el tipo de estado seleccionado
        const tipoEstadoSeleccionado = tipoEstados.find(estado => estado.id === parseInt(tipoEstadoId));
        console.log("Tipo Estado Seleccionado:", tipoEstadoSeleccionado);

        if (tipoEstadoSeleccionado) {
            const descripcionEstado = tipoEstadoSeleccionado.descripcion.toLowerCase();
            console.log("Descripción Estado:", descripcionEstado);

            if (['en espera', 'cancelada', 'eliminada'].includes(descripcionEstado)) {
                const actualizarAsignaciones = facturaDetalle
                    .filter(detalle => detalle.asignacion_id && tipoEstadoId) // Filtrar asignaciones válidas
                    .map(detalle => {
                        return axios.patch(`${URI_ASIGNACION}${detalle.asignacion_id}/tipo-estado`, {
                            tipo_estado_id: tipoEstadoId,
                        });
                    });

                try {
                    await Promise.all(actualizarAsignaciones);
                    alert(`Registro: ${tipoEstadoSeleccionado.descripcion}`);
                    // Limpiar los estados
                    setFacturaDetalle([]); // Limpiar detalles de la factura
                    setClienteId(null); // Limpiar cliente seleccionado
                    setTipoPagoId(null); // Limpiar tipo de pago seleccionado
                    setTipoEstadoId(null); // Limpiar tipo de estado seleccionado
                    setSelectedDates([]); // Limpiar selecciones de fechas
                    navigate('/ventas/gestion-ventas/catalogo');
                    return; // Salir después de la actualización
                } catch (error) {
                    console.error("Error actualizando las asignaciones:", error);
                    alert("Error al actualizar las asignaciones.");
                }
            }
        }
        // Validar cantidades de inventario
        const inventarios = {}; // Objeto para almacenar los inventarios

        // Primero obtenemos todos los inventarios
        for (const detalle of facturaDetalle) {
            try {
                const inventarioResponse = await axios.get(`${URI_INVENTARIO}${detalle.inventario_id}/`);
                inventarios[detalle.inventario_id] = inventarioResponse.data; // Almacenar el inventario por ID
            } catch (error) {
                console.error(`Error fetching inventario for carga ${detalle.nombre}:`, error);
                alert(`Error al verificar el inventario para ${detalle.nombre}.`);
                return; // Detener el proceso si hay un error
            }
        }

        // Validar que las cantidades no excedan el inventario
        for (const detalle of facturaDetalle) {
            const inventario = inventarios[detalle.inventario_id]; // Obtener el inventario desde el objeto
            if (detalle.cantidad > inventario.cantidad) {
                alert(`La cantidad de la carga ${detalle.nombre} excede el stock disponible.`);
                return; // Detener el proceso si hay una violación
            }
        }

        // Crear la factura
        const fechaActual = new Date().toISOString().slice(0, 10); // Formato YYYY-MM-DD
        const facturaData = { fecha: fechaActual, monto: montoTotal, cliente_id: clienteId };

        try {
            const facturaResponse = await axios.post(URI_FACTURA_CLIENTE, facturaData);
            const facturaId = facturaResponse.data.id;

            // Insertar detalles de la factura y actualizar inventarios y estado de asignación
            for (const detalle of facturaDetalle) {
                try {
                    const inventario = inventarios[detalle.inventario_id]; // Obtener el inventario de nuevo

                    const detalleData = {
                        cantidad: detalle.cantidad,
                        precio_unitario: detalle.precio_unitario,
                        subtotal: detalle.subtotal,
                        descuento: detalle.descuento,
                        total: detalle.total,
                        factura_cliente_id: facturaId,
                        carga_id: detalle.carga_id,
                    };

                    // Inserta el detalle de la factura
                    await axios.post(URI_DETALLE_FACTURA, detalleData);

                    // Actualizar inventario y mantener el nuevo total en el objeto
                    const nuevaCantidad = inventario.cantidad - detalle.cantidad;
                    inventarios[detalle.inventario_id].cantidad = nuevaCantidad; // Actualizar el objeto local

                    // Actualizar inventario
                    await axios.put(`${URI_INVENTARIO}${detalle.inventario_id}/`, {
                        cantidad: nuevaCantidad, // Actualizar el inventario aquí
                        fecha_ingreso: fechaActual,
                    });

                    // Actulizar asignacion
                    const actualizarAsignaciones = facturaDetalle.map(detalle => {
                        if (detalle.asignacion_id && tipoEstadoId) {
                            return axios.patch(`${URI_ASIGNACION}${detalle.asignacion_id}/tipo-estado`, {
                                tipo_estado_id: tipoEstadoId,
                            });
                        }
                    });

                    try {
                        await Promise.all(actualizarAsignaciones);
                    } catch (error) {
                        console.error("Error actualizando las asignaciones:", error);
                        alert("Error al actualizar las asignaciones.");
                    }

                } catch (error) {
                    console.error(`Error al procesar el detalle para carga ${detalle.carga_id}:`, error);
                    alert(`Error al procesar el detalle para carga ${detalle.carga_id}. Detalle no procesado.`);
                    return; // Detener el proceso si hay un error
                }
            }

            // Insertar pago
            const pagoData = {
                fecha: fechaActual,
                monto: montoTotal,
                factura_cliente_id: facturaId,
                tipo_pago_clien_id: tipoPagoId, // Aquí utilizamos el ID del tipo de pago seleccionado
            };
            await axios.post(URI_PAGO_CLIENTE, pagoData);

            alert("Venta procesada con éxito.");
            { navigate('/ventas/gestion-ventas/exito'); }
            { setFacturaDetalle([]); }
            { setClienteId(null); }
            { setTipoPagoId(null); }
            { setTipoEstadoId(null); }
            { setSelectedDates([]); }
        } catch (error) {
            console.error("Error procesando la venta:", error);
            alert("Error al procesar la venta.");
        }
    };

    // Función para manejar el botón "Cancelar"
    const manejarCancelar = () => {
        setFacturaDetalle([]); // Limpiar detalles de la factura
        setClienteId(null); // Limpiar cliente seleccionado
        setTipoPagoId(null); // Limpiar tipo de pago seleccionado
        setTipoEstadoId(null); // Limpiar tipo de estado seleccionado
        setSelectedDates([]); // Limpiar selecciones de fechas
        navigate('/ventas/gestion-ventas/catalogo'); // Redirigir a catálogo
    };

    // Función para manejar el botón "Anterior"
    const manejarAnterior = () => {
        navigate('/ventas/gestion-ventas/detalles-ventas'); // Redirigir a resumen de ventas
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center mb-4">
                <h2 className="container mt-5 text-center display-6 text-dark font-weight-bold">Resumen de Ventas</h2>
            </div>
            <form onSubmit={manejarEnvio}>
                <div className="mb-3">
                    <label htmlFor="clienteId" className="form-label fw-bold">Seleccionar Cliente</label>
                    <div className="input-group">
                        <select
                            className="form-select form-select-lg"
                            id="clienteId"
                            value={clienteId || ''}
                            onChange={(e) => setClienteId(e.target.value)}
                            required
                        >
                            <option value="">Seleccione un cliente</option>
                            {clientes.map(cliente => (
                                <option key={cliente.id} value={cliente.id}>{cliente.nombre}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-text">Por favor, seleccione el cliente que desea utilizar.</div>
                </div>

                <div className="mb-3">
                    <label htmlFor="tipoPago" className="form-label fw-bold">Tipo de Pago</label>
                    <div className="input-group">
                        <select
                            className="form-select form-select-lg"
                            id="tipoPago"
                            value={tipoPagoId || ''}
                            onChange={(e) => setTipoPagoId(e.target.value)}
                            required
                        >
                            <option value="">Seleccione un tipo de pago</option>
                            {tipoPagos.map(tipo => (
                                <option key={tipo.id} value={tipo.id}>{tipo.descripcion}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-text">Por favor, seleccione el tipo de pago que desea utilizar.</div>
                </div>

                <div className="mb-4">
                    <label htmlFor="tipoEstado" className="form-label fw-bold">Tipo de Estado</label>
                    <div className="input-group">
                        <select
                            className="form-select form-select-lg"
                            id="tipoEstado"
                            value={tipoEstadoId || ''}
                            onChange={(e) => setTipoEstadoId(e.target.value)}
                            required
                        >
                            <option value="">Seleccione un tipo de estado</option>
                            {tipoEstados.map(tipoe => (
                                tipoe.descripcion !== "Procesada" && (
                                    <option key={tipoe.id} value={tipoe.id}>{tipoe.descripcion}</option>
                                )))}
                        </select>
                    </div>
                    <div className="form-text">Por favor, seleccione el tipo de estado que desea utilizar.</div>
                </div>

                <h3 className="text-dark">Detalles de la Factura</h3>
                <table className="table table-striped table-hover">
                    <thead className="table-dark">
                        <tr>
                            <th>ID</th>
                            <th>Carga</th>
                            <th>Cantidad</th>
                            <th>Precio Unitario</th>
                            <th>Subtotal</th>
                            <th>Descuento</th>
                            <th>Total</th>
                            <th>Inventario ID</th> {/* Nueva columna para el inventario ID */}
                            <th>Asigancion ID</th>
                        </tr>
                    </thead>
                    <tbody>
                        {facturaDetalle.map((detalle) => (
                            <tr key={detalle.carga_id}>
                                <td>{detalle.carga_id}</td>
                                <td>{detalle.nombre}</td>
                                <td>{detalle.cantidad}</td>
                                <td>{detalle.precio_unitario}</td>
                                <td>{detalle.subtotal.toFixed(2)}</td>
                                <td>{detalle.descuento.toFixed(2)}</td>
                                <td>{detalle.total.toFixed(2)}</td>
                                <td>{detalle.inventario_id}</td> {/* Mostrar el inventario ID */}
                                <td>{detalle.asignacion_id}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <h4>Monto Total: {montoTotal.toFixed(2)}</h4>

                <div className="d-flex justify-content-between">
                    <button type="button" className="btn btn-danger" onClick={manejarCancelar}>Cancelar</button>
                    <div>
                        <button type="button" className="btn btn-secondary" onClick={manejarAnterior}>Anterior</button>
                        <button type="submit" className="btn btn-primary">Finalizar</button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default CompResumenCargasFacturacion;
