import axios from 'axios';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

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

    useEffect(() => {
        getConductores();
    }, []);

    const getConductores = async () => {
        try {
            const res = await axios.get(URI);
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

                    <nav>
                        <ul className="pagination">
                            {Array.from({ length: totalPages }, (_, index) => (
                                <li key={index} className={`page-item ${index + 1 === currentPage ? 'active' : ''}`}>
                                    <button className="page-link" onClick={() => paginate(index + 1)}>
                                        {index + 1}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </nav>
                </div>
            </div>

            {isModalOpen && (
                <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1">
                    <div className="modal-dialog modal-dialog-centered modal-lg">
                        <div className="modal-content">
                            <div className="modal-header bg-light">
                                <h5 className="modal-title">Imagen de Licencia</h5>
                                <button type="button" className="btn-close" onClick={closeModal} aria-label="Close"></button>
                            </div>
                            <div className="modal-body p-0">
                                <div className="image-container" style={{ position: 'relative', paddingTop: '56.25%', overflow: 'hidden' }}>
                                    <img 
                                        src={selectedImage} 
                                        alt="Imagen de Licencia" 
                                        style={{
                                            position: 'absolute',
                                            top: '50%',
                                            left: '50%',
                                            transform: 'translate(-50%, -50%)',
                                            maxWidth: '100%',
                                            maxHeight: '100%',
                                            objectFit: 'contain'
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {isModalOpen && <div className="modal-backdrop fade show"></div>}
        </div>
    );
};

export default CompShowConductor;