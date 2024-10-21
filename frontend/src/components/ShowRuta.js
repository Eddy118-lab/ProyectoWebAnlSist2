import axios from 'axios';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { Modal, Button } from 'react-bootstrap'; // Importar Modal y Button de react-bootstrap
import jsPDF from 'jspdf';
import 'jspdf-autotable'; // Importar autotable
import * as XLSX from 'xlsx'; // Importar XLSX para descargar en Excel

const URI = 'http://localhost:8000/api/ruta';

const CompShowRuta = () => {
    const [rutas, setRutas] = useState([]);
    const [filteredRutas, setFilteredRutas] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [rutasPerPage] = useState(5);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedRuta, setSelectedRuta] = useState(null);
    const [showModal, setShowModal] = useState(false); // Estado para controlar el modal

    const [sortOrder, setSortOrder] = useState('asc');
    const [sortField, setSortField] = useState('nombre');

    useEffect(() => {
        getRutas();
    }, []);

    const getRutas = async () => {
        setLoading(true);
        try {
            const res = await axios.get(URI);
            setRutas(res.data);
            setFilteredRutas(res.data);
        } catch (error) {
            setError('Error al obtener las rutas');
            console.error("Error al obtener las rutas:", error);
        } finally {
            setLoading(false);
        }
    };

    const deleteRuta = async (id) => {
        try {
            const isConfirmed = window.confirm('¿Estás seguro de que deseas eliminar esta ruta?');
            if (isConfirmed) {
                await axios.delete(`${URI}/${id}`);
                getRutas();
            }
        } catch (error) {
            console.error("Error al eliminar la ruta:", error);
            setError('Error al eliminar la ruta');
        }
    };

    const handleSearch = (query) => {
        setSearchTerm(query);
        const filtered = rutas.filter(ruta =>
            ruta.nombre.toLowerCase().includes(query.toLowerCase()) ||
            ruta.origen.toLowerCase().includes(query.toLowerCase()) ||
            ruta.destino.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredRutas(filtered);
        setCurrentPage(1);
    };

    const sortRutas = (field) => {
        const sortedRutas = [...filteredRutas].sort((a, b) => {
            const aField = a[field]?.toLowerCase() || '';
            const bField = b[field]?.toLowerCase() || '';
            if (aField < bField) return sortOrder === 'asc' ? -1 : 1;
            if (aField > bField) return sortOrder === 'asc' ? 1 : -1;
            return 0;
        });
        setFilteredRutas(sortedRutas);
        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        setSortField(field);
    };

    const getSortIcon = (field) => {
        if (field !== sortField) return null;
        return sortOrder === 'asc' ? '↑' : '↓';
    };

    const indexOfLastRuta = currentPage * rutasPerPage;
    const indexOfFirstRuta = indexOfLastRuta - rutasPerPage;
    const currentRutas = filteredRutas.slice(indexOfFirstRuta, indexOfLastRuta);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const totalPages = Math.ceil(filteredRutas.length / rutasPerPage);

    const viewRutaDetails = (ruta) => {
        setSelectedRuta(ruta);
        setShowModal(true); // Mostrar el modal
    };

    // Función para descargar en PDF
    const downloadPDF = () => {
        if (!selectedRuta) return;

        const doc = new jsPDF();
        doc.setFontSize(20);
        doc.text("Detalles de la Ruta", 20, 20);
        doc.setFontSize(12);

        const headers = [["Nombre", "Descripción", "Origen", "Destino"]];
        const data = [[selectedRuta.nombre, selectedRuta.descripcion, selectedRuta.origen, selectedRuta.destino]];

        // Usar autoTable para crear la tabla en el PDF
        doc.autoTable({
            head: headers,
            body: data,
            startY: 30,
        });

        doc.save(`ruta_${selectedRuta.id}.pdf`);
    };

    // Función para descargar en Excel
    const downloadExcel = () => {
        if (!selectedRuta) return;

        const worksheet = XLSX.utils.json_to_sheet([selectedRuta]);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Ruta");
        XLSX.writeFile(workbook, `ruta_${selectedRuta.id}.xlsx`);
    };

    // Función para descargar en TXT
    const downloadTXT = () => {
        if (!selectedRuta) return;

        // Crear un texto simple con los datos
        const text = `
Nombre: ${selectedRuta.nombre}
Descripción: ${selectedRuta.descripcion}
Origen: ${selectedRuta.origen}
Ruta: ${selectedRuta.ruta}
`.trim(); // .trim() elimina espacios en blanco adicionales al principio y al final

        const blob = new Blob([text], { type: 'text/plain' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `usuario_${selectedRuta.id}.txt`;
        link.click();
    };

    return (
        <div className="container">
            <div className="row justify-content-center my-4" style={{ marginBottom: '-50px' }}>
                <h2 className="text-center display-6" style={{ color: '#343a40', fontWeight: 'bold', marginTop: '80px'}}>
                    Gestión de Rutas
                </h2>
            </div>

            <div className="row justify-content-center mb-4">
                <div className="col-md-6">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Buscar por nombre, origen o destino..."
                        value={searchTerm}
                        onChange={(e) => handleSearch(e.target.value)}
                    />
                </div>
            </div>

            {loading && <p>Cargando...</p>}
            {error && <p className='text-danger'>{error}</p>}

            <div className="row justify-content-center mb-4">
                <div className="col-md-3 text-center">
                    <Link to="/ruta/create" className="btn btn-primary">
                        <i className="fa-solid fa-plus"></i>
                    </Link>
                </div>
            </div>

            <div className="row">
                <div className="col">
                    <table className="table table-hover">
                        <thead className="table-dark">
                            <tr>
                                <th onClick={() => sortRutas('nombre')} style={{ cursor: 'pointer' }}>
                                    Nombre {getSortIcon('nombre')}
                                </th>
                                <th onClick={() => sortRutas('descripcion')} style={{ cursor: 'pointer' }}>
                                    Descripción {getSortIcon('descripcion')}
                                </th>
                                <th onClick={() => sortRutas('origen')} style={{ cursor: 'pointer' }}>
                                    Origen {getSortIcon('origen')}
                                </th>
                                <th onClick={() => sortRutas('destino')} style={{ cursor: 'pointer' }}>
                                    Destino {getSortIcon('destino')}
                                </th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentRutas.length === 0 ? (
                                <tr>
                                    <td colSpan="5">No hay rutas disponibles</td>
                                </tr>
                            ) : (
                                currentRutas.map(ruta => (
                                    <tr key={ruta.id}>
                                        <td>{ruta.nombre}</td>
                                        <td>{ruta.descripcion}</td>
                                        <td>{ruta.origen}</td>
                                        <td>{ruta.destino}</td>
                                        <td>
                                            <div className="d-flex gap-2" style={{ marginRight: '-200px' }}>
                                                <button onClick={() => viewRutaDetails(ruta)} className='btn btn-info btn-sm'>
                                                    <i className="fa-regular fa-eye"></i>
                                                </button>
                                                <Link to={`/ruta/edit/${ruta.id}`} className='btn btn-warning btn-sm'>
                                                    <i className="fa-regular fa-pen-to-square"></i>
                                                </Link>
                                                <button onClick={() => deleteRuta(ruta.id)} className='btn btn-danger btn-sm'>
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

            <div className="row">
                <div className="col text-center">
                    <nav aria-label="Page navigation example">
                        <ul className="pagination">
                            {[...Array(totalPages)].map((_, index) => (
                                <li className={`page-item ${index + 1 === currentPage ? 'active' : ''}`} key={index}>
                                    <button className="page-link" onClick={() => paginate(index + 1)}>
                                        {index + 1}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </nav>
                </div>
            </div>

            {/* Modal para mostrar detalles de la ruta */}
            <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
                <Modal.Header style={{ backgroundColor: '#17a2b8', color: 'white' }}>
                    <h5 className="modal-title">Detalles de la Ruta</h5>
                </Modal.Header>
                <Modal.Body>
                    {selectedRuta && (
                        <div>
                            <h5 className="mb-3">Información de la Ruta</h5>
                            <table className="table">
                                <tbody>
                                    <tr>
                                        <td><strong>Nombre</strong></td>
                                        <td>{selectedRuta.nombre}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Descripción</strong></td>
                                        <td>{selectedRuta.descripcion}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Origen</strong></td>
                                        <td>{selectedRuta.origen}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Ruta</strong></td>
                                        <td>{selectedRuta.destino}</td>
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
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Cerrar
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default CompShowRuta;


