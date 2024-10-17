import axios from 'axios';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const URI_RUTA = 'http://localhost:8000/api/ruta/';

const CompEditRuta = () => {
    const { id } = useParams();  
    const [nombre, setNombre] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [origen, setOrigen] = useState('');
    const [destino, setDestino] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchRuta = async () => {
            try {
                const res = await axios.get(`${URI_RUTA}${id}`);
                const ruta = res.data;
                setNombre(ruta.nombre);
                setDescripcion(ruta.descripcion);
                setOrigen(ruta.origen);
                setDestino(ruta.destino);
            } catch (error) {
                console.error("Error al obtener la ruta:", error);
                setErrorMessage("Error al obtener la ruta.");
            }
        };

        fetchRuta();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const updatedRuta = {
            nombre,
            descripcion,
            origen,
            destino
        };

        try {
            const response = await axios.put(`${URI_RUTA}${id}`, updatedRuta);
            if (response.status === 200) {
                setSuccessMessage("Ruta actualizada con éxito!");
                setErrorMessage('');
                setTimeout(() => {
                    navigate('/ruta/gestion-rutas'); // Ajusta la ruta de navegación según sea necesario
                }, 2000);
            } else {
                setErrorMessage("Error al actualizar la ruta.");
            }
        } catch (error) {
            console.error("Error al enviar datos:", error);
            setErrorMessage("Error al actualizar la ruta.");
        }
    };

    const handleCancel = () => {
        navigate('/ruta/gestion-rutas'); // Ajusta la ruta de navegación según sea necesario
    };

    return (
        <div className='container vh-100 d-flex justify-content-center align-items-center'>
            <div className="card" style={{ width: '100%', maxWidth: '800px' }}>
                <div className="card-header text-center">
                    <h2>Editar Ruta</h2>
                </div>
                <div className="card-body">
                    {successMessage && <div className="alert alert-success">{successMessage}</div>}
                    {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
                    
                    <form onSubmit={handleSubmit} className="row g-3">
                        <div className="col-md-6">
                            <div className="form-group">
                                <label>Nombre</label>
                                <input
                                    type='text'
                                    className='form-control'
                                    value={nombre}
                                    onChange={(e) => setNombre(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Descripción</label>
                                <input
                                    type='text'
                                    className='form-control'
                                    value={descripcion}
                                    onChange={(e) => setDescripcion(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Origen</label>
                                <input
                                    type='text'
                                    className='form-control'
                                    value={origen}
                                    onChange={(e) => setOrigen(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="col-md-6">
                            <div className="form-group">
                                <label>Destino</label>
                                <input
                                    type='text'
                                    className='form-control'
                                    value={destino}
                                    onChange={(e) => setDestino(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="col-12">
                            <button type='submit' className='btn btn-primary me-2'>Actualizar</button>
                            <button type='button' className='btn btn-secondary' onClick={handleCancel}>Cancelar</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CompEditRuta;
