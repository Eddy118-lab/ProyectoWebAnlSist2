import axios from 'axios';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Styles/StyleUsuario.css';  // Importa el archivo CSS
import SearchUsuario from './SearchUsuarios'; // Importar el nuevo componente
import '@fortawesome/fontawesome-free/css/all.min.css';

const URI = 'http://localhost:8000/api/usuario/';

const CompShowUsuario = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [filteredUsuarios, setFilteredUsuarios] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [usuariosPerPage] = useState(4);
    const [sortOrder, setSortOrder] = useState('asc');
    const [sortField, setSortField] = useState('nombcomp'); // Cambiado a nombcomp

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

    const handleSearch = (query) => {
        const filtered = usuarios.filter(user =>
            user.nombcomp.toLowerCase().includes(query.toLowerCase()) ||  // Cambiado a nombcomp
            user.email.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredUsuarios(filtered);
        setCurrentPage(1);
    };

    const sortUsuarios = (field) => {
        const order = (sortField === field && sortOrder === 'asc') ? 'desc' : 'asc';
        const sortedUsuarios = [...filteredUsuarios].sort((a, b) => {
            if (a[field] < b[field]) return order === 'asc' ? -1 : 1;
            if (a[field] > b[field]) return order === 'asc' ? 1 : -1;
            return 0;
        });
        setFilteredUsuarios(sortedUsuarios);
        setSortField(field);
        setSortOrder(order);
    };

    const indexOfLastUser = currentPage * usuariosPerPage;
    const indexOfFirstUser = indexOfLastUser - usuariosPerPage;
    const currentUsuarios = filteredUsuarios.slice(indexOfFirstUser, indexOfLastUser);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const totalPages = Math.ceil(filteredUsuarios.length / usuariosPerPage);

    const renderSortArrow = (field) => {
        if (sortField === field) {
            return sortOrder === 'asc' ? '↑' : '↓';
        }
        return '';
    };

    return (
        <div className='container'>
            <div className='row'>
                <div className='col'>
                    <div className='search-create-container'>
                        {/* Mensaje de Gestión de Usuario */}
                        <div className='user-management-header'>
                            <h2 className='user-management-title'>Gestión de Usuarios</h2>
                        </div>
                        <div className='search-create-wrapper'>
                            <div className='search-container'>
                                <SearchUsuario usuarios={usuarios} onSearch={handleSearch} />
                            </div>
                            <div className='create-btn-container'>
                                <Link to="/usuario/create" className='btn btn-primary'>
                                    <i className="fa-solid fa-plus"></i>
                                </Link>
                            </div>
                        </div>
                    </div>
                    <table className='table'>
                        <thead className='table-primary'>
                            <tr>
                                <th onClick={() => sortUsuarios('nombcomp')}>Nombre Completo {renderSortArrow('nombcomp')}</th>
                                <th onClick={() => sortUsuarios('nombusuar')}>Nombre Usuario {renderSortArrow('nombusuar')}</th>
                                <th onClick={() => sortUsuarios('email')}>Email {renderSortArrow('email')}</th>
                                <th>Contraseña</th>
                                <th onClick={() => sortUsuarios('fechanaci')}>Fecha Nacimiento {renderSortArrow('fechanaci')}</th>
                                <th>NIT</th>
                                <th>DPI</th>
                                <th>Dirección</th>
                                <th>Teléfono</th>
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
                                    <td>{usuario.dpi}</td>
                                    <td>{usuario.direccion}</td>
                                    <td>{usuario.telefono}</td>
                                    <td className="actions">
                                        <Link to={`/usuario/edit/${usuario.id}`} className="btn btn-warning">
                                            <i className="fa-regular fa-pen-to-square"></i>
                                        </Link>
                                        <button onClick={() => deleteUsuario(usuario.id)} className='btn btn-danger'>
                                            <i className="fa-regular fa-trash-can"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Paginación */}
                    <nav className='pagination-center'>
                        <ul className='pagination'>
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
            </div>
        </div>
    );
};

export default CompShowUsuario;
