import axios from 'axios';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './Styles/StyleShowUsuario.css';
import { Modal, Button } from 'react-bootstrap'; // Importar Modal y Button de react-bootstrap
import jsPDF from 'jspdf';
import 'jspdf-autotable'; // Importar autotable
import * as XLSX from 'xlsx'; // Importar XLSX para descargar en Excel

const URI = 'http://localhost:8000/api/usuario/';

const CompShowUsuario = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [filteredUsuarios, setFilteredUsuarios] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [usuariosPerPage] = useState(5);
    const [sortOrder, setSortOrder] = useState('asc');
    const [sortField, setSortField] = useState('nombcomp');
    const [searchTerm, setSearchTerm] = useState(''); // Inicialización del searchTerm
    const [selectedUsuario, setSelectedUsuario] = useState(null); // Estado para el usuario seleccionado
    const [showModal, setShowModal] = useState(false); // Estado para controlar el modal

    useEffect(() => {
        getUsuarios();
    }, []);

    const getUsuarios = async () => {
        try {
            const res = await axios.get(URI);
            setUsuarios(res.data);
            setFilteredUsuarios(res.data);
        } catch (error) {
            console.error("Error al obtener los datos:", error);
        }
    };

    const deleteUsuario = async (id) => {
        try {
            const isConfirmed = window.confirm('¿Estás seguro de que deseas eliminar este usuario?');
            if (isConfirmed) {
                await axios.delete(`${URI}${id}`);
                getUsuarios();
            }
        } catch (error) {
            console.error("Error al eliminar el usuario:", error);
        }
    };

    const formatDate = (dateString) => {
        const [year, month, day] = dateString.split('-');
        return `${day}/${month}/${year}`;
    };

    const maskPassword = () => {
        return '**********';
    };

    const sortUsuarios = (field) => {
        const order = (sortField === field && sortOrder === 'asc') ? 'desc' : 'asc';
        const sortedUsuarios = [...filteredUsuarios].sort((a, b) => {
            if (field === 'fechanaci') {
                return order === 'asc'
                    ? new Date(a[field]) - new Date(b[field])
                    : new Date(b[field]) - new Date(a[field]);
            } else {
                if (a[field].toString().toLowerCase() < b[field].toString().toLowerCase()) return order === 'asc' ? -1 : 1;
                if (a[field].toString().toLowerCase() > b[field].toString().toLowerCase()) return order === 'asc' ? 1 : -1;
                return 0;
            }
        });
        setFilteredUsuarios(sortedUsuarios);
        setSortField(field);
        setSortOrder(order);
    };

    const renderSortArrow = (field) => {
        if (sortField === field) {
            return <span>{sortOrder === 'asc' ? '↑' : '↓'}</span>;
        }
        return '';
    };

    // Filtrar usuarios basado en el término de búsqueda
    useEffect(() => {
        const filtered = usuarios.filter((usuario) =>
            usuario.nombcomp.toLowerCase().includes(searchTerm.toLowerCase()) ||
            usuario.nombusuar.toLowerCase().includes(searchTerm.toLowerCase()) ||
            usuario.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            usuario.nit.toLowerCase().includes(searchTerm.toLowerCase()) ||
            usuario.telefono.toLowerCase().includes(searchTerm.toLowerCase()) ||
            usuario.direccion.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredUsuarios(filtered);
    }, [searchTerm, usuarios]);

    const indexOfLastUser = currentPage * usuariosPerPage;
    const indexOfFirstUser = indexOfLastUser - usuariosPerPage;
    const currentUsuarios = filteredUsuarios.slice(indexOfFirstUser, indexOfLastUser);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const totalPages = Math.ceil(filteredUsuarios.length / usuariosPerPage);

    // Función para abrir el modal con los detalles del usuario
    const viewUsuarioDetails = (usuario) => {
        setSelectedUsuario(usuario);
        setShowModal(true); // Mostrar el modal
    };

    // Función para descargar en PDF
    const downloadPDF = () => {
        if (!selectedUsuario) return;

        const doc = new jsPDF();
        doc.setFontSize(20);
        doc.text("Detalles del Usuario", 20, 20);
        doc.setFontSize(12);

        const headers = [["Nombre Completo", "Nombre Usuario", "Email", "Fecha Nacimiento", "NIT", "Teléfono", "Dirección"]];
        const data = [[
            selectedUsuario.nombcomp,
            selectedUsuario.nombusuar,
            selectedUsuario.email,
            formatDate(selectedUsuario.fechanaci),
            selectedUsuario.nit,
            selectedUsuario.telefono,
            selectedUsuario.direccion
        ]];

        // Usar autoTable para crear la tabla en el PDF
        doc.autoTable({
            head: headers,
            body: data,
            startY: 30,
        });

        doc.save(`usuario_${selectedUsuario.id}.pdf`);
    };

    // Función para descargar en Excel
    const downloadExcel = () => {
        if (!selectedUsuario) return;

        const worksheet = XLSX.utils.json_to_sheet([selectedUsuario]);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Ruta");
        XLSX.writeFile(workbook, `ruta_${selectedUsuario.id}.xlsx`);
    };

    // Función para descargar en TXT
    const downloadTXT = () => {
        if (!selectedUsuario) return;

        // Crear un texto simple con los datos
        const text = `
Nombre Completo: ${selectedUsuario.nombcomp}
Nombre Usuario: ${selectedUsuario.nombusuar}
Email: ${selectedUsuario.email}
Fecha de Nacimiento: ${formatDate(selectedUsuario.fechanaci)}
NIT: ${selectedUsuario.nit}
Teléfono: ${selectedUsuario.telefono}
Dirección: ${selectedUsuario.direccion}
`.trim(); // .trim() elimina espacios en blanco adicionales al principio y al final

        const blob = new Blob([text], { type: 'text/plain' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `usuario_${selectedUsuario.id}.txt`;
        link.click();
    };

    return (
        <div className='container'>
            <div className='row justify-content-center my-4'>
                <h2 className='text-center display-6' style={{ marginTop: '70px', color: '#343a40', fontWeight: 'bold', paddingBottom: '10px' }}>
                    Gestión de Usuarios
                </h2>
            </div>

            {/* Contenedor del buscador y el botón Crear Usuario */}
            <div className="row justify-content-center mb-4">
                <div className="col-md-6 d-flex justify-content-center">
                    <input
                        type="text"
                        className="form-control me-2"
                        placeholder="Buscar usuario..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)} 
                    />
                    <Link to="/usuario/create" className="btn btn-primary ms-2">
                        <i className="fa-solid fa-plus"></i> 
                    </Link>
                </div>
            </div>

            {/* Contenedor de la tabla */}
            <div className="row">
                <div className="col">
                    <table className='table table-hover'>
                        <thead className='table-dark'>
                            <tr>
                                <th onClick={() => sortUsuarios('nombcomp')}>Nombre Completo {renderSortArrow('nombcomp')}</th>
                                <th onClick={() => sortUsuarios('nombusuar')}>Nombre Usuario {renderSortArrow('nombusuar')}</th>
                                <th onClick={() => sortUsuarios('email')}>Email {renderSortArrow('email')}</th>
                                <th>Contraseña</th>
                                <th onClick={() => sortUsuarios('fechanaci')}>Fecha Nacimiento {renderSortArrow('fechanaci')}</th>
                                <th onClick={() => sortUsuarios('nit')}>NIT {renderSortArrow('nit')}</th>
                                <th onClick={() => sortUsuarios('telefono')}>Teléfono {renderSortArrow('telefono')}</th>
                                <th>Dirección</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentUsuarios.map((usuario) => (
                                <tr key={usuario.id}>
                                    <td>{usuario.nombcomp}</td>
                                    <td>{usuario.nombusuar}</td>
                                    <td>{usuario.email}</td>
                                    <td>{maskPassword()}</td>
                                    <td>{formatDate(usuario.fechanaci)}</td>
                                    <td>{usuario.nit}</td>
                                    <td>{usuario.telefono}</td>
                                    <td>{usuario.direccion}</td>
                                    <td>
                                        <div className="d-flex gap-2">
                                            <button onClick={() => viewUsuarioDetails(usuario)} className='btn btn-info'>
                                                <i className="fa-regular fa-eye"></i>
                                            </button>
                                            <Link to={`/usuario/edit/${usuario.id}`} className="btn btn-warning">
                                                <i className="fa-regular fa-pen-to-square"></i>
                                            </Link>
                                            <button onClick={() => deleteUsuario(usuario.id)} className='btn btn-danger'>
                                                <i className="fa-regular fa-trash-can"></i>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal para ver detalles del usuario */}
            <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
                <Modal.Header style={{ backgroundColor: '#17a2b8', color: 'white' }}>
                    <h5 className="modal-title">Detalles del Usuario</h5>
                </Modal.Header>
                <Modal.Body>
                    {selectedUsuario && (
                        <div>
                            <h5 className="mb-3">Información del Usuario</h5>
                            <table className="table">
                                <tbody>
                                    <tr>
                                        <td><strong>Nombre Completo</strong></td>
                                        <td>{selectedUsuario.nombcomp}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Nombre Usuario</strong></td>
                                        <td>{selectedUsuario.nombusuar}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Email</strong></td>
                                        <td>{selectedUsuario.email}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Fecha de Nacimiento</strong></td>
                                        <td>{formatDate(selectedUsuario.fechanaci)}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>NIT</strong></td>
                                        <td>{selectedUsuario.nit}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Teléfono</strong></td>
                                        <td>{selectedUsuario.telefono}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Dirección</strong></td>
                                        <td>{selectedUsuario.direccion}</td>
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

            {/* Paginación */}
            <nav className='row justify-content-center'>
                <ul className='pagination' style={{ marginBottom: '10px' }}>
                    {[...Array(totalPages)].map((_, index) => (
                        <li key={index + 1} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                            <button onClick={() => paginate(index + 1)} className='page-link'>
                                {index + 1}
                            </button>
                        </li>
                    ))}
                </ul>
            </nav>
        </div>
    );
};

export default CompShowUsuario;
