import axios from 'axios';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SearchCarga from './SearchCliente'; // Asumiendo que tienes un componente de búsqueda
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { Modal, Button } from 'react-bootstrap';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

const URI_CARGA = 'http://localhost:8000/api/carga';
const URI_ASIGNACION = 'http://localhost:8000/api/asignacion';
const URI_INVENTARIO = 'http://localhost:8000/api/inventario';
const URI_PROYECTO = 'http://localhost:8000/api/proyecto';

const CompShowCarga = () => {
    const [cargas, setCargas] = useState([]);
    const [filteredCargas, setFilteredCargas] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [cargasPerPage] = useState(5);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedCarga, setSelectedCarga] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [asignaciones, setAsignaciones] = useState([]);
    const [proyectos, setProyectos] = useState([]);
    const [inventarios, setInventarios] = useState([]);

    useEffect(() => {
        getCargas();
        getAsignaciones();
        getProyectos();
        getInventarios();
    }, []);

    const getCargas = async () => {
        setLoading(true);
        try {
            const res = await axios.get(URI_CARGA);
            setCargas(res.data);
            setFilteredCargas(res.data);
        } catch (error) {
            setError('Error al obtener los datos de cargas');
            console.error("Error al obtener los datos de cargas:", error);
        } finally {
            setLoading(false);
        }
    };

    const getAsignaciones = async () => {
        try {
            const res = await axios.get(URI_ASIGNACION);
            setAsignaciones(res.data);
        } catch (error) {
            console.error("Error al obtener los datos de asignaciones:", error);
        }
    };

    const getProyectos = async () => {
        try {
            const res = await axios.get(URI_PROYECTO);
            setProyectos(res.data);
        } catch (error) {
            console.error("Error al obtener los datos de asignaciones:", error);
        }
    };

    const getInventarios = async () => {
        try {
            const res = await axios.get(URI_INVENTARIO);
            setInventarios(res.data);
        } catch (error) {
            console.error("Error al obtener los datos de inventarios:", error);
        }
    };

    const handleSearch = (query) => {
        const filtered = cargas.filter(carga =>
            carga.titulo.toLowerCase().includes(query.toLowerCase()) ||
            carga.descripcion.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredCargas(filtered);
        setCurrentPage(1);
    };

    const indexOfLastCarga = currentPage * cargasPerPage;
    const indexOfFirstCarga = indexOfLastCarga - cargasPerPage;
    const currentCargas = filteredCargas.slice(indexOfFirstCarga, indexOfLastCarga);
    const totalPages = Math.ceil(filteredCargas.length / cargasPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const viewCargaDetails = (carga) => {
        setSelectedCarga(carga);
        setShowModal(true);
    };

    const downloadPDF = () => {
        if (!selectedCarga) return;

        const doc = new jsPDF();
        doc.setFontSize(20);
        doc.text("Detalles de la Carga", 24, 24);
        doc.setFontSize(12);

        const headers = [["Titulo", "Descripción", "Cantidad", "Precio Unitario", "Asignación", "Inventario", "Proyecto"]];
        const data = [[
            selectedCarga.titulo,
            selectedCarga.descripcion,
            selectedCarga.cantidad,
            selectedCarga.precio_unitario,
            `${selectedCarga.asignacion_id}`,  // Aquí puedes concatenar como desees
            `${selectedCarga.inventario_id}`   // Aquí puedes concatenar como desees
            `${selectedCarga.proyecto_id}`   // Aquí puedes concatenar como desees
        ]];

        doc.autoTable({
            head: headers,
            body: data,
            startY: 30,
        });

        doc.save(`carga_${selectedCarga.id}.pdf`);
    };

    const downloadExcel = () => {
        if (!selectedCarga) return;

        const worksheet = XLSX.utils.json_to_sheet([selectedCarga]);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Carga");
        XLSX.writeFile(workbook, `carga_${selectedCarga.id}.xlsx`);
    };

    // Función para descargar en TXT
    const downloadTXT = () => {
        if (!selectedCarga) return;

        // Crear un texto simple con los datos de la carga
        const text = `
Nombre: ${selectedCarga.nombre}
Descripción: ${selectedCarga.descripcion}
Cantidad: ${selectedCarga.cantidad}
Precio Unitario: ${selectedCarga.precio_unitario}
Asignación: ${getAsignacionDetails(selectedCarga.asignacion_id)}
Inventario: ${getInventarioName(selectedCarga.inventario_id)}
Proyecto: ${getProyectoDetails(selectedCarga.proyecto_id)}
`.trim(); // .trim() elimina espacios en blanco adicionales al principio y al final

        const blob = new Blob([text], { type: 'text/plain' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `carga_${selectedCarga.id}.txt`;
        link.click();
    };


    // Función para obtener la fecha de asignación y la placa del vehículo
    const getAsignacionDetails = (asignacionId) => {
        const asignacion = asignaciones.find(a => a.id === asignacionId);
        if (asignacion) {
            return `${formatDate(asignacion.fecha_asignacion)} - ${asignacion.vehiculo.placa}`; // Asumiendo que 'vehiculo' tiene un campo 'placa'
        }
        return 'No disponible';
    };

    ///// Función para obtener el nombre del proyecto
    const getProyectoDetails = (proyectoId) => {
        const proyecto = proyectos.find(p => p.id === proyectoId);
        if (proyecto) {
            return proyecto.nombre;
        }
        return 'No disponible';
    };

    // Función para obtener el nombre del material
    const getInventarioName = (inventarioId) => {
        const inventario = inventarios.find(i => i.id === inventarioId);
        return inventario ? inventario.material.nombre : 'No disponible';
    };

    const formatDate = (dateString) => {
        const [year, month, day] = dateString.split('-');
        return `${day}-${month}-${year}`;
    };

    return (
        <div className="container">
            <div className="row justify-content-center my-4">
                <h2 className="text-center display-6" style={{ color: '#343a40', fontWeight: 'bold', marginTop: '70px' }}>
                    Gestión de Cargas
                </h2>
            </div>
            <div className="row justify-content-between align-items-center mb-4">
                <div className="col-md-6">
                    <SearchCarga cargas={cargas} onSearch={handleSearch} />
                </div>
                <div className="col-md-3 text-end">
                    <Link to="/carga/create" className="btn btn-primary">
                        <i className="fa-solid fa-plus"></i>
                    </Link>
                </div>
            </div>

            {loading && <p>Cargando...</p>}
            {error && <p className='text-danger'>{error}</p>}

            <div className="row">
                <div className="col">
                    <table className="table table-hover">
                        <thead className="table-dark">
                            <tr>
                                <th>Titulo</th>
                                <th>Descripción</th>
                                <th>Cantidad</th>
                                <th>Precio Unitario</th>
                                <th>Asignación</th>
                                <th>Inventario</th>
                                <th>Proyecto</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentCargas.length === 0 ? (
                                <tr>
                                    <td colSpan="8">No hay cargas disponibles</td>
                                </tr>
                            ) : (
                                currentCargas.map(carga => (
                                    <tr key={carga.id}>
                                        <td>{carga.titulo}</td>
                                        <td>{carga.descripcion}</td>
                                        <td>{carga.cantidad}</td>
                                        <td>{carga.precio_unitario}</td>
                                        <td>{getAsignacionDetails(carga.asignacion_id)}</td>
                                        <td>{getInventarioName(carga.inventario_id)}</td>
                                        <td>{getProyectoDetails(carga.proyecto_id)}</td>
                                        <td>
                                            <div className="d-flex gap-2">
                                                <button onClick={() => { viewCargaDetails(carga); }} className='btn btn-info btn-sm'>
                                                    <i className="fa-regular fa-eye"></i>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Paginación */}
            <nav className='d-flex justify-content-center'>
                <ul className='pagination'>
                    {[...Array(totalPages).keys()].map(number => (
                        <li key={number + 1} className={`page-item ${number + 1 === currentPage ? 'active' : ''}`}>
                            <button onClick={() => paginate(number + 1)} className='page-link'>
                                {number + 1}
                            </button>
                        </li>
                    ))}
                </ul>
            </nav>

            {/* Modal para mostrar detalles de la carga */}
            <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
                <Modal.Header style={{ backgroundColor: '#17a2b8', color: 'white' }}>
                    <h5 className="modal-title">Detalles de la Carga</h5>
                </Modal.Header>
                <Modal.Body>
                    {selectedCarga && (
                        <div>
                            <h5 className="mb-3">Información de la Carga</h5>
                            <table className="table">
                                <tbody>
                                    <tr>
                                        <td><strong>Titulo</strong></td>
                                        <td>{selectedCarga.titulo}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Descripción</strong></td>
                                        <td>{selectedCarga.descripcion}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Cantidad</strong></td>
                                        <td>{selectedCarga.cantidad}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Precio Unitario</strong></td>
                                        <td>{selectedCarga.precio_unitario}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Asignación</strong></td>
                                        <td>{getAsignacionDetails(selectedCarga.asignacion_id)}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Inventario</strong></td>
                                        <td>{getInventarioName(selectedCarga.inventario_id)}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Proyecto</strong></td>
                                        <td>{getProyectoDetails(selectedCarga.proyecto_id)}</td>
                                    </tr>
                                </tbody>
                            </table>
                            <Button variant="primary" onClick={downloadPDF}>Descargar PDF</Button>
                            <Button variant="success" onClick={downloadExcel} className="ms-2">Descargar Excel</Button>
                            <Button variant="info" onClick={downloadTXT}>Descargar TXT</Button>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>Cerrar</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default CompShowCarga;
