import axios from 'axios';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SearchUsuario from './SearchUsuarios';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './Styles/StyleShowUsuario.css';

const URI = 'http://localhost:8000/api/usuario/';

const CompShowUsuario = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [filteredUsuarios, setFilteredUsuarios] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [usuariosPerPage] = useState(5);
    const [sortOrder, setSortOrder] = useState('asc');
    const [sortField, setSortField] = useState('nombcomp');

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
            user.nombcomp.toLowerCase().includes(query.toLowerCase()) ||
            user.email.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredUsuarios(filtered);
        setCurrentPage(1);
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

    const indexOfLastUser = currentPage * usuariosPerPage;
    const indexOfFirstUser = indexOfLastUser - usuariosPerPage;
    const currentUsuarios = filteredUsuarios.slice(indexOfFirstUser, indexOfLastUser);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const totalPages = Math.ceil(filteredUsuarios.length / usuariosPerPage);

    return (
        <div className='container'>
            <div className='row justify-content-center my-4'>
                {/* Título modificado */}
                <h2 className='text-center display-6' style={{ marginTop: '70px', color: '#343a40', fontWeight: 'bold', paddingBottom: '10px' }}>
                    Gestión de Usuarios
                </h2>
            </div>

            {/* Contenedor del buscador y el botón Crear Usuario */}
            <div className='row justify-content-between align-items-center mb-4'>
                <div className='col-md-6'>
                    <SearchUsuario usuarios={usuarios} onSearch={handleSearch} />
                </div>
                <div className='col-md-3 text-end'>
                    <Link to="/usuario/create" className='btn btn-primary d-flex justify-content-center align-items-center' style={{ width: '50px', height: '40px' }}>
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
                                        {/* Botones alineados horizontalmente */}
                                        <div className="d-flex gap-2">
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
