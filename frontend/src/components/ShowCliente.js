import axios from 'axios';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SearchCliente from './SearchCliente.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { Modal, Button } from 'react-bootstrap'; // Importar Modal y Button de react-bootstrap
import jsPDF from 'jspdf';
import 'jspdf-autotable'; // Importar autotable
import * as XLSX from 'xlsx'; // Importar XLSX para descargar en Excel

const URI = 'http://localhost:8000/api/cliente';

const CompShowCliente = () => {
    const [clientes, setClientes] = useState([]);
    const [filteredClientes, setFilteredClientes] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [clientesPerPage] = useState(5);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sortOrder, setSortOrder] = useState('asc');
    const [sortField, setSortField] = useState('nombre');
    const [selectedCliente, setSelectedCliente] = useState(null); // Para el cliente seleccionado
    const [showModal, setShowModal] = useState(false); // Estado para controlar el modal

    useEffect(() => {
        getClientes();
    }, []);

    const getClientes = async () => {
        setLoading(true);
        try {
            const res = await axios.get(URI);
            setClientes(res.data);
            setFilteredClientes(res.data);
        } catch (error) {
            setError('Error al obtener los datos');
            console.error("Error al obtener los datos:", error);
        } finally {
            setLoading(false);
        }
    };

    const deleteCliente = async (id) => {
        try {
            const isConfirmed = window.confirm('¿Estás seguro de que deseas eliminar este cliente?');
            if (isConfirmed) {
                await axios.delete(`${URI}/${id}`);
                getClientes();
            }
        } catch (error) {
            console.error("Error al eliminar el cliente:", error);
            setError('Error al eliminar el cliente');
        }
    };

    const handleSearch = (query) => {
        const filtered = clientes.filter(cliente =>
            cliente.nombre.toLowerCase().includes(query.toLowerCase()) ||
            cliente.email.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredClientes(filtered);
        setCurrentPage(1);
    };

    const sortClientes = (field) => {
        const sortedClientes = [...filteredClientes].sort((a, b) => {
            const aField = a[field]?.toLowerCase() || '';
            const bField = b[field]?.toLowerCase() || '';
            if (aField < bField) return sortOrder === 'asc' ? -1 : 1;
            if (aField > bField) return sortOrder === 'asc' ? 1 : -1;
            return 0;
        });
        setFilteredClientes(sortedClientes);
        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        setSortField(field);
    };

    const getSortIcon = (field) => {
        if (field !== sortField) return null;
        return sortOrder === 'asc' ? '↑' : '↓';
    };

    const indexOfLastCliente = currentPage * clientesPerPage;
    const indexOfFirstCliente = indexOfLastCliente - clientesPerPage;
    const currentClientes = filteredClientes.slice(indexOfFirstCliente, indexOfLastCliente);
    const totalPages = Math.ceil(filteredClientes.length / clientesPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Función para ver detalles del cliente
    const viewClienteDetails = (cliente) => {
        setSelectedCliente(cliente);
        setShowModal(true); // Cambiar a true para mostrar el modal
        console.log("Cliente seleccionado:", cliente); // Verifica que el cliente sea el correcto
    };

    // Función para descargar en PDF
    const downloadPDF = () => {
        if (!selectedCliente) return;

        const doc = new jsPDF();
        doc.setFontSize(20);
        doc.text("Detalles del Cliente", 20, 20);
        doc.setFontSize(12);

        const headers = [["Nombre", "Email", "Teléfono", "NIT", "Dirección", "Tipo"]];
        const data = [[
            selectedCliente.nombre,
            selectedCliente.email,
            selectedCliente.telefono,
            selectedCliente.nit,
            selectedCliente.direccion,
            selectedCliente.tipoCliente?.descripcion || 'N/A'
        ]];

        // Usar autoTable para crear la tabla en el PDF
        doc.autoTable({
            head: headers,
            body: data,
            startY: 30,
        });

        doc.save(`cliente_${selectedCliente.id}.pdf`);
    };

    // Función para descargar en Excel
    const downloadExcel = () => {
        if (!selectedCliente) return;

        const worksheet = XLSX.utils.json_to_sheet([selectedCliente]);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Cliente");
        XLSX.writeFile(workbook, `cliente_${selectedCliente.id}.xlsx`);
    };

    // Función para descargar en TXT
    const downloadTXT = () => {
        if (!selectedCliente) return;

        // Crear un texto simple con los datos
        const text = `
Nombre: ${selectedCliente.nombre}
Email: ${selectedCliente.email}
Teléfono: ${selectedCliente.telefono}
NIT: ${selectedCliente.nit}
Dirección: ${selectedCliente.direccion}
Tipo: ${selectedCliente.tipoCliente ? selectedCliente.tipoCliente.descripcion : 'N/A'}
`.trim(); // .trim() elimina espacios en blanco adicionales al principio y al final

        const blob = new Blob([text], { type: 'text/plain' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `cliente_${selectedCliente.id}.txt`;
        link.click();
    };

    return (
        <div className="container">
            <div className="row justify-content-center my-4">
                <h2 className="text-center display-6" style={{ color: '#343a40', fontWeight: 'bold', marginTop: '70px' }}>
                    Gestión de Clientes
                </h2>
            </div>
            <div className="row justify-content-between align-items-center mb-4">
                <div className="col-md-6">
                    <SearchCliente clientes={clientes} onSearch={handleSearch} />
                </div>
                <div className="col-md-3 text-end">
                    <Link to="/cliente/create" className="btn btn-primary">
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
                                <th onClick={() => sortClientes('nombre')} style={{ cursor: 'pointer' }}>
                                    Nombre {getSortIcon('nombre')}
                                </th>
                                <th onClick={() => sortClientes('email')} style={{ cursor: 'pointer' }}>
                                    Email {getSortIcon('email')}
                                </th>
                                <th onClick={() => sortClientes('telefono')} style={{ cursor: 'pointer' }}>
                                    Teléfono {getSortIcon('telefono')}
                                </th>
                                <th onClick={() => sortClientes('nit')} style={{ cursor: 'pointer' }}>
                                    NIT {getSortIcon('nit')}
                                </th>
                                <th onClick={() => sortClientes('direccion')} style={{ cursor: 'pointer' }}>
                                    Dirección {getSortIcon('direccion')}
                                </th>
                                <th onClick={() => sortClientes('tipoCliente.descripcion')} style={{ cursor: 'pointer' }}>
                                    Tipo {getSortIcon('tipoCliente.descripcion')}
                                </th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentClientes.length === 0 ? (
                                <tr>
                                    <td colSpan="7">No hay clientes disponibles</td>
                                </tr>
                            ) : (
                                currentClientes.map(cliente => (
                                    <tr key={cliente.id}>
                                        <td>{cliente.nombre}</td>
                                        <td>{cliente.email}</td>
                                        <td>{cliente.telefono}</td>
                                        <td>{cliente.nit}</td>
                                        <td>{cliente.direccion}</td>
                                        <td>{cliente.tipoCliente ? cliente.tipoCliente.descripcion : 'N/A'}</td>
                                        <td>
                                            <div className="d-flex gap-2" style={{marginRight: '-60px'}}>
                                                <button onClick={() => { viewClienteDetails(cliente); }} className='btn btn-info btn-sm'>
                                                    <i className="fa-regular fa-eye"></i>
                                                </button>
                                                <Link to={`/cliente/edit/${cliente.id}`} className='btn btn-warning btn-sm'>
                                                    <i className="fa-regular fa-pen-to-square"></i>
                                                </Link>
                                                <button onClick={() => deleteCliente(cliente.id)} className='btn btn-danger btn-sm'>
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

            {/* Modal para mostrar detalles del cliente */}
            <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
                <Modal.Header style={{ backgroundColor: '#17a2b8', color: 'white' }}>
                    <h5 className="modal-title">Detalles del Cliente</h5>
                </Modal.Header>
                <Modal.Body>
                    {selectedCliente && (
                        <div>
                            <h5 className="mb-3">Información del Cliente</h5>
                            <table className="table">
                                <tbody>
                                    <tr>
                                        <td><strong>Nombre</strong></td>
                                        <td>{selectedCliente.nombre}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Email</strong></td>
                                        <td>{selectedCliente.email}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Teléfono</strong></td>
                                        <td>{selectedCliente.telefono}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>NIT</strong></td>
                                        <td>{selectedCliente.nit}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Dirección</strong></td>
                                        <td>{selectedCliente.direccion}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Tipo</strong></td>
                                        <td>{selectedCliente.tipoCliente ? selectedCliente.tipoCliente.descripcion : 'N/A'}</td>
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

export default CompShowCliente;
