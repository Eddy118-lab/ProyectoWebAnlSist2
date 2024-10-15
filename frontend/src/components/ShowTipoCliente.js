import axios from 'axios';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const URI_TIPO_CLIENTE = 'http://localhost:8000/api/tipo-cliente';

const CompShowTipoCliente = () => {
    const [tiposCliente, setTiposCliente] = useState([]);
    const [filteredTiposCliente, setFilteredTiposCliente] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [tiposPerPage] = useState(4);
    const [loading, setLoading] = useState(true); 
    const [error, setError] = useState(null); 

    useEffect(() => {
        getTiposCliente();
    }, []);

    const getTiposCliente = async () => {
        setLoading(true);
        try {
            const res = await axios.get(URI_TIPO_CLIENTE);
            setTiposCliente(res.data);
            setFilteredTiposCliente(res.data);
        } catch (error) {
            setError('Error al obtener los tipos de cliente');
            console.error("Error al obtener los datos:", error);
        } finally {
            setLoading(false);
        }
    };

    const deleteTipoCliente = async (id) => {
        try {
            const isConfirmed = window.confirm('¿Estás seguro de que deseas eliminar este tipo de cliente?');
            if (isConfirmed) {
                await axios.delete(`${URI_TIPO_CLIENTE}/${id}`);
                getTiposCliente();
            }
        } catch (error) {
            console.error("Error al eliminar el tipo de cliente:", error);
            setError('Error al eliminar el tipo de cliente');
        }
    };

    const handleSearch = (query) => {
        const filtered = tiposCliente.filter(tipo =>
            tipo.descripcion.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredTiposCliente(filtered);
        setCurrentPage(1);
    };

    const indexOfLastTipo = currentPage * tiposPerPage;
    const indexOfFirstTipo = indexOfLastTipo - tiposPerPage;
    const currentTipos = filteredTiposCliente.slice(indexOfFirstTipo, indexOfLastTipo);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);
    const totalPages = Math.ceil(filteredTiposCliente.length / tiposPerPage);

    return (
        <div className="container mt-5">
            <div className="row">
                <div className="col-lg-12">
                    <div className="mb-4 text-center">
                        <h2 className='text-dark' style={{ marginTop: '60px', color: '#343a40' }}>Gestión de Tipos de Clientes</h2>

                        <div className="d-flex justify-content-center mb-3">
                            <input
                                type="text"
                                placeholder="Buscar por descripción"
                                className="form-control"
                                style={{ maxWidth: '500px' }}
                                onChange={(e) => handleSearch(e.target.value)}
                            />
                        </div>

                        <Link to="/cliente/tipo-cliente/create" className="btn btn-primary mb-3">
                            <i className="fa-solid fa-plus"></i>
                        </Link>
                        <Link to="/cliente/gestion-clientes" className="btn btn-secondary mb-3 ml-2">
                            Regresar
                        </Link>
                    </div>

                    {loading && <p>Cargando...</p>}
                    {error && <p className='text-danger'>{error}</p>}

                    <table className='table table-hover'>
                        <thead className='table-dark'>
                            <tr>
                                <th>ID</th>
                                <th>Descripción</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentTipos.length === 0 ? (
                                <tr>
                                    <td colSpan="3" className="text-center">No hay tipos de cliente disponibles</td>
                                </tr>
                            ) : (
                                currentTipos.map(tipo => (
                                    <tr key={tipo.id}>
                                        <td>{tipo.id}</td>
                                        <td>{tipo.descripcion}</td>
                                        <td>
                                            <Link to={`/cliente/tipo-cliente/edit/${tipo.id}`} className='btn btn-warning btn-sm mr-2'>
                                                <i className="fa-regular fa-pen-to-square"></i>
                                            </Link>
                                            <button onClick={() => deleteTipoCliente(tipo.id)} className='btn btn-danger btn-sm'>
                                                <i className="fa-regular fa-trash-can"></i>
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>

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
                </div>
            </div>
        </div>
    );
};

export default CompShowTipoCliente;
