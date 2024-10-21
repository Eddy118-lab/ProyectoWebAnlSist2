import axios from 'axios';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { Modal, Button } from 'react-bootstrap'; // Importar Modal y Button de react-bootstrap
import jsPDF from 'jspdf';
import 'jspdf-autotable'; // Importar autotable
import * as XLSX from 'xlsx'; // Importar XLSX para descargar en Excel

const URI = 'http://localhost:8000/api/asignacion';

const ShowAsignacion = () => {
    const [asignaciones, setAsignaciones] = useState([]);
    const [filteredAsignaciones, setFilteredAsignaciones] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [asignacionesPerPage] = useState(5);
    const [sortOrder, setSortOrder] = useState('asc');
    const [sortField, setSortField] = useState('nombre');
    const [selectedAsignacion, setSelectedAsignacion] = useState(null); // Para la asignación seleccionada
    const [showModal, setShowModal] = useState(false); // tipoEstado para controlar el modal

    useEffect(() => {
        getAsignaciones();
    }, []);

    const getAsignaciones = async () => {
        try {
            const res = await axios.get(URI);
            setAsignaciones(res.data);
            setFilteredAsignaciones(res.data);
        } catch (error) {
            console.error("Error al obtener los datos:", error);
        }
    };

    const sortAsignaciones = (field) => {
        const sortedAsignaciones = [...filteredAsignaciones].sort((a, b) => {
            const aField = a[field]?.toLowerCase() || '';
            const bField = b[field]?.toLowerCase() || '';
            if (aField < bField) return sortOrder === 'asc' ? -1 : 1;
            if (aField > bField) return sortOrder === 'asc' ? 1 : -1;
            return 0;
        });
        setFilteredAsignaciones(sortedAsignaciones);
        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        setSortField(field);
    };

    const getSortIcon = (field) => {
        if (field !== sortField) return null;
        return sortOrder === 'asc' ? '↑' : '↓';
    };

    const indexOfLastAsignacion = currentPage * asignacionesPerPage;
    const indexOfFirstAsignacion = indexOfLastAsignacion - asignacionesPerPage;
    const currentAsignaciones = filteredAsignaciones.slice(indexOfFirstAsignacion, indexOfLastAsignacion);
    const totalPages = Math.ceil(filteredAsignaciones.length / asignacionesPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Función para ver detalles de la asignación
    const viewAsignacionDetails = (asignacion) => {
        setSelectedAsignacion(asignacion);
        setShowModal(true); // Cambiar a true para mostrar el modal
    };

    // Función para descargar en PDF
    const downloadPDF = () => {
        if (!selectedAsignacion) return;

        const doc = new jsPDF();
        doc.setFontSize(20);
        doc.text("Detalles de la Asignación", 20, 20);
        doc.setFontSize(12);

        const headers = [["Fecha Asignación", "Conductor", "Vehículo", "Ruta", "Estado"]];
        const data = [[
            formatDate(selectedAsignacion.fecha_asignacion),
            `${selectedAsignacion.conductor.primer_nom} ${selectedAsignacion.conductor.primer_apell}`,
            selectedAsignacion.vehiculo.placa,
            selectedAsignacion.ruta.nombre,
            selectedAsignacion.tipoEstado.descripcion
        ]];

        // Usar autoTable para crear la tabla en el PDF
        doc.autoTable({
            head: headers,
            body: data,
            startY: 30,
        });

        doc.save(`asignacion_${selectedAsignacion.id}.pdf`);
    };

    // Función para descargar en Excel
    const downloadExcel = () => {
        if (!selectedAsignacion) return;

        const worksheet = XLSX.utils.json_to_sheet([selectedAsignacion]);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Asignación");
        XLSX.writeFile(workbook, `asignacion_${selectedAsignacion.id}.xlsx`);
    };

    // Función para descargar en TXT
    const downloadTXT = () => {
        if (!selectedAsignacion) return;

        const text = `Conductor: ${selectedAsignacion.conductor.primer_nom} ${selectedAsignacion.conductor.primer_apell}
Vehículo: ${selectedAsignacion.vehiculo.placa}
Ruta: ${selectedAsignacion.ruta.nombre}
Estado: ${selectedAsignacion.tipoEstado.descripcion}`.trim();

        const blob = new Blob([text], { type: 'text/plain' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `asignacion_${selectedAsignacion.id}.txt`;
        link.click();
    };


    const formatDate = (dateString) => {
        const [year, month, day] = dateString.split('-');
        return `${day}-${month}-${year}`;
    };

    return (
        <div className="container">
            <div className="row justify-content-center my-4">
                <h2 className="text-center display-6" style={{ color: '#343a40', fontWeight: 'bold', marginTop: '70px' }}>
                    Gestión de Asignaciones
                </h2>
            </div>

            <div className="row justify-content-between align-items-center mb-4">
                <div className="col-md-3 text-end">
                    <Link to="/asignacion/create" className="btn btn-primary">
                        <i className="fa-solid fa-plus"></i>
                    </Link>
                </div>
            </div>

            <div className="row">
                <div className="col">
                    <table className="table table-hover">
                        <thead className="table-dark">
                            <tr>
                                <th onClick={() => sortAsignaciones('fecha_asignacion')} style={{ cursor: 'pointer' }}>
                                    Fecha Asignación {getSortIcon('fecha_asignacion')}
                                </th>
                                <th onClick={() => sortAsignaciones('conductor.primer_nom')} style={{ cursor: 'pointer' }}>
                                    Conductor {getSortIcon('conductor.primer_nom')}
                                </th>
                                <th onClick={() => sortAsignaciones('vehiculo.placa')} style={{ cursor: 'pointer' }}>
                                    Vehículo {getSortIcon('vehiculo.placa')}
                                </th>
                                <th onClick={() => sortAsignaciones('ruta.nombre')} style={{ cursor: 'pointer' }}>
                                    Ruta {getSortIcon('ruta.nombre')}
                                </th>
                                <th onClick={() => sortAsignaciones('tipoEstado.descripcion')} style={{ cursor: 'pointer' }}>
                                    Estado {getSortIcon('tipoEstado.descripcion')}
                                </th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentAsignaciones.length === 0 ? (
                                <tr>
                                    <td colSpan="6">No hay asignaciones disponibles</td>
                                </tr>
                            ) : (
                                currentAsignaciones.map(asignacion => (
                                    <tr key={asignacion.id}>
                                        <td>{formatDate(asignacion.fecha_asignacion)}</td>
                                        <td>{asignacion.conductor.primer_nom} {asignacion.conductor.primer_apell}</td>
                                        <td>{asignacion.vehiculo.placa}</td>
                                        <td>{asignacion.ruta.nombre}</td>
                                        <td>{asignacion.tipoEstado.descripcion}</td>
                                        <td>
                                            <button onClick={() => { viewAsignacionDetails(asignacion); }} className='btn btn-info btn-sm'>
                                                <i className="fa-regular fa-eye"></i>
                                            </button>
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

            {/* Modal para mostrar detalles de la asignación */}
            <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
                <Modal.Header style={{ backgroundColor: '#17a2b8', color: 'white' }}>
                    <h5 className="modal-title">Detalles de la Asignación</h5>
                </Modal.Header>
                <Modal.Body>
                    {selectedAsignacion && (
                        <div>
                            <h5 className="mb-3">Información de la Asignación</h5>
                            <table className="table">
                                <tbody>
                                    <tr>
                                        <td><strong>Conductor</strong></td>
                                        <td>{selectedAsignacion.conductor.primer_nom} {selectedAsignacion.conductor.primer_apell}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Vehículo</strong></td>
                                        <td>{selectedAsignacion.vehiculo.placa}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Ruta</strong></td>
                                        <td>{selectedAsignacion.ruta.nombre}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Estado</strong></td>
                                        <td>{selectedAsignacion.tipoEstado.descripcion}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Cerrar
                    </Button>
                    <Button variant="primary" onClick={downloadPDF}>
                        Descargar PDF
                    </Button>
                    <Button variant="success" onClick={downloadExcel}>
                        Descargar Excel
                    </Button>
                    <Button variant="warning" onClick={downloadTXT}>
                        Descargar TXT
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default ShowAsignacion;
