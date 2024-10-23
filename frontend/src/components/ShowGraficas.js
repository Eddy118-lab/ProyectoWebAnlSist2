import React, { useState, useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const URI_FACTURA_PROVEEDOR = 'http://localhost:8000/api/factura_proveedor/';
const URI_FACTURA_CLIENTE = 'http://localhost:8000/api/factura-cliente/';
const URI_ASIGNACION = 'http://localhost:8000/api/asignacion';
const URI_CARGA = 'http://localhost:8000/api/carga/';
const URI_INVENTARIO = 'http://localhost:8000/api/inventario';
const URI_REPARACION = 'http://localhost:8000/api/reparacion/';
const URI_COMBUSTIBLE = 'http://localhost:8000/api/combustible/';

const CompMuestraGraficas = () => {
    const [flujoCajaData, setFlujoCajaData] = useState([]);
    const [eficienciaData, setEficienciaData] = useState([]);
    const [inventarioData, setInventarioData] = useState([]);
    const [mantenimientoData, setMantenimientoData] = useState([]);
    const [combustibleData, setCombustibleData] = useState([]);

    useEffect(() => {
        const fetchFlujoCaja = async () => {
            try {
                const resProveedores = await axios.get(URI_FACTURA_PROVEEDOR);
                const resClientes = await axios.get(URI_FACTURA_CLIENTE);
                
                const dataMap = {};

                resProveedores.data.forEach(factura => {
                    const fecha = factura.fecha;
                    if (!dataMap[fecha]) dataMap[fecha] = { fecha, gastos: 0, ingresos: 0 };
                    dataMap[fecha].gastos += factura.monto;
                });

                resClientes.data.forEach(factura => {
                    const fecha = factura.fecha;
                    if (!dataMap[fecha]) dataMap[fecha] = { fecha, gastos: 0, ingresos: 0 };
                    dataMap[fecha].ingresos += factura.monto;
                });

                setFlujoCajaData(Object.values(dataMap));
            } catch (error) {
                console.error('Error fetching flujo de caja data:', error);
            }
        };

        const fetchEficienciaOperativa = async () => {
            try {
                const resCargas = await axios.get(URI_CARGA);
                const resAsignaciones = await axios.get(URI_ASIGNACION);

                const dataMap = {};

                resAsignaciones.data.forEach(asignacion => {
                    const fecha = asignacion.fecha_asignacion;
                    if (!dataMap[fecha]) dataMap[fecha] = { fecha, asignaciones: 0, cargas: 0 };
                    dataMap[fecha].asignaciones += 1;
                });

                resCargas.data.forEach(carga => {
                    const asignacion = resAsignaciones.data.find(a => a.id === carga.asignacion_id);
                    if (asignacion) {
                        const fecha = asignacion.fecha_asignacion;
                        if (!dataMap[fecha]) dataMap[fecha] = { fecha, asignaciones: 0, cargas: 0 };
                        dataMap[fecha].cargas += 1;
                    }
                });

                setEficienciaData(Object.values(dataMap));
            } catch (error) {
                console.error('Error fetching eficiencia operativa data:', error);
            }
        };

        const fetchInventario = async () => {
            try {
                const res = await axios.get(URI_INVENTARIO);
                const transformedData = res.data.map(inventario => ({
                    nombre: inventario.material.nombre,
                    cantidad: inventario.cantidad,
                    precio_unitario: inventario.precio_unitario,
                    stock_min: inventario.stock_min,
                    stock_max: inventario.stock_max
                }));
                setInventarioData(transformedData);
            } catch (error) {
                console.error('Error fetching inventario data:', error);
            }
        };

        const fetchMantenimiento = async () => {
            try {
                const resReparacion = await axios.get(URI_REPARACION);
                const resCombustible = await axios.get(URI_COMBUSTIBLE);

                const reparacionData = resReparacion.data.map(reparacion => ({
                    fecha: reparacion.fecha,
                    costo: reparacion.costo,
                    vehiculo: reparacion.vehiculo.placa,
                    tipo: 'Reparación'
                }));

                const combustibleData = resCombustible.data.map(combustible => ({
                    fecha: combustible.fecha,
                    costo: combustible.costo,
                    vehiculo: combustible.vehiculo.placa,
                    tipo: 'Combustible'
                }));

                setMantenimientoData([...reparacionData, ...combustibleData]);
            } catch (error) {
                console.error('Error fetching mantenimiento data:', error);
            }
        };

        const fetchCombustible = async () => {
            try {
                const res = await axios.get(URI_COMBUSTIBLE);
                const transformedData = res.data.map(entry => ({
                    fecha: entry.fecha,
                    cantidad: entry.cantidad,
                    costo: entry.costo,
                    vehiculo: entry.vehiculo.placa
                }));
                setCombustibleData(transformedData);
            } catch (error) {
                console.error('Error fetching combustible data:', error);
            }
        };

        fetchFlujoCaja();
        fetchEficienciaOperativa();
        fetchInventario();
        fetchMantenimiento();
        fetchCombustible();
    }, []);

    return (
        <div className="container" style={{marginTop: '90px'}}>
            <h2 className="text-center my-4 text-primary">Gráficas</h2>

            {/* Gráfico 1: Flujo de Caja (Gastos vs Ingresos) */}
            <div className="card mb-4 shadow-sm">
                <div className="card-body">
                    <h3 className="card-title">Flujo de Caja: Gastos vs Ingresos</h3>
                    <ResponsiveContainer width="100%" height={400}>
                        <BarChart data={flujoCajaData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="fecha" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="gastos" stackId="a" fill="#ff4848" name="Gastos" />
                            <Bar dataKey="ingresos" stackId="a" fill="#82ca9d" name="Ingresos" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Gráfico 2: Eficiencia Operativa (Cargas y Asignaciones) */}
            <div className="card mb-4 shadow-sm">
                <div className="card-body">
                    <h3 className="card-title">Eficiencia Operativa: Cargas y Asignaciones</h3>
                    <ResponsiveContainer width="100%" height={400}>
                        <LineChart data={eficienciaData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="fecha" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="asignaciones" stroke="#8884d8" name="Asignaciones" />
                            <Line type="monotone" dataKey="cargas" stroke="#82ca9d" name="Cargas" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Gráfico 3: Control de Inventario */}
            <div className="card mb-4 shadow-sm">
                <div className="card-body">
                    <h3 className="card-title">Control de Inventario</h3>
                    <ResponsiveContainer width="100%" height={400}>
                        <BarChart data={inventarioData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="nombre" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="cantidad" fill="#8884d8" name="Cantidad" />
                            <Bar dataKey="stock_min" fill="#ffcc00" name="Stock Mínimo" />
                            <Bar dataKey="stock_max" fill="#00ccff" name="Stock Máximo" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Gráfico 4: Costos de Mantenimiento de Vehículos */}
            <div className="card mb-4 shadow-sm">
                <div className="card-body">
                    <h3 className="card-title">Costos de Mantenimiento de Vehículos</h3>
                    <ResponsiveContainer width="100%" height={400}>
                        <AreaChart data={mantenimientoData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="fecha" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Area type="monotone" dataKey="costo" stroke="#ff7300" fill="#ff7300" name="Costo de Operación" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Gráfico 5: Uso de Combustible por Vehículo */}
            <div className="card mb-4 shadow-sm">
                <div className="card-body">
                    <h3 className="card-title">Uso de Combustible por Vehículo</h3>
                    <ResponsiveContainer width="100%" height={400}>
                        <BarChart data={combustibleData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="vehiculo" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="cantidad" fill="#8884d8" name="Cantidad (galones)" />
                            <Bar dataKey="costo" fill="#82ca9d" name="Costo ($)" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Gráfico 6: Costo de Combustible por Vehículo a lo largo del tiempo */}
            <div className="card mb-4 shadow-sm">
                <div className="card-body">
                    <h3 className="card-title">Costo de Combustible por Vehículo a lo largo del tiempo</h3>
                    <ResponsiveContainer width="100%" height={400}>
                        <LineChart data={combustibleData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="fecha" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="costo" stroke="#ff7300" name="Costo ($)" />
                            <Line type="monotone" dataKey="cantidad" stroke="#8884d8" name="Cantidad (galones)" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default CompMuestraGraficas;
