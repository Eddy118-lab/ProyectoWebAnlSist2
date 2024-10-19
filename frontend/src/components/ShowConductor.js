import axios from 'axios';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Modal, Button } from 'react-bootstrap';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

const URI = 'http://localhost:8000/api/conductor';
const URI_IMG = 'http://localhost:8000/uploadsConductor/';

const CompShowConductor = () => {
    const [conductores, setConductores] = useState([]);
    const [filteredConductores, setFilteredConductores] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [conductoresPerPage] = useState(4);
    const [sortOrder, setSortOrder] = useState('asc');
    const [sortField, setSortField] = useState('primer_nom');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedImage, setSelectedImage] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedConductor, setSelectedConductor] = useState(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        getConductores();
    }, []);

    const getConductores = async () => {
        try {
            const res = await axios.get(URI);
            console.log(res.data); // Log para ver la respuesta de la API
            setConductores(res.data);
            setFilteredConductores(res.data);
            setLoading(false);
        } catch (error) {
            setError('Error al obtener los datos de conductores.');
            setLoading(false);
        }
    };

    const deleteConductor = async (id) => {
        try {
            const isConfirmed = window.confirm('¿Estás seguro de que deseas eliminar este conductor?');
            if (isConfirmed) {
                await axios.delete(`${URI}/${id}`);
                getConductores();
            }
        } catch (error) {
            console.error("Error al eliminar el conductor:", error);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A'; // Maneja caso undefined
        const parts = dateString.split('-');
        if (parts.length !== 3) return 'Fecha inválida'; // Validación adicional
        return `${parts[2]}/${parts[1]}/${parts[0]}`;
    };

    const sortConductores = (field) => {
        const order = (sortField === field && sortOrder === 'asc') ? 'desc' : 'asc';
        const sortedConductores = [...filteredConductores].sort((a, b) => {
            if (a[field] < b[field]) return order === 'asc' ? -1 : 1;
            if (a[field] > b[field]) return order === 'asc' ? 1 : -1;
            return 0;
        });
        setFilteredConductores(sortedConductores);
        setSortField(field);
        setSortOrder(order);
    };

    const indexOfLastConductor = currentPage * conductoresPerPage;
    const indexOfFirstConductor = indexOfLastConductor - conductoresPerPage;
    const currentConductores = filteredConductores.slice(indexOfFirstConductor, indexOfLastConductor);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);
    const totalPages = Math.ceil(filteredConductores.length / conductoresPerPage);

    const renderSortIcon = (field) => {
        if (sortField === field) {
            return sortOrder === 'asc' ? '↑' : '↓';
        }
        return '';
    };

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchQuery(value);
        const filtered = conductores.filter(conductor =>
            `${conductor.primer_nom} ${conductor.segundo_nombre} ${conductor.primer_apell} ${conductor.segundo_apell}`
                .toLowerCase().includes(value.toLowerCase()) ||
            conductor.email.toLowerCase().includes(value.toLowerCase()) ||
            conductor.no_licencia.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredConductores(filtered);
        setCurrentPage(1);
    };

    const openModal = (imageUrl) => {
        setSelectedImage(imageUrl);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedImage(null);
    };

    const viewConductorDetails = (conductor) => {
        console.log(conductor); // Log para depurar
        setSelectedConductor(conductor);
        setShowModal(true);
    };

    const downloadPDF = () => {
        if (!selectedConductor) return;

        const doc = new jsPDF();
        doc.setFontSize(20);
        doc.text("Detalles del Conductor", 20, 20);
        doc.setFontSize(12);

        const headers = [["", "", "", "", "", "", ""]];
        const data = [[
            selectedConductor.primer_nom,
            selectedConductor.segundo_nombre,
            selectedConductor.primer_apell,
            selectedConductor.segundo_apell,
            selectedConductor.no_licencia,
            selectedConductor.email,
            selectedConductor.telefono,
            formatDate(selectedConductor.fecha_contratacion),
        ]];

        doc.autoTable({
            head: headers,
            body: data,
            startY: 30,
        });

        doc.save(`conductor_${selectedConductor.id}.pdf`);
    };

    const downloadExcel = () => {
        if (!selectedConductor) return;

        const worksheet = XLSX.utils.json_to_sheet([selectedConductor]);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Ruta");
        XLSX.writeFile(workbook, `ruta_${selectedConductor.id}.xlsx`);
    };

    const downloadTXT = () => {
        if (!selectedConductor) return;

        const text = `Primer Nombre: ${selectedConductor.primer_nom || 'N/A'}
Segundo Nombre: ${selectedConductor.segundo_nombre || 'N/A'}
Primer Apellido: ${selectedConductor.primer_apell || 'N/A'}
Segundo Apellido: ${selectedConductor.segundo_apell || 'N/A'}
No. Licencia: ${selectedConductor.no_licencia || 'N/A'}
Email: ${selectedConductor.email || 'N/A'}
Teléfono: ${selectedConductor.telefono || 'N/A'}
Fecha de Contratación: ${formatDate(selectedConductor.fecha_contratacion || '')}`.trim();

        const blob = new Blob([text], { type: 'text/plain' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `usuario_${selectedConductor.id}.txt`;
        link.click();
    };

    return (
        <div className="container mt-5">
            <div className="row">
                <div className="col-lg-12">
                    <div className="mb-4 text-center">
                        <h2 className='text-center display-6' style={{ marginTop: '70px', color: '#343a40', fontWeight: 'bold', paddingBottom: '10px' }}>
                            Gestión de Conductores
                        </h2>

                        <div className="d-flex justify-content-center mb-3">
                            <input
                                type="text"
                                className="form-control"
                                style={{ maxWidth: '500px' }}
                                placeholder="Buscar por nombre, email o número de licencia..."
                                value={searchQuery}
                                onChange={handleSearchChange}
                            />
                        </div>

                        <Link to="/conductor/create" className="btn btn-primary mb-3">
                            <i className="fa-solid fa-plus"></i>
                        </Link>
                    </div>

                    {loading && <p>Cargando...</p>}
                    {error && <p className="text-danger">{error}</p>}

                    <table className="table table-hover">
                        <thead className="table-dark">
                            <tr>
                                <th onClick={() => sortConductores('primer_nom')} style={{ cursor: 'pointer' }}>
                                    Nombre {renderSortIcon('primer_nom')}
                                </th>
                                <th onClick={() => sortConductores('primer_apell')} style={{ cursor: 'pointer' }}>
                                    Apellido {renderSortIcon('primer_apell')}
                                </th>
                                <th onClick={() => sortConductores('no_licencia')} style={{ cursor: 'pointer' }}>
                                    No. Licencia {renderSortIcon('no_licencia')}
                                </th>
                                <th onClick={() => sortConductores('email')} style={{ cursor: 'pointer' }}>
                                    Email {renderSortIcon('email')}
                                </th>
                                <th>Teléfono</th>
                                <th>Fecha de Contratación</th>
                                <th>Imágenes</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentConductores.length === 0 ? (
                                <tr>
                                    <td colSpan="8">No hay registros de conductores disponibles</td>
                                </tr>
                            ) : (
                                currentConductores.map(conductor => (
                                    <tr key={conductor.id}>
                                        <td>{`${conductor.primer_nom} ${conductor.segundo_nombre}`}</td>
                                        <td>{`${conductor.primer_apell} ${conductor.segundo_apell}`}</td>
                                        <td>{conductor.no_licencia}</td>
                                        <td>{conductor.email}</td>
                                        <td>{conductor.telefono}</td>
                                        <td>{new Date(conductor.fecha_contratacion).toLocaleDateString()}</td>
                                        <td>
                                            <img
                                                src={`${URI_IMG}${conductor.front_imagen_url}`}
                                                alt={`Licencia Frontal de ${conductor.primer_nom}`}
                                                style={{ width: '50px', height: 'auto', cursor: 'pointer', marginRight: '5px' }}
                                                onClick={() => openModal(`${URI_IMG}${conductor.front_imagen_url}`)}
                                            />
                                            <img
                                                src={`${URI_IMG}${conductor.tras_imagen_url}`}
                                                alt={`Licencia Trasera de ${conductor.primer_nom}`}
                                                style={{ width: '50px', height: 'auto', cursor: 'pointer' }}
                                                onClick={() => openModal(`${URI_IMG}${conductor.tras_imagen_url}`)}
                                            />
                                        </td>
                                        <td>
                                            <button onClick={() => viewConductorDetails(conductor)} className="btn btn-info btn-sm">
                                                <i className="fa-regular fa-eye"></i>
                                            </button>
                                            <Link to={`/conductor/edit/${conductor.id}`} className="btn btn-warning btn-sm mr-2">
                                                <i className="fa-regular fa-pen-to-square"></i>
                                            </Link>
                                            <button onClick={() => deleteConductor(conductor.id)} className="btn btn-danger btn-sm">
                                                <i className="fa-regular fa-trash-can"></i>
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>

                    {/* Paginación */}
                    <div className="pagination">
                        {Array.from({ length: totalPages }, (_, index) => (
                            <button
                                key={index + 1}
                                className={`btn ${currentPage === index + 1 ? 'btn-primary' : 'btn-light'}`}
                                onClick={() => paginate(index + 1)}
                            >
                                {index + 1}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Modal de Imagen */}
            <Modal show={isModalOpen} onHide={closeModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Imagen del Conductor</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedImage && <img src={selectedImage} alt="Conductor" style={{ width: '100%' }} />}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={closeModal}>Cerrar</Button>
                </Modal.Footer>
            </Modal>

            {/* Modal de Detalles del Conductor */}
            <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
                <Modal.Header style={{ backgroundColor: '#17a2b8', color: 'white' }}>
                    <Modal.Title>Detalles del Conductor</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedConductor && (
                        <div>
                            <h5 className="mb-3">Información del Usuario</h5>
                            <table className="table">
                                <tbody>
                                    <tr>
                                        <td><strong>Primer Nombre</strong></td>
                                        <td>{selectedConductor?.primer_nom || 'N/A'}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Segundo Nombre</strong></td>
                                        <td>{selectedConductor?.segundo_nombre || 'N/A'}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Primer Apellido</strong></td>
                                        <td>{selectedConductor?.primer_apell || 'N/A'}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Segundo Apellido</strong></td>
                                        <td>{selectedConductor?.segundo_apell || 'N/A'}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>No. Licencia</strong></td>
                                        <td>{selectedConductor?.no_licencia || 'N/A'}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Email</strong></td>
                                        <td>{selectedConductor?.email || 'N/A'}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Teléfono</strong></td>
                                        <td>{selectedConductor?.telefono || 'N/A'}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Fecha de Contratación</strong></td>
                                        <td>{formatDate(selectedConductor?.fecha_contratacion) || 'N/A'}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                <Button variant="primary" onClick={downloadPDF}>
                                Descargar PDF
                            </Button>
                            <Button variant="success" onClick={downloadExcel} className="ms-2">
                                Descargar Excel
                            </Button>
                            <Button variant="info" onClick={downloadTXT} className="ms-2">
                                Descargar TXT
                            </Button>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>Cerrar</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default CompShowConductor;
