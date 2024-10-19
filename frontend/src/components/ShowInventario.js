import axios from 'axios';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css'; // Iconos de FontAwesome
import SearchInventario from './SearchInventario.js'; // Componente de búsqueda
import { Modal, Button } from 'react-bootstrap'; // Importar Modal y Button de react-bootstrap
import jsPDF from 'jspdf';
import 'jspdf-autotable'; // Importar autotable
import * as XLSX from 'xlsx'; // Importar XLSX para descargar en Excel

const URI = 'http://localhost:8000/api/inventario';

const CompShowInventario = () => {
    // Estados
    const [inventarios, setInventarios] = useState([]);
    const [filteredInventarios, setFilteredInventarios] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [inventariosPerPage] = useState(8);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sortOrder, setSortOrder] = useState('asc');
    const [sortField, setSortField] = useState('cantidad');
    const [selectedInventario, setSelectedInventario] = useState(null); // Para el inventario seleccionado
    const [showModal, setShowModal] = useState(false); // Estado para controlar el modal

    // Efecto para cargar los inventarios
    useEffect(() => {
        getInventarios();
    }, []);

    // Función para obtener los inventarios desde la API
    const getInventarios = async () => {
        setLoading(true); // Indica que los datos están cargando
        setError(null); // Reinicia el estado de error antes de la solicitud
        try {
            const response = await axios.get(URI);
            setInventarios(response.data); // Almacena los datos en el estado
            setFilteredInventarios(response.data); // Inicializa los inventarios filtrados
        } catch (err) {
            setError('Error al obtener los inventarios');
            console.error('Error al obtener los inventarios:', err);
        } finally {
            setLoading(false); // Finaliza el estado de carga
        }
    };

    // Función para manejar la búsqueda
    const handleSearch = (query) => {
        const filtered = inventarios.filter(inventario =>
            inventario.material?.nombre.toLowerCase().includes(query.toLowerCase()) || // Asumiendo que material tiene un campo nombre
            inventario.precio_unitario.toString().includes(query) ||
            inventario.cantidad.toString().includes(query)
        );
        setFilteredInventarios(filtered);
        setCurrentPage(1);
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A'; // Retorna 'N/A' si dateString es null o undefined
        if (typeof dateString !== 'string') return dateString; // Devuelve el valor original si no es una cadena
    
        const dateParts = dateString.split('-'); // Asegúrate de que dateString sea en formato 'YYYY-MM-DD'
        if (dateParts.length !== 3) return dateString; // Si no se puede dividir correctamente, retorna el valor original
    
        const [year, month, day] = dateParts;
        return `${day}/${month}/${year}`;
    };

    // Función para ordenar los inventarios
    const sortInventarios = (field) => {
        const sortedInventarios = [...filteredInventarios].sort((a, b) => {
            const aField = a[field] || 0; // Default to 0 for numbers
            const bField = b[field] || 0; // Default to 0 for numbers
            if (aField < bField) return sortOrder === 'asc' ? -1 : 1;
            if (aField > bField) return sortOrder === 'asc' ? 1 : -1;
            return 0;
        });
        setFilteredInventarios(sortedInventarios);
        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        setSortField(field);
    };

    const getSortIcon = (field) => {
        if (field !== sortField) return null;
        return sortOrder === 'asc' ? '↑' : '↓';
    };

    // Paginación
    const indexOfLastInventario = currentPage * inventariosPerPage;
    const indexOfFirstInventario = indexOfLastInventario - inventariosPerPage;
    const currentInventarios = filteredInventarios.slice(indexOfFirstInventario, indexOfLastInventario);
    const totalPages = Math.ceil(filteredInventarios.length / inventariosPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Función para ver detalles del inventario
    const viewInventarioDetails = (inventario) => {
        setSelectedInventario(inventario);
        setShowModal(true); // Cambiar a true para mostrar el modal
        console.log("Inventario seleccionado:", inventario); // Verifica que el inventario sea el correcto
    };

    // Función para descargar en PDF
    const downloadPDF = () => {
        if (!selectedInventario) return;

        const doc = new jsPDF();
        doc.setFontSize(20);
        doc.text("Detalles del Inventario", 20, 20);
        doc.setFontSize(12);

        const headers = [["Cantidad", "Precio Unitario", "Fecha Ingreso", "Stock Minimo", "Stock Maximo", "Material"]];
        const data = [[
            selectedInventario.cantidad,
            selectedInventario.precio_unitario,
            selectedInventario.fecha_ingreso,
            selectedInventario.stock_min,
            selectedInventario.stock_max,
            selectedInventario.material?.nombre || 'N/A'
        ]];

        // Usar autoTable para crear la tabla en el PDF
        doc.autoTable({
            head: headers,
            body: data,
            startY: 30,
        });

        doc.save(`inventario_${selectedInventario.id}.pdf`);
    };

    // Función para descargar en Excel
    const downloadExcel = () => {
        if (!selectedInventario) return;

        const worksheet = XLSX.utils.json_to_sheet([selectedInventario]);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Inventario");
        XLSX.writeFile(workbook, `inventario_${selectedInventario.id}.xlsx`);
    };

    // Función para descargar en TXT
    const downloadTXT = () => {
        if (!selectedInventario) return;

        // Crear un texto simple con los datos
        const text = `
Cantidad: ${selectedInventario.cantidad}
Precio Unitario: ${selectedInventario.precio_unitario}
Fecha Ingreso: ${formatDate(selectedInventario.fecha_ingreso)}
Stock Mínimo: ${selectedInventario.stock_min}
Stock Máximo: ${selectedInventario.stock_max}
Material: ${selectedInventario.material?.nombre || 'N/A'}
`.trim(); // .trim() elimina espacios en blanco adicionales al principio y al final

        const blob = new Blob([text], { type: 'text/plain' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `inventario_${selectedInventario.id}.txt`;
        link.click();
    };

    return (
        <div className="container mt-5">
            <div className="row">
                <div className="col-lg-12">
                    <div className="mb-4 text-center">
                        <h2 className='text-center display-6' style={{ marginTop: '70px', color: '#343a40', fontWeight: 'bold', paddingBottom: '10px' }}>
                            Gestión de Inventario
                        </h2>
                    </div>
                    <div className="d-flex justify-content-between mb-4">
                        <div className="search-container" style={{ width: '600px', height: '30px' }}>
                            <SearchInventario onSearch={handleSearch} />
                        </div>
                        <Link to="/inventario/create" className="btn btn-primary" style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <i className="fa-solid fa-plus"></i>
                        </Link>
                    </div>

                    {loading ? (
                        <p>Cargando inventarios...</p>
                    ) : error ? (
                        <p className="text-danger">{error}</p>
                    ) : (
                        <div className="table-container">
                            <table className="table table-hover">
                                <thead className="table-dark">
                                    <tr>
                                        <th onClick={() => sortInventarios('cantidad')} style={{ cursor: 'pointer' }}>
                                            Cantidad {getSortIcon('cantidad')}
                                        </th>
                                        <th onClick={() => sortInventarios('precio_unitario')} style={{ cursor: 'pointer' }}>
                                            Precio Unitario {getSortIcon('precio_unitario')}
                                        </th>
                                        <th onClick={() => sortInventarios('fecha_ingreso')} style={{ cursor: 'pointer' }}>
                                            Fecha Ingreso {getSortIcon('fecha_ingreso')}
                                        </th>
                                        <th onClick={() => sortInventarios('stock_min')} style={{ cursor: 'pointer' }}>
                                            Stock Mínimo {getSortIcon('stock_min')}
                                        </th>
                                        <th onClick={() => sortInventarios('stock_max')} style={{ cursor: 'pointer' }}>
                                            Stock Máximo {getSortIcon('stock_max')}
                                        </th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentInventarios.map((inventario) => (
                                        <tr key={inventario.id}>
                                            <td>{inventario.cantidad}</td>
                                            <td>{inventario.precio_unitario}</td>
                                            <td>{formatDate(inventario.fecha_ingreso)}</td>
                                            <td>{inventario.stock_min}</td>
                                            <td>{inventario.stock_max}</td>
                                            <td>
                                                <button className="btn btn-info" onClick={() => viewInventarioDetails(inventario)}>
                                                    <i className="fa-regular fa-eye"></i> 
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    <nav>
                        <ul className="pagination">
                            {Array.from({ length: totalPages }, (_, index) => (
                                <li key={index + 1} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                                    <button className="page-link" onClick={() => paginate(index + 1)}>
                                        {index + 1}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    {/* Modal para mostrar detalles del inventario */}
                    <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
                        <Modal.Header style={{ backgroundColor: '#17a2b8', color: 'white' }}>
                            <h5 className="modal-title">Detalles del Inventario</h5>
                        </Modal.Header>
                        <Modal.Body>
                            {selectedInventario && (
                                <div>
                                    <h5 className="mb-3">Información del Inventario</h5>
                                    <table className="table">
                                        <tbody>
                                            <tr>
                                                <td><strong>Cantidad</strong></td>
                                                <td>{selectedInventario.cantidad}</td>
                                            </tr>
                                            <tr>
                                                <td><strong>Precio Unitario</strong></td>
                                                <td>{selectedInventario.precio_unitario}</td>
                                            </tr>
                                            <tr>
                                                <td><strong>Fecha Ingreso</strong></td>
                                                <td>{formatDate(selectedInventario.fecha_ingreso)}</td>
                                            </tr>
                                            <tr>
                                                <td><strong>Stock Mínimo</strong></td>
                                                <td>{selectedInventario.stock_min}</td>
                                            </tr>
                                            <tr>
                                                <td><strong>Stock Máximo</strong></td>
                                                <td>{selectedInventario.stock_max}</td>
                                            </tr>
                                            <tr>
                                                <td><strong>Material</strong></td>
                                                <td>{selectedInventario.material ? selectedInventario.material.nombre : 'N/A'}</td>
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
            </div>
        </div>
    );
};

export default CompShowInventario;
