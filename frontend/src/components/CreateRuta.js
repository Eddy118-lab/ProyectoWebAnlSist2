import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'; // Asegúrate de tener Bootstrap importado

const URI_RUTA = 'http://localhost:8000/api/ruta/';

const CompCreateRuta = () => {
    const [nombre, setNombre] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [origen, setOrigen] = useState('');
    const [destino, setDestino] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newRuta = {
            nombre,
            descripcion,
            origen,
            destino,
        };

        try {
            const response = await axios.post(URI_RUTA, newRuta);
            if (response.status === 201) {
                setSuccessMessage("Ruta creada con éxito!");
                setErrorMessage('');
                setTimeout(() => {
                    navigate('/ruta/gestion-rutas'); // Cambia la ruta de navegación según sea necesario
                }, 2000);
            } else {
                setErrorMessage("Error al crear la ruta.");
            }
        } catch (error) {
            console.error("Error al enviar datos:", error);
            setErrorMessage("Error al crear la ruta.");
        }
    };

    const handleCancel = () => {
        navigate('/ruta/gestion-rutas'); // Cambia la ruta de navegación según sea necesario
    };

    return (
        <div className='container vh-100 d-flex justify-content-center align-items-center'>
            <div className="card" style={{ maxWidth: '600px', width: '100%', maxHeight:'100%' }}>
                <div className="card-header text-center">
                    <h2>Crear Ruta</h2>
                </div>
                <div className="card-body">
                    {successMessage && <div className="alert alert-success">{successMessage}</div>}
                    {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
                    
                    <form onSubmit={handleSubmit} className="row g-3">
                        <div className="col-md-12">
                            <div className="form-group">
                                <label>Nombre</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={nombre}
                                    onChange={(e) => setNombre(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        <div className="col-md-12">
                            <div className="form-group">
                                <label>Descripción</label>
                                <textarea
                                    className="form-control"
                                    value={descripcion}
                                    onChange={(e) => setDescripcion(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="form-group">
                                <label>Origen</label>
                                <input
                                    type="text"
                                    className="form-control"
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
                                    type="text"
                                    className="form-control"
                                    value={destino}
                                    onChange={(e) => setDestino(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        <div className="col-12">
                            <div className="d-flex justify-content-center">
                                <button type="submit" className="btn btn-primary me-2">
                                    Guardar
                                </button>
                                <button type="button" className="btn btn-secondary me-2" onClick={handleCancel}>
                                    Cancelar
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CompCreateRuta;
