import axios from 'axios';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SearchProyecto from './SearchCliente.js'; // Componente para búsqueda de proyectos
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { Modal, Button } from 'react-bootstrap'; // Importar Modal y Button de react-bootstrap
import jsPDF from 'jspdf';
import 'jspdf-autotable'; // Importar autotable
import * as XLSX from 'xlsx'; // Importar XLSX para descargar en Excel

const URI = 'http://localhost:8000/api/proyecto';

const CompShowProyecto = () => {
    const [proyectos, setProyectos] = useState([]);
    const [filteredProyectos, setFilteredProyectos] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [proyectosPerPage] = useState(5);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sortOrder, setSortOrder] = useState('asc');
    const [sortField, setSortField] = useState('nombre');
    const [selectedProyecto, setSelectedProyecto] = useState(null); // Proyecto seleccionado
    const [showModal, setShowModal] = useState(false); // Control del modal

    useEffect(() => {
        getProyectos();
    }, []);

    const getProyectos = async () => {
        setLoading(true);
        try {
            const res = await axios.get(URI);
            setProyectos(res.data);
            setFilteredProyectos(res.data);
        } catch (error) {
            setError('Error al obtener los datos');
            console.error("Error al obtener los datos:", error);
        } finally {
            setLoading(false);
        }
    };

    const deleteProyecto = async (id) => {
        try {
            const isConfirmed = window.confirm('¿Estás seguro de que deseas eliminar este proyecto?');
            if (isConfirmed) {
                await axios.delete(`${URI}/${id}`);
                getProyectos();
            }
        } catch (error) {
            console.error("Error al eliminar el proyecto:", error);
            setError('Error al eliminar el proyecto');
        }
    };

    const handleSearch = (query) => {
        const filtered = proyectos.filter(proyecto =>
            proyecto.nombre.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredProyectos(filtered);
        setCurrentPage(1);
    };

    const sortProyectos = (field) => {
        const sortedProyectos = [...filteredProyectos].sort((a, b) => {
            const aField = a[field]?.toLowerCase() || '';
            const bField = b[field]?.toLowerCase() || '';
            if (aField < bField) return sortOrder === 'asc' ? -1 : 1;
            if (aField > bField) return sortOrder === 'asc' ? 1 : -1;
            return 0;
        });
        setFilteredProyectos(sortedProyectos);
        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        setSortField(field);
    };

    const getSortIcon = (field) => {
        if (field !== sortField) return null;
        return sortOrder === 'asc' ? '↑' : '↓';
    };

    const indexOfLastProyecto = currentPage * proyectosPerPage;
    const indexOfFirstProyecto = indexOfLastProyecto - proyectosPerPage;
    const currentProyectos = filteredProyectos.slice(indexOfFirstProyecto, indexOfLastProyecto);
    const totalPages = Math.ceil(filteredProyectos.length / proyectosPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Función para ver detalles del proyecto
    const viewProyectoDetails = (proyecto) => {
        setSelectedProyecto(proyecto);
        setShowModal(true); // Mostrar el modal
    };

    // Función para descargar en PDF
    const downloadPDF = () => {
        if (!selectedProyecto) return;

        const doc = new jsPDF();
        doc.setFontSize(20);
        doc.text("Detalles del Proyecto", 20, 20);
        doc.setFontSize(12);

        const headers = [["Nombre", "Descripción", "Fecha de Inicio", "Fecha de Fin", "Estado"]];
        const data = [[
            selectedProyecto.nombre,
            selectedProyecto.descripcion,
            selectedProyecto.fechaInicio,
            selectedProyecto.fechaFin,
            selectedProyecto.estado
        ]];

        // Usar autoTable para crear la tabla en el PDF
        doc.autoTable({
            head: headers,
            body: data,
            startY: 30,
        });

        doc.save(`proyecto_${selectedProyecto.id}.pdf`);
    };

    // Función para descargar en Excel
    const downloadExcel = () => {
        if (!selectedProyecto) return;

        const worksheet = XLSX.utils.json_to_sheet([selectedProyecto]);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Proyecto");
        XLSX.writeFile(workbook, `proyecto_${selectedProyecto.id}.xlsx`);
    };

    // Función para descargar en TXT
    const downloadTXT = () => {
        if (!selectedProyecto) return;

        const text = `
Nombre: ${selectedProyecto.nombre}
Descripción: ${selectedProyecto.descripcion}
Fecha de Inicio: ${selectedProyecto.fechaInicio}
Fecha de Fin: ${selectedProyecto.fechaFin}
Estado: ${selectedProyecto.estado}
`.trim();

        const blob = new Blob([text], { type: 'text/plain' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `proyecto_${selectedProyecto.id}.txt`;
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
                    Gestión de Proyectos
                </h2>
            </div>
            <div className="row justify-content-between align-items-center mb-4">
                <div className="col-md-6">
                    <SearchProyecto proyectos={proyectos} onSearch={handleSearch} />
                </div>
                <div className="col-md-3 text-end">
                    <Link to="/proyecto/create" className="btn btn-primary">
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
                                <th onClick={() => sortProyectos('nombre')} style={{ cursor: 'pointer' }}>
                                    Nombre {getSortIcon('nombre')}
                                </th>
                                <th onClick={() => sortProyectos('descripcion')} style={{ cursor: 'pointer' }}>
                                    Descripción {getSortIcon('descripcion')}
                                </th>
                                <th onClick={() => sortProyectos('fechaInicio')} style={{ cursor: 'pointer' }}>
                                    Fecha de Inicio {getSortIcon('fechaInicio')}
                                </th>
                                <th onClick={() => sortProyectos('fechaFin')} style={{ cursor: 'pointer' }}>
                                    Fecha de Fin {getSortIcon('fechaFin')}
                                </th>
                                <th onClick={() => sortProyectos('estado')} style={{ cursor: 'pointer' }}>
                                    Estado {getSortIcon('estado')}
                                </th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentProyectos.length === 0 ? (
                                <tr>
                                    <td colSpan="6">No hay proyectos disponibles</td>
                                </tr>
                            ) : (
                                currentProyectos.map(proyecto => (
                                    <tr key={proyecto.id}>
                                        <td>{proyecto.nombre}</td>
                                        <td>{proyecto.descripcion}</td>
                                        <td>{formatDate(proyecto.fecha_inicio)}</td>
                                        <td>{formatDate(proyecto.fecha_fin)}</td>
                                        <td>{proyecto.estado}</td>
                                        <td>
                                            <div className="d-flex gap-2" style={{ marginRight: '-60px' }}>
                                                <button onClick={() => { viewProyectoDetails(proyecto); }} className='btn btn-info btn-sm'>
                                                    <i className="fa-regular fa-eye"></i>
                                                </button>
                                                <Link to={`/proyecto/edit/${proyecto.id}`} className='btn btn-warning btn-sm'>
                                                    <i className="fa-regular fa-pen-to-square"></i>
                                                </Link>
                                                <button onClick={() => deleteProyecto(proyecto.id)} className='btn btn-danger btn-sm'>
                                                    <i className="fa-regular fa-trash-can"></i>
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
            <nav className="d-flex justify-content-center my-3">
                <ul className="pagination">
                    {Array.from({ length: totalPages }, (_, index) => (
                        <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                            <button className="page-link" onClick={() => paginate(index + 1)}>
                                {index + 1}
                            </button>
                        </li>
                    ))}
                </ul>
            </nav>

            {/* Modal para mostrar detalles del proyecto */}
            <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
                <Modal.Header style={{ backgroundColor: '#17a2b8', color: 'white' }}>
                    <h5 className="modal-title">Detalles del Proyecto</h5>
                </Modal.Header>
                <Modal.Body>
                    {selectedProyecto && (
                        <div>
                            <h5 className="mb-3">Información del Proyecto</h5>
                            <table className="table">
                                <tbody>
                                    <tr>
                                        <td><strong>Nombre</strong></td>
                                        <td>{selectedProyecto.nombre}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Descripción</strong></td>
                                        <td>{selectedProyecto.descripcion}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Fecha de Inicio</strong></td>
                                        <td>{selectedProyecto.fechaInicio}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Fecha de Fin</strong></td>
                                        <td>{selectedProyecto.fechaFin}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Estado</strong></td>
                                        <td>{selectedProyecto.estado}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={downloadPDF}>Descargar PDF</Button>
                    <Button variant="success" onClick={downloadExcel}>Descargar Excel</Button>
                    <Button variant="info" onClick={downloadTXT}>Descargar TXT</Button>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>Cerrar</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default CompShowProyecto;
