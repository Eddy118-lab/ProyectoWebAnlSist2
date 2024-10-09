import axios from 'axios';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Styles/StyleCliente.css'; // Utilizando el mismo estilo

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
        <div className="container">
            <div className="row">
                <div className="col">
                    <div className="search-create-container">
                        <h2 className='user-management-title'>Gestión de Tipos de Clientes</h2>

                        <div className="search-create-wrapper">
                            <div className="search-container-STC">
                                <input
                                    type="text"
                                    placeholder="Buscar por descripción"
                                    className="form-control"
                                    onChange={(e) => handleSearch(e.target.value)}
                                />
                            </div>
                            <div className="create-btn-container-showTC">
                                <Link to="/cliente/tipo-cliente/create" className="btn btn-primary">
                                    <i className="fa-solid fa-plus"></i>
                                </Link>
                                </div>
                                <div className="create-btn-container-Regresar">
                                <Link to="/cliente/gestion-clientes" className="btn btn-secondary ml-2">
                                    Regresar
                                </Link>
                            </div>
                        </div>
                    </div>

                    {loading && <p>Cargando...</p>}
                    {error && <p className='text-danger'>{error}</p>}

                    <table className='table table-hover'>
                        <thead className='table-primary'>
                            <tr>
                                <th>ID</th>
                                <th>Descripción</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentTipos.length === 0 ? (
                                <tr>
                                    <td colSpan="3">No hay tipos de cliente disponibles</td>
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
