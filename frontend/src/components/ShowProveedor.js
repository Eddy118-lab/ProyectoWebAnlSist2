import axios from 'axios';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button } from 'react-bootstrap'; // Importar Modal y Button de react-bootstrap
import jsPDF from 'jspdf';
import 'jspdf-autotable'; // Importar autotable
import * as XLSX from 'xlsx'; // Importar XLSX para descargar en Excel

const URI = 'http://localhost:8000/api/proveedor';

const CompShowProveedor = () => {
    const [proveedores, setProveedores] = useState([]);
    const [filteredProveedores, setFilteredProveedores] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [proveedoresPerPage] = useState(8);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sortOrder, setSortOrder] = useState('asc');
    const [sortField, setSortField] = useState('nombre');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedProveedor, setSelectedProveedor] = useState(null); // Para el proveedor seleccionado
    const [showModal, setShowModal] = useState(false); // Estado para controlar el modal

    useEffect(() => {
        getProveedores();
    }, []);

    const getProveedores = async () => {
        setLoading(true);
        try {
            const res = await axios.get(URI);
            setProveedores(res.data);
            setFilteredProveedores(res.data);
        } catch (error) {
            setError('Error al obtener los datos');
            console.error('Error al obtener los datos:', error);
        } finally {
            setLoading(false);
        }
    };

    const deleteProveedor = async (id) => {
        try {
            const isConfirmed = window.confirm('¿Estás seguro de que deseas eliminar este proveedor?');
            if (isConfirmed) {
                await axios.delete(`${URI}/${id}`);
                getProveedores();
            }
        } catch (error) {
            console.error('Error al eliminar el proveedor:', error);
            setError('Error al eliminar el proveedor');
        }
    };

    const sortProveedores = (field) => {
        const sortedProveedores = [...filteredProveedores].sort((a, b) => {
            const aField = a[field]?.toLowerCase() || '';
            const bField = b[field]?.toLowerCase() || '';
            if (aField < bField) return sortOrder === 'asc' ? -1 : 1;
            if (aField > bField) return sortOrder === 'asc' ? 1 : -1;
            return 0;
        });
        setFilteredProveedores(sortedProveedores);
        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        setSortField(field);
    };

    const getSortIcon = (field) => {
        if (field !== sortField) return null;
        return sortOrder === 'asc' ? '↑' : '↓';
    };

    // Filtrar proveedores basado en el término de búsqueda
    useEffect(() => {
        const filtered = proveedores.filter((proveedor) =>
            proveedor.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
            proveedor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            proveedor.telefono.toLowerCase().includes(searchTerm.toLowerCase()) ||
            proveedor.nit.toLowerCase().includes(searchTerm.toLowerCase()) ||
            proveedor.direccion.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (proveedor.tipoProveedor?.descripcion.toLowerCase() || '').includes(searchTerm.toLowerCase())
        );
        setFilteredProveedores(filtered);
    }, [searchTerm, proveedores]);

    const indexOfLastProveedor = currentPage * proveedoresPerPage;
    const indexOfFirstProveedor = indexOfLastProveedor - proveedoresPerPage;
    const currentProveedores = filteredProveedores.slice(indexOfFirstProveedor, indexOfLastProveedor);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);
    const totalPages = Math.ceil(filteredProveedores.length / proveedoresPerPage);

    // Función para ver detalles del proveedor
    const viewProveedorDetails = (proveedor) => {
        setSelectedProveedor(proveedor);
        setShowModal(true); // Cambiar a true para mostrar el modal
        console.log("Proveedor seleccionado:", proveedor); // Verifica que el proveedor sea el correcto
    };

    // Función para descargar en PDF
    const downloadPDF = () => {
        if (!selectedProveedor) return;

        const doc = new jsPDF();
        doc.setFontSize(20);
        doc.text("Detalles del Proveedor", 20, 20);
        doc.setFontSize(12);

        const headers = [["Nombre", "Email", "Teléfono", "NIT", "Dirección", "Tipo"]];
        const data = [[
            selectedProveedor.nombre,
            selectedProveedor.email,
            selectedProveedor.telefono,
            selectedProveedor.nit,
            selectedProveedor.direccion,
            selectedProveedor.tipoProveedor?.descripcion || 'N/A'
        ]];

        // Usar autoTable para crear la tabla en el PDF
        doc.autoTable({
            head: headers,
            body: data,
            startY: 30,
        });

        doc.save(`proveedor_${selectedProveedor.id}.pdf`);
    };

    // Función para descargar en Excel
    const downloadExcel = () => {
        if (!selectedProveedor) return;

        const worksheet = XLSX.utils.json_to_sheet([selectedProveedor]);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Proveedor");
        XLSX.writeFile(workbook, `proveedor_${selectedProveedor.id}.xlsx`);
    };

    // Función para descargar en TXT
    const downloadTXT = () => {
        if (!selectedProveedor) return;

        // Crear un texto simple con los datos
        const text = `
Nombre: ${selectedProveedor.nombre}
Email: ${selectedProveedor.email}
Teléfono: ${selectedProveedor.telefono}
NIT: ${selectedProveedor.nit}
Dirección: ${selectedProveedor.direccion}
Tipo: ${selectedProveedor.tipoProveedor ? selectedProveedor.tipoProveedor.descripcion : 'N/A'}
`.trim(); // .trim() elimina espacios en blanco adicionales al principio y al final

        const blob = new Blob([text], { type: 'text/plain' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `proveedor_${selectedProveedor.id}.txt`;
        link.click();
    };

    return (
        <div className="container">
            {/* Título */}
            <div className='row justify-content-center my-4'>
                <h2 className='text-center display-6' style={{ marginTop: '70px', color: '#343a40', fontWeight: 'bold', paddingBottom: '10px' }}>
                    Gestión de Proveedores
                </h2>
            </div>

            {/* Buscador y botón de crear en la misma fila */}
            <div className="row justify-content-center mb-4">
                <div className="col-md-6 d-flex justify-content-center">
                    <input
                        type="text"
                        className="form-control me-2"
                        placeholder="Buscar proveedor..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Link to="/proveedor/create" className="btn btn-primary ms-2">
                        <i className="fa-solid fa-plus"></i> 
                    </Link>
                </div>
            </div>

            {loading && <p>Cargando...</p>}
            {error && <p className="text-danger">{error}</p>}

            {/* Tabla de proveedores */}
            <table className="table table-hover">
                <thead className="table-dark">
                    <tr>
                        <th onClick={() => sortProveedores('nombre')} style={{ cursor: 'pointer' }}>
                            Nombre {getSortIcon('nombre')}
                        </th>
                        <th onClick={() => sortProveedores('email')} style={{ cursor: 'pointer' }}>
                            Email {getSortIcon('email')}
                        </th>
                        <th onClick={() => sortProveedores('telefono')} style={{ cursor: 'pointer' }}>
                            Teléfono {getSortIcon('telefono')}
                        </th>
                        <th onClick={() => sortProveedores('nit')} style={{ cursor: 'pointer' }}>
                            NIT {getSortIcon('nit')}
                        </th>
                        <th onClick={() => sortProveedores('direccion')} style={{ cursor: 'pointer' }}>
                            Dirección {getSortIcon('direccion')}
                        </th>
                        <th onClick={() => sortProveedores('tipoProveedor.descripcion')} style={{ cursor: 'pointer' }}>
                            Tipo {getSortIcon('tipoProveedor.descripcion')}
                        </th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {currentProveedores.length === 0 ? (
                        <tr>
                            <td colSpan="7">No hay proveedores disponibles</td>
                        </tr>
                    ) : (
                        currentProveedores.map(proveedor => (
                            <tr key={proveedor.id}>
                                <td>{proveedor.nombre}</td>
                                <td>{proveedor.email}</td>
                                <td>{proveedor.telefono}</td>
                                <td>{proveedor.nit}</td>
                                <td>{proveedor.direccion}</td>
                                <td>{proveedor.tipoProveedor ? proveedor.tipoProveedor.descripcion : 'N/A'}</td>
                                <td>
                                    <div className="d-flex gap-2" style={{marginRight: '-90px'}}>
                                        <button onClick={() => { viewProveedorDetails(proveedor); }} className="btn btn-info btn-sm">
                                            <i className="fa-regular fa-eye"></i>
                                        </button>
                                        <Link to={`/proveedor/edit/${proveedor.id}`} className="btn btn-warning btn-sm">
                                            <i className="fa-regular fa-pen-to-square"></i>
                                        </Link>
                                        <button onClick={() => deleteProveedor(proveedor.id)} className="btn btn-danger btn-sm">
                                            <i className="fa-regular fa-trash-can"></i>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>

            {/* Paginación centrada */}
            <nav className="row justify-content-center">
                <ul className="pagination">
                    {[...Array(totalPages).keys()].map(number => (
                        <li key={number + 1} className={`page-item ${number + 1 === currentPage ? 'active' : ''}`}>
                            <button onClick={() => paginate(number + 1)} className="page-link">
                                {number + 1}
                            </button>
                        </li>
                    ))}
                </ul>
            </nav>

            {/* Modal para mostrar detalles del proveedor */}
            <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
                <Modal.Header style={{ backgroundColor: '#17a2b8', color: 'white' }}>
                    <h5 className="modal-title">Detalles del Proveedor</h5>
                </Modal.Header>
                <Modal.Body>
                    {selectedProveedor && (
                        <div>
                            <h5 className="mb-3">Información del Proveedor</h5>
                            <table className="table">
                                <tbody>
                                    <tr>
                                        <td><strong>Nombre</strong></td>
                                        <td>{selectedProveedor.nombre}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Email</strong></td>
                                        <td>{selectedProveedor.email}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Teléfono</strong></td>
                                        <td>{selectedProveedor.telefono}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>NIT</strong></td>
                                        <td>{selectedProveedor.nit}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Dirección</strong></td>
                                        <td>{selectedProveedor.direccion}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Tipo</strong></td>
                                        <td>{selectedProveedor.tipoProveedor ? selectedProveedor.tipoProveedor.descripcion : 'N/A'}</td>
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

export default CompShowProveedor;
